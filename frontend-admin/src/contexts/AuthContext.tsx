import { createContext, useContext, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

type JwtPayload = {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  exp: number;
};

type AuthContextType = {
  user: JwtPayload | null;
  token: string | null;
  logout: () => any,
};

const AuthContext = createContext<AuthContextType>({ user: null, token: null, logout: () => { } });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = Cookies.get("jwt_admin") || null;
  let user: JwtPayload | null = null;
  if (token) {
    try {
      user = jwtDecode<JwtPayload>(token);
    } catch {
      user = null;
    }
  }

  const logout = useCallback(() => {
    Cookies.remove("jwt_admin");
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
