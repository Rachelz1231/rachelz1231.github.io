// 夫妻宫 + 配偶星 解析

const PALACE_BY_TG = [
  {
    tg: "比肩 / 劫财",
    tone: "bg-zinc-100 text-zinc-800",
    male: "妻多与自己同行同好。身强者须防劫财夺妻破财；身弱者反得比劫帮身，配偶为同行助力、共担风雨。",
    female: "夫多平辈感、像兄妹。身强者劫财坐日须防夫缘被夺；身弱者得帮身之力，配偶为同舟共济的战友。",
    keyword: "平等 / 竞争 / 帮身",
  },
  {
    tg: "食神 / 伤官",
    tone: "bg-sky-100 text-sky-900",
    male: "妻聪明含蓄（食）或才华锋芒（伤）；女命家中长子之相",
    female: "夫多温和体贴（食）或情感浓烈起伏（伤）；伤官坐日感情易波折",
    keyword: "才情 / 表达",
  },
  {
    tg: "正财 / 偏财",
    tone: "bg-amber-100 text-amber-900",
    male: "日坐财=配偶宫得用，妻贤主家；正财端稳，偏财活泼",
    female: "夫工于理财、务实；财坐日女命须身有根方能任",
    keyword: "实际 / 持家",
  },
  {
    tg: "正官 / 七杀",
    tone: "bg-rose-100 text-rose-900",
    male: "妻能压己、家庭主导；杀坐日须有制",
    female: "日坐官=夫星得位，丈夫体面、有担当；七杀须有食伤制衡",
    keyword: "权威 / 主导",
  },
  {
    tg: "正印 / 偏印",
    tone: "bg-emerald-100 text-emerald-900",
    male: "妻像母亲、关怀型；偏印（枭）坐日须防冷淡或晚婚",
    female: "夫多年长、学识或精神契合；偏印坐日易感情清淡",
    keyword: "照护 / 精神",
  },
];

const STAR_RULE = [
  {
    role: "男命 · 配偶星 = 财星",
    detail:
      "正财端稳，偏财外向。看四柱有几位财星、是否透干、是否通根 — 一位清纯透干有根为佳，多财乱财则缘多婚易。",
    fav: ["财有根", "财不被劫", "财得食伤生"],
    avoid: ["多财夺位", "比劫透干夺财", "财空亡"],
  },
  {
    role: "女命 · 配偶星 = 官杀",
    detail:
      "正官为夫，七杀为情。看官杀清浊：一位正官透干无杂为上婚；官杀混杂或七杀无制则婚姻波折。",
    fav: ["正官清透", "财生官", "官有根"],
    avoid: ["官杀混杂", "伤官见官", "官星无根"],
  },
];

const TRIGGER = [
  {
    name: "合（六合 / 三合）入日支",
    color: "bg-sage-50",
    meaning: "牵动配偶宫，可能见对象、定情或同居；合化喜神则婚事顺。",
  },
  {
    name: "冲（六冲）日支",
    color: "bg-rose-50",
    meaning: "动摇配偶宫，主分离、争执或健康变动。子午卯酉等正冲尤烈。",
  },
  {
    name: "刑日支",
    color: "bg-rose-50",
    meaning: "感情不和、纠葛或法律纠纷；自刑（辰午酉亥）反复内耗。",
  },
  {
    name: "害日支",
    color: "bg-rose-50",
    meaning: "暗损、口舌、隔阂；不显眼但持续。",
  },
  {
    name: "配偶星入命（运 / 岁）",
    color: "bg-sage-50",
    meaning: "男命行财运 / 女命行官运 + 日支被合或动 → 婚姻信号最强。",
  },
];

export function SpousePalace() {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <h3 className="font-medium text-foreground">两条主线</h3>
        <ul className="mt-2 space-y-1.5 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">夫妻宫 = 日支</span>
            ：与配偶最贴身的"住址"，反映相处模式、配偶气质。
          </li>
          <li>
            <span className="font-medium text-foreground">配偶星 = 男命财，女命官</span>
            ：配偶本人。落在哪柱、透不透、有没有根、有没有冲克，决定婚姻质量。
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          看婚姻必须两条线一起看：宫位说"住得怎么样"，星说"对方是怎么样的人"。
          只看一边容易偏。
        </p>
      </div>

      <div>
        <h3 className="font-medium text-foreground">日支十神 → 婚姻气质</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          以日主对日支本气藏干的十神为线，初判夫妻相处主旋律：
        </p>
        <p className="mt-1 text-xs text-amber-800">
          ⚠ 任一十神的"喜/忌"都要结合日主强弱看 ——
          身强者忌帮身（比劫印）喜耗泄（财官食伤），身弱者反之。
          下表的"风险"提示仅针对该十神是<strong>忌神</strong>时；若它恰为<strong>用神</strong>，
          则同一组合反而是助力。
        </p>
        <div className="mt-3 overflow-hidden rounded-md border border-border bg-background/60">
          {PALACE_BY_TG.map((p, i) => (
            <div
              key={p.tg}
              className={i > 0 ? "border-t border-border" : ""}
            >
              <div className="flex flex-wrap items-baseline gap-2 bg-muted/40 px-3 py-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${p.tone}`}
                >
                  {p.tg}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  · {p.keyword}
                </span>
              </div>
              <div className="grid gap-2 px-3 py-2.5 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">男命：</span>
                  <span className="text-foreground">{p.male}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">女命：</span>
                  <span className="text-foreground">{p.female}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">配偶星状态</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {STAR_RULE.map((s) => (
            <div
              key={s.role}
              className="rounded-md border border-border bg-background/60 p-3"
            >
              <p className="font-medium text-foreground">{s.role}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {s.detail}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-muted-foreground">喜：</span>
                {s.fav.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-900"
                  >
                    {t}
                  </span>
                ))}
                <span className="ml-2 text-muted-foreground">忌：</span>
                {s.avoid.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-rose-100 px-1.5 py-0.5 text-rose-900"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">触动夫妻宫的运 / 岁</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          大运、流年的地支与日支发生关系时，往往是婚姻事件出现的窗口：
        </p>
        <div className="mt-2 space-y-2">
          {TRIGGER.map((t) => (
            <div
              key={t.name}
              className={`rounded-md border border-border p-3 ${t.color}`}
            >
              <p className="text-xs font-medium text-foreground">{t.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">实战要点：</span>
        宫位决定"婚姻发生的方式"，配偶星决定"对方是怎样的人"，运岁决定"什么时候"。
        宫位 + 配偶星 + 时间 三线对齐，婚姻信号最清晰。
        若日支被合而配偶星又得用，且行配偶星之运 — 八字论婚的"标配组合"。
      </div>
    </div>
  );
}
