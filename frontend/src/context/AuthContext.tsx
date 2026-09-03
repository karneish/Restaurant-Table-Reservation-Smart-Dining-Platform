import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authAPI, errorMessage } from '../services/api';
import type { AuthResponse } from '../types';

export const GUEST_EMAIL = 'guest@tablehub.com';
export const GUEST_NAME = 'Guest';
export const GUEST_ROLE = 'GUEST';

interface AuthContextType {
  userEmail: string;
  userName: string;
  userRole: string;
  userId: number | null;
  emailVerified: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: (admin?: boolean) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStored(key: string, fallback: string): string {
  return localStorage.getItem(key) ?? fallback;
}

function persistAuth(res: AuthResponse) {
  localStorage.setItem('token', res.token);
  localStorage.setItem('refreshToken', res.refreshToken);
  localStorage.setItem('userEmail', res.email);
  localStorage.setItem('userName', res.name);
  localStorage.setItem('userRole', res.role);
  localStorage.setItem('userId', String(res.userId));
  localStorage.setItem('emailVerified', res.emailVerified ? '1' : '0');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState<string>(() => readStored('userEmail', GUEST_EMAIL));
  const [userName, setUserName] = useState<string>(() => readStored('userName', GUEST_NAME));
  const [userRole, setUserRole] = useState<string>(() => readStored('userRole', GUEST_ROLE));
  const [userId, setUserId] = useState<number | null>(() => {
    const v = localStorage.getItem('userId');
    return v ? Number(v) : null;
  });
  const [emailVerified, setEmailVerified] = useState<boolean>(() => localStorage.getItem('emailVerified') === '1');

  useEffect(() => {
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userRole', userRole);
    if (userId !== null) localStorage.setItem('userId', String(userId));
  }, [userEmail, userName, userRole, userId]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const data = res.data.data;
    persistAuth(data);
    setToken(data.token);
    setUserEmail(data.email);
    setUserName(data.name);
    setUserRole(data.role);
    setUserId(data.userId);
    setEmailVerified(data.emailVerified);
    return data.emailVerified;
  }, []);

  const demoLogin = useCallback(async (admin = false) => {
    const res = await authAPI.demo(admin);
    const data = res.data.data;
    persistAuth(data);
    setToken(data.token);
    setUserEmail(data.email);
    setUserName(data.name);
    setUserRole(data.role);
    setUserId(data.userId);
    setEmailVerified(true);
    return true;
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; phone?: string }) => {    const res = await authAPI.register(data);
    const auth = res.data.data;
    persistAuth(auth);
    setToken(auth.token);
    setUserEmail(auth.email);
    setUserName(auth.name);
    setUserRole(auth.role);
    setUserId(auth.userId);
    setEmailVerified(auth.emailVerified);
    return auth.emailVerified;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('emailVerified');
    setToken(null);
    setUserEmail(GUEST_EMAIL);
    setUserName(GUEST_NAME);
    setUserRole(GUEST_ROLE);
    setUserId(null);
    setEmailVerified(false);
  }, []);

  const refresh = useCallback(async () => {
    const rt = localStorage.getItem('refreshToken');
    if (!rt) return;
    try {
      const res = await authAPI.refresh(rt);
      const data = res.data.data;
      persistAuth(data);
      setToken(data.token);
      setUserEmail(data.email);
      setUserName(data.name);
      setUserRole(data.role);
      setUserId(data.userId);
      setEmailVerified(data.emailVerified);
    } catch {
      logout();
    }
  }, [logout]);

  const sendOtp = useCallback(async (email: string) => {
    await authAPI.sendOtp(email);
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const res = await authAPI.verifyOtp(email, otp);
    const verified = res.data.data;
    if (verified) setEmailVerified(true);
    return verified;
  }, []);

  return (
      <AuthContext.Provider
        value={{
          userEmail,
          userName,
          userRole,
          userId,
          emailVerified,
          isAuthenticated: !!token,
          isAdmin: userRole === 'ADMIN',
          login,
          demoLogin,
          register,
          logout,
          refresh,
          sendOtp,
          verifyOtp,
        }}
      >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export { errorMessage };
