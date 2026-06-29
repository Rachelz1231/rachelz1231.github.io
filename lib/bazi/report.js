// 月度运势报告：基于模板的纯函数引擎。
//   输入：命局 + 大运 + 流年柱 + 流月柱
//   输出：流月主气 + 与命局四柱 / 与大运 / 与流年 / 复合（三方齐冲、三合成局）的中文段落
//   全部 pattern → 预制模板查表拼接，不调用 LLM。

import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
} from "./constants";
import { tenGodOf } from "./sexagenary";
import { analyzeWithExternals } from "./relations";

// ─── 主气：流月对日主的十神 ───────────────────────
const TEN_GOD_MONTHLY = {
  比肩: "本月以己为主，同辈、合作往来增多。利自立、守规，但易固执——切忌为坚持而坚持。",
  劫财: "本月竞争意味浓，财务、合作宜守不宜进。冲动决策、口角破财风险较高，宜先思后行。",
  食神: "思路通畅，适合创作、研究、产出。身心相对舒泰，是缓冲与恢复的好时段。",
  伤官: "才华外显但锋芒易露，与权威关系紧张。利于演讲、创新，但避免硬怼上级。",
  偏财: "副业、动产、机会增多。横财意明显，宜把握短机；忌贪，进退分明。",
  正财: "本职与稳定收益受益。男命与配偶关系是重点；稳健经营，渐进累积。",
  七杀: "外压骤增，环境给压力。能扛得住则突破，扛不住易受挫。身体务必保养。",
  正官: "工作、考核、规章之事被放大。利升职、获认可，但注意被规则束缚的疲惫感。",
  偏印: "灵感与孤独并存。利学术、宗教、技术钻研，不利情感外向交流。",
  正印: "贵人、长辈、学习机会涌现。心境趋稳，宜静修、读书、与母系亲缘联系。",
};

const POS_TONE = {
  年: "祖辈/根基",
  月: "事业/父母",
  日: "自身/伴侣",
  时: "子女/晚年",
};

const NATAL_POS = ["年", "月", "日", "时"];
const EXT_POS = ["运", "岁", "流月"];

// ─── B. 流月 vs 命局某柱 ───────────────────────────
function natalLine(type, pos) {
  const tone = POS_TONE[pos];
  switch (type) {
    case "chong":  return `流月支冲${pos}柱（${tone}）—— 该方面易动荡、迁移、争执，宜静不宜动。`;
    case "liuhe":  return `流月支与${pos}柱六合（${tone}）—— 人际顺缘，合作易成。`;
    case "xing":   return `流月刑${pos}柱（${tone}）—— 易生口舌、是非，处理宜软不宜硬。`;
    case "hai":    return `流月害${pos}柱（${tone}）—— 暗中阻力，事易被拖延。`;
    default:       return null;
  }
}
function natalStemLine(huaState, pos) {
  const tone = POS_TONE[pos];
  if (huaState?.external) return `流月干与${pos}柱（${tone}）干合 —— 短期牵动，月底自解。`;
  if (huaState?.formed)   return `流月干与${pos}柱（${tone}）合化成局 —— 关系/方向有"定型"之机。`;
  return `流月干与${pos}柱（${tone}）相合（合而不化）—— 有牵动但未必落定，宜观望。`;
}

// ─── C. 流月 vs 大运 ───────────────────────────────
function dayunLine(type) {
  switch (type) {
    case "chong": return "流月冲大运 —— 大运主线被本月暂时打断，长期计划的关键节点宜避让月气。";
    case "liuhe": return "流月与大运六合 —— 本月顺应大运基调，宜稳步推进既定方向。";
    case "xing":  return "流月刑大运 —— 大运赋予的角色短期受压。";
    case "hai":   return "流月害大运 —— 大运利益受隐性侵蚀，月内警觉。";
    default:      return null;
  }
}
function dayunStemLine() {
  return "流月干与大运干相合 —— 本月强化大运主气，相关事项可借势加力。";
}

