import { describe, it, expect } from "vitest";
import {
  Semester,
  calculateSemesterGPA,
  calculateCGPA,
  calculateCombinedCGPA,
  createCourse,
} from "@/lib/grading";

describe("Grading Library", () => {
  it("calculates semester GPA correctly", () => {
    const course1 = { ...createCourse("Course 1"), credit: 3, grade: "A" }; // 4.00 * 3 = 12
    const course2 = { ...createCourse("Course 2"), credit: 3, grade: "B" }; // 3.00 * 3 = 9
    const result = calculateSemesterGPA([course1, course2]);

    expect(result.totalCredits).toBe(6);
    expect(result.totalPoints).toBe(21);
    expect(result.gpa).toBeCloseTo(3.5, 2);
  });

  it("calculates CGPA across multiple semesters without retake", () => {
    const sem1: Semester = {
      id: "s1",
      name: "Semester 1",
      courses: [
        { ...createCourse("Course 1"), credit: 3, grade: "B" }, // 3.00 * 3 = 9
      ],
    };
    const sem2: Semester = {
      id: "s2",
      name: "Semester 2",
      courses: [
        { ...createCourse("Course 2"), credit: 3, grade: "A" }, // 4.00 * 3 = 12
      ],
    };

    const result = calculateCGPA([sem1, sem2]);
    expect(result.totalCredits).toBe(6);
    expect(result.totalPoints).toBe(21);
    expect(result.cgpa).toBeCloseTo(3.5, 2);
  });

  it("handles retake course by replacing previous grade and avoiding duplicate credits", () => {
    const sem1: Semester = {
      id: "s1",
      name: "Semester 1",
      courses: [
        { ...createCourse("Course 1"), credit: 3, grade: "D" }, // 1.00 * 3 = 3
      ],
    };
    const sem2: Semester = {
      id: "s2",
      name: "Semester 2",
      courses: [
        {
          ...createCourse("Course 1 Retake"),
          credit: 3,
          grade: "A",
          isRetake: true,
          previousGrade: "D",
        }, // Replaces D (1.00) with A (4.00): delta +9 pts, 0 extra credits
      ],
    };

    const result = calculateCGPA([sem1, sem2]);
    expect(result.totalCredits).toBe(3);
    expect(result.totalPoints).toBe(12);
    expect(result.cgpa).toBeCloseTo(4.0, 2);
  });

  it("calculates combined CGPA with prior standing and retake courses", () => {
    // Prior standing: CGPA = 3.00, Completed Credits = 60 (Prior points = 180)
    const priorCgpa = 3.0;
    const priorCredits = 60;

    const semester: Semester = {
      id: "s1",
      name: "Semester 1",
      courses: [
        // Non-retake course
        { ...createCourse("New Course"), credit: 3, grade: "A" }, // 4.00 * 3 = +12 pts, +3 credits
        // Retake course replacing D (1.00) with A (4.00)
        {
          ...createCourse("Retake Course"),
          credit: 3,
          grade: "A",
          isRetake: true,
          previousGrade: "D",
        }, // (4.00 - 1.00) * 3 = +9 pts, 0 extra credits
      ],
    };

    const result = calculateCombinedCGPA(priorCgpa, priorCredits, [semester]);

    // Total points = 180 + 12 + 9 = 201
    // Total credits = 60 + 3 + 0 = 63
    // CGPA = 201 / 63 = 3.190476...
    expect(result.newTotalCredits).toBe(63);
    expect(result.newCgpa).toBeCloseTo(3.19, 2);
  });
});
