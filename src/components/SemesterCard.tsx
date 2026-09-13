import { Semester, Course, createCourse, calculateSemesterGPA } from "@/lib/grading";
import { CourseRow } from "./CourseRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface SemesterCardProps {
  semester: Semester;
  onChange: (semester: Semester) => void;
  onRemove: () => void;
  readOnlyName?: boolean;
}

export function SemesterCard({ semester, onChange, onRemove, readOnlyName = false }: SemesterCardProps) {
  const { gpa, totalCredits } = calculateSemesterGPA(semester.courses);

  const updateCourse = (index: number, course: Course) => {
    const courses = [...semester.courses];
    courses[index] = course;
    onChange({ ...semester, courses });
  };

  const removeCourse = (index: number) => {
    const courses = semester.courses.filter((_, i) => i !== index);
    onChange({ ...semester, courses });
  };

  const addCourse = () => {
    onChange({ ...semester, courses: [...semester.courses, createCourse()] });
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between gap-2 bg-secondary/40">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          {readOnlyName ? (
            <span className="text-sm font-semibold text-foreground">{semester.name}</span>
          ) : (
            <Input
              value={semester.name}
              onChange={(e) => onChange({ ...semester, name: e.target.value })}
              className="h-8 text-sm font-semibold border-0 bg-transparent shadow-none max-w-[200px] focus-visible:ring-1"
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">GPA</p>
            <p className="text-lg font-bold text-primary leading-tight">
              {totalCredits > 0 ? gpa.toFixed(2) : "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Credits</p>
            <p className="text-lg font-bold text-foreground leading-tight">{totalCredits}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onRemove}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-1.5">
        {/* Header row for Desktop */}
        <div className="hidden md:grid md:grid-cols-[1fr_5rem_4.5rem_6rem_3.5rem_6.5rem_3.5rem_2rem] items-center gap-2 py-2 px-3">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">COURSE</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center">CREDIT</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center">MARKS</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center">GRADE</span>
          <div className="flex items-center justify-center" title="Retake / Improve">
            <RotateCcwIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center">PREV</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center">GP</span>
          <span></span>
        </div>

        {semester.courses.map((course, i) => (
          <CourseRow
            key={course.id}
            course={course}
            index={i}
            onChange={(c) => updateCourse(i, c)}
            onRemove={() => removeCourse(i)}
          />
        ))}

        <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground hover:text-primary" onClick={addCourse}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Course
        </Button>
      </CardContent>
    </Card>
  );
}

function RotateCcwIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
