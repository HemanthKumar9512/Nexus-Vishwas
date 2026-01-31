import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { HealthCirclesGrid } from '@/components/community/HealthCircles';
import { mockHealthCircles } from '@/data/mockData';
import { HealthCircle } from '@/types/health';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, TrendingUp } from 'lucide-react';

export default function Circles() {
  const [circles, setCircles] = useState<HealthCircle[]>(mockHealthCircles);

  const handleToggleJoin = (id: string) => {
    setCircles(circles.map(c =>
      c.id === id ? { ...c, isJoined: !c.isJoined } : c
    ));
  };

  const joinedCount = circles.filter(c => c.isJoined).length;
  const totalMembers = circles.filter(c => c.isJoined).reduce((sum, c) => sum + c.memberCount, 0);

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
            <Users className="w-8 h-8 text-primary" />
            Health Circles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Join supportive communities for your health journey • Share experiences, get advice, stay motivated
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
          >
            <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{joinedCount}</p>
            <p className="text-sm text-muted-foreground">Circles Joined</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-success/5 border border-success/20 text-center"
          >
            <Users className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalMembers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Community Members</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-info/5 border border-info/20 text-center"
          >
            <MessageCircle className="w-8 h-8 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold">24/7</p>
            <p className="text-sm text-muted-foreground">Peer Support</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-warning/5 border border-warning/20 text-center"
          >
            <TrendingUp className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">40%</p>
            <p className="text-sm text-muted-foreground">Better Outcomes</p>
          </motion.div>
        </div>

        <HealthCirclesGrid circles={circles} onToggleJoin={handleToggleJoin} />
      </div>
    </AppLayout>
  );
}
