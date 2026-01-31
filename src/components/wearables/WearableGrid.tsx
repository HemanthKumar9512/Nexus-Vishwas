import { motion } from 'framer-motion';
import { Watch, Bluetooth, BluetoothConnected, Battery, Wifi, Check, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface DisplayDevice {
  id: string;
  name: string;
  brand: string;
  type: 'smartwatch' | 'fitness_band' | 'medical_device' | 'phone';
  connected: boolean;
  batteryLevel?: number;
  sensors: string[];
  lastSync?: Date;
  aiCapability: number;
}

interface DeviceCardProps {
  device: DisplayDevice;
  onConnect: (id: string) => void;
  onRemove?: (id: string) => void;
  index: number;
}

function DeviceCard({ device, onConnect, onRemove, index }: DeviceCardProps) {
  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-muted-foreground';
    if (level > 50) return 'text-success';
    if (level > 20) return 'text-warning';
    return 'text-destructive';
  };

  const getDeviceTypeLabel = (type: DisplayDevice['type']) => {
    switch (type) {
      case 'smartwatch': return 'Smartwatch';
      case 'fitness_band': return 'Fitness Band';
      case 'medical_device': return 'Medical Device';
      case 'phone': return 'Smartphone';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'p-4 rounded-xl border-2 transition-all duration-200',
        device.connected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-muted-foreground/30'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'p-3 rounded-xl',
              device.connected ? 'hero-gradient' : 'bg-secondary'
            )}
          >
            <Watch
              className={cn(
                'w-6 h-6',
                device.connected ? 'text-white' : 'text-muted-foreground'
              )}
            />
          </div>
          <div>
            <h4 className="font-semibold">{device.name}</h4>
            <p className="text-xs text-muted-foreground">{device.brand}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {device.connected ? (
            <BluetoothConnected className="w-5 h-5 text-primary animate-pulse" />
          ) : (
            <Bluetooth className="w-5 h-5 text-muted-foreground" />
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(device.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {device.sensors.slice(0, 4).map((sensor) => (
          <Badge key={sensor} variant="secondary" className="text-xs">
            {sensor}
          </Badge>
        ))}
        {device.sensors.length > 4 && (
          <Badge variant="outline" className="text-xs">
            +{device.sensors.length - 4} more
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs">
            {getDeviceTypeLabel(device.type)}
          </Badge>
          <div className="flex items-center gap-1">
            <Battery className={cn('w-4 h-4', getBatteryColor(device.batteryLevel))} />
            <span className="text-xs">{device.batteryLevel}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            AI: {device.aiCapability}%
          </span>
          <Button
            variant={device.connected ? 'secondary' : 'default'}
            size="sm"
            onClick={() => onConnect(device.id)}
          >
            {device.connected ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Connected
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </div>
      </div>

      {/* AI Capability Bar */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">NEXUS Feature Capability</span>
          <span className="font-medium">{device.aiCapability}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${device.aiCapability}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full rounded-full hero-gradient"
          />
        </div>
      </div>
    </motion.div>
  );
}

interface WearableGridProps {
  devices: DisplayDevice[];
  onConnect: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function WearableGrid({ devices, onConnect, onRemove }: WearableGridProps) {
  const connectedDevices = devices.filter(d => d.connected);
  const availableDevices = devices.filter(d => !d.connected);

  return (
    <div className="space-y-6">
      {/* Connected Devices */}
      {connectedDevices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-primary" />
            Connected Devices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedDevices.map((device, index) => (
              <DeviceCard
                key={device.id}
                device={device}
                onConnect={onConnect}
                onRemove={onRemove}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Devices */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Bluetooth className="w-5 h-5 text-muted-foreground" />
          Available Devices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableDevices.map((device, index) => (
            <DeviceCard
              key={device.id}
              device={device}
              onConnect={onConnect}
              onRemove={onRemove}
              index={index}
            />
          ))}

          {/* Add Device Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: availableDevices.length * 0.1 }}
            className="p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-3 transition-colors"
          >
            <div className="p-4 rounded-full bg-secondary">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-muted-foreground">Scan for New Devices</p>
            <p className="text-xs text-muted-foreground">
              Supports 50+ wearable brands
            </p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

interface SensorCapabilitiesProps {
  devices: DisplayDevice[];
}

export function SensorCapabilities({ devices }: SensorCapabilitiesProps) {
  const connectedDevices = devices.filter(d => d.connected);
  const allSensors = new Set(connectedDevices.flatMap(d => d.sensors));
  const totalCapability = connectedDevices.reduce((sum, d) => sum + d.aiCapability, 0) / (connectedDevices.length || 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg hero-gradient">
            <Watch className="w-4 h-4 text-white" />
          </div>
          Sensor Fusion Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="inline-flex flex-col items-center">
            <span className="text-4xl font-bold font-display text-primary">
              {Math.round(totalCapability)}%
            </span>
            <span className="text-sm text-muted-foreground">Total AI Capability</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">Active Sensors</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(allSensors).map((sensor) => (
              <Badge key={sensor} className="bg-primary/10 text-primary">
                {sensor}
              </Badge>
            ))}
          </div>
        </div>

        {connectedDevices.length === 0 && (
          <div className="mt-4 p-4 rounded-lg border border-dashed border-warning/50 bg-warning/5 text-center">
            <p className="text-sm text-warning">No devices connected</p>
            <p className="text-xs text-muted-foreground mt-1">
              Connect a device to enable health monitoring
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
