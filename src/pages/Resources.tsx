import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";

type Resource = {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  subject?: string | null;
  difficulty?: string | null;
};

type ResourcesResponse = {
  resources: Resource[];
};

const Resources = () => {
  const { toast } = useToast();

  const { data } = useQuery<ResourcesResponse>({
    queryKey: ["resources"],
    queryFn: () => api.get<ResourcesResponse>("/resources"),
  });

  const bookmark = useMutation({
    mutationFn: (id: string) => api.post(`/resources/${id}/bookmark`),
    onSuccess: () => {
      toast({ title: "Resource bookmarked" });
    },
  });

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Resource library</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Curated guides, templates, and tools to help you through each stage
            of the research pipeline. Admins can add more content from the
            backend.
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {data?.resources?.length ? (
            data.resources.map((resource) => (
              <Card
                key={resource.id}
                className="bg-background/60 backdrop-blur border-border/60 flex flex-col"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-2 text-sm">
                  {resource.description ? (
                    <p className="text-muted-foreground line-clamp-3">
                      {resource.description}
                    </p>
                  ) : null}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                    <div className="text-xs text-muted-foreground space-x-2">
                      {resource.subject ? <span>{resource.subject}</span> : null}
                      {resource.difficulty ? (
                        <span>· {resource.difficulty}</span>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        <a href={resource.url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs"
                        variant="ghost"
                        onClick={() => bookmark.mutate(resource.id)}
                      >
                        Bookmark
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-background/60 backdrop-blur border-border/60">
              <CardContent className="py-6 text-sm text-muted-foreground">
                No resources have been published yet. Admins can seed the
                library through the admin panel.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default Resources;

