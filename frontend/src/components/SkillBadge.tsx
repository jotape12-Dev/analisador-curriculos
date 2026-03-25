import { Check, X } from "lucide-react";

interface SkillBadgeProps {
  skill: string;
  type: "found" | "missing";
}

export function SkillBadge({ skill, type }: SkillBadgeProps) {
  const isFound = type === "found";
  
  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border shadow-sm transition-colors
        ${isFound 
          ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900" 
          : "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900"
        }`}
    >
      {isFound ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      {skill}
    </span>
  );
}
