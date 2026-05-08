import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const PublicRoute = () => {
  const { isAuth } = useAuthContext();

  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;