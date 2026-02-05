import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardShell } from "@/components/DashboardShell";
import { useAuthActions } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

const AuthLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password, rememberMe });
      toast({ title: "Welcome back to SochX 🚀" });
      navigate("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to login right now";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardShell className="items-center justify-center">
      <Card className="w-full max-w-md bg-background/60 backdrop-blur-xl border-border/60 shadow-xl">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to SochX
            </h1>
            <p className="text-sm text-muted-foreground">
              Continue your research journey where you left off.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(v === true)}
                />
                Remember this device
              </label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => navigate("/auth/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                toast({
                  title: "Google Sign-in",
                  description:
                    "The backend now verifies Google ID tokens at /api/auth/google. Wire this button to Google Identity Services to obtain an id_token and POST it there.",
                })
              }
            >
              Continue with Google
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              New to SochX?{" "}
              <Link
                to="/auth/register"
                className="text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );
};

export default AuthLogin;

