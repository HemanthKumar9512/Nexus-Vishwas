import { AppLayout } from '@/components/layout/AppLayout';
import { EmergencySOS } from '@/components/emergency/EmergencySOS';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function Emergency() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-display flex items-center justify-center gap-3"
          >
            <AlertTriangle className="w-8 h-8 text-destructive" />
            Emergency Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            One-tap SOS activates emergency protocol: calls 911, finds nearest hospital, alerts family
          </motion.p>
        </div>

        <EmergencySOS />
      </div>
    </AppLayout>
  );
}
