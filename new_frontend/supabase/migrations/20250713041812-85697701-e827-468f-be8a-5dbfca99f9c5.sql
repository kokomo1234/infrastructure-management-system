-- Créer les types d'énumérations
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.equipment_type AS ENUM ('inverter', 'rectifier', 'battery', 'ups', 'mechanical', 'dc_system');
CREATE TYPE public.maintenance_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled', 'overdue');
CREATE TYPE public.work_order_status AS ENUM ('open', 'in_progress', 'completed', 'closed', 'cancelled');
CREATE TYPE public.work_order_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.standby_status AS ENUM ('assigned', 'pending', 'completed', 'cancelled');
CREATE TYPE public.log_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT');
CREATE TYPE public.log_status AS ENUM ('success', 'warning', 'error');

-- Créer la table des profils utilisateurs
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  department TEXT,
  position TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des rôles utilisateurs
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Créer la table des sites
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  description TEXT,
  status TEXT DEFAULT 'active',
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des équipements
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type equipment_type NOT NULL,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  location TEXT,
  installation_date DATE,
  warranty_expiry DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des ordres de travail
CREATE TABLE public.work_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status work_order_status DEFAULT 'open',
  priority work_order_priority DEFAULT 'medium',
  type TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  cost DECIMAL(10,2),
  vendor_name TEXT,
  vendor_contact TEXT,
  vendor_phone TEXT,
  vendor_email TEXT,
  parts_required TEXT[],
  safety_requirements TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table de maintenance
CREATE TABLE public.maintenance_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  frequency_days INTEGER,
  last_completed DATE,
  next_due DATE,
  status maintenance_status DEFAULT 'pending',
  priority work_order_priority DEFAULT 'medium',
  estimated_duration INTEGER,
  checklist JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des plannings de garde
CREATE TABLE public.standby_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status standby_status DEFAULT 'assigned',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des demandes d'échange de garde
CREATE TABLE public.standby_exchange_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_schedule_id UUID REFERENCES public.standby_schedules(id) ON DELETE CASCADE,
  proposed_schedule_id UUID REFERENCES public.standby_schedules(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  reason TEXT,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des journaux d'activité
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action log_action NOT NULL,
  resource TEXT NOT NULL,
  resource_id UUID,
  status log_status DEFAULT 'success',
  details TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des notes de calendrier
CREATE TABLE public.calendar_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  note TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des contracteurs
CREATE TABLE public.contractors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  specialties TEXT[],
  certifications TEXT[],
  hourly_rate DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des projets
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standby_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standby_exchange_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Créer une fonction de sécurité pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Créer une fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = user_uuid AND role = 'admin');
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Politiques RLS pour les profils
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour les rôles (seuls les admins peuvent les voir/modifier)
CREATE POLICY "Admins can view all user roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert user roles" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update user roles" ON public.user_roles FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete user roles" ON public.user_roles FOR DELETE USING (public.is_admin(auth.uid()));

-- Politiques RLS pour les sites (tous les utilisateurs connectés peuvent voir/modifier)
CREATE POLICY "Authenticated users can view sites" ON public.sites FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert sites" ON public.sites FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update sites" ON public.sites FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete sites" ON public.sites FOR DELETE USING (public.is_admin(auth.uid()));

-- Politiques RLS pour les équipements
CREATE POLICY "Authenticated users can view equipment" ON public.equipment FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert equipment" ON public.equipment FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update equipment" ON public.equipment FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete equipment" ON public.equipment FOR DELETE USING (public.is_admin(auth.uid()));

-- Politiques RLS pour les ordres de travail
CREATE POLICY "Authenticated users can view work orders" ON public.work_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert work orders" ON public.work_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update work orders" ON public.work_orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete work orders" ON public.work_orders FOR DELETE USING (public.is_admin(auth.uid()));

-- Politiques RLS pour la maintenance
CREATE POLICY "Authenticated users can view maintenance" ON public.maintenance_schedules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert maintenance" ON public.maintenance_schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update maintenance" ON public.maintenance_schedules FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete maintenance" ON public.maintenance_schedules FOR DELETE USING (public.is_admin(auth.uid()));

-- Politiques RLS pour les plannings de garde
CREATE POLICY "Authenticated users can view standby schedules" ON public.standby_schedules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert standby schedules" ON public.standby_schedules FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update standby schedules" ON public.standby_schedules FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete standby schedules" ON public.standby_schedules FOR DELETE USING (public.is_admin(auth.uid()));

-- Politiques RLS pour les demandes d'échange
CREATE POLICY "Users can view their exchange requests" ON public.standby_exchange_requests FOR SELECT USING (auth.uid() = requester_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users can insert their own requests" ON public.standby_exchange_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Admins can update exchange requests" ON public.standby_exchange_requests FOR UPDATE USING (public.is_admin(auth.uid()));

-- Politiques RLS pour les journaux d'activité (seuls les admins)
CREATE POLICY "Admins can view activity logs" ON public.activity_logs FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- Politiques RLS pour les notes de calendrier
CREATE POLICY "Users can view their own calendar notes" ON public.calendar_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own calendar notes" ON public.calendar_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own calendar notes" ON public.calendar_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own calendar notes" ON public.calendar_notes FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour les contracteurs
CREATE POLICY "Authenticated users can view contractors" ON public.contractors FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert contractors" ON public.contractors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update contractors" ON public.contractors FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete contractors" ON public.contractors FOR DELETE USING (public.is_admin(auth.uid()));

-- Politiques RLS pour les projets
CREATE POLICY "Authenticated users can view projects" ON public.projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert projects" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update projects" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (public.is_admin(auth.uid()));

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Assigner le rôle utilisateur par défaut
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour automatiquement les timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_standby_updated_at BEFORE UPDATE ON public.standby_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exchange_requests_updated_at BEFORE UPDATE ON public.standby_exchange_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_calendar_notes_updated_at BEFORE UPDATE ON public.calendar_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON public.contractors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();