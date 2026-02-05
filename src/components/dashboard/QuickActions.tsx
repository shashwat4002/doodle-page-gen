import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Rocket, 
  BookOpen, 
  Users, 
  MessageSquare,
  FolderKanban,
  UserCheck
} from "lucide-react";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "New Project", icon: Rocket, href: "/projects/new", color: "text-primary" },
    { label: "View Projects", icon: FolderKanban, href: "/projects", color: "text-secondary" },
    { label: "Find Mentors", icon: UserCheck, href: "/matching", color: "text-accent" },
    { label: "Browse Resources", icon: BookOpen, href: "/resources", color: "text-primary" },
    { label: "Community Forum", icon: Users, href: "/community", color: "text-secondary" },
  ];

  return (
    <Card className="glass border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Rocket className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map(action => (
          <Button
            key={action.label}
            variant="outline"
            className="w-full justify-start bg-muted/30 hover:bg-muted/50 border-border/40"
            onClick={() => navigate(action.href)}
          >
            <action.icon className={`mr-3 h-4 w-4 ${action.color}`} />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
