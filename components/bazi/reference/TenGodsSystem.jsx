// 十神生克泄化系统：以五行生克为骨架，把十神之间的所有互动归为五种关系。

// 五个十神类别，按"相生顺时针"排列：印 → 比劫 → 食伤 → 财 → 官杀 → 印
const CATEGORIES = [
  { key: "印",   full: "印枭",     tone: "bg-emerald-100 text-emerald-900", fill: "#dcfce7", stroke: "#166534" },
  { key: "比劫", full: "比劫",     tone: "bg-zinc-100 text-zinc-800",       fill: "#f4f4f5", stroke: "#3f3f46" },
  { key: "食伤", full: "食伤",     tone: "bg-sky-100 text-sky-900",         fill: "#e0f2fe", stroke: "#075985" },
  { key: "财",   full: "财星",     tone: "bg-amber-100 text-amber-900",     fill: "#fef3c7", stroke: "#854d0e" },
  { key: "官杀", full: "官杀",     tone: "bg-rose-100 text-rose-900",       fill: "#ffe4e6", stroke: "#9f1239" },
];

const POSITIONS = CATEGORIES.map((c, i) => {
  const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / 5;
  return { ...c, x: 180 + 130 * Math.cos(angle), y: 180 + 130 * Math.sin(angle) };
});

const pos = (k) => POSITIONS.find((p) => p.key === k);
const shorten = (a, b, r = 32) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  return {
    x1: a.x + (dx * r) / len, y1: a.y + (dy * r) / len,
    x2: b.x - (dx * r) / len, y2: b.y - (dy * r) / len,
  };
};

const SHENG = [
  ["印", "比劫"],   // 印生比劫
  ["比劫", "食伤"], // 比劫生食伤
  ["食伤", "财"],   // 食伤生财
  ["财", "官杀"],   // 财生官杀
  ["官杀", "印"],   // 官杀生印
];

const KE = [
  ["印", "食伤"],   // 印克食伤（枭夺食）
  ["食伤", "官杀"], // 食伤克官杀（伤官见官 / 食神制杀）
  ["官杀", "比劫"], // 官杀克比劫
  ["比劫", "财"],   // 比劫克财（劫财夺财）
  ["财", "印"],     // 财克印（财坏印）
];

// 5×5 互动矩阵：行 = 行动者(A), 列 = 受影响者(B), 单元 = A 对 B 的关系
const MATRIX_TEXT = {
  "印_印":     { rel: "同类", desc: "—" },
  "印_比劫":   { rel: "生",   desc: "印生比劫，扶身" },
  "印_食伤":   { rel: "克",   desc: "枭夺食 / 印克伤" },
  "印_财":     { rel: "被克", desc: "财坏印（被财所克）" },
  "印_官杀":   { rel: "被生", desc: "官杀生印（受生）" },
  "比劫_印":   { rel: "被生", desc: "比劫泄印" },
  "比劫_比劫": { rel: "同类", desc: "—" },
  "比劫_食伤": { rel: "生",   desc: "比劫生食伤" },
  "比劫_财":   { rel: "克",   desc: "劫财夺财" },
  "比劫_官杀": { rel: "被克", desc: "官杀克比劫，攻身" },
  "食伤_印":   { rel: "被克", desc: "被印克（食被枭夺）" },
  "食伤_比劫": { rel: "被生", desc: "食伤泄比劫" },
  "食伤_食伤": { rel: "同类", desc: "—" },
  "食伤_财":   { rel: "生",   desc: "食伤生财" },
  "食伤_官杀": { rel: "克",   desc: "食神制杀 / 伤官见官" },
  "财_印":     { rel: "克",   desc: "财坏印" },
  "财_比劫":   { rel: "被克", desc: "财被比劫夺" },
  "财_食伤":   { rel: "被生", desc: "财泄食伤" },
  "财_财":     { rel: "同类", desc: "—" },
  "财_官杀":   { rel: "生",   desc: "财生官杀" },
  "官杀_印":   { rel: "生",   desc: "官杀生印（贵格）" },
  "官杀_比劫": { rel: "克",   desc: "官杀克比劫" },
  "官杀_食伤": { rel: "被克", desc: "被食伤制（食神制杀）" },
  "官杀_财":   { rel: "被生", desc: "官杀泄财" },
  "官杀_官杀": { rel: "同类", desc: "—" },
};

