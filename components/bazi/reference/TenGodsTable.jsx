// 十神镜像表：以日主为参照分类。

const ROWS = [
  {
    relation: "同我者",
    cn: "比劫",
    items: [
      { name: "比肩", yy: "同性", note: "兄弟、平辈、自我意志；劫财轻形", tone: "bg-zinc-100 text-zinc-800" },
      { name: "劫财", yy: "异性", note: "夺财、合作分润；阳刃之根", tone: "bg-zinc-100 text-zinc-800" },
    ],
  },
  {
    relation: "我生者",
    cn: "食伤",
    items: [
      { name: "食神", yy: "同性", note: "才华、子女、温和表达；制杀有礼", tone: "bg-sky-100 text-sky-900" },
      { name: "伤官", yy: "异性", note: "锋芒、创意、叛逆；克官见伤", tone: "bg-sky-100 text-sky-900" },
    ],
  },
  {
    relation: "我克者",
    cn: "财星",
    items: [
      { name: "偏财", yy: "同性", note: "动产、机遇、慷慨；男命外缘", tone: "bg-amber-100 text-amber-900" },
      { name: "正财", yy: "异性", note: "正薪、配偶；保守稳健", tone: "bg-amber-100 text-amber-900" },
    ],
  },
  {
    relation: "克我者",
    cn: "官杀",
    items: [
      { name: "七杀", yy: "同性", note: "权威、压力、行动派；需食伤制", tone: "bg-rose-100 text-rose-900" },
      { name: "正官", yy: "异性", note: "事业、官职、规范；女命夫星", tone: "bg-rose-100 text-rose-900" },
    ],
  },
  {
    relation: "生我者",
    cn: "印枭",
    items: [
      { name: "偏印", yy: "同性", note: "孤独、玄学、技艺；又称枭神", tone: "bg-emerald-100 text-emerald-900" },
      { name: "正印", yy: "异性", note: "学识、母亲、贵人；护身化煞", tone: "bg-emerald-100 text-emerald-900" },
    ],
  },
];

export function TenGodsTable() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-medium text-foreground">命名规则</h3>
        <p className="mt-1 text-muted-foreground">
          以日主（日干）为"我"。其他天干按五行关系分五类，每类再按阴阳异同分正偏：
          <span className="ml-1 text-foreground">同性偏 / 异性正</span>。
          财、官、印按"正偏"称呼；同辈称比劫；自生称食伤。
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-background/60">
        {ROWS.map((r, i) => (
          <div
            key={r.relation}
            className={i > 0 ? "border-t border-border" : ""}
          >
            <div className="flex items-baseline gap-2 bg-muted/40 px-3 py-2">
              <span className="text-xs font-medium text-foreground">
                {r.relation}
              </span>
              <span className="text-[11px] text-muted-foreground">
                · {r.cn}
              </span>
            </div>
            <div className="divide-y divide-border">
              {r.items.map((it, j) => (
                <div
                  key={j}
                  className="grid grid-cols-[1fr_2fr] gap-3 px-3 py-2.5"
                >
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${it.tone}`}
                    >
                      {it.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {it.yy}
                    </span>
                  </div>
                  <div className="text-xs leading-relaxed text-muted-foreground">
                    {it.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">速记：</span>
          甲日见甲为比肩、见乙为劫财；见丙为食神、见丁为伤官；
          见戊为偏财、见己为正财；见庚为七杀、见辛为正官；
          见壬为偏印、见癸为正印。
        </p>
      </div>
    </div>
  );
}
