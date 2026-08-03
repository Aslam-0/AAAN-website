import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchMe, login as apiLogin, loginWithGoogle as apiLoginWithGoogle, register as apiRegister, setToken, verifyOtp as apiVerifyOtp, resendOtp as apiResendOtp, updateProfile as apiUpdateProfile } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [requirePasswordSetup, setRequirePasswordSetup] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('glowora_token');
      if (!token) {
        setUser(null);
        return;
      }
      if (token === 'demo_admin_token') {
        setUser({
          _id: 'admin-demo-id',
          name: 'AAAN Admin',
          email: 'admin@aaanenterprises.com',
          role: 'admin',
          isAdmin: true
        });
        return;
      }
      const data = await fetchMe();
      setUser(data);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { token, user: u } = await apiLogin(email, password);
    setToken(token);
    setUser(u);
    return u;
  };

  const loginWithGoogle = async (credential) => {
    const res = await apiLoginWithGoogle(credential);
    setToken(res.token);
    setUser(res.user);
    if (res.requirePasswordSetup) {
      setRequirePasswordSetup(true);
      setShowLoginModal(true);
    }
    return res.user;
  };

  const register = async (name, email, password, photoFile) => {
    return await apiRegister(name, email, password, photoFile);
  };

  const verifyOtp = async (email, code) => {
    const { token, user: u } = await apiVerifyOtp(email, code);
    setToken(token);
    setUser(u);
    return u;
  };

  const resendOtp = async (email) => {
    return await apiResendOtp(email);
  };

  const updateProfile = async (fields) => {
    const updatedUser = await apiUpdateProfile(fields);
    setUser(updatedUser);
    return updatedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('glowora_token');
  };

  const loginAsAdminDemo = () => {
    const adminUser = {
      _id: 'admin-demo-id',
      name: 'AAAN Admin',
      email: 'admin@aaanenterprises.com',
      role: 'admin',
      isAdmin: true
    };
    setUser(adminUser);
    localStorage.setItem('glowora_token', 'demo_admin_token');
    return adminUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin' || user?.role === 'Admin' || user?.isAdmin === true || localStorage.getItem('glowora_token') === 'demo_admin_token',
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        verifyOtp,
        resendOtp,
        logout,
        loginAsAdminDemo,
        refreshUser: loadUser,
        updateProfile,
        showLoginModal,
        setShowLoginModal,
        requirePasswordSetup,
        setRequirePasswordSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
