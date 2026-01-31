import { motion } from 'framer-motion';
import { Activity, Leaf, Sparkles, Heart, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TreatmentModality, AyurvedicMetrics, SiddhaMetrics } from '@/types/health';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ModalitySelectorProps {
  selectedModality: TreatmentModality;
  onSelect: (modality: TreatmentModality) => void;
}

const modalities = [
  {
    id: 'modern' as TreatmentModality,
    name: 'Modern Medicine',
    icon: Activity,
    color: 'modern',
    gradient: 'modern-gradient',
    description: 'Evidence-based Western medicine with pharmaceuticals & surgery',
    example: 'Diabetes → Metformin + Insulin monitoring',
  },
  {
    id: 'ayurvedic' as TreatmentModality,
    name: 'Ayurvedic Medicine',
    icon: Leaf,
    color: 'ayurvedic',
    gradient: 'ayurvedic-gradient',
    description: 'Ancient Indian healing with herbs, diet, yoga & Panchakarma',
    example: 'Diabetes → Bitter melon + Guduchi + Kapha diet',
  },
  {
    id: 'siddha' as TreatmentModality,
    name: 'Siddha Medicine',
    icon: Sparkles,
    color: 'siddha',
    gradient: 'siddha-gradient',
    description: 'Tamil traditional medicine with Nadi diagnosis & Varmam therapy',
    example: 'Diabetes → Pancreas Varmam massage + herbal formulations',
  },
  {
    id: 'integrated' as TreatmentModality,
    name: 'Integrated Approach',
    icon: Heart,
    color: 'integrated',
    gradient: 'integrated-gradient',
    description: 'Best of all systems combined for optimal results',
    example: 'Diabetes → Metformin + herbs + massage + diet',
    recommended: true,
  },
];

export function ModalitySelector({ selectedModality, onSelect }: ModalitySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {modalities.map((modality, index) => {
        const isSelected = selectedModality === modality.id;
        const Icon = modality.icon;

        return (
          <motion.button
            key={modality.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(modality.id)}
            className={cn(
              'relative text-left p-4 rounded-xl border-2 transition-all duration-300',
              isSelected
                ? `border-${modality.color} bg-${modality.color}/10 shadow-lg`
                : 'border-border bg-card hover:border-muted-foreground/30'
            )}
          >
            {modality.recommended && (
              <span className="absolute -top-2 left-4 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                Recommended
              </span>
            )}

            <div className="flex items-start justify-between mb-3">
              <div
                className={cn(
                  'p-2.5 rounded-lg',
                  isSelected ? modality.gradient : 'bg-secondary'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5',
                    isSelected ? 'text-white' : 'text-muted-foreground'
                  )}
                />
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </div>

            <h4 className={cn('font-semibold mb-1', isSelected && `text-${modality.color}`)}>
              {modality.name}
            </h4>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {modality.description}
            </p>
            <p className="text-xs italic text-muted-foreground/70">
              Ex: {modality.example}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}

interface AyurvedicDashboardProps {
  metrics: AyurvedicMetrics;
}

export function AyurvedicDashboard({ metrics }: AyurvedicDashboardProps) {
  return (
    <Card className="border-ayurvedic/20 bg-ayurvedic/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg ayurvedic-gradient">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-lg text-ayurvedic">Ayurvedic Metrics</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground mb-1">Prakriti</p>
            <p className="font-semibold text-sm">{metrics.prakriti}</p>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground mb-1">Vikriti</p>
            <p className="font-semibold text-sm">{metrics.vikriti}</p>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground mb-1">Agni (Digestive Fire)</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-ayurvedic"
                  style={{ width: `${metrics.agni * 10}%` }}
                />
              </div>
              <span className="text-sm font-medium">{metrics.agni}/10</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-card">
            <p className="text-xs text-muted-foreground mb-1">Ojas (Vitality)</p>
            <p className="font-semibold text-sm">{metrics.ojas}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SiddhaDashboardProps {
  metrics: SiddhaMetrics;
}

export function SiddhaDashboard({ metrics }: SiddhaDashboardProps) {
  return (
    <Card className="border-siddha/20 bg-siddha/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg siddha-gradient">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-lg text-siddha">Siddha Metrics</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 rounded-lg bg-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Nadi (Pulse Diagnosis)</p>
              <p className="font-semibold text-sm">{metrics.nadi}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-siddha">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-3 rounded-lg bg-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Energy Balance</p>
              <p className="font-semibold text-sm">{metrics.energyBalance}</p>
            </div>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                metrics.energyBalance === 'Balanced'
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              )}
            >
              {metrics.energyBalance === 'Balanced' ? '✓' : '!'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Varmam Status</p>
              <p className="font-semibold text-sm">{metrics.varmamStatus}</p>
            </div>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                metrics.varmamStatus === 'Clear'
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              )}
            >
              {metrics.varmamStatus === 'Clear' ? '✓' : '!'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
