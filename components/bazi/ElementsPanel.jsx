import { Card } from "@/components/ui/card";
import { ELEMENT_COLOR } from "./shared";

export function ElementsPanel({ elements }) {
  if (!elements) return null;
  const total = Object.values(elements).reduce((a, b) => a + b.count, 0);
  return (
    <Card className="mt-6 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-xl font-semibold">五行统计</h2>
        <p className="text-xs text-muted-foreground">
          按天干 + 地支本气计数（共 {total} 个）
        </p>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-3">
        {["木", "火", "土", "金", "水"].map((el) => {
          const s = elements[el];
          return (
            <div
              key={el}
              className={`flex flex-col items-center gap-1 rounded-md px-3 py-4 ${ELEMENT_COLOR[el]}`}
            >
              <span className="font-serif text-2xl font-semibold">{el}</span>
              <span className="text-sm">{s.count}</span>
              <span
                className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  s.transp && s.rooted
                    ? "bg-white/60 text-foreground"
                    : "bg-white/40 text-foreground/80"
                }`}
                title={
                  s.transp && s.rooted
                    ? "天干透出且地支有根"
                    : s.transp
                      ? "仅天干透出，无地支根"
                      : s.rooted
                        ? "仅地支藏根，未透天干"
                        : "未透未根"
                }
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">力量排序：透根 &gt; 透 &gt; 有根 &gt; 无。</span>
        透根 = 该五行同时出现于天干（透）与地支藏干（根），上下呼应，可发挥本职作用；
        透 = 仅天干现身、地支无同元素之根，浮而无力；
        有根 = 仅藏于地支、天干未透，潜伏待引；
        无 = 命局中缺位。
      </p>
    </Card>
  );
}
