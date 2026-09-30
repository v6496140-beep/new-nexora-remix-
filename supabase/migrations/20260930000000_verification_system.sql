-- Verification System Schema for Nexora SalonOS
-- Enforces Verification Data Model, Audit History, and Multi-Role Row Level Security (RLS)

-- 1. Profiles Table (Extends Supabase Auth with RBAC)
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
-- Contains public business entity info as well as verification state
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
  verification_notes TEXT, -- Internal admin audit notes (restricted/sensitive)
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dedicated Verification Audit Log Table: business_verification_history
-- Captures full lifecycle of transitions rather than overwriting historical information
CREATE TABLE IF NOT EXISTS business_verification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  previous_status TEXT CHECK (previous_status IS NULL OR previous_status IN ('pending', 'under_review', 'verified', 'rejected', 'suspended')),
  new_status TEXT CHECK (new_status IN ('pending', 'under_review', 'verified', 'rejected', 'suspended')) NOT NULL,
  reason TEXT,
  notes TEXT,
  changed_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backward compatibility synonym/view for legacy queries
CREATE OR REPLACE VIEW verification_history AS 
SELECT * FROM business_verification_history;

-- 4. Public Safe View: public_businesses
-- Guarantees customers only see public verification state without leaking sensitive notes, reasons, or admin IDs
CREATE OR REPLACE VIEW public_businesses AS
SELECT
  id,
  name,
  slug,
  verification_status, -- Customers should only see public verification state
  verified_at,
  is_featured,
  featured_until,
  created_at
FROM businesses
WHERE verification_status = 'verified';

-- 5. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verification_history ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- RLS POLICIES: PROFILES
-- -------------------------------------------------------------

-- Profiles: Users can read their own profile, Admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- -------------------------------------------------------------
-- RLS POLICIES: BUSINESSES
-- -------------------------------------------------------------

-- Public / Customers: Anyone can view verified businesses (public catalog)
CREATE POLICY "Public can view verified businesses" ON businesses FOR SELECT 
USING (verification_status = 'verified');

-- Business Owners: Can view their own business regardless of verification status
CREATE POLICY "Owners can view own business" ON businesses FOR SELECT 
USING (auth.uid() = owner_id);

-- Super Admins: Can view all businesses for compliance auditing
CREATE POLICY "Admins can view all businesses" ON businesses FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Business Owners: Can update basic non-verified business info & submit for review
CREATE POLICY "Owners can update own non-verified business" ON businesses FOR UPDATE 
USING (auth.uid() = owner_id AND verification_status IN ('pending', 'under_review', 'rejected'))
WITH CHECK (
  auth.uid() = owner_id AND 
  -- Business owners cannot self-verify or suspend
  verification_status IN ('pending', 'under_review')
);

-- Super Admins: Full management permissions (approve, reject, suspend, notes)
CREATE POLICY "Admins can update everything" ON businesses FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- -------------------------------------------------------------
-- RLS POLICIES: BUSINESS_VERIFICATION_HISTORY (Audit Log)
-- -------------------------------------------------------------

-- Customers: Denied (no policy allows public/customer access)

-- Business Owners: Can ONLY access their own business verification history
CREATE POLICY "Owners can see their business history" ON business_verification_history FOR SELECT
USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = business_verification_history.business_id AND owner_id = auth.uid())
);

-- Super Admins: Can view and manage all verification history records
CREATE POLICY "Admins can manage history" ON business_verification_history FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- -------------------------------------------------------------
-- DATA INTEGRITY & AUDIT TRIGGER
-- -------------------------------------------------------------
-- Ensures status transitions are validated and automatically logged to business_verification_history
CREATE OR REPLACE FUNCTION process_verification_change()
RETURNS TRIGGER AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  -- Determine caller role if authenticated
  IF auth.uid() IS NOT NULL THEN
    SELECT role INTO v_caller_role FROM profiles WHERE id = auth.uid();
  END IF;

  -- Only trigger when verification status has changed
  IF (OLD.verification_status IS DISTINCT FROM NEW.verification_status) THEN
    -- Authorization guard: Only authorized admin users can approve, reject, or suspend
    IF NEW.verification_status IN ('verified', 'rejected', 'suspended') THEN
      IF v_caller_role IS DISTINCT FROM 'SUPER_ADMIN' AND auth.uid() IS NOT NULL THEN
        RAISE EXCEPTION 'Access Denied: Only authorized admin users can approve, reject, or suspend a business.';
      END IF;
    END IF;

    -- Business owner guard: Cannot self-verify
    IF v_caller_role = 'BUSINESS_OWNER' AND NEW.verification_status = 'verified' THEN
      RAISE EXCEPTION 'Access Denied: Business owners cannot self-verify.';
    END IF;

    -- Timestamping and validation on approve
    IF NEW.verification_status = 'verified' THEN
      NEW.verified_at := COALESCE(NEW.verified_at, NOW());
      NEW.verified_by := COALESCE(NEW.verified_by, auth.uid());
      NEW.rejection_reason := NULL;
    END IF;

    -- Require rejection reason
    IF NEW.verification_status = 'rejected' AND (NEW.rejection_reason IS NULL OR TRIM(NEW.rejection_reason) = '') THEN
      RAISE EXCEPTION 'Validation Error: Rejection reason must be provided when rejecting verification.';
    END IF;

    -- Require suspension reason
    IF NEW.verification_status = 'suspended' AND (NEW.suspension_reason IS NULL OR TRIM(NEW.suspension_reason) = '') THEN
      RAISE EXCEPTION 'Validation Error: Suspension reason must be provided when suspending verification.';
    END IF;

    -- Insert atomic history audit entry into business_verification_history
    INSERT INTO business_verification_history (
      business_id,
      previous_status,
      new_status,
      reason,
      notes,
      changed_by,
      created_at
    ) VALUES (
      NEW.id,
      OLD.verification_status,
      NEW.verification_status,
      COALESCE(NEW.rejection_reason, NEW.suspension_reason),
      NEW.verification_notes,
      COALESCE(auth.uid(), NEW.verified_by, OLD.owner_id),
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_business_verification_audit ON businesses;
CREATE TRIGGER trg_business_verification_audit
BEFORE UPDATE ON businesses
FOR EACH ROW
EXECUTE FUNCTION process_verification_change();
