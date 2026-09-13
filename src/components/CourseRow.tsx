import { useState } from "react";
import { Course, GRADES, CREDIT_OPTIONS, getGradePoint, getGradeFromScore } from "@/lib/grading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, RotateCcw } from "lucide-react";

interface CourseRowProps {
  course: Course;
  index: number;
  onChange: (course: Course) => void;
  onRemove: () => void;
}

function GradeSelector({ course, onChange }: { course: Course; onChange: (course: Course) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 w-full justify-between text-xs px-2.5 font-normal border-border/60 bg-background">
          <span className="truncate font-medium">
            {course.grade ? `${course.grade} (${getGradePoint(course.grade).toFixed(2)})` : "Select Grade"}
          </span>
          <span className="text-[10px] text-muted-foreground ml-1">▾</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2.5" align="start">
        <div className="mb-2 pb-2 border-b border-border/60">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            Or Enter Marks (0-100)
          </label>
          <Input
            type="number"
            placeholder="e.g. 85"
            min="0"
            max="100"
            value={course.score !== undefined ? course.score : ""}
            onChange={(e) => {
              const score = e.target.value !== "" ? parseFloat(e.target.value) : undefined;
              const newGrade = score !== undefined ? getGradeFromScore(score) : "";
              onChange({ ...course, score, grade: newGrade });
            }}
            className="h-8 text-xs text-center border-border/60"
          />
        </div>

        <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => {
              onChange({ ...course, grade: "", score: undefined });
              setOpen(false);
            }}
            className={`w-full text-left px-2 py-1 rounded text-xs hover:bg-secondary flex justify-between items-center transition-colors ${!course.grade ? "font-bold bg-secondary/80" : ""}`}
          >
            <span className="text-muted-foreground">-- None --</span>
          </button>
          {GRADES.map((g) => (
            <button
              type="button"
              key={g.label}
              onClick={() => {
                onChange({ ...course, grade: g.label, score: undefined });
                setOpen(false);
              }}
              className={`w-full text-left px-2 py-1 rounded text-xs hover:bg-secondary flex justify-between items-center transition-colors ${course.grade === g.label ? "font-bold bg-secondary/80 text-primary" : ""}`}
            >
              <span className="font-semibold">{g.label}</span>
              <span className="text-[10px] text-muted-foreground">{g.point.toFixed(2)} pts</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CourseRow({ course, index, onChange, onRemove }: CourseRowProps) {
  const gradePoint = course.grade ? getGradePoint(course.grade) : null;
  const prevPoint = course.isRetake && course.previousGrade ? getGradePoint(course.previousGrade) : null;
  const improved = prevPoint !== null && gradePoint !== null && gradePoint > prevPoint;

  return (
    <>
      {/* Mobile View (< md) */}
      <div className="md:hidden rounded-lg bg-background border border-border/60 p-3 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">Course {index + 1}</span>
            {gradePoint !== null && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded bg-secondary ${improved ? "text-accent" : "text-foreground"}`}>
                GP: {gradePoint.toFixed(2)}
                {improved && <RotateCcw className="inline ml-1 h-3 w-3" />}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground block mb-1">Credit</label>
            <Select
              value={String(course.credit)}
              onValueChange={(v) => onChange({ ...course, credit: parseFloat(v) })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CREDIT_OPTIONS.map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {c} cr
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-muted-foreground block mb-1">Grade</label>
            <GradeSelector course={course} onChange={onChange} />
          </div>
        </div>

        <div className="text-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-medium text-muted-foreground">Retake</label>
            <Switch
              checked={course.isRetake}
              onCheckedChange={(v) => onChange({ ...course, isRetake: v, previousGrade: v ? course.previousGrade : "" })}
              className="scale-75"
            />
          </div>

          {course.isRetake ? (
            <Select
              value={course.previousGrade || "none"}
              onValueChange={(v) => onChange({ ...course, previousGrade: v === "none" ? "" : v })}
            >
              <SelectTrigger className="h-8 text-xs border-dashed">
                <SelectValue placeholder="Previous Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Previous Grade</SelectItem>
                {GRADES.map((g) => (
                  <SelectItem key={g.label} value={g.label}>
                    {g.label} ({g.point.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="h-8 flex items-center text-xs text-muted-foreground px-2">—</div>
          )}
        </div>
      </div>

      {/* Web / Desktop View (>= md) */}
      <div className="hidden md:block rounded-lg bg-background border border-border/60 p-3.5 space-y-3 shadow-xs transition-colors hover:border-primary/30">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">Course {index + 1}</span>
            {gradePoint !== null && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded bg-secondary ${improved ? "text-accent" : "text-foreground"}`}>
                GP: {gradePoint.toFixed(2)}
                {improved && <RotateCcw className="inline ml-1 h-3 w-3" />}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs items-end">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground block mb-1">Credit</label>
            <Select
              value={String(course.credit)}
              onValueChange={(v) => onChange({ ...course, credit: parseFloat(v) })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CREDIT_OPTIONS.map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {c} cr
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-muted-foreground block mb-1">Grade</label>
            <GradeSelector course={course} onChange={onChange} />
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-medium text-muted-foreground">Retake</label>
              <Switch
                checked={course.isRetake}
                onCheckedChange={(v) => onChange({ ...course, isRetake: v, previousGrade: v ? course.previousGrade : "" })}
                className="scale-75"
              />
            </div>

            {course.isRetake ? (
              <Select
                value={course.previousGrade || "none"}
                onValueChange={(v) => onChange({ ...course, previousGrade: v === "none" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-xs border-dashed">
                  <SelectValue placeholder="Previous Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Previous Grade</SelectItem>
                  {GRADES.map((g) => (
                    <SelectItem key={g.label} value={g.label}>
                      {g.label} ({g.point.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="h-8 flex items-center text-xs text-muted-foreground px-2">—</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
