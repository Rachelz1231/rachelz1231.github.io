import { BaziHeader } from "@/components/bazi/BaziHeader";

export const metadata = {
  title: { absolute: "八字" },
  description: "用阳历出生信息生成四柱八字。",
  robots: { index: false, follow: false },
};

export default function BaziLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <BaziHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border/60 py-6">
        <p className="container-narrow text-xs text-muted-foreground">
          排盘结果基于传统命理规则推算，仅供娱乐参考。
        </p>
      </footer>
    </div>
  );
}
