import { Card } from "@/components/ui/card";
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  STEM_YIN_YANG,
  BRANCH_YIN_YANG,
  BRANCH_HIDDEN_STEMS,
  tenGodOf,
  nayinOf,
  twelveStageOf,
  emptyDeathOf,
  tombElement,
  postalHorseHits,
} from "@/lib/bazi";
import { StemBranchCell } from "./StemBranchCell";
import { ELEMENT_COLOR, PILLAR_LABELS, pad2 } from "./shared";

const ROOTS = ["主", "中", "余"];

function TermBannerRow({ result, form }) {
  if (!result.term || !form) return null;
  const t = result.term;
  const termMs = Date.UTC(t.year, t.month - 1, t.day, 0, 0);
  const birthMs = Date.UTC(
    form.year, form.month - 1, form.day,
    form.hour, form.minute || 0
  );
  const diffH = Math.floor((birthMs - termMs) / 3600000);
  const days = Math.floor(diffH / 24);
  const hours = ((diffH % 24) + 24) % 24;
  return (
    <div className="bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
      <span className="font-medium">出生节气：</span>
      出生于 <span className="font-medium">{t.name}</span>（{t.year}.
      {pad2(t.month)}.{pad2(t.day)}）后约 {days} 天 {hours} 小时
    </div>
  );
}

export function PillarTable({ result, form }) {
  const pillars = [result.year, result.month, result.day, result.hour];
  const dayStem = result.day.stem;

  const tenGodCells = pillars.map((p, i) =>
    i === 2 ? "日主" : tenGodOf(dayStem, p.stem)
  );
  const stemCells = pillars.map((p) => (
    <StemBranchCell
      glyph={HEAVENLY_STEMS[p.stem]}
      element={STEM_ELEMENT[p.stem]}
      yinYang={STEM_YIN_YANG[p.stem]}
    />
  ));
  const branchCells = pillars.map((p) => (
    <StemBranchCell
      glyph={EARTHLY_BRANCHES[p.branch]}
      element={BRANCH_ELEMENT[p.branch]}
      yinYang={BRANCH_YIN_YANG[p.branch]}
    />
  ));
  const cangGanCells = pillars.map((p) => {
    const tomb = tombElement(p.branch);
    return (
      <div className="flex flex-col items-center gap-1 leading-tight">
        {tomb && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${ELEMENT_COLOR[tomb]}`}
            title={`${EARTHLY_BRANCHES[p.branch]}为${tomb}之墓库`}
          >
            {tomb}库
          </span>
        )}
        {BRANCH_HIDDEN_STEMS[p.branch].map((s, i) => (
          <div key={i} className="flex items-center gap-1 text-sm">
            <span className="font-medium text-foreground">
              {HEAVENLY_STEMS[s]}
            </span>
            <span
              className={`rounded px-1 text-[10px] ${ELEMENT_COLOR[STEM_ELEMENT[s]]}`}
            >
              {STEM_ELEMENT[s]}
            </span>
            <span className="text-[10px] text-muted-foreground">{ROOTS[i]}</span>
          </div>
        ))}
      </div>
    );
  });
  const zhiShenCells = pillars.map((p) => (
    <div className="flex flex-col items-center gap-1 leading-tight">
      {BRANCH_HIDDEN_STEMS[p.branch].map((s, i) => (
        <div key={i} className="text-xs text-muted-foreground">
          {tenGodOf(dayStem, s)}
        </div>
      ))}
    </div>
  ));
  const nayinCells = pillars.map((p) => (
    <span className="text-sm">{nayinOf(p.stem, p.branch)}</span>
  ));
  const emptyDeathCells = pillars.map((p) => {
    const [a, b] = emptyDeathOf(p.stem, p.branch);
    return (
      <span className="text-sm">
        {EARTHLY_BRANCHES[a]}
        {EARTHLY_BRANCHES[b]}
      </span>
    );
  });
  const stageCells = pillars.map((p) => (
    <span className="text-sm">{twelveStageOf(dayStem, p.branch)}</span>
  ));

  const yimaHits = postalHorseHits(result);
  const shenshaCells = pillars.map((_, i) => {
    const tags = [];
    if (yimaHits[i]) tags.push("驿马");
    return tags.length ? (
      <div className="flex flex-wrap items-center justify-center gap-1">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-900"
          >
            {t}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-xs text-muted-foreground">—</span>
    );
  });

  const rows = [
    { label: "十神", cells: tenGodCells },
    { label: "天干", cells: stemCells },
    { label: "地支", cells: branchCells },
    { label: "藏干", cells: cangGanCells },
    { label: "支神", cells: zhiShenCells },
    { label: "纳音", cells: nayinCells },
    { label: "空亡", cells: emptyDeathCells },
    { label: "地势", cells: stageCells },
    { label: "神煞", cells: shenshaCells },
  ];

  return (
    <Card className="mt-6 overflow-hidden p-0">
      <TermBannerRow result={result} form={form} />
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="grid grid-cols-[64px_repeat(4,minmax(96px,1fr))] border-y border-border bg-muted/60">
            <div />
            {PILLAR_LABELS.map(({ key, title, subtitle }) => (
              <div
                key={key}
                className="border-l border-border px-2 py-3 text-center"
              >
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-[10px] text-muted-foreground">{subtitle}</p>
              </div>
            ))}
          </div>
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[64px_repeat(4,minmax(96px,1fr))]"
              >
                <div className="flex items-center justify-center bg-muted/30 py-3 text-xs text-muted-foreground">
                  {row.label}
                </div>
                {row.cells.map((cell, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center border-l border-border px-2 py-3 text-center"
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
