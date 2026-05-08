import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import {
  getCurrentUser,
  logoutUser as apiLogout,
  loginUser as apiLogin,
} from "../api/auth.api";
import { toast } from "react-toastify";
import AppLoader from "../components/ui/AppLoader";

let userCache = null;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => userCache || null);
  const [isAuth, setIsAuth] = useState(!!userCache);
  const [loading, setLoading] = useState(!userCache);

  const fetchUser = useCallback(async () => {
    if (userCache) {
      setLoading(false);
      return;
    }

    try {
      const data = await getCurrentUser();
      userCache = data.user;
      setUser(data.user);
      setIsAuth(true);
    } catch {
      userCache = null;
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = useCallback(async (credentials) => {
    const data = await apiLogin(credentials);

    userCache = data.user;
    setUser(data.user);
    setIsAuth(true);

    return data;
  }, []);

  const logoutUser = useCallback(async () => {
    const prevUser = user;

    userCache = null;
    setUser(null);
    setIsAuth(false);

    try {
      const data = await apiLogout();
      toast.success(data.message);
    } catch {
      toast.error("Logout failed, please try again.");
      userCache = prevUser;
      setUser(prevUser);
      setIsAuth(true);
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isAuth,
      setIsAuth,
      loading,
      logoutUser,
      loginUser,
    }),
    [user, isAuth, loading, logoutUser, loginUser],
  );

  if (loading) return <AppLoader />;

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};