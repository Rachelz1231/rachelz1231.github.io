// 婚姻风险信号：孽缘四维度 + 剪不断理还乱（合+冲/刑同根）专题

const DIMENSIONS = [
  {
    name: "① 夫妻宫被破坏",
    color: "bg-rose-50",
    items: [
      "**冲日支** — 子午 / 卯酉 / 寅申 / 巳亥 / 辰戌 / 丑未：婚姻易动摇、争吵、分离",
      "**刑日支** — 寅巳申 / 丑戌未 / 子卯 / 自刑：纠缠最深的「孽」，互相折磨却分不开",
      "**合日支但合化为忌神** — 名义上有人，实际不属于自己",
      "**害日支** — 暗损、口舌、隔阂，慢性磨人",
    ],
    note: "多重打击叠加（既冲又刑又被合）→ 孽缘风险最高",
  },
  {
    name: "② 配偶星不利",
    color: "bg-amber-50",
    items: [
      "**男命**：财多身弱（被妻拖累）／ 财被劫财夺（伴侣被抢）／ 偏财盖正财（婚外情）",
      "**女命**：官杀混杂（来去多人）／ 七杀无制（控制欲强、伤害性）／ 正官被合走（夫不在）",
      "配偶星无根、空亡、坐忌神位 → 缘薄",
    ],
  },
  {
    name: "③ 桃花 / 神煞",
    color: "bg-sky-50",
    items: [
      "**桃花星**（子午卯酉）在不利位 → 烂桃花",
      "**红艳煞** → 招惹是非",
      "**沐浴 / 咸池** → 多情且不定",
      "**孤鸾日**（乙巳 / 丁巳 / 辛亥 / 戊申）→ 命中带孤，婚姻坎坷",
      "**阴差阳错日**（丙子 / 丁丑 / 戊寅 / 辛卯 等）→ 名字直白：错配",
    ],
  },
  {
    name: "④ 日柱本身就是问题日",
    color: "bg-zinc-100",
    items: [
      "**孤鸾日** — 孤独单飞，难得伴",
      "**魁罡日**（庚辰 / 庚戌 / 壬辰 / 戊戌）— 性烈，对配偶要求极高",
      "**阴差阳错日** — 婚配错位",
      "**自合日柱**（丁亥 / 戊子 / 辛巳 / 壬午）— 日干日支暗合，自带纠缠属性",
    ],
  },
];

const KNOT_SIGNALS = [
  {
    n: "①",
    title: "日支既合又冲（或刑）",
    body: "日支和某一柱形成合，同时又被另一柱冲或刑。例如日支午、月支未（午未合）、年支子（子午冲）→ 粘着月柱但被年柱撕开。",
  },
  {
    n: "②",
    title: "日干合配偶星 + 合化不成",
    body: "男命甲见己（甲己合 = 妻）、女命乙见庚（乙庚合 = 夫），但月令不属化神之元素 → 合而不化。最经典的「剪不断理还乱」配置 —— 合住了但没融合，永远拉扯。",
  },
  {
    n: "③",
    title: "官杀混杂 + 正官合日（女命）",
    body: "天干五合都是阴阳异性 → 严格说七杀同性不直接合日主。但若命中正官和日主有合（如乙日见庚正官、乙庚合），而七杀同时出现混杂 → 一边是合（光明正大的吸引）、一边是杀（伤害感），表现为「身边有合法伴侣但心被有伤害感的另一人吸住」。这才是七杀类「剪不断」的真实机制。",
  },
  {
    n: "③b",
    title: "七杀临日 + 日支被合走",
    body: "七杀在月干或时干（紧贴日柱）→ 压迫感来自身边的人；同时日支（夫妻宫）被他柱合走 → 婚姻位被人合走、心向外人。两股力量叠加 = 在压迫性关系里走不掉，且自己也不真心在场。",
  },
  {
    n: "④",
    title: "日柱自合（日干暗合日支）",
    body: "丁亥 / 戊子 / 辛巳 / 壬午 这四个日柱自带「内部牵绊」属性 —— 自己就这么编程的，容易陷入自我撕扯的关系。",
  },
  {
    n: "⑤",
    title: "桃花 + 合 + 害 三层叠加",
    body: "桃花给强烈吸引，合给粘性，害给隐痛。三者落在同一关系链上 → 情感离不开，理智知道不对。",
  },
  {
    n: "⑥",
    title: "比劫合配偶星",
    body: "男命比劫合财 → 妻被同辈合走；女命比劫合官 → 夫被姐妹合走。不是被直接抢，是暧昧拉扯走，三角关系。",
  },
  {
    n: "⑦",
    title: "暗合 vs 明合",
    body: "明合（六合）= 意识到的引力。暗合（卯申 / 午亥 / 寅丑 等）= 潜在的、说不清的引力 —— 比明合更像「剪不断理还乱」，因为自己也解释不清为什么放不下。",
  },
];

