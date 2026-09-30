import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { Button, Input, Card, Badge, Typography, Tabs, Alert } from '../design-system';
import {
  Lock,
  Mail,
  User,
  Phone,
  Building,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogOut,
  AlertCircle
} from 'lucide-react';

interface AuthScreensProps {
  onNavigate: (path: string) => void;
  initialScreen?: 'sign-in' | 'sign-up' | 'forgot-password' | 'reset-password' | 'profile';
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  onNavigate,
  initialScreen = 'sign-in'
}) => {
  const {
    session,
    isAuthenticated,
    signIn,
    signUpCustomer,
    signUpBusinessOwner,
    requestPasswordReset,
    resetPassword,
    signOut
  } = useAuth();

  const [activeScreen, setActiveScreen] = useState<'sign-in' | 'sign-up' | 'forgot-password' | 'reset-password' | 'profile'>(initialScreen);
  const [signupType, setSignupType] = useState<'customer' | 'owner'>('owner');

  // Form Fields State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [resetToken, setResetToken] = useState('NEX-OTP-8821');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & Notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Demo Account Auto-Fill
  const handleQuickDemoFill = (type: 'customer' | 'owner' | 'staff' | 'super') => {
    setErrorMsg('');
    setSuccessMsg('');
    if (type === 'customer') {
      setEmail('rahul.customer@example.com');
      setPassword('secure_password123');
    } else if (type === 'owner') {
      setEmail('owner@royalcrown.in');
      setPassword('secure_password123');
    } else if (type === 'staff') {
      setEmail('marco@royalcrown.in');
      setPassword('secure_password123');
    } else if (type === 'super') {
      setEmail('rajnish@nexora.io');
      setPassword('secure_password123');
    }
  };

  // 1. SIGN IN SUBMIT
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await signIn(email, password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg('Authentication successful. Redirecting...');
      if (res.targetRedirect) {
        onNavigate(res.targetRedirect);
      }
    } else {
      setErrorMsg(res.error || 'Authentication failed.');
    }
  };

  // 2. SIGN UP SUBMIT
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (signupType === 'customer') {
      const res = await signUpCustomer({ name, email, phone, password });
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg('Account created successfully!');
        onNavigate('/customer');
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } else {
      // Business Owner -> Directs to Onboarding in accordance with Phase 3.6 specs
      const res = await signUpBusinessOwner({ name, email, phone, businessName, password });
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg('Salon account registered! Redirecting to setup wizard...');
        if (res.targetRedirect) {
          onNavigate(res.targetRedirect);
        }
      } else {
        setErrorMsg(res.error || 'Salon registration failed.');
      }
    }
  };

  // 3. FORGOT PASSWORD SUBMIT
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await requestPasswordReset(email);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg(res.message);
    }
  };

  // 4. RESET PASSWORD SUBMIT
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    const res = await resetPassword(resetToken, newPassword);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setActiveScreen('sign-in');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4 text-left space-y-6">
      {/* Navigation Sub-Tabs for Phase 3.6 Screen Verification */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'sign-in', label: '1. Sign In' },
            { id: 'sign-up', label: '2. Sign Up' },
            { id: 'forgot-password', label: '3. Forgot Password' },
            { id: 'reset-password', label: '4. Reset Password' },
            { id: 'profile', label: '5. Profile' }
          ].map((scr) => (
            <button
              key={scr.id}
              onClick={() => {
                setActiveScreen(scr.id as any);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeScreen === scr.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {scr.label}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 1: SIGN IN */}
      {/* ------------------------------------------------------------- */}
      {activeScreen === 'sign-in' && (
        <Card padding="lg" className="space-y-6 shadow-xl border-slate-200">
          <div className="text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <Typography variant="h2">Sign in to Nexora</Typography>
            <Typography variant="small" className="text-slate-500">
              Access your salon administration, staff schedule, or customer passes.
            </Typography>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick One-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('owner')}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-center"
              >
                Owner Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('staff')}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-center"
              >
                Staff Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('customer')}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-center"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('super')}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-center"
              >
                Super Admin
              </button>
            </div>
          </div>

          {errorMsg && <Alert variant="danger" title="Authentication Error">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success" title="Success">{successMsg}</Alert>}

          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <Input
              label="Work or Personal Email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setActiveScreen('forgot-password')}
                  className="text-xs text-indigo-600 hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <Button type="submit" size="md" isLoading={isSubmitting} className="w-full font-bold">
              Sign In to Account
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => setActiveScreen('sign-up')}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Sign up here
            </button>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 2: SIGN UP */}
      {/* ------------------------------------------------------------- */}
      {activeScreen === 'sign-up' && (
        <Card padding="lg" className="space-y-6 shadow-xl border-slate-200">
          <div className="text-center space-y-1">
            <Typography variant="h2">Create Nexora Account</Typography>
            <Typography variant="small" className="text-slate-500">
              Select your account type to continue.
            </Typography>
          </div>

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSignupType('owner')}
              className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                signupType === 'owner' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Salon Business Owner
            </button>
            <button
              type="button"
              onClick={() => setSignupType('customer')}
              className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                signupType === 'customer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Client / Customer
            </button>
          </div>

          {errorMsg && <Alert variant="danger" title="Registration Error">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success" title="Success">{successMsg}</Alert>}

          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            {signupType === 'owner' && (
              <Input
                label="Salon / Business Name"
                placeholder="e.g. The Royal Crown Barber"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                leftIcon={<Building className="w-4 h-4" />}
                hint="Leads directly to Category & Website setup"
                required
              />
            )}

            <Input
              label="Full Name"
              placeholder="e.g. Vikram Singhania"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. vikram@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Mobile Phone Number"
              placeholder="+91 98200 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              hint="Required for OTP & 25% Advance receipts"
              required
            />

            <Input
              label="Secure Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              hint="Client-side SHA-256 salted hashing enabled"
              required
            />

            <Button type="submit" size="md" isLoading={isSubmitting} className="w-full font-bold">
              {signupType === 'owner' ? 'Register & Start Onboarding' : 'Create Customer Account'}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => setActiveScreen('sign-in')}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 3: FORGOT PASSWORD */}
      {/* ------------------------------------------------------------- */}
      {activeScreen === 'forgot-password' && (
        <Card padding="lg" className="space-y-6 shadow-xl border-slate-200">
          <div className="text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-5 h-5" />
            </div>
            <Typography variant="h2">Forgot Password?</Typography>
            <Typography variant="small" className="text-slate-500">
              Enter your registered email to receive a password reset token.
            </Typography>
          </div>

          {errorMsg && <Alert variant="danger" title="Error">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success" title="Token Dispatched">{successMsg}</Alert>}

          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Button type="submit" size="md" isLoading={isSubmitting} className="w-full font-bold">
              Send Reset Code
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Remembered your password?{' '}
            <button
              onClick={() => setActiveScreen('sign-in')}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 4: RESET PASSWORD */}
      {/* ------------------------------------------------------------- */}
      {activeScreen === 'reset-password' && (
        <Card padding="lg" className="space-y-6 shadow-xl border-slate-200">
          <div className="text-center space-y-1">
            <Typography variant="h2">Set New Password</Typography>
            <Typography variant="small" className="text-slate-500">
              Enter the reset token received via SMS/Email and your new password.
            </Typography>
          </div>

          {errorMsg && <Alert variant="danger" title="Error">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success" title="Updated">{successMsg}</Alert>}

          <form onSubmit={handleResetSubmit} className="space-y-4">
            <Input
              label="Reset Verification Token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" size="md" isLoading={isSubmitting} className="w-full font-bold">
              Update Password
            </Button>
          </form>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 5: BASIC PROFILE & ACTIVE SESSION */}
      {/* ------------------------------------------------------------- */}
      {activeScreen === 'profile' && (
        <Card padding="lg" className="space-y-6 shadow-xl border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <Typography variant="h2">User Profile & Session</Typography>
              <Typography variant="caption">Client-side & Server Auth Architecture</Typography>
            </div>
            {session && <Badge variant="brand">{session.role}</Badge>}
          </div>

          {session ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">User Identifier:</span>
                  <span className="font-mono font-bold text-slate-800">{session.userId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Full Name:</span>
                  <span className="font-bold text-slate-900">{session.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Email:</span>
                  <span className="font-mono text-slate-800">{session.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Phone:</span>
                  <span className="font-mono text-slate-800">{session.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-semibold">Session Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active (Bearer Token Injected)</span>
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={signOut} className="w-full">
                  <LogOut className="w-4 h-4 mr-1.5" />
                  <span>Sign Out Session</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-slate-500">No active authenticated session detected.</p>
              <Button size="sm" onClick={() => setActiveScreen('sign-in')}>Sign In Now</Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
