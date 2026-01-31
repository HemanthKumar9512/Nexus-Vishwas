import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

// Standard Bluetooth GATT Service UUIDs
const BLUETOOTH_SERVICES = {
  HEART_RATE: 'heart_rate',
  BATTERY_SERVICE: 'battery_service',
  DEVICE_INFORMATION: 'device_information',
  HEALTH_THERMOMETER: 'health_thermometer',
  BLOOD_PRESSURE: 'blood_pressure',
  GLUCOSE: 'glucose',
  RUNNING_SPEED_CADENCE: 'running_speed_and_cadence',
  CYCLING_SPEED_CADENCE: 'cycling_speed_and_cadence',
  CYCLING_POWER: 'cycling_power',
  WEIGHT_SCALE: 'weight_scale',
  PULSE_OXIMETER: 0x1822,
};

// Characteristic UUIDs
const CHARACTERISTICS = {
  HEART_RATE_MEASUREMENT: 'heart_rate_measurement',
  BODY_SENSOR_LOCATION: 'body_sensor_location',
  BATTERY_LEVEL: 'battery_level',
  TEMPERATURE_MEASUREMENT: 'temperature_measurement',
  BLOOD_PRESSURE_MEASUREMENT: 'blood_pressure_measurement',
  GLUCOSE_MEASUREMENT: 'glucose_measurement',
  MANUFACTURER_NAME: 'manufacturer_name_string',
  MODEL_NUMBER: 'model_number_string',
  FIRMWARE_REVISION: 'firmware_revision_string',
  PLX_CONTINUOUS_MEASUREMENT: 0x2A5F, // SpO2
};

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  brand: string;
  connected: boolean;
  batteryLevel?: number;
  sensors: string[];
}

export interface VitalReadings {
  heartRate?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  spO2?: number;
  temperature?: number;
  batteryLevel?: number;
  steps?: number;
}

export interface ConnectedBluetoothDevice {
  device: BluetoothDevice;
  server?: BluetoothRemoteGATTServer;
  info: BluetoothDeviceInfo;
  vitals: VitalReadings;
}