// ─── D. 流月 vs 流年 ───────────────────────────────
function liunianLine(type) {
  switch (type) {
    case "chong": return "流月冲流年 —— 太岁与月气相冲，本月在年度安排里属波动期，避大事。";
    case "liuhe": return "流月与流年六合 —— 本月顺应年气，凡事易成。";
    case "xing":  return "流月刑流年 —— 是非口舌易在月内集中爆发。";
    case "hai":   return "流月害流年 —— 年内潜在阻力被月气放大。";
    default:      return null;
  }
}
function liunianStemLine() {
  return "流月干与流年干相合 —— 本月强化太岁主气，年度议题之事或在本月触发。";
}

// ─── E. 复合判断：流月+大运+流年 共同作用 ──────────
function compoundLines(rel) {
  const out = [];

  // 1. 多方齐冲：同一命局柱被 流月 + (大运|流年) 同时冲
  const chongOnNatal = {};
  for (const it of rel.chong) {
    const natal = it.positions.find((p) => NATAL_POS.includes(p));
    const ext = it.positions.find((p) => EXT_POS.includes(p));
    if (natal && ext) (chongOnNatal[natal] ||= new Set()).add(ext);
  }
  for (const [pos, exts] of Object.entries(chongOnNatal)) {
    if (exts.has("流月") && exts.size >= 2) {
      const others = [...exts].filter((e) => e !== "流月").map((e) => e === "运" ? "大运" : "流年");
      out.push(
        `【齐冲】流月 + ${others.join(" + ")} 同冲${pos}柱（${POS_TONE[pos]}）—— 该方面震动叠加，本月避大事、远是非。`
      );
    }
  }

  // 2. 三方合局：流月 + 大运 + 流年 三支构成完整三合局
  for (const it of rel.sanhe) {
    if (it.complete && it.positions.includes("流月")) {
      const exts = it.positions.filter((p) => EXT_POS.includes(p));
      if (exts.length === 3) {
        out.push(
          `【三方合局】流月 + 大运 + 流年 三支构成 ${it.element} 局 —— 本月外缘强化该五行，借势行事可成。`
        );
      }
    }
  }

  // 3. 流月引动 大运/流年 与命局某柱的合（流月做引线）
  // —— 简化：若流月支与命局某柱六合，且流年支与同柱也六合 → 双合加强
  const liuheOnNatal = {};
  for (const it of rel.liuhe) {
    const natal = it.positions.find((p) => NATAL_POS.includes(p));
    const ext = it.positions.find((p) => EXT_POS.includes(p));
    if (natal && ext) (liuheOnNatal[natal] ||= new Set()).add(ext);
  }
  for (const [pos, exts] of Object.entries(liuheOnNatal)) {
    if (exts.has("流月") && exts.size >= 2) {
      const others = [...exts].filter((e) => e !== "流月").map((e) => e === "运" ? "大运" : "流年");
      out.push(
        `【齐合】流月 + ${others.join(" + ")} 同合${pos}柱（${POS_TONE[pos]}）—— 该方面机缘叠加，本月可主动出手。`
      );
    }
  }

  return out;
}

