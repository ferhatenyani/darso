"use client";

import * as React from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Step = { title: string; body: string };

type Props = {
  tabStudents: string;
  tabTeachers: string;
  studentSteps: Step[];
  teacherSteps: Step[];
};

export function HowItWorksTabs({ tabStudents, tabTeachers, studentSteps, teacherSteps }: Props) {
  return (
    <Tabs defaultValue="students" className="w-full">
      <div className="flex justify-center">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="students" className="flex-1">
            {tabStudents}
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex-1">
            {tabTeachers}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="students" className="mt-12">
        <StepsRail steps={studentSteps} />
      </TabsContent>
      <TabsContent value="teachers" className="mt-12">
        <StepsRail steps={teacherSteps} />
      </TabsContent>
    </Tabs>
  );
}

function StepsRail({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className="flex flex-col bg-card p-7 md:p-8">
          <span className="font-mono text-[11px] font-semibold tabular tracking-[0.18em] text-ink-3">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-foreground md:text-[19px]">
            {s.title}
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
