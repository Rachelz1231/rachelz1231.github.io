import { Card } from "@/components/ui/card";
import { StemComboItem } from "./StemComboItem";

const FULL_NAME = { 年: "年柱", 月: "月柱", 日: "日柱", 时: "时柱" };

export function RelationsPanel({ relations }) {
  if (!relations) return null;
  const sections = [
    { key: "stem",   title: "天干合化", items: relations.stemCombos, tone: "bg-sage-50" },
    { key: "liuhe",  title: "地支六合", items: relations.liuhe,      tone: "bg-sage-50" },
    { key: "sanhe",  title: "地支三合", items: relations.sanhe,      tone: "bg-sage-50" },
    { key: "sanhui", title: "地支三会", items: relations.sanhui,     tone: "bg-sage-50" },
    { key: "chong",  title: "地支六冲", items: relations.chong,      tone: "bg-rose-50" },
    { key: "xing",   title: "地支相刑", items: relations.xing,       tone: "bg-rose-50" },
    { key: "hai",    title: "地支相害", items: relations.hai,        tone: "bg-rose-50" },
  ];
  const total = sections.reduce((a, s) => a + s.items.length, 0);

  return (
    <Card className="mt-6 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-xl font-semibold">合冲刑害</h2>
        <span className="text-xs text-muted-foreground">
          {total === 0 ? "命局清纯" : `共 ${total} 项`}
        </span>
      </div>
      {total === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          天干无合化，地支无合、冲、刑、害。
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sections
            .filter((s) => s.items.length > 0)
            .map((s) => (
              <div
                key={s.key}
                className={`rounded-md border border-border p-3 ${s.tone}`}
              >
                <h3 className="text-sm font-medium text-foreground">
                  {s.title}
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {s.key === "stem"
                    ? s.items.map((it, i) => (
                        <StemComboItem key={i} item={it} />
                      ))
                    : s.items.map((it, i) => (
                        <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-foreground">{it.name}</span>
                          {it.complete === false && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              半合
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {it.positions.map((p) => FULL_NAME[p] || p).join(" · ")}
                          </span>
                        </li>
                      ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}
