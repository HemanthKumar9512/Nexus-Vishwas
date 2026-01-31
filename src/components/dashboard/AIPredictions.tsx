import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Shield, Clock, Stethoscope, Brain, RefreshCw, Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HealthPrediction, TreatmentModality, VitalMetrics, AyurvedicMetrics, SiddhaMetrics } from '@/types/health';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHealthPredictions } from '@/hooks/useHealthPredictions';

interface PredictionCardProps {
  prediction: HealthPrediction;
  index: number;
}

function PredictionCard({ prediction, index }: PredictionCardProps) {
  const severityColors = {
    low: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    critical: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const modalityColors: Record<TreatmentModality, string> = {
    modern: 'bg-modern/10 text-modern',
    ayurvedic: 'bg-ayurvedic/10 text-ayurvedic',
    siddha: 'bg-siddha/10 text-siddha',
    integrated: 'bg-primary/10 text-primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'p-4 rounded-xl border-2',
        severityColors[prediction.severity]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn(
            'w-5 h-5',
            prediction.severity === 'low' ? 'text-success' :
            prediction.severity === 'medium' ? 'text-warning' :
            prediction.severity === 'high' ? 'text-orange-500' : 'text-destructive'
          )} />
          <h4 className="font-semibold">{prediction.condition}</h4>
        </div>
        <Badge className={modalityColors[prediction.treatmentModality]}>
          {prediction.treatmentModality}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-semibold">{prediction.riskPercentage}%</span> risk
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">in {prediction.timeframe}</span>
        </div>
      </div>

      {/* Risk Visualization */}
      <div className="mb-3">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.riskPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            className={cn(
              'h-full rounded-full',
              prediction.severity === 'low' ? 'bg-success' :
              prediction.severity === 'medium' ? 'bg-warning' :
              prediction.severity === 'high' ? 'bg-orange-500' : 'bg-destructive'
            )}
          />
        </div>
      </div>

      <div className="p-3 rounded-lg bg-card">
        <p className="text-xs text-muted-foreground mb-1">AI Recommendation</p>
        <p className="text-sm">{prediction.recommendation}</p>
      </div>

      <Button variant="outline" size="sm" className="w-full mt-3">
        <Stethoscope className="w-4 h-4 mr-2" />
        Schedule Preventive Checkup
      </Button>
    </motion.div>
  );
}

interface AIPredictionsProps {
  predictions?: HealthPrediction[];
  vitals: VitalMetrics;
  ayurvedicMetrics?: AyurvedicMetrics;
  siddhaMetrics?: SiddhaMetrics;
  treatmentModality: TreatmentModality;
}

export function AIPredictions({ 
  predictions: initialPredictions, 
  vitals, 
  ayurvedicMetrics, 
  siddhaMetrics,
  treatmentModality 
}: AIPredictionsProps) {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const { 
    isLoading, 
    predictions: aiPredictions, 
    healthScore,
    recommendations,
    analyzeHealth 
  } = useHealthPredictions();

  const displayPredictions = hasAnalyzed ? aiPredictions : (initialPredictions || []);

  const handleAnalyze = async () => {
    // Transform vitals to the format expected by the API
    const vitalsData = {
      heartRate: vitals.heartRate,
      bloodPressure: vitals.bloodPressure,
      spO2: vitals.spO2,
      temperature: vitals.temperature,
      bloodGlucose: vitals.glucoseLevel,
      steps: vitals.steps,
      hrv: vitals.hrv,
      respiratoryRate: vitals.respiratoryRate,
      stressLevel: vitals.stressLevel,
    };

    // Transform ayurvedic metrics
    const ayurData = ayurvedicMetrics ? {
      prakriti: ayurvedicMetrics.prakriti,
      doshaBalance: {
        vata: ayurvedicMetrics.prakriti.includes('Vata') ? 40 : 30,
        pitta: ayurvedicMetrics.prakriti.includes('Pitta') ? 40 : 30,
        kapha: ayurvedicMetrics.prakriti.includes('Kapha') ? 40 : 30,
      },
      agniStatus: ayurvedicMetrics.agni > 5 ? 'Strong' : 'Weak',
    } : undefined;

    // Transform siddha metrics
    const siddhaData = siddhaMetrics ? {
      valiAzhal: 35,
      azhalPitham: 35,
      iyamKapham: 30,
      meiKuri: siddhaMetrics.nadi,
    } : undefined;

    await analyzeHealth(vitalsData, treatmentModality, ayurData, siddhaData);
    setHasAnalyzed(true);
  };

  return (
    <Card className="relative overflow-hidden">
      {/* AI Glow Effect */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />
      )}
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg hero-gradient">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Health Predictions
                {hasAnalyzed && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Live AI
                  </Badge>
                )}
              </CardTitle>
              {healthScore && (
                <p className="text-sm text-muted-foreground mt-1">
                  Overall Score: <span className="font-semibold text-primary">{healthScore}/100</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5">
              6-12 months advance
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Analyze Button */}
        <Button 
          onClick={handleAnalyze} 
          disabled={isLoading}
          className="w-full hero-gradient text-white"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              {hasAnalyzed ? 'Re-analyze Health Data' : 'Analyze with AI'}
            </>
          )}
        </Button>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Activity className="w-6 h-6 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              </div>
              <div>
                <p className="font-medium">Processing Health Data</p>
                <p className="text-sm text-muted-foreground">
                  AI is analyzing vitals, traditional medicine metrics, and predicting risks...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Predictions */}
        <AnimatePresence mode="wait">
          {displayPredictions.map((prediction, index) => (
            <PredictionCard key={prediction.condition} prediction={prediction} index={index} />
          ))}
        </AnimatePresence>

        {/* Recommendations */}
        {hasAnalyzed && recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 pt-4 border-t border-border"
          >
            {recommendations.immediate.length > 0 && (
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-xs font-medium text-destructive mb-2">Immediate Actions</p>
                <ul className="text-sm space-y-1">
                  {recommendations.immediate.slice(0, 3).map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.lifestyle.length > 0 && (
              <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                <p className="text-xs font-medium text-success mb-2">Lifestyle Recommendations</p>
                <ul className="text-sm space-y-1">
                  {recommendations.lifestyle.slice(0, 3).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(treatmentModality === 'ayurvedic' || treatmentModality === 'integrated') && recommendations.ayurvedic.length > 0 && (
              <div className="p-3 rounded-lg bg-ayurvedic/5 border border-ayurvedic/20">
                <p className="text-xs font-medium text-ayurvedic mb-2">Ayurvedic Remedies</p>
                <ul className="text-sm space-y-1">
                  {recommendations.ayurvedic.slice(0, 3).map((rem, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-ayurvedic">•</span>
                      {rem}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(treatmentModality === 'siddha' || treatmentModality === 'integrated') && recommendations.siddha.length > 0 && (
              <div className="p-3 rounded-lg bg-siddha/5 border border-siddha/20">
                <p className="text-xs font-medium text-siddha mb-2">Siddha Remedies</p>
                <ul className="text-sm space-y-1">
                  {recommendations.siddha.slice(0, 3).map((rem, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-siddha">•</span>
                      {rem}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && displayPredictions.length === 0 && !hasAnalyzed && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Click "Analyze with AI" to get personalized health predictions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
