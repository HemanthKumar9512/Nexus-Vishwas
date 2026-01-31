import { motion } from 'framer-motion';
import { Heart, Activity, Droplets, Thermometer, Footprints, Moon, Brain, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function HealthScoreRing({ score, size = 'lg', showLabel = true }: HealthScoreRingProps) {
  const sizes = {
    sm: { ring: 80, stroke: 6, text: 'text-xl' },
    md: { ring: 120, stroke: 8, text: 'text-3xl' },
    lg: { ring: 180, stroke: 10, text: 'text-5xl' },
  };

  const config = sizes[size];
  const radius = (config.ring - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return 'stroke-success';
    if (score >= 60) return 'stroke-warning';
    return 'stroke-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex items-center justify-center"
      style={{ width: config.ring, height: config.ring }}
    >
      <svg
        width={config.ring}
        height={config.ring}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          strokeWidth={config.stroke}
          className="stroke-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          className={getScoreColor()}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={cn('font-display font-bold', config.text)}
        >
          {score}
        </motion.span>
        {showLabel && (
          <span className="text-sm text-muted-foreground">Health Score</span>
        )}
      </div>
    </motion.div>
  );
}

interface VitalCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  delay?: number;
}

export function VitalCard({ icon: Icon, label, value, unit, status = 'normal', delay = 0 }: VitalCardProps) {
  const statusColors = {
    normal: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    critical: 'border-destructive/20 bg-destructive/5',
  };

  const iconColors = {
    normal: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'metric-card border-2',
        statusColors[status]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2 rounded-lg bg-card shadow-sm', iconColors[status])}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold font-display">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </motion.div>
  );
}

interface VitalsGridProps {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  spO2: number;
  temperature: number;
  steps: number;
  sleepHours: number;
  stressLevel: number;
  glucoseLevel?: number;
}

export function VitalsGrid({
  heartRate,
  bloodPressure,
  spO2,
  temperature,
  steps,
  sleepHours,
  stressLevel,
  glucoseLevel,
}: VitalsGridProps) {
  const getHeartRateStatus = (hr: number) => {
    if (hr < 60 || hr > 100) return 'warning';
    return 'normal';
  };

  const getBPStatus = (sys: number, dia: number) => {
    if (sys > 140 || dia > 90) return 'critical';
    if (sys > 130 || dia > 85) return 'warning';
    return 'normal';
  };

  const getSpO2Status = (spo2: number) => {
    if (spo2 < 92) return 'critical';
    if (spo2 < 95) return 'warning';
    return 'normal';
  };

  const getStressStatus = (stress: number) => {
    if (stress > 70) return 'critical';
    if (stress > 50) return 'warning';
    return 'normal';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <VitalCard
        icon={Heart}
        label="Heart Rate"
        value={heartRate}
        unit="BPM"
        status={getHeartRateStatus(heartRate)}
        delay={0.1}
      />
      <VitalCard
        icon={Activity}
        label="Blood Pressure"
        value={`${bloodPressure.systolic}/${bloodPressure.diastolic}`}
        unit="mmHg"
        status={getBPStatus(bloodPressure.systolic, bloodPressure.diastolic)}
        delay={0.2}
      />
      <VitalCard
        icon={Droplets}
        label="SpO2"
        value={spO2}
        unit="%"
        status={getSpO2Status(spO2)}
        delay={0.3}
      />
      <VitalCard
        icon={Thermometer}
        label="Temperature"
        value={temperature}
        unit="°C"
        status="normal"
        delay={0.4}
      />
      <VitalCard
        icon={Footprints}
        label="Steps Today"
        value={steps.toLocaleString()}
        status="normal"
        delay={0.5}
      />
      <VitalCard
        icon={Moon}
        label="Sleep"
        value={sleepHours}
        unit="hours"
        status={sleepHours >= 7 ? 'normal' : 'warning'}
        delay={0.6}
      />
      <VitalCard
        icon={Brain}
        label="Stress Level"
        value={stressLevel}
        unit="%"
        status={getStressStatus(stressLevel)}
        delay={0.7}
      />
      {glucoseLevel && (
        <VitalCard
          icon={Gauge}
          label="Glucose"
          value={glucoseLevel}
          unit="mg/dL"
          status={glucoseLevel > 140 ? 'warning' : 'normal'}
          delay={0.8}
        />
      )}
    </div>
  );
}
