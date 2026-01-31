import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, BluetoothSearching, Activity, Heart, Thermometer, Droplets, Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWebBluetooth, VitalReadings } from '@/hooks/useWebBluetooth';
import { cn } from '@/lib/utils';

interface BluetoothScannerProps {
  onVitalsUpdate?: (vitals: VitalReadings) => void;
  onDeviceConnect?: (deviceInfo: { name: string; sensors: string[] }) => void;
}

export function BluetoothScanner({ onVitalsUpdate, onDeviceConnect }: BluetoothScannerProps) {
  const {
    isSupported,
    isScanning,
    connectedDevices,
    latestVitals,
    checkSupport,
    scanAndConnect,
    disconnectDevice,
  } = useWebBluetooth();

  const handleScan = async () => {
    const supported = checkSupport();
    if (!supported) return;

    const device = await scanAndConnect();
    if (device && onDeviceConnect) {
      onDeviceConnect({
        name: device.info.name,
        sensors: device.info.sensors,
      });
    }
    if (device && onVitalsUpdate) {
      onVitalsUpdate(device.vitals);
    }
  };

  // Update vitals when they change
  if (onVitalsUpdate && Object.keys(latestVitals).length > 0) {
    onVitalsUpdate(latestVitals);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg hero-gradient">
              <Bluetooth className="w-4 h-4 text-white" />
            </div>
            Bluetooth Device Scanner
          </CardTitle>
          <Badge variant={isSupported === false ? "destructive" : "outline"}>
            {isSupported === false ? 'Not Supported' : 'Web Bluetooth'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {/* Browser Support Warning */}
        {isSupported === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Browser Not Supported</p>
              <p className="text-sm text-muted-foreground mt-1">
                Web Bluetooth requires Chrome, Edge, or Opera on desktop. 
                Mobile support is limited.
              </p>
            </div>
          </motion.div>
        )}

        {/* Scan Button */}
        <Button
          onClick={handleScan}
          disabled={isScanning || isSupported === false}
          className="w-full h-16 text-lg hero-gradient"
        >
          {isScanning ? (
            <>
              <BluetoothSearching className="w-6 h-6 mr-3 animate-pulse" />
              Scanning for Devices...
            </>
          ) : (
            <>
              <Bluetooth className="w-6 h-6 mr-3" />
              Scan for Wearable Devices
            </>
          )}
        </Button>

        {/* Scanning Animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center py-8"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connected Devices */}
        {connectedDevices.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Wifi className="w-4 h-4 text-success" />
              Connected Devices ({connectedDevices.length})
            </h4>
            
            {connectedDevices.map((device) => (
              <motion.div
                key={device.info.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl border-2 border-success/30 bg-success/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{device.info.name}</p>
                    <p className="text-sm text-muted-foreground">{device.info.brand}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {device.info.sensors.map((sensor) => (
                        <Badge key={sensor} variant="secondary" className="text-xs">
                          {sensor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {device.info.batteryLevel && (
                      <Badge className="bg-success/10 text-success">
                        {device.info.batteryLevel}%
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => disconnectDevice(device.info.id)}
                    >
                      <WifiOff className="w-4 h-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Live Vitals Display */}
        {Object.keys(latestVitals).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Live Readings
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {latestVitals.heartRate && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-destructive" />
                    <span className="text-xs text-muted-foreground">Heart Rate</span>
                  </div>
                  <motion.p
                    key={latestVitals.heartRate}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-destructive"
                  >
                    {latestVitals.heartRate} <span className="text-sm font-normal">BPM</span>
                  </motion.p>
                </motion.div>
              )}

              {latestVitals.temperature && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-lg bg-warning/5 border border-warning/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Thermometer className="w-4 h-4 text-warning" />
                    <span className="text-xs text-muted-foreground">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold text-warning">
                    {latestVitals.temperature.toFixed(1)} <span className="text-sm font-normal">°C</span>
                  </p>
                </motion.div>
              )}

              {latestVitals.bloodPressure && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-lg bg-info/5 border border-info/20 col-span-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-info" />
                    <span className="text-xs text-muted-foreground">Blood Pressure</span>
                  </div>
                  <p className="text-2xl font-bold text-info">
                    {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic} 
                    <span className="text-sm font-normal ml-1">mmHg</span>
                  </p>
                </motion.div>
              )}

              {latestVitals.spO2 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-lg bg-success/5 border border-success/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-4 h-4 text-success" />
                    <span className="text-xs text-muted-foreground">SpO2</span>
                  </div>
                  <p className="text-2xl font-bold text-success">
                    {latestVitals.spO2} <span className="text-sm font-normal">%</span>
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {connectedDevices.length === 0 && !isScanning && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Supported Devices:</strong> Any Bluetooth device with standard health services
              (Heart Rate, Temperature, Blood Pressure, SpO2)
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Make sure your device is in pairing mode and Bluetooth is enabled on your computer
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