const REL_TONE = {
  "生":   "bg-emerald-50 text-emerald-800",
  "被生": "bg-emerald-50/60 text-emerald-700",
  "克":   "bg-rose-50 text-rose-800",
  "被克": "bg-rose-50/60 text-rose-700",
  "同类": "bg-muted/40 text-muted-foreground",
};

const REMEDIES = [
  {
    name: "泄法",
    tone: "bg-sky-100 text-sky-900",
    rule: "用「我生者」消耗忌神",
    feel: "温和、化暴为温、不冲突",
    examples: [
      { case: "比劫太旺", use: "食伤", reason: "比劫生食伤 → 把'抢'的劲变成'做'的劲" },
      { case: "食伤太旺", use: "财",   reason: "食伤生财 → 才华落到实处变成成就" },
      { case: "官杀太旺", use: "印",   reason: "官杀生印 → 压力转化为学习与积累（印化杀）" },
    ],
  },
  {
    name: "克法",
    tone: "bg-rose-100 text-rose-900",
    rule: "用「克我者」直接压制忌神",
    feel: "强硬、直接对抗、可能反弹",
    examples: [
      { case: "比劫太旺", use: "官杀", reason: "官杀克比劫 → 规则/权威压住夺财之意" },
      { case: "食伤太旺", use: "印",   reason: "印克食伤 → 但易成'枭夺食'，需慎用" },
      { case: "财太旺",   use: "比劫", reason: "比劫夺财 → 用兄弟力量分担" },
      { case: "官杀太旺", use: "食伤", reason: "食神制杀 / 伤官驾杀（贵格）" },
    ],
  },
  {
    name: "化法",
    tone: "bg-emerald-100 text-emerald-900",
    rule: "用「中间神」把忌神的能量反哺日主",
    feel: "最高级、化敌为友、需要配置",
    examples: [
      { case: "官杀克身", use: "印化杀", reason: "官杀生印、印生日主 → 攻击变滋养（最经典）" },
      { case: "财坏印",   use: "官杀通关", reason: "财生官、官生印 → 化解财印对立" },
      { case: "伤官见官", use: "财通关", reason: "伤官生财、财生官 → 化解伤官攻官" },
    ],
  },
];