export function useWebBluetooth() {
  const [isScanning, setIsScanning] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<Map<string, ConnectedBluetoothDevice>>(new Map());
  const [latestVitals, setLatestVitals] = useState<VitalReadings>({});
  const deviceRefs = useRef<Map<string, any>>(new Map());
  const { toast } = useToast();

  // Check if Web Bluetooth is supported
  const checkSupport = useCallback(() => {
    const supported = 'bluetooth' in navigator;
    setIsSupported(supported);
    return supported;
  }, []);

  // Parse heart rate measurement data
  const parseHeartRate = (value: DataView): number => {
    const flags = value.getUint8(0);
    const is16Bit = (flags & 0x01) !== 0;
    
    if (is16Bit) {
      return value.getUint16(1, true);
    } else {
      return value.getUint8(1);
    }
  };

  // Parse temperature measurement
  const parseTemperature = (value: DataView): number => {
    const flags = value.getUint8(0);
    const mantissa = value.getInt16(1, true);
    const exponent = value.getInt8(3);
    const tempValue = mantissa * Math.pow(10, exponent);
    
    // Convert to Celsius if in Fahrenheit
    const isFahrenheit = (flags & 0x01) !== 0;
    return isFahrenheit ? (tempValue - 32) * 5 / 9 : tempValue;
  };

  // Parse blood pressure measurement
  const parseBloodPressure = (value: DataView): { systolic: number; diastolic: number } => {
    const systolic = value.getFloat32(1, true);
    const diastolic = value.getFloat32(3, true);
    return { systolic: Math.round(systolic), diastolic: Math.round(diastolic) };
  };

  // Scan for Bluetooth devices
  const scanForDevices = useCallback(async () => {
    if (!checkSupport()) {
      toast({
        title: "Bluetooth Not Supported",
        description: "Your browser doesn't support Web Bluetooth. Please use Chrome, Edge, or Opera on desktop.",
        variant: "destructive",
      });
      return null;
    }

    setIsScanning(true);

    try {
      // Request device with common health services
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [BLUETOOTH_SERVICES.HEART_RATE] },
          { services: [BLUETOOTH_SERVICES.BATTERY_SERVICE] },
          { services: [BLUETOOTH_SERVICES.HEALTH_THERMOMETER] },
        ],
        optionalServices: [
          BLUETOOTH_SERVICES.HEART_RATE,
          BLUETOOTH_SERVICES.BATTERY_SERVICE,
          BLUETOOTH_SERVICES.DEVICE_INFORMATION,
          BLUETOOTH_SERVICES.HEALTH_THERMOMETER,
          BLUETOOTH_SERVICES.BLOOD_PRESSURE,
          BLUETOOTH_SERVICES.PULSE_OXIMETER,
        ],
      });

      toast({
        title: "Device Found",
        description: `Found ${device.name || 'Unknown Device'}`,
      });

      return device;
    } catch (error) {
      if ((error as Error).name === 'NotFoundError') {
        toast({
          title: "No Device Selected",
          description: "You cancelled the device selection or no compatible devices found.",
          variant: "destructive",
        });
      } else {
        console.error('Bluetooth scan error:', error);
        toast({
          title: "Scan Failed",
          description: "Failed to scan for Bluetooth devices. Make sure Bluetooth is enabled.",
          variant: "destructive",
        });
      }
      return null;
    } finally {
      setIsScanning(false);
    }
  }, [checkSupport, toast]);

  // Connect to a scanned device and start reading data
  const connectToDevice = useCallback(async (device: any) => {
    try {
      toast({
        title: "Connecting...",
        description: `Connecting to ${device.name || 'device'}...`,
      });

      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server');
      }

      const sensors: string[] = [];
      const vitals: VitalReadings = {};
      let batteryLevel: number | undefined;
      let manufacturerName = 'Unknown';

      // Try to read device information
      try {
        const deviceInfoService = await server.getPrimaryService(BLUETOOTH_SERVICES.DEVICE_INFORMATION);
        const manufacturerChar = await deviceInfoService.getCharacteristic(CHARACTERISTICS.MANUFACTURER_NAME);
        const manufacturerValue = await manufacturerChar.readValue();
        manufacturerName = new TextDecoder().decode(manufacturerValue);
      } catch (e) {
        console.log('Device info not available');
      }

      // Try to read battery level
      try {
        const batteryService = await server.getPrimaryService(BLUETOOTH_SERVICES.BATTERY_SERVICE);
        const batteryChar = await batteryService.getCharacteristic(CHARACTERISTICS.BATTERY_LEVEL);
        const batteryValue = await batteryChar.readValue();
        batteryLevel = batteryValue.getUint8(0);
        sensors.push('Battery');
        vitals.batteryLevel = batteryLevel;
      } catch (e) {
        console.log('Battery service not available');
      }

      // Set up heart rate monitoring
      try {
        const heartRateService = await server.getPrimaryService(BLUETOOTH_SERVICES.HEART_RATE);
        const heartRateChar = await heartRateService.getCharacteristic(CHARACTERISTICS.HEART_RATE_MEASUREMENT);
        
        sensors.push('Heart Rate');
        
        // Set up notifications for continuous heart rate
        await heartRateChar.startNotifications();
        heartRateChar.addEventListener('characteristicvaluechanged', (event: any) => {
          const heartRate = parseHeartRate(event.target.value);
          setLatestVitals(prev => ({ ...prev, heartRate }));
        });

        // Read initial value
        const hrValue = await heartRateChar.readValue();
        vitals.heartRate = parseHeartRate(hrValue);
      } catch (e) {
        console.log('Heart rate service not available');
      }

      // Try temperature sensor
      try {
        const tempService = await server.getPrimaryService(BLUETOOTH_SERVICES.HEALTH_THERMOMETER);
        const tempChar = await tempService.getCharacteristic(CHARACTERISTICS.TEMPERATURE_MEASUREMENT);
        
        sensors.push('Temperature');
        
        await tempChar.startNotifications();
        tempChar.addEventListener('characteristicvaluechanged', (event: any) => {
          const temperature = parseTemperature(event.target.value);
          setLatestVitals(prev => ({ ...prev, temperature }));
        });
      } catch (e) {
        console.log('Temperature service not available');
      }

      // Try blood pressure
      try {
        const bpService = await server.getPrimaryService(BLUETOOTH_SERVICES.BLOOD_PRESSURE);
        const bpChar = await bpService.getCharacteristic(CHARACTERISTICS.BLOOD_PRESSURE_MEASUREMENT);
        
        sensors.push('Blood Pressure');
        
        await bpChar.startNotifications();
        bpChar.addEventListener('characteristicvaluechanged', (event: any) => {
          const bloodPressure = parseBloodPressure(event.target.value);
          setLatestVitals(prev => ({ ...prev, bloodPressure }));
        });
      } catch (e) {
        console.log('Blood pressure service not available');
      }

      // Store device reference
      deviceRefs.current.set(device.id, device);

      const deviceInfo: BluetoothDeviceInfo = {
        id: device.id,
        name: device.name || 'Unknown Device',
        brand: manufacturerName,
        connected: true,
        batteryLevel,
        sensors,
      };

      const connectedDevice: ConnectedBluetoothDevice = {
        device,
        server,
        info: deviceInfo,
        vitals,
      };

      setConnectedDevices(prev => {
        const updated = new Map(prev);
        updated.set(device.id, connectedDevice);
        return updated;
      });

      setLatestVitals(vitals);

      // Handle disconnection
      device.addEventListener('gattserverdisconnected', () => {
        toast({
          title: "Device Disconnected",
          description: `${device.name || 'Device'} was disconnected.`,
          variant: "destructive",
        });
        
        setConnectedDevices(prev => {
          const updated = new Map(prev);
          updated.delete(device.id);
          return updated;
        });
        
        deviceRefs.current.delete(device.id);
      });

      toast({
        title: "Connected Successfully",
        description: `Connected to ${device.name}. Found ${sensors.length} sensors.`,
      });

      return connectedDevice;
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${device?.name || 'device'}. Please try again.`,
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Disconnect from a device
  const disconnectDevice = useCallback(async (deviceId: string) => {
    const deviceRef = deviceRefs.current.get(deviceId);
    if (deviceRef?.gatt?.connected) {
      deviceRef.gatt.disconnect();
    }
    
    setConnectedDevices(prev => {
      const updated = new Map(prev);
      updated.delete(deviceId);
      return updated;
    });
    
    deviceRefs.current.delete(deviceId);

    toast({
      title: "Disconnected",
      description: "Device has been disconnected.",
    });
  }, [toast]);

  // Scan and connect in one step
  const scanAndConnect = useCallback(async () => {
    const device = await scanForDevices();
    if (device) {
      return await connectToDevice(device);
    }
    return null;
  }, [scanForDevices, connectToDevice]);

  return {
    isSupported,
    isScanning,
    connectedDevices: Array.from(connectedDevices.values()),
    latestVitals,
    checkSupport,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    scanAndConnect,
  };
}
