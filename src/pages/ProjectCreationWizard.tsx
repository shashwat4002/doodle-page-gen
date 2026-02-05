import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Rocket, BookOpen, Target, FileUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STEPS = [
  { id: "title", title: "Project Title", description: "What's the name of your research journey?", icon: Rocket },
  { id: "field", title: "Research Field", description: "Which domain does your research belong to?", icon: BookOpen },
  { id: "objective", title: "Research Objective", description: "What do you aim to discover or prove?", icon: Target },
  { id: "proposal", title: "Proposal Upload", description: "Upload your initial research proposal (optional)", icon: FileUp },
  { id: "review", title: "Final Review", description: "Confirm your project details", icon: Check },
];

const ProjectCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    field: "",
    objective: "",
    proposalUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Math.random()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("project_documents")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("project_documents")
        .getPublicUrl(data.path);

      setFormData({ ...formData, proposalUrl: publicUrl });
      toast({ title: "Proposal uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Please try again or skip this step",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post("/projects", formData);
      toast({
        title: "Project created successfully!",
        description: "Your research pipeline has been automatically generated.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Failed to create project",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto py-10">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((s, idx) => (
              <div
                key={s.id}
                className={`h-2 flex-1 mx-1 rounded-full transition-colors ${
                  idx <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-foreground">Project Wizard</h1>
          <p className="text-muted-foreground">Follow the steps to launch your mission.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-background/60 backdrop-blur border-border/60 overflow-hidden">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 min-h-[200px] flex items-center justify-center">
                {currentStep === 0 && (
                  <Input
                    placeholder="Enter project title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg py-6"
                    autoFocus
                  />
                )}
                {currentStep === 1 && (
                  <Input
                    placeholder="e.g. Astrophysics, Behavioral Economics..."
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="text-lg py-6"
                    autoFocus
                  />
                )}
                {currentStep === 2 && (
                  <Textarea
                    placeholder="Describe your research goal in detail..."
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="text-lg min-h-[150px]"
                    autoFocus
                  />
                )}
                {currentStep === 3 && (
                  <div className="space-y-4 w-full">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <FileUp className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOC up to 20MB</p>
                    </div>
                    {formData.proposalUrl && (
                      <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/5 p-3 rounded-lg">
                        <Check className="w-4 h-4" />
                        Proposal linked successfully
                      </div>
                    )}
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/40">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Title</span>
                        <p className="font-medium">{formData.title}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/40">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Field</span>
                        <p className="font-medium">{formData.field}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/40">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Objective</span>
                      <p className="font-medium line-clamp-3">{formData.objective}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/40 pt-6">
                <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                {currentStep === STEPS.length - 1 ? (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Generating Pipeline..." : "Launch Mission"}
                    <Rocket className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 0 && !formData.title) ||
                      (currentStep === 1 && !formData.field) ||
                      (currentStep === 2 && !formData.objective) ||
                      isUploading
                    }
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
};

export default ProjectCreationWizard;
