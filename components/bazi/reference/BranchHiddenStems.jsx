import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  STEM_ELEMENT,
  BRANCH_HIDDEN_STEMS,
  BRANCH_ELEMENT,
} from "@/lib/bazi";
import { ELEMENT_COLOR } from "../shared";

const POSITIONS = ["本气", "中气", "余气"];
const POS_DESC = {
  本气: "主矿层 · 强根",
  中气: "次矿层 · 中根",
  余气: "残矿层 · 弱根",
};

export function BranchHiddenStems() {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <h3 className="font-medium text-foreground">地壳分层比喻</h3>
        <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-background/60 p-3 text-xs leading-relaxed">
{`地支 = 一整块土地
└─ 藏干 = 土地里埋的天干
   ├─ 本气 = 主矿层（最强，决定这片地的属性）
   ├─ 中气 = 次矿层（有的地支有，有的没有）
   └─ 余气 = 残矿层（有的地支有，有的没有）`}
        </pre>
        <p className="mt-2 text-muted-foreground">
          常见误区：把"藏干"和"本气/中气/余气"看成两件事。
          实际上 <strong>本气/中气/余气是藏干的内部层次</strong> —
          每个地支根据"四时之气"含 1–3 个天干，每个天干对应一层。
        </p>
      </div>

      <div>
        <h3 className="font-medium text-foreground">12 地支藏干一览</h3>
        <div className="mt-2 overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[56px_60px_1fr] divide-x divide-border border-b border-border bg-muted/60 text-xs font-medium text-foreground">
            <div className="px-3 py-2">地支</div>
            <div className="px-3 py-2">本气元素</div>
            <div className="px-3 py-2">藏干（本气 / 中气 / 余气）</div>
          </div>
          <div className="divide-y divide-border">
            {EARTHLY_BRANCHES.map((bChar, bIdx) => {
              const hidden = BRANCH_HIDDEN_STEMS[bIdx];
              const branchEl = BRANCH_ELEMENT[bIdx];
              return (
                <div
                  key={bIdx}
                  className="grid grid-cols-[56px_60px_1fr] divide-x divide-border text-xs"
                >
                  <div className="flex items-center px-3 py-2">
                    <span className={`rounded px-1.5 py-0.5 font-serif text-base font-semibold ${ELEMENT_COLOR[branchEl]}`}>
                      {bChar}
                    </span>
                  </div>
                  <div className="flex items-center px-3 py-2 text-muted-foreground">
                    {branchEl}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                    {hidden.map((stemIdx, i) => {
                      const stemEl = STEM_ELEMENT[stemIdx];
                      return (
                        <span key={i} className="inline-flex items-baseline gap-1">
                          <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${ELEMENT_COLOR[stemEl]}`}>
                            {HEAVENLY_STEMS[stemIdx]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {POSITIONS[i]}·{stemEl}
                          </span>
                        </span>
                      );
                    })}
                    {hidden.length === 1 && (
                      <span className="text-[10px] italic text-muted-foreground">
                        （子卯酉单气，无中气余气）
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground">通根强弱（"天干落根"）</h3>
        <p className="mt-1 text-muted-foreground">
          某天干（例如大运的 丙）能否"落根"，看四柱地支的藏干中有没有同元素的天干：
        </p>
        <ul className="mt-2 space-y-1.5 text-xs">
          {POSITIONS.map((p) => (
            <li key={p} className="flex items-baseline gap-2">
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-900">
                {p}
              </span>
              <span className="text-muted-foreground">{POS_DESC[p]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          所以"<span className="text-foreground">酉藏辛</span>"、"<span className="text-foreground">酉的本气是辛</span>"、
          "<span className="text-foreground">酉是金支</span>" 三句话讲的是同一件事 ——
          因为酉只有一个藏干，本气即全部。但像 <strong>戌</strong>（戊辛丁）这种 3 层藏干的，
          就有层次差别了 — 火大运可以在戌里找到根，但只是<strong>余气弱根</strong>，因为丁排在第三位。
        </p>
      </div>

      <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">"透" vs "根" 一句话：</span>
        <span className="ml-1">"<strong>透</strong>"看天干层（上半盘），"<strong>根</strong>"看地支藏干层（下半盘）。</span>
        一个五行可以"<strong>不透有根</strong>"（藏在地支没浮出来），也可以"<strong>透而无根</strong>"（飘在天上没地基，称"浮干"），
        最稳的是"<strong>透根</strong>"。
      </div>
    </div>
  );
}
