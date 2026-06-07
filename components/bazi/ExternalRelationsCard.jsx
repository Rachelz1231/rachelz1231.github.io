import {
  analyzeWithExternals,
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEM_ELEMENT,
  BRANCH_HIDDEN_STEMS,
  tenGodOf,
} from "@/lib/bazi";
import { StemComboItem } from "./StemComboItem";
import { ColoredName } from "./ColoredName";
import { ELEMENT_COLOR } from "./shared";

const FULL_NAME = {
  年: "年柱", 月: "月柱", 日: "日柱", 时: "时柱",
  运: "大运", 岁: "流年", 流月: "流月",
};

const ROOT_LABELS = ["本气", "中气", "余气"];
const ROOT_STRENGTH = ["强根", "中根", "弱根"];

// 检查外柱天干在所有可用地支（命局四柱 + 所有外柱）中的落根情况。
// 返回每条根：{ pillar, branch, position, posLabel } —— position 是藏干索引（0=本气）
function findRoots(stemEl, branches) {
  const roots = [];
  for (const b of branches) {
    const hidden = BRANCH_HIDDEN_STEMS[b.branch];
    for (let i = 0; i < hidden.length; i++) {
      if (STEM_ELEMENT[hidden[i]] === stemEl) {
        roots.push({
          pillar: b.label,
          branch: b.branch,
          position: i,
          posLabel: ROOT_LABELS[i],
        });
        break; // 同一支只算一次，取最强（本气优先）
      }
    }
  }
  return roots;
}

