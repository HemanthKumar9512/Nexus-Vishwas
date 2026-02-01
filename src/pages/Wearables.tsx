import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WearableGrid, SensorCapabilities } from '@/components/wearables/WearableGrid';
import { BluetoothScanner } from '@/components/wearables/BluetoothScanner';
import { useConnectedDevices } from '@/hooks/useConnectedDevices';
import { useHealthVitals } from '@/hooks/useHealthVitals';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Watch, Smartphone, Cpu, Zap, Bluetooth, Activity, Loader2 } from 'lucide-react';
import { VitalReadings } from '@/hooks/useWebBluetooth';

type WearablesProps = {
  onConnectWatch: () => void;
};


export default function Wearables({ onConnectWatch }: WearablesProps) {
  const { devices, loading, addDevice, toggleConnection, removeDevice } = useConnectedDevices();
  const { addVitals } = useHealthVitals();
  const [liveVitals, setLiveVitals] = useState<VitalReadings>({});

  useEffect(() => {
  const hash = window.location.hash;

  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      console.log("✅ Google Fit Access Token:", accessToken);

      localStorage.setItem("google_fit_token", accessToken);

      // Remove token from URL for safety
      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );
    }
  }
}, []);


  const handleConnect = async (id: string) => {
    const device = devices.find(d => d.id === id);
    if (device) {
      await toggleConnection(id, !device.is_connected);
    }
  };

  const handleBluetoothDeviceConnect = async (deviceInfo: { name: string; sensors: string[] }) => {
    // Add the newly connected Bluetooth device to the database
    await addDevice({
      device_name: deviceInfo.name,
      device_brand: 'Bluetooth Device',
      device_type: 'smartwatch',
      is_connected: true,
      battery_level: 100,
      sensors: deviceInfo.sensors,
      ai_capability: 85,
    });
  };

  const handleVitalsUpdate = async (vitals: VitalReadings) => {
    setLiveVitals(vitals);
    
    // Save vitals to database
    if (vitals.heartRate || vitals.temperature || vitals.spO2 || vitals.bloodPressure) {
      await addVitals({
        heart_rate: vitals.heartRate,
        temperature: vitals.temperature,
        spo2: vitals.spO2,
        blood_pressure_systolic: vitals.bloodPressure?.systolic,
        blood_pressure_diastolic: vitals.bloodPressure?.diastolic,
        source: 'bluetooth',
      });
    }
  };

  // Transform database devices to display format
  const displayDevices = devices.map(d => ({
    id: d.id,
    name: d.device_name,
    brand: d.device_brand || 'Unknown',
    type: d.device_type,
    connected: d.is_connected,
    batteryLevel: d.battery_level || undefined,
    sensors: d.sensors,
    lastSync: d.last_sync ? new Date(d.last_sync) : undefined,
    aiCapability: d.ai_capability,
  }));

  const connectedCount = displayDevices.filter(d => d.connected).length;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-display"
          >
            Wearable Devices
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Connect any smartwatch, fitness band, or medical device to unlock AI-powered health insights
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <Watch className="w-8 h-8 text-primary mb-2" />
            <p className="text-2xl font-bold">{connectedCount}</p>
            <p className="text-sm text-muted-foreground">Connected</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-success/5 border border-success/20"
          >
            <Zap className="w-8 h-8 text-success mb-2" />
            <p className="text-2xl font-bold">
              {displayDevices.filter(d => d.connected).length > 0 
                ? Math.round(displayDevices.filter(d => d.connected).reduce((sum, d) => sum + d.aiCapability, 0) / connectedCount)
                : 0}%
            </p>
            <p className="text-sm text-muted-foreground">AI Capability</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-info/5 border border-info/20"
          >
            <Cpu className="w-8 h-8 text-info mb-2" />
            <p className="text-2xl font-bold">
              {new Set(displayDevices.filter(d => d.connected).flatMap(d => d.sensors)).size}
            </p>
            <p className="text-sm text-muted-foreground">Active Sensors</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-warning/5 border border-warning/20"
          >
            <Smartphone className="w-8 h-8 text-warning mb-2" />
            <p className="text-2xl font-bold">{displayDevices.length}</p>
            <p className="text-sm text-muted-foreground">Total Devices</p>
          </motion.div>
        </div>

        {/* Live Vitals from Bluetooth */}
        {Object.keys(liveVitals).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-success/30 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-success animate-pulse" />
                  Live Bluetooth Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {liveVitals.heartRate && (
                    <div className="p-3 rounded-lg bg-background border border-success/20">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="text-2xl font-bold text-success">{liveVitals.heartRate} BPM</p>
                    </div>
                  )}
                  {liveVitals.temperature && (
                    <div className="p-3 rounded-lg bg-background border border-warning/20">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="text-2xl font-bold text-warning">{liveVitals.temperature.toFixed(1)}°C</p>
                    </div>
                  )}
                  {liveVitals.bloodPressure && (
                    <div className="p-3 rounded-lg bg-background border border-info/20">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="text-2xl font-bold text-info">
                        {liveVitals.bloodPressure.systolic}/{liveVitals.bloodPressure.diastolic}
                      </p>
                    </div>
                  )}
                  {liveVitals.spO2 && (
                    <div className="p-3 rounded-lg bg-background border border-primary/20">
                      <p className="text-xs text-muted-foreground">SpO2</p>
                      <p className="text-2xl font-bold text-primary">{liveVitals.spO2}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Bluetooth Scanner */}
            <BluetoothScanner 
              onVitalsUpdate={handleVitalsUpdate}
              onDeviceConnect={handleBluetoothDeviceConnect}
            />

            {/* Device Grid */}
            <WearableGrid 
              devices={displayDevices} 
              onConnect={handleConnect}
              onRemove={removeDevice}
            />
          </div>
          
          <div className="space-y-6">
            <SensorCapabilities devices={displayDevices} />

            {/* Supported Brands */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bluetooth className="w-5 h-5 text-primary" />
                  Supported Brands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Apple', 'Samsung', 'Fitbit', 'Garmin', 'Xiaomi', 'Noise', 'BoAt', 'Fire-Boltt', 'Dexcom', 'Omron'].map((brand) => (
                    <span
                      key={brand}
                      className="px-2 py-1 text-xs rounded-full bg-secondary text-muted-foreground"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  + Any Bluetooth device with standard GATT health services
                </p>
              </CardContent>
            </Card>

            {/* Bluetooth Info */}
            <Card className="border-info/20 bg-info/5">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-info mb-2">Web Bluetooth Info</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Works best in Chrome, Edge, Opera</li>
                  <li>• Requires HTTPS or localhost</li>
                  <li>• Device must support Bluetooth GATT</li>
                  <li>• Enable device pairing mode first</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Google Fit Connection */}
<motion.button
  whileTap={{ scale: 0.95 }}
  onClick={onConnectWatch}
  className="px-4 py-2 rounded-lg bg-primary text-white font-medium w-fit"
>
  Connect Watch (Google Fit)
</motion.button>

      </div>
    </AppLayout>
  );
}
