import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Brain, Scale, Baby, Leaf, Plus, Check, MessageCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HealthCircle } from '@/types/health';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CircleCardProps {
  circle: HealthCircle;
  index: number;
  onToggleJoin: (id: string) => void;
}

const categoryConfig = {
  diabetes: { icon: Scale, color: 'bg-warning', gradient: 'from-warning to-orange-500' },
  cardiac: { icon: Heart, color: 'bg-destructive', gradient: 'from-destructive to-red-400' },
  weight: { icon: TrendingUp, color: 'bg-success', gradient: 'from-success to-emerald-400' },
  mental: { icon: Brain, color: 'bg-siddha', gradient: 'from-siddha to-purple-400' },
  pregnancy: { icon: Baby, color: 'bg-pink-500', gradient: 'from-pink-500 to-rose-400' },
  wellness: { icon: Leaf, color: 'bg-ayurvedic', gradient: 'from-ayurvedic to-green-400' },
};

function CircleCard({ circle, index, onToggleJoin }: CircleCardProps) {
  const config = categoryConfig[circle.category];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'p-4 rounded-xl border-2 transition-all duration-200',
        circle.isJoined
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-muted-foreground/30'
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={cn('p-3 rounded-xl bg-gradient-to-br', config.gradient)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{circle.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{circle.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{circle.memberCount.toLocaleString()}</span>
          </div>
          <Badge variant="secondary" className="text-xs capitalize">
            {circle.category}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {circle.isJoined && (
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant={circle.isJoined ? 'secondary' : 'default'}
            size="sm"
            onClick={() => onToggleJoin(circle.id)}
          >
            {circle.isJoined ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Joined
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Join
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface HealthCirclesProps {
  circles: HealthCircle[];
  onToggleJoin: (id: string) => void;
}

export function HealthCirclesGrid({ circles, onToggleJoin }: HealthCirclesProps) {
  const joinedCircles = circles.filter(c => c.isJoined);
  const availableCircles = circles.filter(c => !c.isJoined);

  return (
    <div className="space-y-6">
      {/* Joined Circles */}
      {joinedCircles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Your Circles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinedCircles.map((circle, index) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                index={index}
                onToggleJoin={onToggleJoin}
              />
            ))}
          </div>
        </div>
      )}

      {/* Discover Circles */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          Discover Communities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCircles.map((circle, index) => (
            <CircleCard
              key={circle.id}
              circle={circle}
              index={index}
              onToggleJoin={onToggleJoin}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
