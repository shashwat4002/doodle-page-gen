import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

type Thread = {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
};

type ThreadsResponse = {
  threads: Thread[];
};

const Community = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const { data } = useQuery<ThreadsResponse>({
    queryKey: ["threads"],
    queryFn: () => api.get<ThreadsResponse>("/community/threads"),
  });

  const createThread = useMutation({
    mutationFn: (body: { title: string; category: string }) =>
      api.post<{ thread: Thread }>("/community/threads", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      setTitle("");
      setCategory("");
      toast({ title: "Thread created" });
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    createThread.mutate({ title, category });
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Community discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <Input
                placeholder="Thread title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Input
                placeholder="Topic / category (e.g. Literature review, ML for astronomy)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={createThread.isPending || !title.trim()}
              >
                Start thread
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Recent threads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.threads?.length ? (
              data.threads.map((thread) => (
                <div
                  key={thread.id}
                  className="rounded-lg border border-border/60 bg-muted/60 px-4 py-3 text-sm"
                >
                  <p className="font-medium text-foreground">{thread.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {thread.category} ·{" "}
                    {new Date(thread.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No discussions yet – start a thread to get feedback from the
                SochX community.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Community;

