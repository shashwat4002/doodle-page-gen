import { useState, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DashboardShell } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

const AuthResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    try {
      await api.post("/auth/reset-password", { token, password });
      toast({
        title: "Password updated",
        description: "You can now sign in with your new password.",
      });
      navigate("/auth/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reset password";
      toast({
        title: "Reset failed",
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
              Choose a new password
            </h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full">
              Update password
            </Button>
          </form>
        </div>
      </Card>
    </DashboardShell>
  );
};

export default AuthResetPassword;

