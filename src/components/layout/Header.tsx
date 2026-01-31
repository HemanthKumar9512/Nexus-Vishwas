import { Bell, Search, AlertTriangle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function Header() {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="relative w-96 hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search hospitals, doctors, symptoms..."
            className="pl-10 bg-secondary/50 border-transparent focus:border-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Emergency Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 pulse-emergency font-semibold"
              onClick={() => navigate('/emergency')}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">SOS</span>
            </Button>
          </motion.div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{profile?.full_name || 'User'}</p>
              <div className="flex items-center gap-1.5 justify-end">
                <Badge variant="outline" className="text-xs py-0 px-1.5 bg-primary/10 text-primary border-primary/20">
                  {profile?.subscription || 'basic'}
                </Badge>
                <span className="text-xs text-muted-foreground">Score: {profile?.health_score || 75}</span>
              </div>
            </div>
            <Avatar className="h-9 w-9 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
