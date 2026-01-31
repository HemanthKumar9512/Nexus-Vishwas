-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for treatment modality
CREATE TYPE public.treatment_modality AS ENUM ('modern', 'ayurvedic', 'siddha', 'integrated');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT,
  preferred_modality treatment_modality DEFAULT 'integrated',
  health_score INTEGER DEFAULT 75 CHECK (health_score >= 0 AND health_score <= 100),
  subscription TEXT DEFAULT 'basic' CHECK (subscription IN ('basic', 'standard', 'premium', 'pro')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create emergency contacts table
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health vitals table
CREATE TABLE public.health_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  spo2 NUMERIC(5,2),
  temperature NUMERIC(4,2),
  steps INTEGER DEFAULT 0,
  sleep_hours NUMERIC(4,2),
  stress_level INTEGER CHECK (stress_level >= 0 AND stress_level <= 100),
  glucose_level NUMERIC(6,2),
  respiratory_rate INTEGER,
  hrv INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'manual',
  device_id TEXT
);

-- Create health predictions table
CREATE TABLE public.health_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  condition TEXT NOT NULL,
  risk_percentage INTEGER CHECK (risk_percentage >= 0 AND risk_percentage <= 100),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  timeframe TEXT,
  recommendation TEXT,
  treatment_modality treatment_modality,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  indicators JSONB,
  overall_health_score INTEGER,
  immediate_actions JSONB,
  lifestyle_recommendations JSONB,
  traditional_remedies JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create connected devices table
CREATE TABLE public.connected_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_name TEXT NOT NULL,
  device_brand TEXT,
  device_type TEXT CHECK (device_type IN ('smartwatch', 'fitness_band', 'medical_device', 'phone')),
  bluetooth_id TEXT,
  is_connected BOOLEAN DEFAULT false,
  battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
  sensors JSONB,
  ai_capability INTEGER DEFAULT 0 CHECK (ai_capability >= 0 AND ai_capability <= 100),
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_name TEXT NOT NULL,
  doctor_specialty TEXT,
  hospital_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type TEXT CHECK (appointment_type IN ('in-person', 'video', 'phone')),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health circles table
CREATE TABLE public.health_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT CHECK (category IN ('diabetes', 'cardiac', 'weight', 'mental', 'pregnancy', 'wellness')),
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user circle memberships table
CREATE TABLE public.circle_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  circle_id UUID REFERENCES public.health_circles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, circle_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_memberships ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update circle member count
CREATE OR REPLACE FUNCTION public.update_circle_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.health_circles SET member_count = member_count + 1 WHERE id = NEW.circle_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.health_circles SET member_count = member_count - 1 WHERE id = OLD.circle_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_member_count
  AFTER INSERT OR DELETE ON public.circle_memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_circle_member_count();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can view own contacts" ON public.emergency_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contacts" ON public.emergency_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON public.emergency_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts" ON public.emergency_contacts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_vitals
CREATE POLICY "Users can view own vitals" ON public.health_vitals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vitals" ON public.health_vitals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vitals" ON public.health_vitals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vitals" ON public.health_vitals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_predictions
CREATE POLICY "Users can view own predictions" ON public.health_predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own predictions" ON public.health_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own predictions" ON public.health_predictions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for connected_devices
CREATE POLICY "Users can view own devices" ON public.connected_devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own devices" ON public.connected_devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own devices" ON public.connected_devices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own devices" ON public.connected_devices FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view own conversations" ON public.chat_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.chat_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.chat_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.chat_conversations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appointments" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_circles (public read)
CREATE POLICY "Anyone can view circles" ON public.health_circles FOR SELECT USING (true);

-- RLS Policies for circle_memberships
CREATE POLICY "Users can view own memberships" ON public.circle_memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join circles" ON public.circle_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave circles" ON public.circle_memberships FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_health_vitals_user_id ON public.health_vitals(user_id);
CREATE INDEX idx_health_vitals_recorded_at ON public.health_vitals(recorded_at DESC);
CREATE INDEX idx_health_predictions_user_id ON public.health_predictions(user_id);
CREATE INDEX idx_health_predictions_created_at ON public.health_predictions(created_at DESC);
CREATE INDEX idx_connected_devices_user_id ON public.connected_devices(user_id);
CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_circle_memberships_user_id ON public.circle_memberships(user_id);

-- Insert default health circles
INSERT INTO public.health_circles (name, description, category) VALUES
('Diabetes Warriors', 'Support group for managing diabetes with modern and traditional approaches', 'diabetes'),
('Heart Health Circle', 'Community focused on cardiovascular wellness and prevention', 'cardiac'),
('Weight Management', 'Holistic weight management combining diet, exercise, and Ayurveda', 'weight'),
('Mental Wellness Hub', 'Safe space for mental health discussions and stress management', 'mental'),
('Pregnancy Care', 'Support for expecting mothers with integrated healthcare guidance', 'pregnancy'),
('Wellness Enthusiasts', 'General wellness community for healthy lifestyle discussions', 'wellness');