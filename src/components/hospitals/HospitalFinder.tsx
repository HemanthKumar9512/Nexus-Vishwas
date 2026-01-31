import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Star,
  Clock,
  Bed,
  Stethoscope,
  Shield,
  Phone,
  Navigation,
  Calendar,
  Filter,
  Activity,
  Leaf,
  Sparkles,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Hospital, TreatmentModality } from '@/types/health';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface HospitalCardProps {
  hospital: Hospital;
  index: number;
  onBook: (hospital: Hospital) => void;
}

function HospitalCard({ hospital, index, onBook }: HospitalCardProps) {
  const typeColors = {
    modern: 'border-modern/30 bg-modern/5',
    ayurvedic: 'border-ayurvedic/30 bg-ayurvedic/5',
    siddha: 'border-siddha/30 bg-siddha/5',
    integrated: 'border-primary/30 bg-primary/5',
    government: 'border-muted-foreground/30 bg-muted/50',
  };

  const typeIcons = {
    modern: Activity,
    ayurvedic: Leaf,
    siddha: Sparkles,
    integrated: Heart,
    government: Building2,
  };

  const TypeIcon = typeIcons[hospital.type];

  const getBedStatus = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio === 0) return 'text-destructive';
    if (ratio < 0.2) return 'text-warning';
    return 'text-success';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'p-4 rounded-xl border-2 transition-all duration-200',
        typeColors[hospital.type]
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'p-3 rounded-xl shrink-0',
              hospital.type === 'modern' ? 'modern-gradient' :
              hospital.type === 'ayurvedic' ? 'ayurvedic-gradient' :
              hospital.type === 'siddha' ? 'siddha-gradient' :
              hospital.type === 'integrated' ? 'integrated-gradient' :
              'bg-muted-foreground'
            )}
          >
            <TypeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold">{hospital.name}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hospital.distance} km</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>{hospital.address}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="font-semibold">{hospital.rating}</span>
          <span className="text-xs text-muted-foreground">({hospital.reviewCount.toLocaleString()})</span>
        </div>
      </div>

      {/* Bed Availability */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-2 rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-1">
            <Bed className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">ICU Beds</span>
          </div>
          <p className={cn('font-semibold', getBedStatus(hospital.availableBeds.icu.available, hospital.availableBeds.icu.total))}>
            {hospital.availableBeds.icu.available}/{hospital.availableBeds.icu.total} available
          </p>
        </div>
        <div className="p-2 rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-1">
            <Bed className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">General</span>
          </div>
          <p className={cn('font-semibold', getBedStatus(hospital.availableBeds.general.available, hospital.availableBeds.general.total))}>
            {hospital.availableBeds.general.available}/{hospital.availableBeds.general.total} available
          </p>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>Wait: {hospital.waitTime} min</span>
        </div>
        {hospital.insuranceCovered && (
          <div className="flex items-center gap-1.5 text-success">
            <Shield className="w-4 h-4" />
            <span>Insurance</span>
          </div>
        )}
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {hospital.specialties.slice(0, 3).map((specialty) => (
          <Badge key={specialty} variant="secondary" className="text-xs">
            {specialty}
          </Badge>
        ))}
        {hospital.specialties.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{hospital.specialties.length - 3} more
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Phone className="w-4 h-4 mr-1" />
          Call
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Navigation className="w-4 h-4 mr-1" />
          Directions
        </Button>
        <Button size="sm" className="flex-1" onClick={() => onBook(hospital)}>
          <Calendar className="w-4 h-4 mr-1" />
          Book
        </Button>
      </div>
    </motion.div>
  );
}

interface HospitalFinderProps {
  hospitals: Hospital[];
  onBook: (hospital: Hospital) => void;
}

export function HospitalFinder({ hospitals, onBook }: HospitalFinderProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Hospital['type'] | 'all'>('all');

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(search.toLowerCase()) ||
      hospital.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || hospital.type === filter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'All', icon: Building2 },
    { value: 'modern', label: 'Modern', icon: Activity },
    { value: 'ayurvedic', label: 'Ayurvedic', icon: Leaf },
    { value: 'siddha', label: 'Siddha', icon: Sparkles },
    { value: 'government', label: 'Government', icon: Building2 },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search hospitals, specialties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={filter === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(option.value as Hospital['type'] | 'all')}
                    className="shrink-0"
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-primary">{filteredHospitals.length}</p>
          <p className="text-xs text-muted-foreground">Hospitals Found</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-success">
            {filteredHospitals.reduce((sum, h) => sum + h.availableBeds.icu.available, 0)}
          </p>
          <p className="text-xs text-muted-foreground">ICU Beds Available</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-info">
            {filteredHospitals.reduce((sum, h) => sum + h.availableBeds.general.available, 0)}
          </p>
          <p className="text-xs text-muted-foreground">General Beds</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-warning">
            {Math.min(...filteredHospitals.map(h => h.waitTime))} min
          </p>
          <p className="text-xs text-muted-foreground">Shortest Wait</p>
        </div>
      </div>

      {/* Hospital Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredHospitals.map((hospital, index) => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            index={index}
            onBook={onBook}
          />
        ))}
      </div>
    </div>
  );
}
