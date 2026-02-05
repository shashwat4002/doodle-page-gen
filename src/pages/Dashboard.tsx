import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type ProjectsResponse = {
  projects: {
    id: string;
    title: string;
    status: string;
    currentStage?: string | null;
  }[];
};

type NotificationsResponse = {
  notifications: {
    id: string;
    type: string;
    message: string;
    createdAt: string;
    readAt?: string | null;
  }[];
};

const Dashboard = () => {
  const { data: me } = useCurrentUser();

  const { data: projects } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: () => api.get<ProjectsResponse>("/projects"),
  });

  const { data: notifications } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: () => api.get<NotificationsResponse>("/notifications"),
  });

  const currentUser = me?.user;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-background/60 backdrop-blur border-border/60">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p className="text-base font-medium text-foreground">
                {currentUser?.fullName ?? "Researcher"}
              </p>
              <p>{currentUser?.academicLevel ?? "Set your academic level"}</p>
              <p>
                Current stage:{" "}
                <span className="font-medium">
                  {currentUser?.currentJourneyStage ?? "Not started"}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur border-border/60">
            <CardHeader>
              <CardTitle>Active projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {projects?.projects?.length ? (
                projects.projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {project.title}
                      </p>
                      <p className="text-muted-foreground">
                        Stage: {project.currentStage ?? "Unassigned"}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {project.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No projects yet – create your first research project to unlock
                  progress tracking.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur border-border/60">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {notifications?.notifications?.length ? (
                notifications.notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className="rounded-md bg-muted/60 px-3 py-2 text-xs"
                  >
                    <p className="text-foreground">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  You&apos;re all caught up. We&apos;ll surface mentor feedback,
                  match requests, and community replies here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Dashboard;

