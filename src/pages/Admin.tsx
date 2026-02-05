import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type AnalyticsResponse = {
  users: number;
  projects: number;
  threads: number;
};

const Admin = () => {
  const { data } = useQuery<AnalyticsResponse>({
    queryKey: ["admin-analytics"],
    queryFn: () => api.get<AnalyticsResponse>("/admin/analytics"),
  });

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Admin panel</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Platform-level overview for SochX admins. Moderate users, monitor
            engagement, and seed resources from the backend.
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-background/60 backdrop-blur border-border/60">
            <CardHeader>
              <CardTitle className="text-sm">Users</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {data?.users ?? "—"}
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur border-border/60">
            <CardHeader>
              <CardTitle className="text-sm">Projects</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {data?.projects ?? "—"}
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur border-border/60">
            <CardHeader>
              <CardTitle className="text-sm">Community threads</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {data?.threads ?? "—"}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Admin;

