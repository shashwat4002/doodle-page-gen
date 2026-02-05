import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DashboardShell } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

const AuthForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast({
        title: "Check your email",
        description:
          "If an account exists for that address, we’ve sent a reset link.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send reset email";
      toast({
        title: "Something went wrong",
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
              Reset your password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the email associated with your SochX account.
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

            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>

          {submitted && (
            <p className="text-xs text-muted-foreground text-center">
              If we find an account for that email, you&apos;ll receive a reset
              link shortly.
            </p>
          )}
        </div>
      </Card>
    </DashboardShell>
  );
};

export default AuthForgotPassword;

