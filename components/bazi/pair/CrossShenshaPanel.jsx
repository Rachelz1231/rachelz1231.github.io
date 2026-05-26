"use client";

import { Card } from "@/components/ui/card";
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from "@/lib/bazi";

// 桃花位：按 anchor 支所属三合局
//   申子辰 → 酉；寅午戌 → 卯；巳酉丑 → 午；亥卯未 → 子
const PEACH_BY_BRANCH = {
  0: 9, 4: 9, 8: 9,     // 申子辰
  2: 3, 6: 3, 10: 3,    // 寅午戌
  1: 6, 5: 6, 9: 6,     // 巳酉丑
  3: 0, 7: 0, 11: 0,    // 亥卯未
};

// 红艳煞：按日干
//   甲乙午、丙丁寅、戊己辰、庚辛戌、壬癸子
const HONGYAN_BY_STEM = {
  0: 6, 1: 6,      // 甲乙 → 午
  2: 2, 3: 2,      // 丙丁 → 寅
  4: 4, 5: 4,      // 戊己 → 辰
  6: 10, 7: 10,    // 庚辛 → 戌
  8: 0, 9: 0,      // 壬癸 → 子
};

// 孤鸾日（标准取这八个）：乙巳、丁巳、辛亥、戊申、壬子、丙午、戊午、壬寅
// 用 stem*12+branch 编码
const LONELY_DAYS = new Set([
  1 * 12 + 5,  // 乙巳
  3 * 12 + 5,  // 丁巳
  7 * 12 + 11, // 辛亥
  4 * 12 + 8,  // 戊申
  8 * 12 + 0,  // 壬子
  2 * 12 + 6,  // 丙午
  4 * 12 + 6,  // 戊午
  8 * 12 + 2,  // 壬寅
]);

// 阴差阳错日：丙子、丁丑、戊寅、辛卯、壬辰、癸巳、丙午、丁未、戊申、辛酉、壬戌、癸亥
const MISMATCH_DAYS = new Set([
  2 * 12 + 0,  // 丙子
  3 * 12 + 1,  // 丁丑
  4 * 12 + 2,  // 戊寅
  7 * 12 + 3,  // 辛卯
  8 * 12 + 4,  // 壬辰
  9 * 12 + 5,  // 癸巳
  2 * 12 + 6,  // 丙午
  3 * 12 + 7,  // 丁未
  4 * 12 + 8,  // 戊申
  7 * 12 + 9,  // 辛酉
  8 * 12 + 10, // 壬戌
  9 * 12 + 11, // 癸亥
]);

const PILLAR_NAMES = ["年", "月", "日", "时"];

// 找出 other 命局中哪一柱地支命中 anchor 列表
function findHits(other, targetBranch) {
  const branches = [
    other.year.branch, other.month.branch,
    other.day.branch, other.hour.branch,
  ];
  return branches
    .map((b, i) => (b === targetBranch ? PILLAR_NAMES[i] : null))
    .filter(Boolean);
}

// 检查 self 视角下，other 命局命中了 self 的桃花/红艳位
function crossCheck(self, other) {
  // 桃花参考：用 self 的年支和日支（任一所属三合局算）
  const peachTargets = new Set([
    PEACH_BY_BRANCH[self.year.branch],
    PEACH_BY_BRANCH[self.day.branch],
  ]);
  const peachHits = [];
  for (const t of peachTargets) {
    findHits(other, t).forEach((p) =>
      peachHits.push({ pillar: p, branch: t })
    );
  }

  // 红艳：用 self 的日干
  const hongyanTarget = HONGYAN_BY_STEM[self.day.stem];
  const hongyanHits = findHits(other, hongyanTarget).map((p) => ({
    pillar: p, branch: hongyanTarget,
  }));

  return { peachHits, hongyanHits };
}

// 检查日柱是否为孤鸾 / 阴差阳错
function checkDayKind(result) {
  const code = result.day.stem * 12 + result.day.branch;
  return {
    lonely: LONELY_DAYS.has(code),
    mismatch: MISMATCH_DAYS.has(code),
  };
}

