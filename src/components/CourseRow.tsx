import { Course, GRADES, CREDIT_OPTIONS, getGradePoint, getGradeFromScore } from "@/lib/grading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, RotateCcw } from "lucide-react";

interface CourseRowProps {
  course: Course;
  index: number;
  onChange: (course: Course) => void;
  onRemove: () => void;
}

export function CourseRow({ course, index, onChange, onRemove }: CourseRowProps) {
  const gradePoint = course.grade ? getGradePoint(course.grade) : null;
  const prevPoint = course.isRetake && course.previousGrade ? getGradePoint(course.previousGrade) : null;
  const improved = prevPoint !== null && gradePoint !== null && gradePoint > prevPoint;

  return (
    <div className="grid grid-cols-[2rem_4.5rem_200px_5rem_4rem_6rem_3rem_7rem_4rem_2.5rem] items-center gap-2 py-2 px-3 rounded-lg bg-background border border-border/60 hover:border-primary/30 transition-colors group">
      <span className="text-xs font-medium text-muted-foreground text-center">{index + 1}</span>

      <Input
        placeholder="Code"
        value={course.code}
        onChange={(e) => onChange({ ...course, code: e.target.value })}
        className="h-8 text-sm border border-border/60 bg-transparent shadow-none focus-visible:ring-1"
      />

      <Input
        placeholder="Course name"
        value={course.name}
        onChange={(e) => onChange({ ...course, name: e.target.value })}
        className="h-8 text-sm border border-border/60 bg-transparent shadow-none focus-visible:ring-1 text-center"
      />

      <Select
        value={String(course.credit)}
        onValueChange={(v) => onChange({ ...course, credit: parseFloat(v) })}
      >
        <SelectTrigger className="h-8 text-sm">
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

      <Input
        type="number"
        placeholder="00"
        min="0"
        max="100"
        value={course.score || ""}
        onChange={(e) => {
          const score = e.target.value ? parseFloat(e.target.value) : undefined;
          const newGrade = score !== undefined ? getGradeFromScore(score) : "";
          onChange({ ...course, score, grade: newGrade });
        }}
        className="h-8 text-sm border border-border/60 bg-transparent shadow-none focus-visible:ring-1 text-center"
      />

      <Select
        value={course.grade || "none"}
        onValueChange={(v) => onChange({ ...course, grade: v === "none" ? "" : v, score: undefined })}
      >
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">--</SelectItem>
          {GRADES.map((g) => (
            <SelectItem key={g.label} value={g.label}>
              {g.label} ({g.point.toFixed(2)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-center" title="Retake / Improve">
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
          <SelectTrigger className="h-8 text-sm border-dashed">
            <SelectValue placeholder="Old grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">--</SelectItem>
            {GRADES.map((g) => (
              <SelectItem key={g.label} value={g.label}>
                {g.label} ({g.point.toFixed(2)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="h-8 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">—</span>
        </div>
      )}

      <div className="flex items-center justify-center">
        {gradePoint !== null && (
          <span className={`text-sm font-semibold ${improved ? "text-accent" : "text-foreground"}`}>
            {gradePoint.toFixed(2)}
            {improved && <RotateCcw className="inline ml-1 h-3 w-3" />}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
