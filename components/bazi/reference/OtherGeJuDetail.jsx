// 其余正格七种简要介绍：羊刃、正官、七杀、食神、伤官、财、印。

const GE = [
  {
    name: "羊刃格",
    cond: "月支为日主刃位（甲见卯、丙戊见午、庚见酉、壬见子），主要为阳干使用",
    desc:
      "刃为劫财之极，性烈。阳刃配杀（杀刃格）最贵，刚柔相济；忌财来增刃、伤官见刃。",
    fav: ["七杀", "正官", "食神"],
    avoid: ["再见劫财", "伤官见刃", "财生刃"],
  },
  {
    name: "正官格",
    cond: "月支本气或透出为正官；身官两旺为佳",
    desc:
      "为八格之正，主声望、官职、规矩。喜财生官、印护身；忌伤官（破格）、七杀混（淆乱）。女命正官即夫星，宜清纯。",
    fav: ["财", "印", "比肩护官"],
    avoid: ["伤官", "七杀混", "印过重"],
  },
  {
    name: "七杀格",
    cond: "月支本气或透出为七杀，无制为乱、有制为权",
    desc:
      "杀为偏官，无情之克。必须制（食伤）或化（印）方成贵格。书云：\"有杀只论杀，无杀方论用\"。最忌官杀混杂、财生杀无制。",
    fav: ["食神制杀", "印化杀", "羊刃合杀"],
    avoid: ["官杀混", "财生杀无制", "身弱无依"],
  },
  {
    name: "食神格",
    cond: "月支透食神且食有根",
    desc:
      "食为我生之同性，温润含蓄。最喜见财—食神生财，福寿双全；最忌枭神夺食（偏印克食）。\n身强用食泄秀，身弱则不喜食过重。",
    fav: ["财", "比劫扶身"],
    avoid: ["偏印（枭神）", "重食盗气"],
  },
  {
    name: "伤官格",
    cond: "月支透伤官，常见于身强者，泄秀有道",
    desc:
      "伤官最聪明，亦最叛逆。三种用法：伤官生财（最佳）、伤官配印（贵格）、伤官见官（破格大忌，除非『伤官伤尽』）。",
    fav: ["财（生财）", "正印（配印）"],
    avoid: ["正官（见官）", "杂混局面"],
  },
  {
    name: "正/偏财格",
    cond: "月支透财，身有根能担",
    desc:
      "财为养命之源。喜食伤生财、官星护财；忌比劫夺财（除非有官制比）。\n正财守，偏财活；男命财亦为妻星，喜清不喜混。",
    fav: ["食伤", "官杀（护财）", "印（身弱时）"],
    avoid: ["比劫无制", "财多身弱"],
  },
  {
    name: "正/偏印格",
    cond: "月支透印，印有根能化",
    desc:
      "印为我之源，主学识、母亲、文书。喜官杀生印；忌财坏印（除非身极强）。\n偏印（枭神）若再克食神则凶 — 故偏印格喜见财以制枭。",
    fav: ["官杀生印", "印旺用财（损印为用）"],
    avoid: ["财坏印（身弱时）", "枭克食"],
  },
];

const TONE_FAV = "bg-emerald-100 text-emerald-900";
const TONE_AVOID = "bg-rose-100 text-rose-900";

export function OtherGeJuDetail() {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-muted-foreground">
        以下七格均以"<strong>月令</strong>"为骨架，按透干十神定名；
        实战时先看身强弱、再看用神之喜忌，最后判合冲破格。
      </p>
      {GE.map((g) => (
        <div
          key={g.name}
          className="rounded-md border border-border bg-background/60 p-3"
        >
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="font-medium text-foreground">{g.name}</h4>
            <span className="text-[11px] text-muted-foreground">
              条件：{g.cond}
            </span>
          </div>
          <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
            {g.desc}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-muted-foreground">喜：</span>
            {g.fav.map((t) => (
              <span key={t} className={`rounded px-1.5 py-0.5 ${TONE_FAV}`}>
                {t}
              </span>
            ))}
            <span className="ml-2 text-muted-foreground">忌：</span>
            {g.avoid.map((t) => (
              <span key={t} className={`rounded px-1.5 py-0.5 ${TONE_AVOID}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
