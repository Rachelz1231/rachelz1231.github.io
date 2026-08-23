import Image from "next/image";

// 高德/地图截图。用 next/image 而不是 <img>，这样窄屏不会加载整张大图。
// 截图放 public/tour_guide/ 下，src 从 / 开始写。
export function RouteImage({ map }) {
  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-lg border border-border/60">
        <Image
          src={map.src}
          alt={map.alt ?? "路线图"}
          width={map.width ?? 1200}
          height={map.height ?? 900}
          className="h-auto w-full"
        />
      </div>
      {map.caption ? (
        <figcaption className="mt-2 text-xs text-muted-foreground">
          {map.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
