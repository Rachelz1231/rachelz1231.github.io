// 外格 / 变格：从格、化气格、专旺格

const CONG = [
  {
    name: "从强格 / 从旺格",
    cond: "日主与比劫印星极旺，四柱无财官食伤之克泄；顺势从之",
    desc: "顺日主之势，喜行比劫印星运，忌财官食伤之运（强克其势）。",
  },
  {
    name: "从财格",
    cond: "日主无根极弱，全局财星独旺",
    desc: "弃命从财，喜财官食伤；忌比劫印星（破从）。",
  },
  {
    name: "从官 / 从杀格",
    cond: "日主无根极弱，官杀独旺无制",
    desc: "弃命从官杀，喜财生官杀；忌食伤制杀、印化杀（皆为破格）。",
  },
  {
    name: "从儿格",
    cond: "日主无根极弱，食伤极旺",
    desc: "顺食伤之势，喜行食伤、财运；忌见印枭夺食。",
  },
  {
    name: "从势格",
    cond: "日主无根，财官食伤三类皆有且均势",
    desc: "顺旺者之势，最为复杂；细看哪一神为引动核心。",
  },
];

const HUA = [
  {
    name: "甲己合化土",
    cond: "甲己紧贴透干，月令为辰戌丑未或巳午",
    note: "化神土在地支有根、四柱无强克木者",
  },
  {
    name: "乙庚合化金",
    cond: "乙庚紧贴，月令为申酉戌或巳",
    note: "化神金通根，无强火克金",
  },
  {
    name: "丙辛合化水",
    cond: "丙辛紧贴，月令为亥子丑或申",
    note: "化神水通根，无强土克水",
  },
  {
    name: "丁壬合化木",
    cond: "丁壬紧贴，月令为寅卯辰或亥",
    note: "化神木通根，无强金克木",
  },
  {
    name: "戊癸合化火",
    cond: "戊癸紧贴，月令为巳午未或寅",
    note: "化神火通根，无强水克火",
  },
];

const ZHUANWANG = [
  { name: "曲直格", el: "木", cond: "天干透甲乙；地支三合木局（亥卯未）或三会东方（寅卯辰）" },
  { name: "炎上格", el: "火", cond: "天干透丙丁；地支三合火局（寅午戌）或三会南方（巳午未）" },
  { name: "稼穑格", el: "土", cond: "天干透戊己；地支四库齐（辰戌丑未）" },
  { name: "从革格", el: "金", cond: "天干透庚辛；地支三合金局（巳酉丑）或三会西方（申酉戌）" },
  { name: "润下格", el: "水", cond: "天干透壬癸；地支三合水局（申子辰）或三会北方（亥子丑）" },
];

const ELEMENT_TONE = {
  木: "bg-sage-100 text-sage-800",
  火: "bg-rose-100 text-rose-800",
  土: "bg-[#c8a47e] text-[#3d2817]",
  金: "bg-yellow-200 text-yellow-900",
  水: "bg-sky-100 text-sky-800",
};

export function SpecialGeJu() {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <h3 className="font-medium text-foreground">从格（顺势格）</h3>
        <p className="mt-1 text-muted-foreground">
          日主孤弱无根、四柱独旺一神时，反其道而行 —
          不再扶弱抑强，而是"弃命相从"。从格成立时主大富大贵；
          一旦原局或大运出现破从之神，则反成大忌。
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {CONG.map((c) => (
            <div key={c.name} className="rounded-md border border-border bg-background/60 p-3">
              <p className="font-medium text-foreground">{c.name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">条件：{c.cond}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">化气格</h3>
        <p className="mt-1 text-muted-foreground">
          五对天干合化（甲己 / 乙庚 / 丙辛 / 丁壬 / 戊癸），各自合化为一种五行。
          合化成立需四条件：<strong>紧邻、月令、化神有根、无强克</strong>。
          化成则日主弃命相从于化神，富贵双全；不成则只论合不论化。
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {HUA.map((h) => (
            <div key={h.name} className="rounded-md border border-border bg-background/60 p-3">
              <p className="font-medium text-foreground">{h.name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{h.cond}</p>
              <p className="mt-1 text-xs text-muted-foreground">{h.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">专旺格 / 一行得气</h3>
        <p className="mt-1 text-muted-foreground">
          五行单一独旺，且与日主同气。喜本气与所生之神；
          忌克我之神（破势）。
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {ZHUANWANG.map((z) => (
            <div key={z.name} className="rounded-md border border-border bg-background/60 p-3">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-foreground">{z.name}</span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] ${ELEMENT_TONE[z.el]}`}>
                  {z.el}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{z.cond}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">外格门槛高：</span>
        外格成立的条件极其严苛，命局清纯无破才可入格。多数命盘走"正格"路线 — 即扶抑用神，
        以中和为美。看到看似从、化或专旺的盘，先核四柱合冲、再核行运是否会破局。
      </div>
    </div>
  );
}
