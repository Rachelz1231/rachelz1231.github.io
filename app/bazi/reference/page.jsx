"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { WuxingDiagram } from "@/components/bazi/reference/WuxingDiagram";
import { BranchHiddenStems } from "@/components/bazi/reference/BranchHiddenStems";
import { TenGodsTable } from "@/components/bazi/reference/TenGodsTable";
import { TenGodsSystem } from "@/components/bazi/reference/TenGodsSystem";
import { SpousePalace } from "@/components/bazi/reference/SpousePalace";
import { GeJuOverview } from "@/components/bazi/reference/GeJuOverview";
import { JianluGeDetail } from "@/components/bazi/reference/JianluGeDetail";
import { OtherGeJuDetail } from "@/components/bazi/reference/OtherGeJuDetail";
import { SpecialGeJu } from "@/components/bazi/reference/SpecialGeJu";

const SECTIONS = [
  {
    id: "wuxing",
    title: "五行相生相克",
    summary: "木火土金水的生克链条与方位、季节、脏腑对应",
    render: () => <WuxingDiagram />,
  },
  {
    id: "canggan",
    title: "地支与藏干",
    summary: "地支不是根，藏干才是；本气/中气/余气是藏干的内部层次",
    render: () => <BranchHiddenStems />,
  },
  {
    id: "tengods",
    title: "十神关系",
    summary: "以日主为中心，十种天干关系的命名规则与含义",
    render: () => <TenGodsTable />,
  },
  {
    id: "tengods-system",
    title: "十神生克泄化系统",
    summary: "五行生克的'我'视角：5×5 互动矩阵 + 泄/克/化三大用神思路",
    render: () => <TenGodsSystem />,
  },
  {
    id: "spouse",
    title: "夫妻宫 · 配偶星",
    summary: "日支看相处，财官看本人，运岁看时机",
    render: () => <SpousePalace />,
  },
  {
    id: "geju-overview",
    title: "命格总览",
    summary: "正格八格 + 特殊格 + 外格的整体框架",
    render: () => <GeJuOverview />,
  },
  {
    id: "jianlu",
    title: "建禄格 · 详解",
    summary: "月支为日主比肩，身强格之首，分支变格最为丰富",
    render: () => <JianluGeDetail />,
  },
  {
    id: "others",
    title: "其余正格 · 七格速览",
    summary: "羊刃 / 正官 / 七杀 / 食神 / 伤官 / 财格 / 印格",
    render: () => <OtherGeJuDetail />,
  },
  {
    id: "special",
    title: "外格与变格",
    summary: "从格、化气格、专旺格 — 跳出八格的特殊命局",
    render: () => <SpecialGeJu />,
  },
];

export default function BaziReferencePage() {
  const [open, setOpen] = useState(() => new Set(["wuxing"]));
  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const expandAll = () => setOpen(new Set(SECTIONS.map((s) => s.id)));
  const collapseAll = () => setOpen(new Set());

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40vh] bg-gradient-to-b from-cream via-sage-50 to-transparent"
      />

      <section className="container-narrow pt-16 pb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          BaZi · 命理参考
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            命理基础
          </h1>
          <Link
            href="/bazi"
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            ← 返回排盘
          </Link>
        </div>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          排盘只解决"是什么"，理解则需要"为什么"。这里整理了八字解读最常用的几张
          基础地图：五行生克、十神镜像、月令命格。点击任一卡片展开。
        </p>

        <div className="mt-6 flex gap-2 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            全部展开
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            全部折叠
          </button>
        </div>
      </section>

      <section className="container-narrow pb-24">
        <div className="space-y-3">
          {SECTIONS.map((s) => {
            const isOpen = open.has(s.id);
            return (
              <Card key={s.id} className="overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  className="flex w-full items-baseline justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40"
                >
                  <div>
                    <h2 className="font-serif text-lg font-semibold">
                      {s.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.summary}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 select-none text-base text-muted-foreground transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    aria-hidden
                  >
                    ›
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-border bg-muted/10 px-5 py-5">
                    {s.render()}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
