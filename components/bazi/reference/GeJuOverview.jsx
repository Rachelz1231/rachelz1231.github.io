// 命格总览：先讲取格逻辑，再列正格 / 特殊格 / 外格三类。

const NORMAL_GE = [
  { name: "正官格",   tag: "正官", desc: "月支本气或中气透正官；身正官明，重事业声望" },
  { name: "七杀格",   tag: "七杀", desc: "月支透七杀；杀重需食伤制或印化" },
  { name: "正印格",   tag: "正印", desc: "月支透正印；学识、母慈、贵人格" },
  { name: "偏印格",   tag: "偏印", desc: "又名枭神格；偏才偏术，宜配财以制" },
  { name: "正财格",   tag: "正财", desc: "月支透正财；勤业守财，妻贤" },
  { name: "偏财格",   tag: "偏财", desc: "月支透偏财；机变得财，男命缘多" },
  { name: "食神格",   tag: "食神", desc: "月支透食神；才艺、子女、温润格" },
  { name: "伤官格",   tag: "伤官", desc: "月支透伤官；锋芒外露，宜配印或财" },
];

const SPECIAL_GE = [
  { name: "建禄格",   desc: "月支本气=日主比肩；身强格之首，依透干分多种用神" },
  { name: "羊刃格",   desc: "月支为日主刃位（劫财）；阳干见之最烈，宜配煞印" },
];

const WAI_GE = [
  { name: "从强 / 从旺格", desc: "命中比劫印星极旺，全无克泄；顺其势" },
  { name: "从财 / 从官 / 从儿格", desc: "日主孤弱无根，三柱顺一神之势" },
  { name: "化气格", desc: "日主合化（甲己合土等）并满足月令、化神有根、无强克" },
  { name: "专旺 / 一行得气", desc: "五行单一独旺（曲直、炎上、稼穑、从革、润下）" },
];

export function GeJuOverview() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-medium text-foreground">取格次第</h3>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-muted-foreground">
          <li>月支本气是日主比肩 → 建禄；为日主刃位 → 羊刃。两者优先定格。</li>
          <li>月支本气透干 → 以本气十神为格（八格）。</li>
          <li>本气不透 → 看中气、余气是否透出，取其十神为格。</li>
          <li>都不透 → 本气十神虚立为格（"暗格"），再看用神补救。</li>
          <li>满足"从"或"化"的条件 → 跳出八格，按外格论。</li>
        </ol>
      </div>

      <div>
        <h3 className="font-medium text-foreground">正格八格</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {NORMAL_GE.map((g) => (
            <div key={g.name} className="rounded-md border border-border bg-background/60 p-3">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-foreground">{g.name}</span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {g.tag}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">特殊正格</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {SPECIAL_GE.map((g) => (
            <div key={g.name} className="rounded-md border border-border bg-background/60 p-3">
              <p className="font-medium text-foreground">{g.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">外格 / 变格</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {WAI_GE.map((g) => (
            <div key={g.name} className="rounded-md border border-dashed border-border bg-background/40 p-3">
              <p className="font-medium text-foreground">{g.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
