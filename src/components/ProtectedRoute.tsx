import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/hooks/use-auth";
import { DashboardShell } from "./DashboardShell";
import { Skeleton } from "./ui/skeleton";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export const ProtectedRoute = ({
  children,
  requireAdmin,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48 bg-muted/60" />
          <Skeleton className="h-40 w-full bg-muted/60" />
        </div>
      </DashboardShell>
    );
  }

  const user = data?.user;

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  useRealtimeNotifications();

  return <>{children}</>;
};

