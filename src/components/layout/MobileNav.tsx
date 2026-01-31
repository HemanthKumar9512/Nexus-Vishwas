import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Watch,
  Brain,
  Building2,
  CalendarDays,
  Users,
  AlertTriangle,
  Pill,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: Watch, label: 'Devices', path: '/wearables' },
  { icon: Pill, label: 'Medicine', path: '/medicine' },
  { icon: Building2, label: 'Hospitals', path: '/hospitals' },
  { icon: AlertTriangle, label: 'SOS', path: '/emergency' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-full transition-colors',
                  isActive && 'bg-primary/10'
                )}>
                  <item.icon className={cn(
                    'w-5 h-5',
                    isActive && 'text-primary'
                  )} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
