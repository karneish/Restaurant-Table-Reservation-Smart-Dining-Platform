import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { LogIn, UserPlus, Mail, Lock, Phone, Eye, EyeOff, ShieldCheck, RefreshCw, Sparkles, UserCog } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Field, Input } from './ui/Input';
import { useAuth, errorMessage } from '../context/AuthContext';
import Spinner from './ui/Spinner';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ open, onClose, initialMode = 'login' }: AuthModalProps) {
  const { login, demoLogin, register, verifyOtp, sendOtp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<'customer' | 'admin' | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [otpView, setOtpView] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (mode === 'register' && form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      let verified: boolean;
      if (mode === 'login') {
        verified = await login(form.email.trim(), form.password);
        toast.success('Welcome back!');
      } else {
        verified = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password, phone: form.phone.trim() || undefined });
        toast.success(verified ? 'Account created. Welcome to TableHub!' : 'Account created. Check your email for the OTP!');
      }
      if (!verified) {
        setOtpView(true);
        setOtpSending(true);
        try { await sendOtp(form.email.trim()); } catch { /* OTP send is best-effort in the demo */ }
        setOtpSending(false);
        return;
      }
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setOtpSending(true);
    try {
      await sendOtp(form.email.trim());
      toast.success('OTP sent again');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not resend OTP'));
    } finally {
      setOtpSending(false);
    }
  };

  const verify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error('Enter the 6-digit OTP');
      return;
    }
    setOtpVerifying(true);
    try {
      const ok = await verifyOtp(form.email.trim(), otp.trim());
      if (ok) {
        toast.success('Email verified!');
        setOtpView(false);
        onClose();
      } else {
        toast.error('Invalid OTP');
      }
    } catch (err) {
      toast.error(errorMessage(err, 'Verification failed'));
    } finally {
      setOtpVerifying(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setOtpView(false);
    setForm({ name: '', email: '', phone: '', password: '', confirm: '' });
  };

  const useDemo = async (admin: boolean) => {
    setDemoLoading(admin ? 'admin' : 'customer');
    try {
      await demoLogin(admin);
      toast.success(admin ? 'Logged in as Demo Admin' : 'Logged in as Demo Customer');
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, 'Demo login failed. Is the server running?'));
    } finally {
      setDemoLoading(null);
    }
  };

  if (otpView) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        icon={<ShieldCheck className="w-5 h-5" />}
        title="Verify your email"
        subtitle={`We sent a 6-digit OTP to ${form.email}. Check the server console for the code (simulated email).`}
      >
        <div className="space-y-4">
          <Field label="One-time password">
            <Input
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
          </Field>
          <Button onClick={verify} disabled={otpVerifying} className="w-full">
            {otpVerifying ? <Spinner className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            {otpVerifying ? 'Verifying…' : 'Verify Email'}
          </Button>
          <button
            onClick={resendOtp}
            disabled={otpSending}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" /> {otpSending ? 'Sending…' : 'Resend OTP'}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
      title={mode === 'login' ? 'Welcome back' : 'Create your account'}
      subtitle={mode === 'login' ? 'Sign in to manage your reservations.' : 'Join TableHub in a few seconds.'}
    >
      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name">
              <Input
                required
                placeholder="Aarav Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Phone (optional)">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
                <Input
                  type="tel"
                  placeholder="98765 43210"
                  className="pl-9"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </Field>
          </div>
        )}

        <Field label="Email">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
            <Input
              type="email"
              required
              placeholder="you@example.com"
              className="pl-9"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </Field>

        <Field label="Password" hint={mode === 'register' ? 'Minimum 6 characters.' : undefined}>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
            <Input
              type={showPw ? 'text' : 'password'}
              required
              placeholder={mode === 'register' ? 'Create a password' : 'Your password'}
              className="pl-9 pr-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-primary-600 transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        {mode === 'register' && (
          <Field label="Confirm password">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
              <Input
                type={showPw ? 'text' : 'password'}
                required
                placeholder="Repeat your password"
                className="pl-9"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </div>
          </Field>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner className="w-4 h-4" /> : mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      {mode === 'login' && (
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex-1 h-px bg-forest-100" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-forest-400">or explore instantly</span>
            <span className="flex-1 h-px bg-forest-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => useDemo(false)}
              disabled={demoLoading !== null}
              className="w-full"
            >
              {demoLoading === 'customer' ? <Spinner className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              Demo Customer
            </Button>
            <Button
              variant="secondary"
              onClick={() => useDemo(true)}
              disabled={demoLoading !== null}
              className="w-full"
            >
              {demoLoading === 'admin' ? <Spinner className="w-4 h-4" /> : <UserCog className="w-4 h-4" />}
              Demo Admin
            </Button>
          </div>
          <p className="text-[11px] text-center text-forest-400 mt-2">
            One-click access to a fully populated demo account &middot; no sign-up needed
          </p>
        </div>
      )}

      <p className="text-center text-sm text-forest-500 mt-5">
        {mode === 'login' ? 'New to TableHub?' : 'Already have an account?'}{' '}
        <button onClick={switchMode} className="font-semibold text-primary-700 hover:text-primary-800 hover:underline">
          {mode === 'login' ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </Modal>
  );
}
