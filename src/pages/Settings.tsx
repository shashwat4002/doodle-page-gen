import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const { logout } = useAuthActions();

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion",
      description:
        "Wire this button to a backend /users/me DELETE endpoint before enabling in production.",
    });
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Notification preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Email alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Receive email notifications for mentor feedback and match
                  requests.
                </p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">In-app notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Real-time updates via the notification center.
                </p>
              </div>
              <Switch checked={true} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Account &amp; privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={async () => {
                await logout.mutateAsync();
                toast({ title: "Signed out" });
              }}
            >
              Sign out of SochX
            </Button>
            <div className="pt-2 border-t border-border/60 space-y-2">
              <p className="text-sm font-medium text-destructive">
                Delete account
              </p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your profile, projects, and community
                history. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                Request deletion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Settings;

