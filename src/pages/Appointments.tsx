import { AppLayout } from '@/components/layout/AppLayout';
import { mockDoctors } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, Video, MapPin, Activity, Leaf, Sparkles, Heart, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const upcomingAppointments = [
  {
    id: '1',
    doctor: mockDoctors[0],
    date: 'Today',
    time: '3:30 PM',
    type: 'video' as const,
    status: 'confirmed' as const,
  },
  {
    id: '2',
    doctor: mockDoctors[2],
    date: 'Tomorrow',
    time: '11:00 AM',
    type: 'in-person' as const,
    status: 'pending' as const,
  },
  {
    id: '3',
    doctor: mockDoctors[4],
    date: 'Dec 20',
    time: '9:00 AM',
    type: 'in-person' as const,
    status: 'confirmed' as const,
  },
];

export default function Appointments() {
  const modalityIcons = {
    modern: Activity,
    ayurvedic: Leaf,
    siddha: Sparkles,
    integrated: Heart,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold font-display flex items-center gap-3"
            >
              <Calendar className="w-8 h-8 text-primary" />
              Appointments
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Manage your appointments across all treatment modalities
            </motion.p>
          </div>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
          >
            <p className="text-2xl font-bold text-primary">{upcomingAppointments.length}</p>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-success/5 border border-success/20 text-center"
          >
            <p className="text-2xl font-bold text-success">12</p>
            <p className="text-sm text-muted-foreground">Completed This Month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-info/5 border border-info/20 text-center"
          >
            <p className="text-2xl font-bold text-info">5</p>
            <p className="text-sm text-muted-foreground">Video Consultations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-warning/5 border border-warning/20 text-center"
          >
            <p className="text-2xl font-bold text-warning">₹8,500</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </motion.div>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment, index) => {
              const ModalityIcon = modalityIcons[appointment.doctor.modality];
              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-colors',
                    appointment.status === 'confirmed'
                      ? 'border-success/30 bg-success/5'
                      : 'border-warning/30 bg-warning/5'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
                          appointment.doctor.modality === 'modern' ? 'bg-modern/10 text-modern' :
                          appointment.doctor.modality === 'ayurvedic' ? 'bg-ayurvedic/10 text-ayurvedic' :
                          appointment.doctor.modality === 'siddha' ? 'bg-siddha/10 text-siddha' :
                          'bg-primary/10 text-primary'
                        )}
                      >
                        <ModalityIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{appointment.doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          <Badge variant={appointment.type === 'video' ? 'default' : 'secondary'}>
                            {appointment.type === 'video' ? (
                              <>
                                <Video className="w-3 h-3 mr-1" />
                                Video
                              </>
                            ) : (
                              <>
                                <MapPin className="w-3 h-3 mr-1" />
                                In-Person
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={appointment.status === 'confirmed' ? 'default' : 'outline'}
                        className={appointment.status === 'confirmed' ? 'bg-success' : 'border-warning text-warning'}
                      >
                        {appointment.status === 'confirmed' ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Confirmed
                          </>
                        ) : (
                          'Pending'
                        )}
                      </Badge>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {appointment.type === 'video' && appointment.date === 'Today' && (
                    <div className="mt-4 flex items-center gap-2">
                      <Button className="flex-1">
                        <Video className="w-4 h-4 mr-2" />
                        Join Video Call
                      </Button>
                      <Button variant="outline">Reschedule</Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Available Doctors for Booking */}
        <Card>
          <CardHeader>
            <CardTitle>Book New Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockDoctors.map((doctor, index) => {
                const ModalityIcon = modalityIcons[doctor.modality];
                return (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          doctor.modality === 'modern' ? 'bg-modern/10 text-modern' :
                          doctor.modality === 'ayurvedic' ? 'bg-ayurvedic/10 text-ayurvedic' :
                          doctor.modality === 'siddha' ? 'bg-siddha/10 text-siddha' :
                          'bg-primary/10 text-primary'
                        )}
                      >
                        <ModalityIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold">{doctor.name}</h5>
                        <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span className="text-xs">{doctor.rating}</span>
                        </div>
                      </div>
                      <p className="font-semibold text-sm">₹{doctor.consultationFee}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availableSlots.slice(0, 2).map((slot) => (
                        <Button key={slot} variant="outline" size="sm" className="text-xs">
                          {slot}
                        </Button>
                      ))}
                      {doctor.availableSlots.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doctor.availableSlots.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
