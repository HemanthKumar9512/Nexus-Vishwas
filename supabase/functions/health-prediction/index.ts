import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VitalsData {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  spO2: number;
  temperature: number;
  bloodGlucose?: number;
  steps?: number;
  sleep?: { duration: number; quality: string };
  hrv?: number;
  respiratoryRate?: number;
  stressLevel?: number;
}

interface AyurvedicMetrics {
  prakriti: string;
  doshaBalance: { vata: number; pitta: number; kapha: number };
  agniStatus?: string;
}

interface SiddhaMetrics {
  valiAzhal?: number;
  azhalPitham?: number;
  iyamKapham?: number;
  meiKuri?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vitals, ayurvedicMetrics, siddhaMetrics, treatmentModality } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an advanced AI healthcare analyst trained in modern medicine, Ayurveda, and Siddha medicine systems. Analyze health vitals data and provide disease predictions with risk assessments.

Your analysis should:
1. Consider modern medical parameters (heart rate, blood pressure, SpO2, temperature, blood glucose)
2. Incorporate traditional medicine insights when available (Ayurvedic dosha balance, Siddha metrics)
3. Provide risk percentages based on statistical medical research
4. Suggest preventive measures combining all three treatment modalities
5. Consider the patient's current treatment preference: ${treatmentModality || 'integrated'}

IMPORTANT GUIDELINES:
- Be conservative with high-risk predictions unless vitals clearly indicate danger
- Consider normal ranges: HR 60-100bpm, BP 120/80, SpO2 95-100%, Temp 36.1-37.2°C
- Flag critical values: HR <50 or >120, BP >140/90 or <90/60, SpO2 <92%, Temp >38°C
- For Ayurvedic analysis, consider dosha imbalances and their health implications
- For Siddha analysis, consider the three humors and their impact on health

You MUST respond with a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "predictions": [
    {
      "condition": "Disease/Condition Name",
      "riskPercentage": number (0-100),
      "severity": "low" | "medium" | "high" | "critical",
      "timeframe": "timeframe string (e.g., '3-6 months')",
      "treatmentModality": "modern" | "ayurvedic" | "siddha" | "integrated",
      "recommendation": "Detailed prevention/treatment recommendation",
      "confidence": number (0-100),
      "indicators": ["list", "of", "contributing", "factors"]
    }
  ],
  "overallHealthScore": number (0-100),
  "immediateActions": ["list of immediate actions if any"],
  "lifestyleRecommendations": ["list of lifestyle changes"],
  "traditionalRemedies": {
    "ayurvedic": ["list of ayurvedic recommendations"],
    "siddha": ["list of siddha recommendations"]
  }
}`;

    const userPrompt = `Analyze the following health data and provide disease predictions:

VITAL SIGNS:
- Heart Rate: ${vitals.heartRate} BPM
- Blood Pressure: ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} mmHg
- SpO2: ${vitals.spO2}%
- Temperature: ${vitals.temperature}°C
${vitals.bloodGlucose ? `- Blood Glucose: ${vitals.bloodGlucose} mg/dL` : ''}
${vitals.hrv ? `- Heart Rate Variability: ${vitals.hrv} ms` : ''}
${vitals.respiratoryRate ? `- Respiratory Rate: ${vitals.respiratoryRate} breaths/min` : ''}
${vitals.stressLevel ? `- Stress Level: ${vitals.stressLevel}%` : ''}
${vitals.steps ? `- Daily Steps: ${vitals.steps}` : ''}
${vitals.sleep ? `- Sleep: ${vitals.sleep.duration} hours, Quality: ${vitals.sleep.quality}` : ''}

${ayurvedicMetrics ? `
AYURVEDIC ASSESSMENT:
- Prakriti (Constitution): ${ayurvedicMetrics.prakriti}
- Dosha Balance: Vata ${ayurvedicMetrics.doshaBalance.vata}%, Pitta ${ayurvedicMetrics.doshaBalance.pitta}%, Kapha ${ayurvedicMetrics.doshaBalance.kapha}%
${ayurvedicMetrics.agniStatus ? `- Agni Status: ${ayurvedicMetrics.agniStatus}` : ''}
` : ''}

${siddhaMetrics ? `
SIDDHA ASSESSMENT:
- Vali (Vata): ${siddhaMetrics.valiAzhal}%
- Azhal (Pitta): ${siddhaMetrics.azhalPitham}%
- Iyam (Kapha): ${siddhaMetrics.iyamKapham}%
${siddhaMetrics.meiKuri ? `- Mei Kuri: ${siddhaMetrics.meiKuri}` : ''}
` : ''}

Provide comprehensive health predictions considering the patient's preference for ${treatmentModality || 'integrated'} treatment approach.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let predictions;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      predictions = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI predictions");
    }

    return new Response(JSON.stringify(predictions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Health prediction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
