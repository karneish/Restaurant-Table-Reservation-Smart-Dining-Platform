import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { UserRound, Mail, Phone, MapPin, CalendarHeart, Save, ShieldCheck, RefreshCw } from 'lucide-react';
import { userAPI, errorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/ui/Button';
import { Field, Input } from '../components/ui/Input';
import StatusBadge from '../components/ui/StatusBadge';
import type { ProfileData } from '../types';

export default function ProfilePage() {
  const { userEmail, userName, userRole, emailVerified, sendOtp, verifyOtp } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);

  useEffect(() => {
    userAPI.getProfile()
      .then((res) => setProfile(res.data.data))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const res = await userAPI.updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        dateOfBirth: profile.dateOfBirth,
      });
      setProfile(res.data.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update profile'));
    } finally {
      setSaving(false);
    }
  };

  const resend = async () => {
    setOtpBusy(true);
    try {
      await sendOtp(userEmail);
      toast.success('OTP sent (check the server console)');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not send OTP'));
    } finally {
      setOtpBusy(false);
    }
  };

  const verify = async () => {
    if (!/^\d{6}$/.test(otp)) { toast.error('Enter the 6-digit OTP'); return; }
    setOtpBusy(true);
    try {
      const ok = await verifyOtp(userEmail, otp.trim());
      if (ok) { toast.success('Email verified!'); setOtpOpen(false); setOtp(''); }
      else toast.error('Invalid OTP');
    } catch (err) {
      toast.error(errorMessage(err, 'Verification failed'));
    } finally {
      setOtpBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        icon={UserRound}
        title="My Profile"
        eyebrow="Account"
        subtitle="Keep your details up to date so reservations are smoother."
      />

      <div className="card p-6 flex flex-wrap items-center gap-4">
        <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center font-display text-2xl font-bold shadow-glow shrink-0">
          {(profile?.name || userName || 'G').trim().charAt(0).toUpperCase()}
        </span>
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-xl font-semibold text-forest-900">{profile?.name || userName}</h2>
            <StatusBadge status={emailVerified ? 'CONFIRMED' : 'HOLD'} dot={false} />
            {emailVerified ? <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Email verified</span> : (
              <button onClick={() => setOtpOpen((o) => !o)} className="text-sm font-semibold text-amber-600 hover:underline flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Verify email
              </button>
            )}
          </div>
          <p className="text-sm text-forest-500 flex items-center gap-1.5 mt-0.5">
            <Mail className="w-4 h-4 text-primary-500" /> {profile?.email || userEmail} · {userRole.toLowerCase()}
          </p>
        </div>
      </div>

      {otpOpen && !emailVerified && (
        <div className="card !p-5 space-y-3 animate-fade-up">
          <p className="text-sm text-forest-500">
            Enter the 6-digit OTP sent to <span className="font-semibold text-forest-800">{userEmail}</span> (check the server console — emails are simulated).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            <div className="flex gap-2">
              <Button onClick={verify} disabled={otpBusy} className="shrink-0"><ShieldCheck className="w-4 h-4" /> Verify</Button>
              <Button variant="secondary" onClick={resend} disabled={otpBusy} className="shrink-0"><RefreshCw className="w-4 h-4" /> Resend</Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card h-72 shimmer" />
      ) : (
        <form onSubmit={submit} className="card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name">
              <Input value={profile?.name ?? ''} onChange={(e) => setProfile({ ...profile!, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
                <Input value={profile?.email ?? userEmail} disabled className="pl-9" />
              </div>
            </Field>
            <Field label="Phone">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
                <Input value={profile?.phone ?? ''} placeholder="98765 43210" className="pl-9" onChange={(e) => setProfile({ ...profile!, phone: e.target.value })} />
              </div>
            </Field>
            <Field label="Date of birth">
              <div className="relative">
                <CalendarHeart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
                <Input type="date" value={profile?.dateOfBirth ?? ''} className="pl-9" onChange={(e) => setProfile({ ...profile!, dateOfBirth: e.target.value })} />
              </div>
            </Field>
            <Field label="Address">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
                <Input value={profile?.address ?? ''} placeholder="Your address" className="pl-9" onChange={(e) => setProfile({ ...profile!, address: e.target.value })} />
              </div>
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
