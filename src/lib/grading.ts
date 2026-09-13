// UIU Grading System
export const GRADES = [
  { label: "A",  point: 4.00 },
  { label: "A-", point: 3.67 },
  { label: "B+", point: 3.33 },
  { label: "B",  point: 3.00 },
  { label: "B-", point: 2.67 },
  { label: "C+", point: 2.33 },
  { label: "C",  point: 2.00 },
  { label: "C-", point: 1.67 },
  { label: "D+", point: 1.33 },
  { label: "D",  point: 1.00 },
  { label: "F",  point: 0.00 },
] as const;

export const CREDIT_OPTIONS = [1, 1.5, 2, 3, 4] as const;

export interface Course {
  id: string;
  code?: string;
  name: string;
  credit: number;
  grade: string;
  score?: number;
  isRetake: boolean;
  previousGrade: string;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export function getGradePoint(gradeLabel: string): number {
  const grade = GRADES.find((g) => g.label === gradeLabel);
  return grade ? grade.point : 0;
}

export function getGradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 86) return "A-";
  if (score >= 82) return "B+";
  if (score >= 78) return "B";
  if (score >= 74) return "B-";
  if (score >= 70) return "C+";
  if (score >= 66) return "C";
  if (score >= 62) return "C-";
  if (score >= 58) return "D+";
  if (score >= 55) return "D";
  return "F";
}

export function calculateSemesterGPA(courses: Course[]): { gpa: number; totalCredits: number; totalPoints: number } {
  let totalCredits = 0;
  let totalPoints = 0;

  for (const course of courses) {
    if (!course.grade) continue;
    const point = getGradePoint(course.grade);
    totalCredits += course.credit;
    totalPoints += point * course.credit;
  }

  return {
    gpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    totalCredits,
    totalPoints,
  };
}

export function calculateCGPA(semesters: Semester[]): { cgpa: number; totalCredits: number; totalPoints: number } {
  let totalCredits = 0;
  let totalPoints = 0;

  for (const semester of semesters) {
    for (const course of semester.courses) {
      if (!course.grade) continue;
      const newPoint = getGradePoint(course.grade);

      if (course.isRetake && course.previousGrade) {
        const prevPoint = getGradePoint(course.previousGrade);
        totalPoints += (newPoint - prevPoint) * course.credit;
      } else {
        totalCredits += course.credit;
        totalPoints += newPoint * course.credit;
      }
    }
  }

  return {
    cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    totalCredits,
    totalPoints,
  };
}

export function calculateCombinedCGPA(
  priorCgpa: number,
  priorCredits: number,
  semesters: Semester[]
): { newCgpa: number; newTotalCredits: number; netSemesterPoints: number } {
  let netCreditsAdded = 0;
  let netPointsAdded = 0;

  for (const semester of semesters) {
    for (const course of semester.courses) {
      if (!course.grade) continue;
      const newPoint = getGradePoint(course.grade);

      if (course.isRetake && course.previousGrade) {
        const prevPoint = getGradePoint(course.previousGrade);
        netPointsAdded += (newPoint - prevPoint) * course.credit;
      } else {
        netCreditsAdded += course.credit;
        netPointsAdded += newPoint * course.credit;
      }
    }
  }

  const priorPoints = priorCgpa * priorCredits;
  const finalTotalPoints = priorPoints + netPointsAdded;
  const finalTotalCredits = priorCredits + netCreditsAdded;

  return {
    newCgpa: finalTotalCredits > 0 ? finalTotalPoints / finalTotalCredits : 0,
    newTotalCredits: finalTotalCredits,
    netSemesterPoints: netPointsAdded,
  };
}

export function createCourse(partialName = ""): Course {
  return {
    id: crypto.randomUUID(),
    name: partialName,
    credit: 3,
    grade: "",
    isRetake: false,
    previousGrade: "",
  };
}

export function createSemester(index: number): Semester {
  return {
    id: crypto.randomUUID(),
    name: `Semester ${index}`,
    courses: [createCourse(), createCourse()],
  };
}

