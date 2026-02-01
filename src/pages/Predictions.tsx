import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AIPredictions } from '@/components/dashboard/AIPredictions';
import { mockPredictions, mockVitals, mockAyurvedicMetrics, mockSiddhaMetrics } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Shield, TrendingUp, Activity, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TreatmentModality } from '@/types/health';
import { mockHealthData } from "@/data/mockHealthData";
import {
  runModernMedicineAI,
  runAyurvedicAI,
  runSiddhaAI,
  runIntegratedAI,
} from "@/ai/healthAI";


export default function Predictions() {
  const results = [
  runModernMedicineAI(),
  runAyurvedicAI(),
  runSiddhaAI(),
  runIntegratedAI(),
];

  const [selectedModality, setSelectedModality] = useState<TreatmentModality>('integrated');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-display flex items-center gap-3"
          >
            <Brain className="w-8 h-8 text-primary" />
            AI Health Predictions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Advanced AI analysis predicting health risks 6-12 months in advance
          </motion.p>
        </div>

        {/* How It Works */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Continuous Monitoring</h4>
                <p className="text-xs text-muted-foreground">
                  24/7 data from your wearables and health records
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">AI Analysis</h4>
                <p className="text-xs text-muted-foreground">
                  Trained on 1M+ patient journeys for accuracy
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Early Detection</h4>
                <p className="text-xs text-muted-foreground">
                  Predict conditions 6-12 months before onset
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Personalized Prevention</h4>
                <p className="text-xs text-muted-foreground">
                  Custom recommendations based on your modality
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-success/5 border border-success/20 text-center"
          >
            <p className="text-3xl font-bold text-success">87%</p>
            <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-info/5 border border-info/20 text-center"
          >
            <p className="text-3xl font-bold text-info">1M+</p>
            <p className="text-sm text-muted-foreground">Training Data Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-warning/5 border border-warning/20 text-center"
          >
            <p className="text-3xl font-bold text-warning">50K+</p>
            <p className="text-sm text-muted-foreground">Hospitalizations Prevented</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
          >
            <p className="text-3xl font-bold text-primary">6-12</p>
            <p className="text-sm text-muted-foreground">Months Advance Warning</p>
          </motion.div>
        </div>
        {/* Health Vitals (Sample Data) */}
<div className="space-y-4">
  <motion.h2
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-2xl font-bold"
  >
    Current Health Vitals (Sample Data)
  </motion.h2>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    <div className="p-4 rounded-xl bg-danger/5 border border-danger/20 text-center">
      <p className="text-sm text-muted-foreground">Heart Rate</p>
      <p className="text-2xl font-bold text-danger">
        {mockHealthData.heartRate} bpm
      </p>
    </div>

    <div className="p-4 rounded-xl bg-info/5 border border-info/20 text-center">
      <p className="text-sm text-muted-foreground">SpO₂</p>
      <p className="text-2xl font-bold text-info">
        {mockHealthData.spo2} %
      </p>
    </div>

    <div className="p-4 rounded-xl bg-warning/5 border border-warning/20 text-center">
      <p className="text-sm text-muted-foreground">Blood Pressure</p>
      <p className="text-xl font-bold text-warning">
        {mockHealthData.systolicBP}/{mockHealthData.diastolicBP}
      </p>
    </div>

    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
      <p className="text-sm text-muted-foreground">Temperature</p>
      <p className="text-2xl font-bold text-primary">
        {mockHealthData.temperature} °C
      </p>
    </div>

    <div className="p-4 rounded-xl bg-success/5 border border-success/20 text-center">
      <p className="text-sm text-muted-foreground">Steps Today</p>
      <p className="text-2xl font-bold text-success">
        {mockHealthData.stepsToday}
      </p>
    </div>

    <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 text-center">
      <p className="text-sm text-muted-foreground">Sleep</p>
      <p className="text-2xl font-bold">
        {mockHealthData.sleepHours} hrs
      </p>
    </div>
  </div>
</div>

        {/* AI Module Outputs (Mock Health Data) */}
<div className="space-y-6">
  <motion.h2
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-2xl font-bold"
  >
    AI Module Analysis (Sample Health Data)
  </motion.h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {results.map((res) => (
      <motion.div
        key={res.module}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl border bg-card"
      >
        <h3 className="text-lg font-semibold mb-1">{res.module}</h3>

        <p className="text-sm text-muted-foreground mb-2">
          Risk Level:
          <span className="ml-2 font-semibold text-primary">
            {res.riskLevel}
          </span>
        </p>

        <ul className="list-disc pl-5 text-sm space-y-1">
          {res.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <p className="mt-3 text-sm font-medium text-primary">
          Prediction: {res.prediction}
        </p>
      </motion.div>
    ))}
  </div>
</div>


        {/* Predictions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIPredictions 
            predictions={mockPredictions}
            vitals={mockVitals}
            ayurvedicMetrics={mockAyurvedicMetrics}
            siddhaMetrics={mockSiddhaMetrics}
            treatmentModality={selectedModality}
          />

          {/* AI Models Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Tri-Modal AI Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-modern/20 bg-modern/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-modern" />
                  <h4 className="font-semibold text-modern">Modern Medicine AI</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Evidence-based predictions using Western medical data, lab results, and clinical guidelines.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-ayurvedic/20 bg-ayurvedic/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-ayurvedic" />
                  <h4 className="font-semibold text-ayurvedic">Ayurvedic AI</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dosha analysis, Prakriti assessment, and herbal medicine recommendations based on ancient wisdom.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-siddha/20 bg-siddha/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-siddha" />
                  <h4 className="font-semibold text-siddha">Siddha AI</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Nadi diagnosis patterns, Varmam therapy points, and Tamil traditional medicine protocols.
                </p>
              </div>

              <Button className="w-full mt-4">
                <Brain className="w-4 h-4 mr-2" />
                Run Full Health Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
