import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type Match = {
  id: string;
  fullName: string;
  academicLevel?: string | null;
  researchInterests: string[];
  skillTags: string[];
  role: string;
  score: number;
};

type MatchesResponse = {
  matches: Match[];
};

const Matching = () => {
  const { data } = useQuery<MatchesResponse>({
    queryKey: ["matches"],
    queryFn: () => api.get<MatchesResponse>("/matching/suggested"),
  });

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-background/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Matching &amp; collaboration</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We suggest peers and mentors based on shared interests, academic
            level, and complementary skills. Use this as a starting point for
            collaboration requests.
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {data?.matches?.length ? (
            data.matches.map((match) => (
              <Card
                key={match.id}
                className="bg-background/60 backdrop-blur border-border/60"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    <span>{match.fullName}</span>
                    <Badge variant="outline" className="text-[11px]">
                      {match.role.toLowerCase().replace("_", " ")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {match.academicLevel ? (
                    <p className="text-muted-foreground">
                      {match.academicLevel}
                    </p>
                  ) : null}
                  {match.researchInterests.length ? (
                    <p>
                      <span className="text-muted-foreground">Interests:</span>{" "}
                      {match.researchInterests.join(", ")}
                    </p>
                  ) : null}
                  {match.skillTags.length ? (
                    <p>
                      <span className="text-muted-foreground">Skills:</span>{" "}
                      {match.skillTags.join(", ")}
                    </p>
                  ) : null}
                  <p className="text-[11px] text-muted-foreground">
                    Match score: {match.score}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-background/60 backdrop-blur border-border/60">
              <CardContent className="py-6 text-sm text-muted-foreground">
                Once your profile includes interests and skills, we&apos;ll
                surface suggested collaborators and mentors here.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default Matching;

