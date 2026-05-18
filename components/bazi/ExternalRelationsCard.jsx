import { analyzeWithExternals } from "@/lib/bazi";
import { StemComboItem } from "./StemComboItem";

const FULL_NAME = {
  年: "年柱", 月: "月柱", 日: "日柱", 时: "时柱",
  运: "大运", 岁: "流年",
};

// 命局四柱 + 一/多个外柱（大运/流年）的合冲刑害展示。
//   externals: [{ stem, branch, label }]
//   externalLabel: 高亮的外柱标记（如 "运" 或 "岁"），命中位会加底色
export function ExternalRelationsCard({
  result, externals, headerTitle, headerSub, externalLabel,
}) {
  const rel = analyzeWithExternals(result, externals);
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
      {!rel.hasAny ? (
        <p className="mt-3 text-sm text-muted-foreground">
          与命局四柱{externals.length > 1 ? "及大运" : ""}无明显合冲刑害。
        </p>
      ) : (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                          <span>{it.name}</span>
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
