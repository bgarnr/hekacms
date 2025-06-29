import { createContext, useContext, useState, ReactNode } from "react";
import { login as apiLogin, register as apiRegister, getCurrentUser } from "../api/auth";

type User = {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      console.log(`Attempting login for: ${email}`);
      const response = await apiLogin(email, password);
      console.log('Login response:', response);
      
      if (response?.refreshToken || response?.accessToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("accessToken", response.accessToken);
        setUser({
          _id: response._id,
          email: response.email,
          role: response.role,
          createdAt: response.createdAt,
          lastLoginAt: response.lastLoginAt,
          isActive: response.isActive,
        });
        setIsAuthenticated(true);
        console.log(`Login successful for: ${email} with role: ${response.role}`);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error(`Login failed for ${email}:`, error.message);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(error?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, role?: string) => {
    try {
      console.log(`Attempting registration for: ${email} with role: ${role}`);
      const response = await apiRegister(email, password, role);
      console.log('Registration response:', response);
      console.log(`User registered successfully: ${email} with role: ${response.role}`);
    } catch (error) {
      console.error(`Registration failed for ${email}:`, error.message);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const logout = () => {
    console.log('User logging out');
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}