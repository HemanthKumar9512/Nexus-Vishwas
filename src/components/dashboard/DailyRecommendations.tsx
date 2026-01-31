import { motion } from 'framer-motion';
import { Calendar, Coffee, Utensils, Sun, Moon, Pill, Leaf, Sparkles } from 'lucide-react';
import { TreatmentModality } from '@/types/health';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Recommendation {
  time: string;
  icon: React.ElementType;
  activity: string;
  modality: TreatmentModality;
  completed?: boolean;
}

const todayRecommendations: Recommendation[] = [
  { time: 'Morning', icon: Sun, activity: '20-min walk + Trikatu spice tea', modality: 'ayurvedic' },
  { time: 'Breakfast', icon: Coffee, activity: 'Oatmeal with cinnamon & almonds', modality: 'modern' },
  { time: 'Lunch', icon: Utensils, activity: 'Brown rice + bitter gourd curry', modality: 'ayurvedic', completed: true },
  { time: 'Afternoon', icon: Sparkles, activity: '5-min meditation + deep breathing', modality: 'siddha' },
  { time: 'Evening', icon: Leaf, activity: 'Pancreas Varmam massage (108 strokes)', modality: 'siddha' },
  { time: 'Night', icon: Moon, activity: 'Ashwagandha milk before sleep', modality: 'ayurvedic' },
  { time: 'Daily', icon: Pill, activity: 'Metformin 500mg after meals', modality: 'modern', completed: true },
];

const modalityColors: Record<TreatmentModality, string> = {
  modern: 'border-l-modern bg-modern/5',
  ayurvedic: 'border-l-ayurvedic bg-ayurvedic/5',
  siddha: 'border-l-siddha bg-siddha/5',
  integrated: 'border-l-primary bg-primary/5',
};

interface DailyRecommendationsProps {
  modality?: TreatmentModality;
}

export function DailyRecommendations({ modality = 'integrated' }: DailyRecommendationsProps) {
  const filteredRecommendations = modality === 'integrated'
    ? todayRecommendations
    : todayRecommendations.filter(r => r.modality === modality || r.modality === 'modern');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <CardTitle>Today's Health Plan</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">
            {filteredRecommendations.filter(r => r.completed).length}/{filteredRecommendations.length} completed
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredRecommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={rec.time}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border-l-4',
                modalityColors[rec.modality],
                rec.completed && 'opacity-60'
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-lg',
                  rec.completed ? 'bg-success/10' : 'bg-card'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4',
                    rec.completed ? 'text-success' : 'text-muted-foreground'
                  )}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">{rec.time}</p>
                <p className={cn('text-sm', rec.completed && 'line-through')}>{rec.activity}</p>
              </div>
              <input
                type="checkbox"
                checked={rec.completed}
                onChange={() => {}}
                className="w-5 h-5 rounded-full border-2 border-muted checked:bg-success checked:border-success"
              />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
