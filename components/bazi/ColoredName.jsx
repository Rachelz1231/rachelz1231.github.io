import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEM_ELEMENT, BRANCH_ELEMENT,
} from "@/lib/bazi";
import { ELEMENT_TEXT_COLOR } from "./shared";

// 把字符串里的天干/地支字按五行着色，其他字符（"合化土"、"相冲"、"三刑"...）保持原色。
export function ColoredName({ text, className = "" }) {
  return (
    <span className={className}>
      {[...text].map((ch, i) => {
        const si = HEAVENLY_STEMS.indexOf(ch);
        if (si >= 0) {
          return (
            <span key={i} className={`font-semibold ${ELEMENT_TEXT_COLOR[STEM_ELEMENT[si]]}`}>
              {ch}
            </span>
          );
        }
        const bi = EARTHLY_BRANCHES.indexOf(ch);
        if (bi >= 0) {
          return (
            <span key={i} className={`font-semibold ${ELEMENT_TEXT_COLOR[BRANCH_ELEMENT[bi]]}`}>
              {ch}
            </span>
          );
        }
        return ch;
      })}
    </span>
  );
}
