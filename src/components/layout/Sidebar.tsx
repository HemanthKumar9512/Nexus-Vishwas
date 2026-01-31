import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  LayoutDashboard,
  Watch,
  Brain,
  Building2,
  CalendarDays,
  Users,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Sparkles,
  Pill,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Watch, label: 'Wearables', path: '/wearables' },
  { icon: Pill, label: 'Medicine', path: '/medicine' },
  { icon: Brain, label: 'AI Predictions', path: '/predictions' },
  { icon: Building2, label: 'Hospitals', path: '/hospitals' },
  { icon: CalendarDays, label: 'Appointments', path: '/appointments' },
  { icon: Users, label: 'Health Circles', path: '/circles' },
  { icon: AlertTriangle, label: 'Emergency', path: '/emergency' },
];

const treatmentModes = [
  { icon: Activity, label: 'Modern', color: 'bg-modern' },
  { icon: Leaf, label: 'Ayurvedic', color: 'bg-ayurvedic' },
  { icon: Sparkles, label: 'Siddha', color: 'bg-siddha' },
  { icon: Heart, label: 'Integrated', color: 'bg-primary' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className={cn(
        'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border flex flex-col',
        'transition-shadow duration-300'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shrink-0 glow-primary">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col"
          >
            <span className="font-display font-bold text-lg text-foreground">NEXUS</span>
            <span className="text-xs text-muted-foreground -mt-1">VISHWAS 360°</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scroll-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary-foreground')} />
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </motion.div>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}

        {/* Treatment Modalities Section */}
        {!collapsed && (
          <div className="pt-4 mt-4 border-t border-border">
            <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Treatment Modes</p>
            <div className="grid grid-cols-2 gap-2 px-2">
              {treatmentModes.map((mode) => (
                <button
                  key={mode.label}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium',
                    'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground',
                    'transition-colors duration-200'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full', mode.color)} />
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border space-y-1">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link to="/settings">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Settings className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="font-medium text-sm">Settings</span>}
              </div>
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">Settings</TooltipContent>
          )}
        </Tooltip>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
