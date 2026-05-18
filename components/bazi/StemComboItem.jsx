// 单条天干合化的展示：化成 / 只合不化 / 争合不化 / 合·扰动 + 条件勾叉。

const FULL_NAME = {
  年: "年柱", 月: "月柱", 日: "日柱", 时: "时柱",
  运: "大运", 岁: "流年",
};

function pickBadge(hua) {
  if (hua.external) {
    return { text: "合·扰动", cls: "bg-zinc-200 text-zinc-800" };
  }
  if (hua.formed) {
    return { text: "化成", cls: "bg-emerald-100 text-emerald-800" };
  }
  // 若失败原因只剩"无争合"，单独标 争合不化
  const otherChecksPass = hua.checks
    .filter((c) => c.name !== "无争合")
    .every((c) => c.hit);
  if (hua.contended && otherChecksPass) {
    return { text: "争合不化", cls: "bg-amber-100 text-amber-900" };
  }
  return { text: "只合不化", cls: "bg-amber-100 text-amber-900" };
}

export function StemComboItem({ item, externalLabel }) {
  const hua = item.hua || { formed: true, checks: [], external: false, contended: false };
  const badge = pickBadge(hua);
  const displayName =
    hua.formed && !hua.external
      ? item.name
      : item.name.replace(/合化.+$/, "合");

  return (
    <li className="space-y-1">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-foreground">{displayName}</span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${badge.cls}`}
        >
          {badge.text}
        </span>
        <span className="flex flex-wrap items-center gap-1">
          {item.positions.map((p, k) => (
            <span
              key={k}
              className={
                externalLabel && p === externalLabel
                  ? "rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-medium text-primary"
                  : "text-xs text-muted-foreground"
              }
            >
              {FULL_NAME[p] || p}
            </span>
          ))}
        </span>
      </div>
      {hua.checks.length > 0 && (
        <ul className="flex flex-wrap gap-x-3 gap-y-0.5 pl-3 text-[11px] leading-relaxed">
          {hua.checks.map((c, k) => (
            <li
              key={k}
              className={c.hit ? "text-muted-foreground" : "text-amber-800"}
              title={c.hint}
            >
              <span className="mr-0.5">{c.hit ? "✓" : "✗"}</span>
              {c.name}
              {!c.hit && (
                <span className="ml-1 opacity-80">（{c.hint}）</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
