import { useEffect, useState, FormEvent } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/hooks/use-auth";
import { api } from "@/lib/api";

type UpdateProfileBody = {
  fullName?: string;
  academicLevel?: string;
  intendedFieldOfStudy?: string;
  researchInterests?: string[];
  skillTags?: string[];
  profilePhotoUrl?: string;
  currentJourneyStage?: string;
};

const Profile = () => {
  const { data } = useCurrentUser();
  const { toast } = useToast();
  const user = data?.user;

  const [form, setForm] = useState<UpdateProfileBody>({});

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        academicLevel: user.academicLevel ?? undefined,
        intendedFieldOfStudy: user.intendedFieldOfStudy ?? undefined,
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleChange = (
    key: keyof UpdateProfileBody,
    value: string | undefined,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/users/me", {
        ...form,
      });
      toast({ title: "Profile updated" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update profile";
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Your profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={form.fullName ?? ""}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Academic level</Label>
                <Select
                  value={form.academicLevel}
                  onValueChange={(value) => handleChange("academicLevel", value)}
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
                  value={form.intendedFieldOfStudy ?? ""}
                  onChange={(e) =>
                    handleChange("intendedFieldOfStudy", e.target.value)
                  }
                />
              </div>

              <Button type="submit">Save changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Profile;

