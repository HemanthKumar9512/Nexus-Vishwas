import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HealthPrediction, TreatmentModality } from '@/types/health';
import { useToast } from '@/hooks/use-toast';

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

interface AIHealthResponse {
  predictions: Array<{
    condition: string;
    riskPercentage: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timeframe: string;
    treatmentModality: TreatmentModality;
    recommendation: string;
    confidence: number;
    indicators: string[];
  }>;
  overallHealthScore: number;
  immediateActions: string[];
  lifestyleRecommendations: string[];
  traditionalRemedies: {
    ayurvedic: string[];
    siddha: string[];
  };
}

export function useHealthPredictions() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<HealthPrediction[]>([]);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<{
    immediate: string[];
    lifestyle: string[];
    ayurvedic: string[];
    siddha: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeHealth = useCallback(async (
    vitals: VitalsData,
    treatmentModality: TreatmentModality,
    ayurvedicMetrics?: AyurvedicMetrics,
    siddhaMetrics?: SiddhaMetrics
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('health-prediction', {
        body: {
          vitals,
          ayurvedicMetrics,
          siddhaMetrics,
          treatmentModality,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const response = data as AIHealthResponse;

      // Transform AI response to our HealthPrediction format
      const transformedPredictions: HealthPrediction[] = response.predictions.map(p => ({
        condition: p.condition,
        riskPercentage: p.riskPercentage,
        severity: p.severity,
        timeframe: p.timeframe,
        treatmentModality: p.treatmentModality,
        recommendation: p.recommendation,
      }));

      setPredictions(transformedPredictions);
      setHealthScore(response.overallHealthScore);
      setRecommendations({
        immediate: response.immediateActions || [],
        lifestyle: response.lifestyleRecommendations || [],
        ayurvedic: response.traditionalRemedies?.ayurvedic || [],
        siddha: response.traditionalRemedies?.siddha || [],
      });

      toast({
        title: "Analysis Complete",
        description: `AI has analyzed your health data. Overall score: ${response.overallHealthScore}/100`,
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze health data';
      setError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    predictions,
    healthScore,
    recommendations,
    error,
    analyzeHealth,
  };
}
