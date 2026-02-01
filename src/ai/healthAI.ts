import { mockHealthData } from "@/data/mockHealthData";

export type AIModuleResult = {
  module: string;
  riskLevel: "Low" | "Medium" | "High";
  suggestions: string[];
  prediction: string;
};

export function runModernMedicineAI(): AIModuleResult {
  const { heartRate, spo2, systolicBP, temperature } = mockHealthData;

  const suggestions: string[] = [];

  if (heartRate > 90) suggestions.push("Possible tachycardia detected. Reduce physical exertion.");
  if (spo2 < 95) suggestions.push("Low oxygen saturation. Monitor respiratory health.");
  if (systolicBP > 140) suggestions.push("High blood pressure. Consult a physician.");
  if (temperature > 37.5) suggestions.push("Mild fever detected. Stay hydrated.");

  return {
    module: "Modern Medicine",
    riskLevel: suggestions.length > 2 ? "High" : "Medium",
    suggestions,
    prediction:
      "If current vitals persist, risk of hypertension-related complications may increase within weeks.",
  };
}

export function runAyurvedicAI(): AIModuleResult {
  const { stressLevel, sleepHours, temperature } = mockHealthData;

  const suggestions: string[] = [];

  if (stressLevel === "high") suggestions.push("Vata–Pitta imbalance indicated. Practice calming routines.");
  if (sleepHours < 6) suggestions.push("Improve sleep using Abhyanga and early bedtime.");
  if (temperature > 37.5) suggestions.push("Pitta aggravation. Avoid spicy and oily foods.");

  return {
    module: "Ayurvedic Medicine",
    riskLevel: "Medium",
    suggestions,
    prediction:
      "Without lifestyle correction, imbalance may lead to chronic fatigue and digestive issues.",
  };
}

export function runSiddhaAI(): AIModuleResult {
  const { heartRate, stressLevel } = mockHealthData;

  const suggestions: string[] = [];

  if (heartRate > 90) suggestions.push("Excessive Vatham detected. Practice breathing exercises.");
  if (stressLevel === "high") suggestions.push("Mental strain observed. Recommend meditation and herbal decoctions.");

  return {
    module: "Siddha Medicine",
    riskLevel: "Medium",
    suggestions,
    prediction:
      "Continued imbalance may weaken body energy (Uyir Thathukkal) over time.",
  };
}

export function runIntegratedAI(): AIModuleResult {
  const modern = runModernMedicineAI();
  const ayurveda = runAyurvedicAI();
  const siddha = runSiddhaAI();

  return {
    module: "Integrated Medicine",
    riskLevel: "High",
    suggestions: [
      ...modern.suggestions,
      ...ayurveda.suggestions,
      ...siddha.suggestions,
      "Combine medical monitoring with holistic lifestyle correction.",
    ],
    prediction:
      "Integrated intervention now can significantly reduce long-term cardiovascular and stress-related risks.",
  };
}