// 命局四柱 + 一/多个外柱（大运/流年）的合冲刑害展示。
//   externals: [{ stem, branch, label }]
//   externalLabel: 高亮的外柱标记（如 "运" 或 "岁"），命中位会加底色
export function ExternalRelationsCard({
  result, externals, headerTitle, headerSub, externalLabel,
}) {
  const rel = analyzeWithExternals(result, externals);
  const dayStem = result.day.stem;

  // 四柱基础 + 全部外柱（含本柱）用于落根判定
  const baseBranches = [
    { label: "年", branch: result.year.branch },
    { label: "月", branch: result.month.branch },
    { label: "日", branch: result.day.branch },
    { label: "时", branch: result.hour.branch },
  ];
  const allBranches = [
    ...baseBranches,
    ...externals.map((e) => ({ label: e.label, branch: e.branch })),
  ];

  const baseStems = [
    result.year.stem, result.month.stem, result.day.stem, result.hour.stem,
  ];

  const details = externals.map((ext) => {
    const stemEl = STEM_ELEMENT[ext.stem];
    // 分别判定：命局是否"透"该五行（天干层）vs 是否"有根"（地支藏干层）
    const transparentInBase = baseStems.some((s) => STEM_ELEMENT[s] === stemEl);
    const baseRoots = findRoots(stemEl, baseBranches);
    const rootedInBase = baseRoots.length > 0;
    // 外柱（自坐 + 同时入命的运/岁）地支藏干提供的根
    const extRoots = findRoots(
      stemEl,
      allBranches.filter((b) =>
        !baseBranches.some((bb) => bb.label === b.label),
      ),
    );
    // 外柱本身带的天干 → 自动补透（仅当命局不透时算作"新加")
    const addsTransparent = !transparentInBase;
    // 外柱地支藏干补根（仅当命局无根时算作"新加")
    const addsRoot = !rootedInBase && extRoots.length > 0;

    const hidden = BRANCH_HIDDEN_STEMS[ext.branch].map((s, i) => ({
      stem: s,
      element: STEM_ELEMENT[s],
      tenGod: tenGodOf(dayStem, s),
      posLabel: ROOT_LABELS[i],
    }));
    return {
      label: ext.label,
      stem: ext.stem,
      branch: ext.branch,
      stemEl,
      stemTenGod: tenGodOf(dayStem, ext.stem),
      hidden,
      transparentInBase,
      rootedInBase,
      baseRoots,
      extRoots,
      addsTransparent,
      addsRoot,
    };
  });

  const sections = [
    { key: "stem",   title: "天干合化", items: rel.stemCombos, tone: "bg-sage-50" },
    { key: "liuhe",  title: "地支六合", items: rel.liuhe,      tone: "bg-sage-50" },
    { key: "sanhe",  title: "地支三合", items: rel.sanhe,      tone: "bg-sage-50" },
    { key: "sanhui", title: "地支三会", items: rel.sanhui,     tone: "bg-sage-50" },
    { key: "chong",  title: "地支六冲", items: rel.chong,      tone: "bg-rose-50" },
    { key: "xing",   title: "地支相刑", items: rel.xing,       tone: "bg-rose-50" },
    { key: "hai",    title: "地支相害", items: rel.hai,        tone: "bg-rose-50" },
  ];
  return (
    <div className="border-t border-border bg-muted/20 px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-serif text-base font-semibold">{headerTitle}</h3>
          {headerSub && (
            <p className="mt-0.5 text-xs text-muted-foreground">{headerSub}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {rel.hasAny
            ? `${sections.reduce((a, s) => a + s.items.length, 0)} 项`
            : "无关联"}
        </span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {details.map((d) => (
          <div
            key={d.label}
            className="rounded-md border border-border bg-background/60 p-3"
          >
            <div className="flex items-baseline gap-2">
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                {FULL_NAME[d.label] || d.label}
              </span>
              <span className="font-serif text-base font-semibold">
                {HEAVENLY_STEMS[d.stem]}{EARTHLY_BRANCHES[d.branch]}
              </span>
              <span className="text-xs text-muted-foreground">{d.stemTenGod}</span>
            </div>

            <div className="mt-2 space-y-1.5 text-xs">
              {(() => {
                // 仅在命局缺一/缺两项（不透 或 无根）且外柱补上时显示
                if (!d.addsTransparent && !d.addsRoot) return null;
                const label =
                  d.addsTransparent && d.addsRoot
                    ? "补透补根"
                    : d.addsTransparent
                      ? "补透"
                      : "补根";
                const baseStateText =
                  d.transparentInBase && !d.rootedInBase
                    ? "命局透干无根"
                    : !d.transparentInBase && d.rootedInBase
                      ? "命局有根不透"
                      : "命局不透无根";
                return (
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-muted-foreground">天干{label}：</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] ${ELEMENT_COLOR[d.stemEl] || ""}`}
                    >
                      {HEAVENLY_STEMS[d.stem]} · {d.stemEl}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {baseStateText} →
                    </span>
                    {d.addsTransparent && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-900">
                        外柱透出
                      </span>
                    )}
                    {d.baseRoots.map((r, k) => (
                      <span
                        key={`b${k}`}
                        className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] text-sky-900"
                        title={`${FULL_NAME[r.pillar]}支 ${EARTHLY_BRANCHES[r.branch]} 藏 ${HEAVENLY_STEMS[BRANCH_HIDDEN_STEMS[r.branch][r.position]]}（命局原有根）`}
                      >
                        命局·{FULL_NAME[r.pillar]}·{r.posLabel}
                      </span>
                    ))}
                    {d.extRoots.map((r, k) => {
                      const isSelf = r.pillar === d.label;
                      return (
                        <span
                          key={`e${k}`}
                          className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-900"
                          title={`${FULL_NAME[r.pillar] || r.pillar}支 ${EARTHLY_BRANCHES[r.branch]} 藏 ${HEAVENLY_STEMS[BRANCH_HIDDEN_STEMS[r.branch][r.position]]}`}
                        >
                          {isSelf ? "自坐" : (FULL_NAME[r.pillar] || r.pillar)}·{r.posLabel}（{ROOT_STRENGTH[r.position]}）
                        </span>
                      );
                    })}
                    {!d.rootedInBase && d.extRoots.length === 0 && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        仍无根 · 浮干
                      </span>
                    )}
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-muted-foreground">
                  地支 {EARTHLY_BRANCHES[d.branch]} 藏干：
                </span>
                {d.hidden.map((h, k) => (
                  <span
                    key={k}
                    className="inline-flex items-baseline gap-1"
                  >
                    <span
                      className={`rounded px-1 py-0.5 text-[11px] font-medium ${ELEMENT_COLOR[h.element] || ""}`}
                    >
                      {HEAVENLY_STEMS[h.stem]}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {h.posLabel}·{h.tenGod}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!rel.hasAny ? (
        <p className="mt-3 text-sm text-muted-foreground">
          与命局四柱{externals.length > 1 ? "及大运" : ""}无明显合冲刑害。
        </p>
      ) : (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {sections
            .filter((s) => s.items.length > 0)
            .map((s) => (
              <div
                key={s.key}
                className={`rounded-md border border-border p-3 ${s.tone}`}
              >
                <h4 className="text-xs font-medium text-foreground">{s.title}</h4>
                <ul className="mt-1.5 space-y-2 text-sm">
                  {s.key === "stem"
                    ? s.items.map((it, i) => (
                        <StemComboItem
                          key={i}
                          item={it}
                          externalLabel={externalLabel}
                        />
                      ))
                    : s.items.map((it, i) => (
                        <li
                          key={i}
                          className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                        >
                          <ColoredName text={it.name} />
                          {it.complete === false && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              半合
                            </span>
                          )}
                          <span className="flex flex-wrap items-center gap-1">
                            {it.positions.map((p, k) => (
                              <span
                                key={k}
                                className={
                                  p === externalLabel
                                    ? "rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-medium text-primary"
                                    : "text-xs text-muted-foreground"
                                }
                              >
                                {FULL_NAME[p] || p}
                              </span>
                            ))}
                          </span>
                        </li>
                      ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
