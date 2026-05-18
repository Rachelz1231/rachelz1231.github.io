import { ELEMENT_COLOR } from "./shared";

export function StemBranchCell({ glyph, element, yinYang, small = false }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`inline-flex items-center justify-center rounded-md font-serif font-semibold ${
          small ? "h-8 w-8 text-xl" : "h-12 w-12 text-3xl"
        } ${ELEMENT_COLOR[element] || ""}`}
      >
        {glyph}
      </span>
      <span className="text-[10px] text-muted-foreground">
        {yinYang}
        {element}
      </span>
    </div>
  );
}
