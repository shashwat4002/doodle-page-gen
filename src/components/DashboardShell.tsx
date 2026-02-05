import { ReactNode } from "react";
import { StarField } from "@/components/StarField";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: ReactNode;
  className?: string;
};

export const DashboardShell = ({ children, className }: DashboardShellProps) => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <StarField />
      <Navbar />
      <main
        className={cn(
          "relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-10 flex flex-col gap-6",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
};

