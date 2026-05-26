import { ELEMENT_COLOR } from "../shared";

// 五行环：木火土金水按相生顺时针排列；相克为五角星跨步。
const ELEMENTS = ["木", "火", "土", "金", "水"];
const ATTRS = {
  木: { dir: "东", season: "春", organ: "肝胆", virtue: "仁" },
  火: { dir: "南", season: "夏", organ: "心、小肠", virtue: "礼" },
  土: { dir: "中", season: "四季月", organ: "脾胃", virtue: "信" },
  金: { dir: "西", season: "秋", organ: "肺、大肠", virtue: "义" },
  水: { dir: "北", season: "冬", organ: "肾、膀胱", virtue: "智" },
};

// 五边形顶点位置（用 SVG 360x360 坐标系）：从正上方开始，顺时针 72° 一步
const POSITIONS = ELEMENTS.map((el, i) => {
  const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / 5;
  return { el, x: 180 + 130 * Math.cos(angle), y: 180 + 130 * Math.sin(angle) };
});

const SHENG_PAIRS = [
  ["木", "火"], ["火", "土"], ["土", "金"], ["金", "水"], ["水", "木"],
];
const KE_PAIRS = [
  ["木", "土"], ["土", "水"], ["水", "火"], ["火", "金"], ["金", "木"],
];

function pos(el) { return POSITIONS.find((p) => p.el === el); }

// 缩短箭头端点，使其落在节点圆边缘
function shorten(a, b, r = 32) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  return {
    x1: a.x + (dx * r) / len,
    y1: a.y + (dy * r) / len,
    x2: b.x - (dx * r) / len,
    y2: b.y - (dy * r) / len,
  };
}

export function WuxingDiagram() {
  return (
    <div className="grid gap-6 sm:grid-cols-[360px_1fr] sm:items-start">
      <div className="mx-auto">
        <svg viewBox="0 0 360 360" className="h-[360px] w-[360px]">
          <defs>
            <marker
              id="arrow-sheng"
              viewBox="0 0 10 10"
              refX="8" refY="5"
              markerWidth="6" markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#4d7c0f" />
            </marker>
            <marker
              id="arrow-ke"
              viewBox="0 0 10 10"
              refX="8" refY="5"
              markerWidth="6" markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#be123c" />
            </marker>
          </defs>

          {/* 相生环（外圈，绿色实线） */}
          {SHENG_PAIRS.map(([a, b], i) => {
            const s = shorten(pos(a), pos(b));
            return (
              <line
                key={`s${i}`}
                x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                stroke="#4d7c0f"
                strokeWidth="2"
                markerEnd="url(#arrow-sheng)"
              />
            );
          })}
          {/* 相克星（内部，红色虚线） */}
          {KE_PAIRS.map(([a, b], i) => {
            const s = shorten(pos(a), pos(b));
            return (
              <line
                key={`k${i}`}
                x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                stroke="#be123c"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                markerEnd="url(#arrow-ke)"
              />
            );
          })}
          {/* 节点 */}
          {POSITIONS.map((p) => {
            const colors = {
              木: { fill: "#dcfce7", text: "#166534" },
              火: { fill: "#ffe4e6", text: "#9f1239" },
              土: { fill: "#e7d5bf", text: "#3d2817" },
              金: { fill: "#fef9c3", text: "#854d0e" },
              水: { fill: "#e0f2fe", text: "#075985" },
            }[p.el];
            return (
              <g key={p.el}>
                <circle cx={p.x} cy={p.y} r="28" fill={colors.fill} stroke={colors.text} strokeWidth="1.5" />
                <text x={p.x} y={p.y + 8} textAnchor="middle" fontSize="22" fontWeight="600" fill={colors.text}>
                  {p.el}
                </text>
              </g>
            );
          })}
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

      <div className="space-y-3 text-sm">
        <div>
          <h3 className="font-medium text-foreground">相生（顺时针）</h3>
          <p className="mt-1 text-muted-foreground">
            木生火（钻木取火）· 火生土（焚物为灰）· 土生金（土中藏金）·
            金生水（金凝则水）· 水生木（润物长青）
          </p>
        </div>
        <div>
          <h3 className="font-medium text-foreground">相克（隔一相制）</h3>
          <p className="mt-1 text-muted-foreground">
            木克土（根破地）· 土克水（筑堤防）· 水克火（湿熄燃）·
            火克金（高温化）· 金克木（斧伐林）
          </p>
        </div>
        <div className="rounded-md border border-border bg-background/60 p-3">
          <h3 className="text-sm font-medium text-foreground">五行对应</h3>
          <div className="mt-2 grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-1 text-xs">
            <div className="text-muted-foreground">五行</div>
            <div className="text-muted-foreground">方位</div>
            <div className="text-muted-foreground">季节</div>
            <div className="text-muted-foreground">脏腑</div>
            <div className="text-muted-foreground">德行</div>
            {ELEMENTS.map((el) => (
              <div key={el} className="contents">
                <span className={`rounded px-1.5 py-0.5 text-center ${ELEMENT_COLOR[el]}`}>
                  {el}
                </span>
                <span>{ATTRS[el].dir}</span>
                <span>{ATTRS[el].season}</span>
                <span>{ATTRS[el].organ}</span>
                <span>{ATTRS[el].virtue}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          实战要点：八字论"扶抑"，本质就是看日主在五行链中是否得令、得地、
          得势；化神能不能成立，也靠相生承接、相克扰动。
        </p>
      </div>
    </div>
  );
}
