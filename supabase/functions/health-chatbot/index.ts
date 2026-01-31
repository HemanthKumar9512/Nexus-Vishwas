import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UserContext {
  name?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  healthScore?: number;
  latestVitals?: {
    heartRate?: number;
    bloodPressure?: { systolic?: number; diastolic?: number };
    spO2?: number;
    temperature?: number;
    steps?: number;
    sleepHours?: number;
    stressLevel?: number;
    glucoseLevel?: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, userContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context about the user
    let userContextString = "";
    if (userContext) {
      const parts = [];
      if (userContext.name) parts.push(`Name: ${userContext.name}`);
      if (userContext.age) parts.push(`Age: ${userContext.age} years`);
      if (userContext.gender) parts.push(`Gender: ${userContext.gender}`);
      if (userContext.bloodGroup) parts.push(`Blood Group: ${userContext.bloodGroup}`);
      if (userContext.healthScore) parts.push(`Health Score: ${userContext.healthScore}/100`);
      
      if (userContext.latestVitals) {
        const v = userContext.latestVitals;
        const vitalParts = [];
        if (v.heartRate) vitalParts.push(`Heart Rate: ${v.heartRate} BPM`);
        if (v.bloodPressure?.systolic && v.bloodPressure?.diastolic) {
          vitalParts.push(`Blood Pressure: ${v.bloodPressure.systolic}/${v.bloodPressure.diastolic} mmHg`);
        }
        if (v.spO2) vitalParts.push(`SpO2: ${v.spO2}%`);
        if (v.temperature) vitalParts.push(`Temperature: ${v.temperature}°C`);
        if (v.steps) vitalParts.push(`Steps Today: ${v.steps}`);
        if (v.sleepHours) vitalParts.push(`Sleep: ${v.sleepHours} hours`);
        if (v.stressLevel) vitalParts.push(`Stress Level: ${v.stressLevel}%`);
        if (v.glucoseLevel) vitalParts.push(`Blood Glucose: ${v.glucoseLevel} mg/dL`);
        
        if (vitalParts.length > 0) {
          parts.push(`\nLatest Vitals:\n${vitalParts.join('\n')}`);
        }
      }
      
      if (parts.length > 0) {
        userContextString = `\n\nUser Health Profile:\n${parts.join('\n')}`;
      }
    }

    const systemPrompt = `You are NEXUS, an advanced AI health assistant that combines modern medicine knowledge with traditional Ayurvedic and Siddha wisdom. You provide personalized, compassionate, and evidence-based health guidance.

Your capabilities:
1. Analyze and explain health vitals and what they mean
2. Provide lifestyle and dietary recommendations
3. Suggest when to seek professional medical help
4. Offer stress management and wellness tips
5. Explain medical terms in simple language
6. Provide integrated health advice combining modern, Ayurvedic, and Siddha approaches

Important guidelines:
- Be empathetic and supportive
- Never diagnose diseases - always recommend consulting healthcare professionals for diagnosis
- Provide actionable, practical advice
- Consider the user's health data when relevant
- Be concise but thorough
- Use emojis sparingly to make responses friendly
- If vital signs are concerning, gently recommend medical attention
${userContextString}

Remember: You're a health advisor, not a doctor. Always encourage users to consult healthcare professionals for medical decisions.`;

    // Build messages array
    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []).map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later.", response: "I'm receiving too many requests right now. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    return new Response(
      JSON.stringify({ response: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
