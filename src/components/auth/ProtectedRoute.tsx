import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  const location = useLocation();

  console.log("currentUser", currentUser);

  if (!currentUser) {
    // Redirect to login page but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
