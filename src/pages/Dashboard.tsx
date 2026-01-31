import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { HealthScoreRing, VitalsGrid } from '@/components/dashboard/HealthMetrics';
import { ModalitySelector, AyurvedicDashboard, SiddhaDashboard } from '@/components/dashboard/TreatmentModality';
import { AIPredictions } from '@/components/dashboard/AIPredictions';
import { DailyRecommendations } from '@/components/dashboard/DailyRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TreatmentModality } from '@/types/health';
import { useProfile } from '@/hooks/useProfile';
import { useHealthVitals } from '@/hooks/useHealthVitals';
import { useConnectedDevices } from '@/hooks/useConnectedDevices';
import { mockAyurvedicMetrics, mockSiddhaMetrics } from '@/data/mockData';
import { Watch, Wifi, ChevronRight, Sparkles, Activity, Clock, Zap, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [selectedModality, setSelectedModality] = useState<TreatmentModality>('integrated');
  
  const { profile, loading: profileLoading } = useProfile();
  const { latestVitals, loading: vitalsLoading } = useHealthVitals();
  const { devices, loading: devicesLoading } = useConnectedDevices();

  const connectedDevices = devices.filter(d => d.is_connected);
  const isLoading = profileLoading || vitalsLoading || devicesLoading;

  // Transform latestVitals to the format expected by components
  const vitalsData = latestVitals ? {
    heartRate: latestVitals.heart_rate || 0,
    bloodPressure: {
      systolic: latestVitals.blood_pressure_systolic || 0,
      diastolic: latestVitals.blood_pressure_diastolic || 0,
    },
    spO2: Number(latestVitals.spo2) || 0,
    temperature: Number(latestVitals.temperature) || 0,
    steps: latestVitals.steps || 0,
    sleepHours: Number(latestVitals.sleep_hours) || 0,
    stressLevel: latestVitals.stress_level || 0,
    glucoseLevel: latestVitals.glucose_level ? Number(latestVitals.glucose_level) : undefined,
    respiratoryRate: latestVitals.respiratory_rate || undefined,
  } : null;

  const lastSyncTime = latestVitals?.recorded_at 
    ? new Date(latestVitals.recorded_at).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold font-display"
            >
              {profileLoading ? (
                <Skeleton className="h-9 w-64" />
              ) : (
                <>Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}! 👋</>
              )}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Here's your personalized health overview for today
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              connectedDevices.length > 0 
                ? 'bg-success/10 border-success/20' 
                : 'bg-secondary/50 border-border'
            }`}>
              {connectedDevices.length > 0 ? (
                <Wifi className="w-4 h-4 text-success" />
              ) : (
                <WifiOff className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm">
                {connectedDevices.length} device{connectedDevices.length !== 1 ? 's' : ''} connected
              </span>
            </div>
            {lastSyncTime && (
              <Badge className="bg-primary/10 text-primary">
                <Clock className="w-3 h-3 mr-1" />
                Last sync: {lastSyncTime}
              </Badge>
            )}
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Health Score & Vitals */}
          <div className="xl:col-span-2 space-y-6">
            {/* Health Score & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 flex flex-col items-center justify-center py-6">
                {profileLoading ? (
                  <Skeleton className="w-32 h-32 rounded-full" />
                ) : (
                  <>
                    <HealthScoreRing score={profile?.health_score || 75} />
                    <div className="flex items-center gap-2 mt-4">
                      <Zap className="w-4 h-4 text-warning" />
                      <span className="text-sm text-muted-foreground">Your health score</span>
                    </div>
                  </>
                )}
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-primary" />
                    Live Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vitalsLoading ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-20" />
                      ))}
                    </div>
                  ) : vitalsData && vitalsData.heartRate > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                        <p className="text-xs text-muted-foreground">Heart Rate</p>
                        <p className="text-2xl font-bold text-success">{vitalsData.heartRate} <span className="text-sm font-normal">BPM</span></p>
                      </div>
                      <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                        <p className="text-xs text-muted-foreground">Blood Pressure</p>
                        <p className="text-2xl font-bold text-success">{vitalsData.bloodPressure.systolic}/{vitalsData.bloodPressure.diastolic}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                        <p className="text-xs text-muted-foreground">SpO2</p>
                        <p className="text-2xl font-bold text-success">{vitalsData.spO2}<span className="text-sm font-normal">%</span></p>
                      </div>
                      <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                        <p className="text-xs text-muted-foreground">Temperature</p>
                        <p className="text-2xl font-bold text-success">{vitalsData.temperature}<span className="text-sm font-normal">°C</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No vitals data yet</p>
                      <Link to="/wearables">
                        <Button variant="outline" size="sm">
                          Connect a Device
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* All Vitals Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Watch className="w-5 h-5 text-primary" />
                    Complete Health Metrics
                  </span>
                  <Button variant="ghost" size="sm">
                    View History <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vitalsData ? (
                  <VitalsGrid {...vitalsData} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Connect a wearable device to see your health metrics
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Treatment Modality Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Choose Your Treatment Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ModalitySelector
                  selectedModality={selectedModality}
                  onSelect={setSelectedModality}
                />
              </CardContent>
            </Card>

            {/* Traditional Medicine Metrics */}
            {(selectedModality === 'ayurvedic' || selectedModality === 'siddha' || selectedModality === 'integrated') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(selectedModality === 'ayurvedic' || selectedModality === 'integrated') && (
                  <AyurvedicDashboard metrics={mockAyurvedicMetrics} />
                )}
                {(selectedModality === 'siddha' || selectedModality === 'integrated') && (
                  <SiddhaDashboard metrics={mockSiddhaMetrics} />
                )}
              </div>
            )}
          </div>

          {/* Right Column - Predictions & Recommendations */}
          <div className="space-y-6">
            <AIPredictions 
              vitals={vitalsData || undefined}
              ayurvedicMetrics={mockAyurvedicMetrics}
              siddhaMetrics={mockSiddhaMetrics}
              treatmentModality={selectedModality}
            />
            <DailyRecommendations modality={selectedModality} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
