"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  STEM_YIN_YANG,
  computeRelations,
  elementAnalysis,
  tenGodOf,
} from "@/lib/bazi";
import { ELEMENT_COLOR } from "./shared";

// 五合 / 六合 配对（合的"化神"在合盘里只作牵引信号，不评价化）
const STEM_COMBO_PAIRS = [
  [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
];
const BRANCH_HE_PAIRS = [
  [0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7],
];
const FIVE = ["木", "火", "土", "金", "水"];
const generatesEl = (a, b) => (FIVE.indexOf(a) + 1) % 5 === FIVE.indexOf(b);
const keEl = (a, b) => (FIVE.indexOf(a) + 2) % 5 === FIVE.indexOf(b);

export function PairAnalysis({ resultA, resultB, formA, formB }) {
  const [mode, setMode] = useState("couple");
  const nameA = (formA?.name && formA.name.trim()) || "甲方";
  const nameB = (formB?.name && formB.name.trim()) || "乙方";

  return (
    <>
      <Card className="mt-6 flex flex-wrap items-center gap-3 p-4">
        <span className="text-sm font-medium text-foreground">分析角度</span>
        <ToggleButton
          active={mode === "couple"}
          onClick={() => setMode("couple")}
        >
          情侣
        </ToggleButton>
        <ToggleButton
          active={mode === "friend"}
          onClick={() => setMode("friend")}
        >
          朋友 / 合作
        </ToggleButton>
      </Card>

      <DayPillarPanel
        resultA={resultA} resultB={resultB}
        nameA={nameA} nameB={nameB} mode={mode}
      />
      <TenGodMirrorPanel
        resultA={resultA} resultB={resultB}
        formA={formA} formB={formB}
        nameA={nameA} nameB={nameB} mode={mode}
      />
      <MonthCommandPanel
        resultA={resultA} resultB={resultB}
        nameA={nameA} nameB={nameB}
      />
      <ElementsFlowPanel
        resultA={resultA} resultB={resultB}
        nameA={nameA} nameB={nameB}
      />
      <OverallRelationsPanel
        resultA={resultA} resultB={resultB}
        nameA={nameA} nameB={nameB}
      />
    </>
  );
}

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

// ─── 日柱关系 ───────────────────────────────────────────────────────────
function DayPillarPanel({ resultA, resultB, nameA, nameB, mode }) {
  const rel = computeDayPillarRel(resultA, resultB);
  return (
    <Card className="mt-6 p-6">
      <h2 className="font-serif text-xl font-semibold">日柱关系</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        日柱代表自身与配偶宫，是合盘第一眼。日干主吸引/性格契合，日支主默契/相处节奏。
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <DayPillarCard name={nameA} pillar={resultA.day} />
        <DayPillarCard name={nameB} pillar={resultB.day} />
      </div>
      <div className="mt-5 space-y-2 text-sm">
        {dayPillarMessages(rel, mode, nameA, nameB).map((m, i) => (
          <DayPillarLine key={i} tone={m.tone} title={m.title} body={m.body} />
        ))}
      </div>
    </Card>
  );
}

function DayPillarCard({ name, pillar }) {
  const stEl = STEM_ELEMENT[pillar.stem];
  const brEl = BRANCH_ELEMENT[pillar.branch];
  return (
    <div className="flex flex-col items-center rounded-md border border-border bg-muted/30 p-4">
      <div className="text-xs text-muted-foreground">{name} · 日柱</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-serif text-4xl text-foreground">
          {HEAVENLY_STEMS[pillar.stem]}
        </span>
        <span className="font-serif text-4xl text-foreground">
          {EARTHLY_BRANCHES[pillar.branch]}
        </span>
      </div>
      <div className="mt-2 flex gap-2 text-[11px]">
        <span className={`rounded px-1.5 py-0.5 ${ELEMENT_COLOR[stEl]}`}>
          干 {stEl}·{STEM_YIN_YANG[pillar.stem]}
        </span>
        <span className={`rounded px-1.5 py-0.5 ${ELEMENT_COLOR[brEl]}`}>
          支 {brEl}
        </span>
      </div>
    </div>
  );
}

function DayPillarLine({ tone, title, body }) {
  const toneCls = {
    good: "border-sage-200 bg-sage-50",
    warn: "border-rose-200 bg-rose-50",
    neutral: "border-border bg-muted/30",
  }[tone];
  return (
    <div className={`rounded-md border px-3 py-2 ${toneCls}`}>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{body}</div>
    </div>
  );
}

function computeDayPillarRel(rA, rB) {
  const stA = rA.day.stem, stB = rB.day.stem;
  const brA = rA.day.branch, brB = rB.day.branch;
  const stElA = STEM_ELEMENT[stA], stElB = STEM_ELEMENT[stB];
  const brElA = BRANCH_ELEMENT[brA], brElB = BRANCH_ELEMENT[brB];

  const stemHe = STEM_COMBO_PAIRS.some(
    ([a, b]) => (a === stA && b === stB) || (a === stB && b === stA)
  );
  const stemSame = stA === stB;
  const stemKe = keEl(stElA, stElB) || keEl(stElB, stElA);
  const stemKeDir = keEl(stElA, stElB) ? "AB" : keEl(stElB, stElA) ? "BA" : null;
  const stemShengDir = generatesEl(stElA, stElB)
    ? "AB"
    : generatesEl(stElB, stElA)
      ? "BA"
      : null;

  const branchHe = BRANCH_HE_PAIRS.some(
    ([a, b]) => (a === brA && b === brB) || (a === brB && b === brA)
  );
  const branchSame = brA === brB;
  const branchChong = Math.abs(brA - brB) === 6;
  const branchKeDir = keEl(brElA, brElB)
    ? "AB"
    : keEl(brElB, brElA)
      ? "BA"
      : null;
  const branchShengDir = generatesEl(brElA, brElB)
    ? "AB"
    : generatesEl(brElB, brElA)
      ? "BA"
      : null;

  return {
    stemHe, stemSame, stemKe, stemKeDir, stemShengDir,
    branchHe, branchSame, branchChong, branchKeDir, branchShengDir,
    tianHeDiHe: stemHe && branchHe,
    tianKeDiChong: stemKe && branchChong,
  };
}

function dayPillarMessages(r, mode, nameA, nameB) {
  const m = [];
  // 复合信号优先
  if (r.tianHeDiHe) {
    m.push({
      tone: "good",
      title: "天合地合（双重吸引）",
      body:
        mode === "couple"
          ? "日干、日支同时相合——天然亲近、易陷入彼此，传统视为命定眷属之兆。"
          : "干支同合——气场最契合，合作或共事都能心领神会。",
    });
  }
  if (r.tianKeDiChong) {
    m.push({
      tone: "warn",
      title: "天克地冲（相克最烈）",
      body:
        mode === "couple"
          ? "日干相克 + 日支相冲——彼此立场、节奏都顶在一起，相处需要极强的接纳能力。"
          : "干克支冲——合作时方向、节奏都易撞车，分工要刻意错开。",
    });
  }
  // 单项天干
  if (r.stemHe && !r.tianHeDiHe) {
    m.push({
      tone: "good",
      title: "日干相合（相吸）",
      body:
        mode === "couple"
          ? "干合主吸引——见到对方容易在意，自然产生关注，是缘分的牵引信号。"
          : "干合主投缘——一见如故、容易聊得来。",
    });
  }
  if (r.stemSame) {
    m.push({
      tone: "neutral",
      title: "日干相同（同元）",
      body:
        mode === "couple"
          ? "性格底色一致，能彼此理解，但也容易因为太像而少了互补。"
          : "气质同频，沟通成本低，但容易在同一件事上撞强项。",
    });
  }
  if (r.stemShengDir && !r.stemHe && !r.stemSame) {
    const giver = r.stemShengDir === "AB" ? nameA : nameB;
    const taker = r.stemShengDir === "AB" ? nameB : nameA;
    m.push({
      tone: "good",
      title: `日干相生（${giver} 生 ${taker}）`,
      body: `${giver} 的气场天然滋养 ${taker}——长期相处中 ${taker} 更受益、更放松。`,
    });
  }
  if (r.stemKe && !r.tianKeDiChong) {
    const attacker = r.stemKeDir === "AB" ? nameA : nameB;
    const defender = r.stemKeDir === "AB" ? nameB : nameA;
    m.push({
      tone: "warn",
      title: `日干相克（${attacker} 克 ${defender}）`,
      body:
        mode === "couple"
          ? `${attacker} 的气场在 ${defender} 面前更显主导，相处中 ${defender} 容易感到被压制。`
          : `${attacker} 的风格容易压过 ${defender}，分工时要注意 ${defender} 的话语权。`,
    });
  }
  // 单项地支
  if (r.branchHe && !r.tianHeDiHe) {
    m.push({
      tone: "good",
      title: "日支相合（默契）",
      body:
        mode === "couple"
          ? "夫妻宫合——共同生活节奏顺畅，居家相处特别舒服。"
          : "节奏相合——共事时不需要多解释，配合天然合拍。",
    });
  }
  if (r.branchSame) {
    m.push({
      tone: "neutral",
      title: "日支相同",
      body: "两人日常作息和价值偏好相近，但也少了互相调剂的余地。",
    });
  }
  if (r.branchChong && !r.tianKeDiChong) {
    m.push({
      tone: "warn",
      title: "日支相冲",
      body:
        mode === "couple"
          ? "夫妻宫相冲——容易聚少离多、或在日常细节上观念不一。需要有意识地经营。"
          : "节奏相冲——一个想加速一个想慢下来，长期合作容易疲惫。",
    });
  }
  if (r.branchShengDir && !r.branchHe && !r.branchSame) {
    const giver = r.branchShengDir === "AB" ? nameA : nameB;
    const taker = r.branchShengDir === "AB" ? nameB : nameA;
    m.push({
      tone: "good",
      title: `日支相生（${giver} 生 ${taker}）`,
      body: `${giver} 的生活节奏托住 ${taker}，是隐性的支持。`,
    });
  }
  if (r.branchKeDir && !r.branchChong && !r.branchHe && !r.branchSame) {
    const attacker = r.branchKeDir === "AB" ? nameA : nameB;
    const defender = r.branchKeDir === "AB" ? nameB : nameA;
    m.push({
      tone: "warn",
      title: `日支相克（${attacker} 克 ${defender}）`,
      body: `日常节奏上 ${attacker} 容易主导，${defender} 易感被拉扯。`,
    });
  }
  if (m.length === 0) {
    m.push({
      tone: "neutral",
      title: "日柱无明显牵引",
      body: "两人日柱之间没有合冲生克——既不强烈吸引，也无显著对抗，更多看其他位的关系。",
    });
  }
  return m;
}

// ─── 十神镜像 ──────────────────────────────────────────────────────────
function TenGodMirrorPanel({
  resultA, resultB, formA, formB, nameA, nameB, mode,
}) {
  const tgAB = tenGodOf(resultA.day.stem, resultB.day.stem); // A 视角下 B 的日干
  const tgBA = tenGodOf(resultB.day.stem, resultA.day.stem);

  return (
    <Card className="mt-6 p-6">
      <h2 className="font-serif text-xl font-semibold">十神镜像</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        对方的日干在自己命里是什么十神，决定了对方在你生活里扮演的角色。
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TenGodMirrorCard
          viewer={nameA} target={nameB}
          targetStem={resultB.day.stem}
          tg={tgAB}
          viewerGender={formA?.gender}
          mode={mode}
        />
        <TenGodMirrorCard
          viewer={nameB} target={nameA}
          targetStem={resultA.day.stem}
          tg={tgBA}
          viewerGender={formB?.gender}
          mode={mode}
        />
      </div>
    </Card>
  );
}

const TEN_GOD_NOTE = {
  比肩: { friend: "同辈、义气，但也易在同一件事上撞强项。", couple: "性格平行，平等却少互补。" },
  劫财: { friend: "讲义气，也容易争同一份资源。", couple: "亲近又较劲，激情足、摩擦也多。" },
  食神: { friend: "对方激发你愿意表达、产出。", couple: "彼此愿意为对方付出，温情且生动。" },
  伤官: { friend: "才情碰撞，火花多但也尖锐。", couple: "感情浓烈、也容易翻脸。" },
  偏财: { friend: "利益往来流畅，关系偏外向。", couple: "异性缘强，关系偏向情趣与流动。" },
  正财: { friend: "稳定、可依赖，事务上靠谱。", couple: "男命妻星——传统意义的妻缘信号。" },
  七杀: { friend: "对方对你有压力感，也能逼出潜力。", couple: "改造型关系，紧张又上瘾。" },
  正官: { friend: "对方让你感到正式、有规矩。", couple: "女命夫星——传统意义的夫缘信号。" },
  偏印: { friend: "偏冷的精神支持，灵感型。", couple: "精神依靠，但也带距离感。" },
  正印: { friend: "导师/长辈型支持，让人安心。", couple: "更像被照顾的关系，温和但少激情。" },
};

function TenGodMirrorCard({ viewer, target, targetStem, tg, viewerGender, mode }) {
  const note = TEN_GOD_NOTE[tg]?.[mode === "couple" ? "couple" : "friend"];
  const isZhengYuan =
    mode === "couple" &&
    ((viewerGender === "male" && tg === "正财") ||
      (viewerGender === "female" && tg === "正官"));
  return (
    <div className="rounded-md border border-border p-4">
      <div className="text-xs text-muted-foreground">
        {viewer} 视角下，{target} 的日干
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-serif text-2xl text-foreground">
          {HEAVENLY_STEMS[targetStem]}
        </span>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
          {tg}
        </span>
        {isZhengYuan && (
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
            ★ 正缘信号
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

// ─── 月令关系 ──────────────────────────────────────────────────────────
function MonthCommandPanel({ resultA, resultB, nameA, nameB }) {
  const bA = resultA.month.branch, bB = resultB.month.branch;
  const elA = BRANCH_ELEMENT[bA], elB = BRANCH_ELEMENT[bB];

  const same = bA === bB;
  const chong = Math.abs(bA - bB) === 6;
  const he = BRANCH_HE_PAIRS.some(
    ([a, b]) => (a === bA && b === bB) || (a === bB && b === bA)
  );
  const shengDir = generatesEl(elA, elB)
    ? "AB"
    : generatesEl(elB, elA)
      ? "BA"
      : null;
  const keDir = keEl(elA, elB) ? "AB" : keEl(elB, elA) ? "BA" : null;

  let tone = "neutral", title, body;
  if (same) {
    tone = "good";
    title = "月令相同";
    body = "两人底层节奏与价值观近乎一致，聊得来，但也容易共同盲区。";
  } else if (he) {
    tone = "good";
    title = "月令相合";
    body = "底层价值观互相契合，相处时三观自然合拍。";
  } else if (chong) {
    tone = "warn";
    title = "月令相冲";
    body = "节奏顶到一起——一个想稳定一个想突破，话不投机，需要刻意拉齐预期。";
  } else if (shengDir) {
    tone = "good";
    title = `月令相生（${shengDir === "AB" ? nameA : nameB} 生 ${shengDir === "AB" ? nameB : nameA}）`;
    body = `${shengDir === "AB" ? nameA : nameB} 的节奏天然滋养 ${shengDir === "AB" ? nameB : nameA}，是底层支持的关系。`;
  } else if (keDir) {
    tone = "warn";
    title = `月令相克（${keDir === "AB" ? nameA : nameB} 克 ${keDir === "AB" ? nameB : nameA}）`;
    body = `底层节奏上 ${keDir === "AB" ? nameA : nameB} 容易主导，长期相处对 ${keDir === "AB" ? nameB : nameA} 是压力。`;
  } else {
    tone = "neutral";
    title = "月令关系一般";
    body = "节奏不冲不合——既不天然契合，也无明显矛盾，看其他位置。";
  }

  return (
    <Card className="mt-6 p-6">
      <h2 className="font-serif text-xl font-semibold">月令关系</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        月令代表底层节奏与价值观，决定能不能"聊得来"。
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <MonthCard name={nameA} branch={bA} />
        <MonthCard name={nameB} branch={bB} />
      </div>
      <div className="mt-4">
        <DayPillarLine tone={tone} title={title} body={body} />
      </div>
    </Card>
  );
}

function MonthCard({ name, branch }) {
  const el = BRANCH_ELEMENT[branch];
  return (
    <div className="flex flex-col items-center rounded-md border border-border bg-muted/30 p-4">
      <div className="text-xs text-muted-foreground">{name} · 月支</div>
      <div className="mt-2 font-serif text-4xl text-foreground">
        {EARTHLY_BRANCHES[branch]}
      </div>
      <span
        className={`mt-2 rounded px-1.5 py-0.5 text-[11px] ${ELEMENT_COLOR[el]}`}
      >
        {el}
      </span>
    </div>
  );
}

// ─── 五行流通 ──────────────────────────────────────────────────────────
function ElementsFlowPanel({ resultA, resultB, nameA, nameB }) {
  const eA = useMemo(() => elementAnalysis(resultA), [resultA]);
  const eB = useMemo(() => elementAnalysis(resultB), [resultB]);

  return (
    <Card className="mt-6 p-6">
      <h2 className="font-serif text-xl font-semibold">五行流通</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        合盘最看气场能否调候。一方所缺，另一方若刚好旺盛，就是天然的"药"。
      </p>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[420px]">
          <div className="grid grid-cols-[64px_repeat(5,minmax(56px,1fr))] border-y border-border bg-muted/60 text-xs">
            <div className="px-2 py-2 text-muted-foreground">五行</div>
            {FIVE.map((el) => (
              <div key={el} className="border-l border-border px-2 py-2 text-center font-medium">
                {el}
              </div>
            ))}
          </div>
          {[
            { lbl: nameA, data: eA },
            { lbl: nameB, data: eB },
          ].map((row) => (
            <div
              key={row.lbl}
              className="grid grid-cols-[64px_repeat(5,minmax(56px,1fr))] border-b border-border text-sm"
            >
              <div className="flex items-center justify-center bg-muted/30 py-2 text-xs text-muted-foreground">
                {row.lbl}
              </div>
              {FIVE.map((el) => (
                <div
                  key={el}
                  className="flex flex-col items-center justify-center border-l border-border py-2"
                >
                  <span className="font-medium">{row.data[el].count}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {row.data[el].label}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-[64px_repeat(5,minmax(56px,1fr))] text-sm">
            <div className="flex items-center justify-center bg-primary/10 py-2 text-xs font-medium text-foreground">
              合盘
            </div>
            {FIVE.map((el) => {
              const sum = eA[el].count + eB[el].count;
              const s = elementStatus(eA[el].count, eB[el].count);
              return (
                <div
                  key={el}
                  className="flex flex-col items-center justify-center border-l border-border bg-primary/5 py-2"
                >
                  <span className="font-medium">{sum}</span>
                  <span className={`text-[10px] ${s.toneCls}`}>{s.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        互补：一方缺，另一方旺，合盘后被补齐。 / 加重：双方都旺，合盘后更偏枯。 / 皆缺：两人都没有，合盘也补不上。
      </p>
    </Card>
  );
}

function elementStatus(a, b) {
  if (a === 0 && b >= 2) return { tag: "互补", toneCls: "text-sage-700" };
  if (b === 0 && a >= 2) return { tag: "互补", toneCls: "text-sage-700" };
  if (a + b >= 6) return { tag: "加重", toneCls: "text-rose-700" };
  if (a + b === 0) return { tag: "皆缺", toneCls: "text-rose-700" };
  return { tag: "—", toneCls: "text-muted-foreground" };
}

// ─── 整体合冲刑害（去掉化神，只保留跨盘项） ───────────────────────────
function OverallRelationsPanel({ resultA, resultB, nameA, nameB }) {
  const relations = useMemo(
    () => computePairRelations(resultA, resultB),
    [resultA, resultB]
  );
  const sections = [
    { key: "stem", title: "天干相合", items: relations.stemCombos, tone: "bg-sage-50", note: "主吸引、牵绊" },
    { key: "liuhe", title: "地支六合", items: relations.liuhe, tone: "bg-sage-50", note: "主默契" },
    { key: "sanhe", title: "地支三合", items: relations.sanhe, tone: "bg-sage-50", note: "凝聚力强" },
    { key: "sanhui", title: "地支三会", items: relations.sanhui, tone: "bg-sage-50", note: "气势成方" },
    { key: "chong", title: "地支六冲", items: relations.chong, tone: "bg-rose-50", note: "主冲撞" },
    { key: "xing", title: "地支相刑", items: relations.xing, tone: "bg-rose-50", note: "暗耗、是非" },
    { key: "hai", title: "地支相害", items: relations.hai, tone: "bg-rose-50", note: "暗中拖累" },
  ];
  const total = sections.reduce((a, s) => a + s.items.length, 0);
  const labelMap = {
    A年: `${nameA}·年`, A月: `${nameA}·月`, A日: `${nameA}·日`, A时: `${nameA}·时`,
    B年: `${nameB}·年`, B月: `${nameB}·月`, B日: `${nameB}·日`, B时: `${nameB}·时`,
  };

  return (
    <Card className="mt-6 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-xl font-semibold">两盘十六字 · 合冲刑害</h2>
        <span className="text-xs text-muted-foreground">
          {total === 0 ? "两盘相安" : `共 ${total} 项`}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        合多主黏腻、纠缠；冲多主争执、分离；刑害主暗耗、是非。理想是有合有冲，有张力又不至于散。
      </p>
      {total === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          两人天干无合、地支无合、冲、刑、害。
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sections
            .filter((s) => s.items.length > 0)
            .map((s) => (
              <div
                key={s.key}
                className={`rounded-md border border-border p-3 ${s.tone}`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    {s.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    {s.note}
                  </span>
                </div>
                <ul className="mt-2 space-y-2 text-sm">
                  {s.items.map((it, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-foreground">
                        {s.key === "stem" || s.key === "liuhe"
                          ? stripHua(it.name)
                          : it.name}
                      </span>
                      {it.complete === false && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          半合
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {it.positions.map((p) => labelMap[p] || p).join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}

// "甲己合化土" → "甲己相合"  /  "子丑合化土" → "子丑相合"  /  "午未相合" → 原样
function stripHua(name) {
  const idx = name.indexOf("合化");
  if (idx >= 0) return name.slice(0, idx) + "相合";
  return name;
}

function computePairRelations(resultA, resultB) {
  const pillars = [
    { stem: resultA.year.stem, branch: resultA.year.branch, label: "A年" },
    { stem: resultA.month.stem, branch: resultA.month.branch, label: "A月" },
    { stem: resultA.day.stem, branch: resultA.day.branch, label: "A日" },
    { stem: resultA.hour.stem, branch: resultA.hour.branch, label: "A时" },
    { stem: resultB.year.stem, branch: resultB.year.branch, label: "B年" },
    { stem: resultB.month.stem, branch: resultB.month.branch, label: "B月" },
    { stem: resultB.day.stem, branch: resultB.day.branch, label: "B日" },
    { stem: resultB.hour.stem, branch: resultB.hour.branch, label: "B时" },
  ];
  const raw = computeRelations(pillars);
  const isCross = (positions) =>
    positions.some((p) => p.startsWith("A")) &&
    positions.some((p) => p.startsWith("B"));
  return {
    stemCombos: raw.stemCombos.filter((it) => isCross(it.positions)),
    liuhe: raw.liuhe.filter((it) => isCross(it.positions)),
    sanhe: raw.sanhe.filter((it) => isCross(it.positions)),
    sanhui: raw.sanhui.filter((it) => isCross(it.positions)),
    chong: raw.chong.filter((it) => isCross(it.positions)),
    hai: raw.hai.filter((it) => isCross(it.positions)),
    xing: raw.xing.filter((it) => isCross(it.positions)),
  };
}
