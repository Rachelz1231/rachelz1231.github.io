import { Card } from "@/components/ui/card";

export function StrengthPanel({ strength, geJu }) {
  if (!strength) return null;
  const items = [
    {
      key: "deLing", label: "得令",
      hit: strength.deLing,
      hint: `月支本气为${strength.monthMainEl}${
        strength.deLing ? "，生扶日主" : "，未生扶日主"
      }`,
    },
    {
      key: "deDi", label: "得地",
      hit: strength.deDi,
      hint: strength.deDi
        ? `日主${strength.dayEl}通根于地支藏干`
        : `日主${strength.dayEl}未在任一地支藏干中现身`,
    },
    {
      key: "deShi", label: "得势",
      hit: strength.deShi,
      hint: `生扶之气 ${strength.favorableCount}/${strength.favorableTotal}（≥4 为得势）`,
    },
  ];
  return (
    <Card className="mt-6 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold">命格 · 日主强弱</h2>
        <div className="flex flex-wrap items-center gap-2">
          {geJu && (
            <span
              className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
              title={geJu.note}
            >
              {geJu.name}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              strength.strength.includes("强")
                ? "bg-rose-100 text-rose-800"
                : strength.strength.includes("弱")
                  ? "bg-sky-100 text-sky-800"
                  : "bg-sage-100 text-sage-800"
            }`}
          >
            {strength.strength}
          </span>
        </div>
      </div>
      {geJu && (
        <p className="mt-1 text-xs text-muted-foreground">{geJu.note}</p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.key}
            className={`rounded-md border p-3 ${
              it.hit
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-muted/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{it.label}</span>
              <span
                className={`text-xs font-medium ${
                  it.hit ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {it.hit ? "✓ 是" : "✗ 否"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{it.hint}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
