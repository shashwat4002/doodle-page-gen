import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

type ProjectsResponse = {
  projects: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    currentStage?: string | null;
  }[];
};

const Projects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: () => api.get<ProjectsResponse>("/projects"),
  });

  const createProject = useMutation({
    mutationFn: (body: { title: string; description?: string }) =>
      api.post<{ project: unknown }>("/projects", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Project created" });
      setTitle("");
      setDescription("");
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    createProject.mutate({ title, description });
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Create a research project</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-1.5">
                <Input
                  placeholder="Project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Input
                  placeholder="Short description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={createProject.isPending || !title.trim()}
              >
                {createProject.isPending ? "Creating..." : "Create project"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Your projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.projects?.length ? (
              data.projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-border/60 bg-muted/60 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {project.title}
                      </p>
                      {project.description ? (
                        <p className="text-xs text-muted-foreground">
                          {project.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right text-[11px] text-muted-foreground">
                      <p className="uppercase tracking-wide">{project.status}</p>
                      <p>
                        Stage: {project.currentStage ?? "Not yet assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No projects yet – create your first research project above.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Projects;

