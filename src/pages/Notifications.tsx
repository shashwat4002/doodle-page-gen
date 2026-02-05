import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Notification = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  readAt?: string | null;
};

type NotificationsResponse = {
  notifications: Notification[];
};

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: () => api.get<NotificationsResponse>("/notifications"),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardContent className="space-y-3 py-4">
            {data?.notifications?.length ? (
              data.notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-muted/60 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{n.message}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.readAt && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => markRead.mutate(n.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No notifications yet – we&apos;ll surface mentor feedback, match
                requests, milestone completions, and replies here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Notifications;

