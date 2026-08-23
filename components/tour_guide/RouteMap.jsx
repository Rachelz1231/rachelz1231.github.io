// 路线示意图。刻意不用 SVG：SVG 里的文字会随容器等比缩放，宽屏上字号
// 失控且无法换行。这里用 HTML + CSS 画同样的点线，字号正常、可选中、
// 配色直接跟随主题。数据来自 routeOf()，改 legs 图就跟着变。
export function RouteMap({ route }) {
  const { stops, legs } = route;
  const isLoop = stops.length > 2 && stops[0][0] === stops[stops.length - 1][0];

  return (
    <section className="mt-8 rounded-lg border border-border/60 bg-muted/20 px-5 py-5">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        路线{isLoop ? " · 环线" : ""}
      </p>
      <ol className="mt-4">
        {stops.map((stop, i) => {
          const leg = legs[i];
          const last = i === stops.length - 1;
          return (
            <li key={`${stop}-${i}`}>
              <div className="flex items-center gap-3">
                <span
                  className={
                    last || i === 0
                      ? "h-2.5 w-2.5 shrink-0 rounded-full bg-primary"
                      : "h-2.5 w-2.5 shrink-0 rounded-full border-2 border-primary/60 bg-background"
                  }
                />
                <span className="text-sm font-medium text-foreground">
                  {stop}
                </span>
                {last && isLoop ? (
                  <span className="text-xs text-muted-foreground">回到起点</span>
                ) : null}
              </div>
              {leg ? (
                <div className="ml-1 border-l-2 border-dotted border-border py-2 pl-4 text-xs text-muted-foreground">
                  {leg.distance} · {leg.duration}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
