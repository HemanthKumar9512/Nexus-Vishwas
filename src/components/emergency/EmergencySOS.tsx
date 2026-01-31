import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Phone,
  MapPin,
  Heart,
  Activity,
  Ambulance,
  Users,
  Shield,
  Send,
  Mic,
  MicOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/data/mockData';

export function EmergencySOS() {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [voiceActive, setVoiceActive] = useState(false);

  const handleSOS = () => {
    if (!isActivated) {
      setIsActivated(true);
      let count = 5;
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          // Trigger emergency protocol
        }
      }, 1000);
    } else {
      setIsActivated(false);
      setCountdown(5);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main SOS Button */}
      <Card className={cn(
        'border-2 transition-all duration-300',
        isActivated ? 'border-destructive bg-destructive/5 glow-emergency' : 'border-border'
      )}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSOS}
              className={cn(
                'relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300',
                isActivated
                  ? 'emergency-gradient pulse-emergency'
                  : 'bg-destructive/10 hover:bg-destructive/20 border-4 border-destructive'
              )}
            >
              {isActivated ? (
                <div className="text-center text-white">
                  <p className="text-5xl font-bold">{countdown}</p>
                  <p className="text-sm mt-2">Tap to cancel</p>
                </div>
              ) : (
                <div className="text-center">
                  <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-2" />
                  <p className="text-xl font-bold text-destructive">SOS</p>
                  <p className="text-xs text-muted-foreground mt-1">Hold for emergency</p>
                </div>
              )}
            </motion.button>

            {isActivated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p className="text-lg font-semibold text-destructive">
                  Emergency Protocol Activating...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Calling 911 • Alerting family • Finding nearest hospital
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-xl bg-card border border-border hover:border-destructive/50 transition-colors"
        >
          <Phone className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="font-semibold text-sm">Call 911</p>
          <p className="text-xs text-muted-foreground">Emergency Services</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-xl bg-card border border-border hover:border-warning/50 transition-colors"
        >
          <Ambulance className="w-8 h-8 text-warning mx-auto mb-2" />
          <p className="font-semibold text-sm">Call Ambulance</p>
          <p className="text-xs text-muted-foreground">108 Emergency</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
        >
          <Users className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-semibold text-sm">Alert Family</p>
          <p className="text-xs text-muted-foreground">{mockUser.emergencyContacts.length} contacts</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setVoiceActive(!voiceActive)}
          className={cn(
            'p-4 rounded-xl border transition-colors',
            voiceActive
              ? 'bg-success/10 border-success'
              : 'bg-card border-border hover:border-success/50'
          )}
        >
          {voiceActive ? (
            <Mic className="w-8 h-8 text-success mx-auto mb-2 animate-pulse" />
          ) : (
            <MicOff className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          )}
          <p className="font-semibold text-sm">Voice SOS</p>
          <p className="text-xs text-muted-foreground">
            {voiceActive ? 'Listening...' : 'Say "Emergency"'}
          </p>
        </motion.button>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockUser.emergencyContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                contact.isPrimary ? 'bg-primary/5 border border-primary/20' : 'bg-secondary/50'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  contact.isPrimary ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <span className="font-semibold text-sm">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{contact.phone}</span>
                <Button variant="ghost" size="icon" className="text-success">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Medical Information (Shared in Emergency)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Blood Group</p>
              <p className="font-bold text-lg text-destructive">{mockUser.bloodGroup}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Age</p>
              <p className="font-bold text-lg">{mockUser.age} years</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Gender</p>
              <p className="font-bold text-lg capitalize">{mockUser.gender}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Health Score</p>
              <p className="font-bold text-lg text-primary">{mockUser.healthScore}/100</p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg border border-warning/30 bg-warning/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning">Important Medical Notes</p>
                <p className="text-sm text-muted-foreground mt-1">
                  No known allergies. On daily Ashwagandha supplement. Preferred treatment: Integrated approach.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