export function TenGodsSystem() {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="font-medium text-foreground">骨架：十神 = 五行生克的"我"视角</h3>
        <p className="mt-1 text-muted-foreground">
          十神不是十个独立角色，而是五个类别（按五行生克链排列），每类再分阴阳：
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          {CATEGORIES.map((c) => (
            <span
              key={c.key}
              className={`rounded px-2 py-1 ${c.tone}`}
            >
              {c.full}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          顺序按相生：印 → 比劫 → 食伤 → 财 → 官杀 → 印（循环）。
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-[360px_1fr]">
        <div>
          <svg viewBox="0 0 360 360" className="h-[360px] w-[360px]">
            <defs>
              <marker id="ts-sheng" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#4d7c0f" />
              </marker>
              <marker id="ts-ke" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#be123c" />
              </marker>
            </defs>
            {SHENG.map(([a, b], i) => {
              const s = shorten(pos(a), pos(b));
              return (
                <line key={`s${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  stroke="#4d7c0f" strokeWidth="2" markerEnd="url(#ts-sheng)" />
              );
            })}
            {KE.map(([a, b], i) => {
              const s = shorten(pos(a), pos(b));
              return (
                <line key={`k${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  stroke="#be123c" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#ts-ke)" />
              );
            })}
            {POSITIONS.map((p) => (
              <g key={p.key}>
                <circle cx={p.x} cy={p.y} r="30" fill={p.fill} stroke={p.stroke} strokeWidth="1.5" />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill={p.stroke}>
                  {p.full}
                </text>
              </g>
            ))}
          </svg>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="inline-block h-0.5 w-5 bg-emerald-700" />相生
            </span>
            <span className="flex items-center gap-1.5 text-rose-800">
              <span className="inline-block h-0.5 w-5 border-t border-dashed border-rose-700" />相克
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-foreground">五种关系（任意两个十神之间）</h3>
            <ul className="mt-2 space-y-1.5 text-xs">
              <li className="flex items-baseline gap-2">
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-900">生</span>
                <span className="text-muted-foreground">A 增强 B（A 是 B 的"生我者"）</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-800">被生 / 泄</span>
                <span className="text-muted-foreground">A 消耗 B（A 是 B 的"我生者"，B 的能量流向 A）</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="rounded bg-rose-100 px-1.5 py-0.5 font-medium text-rose-900">克</span>
                <span className="text-muted-foreground">A 压制 B（A 是 B 的"克我者"）</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-800">被克</span>
                <span className="text-muted-foreground">A 是 B 的目标（A 是 B 的"我克者"）</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">同类</span>
                <span className="text-muted-foreground">A、B 同属一类（互相帮扶或竞争）</span>
              </li>
            </ul>
          </div>
          <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">关键观察：</span>
            "生"和"泄"是同一个关系的两端 — 一方给出 = 另一方收到。
            谁是"用神"决定我们叫它什么 — 加强用神时叫"生"，消耗忌神时叫"泄"。
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">5×5 互动矩阵</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          行 = 行动者 A，列 = 受影响者 B。单元格写"A 对 B 的关系"。
        </p>
        <div className="mt-2 overflow-x-auto rounded-md border border-border bg-background/60">
          <table className="w-full min-w-[480px] text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="px-2 py-2 text-left font-medium">A \ B</th>
                {CATEGORIES.map((c) => (
                  <th key={c.key} className="border-l border-border px-2 py-2 font-medium">
                    <span className={`rounded px-1.5 py-0.5 ${c.tone}`}>{c.full}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((a) => (
                <tr key={a.key} className="border-b border-border last:border-b-0">
                  <th className="px-2 py-2 text-left font-medium">
                    <span className={`rounded px-1.5 py-0.5 ${a.tone}`}>{a.full}</span>
                  </th>
                  {CATEGORIES.map((b) => {
                    const cell = MATRIX_TEXT[`${a.key}_${b.key}`];
                    return (
                      <td key={b.key} className="border-l border-border px-2 py-2 align-top">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${REL_TONE[cell.rel]}`}>
                          {cell.rel}
                        </span>
                        <p className="mt-1 text-[10px] leading-tight text-muted-foreground">
                          {cell.desc}
                        </p>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">三大用神思路（应对忌神过旺）</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {REMEDIES.map((r) => (
            <div key={r.name} className="rounded-md border border-border bg-background/60 p-3">
              <div className="flex items-baseline gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${r.tone}`}>
                  {r.name}
                </span>
              </div>
              <p className="mt-1.5 text-xs font-medium text-foreground">{r.rule}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{r.feel}</p>
              <ul className="mt-2 space-y-1.5 text-[11px]">
                {r.examples.map((e, i) => (
                  <li key={i} className="rounded bg-muted/30 p-1.5">
                    <p>
                      <span className="text-muted-foreground">{e.case}</span>
                      <span className="mx-1">→</span>
                      <span className="font-medium text-foreground">用 {e.use}</span>
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                      {e.reason}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">"合冲刑害"：非生克的特殊互动</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-background/60 p-3">
            <p className="text-xs font-medium text-foreground">天干五合（合 = disrupt 而非 destroy）</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              甲己 / 乙庚 / 丙辛 / 丁壬 / 戊癸。能"合住"某神使其暂时失力。
              如「羊刃合杀」、「合官留杀」 — 不消灭对方，但让它无法行使本职。
            </p>
          </div>
          <div className="rounded-md border border-border bg-background/60 p-3">
            <p className="text-xs font-medium text-foreground">地支六冲（动摇宫位）</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              子午 / 丑未 / 寅申 / 卯酉 / 辰戌 / 巳亥。
              冲不直接关乎十神，但能撼动该十神所坐的"住址"，连带其藏干、神煞一起动。
            </p>
          </div>
          <div className="rounded-md border border-border bg-background/60 p-3">
            <p className="text-xs font-medium text-foreground">地支相刑（内部纠缠）</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              寅巳申 / 丑戌未 / 子卯 / 辰午酉亥自刑。
              比冲更慢更绕，主纠葛、官非、内耗。
            </p>
          </div>
          <div className="rounded-md border border-border bg-background/60 p-3">
            <p className="text-xs font-medium text-foreground">地支相害（暗损）</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              子未 / 丑午 / 寅巳 / 卯辰 / 申亥 / 酉戌。
              不显眼但持续，主小人、口舌、隔阂。
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">总结：</span>
        八字断命用神，本质就是这个矩阵的查表 ——「忌神是谁」决定要克它还是泄它，
        「中间神」决定能不能化、能不能合。配合身强弱判断「谁是忌、谁是用」，
        这套系统就能驱动 80% 的实战分析。
      </div>
    </div>
  );
}
