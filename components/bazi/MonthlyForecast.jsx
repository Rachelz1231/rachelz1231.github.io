"use client";

import { Card } from "@/components/ui/card";
import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEM_ELEMENT, BRANCH_ELEMENT,
  STEM_YIN_YANG, BRANCH_YIN_YANG,
  monthlyPillars, annualPillar,
  monthlyReport,
} from "@/lib/bazi";
import { StemBranchCell } from "./StemBranchCell";
import { pad2 } from "./shared";

export function MonthlyForecast({
  result, luck, form, liuNianYear,
  selectedLiuYueIdx, selectedDaYunIdx,
}) {
  if (!result || !luck || !form || liuNianYear == null) return null;
  if (selectedLiuYueIdx == null) {
    return (
      <Card className="mt-6 p-5 text-sm text-muted-foreground">
        点击上方流月任一列，下方将出现该月运势的模板解读（含与命局 + 大运 + 流年的复合判断）。
      </Card>
    );
  }
  const months = monthlyPillars(liuNianYear);
  const liuYue = months[selectedLiuYueIdx];
  const liuNianPillar = annualPillar(liuNianYear);
  const liuNianAge = liuNianYear - form.year;
  const daYun = selectedDaYunIdx != null
    ? luck.cycles[selectedDaYunIdx]
    : luck.cycles.find((c) => liuNianAge >= c.ageStart && liuNianAge < c.ageEnd);

  const report = monthlyReport({
    natal: result,
    daYun,
    liuNianPillar,
    liuYuePillar: liuYue,
  });

  return (
    <Card className="mt-6 overflow-hidden p-0">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">流月运势解读</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {liuYue.startYear}/{pad2(liuYue.startMonth)}/{pad2(liuYue.startDay)}
            {" – "}
            {liuYue.endYear}/{pad2(liuYue.endMonth)}/{pad2(liuYue.endDay)}
            <span className="mx-1.5 text-muted-foreground/60">·</span>
            {liuYue.termName} 入节
            <span className="mx-1.5 text-muted-foreground/60">·</span>
            流年 {HEAVENLY_STEMS[liuNianPillar.stem]}{EARTHLY_BRANCHES[liuNianPillar.branch]}
            {daYun && (
              <>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                大运 {HEAVENLY_STEMS[daYun.stem]}{EARTHLY_BRANCHES[daYun.branch]}
              </>
            )}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">规则 + 模板，非 AI 生成</span>
      </header>

      <div className="grid gap-5 px-5 py-5 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
          <StemBranchCell
            glyph={HEAVENLY_STEMS[liuYue.stem]}
            element={STEM_ELEMENT[liuYue.stem]}
            yinYang={STEM_YIN_YANG[liuYue.stem]}
          />
          <StemBranchCell
            glyph={EARTHLY_BRANCHES[liuYue.branch]}
            element={BRANCH_ELEMENT[liuYue.branch]}
            yinYang={BRANCH_YIN_YANG[liuYue.branch]}
          />
        </div>
        <div className="space-y-4 text-sm">
          {report.sections.map((s, i) => (
            <section key={i}>
              <h3 className="font-medium text-foreground">{s.title}</h3>
              {s.body && (
                <p className="mt-1 text-muted-foreground">{s.body}</p>
              )}
              {s.detail && (
                <p className="mt-1 leading-relaxed text-foreground/90">{s.detail}</p>
              )}
              {s.lines && s.lines.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {s.lines.map((line, k) => (
                    <li key={k} className="flex gap-2 leading-relaxed">
                      <span className="text-muted-foreground">·</span>
                      <span className="text-foreground/90">{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </Card>
  );
}