export function CrossShenshaPanel({ resultA, resultB, nameA, nameB }) {
  const aTriggersB = crossCheck(resultB, resultA); // B 视角下 A 命中 B 的桃花/红艳 = B 在 A 这边是"自带桃花"
  const bTriggersA = crossCheck(resultA, resultB);
  const dayKindA = checkDayKind(resultA);
  const dayKindB = checkDayKind(resultB);

  return (
    <Card className="mt-6 p-6">
      <h2 className="font-serif text-xl font-semibold">跨盘神煞</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        桃花、红艳是"吸引力的源头"；孤鸾、阴差阳错是"婚配偏差的种子"。
        看一方的关键位是否被另一方"点亮"。
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <CrossCard
          self={nameA} other={nameB}
          triggers={bTriggersA}
        />
        <CrossCard
          self={nameB} other={nameA}
          triggers={aTriggersB}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <DayKindCard name={nameA} kind={dayKindA} stem={resultA.day.stem} branch={resultA.day.branch} />
        <DayKindCard name={nameB} kind={dayKindB} stem={resultB.day.stem} branch={resultB.day.branch} />
      </div>

      <div className="mt-4 rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">解读思路：</span>
        桃花命中 → 强吸引（双面，可正可邪）；
        红艳命中 → 情感浓烈；
        孤鸾 / 阴差阳错 → 婚姻坎坷之相，配合其它信号才显威力。
        单独的神煞不是判决书。
      </div>
    </Card>
  );
}

function CrossCard({ self, other, triggers }) {
  const has = triggers.peachHits.length > 0 || triggers.hongyanHits.length > 0;
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <p className="text-sm font-semibold text-foreground">
        {other} 在 {self} 命中的桃花 / 红艳
      </p>
      {!has ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {other} 命局并未踩中 {self} 的桃花或红艳位。
        </p>
      ) : (
        <div className="mt-2 space-y-2 text-xs">
          {triggers.peachHits.length > 0 && (
            <div>
              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-medium text-rose-900">
                桃花
              </span>
              <span className="ml-2 text-muted-foreground">
                {triggers.peachHits.map((h, i) => (
                  <span key={i} className="mr-2">
                    {other}·{h.pillar}支 = {EARTHLY_BRANCHES[h.branch]}
                  </span>
                ))}
              </span>
              <p className="mt-1 text-[10px] text-muted-foreground italic">
                → {other} 在 {self} 看来天然带桃花气，是强吸引的来源。
              </p>
            </div>
          )}
          {triggers.hongyanHits.length > 0 && (
            <div>
              <span className="rounded bg-pink-100 px-1.5 py-0.5 text-[11px] font-medium text-pink-900">
                红艳
              </span>
              <span className="ml-2 text-muted-foreground">
                {triggers.hongyanHits.map((h, i) => (
                  <span key={i} className="mr-2">
                    {other}·{h.pillar}支 = {EARTHLY_BRANCHES[h.branch]}
                  </span>
                ))}
              </span>
              <p className="mt-1 text-[10px] text-muted-foreground italic">
                → 情感浓烈、易招异性目光，对感情有添柴作用。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DayKindCard({ name, kind, stem, branch }) {
  const has = kind.lonely || kind.mismatch;
  return (
    <div className={`rounded-md border p-3 ${has ? "border-amber-300 bg-amber-50" : "border-border bg-background/40"}`}>
      <div className="flex items-baseline gap-2">
        <p className="text-xs font-medium text-foreground">{name} · 日柱</p>
        <span className="font-serif text-base font-semibold">
          {HEAVENLY_STEMS[stem]}{EARTHLY_BRANCHES[branch]}
        </span>
      </div>
      {!has ? (
        <p className="mt-1 text-[11px] text-muted-foreground">
          非孤鸾日、非阴差阳错日。
        </p>
      ) : (
        <ul className="mt-1 space-y-0.5 text-[11px]">
          {kind.lonely && (
            <li className="text-amber-900">
              ⚠ <strong>孤鸾日</strong>：命中带孤，婚配易坎坷或晚婚。
            </li>
          )}
          {kind.mismatch && (
            <li className="text-amber-900">
              ⚠ <strong>阴差阳错日</strong>：名字直白 —— 婚配错位之相。
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
