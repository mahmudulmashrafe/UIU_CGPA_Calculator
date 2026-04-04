import { Semester, calculateCGPA } from "@/lib/grading";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CGPADisplayProps {
  semesters: Semester[];
}

function getGradeColor(cgpa: number): string {
  if (cgpa >= 3.67) return "text-accent";
  if (cgpa >= 3.0) return "text-primary";
  if (cgpa >= 2.0) return "text-warning";
  return "text-destructive";
}

function getGradeLabel(cgpa: number): string {
  if (cgpa >= 3.90) return "Dean's List ⭐";
  if (cgpa >= 3.67) return "Excellent";
  if (cgpa >= 3.33) return "Very Good";
  if (cgpa >= 3.0) return "Good";
  if (cgpa >= 2.0) return "Satisfactory";
  if (cgpa >= 1.0) return "Below Average";
  return "Failing";
}

export function CGPADisplay({ semesters }: CGPADisplayProps) {
  const { cgpa, totalCredits } = calculateCGPA(semesters);
  const hasData = totalCredits > 0;

  return (
    <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-sm sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cumulative GPA
        </h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-warning hover:text-warning">
              <Info className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="end">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">UIU Grade Scale</p>
            <div className="grid grid-cols-1 gap-y-0.5 text-xs">
              {[
                ["A", "4.00", "90-100%"],
                ["A-", "3.67", "86-89%"],
                ["B+", "3.33", "82-85%"],
                ["B", "3.00", "78-81%"],
                ["B-", "2.67", "74-77%"],
                ["C+", "2.33", "70-73%"],
                ["C", "2.00", "66-69%"],
                ["C-", "1.67", "62-65%"],
                ["D+", "1.33", "58-61%"],
                ["D", "1.00", "55-57%"],
                ["F", "0.00", "<55%"],
              ].map(([g, p, r]) => (
                <div key={g} className="flex justify-between py-0.5 text-muted-foreground">
                  <span className="font-medium text-foreground">{g}</span>
                  <span>{p} · {r}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="text-center mb-4">
        <div className={`text-5xl font-bold tabular-nums ${hasData ? getGradeColor(cgpa) : "text-muted-foreground/30"}`}>
          {hasData ? cgpa.toFixed(2) : "0.00"}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {hasData ? getGradeLabel(cgpa) : "Add courses to start"}
        </div>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(cgpa / 4) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-xl bg-secondary/50">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Credits</p>
          <p className="text-xl font-bold text-foreground">{totalCredits}</p>
        </div>
        <div className="p-3 rounded-xl bg-secondary/50">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Semesters</p>
          <p className="text-xl font-bold text-foreground">{semesters.length}</p>
        </div>
      </div>
    </div>
  );
}
