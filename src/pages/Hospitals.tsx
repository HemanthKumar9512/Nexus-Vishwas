import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { HospitalFinder } from '@/components/hospitals/HospitalFinder';
import { mockHospitals, mockDoctors } from '@/data/mockData';
import { Hospital } from '@/types/health';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Star, Clock, Calendar, Stethoscope, Activity, Leaf, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Hospitals() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const handleBook = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setBookingDialogOpen(true);
  };

  const relevantDoctors = selectedHospital
    ? mockDoctors.filter(d => d.hospital.toLowerCase().includes(selectedHospital.name.split(' ')[0].toLowerCase()))
    : [];

  const modalityIcons = {
    modern: Activity,
    ayurvedic: Leaf,
    siddha: Sparkles,
    integrated: Building2,
  };

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
            <Building2 className="w-8 h-8 text-primary" />
            Hospital Finder
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Real-time bed availability across 500+ hospitals • Modern, Ayurvedic, Siddha & Integrated care
          </motion.p>
        </div>

        <HospitalFinder hospitals={mockHospitals} onBook={handleBook} />

        {/* Booking Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Book Appointment at {selectedHospital?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedHospital && (
              <div className="space-y-4 mt-4">
                {/* Hospital Info */}
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedHospital.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Wait time: {selectedHospital.waitTime} minutes</span>
                  </div>
                </div>

                {/* Available Doctors */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    Available Doctors
                  </h4>
                  <div className="space-y-3">
                    {(relevantDoctors.length > 0 ? relevantDoctors : mockDoctors.slice(0, 3)).map((doctor) => {
                      const ModalityIcon = modalityIcons[doctor.modality];
                      return (
                        <div
                          key={doctor.id}
                          className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
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
                              <div>
                                <h5 className="font-semibold">{doctor.name}</h5>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Star className="w-3 h-3 text-warning fill-warning" />
                                  <span className="text-xs">{doctor.rating}</span>
                                  <span className="text-xs text-muted-foreground">
                                    • {doctor.experience} years exp.
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{doctor.consultationFee}</p>
                              <Badge variant="outline" className="text-xs capitalize mt-1">
                                {doctor.modality}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {doctor.availableSlots.map((slot) => (
                              <Button
                                key={slot}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  setBookingDialogOpen(false);
                                  // Show success toast
                                }}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
