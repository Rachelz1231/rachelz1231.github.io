// 建禄格详解：取格条件 → 喜忌 → 用神变格

const JIANLU_SIGNS = [
  { day: "甲", month: "寅", note: "甲见寅 — 木临根地" },
  { day: "乙", month: "卯", note: "乙见卯 — 木气最旺" },
  { day: "丙", month: "巳", note: "丙见巳 — 火得本宫" },
  { day: "丁", month: "午", note: "丁见午 — 火光普照" },
  { day: "戊", month: "巳", note: "戊见巳 — 火土同宫" },
  { day: "己", month: "午", note: "己见午 — 火土相生" },
  { day: "庚", month: "申", note: "庚见申 — 金气当令" },
  { day: "辛", month: "酉", note: "辛见酉 — 金光锋锐" },
  { day: "壬", month: "亥", note: "壬见亥 — 水归本位" },
  { day: "癸", month: "子", note: "癸见子 — 水流潜行" },
];

const VARIANTS = [
  {
    name: "建禄透财（建禄用财格）",
    cond: "命中透正/偏财，且财有根",
    desc: "身强任财，主富。最忌比劫再透夺财；喜食伤通关，使比劫生财。",
    fav: ["食伤", "财", "官杀"],
    avoid: ["比劫", "印（重）"],
  },
  {
    name: "建禄透官（建禄用官格）",
    cond: "命中透正官，月令为禄、官有根",
    desc: "身官两停，主贵。最喜财生官、印护身；忌伤官见官、七杀混来。",
    fav: ["官", "财", "印"],
    avoid: ["伤官", "杀（混）", "比劫"],
  },
  {
    name: "建禄透杀（建禄用杀格）",
    cond: "命中透七杀，月令为禄",
    desc: "身强敢任杀，主权威。需食神制杀或印化杀；忌财生杀过旺、官杀混杂。",
    fav: ["食神制杀", "印化杀", "羊刃合杀"],
    avoid: ["财生杀（无制）", "官杀混"],
  },
  {
    name: "建禄透食伤（建禄用食伤格）",
    cond: "命中透食神或伤官，食伤有根",
    desc: "身强好泄秀。食神主才艺温润，伤官主锋芒。喜见财成『食伤生财』。",
    fav: ["财", "食伤"],
    avoid: ["印夺食", "枭印重叠"],
  },
  {
    name: "建禄逢印（建禄佩印格）",
    cond: "命中再透正/偏印",
    desc: "身已强，再印是过；除非有官杀贪生忘克，否则印反成累。",
    fav: ["官杀（引印有用）", "财（损印）"],
    avoid: ["重印", "无官杀的印枭"],
  },
  {
    name: "建禄无依（建禄无用神）",
    cond: "命中不透财官食伤，全是比劫印星",
    desc: "身极旺无泄无克，反需从强格论；或行运逢财官食伤才显作用。",
    fav: ["大运财官食伤"],
    avoid: ["原局无神，全靠运补"],
  },
];

const TONE_FAV = "bg-emerald-100 text-emerald-900";
const TONE_AVOID = "bg-rose-100 text-rose-900";

export function JianluGeDetail() {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <h3 className="font-medium text-foreground">什么是建禄格</h3>
        <p className="mt-1 text-muted-foreground">
          月支本气为日主之比肩，即"<strong>禄位</strong>" — 比劫之最稳。
          十干各自禄宫如下：
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {JIANLU_SIGNS.map((p) => (
            <span
              key={p.day}
              className="rounded border border-border bg-background/60 px-2 py-1 text-xs"
              title={p.note}
            >
              <span className="font-medium">{p.day}</span>
              <span className="mx-1 text-muted-foreground">·</span>
              <span>{p.month}月</span>
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">基本喜忌</h3>
        <p className="mt-1 text-muted-foreground">
          建禄者日主必旺。八字论"中和"，故建禄格重在"<strong>泄</strong>"或"<strong>克</strong>"：
          以食伤泄秀、以财引动、以官杀贵气制衡。最忌再加比劫、印星扶身。
        </p>
      </div>

      <div>
        <h3 className="font-medium text-foreground">分支变格</h3>
        <p className="mt-1 text-muted-foreground">
          建禄格按透出的十神不同，细分为以下六种用神格局：
        </p>
        <div className="mt-3 space-y-2">
          {VARIANTS.map((v) => (
            <div
              key={v.name}
              className="rounded-md border border-border bg-background/60 p-3"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <h4 className="font-medium text-foreground">{v.name}</h4>
                <span className="text-[11px] text-muted-foreground">
                  条件：{v.cond}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {v.desc}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-muted-foreground">喜：</span>
                {v.fav.map((t) => (
                  <span key={t} className={`rounded px-1.5 py-0.5 ${TONE_FAV}`}>
                    {t}
                  </span>
                ))}
                <span className="ml-2 text-muted-foreground">忌：</span>
                {v.avoid.map((t) => (
                  <span key={t} className={`rounded px-1.5 py-0.5 ${TONE_AVOID}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">实战要点：</span>
        建禄不是结果，而是起点。判断建禄格优劣，关键看月令之外的三柱：
        <span className="text-foreground">天干透什么、地支根浅深、合冲是否破格</span>。
        透财、透官、透食伤，便是建禄的方向；只见比劫印星，则需大运补给。
      </div>
    </div>
  );
}
