import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardShell } from "@/components/DashboardShell";
import { useAuthActions } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

const AuthRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuthActions();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [academicLevel, setAcademicLevel] = useState<string | undefined>();
  const [intendedFieldOfStudy, setIntendedFieldOfStudy] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [skillTags, setSkillTags] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register.mutateAsync({
        fullName,
        email,
        password,
        academicLevel,
        intendedFieldOfStudy,
        researchInterests: researchInterests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skillTags: skillTags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast({
        title: "Account created",
        description: "Welcome to SochX – your research journey starts now.",
      });
      navigate("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to register right now";
      toast({
        title: "Sign up failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardShell className="items-center justify-center">
      <Card className="w-full max-w-xl bg-background/60 backdrop-blur-xl border-border/60 shadow-xl">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your SochX account
            </h1>
            <p className="text-sm text-muted-foreground">
              Share your academic context so we can match you with the right
              projects and mentors.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label>Academic level</Label>
              <Select
                value={academicLevel}
                onValueChange={(value) => setAcademicLevel(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High school">High school</SelectItem>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Masters">Masters</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">Intended field of study</Label>
              <Input
                id="field"
                placeholder="e.g. Astrophysics, AI, Economics"
                value={intendedFieldOfStudy}
                onChange={(e) => setIntendedFieldOfStudy(e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="interests">Research interests</Label>
              <Input
                id="interests"
                placeholder="Comma-separated, e.g. exoplanets, signal processing"
                value={researchInterests}
                onChange={(e) => setResearchInterests(e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="skills">Skills / tags</Label>
              <Input
                id="skills"
                placeholder="Comma-separated, e.g. Python, data analysis, LaTeX"
                value={skillTags}
                onChange={(e) => setSkillTags(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Button
                type="submit"
                className="w-full"
                disabled={register.isPending}
              >
                {register.isPending ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </DashboardShell>
  );
};

export default AuthRegister;

