import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "./MainLayout";

export const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