// ─── 主入口 ────────────────────────────────────────
export function monthlyReport({ natal, daYun, liuNianPillar, liuYuePillar }) {
  const dayStem = natal.day.stem;
  const tenGod = tenGodOf(dayStem, liuYuePillar.stem);

  const externals = [
    daYun && { stem: daYun.stem, branch: daYun.branch, label: "运" },
    liuNianPillar && { stem: liuNianPillar.stem, branch: liuNianPillar.branch, label: "岁" },
    { stem: liuYuePillar.stem, branch: liuYuePillar.branch, label: "流月" },
  ].filter(Boolean);
  const all = analyzeWithExternals(natal, externals);
  const rel = {
    chong:      all.chong.filter((it) => it.positions.includes("流月")),
    liuhe:      all.liuhe.filter((it) => it.positions.includes("流月")),
    sanhe:      all.sanhe.filter((it) => it.positions.includes("流月")),
    sanhui:     all.sanhui.filter((it) => it.positions.includes("流月")),
    xing:       all.xing.filter((it) => it.positions.includes("流月")),
    hai:        all.hai.filter((it) => it.positions.includes("流月")),
    stemCombos: all.stemCombos.filter((it) => it.positions.includes("流月")),
  };

  const sections = [];

  // A. 主气
  sections.push({
    title: "本月主气",
    body: `流月柱 ${HEAVENLY_STEMS[liuYuePillar.stem]}${EARTHLY_BRANCHES[liuYuePillar.branch]}，对日主为 ${tenGod}。`,
    detail: TEN_GOD_MONTHLY[tenGod] || "",
  });

  // B. 与命局
  const natalLines = [];
  for (const it of rel.chong) {
    const pos = it.positions.find((p) => NATAL_POS.includes(p));
    if (pos) natalLines.push(natalLine("chong", pos));
  }
  for (const it of rel.liuhe) {
    const pos = it.positions.find((p) => NATAL_POS.includes(p));
    if (pos) natalLines.push(natalLine("liuhe", pos));
  }
  for (const it of rel.xing) {
    const pos = it.positions.find((p) => NATAL_POS.includes(p));
    if (pos) natalLines.push(natalLine("xing", pos));
  }
  for (const it of rel.hai) {
    const pos = it.positions.find((p) => NATAL_POS.includes(p));
    if (pos) natalLines.push(natalLine("hai", pos));
  }
  for (const it of rel.stemCombos) {
    const pos = it.positions.find((p) => NATAL_POS.includes(p));
    if (pos) natalLines.push(natalStemLine(it.hua, pos));
  }
  for (const it of rel.sanhe) {
    if (it.positions.includes("流月") && it.element) {
      natalLines.push(
        it.complete
          ? `流月引动 ${it.element} 三合局 —— 与${it.element}相关之十神（视命局看是财/官/印/食/比）被加强。`
          : `流月半合 ${it.element} 局 —— ${it.element}气场半起，方向已见但力未足。`
      );
    }
  }
  for (const it of rel.sanhui) {
    if (it.positions.includes("流月") && it.element) {
      natalLines.push(`流月并入 ${it.element} 方 —— 整体气场偏向${it.element}。`);
    }
  }
  if (natalLines.length) sections.push({ title: "与命局四柱", lines: natalLines });

  // C. 与大运
  const dyLines = [];
  if (daYun) {
    for (const it of rel.chong)
      if (it.positions.includes("运")) dyLines.push(dayunLine("chong"));
    for (const it of rel.liuhe)
      if (it.positions.includes("运")) dyLines.push(dayunLine("liuhe"));
    for (const it of rel.xing)
      if (it.positions.includes("运")) dyLines.push(dayunLine("xing"));
    for (const it of rel.hai)
      if (it.positions.includes("运")) dyLines.push(dayunLine("hai"));
    for (const it of rel.stemCombos)
      if (it.positions.includes("运")) dyLines.push(dayunStemLine());
    if (dyLines.length) sections.push({ title: "与大运", lines: dyLines.filter(Boolean) });
  }

  // D. 与流年
  const lnLines = [];
  if (liuNianPillar) {
    for (const it of rel.chong)
      if (it.positions.includes("岁")) lnLines.push(liunianLine("chong"));
    for (const it of rel.liuhe)
      if (it.positions.includes("岁")) lnLines.push(liunianLine("liuhe"));
    for (const it of rel.xing)
      if (it.positions.includes("岁")) lnLines.push(liunianLine("xing"));
    for (const it of rel.hai)
      if (it.positions.includes("岁")) lnLines.push(liunianLine("hai"));
    for (const it of rel.stemCombos)
      if (it.positions.includes("岁")) lnLines.push(liunianStemLine());
    if (lnLines.length) sections.push({ title: "与流年", lines: lnLines.filter(Boolean) });
  }

  // E. 复合
  const cmpLines = compoundLines(rel);
  if (cmpLines.length) sections.push({ title: "复合判断（齐冲/齐合/三合局）", lines: cmpLines });

  if (sections.length === 1) {
    sections.push({
      title: "与命局/大运/流年关系",
      detail: "本月与各方均无明显合冲刑害，气场平稳，按部就班即可。",
    });
  }

  return { liuYuePillar, tenGod, sections };
}
