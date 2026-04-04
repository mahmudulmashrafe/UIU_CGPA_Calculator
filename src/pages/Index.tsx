import { useState } from "react";
import { Semester, createSemester, calculateSemesterGPA, calculateCGPA } from "@/lib/grading";
import { SemesterCard } from "@/components/SemesterCard";
import { CGPADisplay } from "@/components/CGPADisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, GraduationCap, RotateCcw, Info } from "lucide-react";

const Index = () => {
  // Full calculator state
  const [semesters, setSemesters] = useState<Semester[]>([createSemester(1)]);

  // Single semester state
  const [singleSemester, setSingleSemester] = useState<Semester>({ ...createSemester(1), name: "Semester" });
  const [priorCgpa, setPriorCgpa] = useState("");
  const [priorCredits, setPriorCredits] = useState("");

  // Future CGPA state
  const [futureSemesters, setFutureSemesters] = useState<Semester[]>([createSemester(1)]);
  const [futurePriorCgpa, setFuturePriorCgpa] = useState("");
  const [futurePriorCredits, setFuturePriorCredits] = useState("");

  const addSemester = () => {
    setSemesters((prev) => [...prev, createSemester(prev.length + 1)]);
  };

  const updateSemester = (index: number, semester: Semester) => {
    setSemesters((prev) => prev.map((s, i) => (i === index ? semester : s)));
  };

  const removeSemester = (index: number) => {
    setSemesters((prev) => prev.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setSemesters([createSemester(1)]);
  };

  const resetSingle = () => {
    setSingleSemester({ ...createSemester(1), name: "Semester" });
    setPriorCgpa("");
    setPriorCredits("");
  };

  const addFutureSemester = () => {
    setFutureSemesters((prev) => [...prev, createSemester(prev.length + 1)]);
  };

  const updateFutureSemester = (index: number, semester: Semester) => {
    setFutureSemesters((prev) => prev.map((s, i) => (i === index ? semester : s)));
  };

  const removeFutureSemester = (index: number) => {
    setFutureSemesters((prev) => prev.filter((_, i) => i !== index));
  };

  const resetFuture = () => {
    setFutureSemesters([createSemester(1)]);
    setFuturePriorCgpa("");
    setFuturePriorCredits("");
  };

  // Single semester CGPA calculation
  const singleGpa = calculateSemesterGPA(singleSemester.courses);
  const priorCgpaNum = parseFloat(priorCgpa) || 0;
  const priorCreditsNum = parseFloat(priorCredits) || 0;
  const newTotalCredits = priorCreditsNum + singleGpa.totalCredits;
  const newCgpa =
    newTotalCredits > 0
      ? (priorCgpaNum * priorCreditsNum + singleGpa.totalPoints) / newTotalCredits
      : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">UIU CGPA Calculator</h1>
              <p className="text-[10px] text-muted-foreground">United International University</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-7xl mx-auto px-4 py-6 flex-1">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="single">Single Semester</TabsTrigger>
            <TabsTrigger value="future">Future CGPA</TabsTrigger>
            <TabsTrigger value="full">Full CGPA Calculator</TabsTrigger>
          </TabsList>

          {/* Single Semester Tab */}
          <TabsContent value="single">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4 min-w-0">
                {/* Prior CGPA inputs */}
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Your Current Standing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Current CGPA</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        placeholder="e.g. 3.50"
                        value={priorCgpa}
                        onChange={(e) => setPriorCgpa(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Credits Completed</label>
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        placeholder="e.g. 90"
                        value={priorCredits}
                        onChange={(e) => setPriorCredits(e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Semester courses */}
                <SemesterCard
                  semester={singleSemester}
                  onChange={setSingleSemester}
                  onRemove={resetSingle}
                  readOnlyName={true}
                />
              </div>

              {/* Result */}
              <div className="w-full lg:w-72 shrink-0">
                <div className="flex justify-end mb-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={resetSingle}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                  </Button>
                </div>
                <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-sm sticky top-20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Projected CGPA
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
                    <div className={`text-5xl font-bold tabular-nums ${singleGpa.totalCredits > 0 ? "text-primary" : "text-muted-foreground/30"}`}>
                      {singleGpa.totalCredits > 0 ? newCgpa.toFixed(2) : "0.00"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {singleGpa.totalCredits > 0 ? "After this semester" : "Add courses to calculate"}
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(newCgpa / 4) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Semester GPA</p>
                      <p className="text-xl font-bold text-foreground">
                        {singleGpa.totalCredits > 0 ? singleGpa.gpa.toFixed(2) : "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Credits</p>
                      <p className="text-xl font-bold text-foreground">{newTotalCredits}</p>
                    </div>
                  </div>

                  {priorCgpaNum > 0 && singleGpa.totalCredits > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/60 text-center">
                      <p className="text-xs text-muted-foreground">
                        Change:{" "}
                        <span className={`font-semibold ${newCgpa >= priorCgpaNum ? "text-accent" : "text-destructive"}`}>
                          {newCgpa >= priorCgpaNum ? "+" : ""}
                          {(newCgpa - priorCgpaNum).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Future CGPA Tab */}
          <TabsContent value="future">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4 min-w-0">
                {/* Prior CGPA inputs */}
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Your Current Standing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Current CGPA</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        placeholder="e.g. 3.50"
                        value={futurePriorCgpa}
                        onChange={(e) => setFuturePriorCgpa(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Credits Completed</label>
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        placeholder="e.g. 90"
                        value={futurePriorCredits}
                        onChange={(e) => setFuturePriorCredits(e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Future semesters */}
                {futureSemesters.map((semester, i) => (
                  <SemesterCard
                    key={semester.id}
                    semester={semester}
                    onChange={(s) => updateFutureSemester(i, s)}
                    onRemove={() => removeFutureSemester(i)}
                  />
                ))}
                <Button
                  variant="outline"
                  className="w-full border-dashed h-12 text-muted-foreground hover:text-primary hover:border-primary/50"
                  onClick={addFutureSemester}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Semester
                </Button>
              </div>
              <div className="w-full lg:w-72 shrink-0">
                <div className="flex justify-end mb-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={resetFuture}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                  </Button>
                </div>
                <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-sm sticky top-20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Projected CGPA
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
                  <FutureCGPADisplay 
                    semesters={futureSemesters} 
                    priorCgpa={parseFloat(futurePriorCgpa) || 0}
                    priorCredits={parseFloat(futurePriorCredits) || 0}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Full Calculator Tab */}
          <TabsContent value="full">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4 min-w-0">
                {semesters.map((semester, i) => (
                  <SemesterCard
                    key={semester.id}
                    semester={semester}
                    onChange={(s) => updateSemester(i, s)}
                    onRemove={() => removeSemester(i)}
                  />
                ))}
                <Button
                  variant="outline"
                  className="w-full border-dashed h-12 text-muted-foreground hover:text-primary hover:border-primary/50"
                  onClick={addSemester}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Semester
                </Button>
              </div>
              <div className="w-full lg:w-72 shrink-0">
                <div className="flex justify-end mb-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={resetAll}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                  </Button>
                </div>
                <CGPADisplay semesters={semesters} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026{" "}
            <a href="https://mahmudulmashrafe.github.io/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Mahmudul Mashrafe
            </a>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Future CGPA Display Component
interface FutureCGPADisplayProps {
  semesters: Semester[];
  priorCgpa: number;
  priorCredits: number;
}

function FutureCGPADisplay({ semesters, priorCgpa, priorCredits }: FutureCGPADisplayProps) {
  const totalGpaData = calculateCGPA(semesters);
  const newTotalCredits = priorCredits + totalGpaData.totalCredits;
  const newCgpa =
    newTotalCredits > 0
      ? (priorCgpa * priorCredits + totalGpaData.totalPoints) / newTotalCredits
      : 0;

  return (
    <div>
      <div className="text-center mb-4">
        <div className={`text-5xl font-bold tabular-nums ${totalGpaData.totalCredits > 0 ? "text-primary" : "text-muted-foreground/30"}`}>
          {totalGpaData.totalCredits > 0 ? newCgpa.toFixed(2) : "0.00"}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {totalGpaData.totalCredits > 0 ? "After all semesters" : "Add courses to calculate"}
        </div>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(newCgpa / 4) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-xl bg-secondary/50">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total GPA</p>
          <p className="text-xl font-bold text-foreground">
            {totalGpaData.totalCredits > 0 ? totalGpaData.cgpa.toFixed(2) : "—"}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-secondary/50">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Credits</p>
          <p className="text-xl font-bold text-foreground">{newTotalCredits}</p>
        </div>
      </div>

      {priorCgpa > 0 && totalGpaData.totalCredits > 0 && (
        <div className="mt-4 pt-4 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            Change:{" "}
            <span className={`font-semibold ${newCgpa >= priorCgpa ? "text-accent" : "text-destructive"}`}>
              {newCgpa >= priorCgpa ? "+" : ""}
              {(newCgpa - priorCgpa).toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Index;
