import { Card } from "@/components/ui/card";
import { pad2, fmtMin, hourLabelOf } from "./shared";

export function ResultSummary({ form, result }) {
  if (!form) return null;
  const { year, month, day, hour, minute, isDst, place } = form;
  const solar = result.solar;
  const hourLbl = solar ? hourLabelOf(solar.hour) : hourLabelOf(hour);
  return (
    <Card className="mt-2 mb-6 p-5">
      <div className="text-sm">
        <div className="text-foreground">
          <span className="font-medium">出生：</span>
          {year} 年 {pad2(month)} 月 {pad2(day)} 日 {pad2(hour)}:{pad2(minute)}
          {isDst && (
            <span className="ml-1 text-muted-foreground">（夏令时）</span>
          )}
          <span className="mx-2 text-muted-foreground/60">·</span>
          {place.name}
        </div>
        {solar && (
          <div className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-2">
            <div>
              经度时差：{fmtMin((place.lon - place.tzMeridian) * 4)}
              <span className="ml-1 text-muted-foreground/70">
                （经度 {place.lon.toFixed(2)}° − 时区中线{" "}
                {place.tzMeridian.toFixed(0)}°）
              </span>
            </div>
            <div>均时差：{fmtMin(solar.equationOfTime)}</div>
            <div className="sm:col-span-2">
              <span className="font-medium text-foreground">真太阳时：</span>
              {solar.year} 年 {pad2(solar.month)} 月 {pad2(solar.day)} 日{" "}
              {pad2(solar.hour)}:{pad2(Math.floor(solar.minute))}
              <span className="mx-2 text-muted-foreground/60">·</span>
              时辰 <span className="text-foreground">{hourLbl.branch}时</span>
              （{hourLbl.range}）
              <span className="mx-2 text-muted-foreground/60">·</span>
              总偏移 {fmtMin(solar.totalOffsetMinutes)}
            </div>
          </div>
        )}
        {result.term && (
          <div className="mt-3 border-t border-border/60 pt-3 text-sm">
            <span className="font-medium text-foreground">所属"节"：</span>
            <span className="text-muted-foreground">
              {result.term.year} 年 {pad2(result.term.month)} 月{" "}
              {pad2(result.term.day)} 日 {result.term.name}
              ——出生于此节气之后、下一节气之前。
            </span>
            {result.term.isCritical && (
              <div className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
                ⚠ 您的出生日临近节气交接（±1 天范围内）。本工具用紫金山公式估算节气日，
                可能与真实交节日相差 1 天；且交节具体时刻可精确到分钟。
                若结果对您重要，请用万年历核对：实际交节时刻晚于您出生时刻时，
                月柱应取前一个节气对应的月支；早于则取后一个。
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
