// 共享：颜色、布局常量、格式化工具。
import { HOUR_LABELS } from "@/lib/bazi";

export const PILLAR_LABELS = [
  { key: "year", title: "年柱", subtitle: "祖辈 · 童年" },
  { key: "month", title: "月柱", subtitle: "父母 · 青年" },
  { key: "day", title: "日柱", subtitle: "自身 · 配偶" },
  { key: "hour", title: "时柱", subtitle: "子女 · 晚年" },
];

export const ELEMENT_COLOR = {
  木: "bg-sage-100 text-sage-800",
  火: "bg-rose-100 text-rose-800",
  土: "bg-[#c8a47e] text-[#3d2817]",
  金: "bg-yellow-200 text-yellow-900",
  水: "bg-sky-100 text-sky-800",
};

// 大运 / 流年表格的行高样式
export const COL_ROW_TEXT = "flex min-h-[36px] items-center justify-center px-1 text-xs sm:text-sm";
export const COL_ROW_GLYPH = "flex min-h-[72px] items-center justify-center px-1";
export const COL_ROW_LBL = "flex min-h-[36px] items-center justify-center px-2 text-xs text-muted-foreground";
export const COL_ROW_GLYPH_LBL = "flex min-h-[72px] items-center justify-center px-2 text-xs text-muted-foreground";

// 表单输入框样式
export const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export const pad2 = (n) => String(n).padStart(2, "0");

export const ageFmt = (a) => a.toFixed(1).replace(/\.0$/, "");

export const fmtMin = (m) => {
  const sign = m >= 0 ? "+" : "−";
  const abs = Math.abs(m);
  const whole = Math.floor(abs);
  const sec = Math.round((abs - whole) * 60);
  return `${sign}${whole}分${sec ? pad2(sec) + "秒" : ""}`;
};

export const fmtUtc = (mer) => {
  const hrs = mer / 15;
  const sign = hrs >= 0 ? "+" : "−";
  const abs = Math.abs(hrs);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `UTC${sign}${h}${m ? ":" + pad2(m) : ""}`;
};

export function hourLabelOf(hour) {
  if (hour === 23 || hour === 0) return HOUR_LABELS[0];
  return HOUR_LABELS[Math.floor((hour + 1) / 2) % 12];
}
