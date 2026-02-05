import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type Stage = {
  id: string;
  stage: string;
  completion: number;
};

type PipelineProject = {
  id: string;
  title: string;
  stages: Stage[];
};

type PipelineResponse = {
  projects: PipelineProject[];
};

const orderedStages = [
  "EXPLORATION",
  "TOPIC_DISCOVERY",
  "LITERATURE_REVIEW",
  "METHODOLOGY",
  "EXECUTION",
  "DOCUMENTATION",
  "PUBLICATION",
] as const;

const Pipeline = () => {
  const { data } = useQuery<PipelineResponse>({
    queryKey: ["pipeline"],
    queryFn: () => api.get<PipelineResponse>("/projects"),
  });

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Research pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            Track each project&apos;s journey from exploration to publication.
            Stages use completion percentages, milestones, and mentor feedback
            on the backend.
          </CardContent>
        </Card>

        {data?.projects?.length ? (
          data.projects.map((project) => (
            <Card
              key={project.id}
              className="bg-background/60 backdrop-blur border-border/60"
            >
              <CardHeader>
                <CardTitle className="text-base">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderedStages.map((stageName) => {
                  const stage = project.stages.find(
                    (s) => s.stage === stageName,
                  );
                  const completion = stage?.completion ?? 0;
                  return (
                    <div key={stageName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">
                          {stageName.replace("_", " ")}
                        </span>
                        <span className="text-muted-foreground">
                          {completion}%
                        </span>
                      </div>
                      <Progress
                        value={completion}
                        className="h-1.5 bg-muted/60"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-background/60 backdrop-blur border-border/60">
            <CardContent className="py-6 text-sm text-muted-foreground">
              Once you create projects, you&apos;ll see their pipeline stages
              visualised here.
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default Pipeline;

