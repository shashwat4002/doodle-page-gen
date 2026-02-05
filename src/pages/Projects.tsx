import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  const navigate = useNavigate();

  const { data } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: () => api.get<ProjectsResponse>("/projects"),
  });

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Research Projects</h1>
            <p className="text-muted-foreground">Manage and track your research missions.</p>
          </div>
          <Button onClick={() => navigate("/projects/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

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

