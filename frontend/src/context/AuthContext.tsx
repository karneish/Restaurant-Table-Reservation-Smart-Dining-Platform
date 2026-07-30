import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, email: string, name: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem('userEmail'));
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));
  const [userRole, setUserRole] = useState<string | null>(() => localStorage.getItem('userRole'));

  const login = (token: string, email: string, name: string, role: string) => {
    setToken(token);
    setUserEmail(email);
    setUserName(name);
    setUserRole(role);
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    setUserName(null);
    setUserRole(null);
    localStorage.clear();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      userEmail,
      userName,
      userRole,
      isAuthenticated: !!token,
      isAdmin: userRole === 'ADMIN',
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
