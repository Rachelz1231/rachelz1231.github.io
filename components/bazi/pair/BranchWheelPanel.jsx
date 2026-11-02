"use client";

import { Card } from "@/components/ui/card";
import { EARTHLY_BRANCHES, BRANCH_ELEMENT } from "@/lib/bazi";

// 十二地支双圈：外圈北斗（斗建，斗柄顺行 子→丑→寅…），内圈太阳（月将，太阳逆行 丑→子→亥…）。
// 同一径向上的内外两支即六合：斗柄指寅时太阳躔亥，故寅亥合，其余同理。
// 甲方落外圈、乙方落内圈；内外对上即两人地支六合。

const HE = [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 六合对：子丑 寅亥 卯戌 辰酉 巳申 午未
const PILLARS = [
  { key: "year", label: "年" },
  { key: "month", label: "月" },
  { key: "day", label: "日" },
  { key: "hour", label: "时" },
];

const ELEMENT_FILL = {
  木: { bg: "#dfe8d6", fg: "#3f5a2c" },
  火: { bg: "#ffe4e6", fg: "#9f1239" },
  土: { bg: "#e6d3bd", fg: "#5c4128" },
  金: { bg: "#fef08a", fg: "#713f12" },
  水: { bg: "#e0f2fe", fg: "#075985" },
};

const SIZE = 400;
const C = SIZE / 2;
const R_OUTER = 162;
const R_INNER = 92;
const NODE = 17;

// 子在正下方（北），顺时针依次排到午在正上方（南）
function angleOf(pos) {
  return Math.PI / 2 + (pos * Math.PI) / 6;
}
function at(pos, r) {
  const a = angleOf(pos);
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

function pillarsByBranch(result) {
  const out = {};
  for (const p of PILLARS) (out[result[p.key].branch] ||= []).push(p.label);
  return out;
}

export function BranchWheelPanel({ resultA, resultB, nameA, nameB }) {
  const marksA = pillarsByBranch(resultA);
  const marksB = pillarsByBranch(resultB);

  // 外圈位置 pos 上是地支 pos；内圈同一位置是 HE[pos]
  const heHits = [];
  for (let pos = 0; pos < 12; pos++) {
    if (marksA[pos] && marksB[HE[pos]]) heHits.push(pos);
  }

  return (
    <Card className="mt-6 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-xl font-semibold">十二地支 · 北斗与太阳</h2>
        <span className="text-xs text-muted-foreground">
          {heHits.length === 0 ? "内外圈无对位" : `六合对位 ${heHits.length} 处`}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        外圈是北斗斗柄所指（斗建），顺行；内圈是太阳所躔之宫（月将），逆行。斗建与月将同时同位，
        这就是地支六合的由来。{nameA}的四支落在外圈，{nameB}的四支落在内圈，同一条半径上都亮即两人六合。
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-[400px_1fr] sm:items-start">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-[400px]">
          {/* 北斗圈 */}
          <circle cx={C} cy={C} r={R_OUTER} fill="none" stroke="#cbd5e1" strokeDasharray="3 4" />
          {/* 太阳花：12 片花瓣托着内圈 */}
          {Array.from({ length: 12 }, (_, pos) => {
            const deg = (angleOf(pos) * 180) / Math.PI;
            return (
              <ellipse
                key={`petal${pos}`}
                cx={C + (R_INNER / 2) * Math.cos(angleOf(pos))}
                cy={C + (R_INNER / 2) * Math.sin(angleOf(pos))}
                rx={R_INNER / 2}
                ry={13}
                transform={`rotate(${deg} ${C + (R_INNER / 2) * Math.cos(angleOf(pos))} ${C + (R_INNER / 2) * Math.sin(angleOf(pos))})`}
                fill="#fef3c7"
                stroke="#fcd34d"
              />
            );
          })}
          <circle cx={C} cy={C} r={20} fill="#fbbf24" />
          <text x={C} y={C} textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#78350f">
            太阳
          </text>

          {/* 径向连线：亮的是两人六合 */}
          {Array.from({ length: 12 }, (_, pos) => {
            const o = at(pos, R_OUTER - NODE);
            const i = at(pos, R_INNER + NODE);
            const hit = heHits.includes(pos);
            return (
              <line
                key={`ray${pos}`}
                x1={o.x} y1={o.y} x2={i.x} y2={i.y}
                stroke={hit ? "#4d7c0f" : "#e2e8f0"}
                strokeWidth={hit ? 3 : 1}
              />
            );
          })}

          {Array.from({ length: 12 }, (_, pos) => (
            <BranchNode
              key={`o${pos}`}
              branch={pos}
              p={at(pos, R_OUTER)}
              labelP={at(pos, R_OUTER + 28)}
              marks={marksA[pos]}
              ring="#1e3a8a"
            />
          ))}
          {Array.from({ length: 12 }, (_, pos) => (
            <BranchNode
              key={`i${pos}`}
              branch={HE[pos]}
              p={at(pos, R_INNER)}
              labelP={at(pos, R_INNER - 30)}
              marks={marksB[HE[pos]]}
              ring="#b45309"
            />
          ))}
        </svg>

        <div className="space-y-3 text-sm">
          <Legend color="#1e3a8a" title={`外圈 · 北斗（${nameA}）`} body="子丑寅卯辰巳午未申酉戌亥，顺时针" />
          <Legend color="#b45309" title={`内圈 · 太阳花（${nameB}）`} body="丑子亥戌酉申未午巳辰卯寅，逆时针" />
          <div className="rounded-md border border-border bg-sage-50 p-3">
            <div className="font-medium text-foreground">六合对位</div>
            {heHits.length === 0 ? (
              <p className="mt-1 text-xs text-muted-foreground">两人地支没有落在同一条半径上。</p>
            ) : (
              <ul className="mt-1 space-y-1 text-xs">
                {heHits.map((pos) => (
                  <li key={pos}>
                    {nameA}·{marksA[pos].join("")} {EARTHLY_BRANCHES[pos]}
                    {" ⇄ "}
                    {nameB}·{marksB[HE[pos]].join("")} {EARTHLY_BRANCHES[HE[pos]]}
                    <span className="ml-1 text-muted-foreground">
                      （{EARTHLY_BRANCHES[pos]}{EARTHLY_BRANCHES[HE[pos]]}合）
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            同一圈上隔着圆心相对的两支是六冲（子午、丑未…）。节点旁小字是该支所在的柱。
          </p>
        </div>
      </div>
    </Card>
  );
}

function BranchNode({ branch, p, labelP, marks, ring }) {
  const el = BRANCH_ELEMENT[branch];
  const lit = !!marks;
  const { bg, fg } = ELEMENT_FILL[el];
  return (
    <g opacity={lit ? 1 : 0.45}>
      <circle
        cx={p.x} cy={p.y} r={NODE}
        fill={lit ? bg : "#ffffff"}
        stroke={lit ? ring : "#cbd5e1"}
        strokeWidth={lit ? 2.5 : 1}
      />
      <text
        x={p.x} y={p.y}
        textAnchor="middle" dominantBaseline="central"
        fontSize="16" fontWeight={lit ? 600 : 400}
        fill={lit ? fg : "#64748b"}
      >
        {EARTHLY_BRANCHES[branch]}
      </text>
      {lit && (
        <text
          x={labelP.x} y={labelP.y}
          textAnchor="middle" dominantBaseline="central"
          fontSize="11" fill={ring}
        >
          {marks.join("")}
        </text>
      )}
    </g>
  );
}

function Legend({ color, title, body }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full border-2" style={{ borderColor: color }} />
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