export function MarriageRisk() {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="font-medium text-foreground">基本原则</h3>
        <p className="mt-1 text-muted-foreground">
          "孽缘"不是单一标志，而是<strong>多信号叠加</strong>。
          单个桃花、单个冲、单个孤鸾日 → 都不一定有事。
          但<strong>三个以上信号同时存在 + 大运 / 流年触发</strong> →
          才是真正的"孽缘窗口"。
        </p>
      </div>

      <div>
        <h3 className="font-medium text-foreground">四大维度</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {DIMENSIONS.map((d) => (
            <div
              key={d.name}
              className={`rounded-md border border-border p-3 ${d.color}`}
            >
              <p className="text-xs font-medium text-foreground">{d.name}</p>
              <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                {d.items.map((it, i) => (
                  <li key={i} className="leading-relaxed">
                    {renderBold(it)}
                  </li>
                ))}
              </ul>
              {d.note && (
                <p className="mt-2 text-[11px] italic text-rose-800">
                  ⚠ {d.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="font-medium text-foreground">
            专题：剪不断理还乱
          </h3>
          <span className="text-xs text-muted-foreground">
            合 + 冲 / 刑 / 害 同根 = 拉锯式煎熬
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          普通孽缘是单向问题（冲 → 分），但有种特殊配置是
          <strong>既有引力又有摩擦</strong>：
        </p>
        <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs text-muted-foreground">
          <li><strong>合</strong> = 磁铁互相吸 → 走不掉</li>
          <li><strong>冲 / 刑 / 害</strong> = 摩擦 / 内耗 → 过不好</li>
          <li>两者叠加在同一关系链 → 理性上想分，情感上离不开</li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          心理学里叫"创伤性纽带"（trauma bond），八字里就体现为
          <strong>合刑同根 / 合冲同根 / 自合日柱 / 合而不化</strong>。
        </p>

        <div className="mt-3 space-y-2">
          {KNOT_SIGNALS.map((s) => (
            <div
              key={s.n}
              className="rounded-md border border-border bg-background/60 p-3"
            >
              <p className="flex items-baseline gap-1.5 text-xs font-medium text-foreground">
                <span className="text-muted-foreground">{s.n}</span>
                {s.title}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {renderBold(s.body)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">化解思路</h3>
        <ul className="mt-2 space-y-1.5 text-xs">
          <li className="flex items-baseline gap-2">
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-900">通关</span>
            <span className="text-muted-foreground">在合刑链中插中间神，把克化为生（参考"十神生克泄化"一节）</span>
          </li>
          <li className="flex items-baseline gap-2">
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-900">运补</span>
            <span className="text-muted-foreground">行食伤泄、印化、财通关之运 → 关系性质会改变；走过特定时段，纠缠会松</span>
          </li>
          <li className="flex items-baseline gap-2">
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-900">觉知</span>
            <span className="text-muted-foreground">八字给出的是 pattern。意识到了，可以选择不重复。</span>
          </li>
          <li className="flex items-baseline gap-2">
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-900">距离</span>
            <span className="text-muted-foreground">物理 / 时间距离能让合的引力衰减；很多"剪不断"在多年后会自然松开。</span>
          </li>
        </ul>
      </div>

      <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">最后提醒：</span>
        八字描述的是<strong>风险模式</strong>，不是判决书。
        命有孽缘配置的人很多，但能把握好的人也很多 ——
        关键在于<strong>认出 pattern 而不被卷入</strong>，
        以及让<strong>大运行到化解时段</strong>时做关键决策。
      </div>
    </div>
  );
}

// 把 "**xx**" 渲染为 <strong>xx</strong>
function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="text-foreground">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
