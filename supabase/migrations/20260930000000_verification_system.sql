-- Verification System Schema for Nexora SalonOS

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('SUPER_ADMIN', 'BUSINESS_OWNER', 'MANAGER', 'STAFF', 'CUSTOMER')) DEFAULT 'CUSTOMER',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  verification_status TEXT CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected', 'suspended')) DEFAULT 'pending',
  verification_submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  suspension_reason TEXT,
  verification_notes TEXT, -- Internal admin notes
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Verification History Table (Audit Log)
CREATE TABLE IF NOT EXISTS verification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  notes TEXT,
  changed_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_history ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Users can read their own profile, Admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Businesses: Anyone can see verified businesses, Owners can see their own
CREATE POLICY "Public can view verified businesses" ON businesses FOR SELECT 
USING (verification_status = 'verified');

CREATE POLICY "Owners can view own business" ON businesses FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all businesses" ON businesses FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Businesses: Update restricted by role
CREATE POLICY "Owners can update own non-verified business" ON businesses FOR UPDATE 
USING (auth.uid() = owner_id AND (verification_status = 'pending' OR verification_status = 'under_review'))
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can update everything" ON businesses FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Verification History: Restricted access
CREATE POLICY "Admins can manage history" ON verification_history FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Owners can see their business history" ON verification_history FOR SELECT
USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);
