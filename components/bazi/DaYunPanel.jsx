"use client";

import { Card } from "@/components/ui/card";
import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEM_ELEMENT, BRANCH_ELEMENT,
  STEM_YIN_YANG, BRANCH_YIN_YANG,
  postalHorseBranch,
} from "@/lib/bazi";
import { StemBranchCell } from "./StemBranchCell";
import { ExternalRelationsCard } from "./ExternalRelationsCard";
import {
  ageFmt, COL_ROW_TEXT, COL_ROW_GLYPH, COL_ROW_LBL, COL_ROW_GLYPH_LBL,
} from "./shared";

export function DaYunPanel({ result, luck, form, selectedIdx, onSelect }) {
  if (!luck || !form) return null;
  const sel = selectedIdx != null ? luck.cycles[selectedIdx] : null;
  const yimaTargets = new Set([
    postalHorseBranch(result.year.branch),
    postalHorseBranch(result.day.branch),
  ]);

  return (
    <Card className="mt-6 overflow-hidden p-0">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="font-serif text-xl font-semibold">大运</h2>
        <p className="text-xs text-muted-foreground">
          {form.gender === "male" ? "乾造（男）" : "坤造（女）"}
          <span className="mx-1.5">·</span>
          {luck.forward ? "顺行" : "逆行"}
          <span className="mx-1.5">·</span>
          起运 {ageFmt(luck.startAge)} 岁
          <span className="mx-1.5 text-muted-foreground/60">·</span>
          点击列查看与命局关系
        </p>
      </header>

      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] grid-cols-[56px_repeat(10,minmax(0,1fr))]">
          <div className="flex flex-col bg-muted/30">
            <div className={COL_ROW_LBL}>十神</div>
            <div className={COL_ROW_GLYPH_LBL}>天干</div>
            <div className={COL_ROW_GLYPH_LBL}>地支</div>
            <div className={COL_ROW_LBL}>起运</div>
            <div className={COL_ROW_LBL}>起年</div>
            <div className={COL_ROW_LBL}>神煞</div>
          </div>
          {luck.cycles.map((c, i) => {
            const selected = selectedIdx === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(selected ? null : i)}
                className={`flex flex-col border-l border-border text-center transition-colors ${
                  selected
                    ? "bg-primary/10 ring-2 ring-inset ring-primary/60"
                    : "hover:bg-muted/40"
                }`}
              >
                <div className={COL_ROW_TEXT}>{c.tenGod}</div>
                <div className={COL_ROW_GLYPH}>
                  <StemBranchCell
                    glyph={HEAVENLY_STEMS[c.stem]}
                    element={STEM_ELEMENT[c.stem]}
                    yinYang={STEM_YIN_YANG[c.stem]}
                    small
                  />
                </div>
                <div className={COL_ROW_GLYPH}>
                  <StemBranchCell
                    glyph={EARTHLY_BRANCHES[c.branch]}
                    element={BRANCH_ELEMENT[c.branch]}
                    yinYang={BRANCH_YIN_YANG[c.branch]}
                    small
                  />
                </div>
                <div className={COL_ROW_TEXT}>{ageFmt(c.ageStart)} 岁</div>
                <div className={COL_ROW_TEXT}>{c.yearStart}</div>
                <div className={COL_ROW_TEXT}>
                  {yimaTargets.has(c.branch) ? (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                      驿马
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {sel && (
        <ExternalRelationsCard
          result={result}
          externals={[{ stem: sel.stem, branch: sel.branch, label: "运" }]}
          headerTitle={`大运 ${HEAVENLY_STEMS[sel.stem]}${EARTHLY_BRANCHES[sel.branch]}（${sel.tenGod}）`}
          headerSub={`${ageFmt(sel.ageStart)}–${ageFmt(sel.ageEnd)} 岁 · ${sel.yearStart}–${sel.yearEnd} 年`}
          externalLabel="运"
        />
      )}
    </Card>
  );
}
