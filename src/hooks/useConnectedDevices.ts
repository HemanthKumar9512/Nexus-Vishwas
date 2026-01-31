import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ConnectedDevice {
  id: string;
  user_id: string;
  device_name: string;
  device_brand: string | null;
  device_type: 'smartwatch' | 'fitness_band' | 'medical_device' | 'phone';
  bluetooth_id: string | null;
  is_connected: boolean;
  battery_level: number | null;
  sensors: string[];
  ai_capability: number;
  last_sync: string | null;
  created_at: string;
}

export interface DeviceInput {
  device_name: string;
  device_brand?: string;
  device_type: 'smartwatch' | 'fitness_band' | 'medical_device' | 'phone';
  bluetooth_id?: string;
  is_connected?: boolean;
  battery_level?: number;
  sensors?: string[];
  ai_capability?: number;
}

export function useConnectedDevices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDevices();
    } else {
      setDevices([]);
      setLoading(false);
    }
  }, [user]);

  const fetchDevices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('connected_devices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Parse sensors from JSONB and cast types
      const devicesWithParsedSensors = (data || []).map(device => ({
        ...device,
        device_type: device.device_type as ConnectedDevice['device_type'],
        sensors: (device.sensors as string[]) || [],
      })) as ConnectedDevice[];

      setDevices(devicesWithParsedSensors);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async (input: DeviceInput) => {
    if (!user) return { error: new Error('Not authenticated'), data: null };

    try {
      const { data, error } = await supabase
        .from('connected_devices')
        .insert({
          user_id: user.id,
          ...input,
          sensors: input.sensors || [],
        })
        .select()
        .single();

      if (error) throw error;

      await fetchDevices();
      toast.success('Device added successfully');
      return { error: null, data };
    } catch (error) {
      toast.error('Failed to add device');
      return { error: error as Error, data: null };
    }
  };

  const updateDevice = async (deviceId: string, updates: Partial<DeviceInput>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('connected_devices')
        .update({
          ...updates,
          last_sync: new Date().toISOString(),
        })
        .eq('id', deviceId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchDevices();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const removeDevice = async (deviceId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('connected_devices')
        .delete()
        .eq('id', deviceId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchDevices();
      toast.success('Device removed');
      return { error: null };
    } catch (error) {
      toast.error('Failed to remove device');
      return { error: error as Error };
    }
  };

  const toggleConnection = async (deviceId: string, isConnected: boolean) => {
    return updateDevice(deviceId, { is_connected: isConnected });
  };

  return {
    devices,
    loading,
    addDevice,
    updateDevice,
    removeDevice,
    toggleConnection,
    refetch: fetchDevices,
  };
}
