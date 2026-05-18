"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateBazi,
  computeRelations,
  BIRTH_PLACES,
} from "@/lib/bazi";
import { InputForm } from "@/components/bazi/InputForm";
import { PillarTable } from "@/components/bazi/PillarTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEFAULT_FORM = {
  name: "",
  year: new Date().getFullYear() - 30,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  gender: "male",
  placeId: "beijing",
  customLon: "",
  customTz: "",
  isDst: false,
};

const DEFAULT_FORM_B = { ...DEFAULT_FORM, gender: "female" };

export default function BaziPairPage() {
  const [formA, setFormA] = useState(DEFAULT_FORM);
  const [formB, setFormB] = useState(DEFAULT_FORM_B);
  const [resultA, setResultA] = useState(null);
  const [resultB, setResultB] = useState(null);
  const [submittedA, setSubmittedA] = useState(null);
  const [submittedB, setSubmittedB] = useState(null);

  const groupedPlaces = useMemo(() => {
    const out = {};
    for (const p of BIRTH_PLACES) (out[p.group] ||= []).push(p);
    return out;
  }, []);

  const updateOf = (setForm) => (field) => (e) => {
    const t = e.target;
    const v =
      t.type === "checkbox"
        ? t.checked
        : ["name", "placeId", "customLon", "customTz", "gender"].includes(field)
          ? t.value
          : t.value === ""
            ? ""
            : Number(t.value);
    setForm((f) => ({ ...f, [field]: v }));
  };

  const runFromForm = (formData) => {
    const p = placeFromForm(formData);
    if (!p) return { result: null, place: null };
    const { year, month, day, hour, minute, isDst } = formData;
    if ([year, month, day, hour, minute].some((n) => n === "" || Number.isNaN(n))) {
      return { result: null, place: null };
    }
    let h = hour, mi = minute, y = year, mo = month, d = day;
    if (isDst) {
      const base = new Date(Date.UTC(y, mo - 1, d, h, mi));
      base.setUTCHours(base.getUTCHours() - 1);
      y = base.getUTCFullYear();
      mo = base.getUTCMonth() + 1;
      d = base.getUTCDate();
      h = base.getUTCHours();
      mi = base.getUTCMinutes();
    }
    const r = calculateBazi({
      year: y, month: mo, day: d, hour: h, minute: mi,
      lon: p.lon, tzMeridian: p.tzMeridian,
    });
    return { result: r, place: p };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const a = runFromForm(formA);
    const b = runFromForm(formB);
    if (!a.result || !b.result) return;
    setResultA(a.result);
    setResultB(b.result);
    setSubmittedA({ ...formA, place: a.place });
    setSubmittedB({ ...formB, place: b.place });
    writePairToUrl(formA, formB);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const aParsed = parseSideFromUrl(params, "a_", DEFAULT_FORM);
    const bParsed = parseSideFromUrl(params, "b_", DEFAULT_FORM_B);
    setFormA(aParsed);
    setFormB(bParsed);
    // Auto compute if either side has explicit data
    if (params.has("a_year") || params.has("b_year")) {
      const a = runFromForm(aParsed);
      const b = runFromForm(bParsed);
      if (a.result && b.result) {
        setResultA(a.result);
        setResultB(b.result);
        setSubmittedA({ ...aParsed, place: a.place });
        setSubmittedB({ ...bParsed, place: b.place });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nameA = (submittedA?.name && submittedA.name.trim()) || "甲方";
  const nameB = (submittedB?.name && submittedB.name.trim()) || "乙方";

  const pairRelations = useMemo(() => {
    if (!resultA || !resultB) return null;
    return computePairRelations(resultA, resultB);
  }, [resultA, resultB]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40vh] bg-gradient-to-b from-cream via-sage-50 to-transparent"
      />

      <section className="container-narrow pt-16 pb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          BaZi · 合盘
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            八字合盘
          </h1>
          <Link
            href="/bazi"
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            ← 返回排盘
          </Link>
        </div>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          分别填入两人阳历出生信息，自动按真太阳时排出双方四柱，并列出两盘之间的合冲刑害。
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
                甲方
              </h2>
              <InputFormBare
                form={formA}
                update={updateOf(setFormA)}
                groupedPlaces={groupedPlaces}
              />
            </div>
            <div>
              <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
                乙方
              </h2>
              <InputFormBare
                form={formB}
                update={updateOf(setFormB)}
                groupedPlaces={groupedPlaces}
              />
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full sm:w-auto">
              合盘
            </Button>
          </div>
        </form>
      </section>

      {resultA && resultB && (
        <section className="container-narrow pb-24">
          <Card className="mb-6 p-5">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {nameA} 与 {nameB} 的四柱八字合盘
            </h2>
          </Card>

          <div className="grid gap-6 lg:grid-cols-1">
            <div>
              <h3 className="mb-2 font-serif text-xl font-semibold">
                {nameA} 的四柱八字
              </h3>
              <PillarTable result={resultA} form={submittedA} />
            </div>
            <div>
              <h3 className="mb-2 mt-2 font-serif text-xl font-semibold">
                {nameB} 的四柱八字
              </h3>
              <PillarTable result={resultB} form={submittedB} />
            </div>
          </div>

          <PairRelationsPanel relations={pairRelations} nameA={nameA} nameB={nameB} />
        </section>
      )}
    </div>
  );
}

// 复用 InputForm 但不提交按钮（合盘用一个统一的提交按钮）
function InputFormBare({ form, update, groupedPlaces }) {
  // 复用 InputForm 整体表单结构，但隐藏其底部按钮
  return (
    <div className="[&_button[type=submit]]:hidden">
      <InputForm
        form={form}
        update={update}
        groupedPlaces={groupedPlaces}
        onSubmit={(e) => e.preventDefault()}
      />
    </div>
  );
}

function PairRelationsPanel({ relations, nameA, nameB }) {
  if (!relations) return null;
  const sections = [
    { key: "stem", title: "天干合", items: relations.stemCombos, tone: "bg-sage-50" },
    { key: "liuhe", title: "地支六合", items: relations.liuhe, tone: "bg-sage-50" },
    { key: "sanhe", title: "地支三合", items: relations.sanhe, tone: "bg-sage-50" },
    { key: "sanhui", title: "地支三会", items: relations.sanhui, tone: "bg-sage-50" },
    { key: "chong", title: "地支六冲", items: relations.chong, tone: "bg-rose-50" },
    { key: "xing", title: "地支相刑", items: relations.xing, tone: "bg-rose-50" },
    { key: "hai", title: "地支相害", items: relations.hai, tone: "bg-rose-50" },
  ];
  const total = sections.reduce((a, s) => a + s.items.length, 0);
  const labelMap = {
    A年: `${nameA}·年柱`, A月: `${nameA}·月柱`, A日: `${nameA}·日柱`, A时: `${nameA}·时柱`,
    B年: `${nameB}·年柱`, B月: `${nameB}·月柱`, B日: `${nameB}·日柱`, B时: `${nameB}·时柱`,
  };

  return (
    <Card className="mt-6 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-xl font-semibold">两盘之间的合冲刑害</h2>
        <span className="text-xs text-muted-foreground">
          {total === 0 ? "两盘相安" : `共 ${total} 项`}
        </span>
      </div>
      {total === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          两人天干无合、地支无合、冲、刑、害。
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sections
            .filter((s) => s.items.length > 0)
            .map((s) => (
              <div
                key={s.key}
                className={`rounded-md border border-border p-3 ${s.tone}`}
              >
                <h3 className="text-sm font-medium text-foreground">{s.title}</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {s.items.map((it, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-foreground">{it.name}</span>
                      {it.complete === false && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          半合
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {it.positions.map((p) => labelMap[p] || p).join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}

// 仅保留跨盘项：positions 中同时包含 A* 和 B* 标签
function computePairRelations(resultA, resultB) {
  const pillars = [
    { stem: resultA.year.stem, branch: resultA.year.branch, label: "A年" },
    { stem: resultA.month.stem, branch: resultA.month.branch, label: "A月" },
    { stem: resultA.day.stem, branch: resultA.day.branch, label: "A日" },
    { stem: resultA.hour.stem, branch: resultA.hour.branch, label: "A时" },
    { stem: resultB.year.stem, branch: resultB.year.branch, label: "B年" },
    { stem: resultB.month.stem, branch: resultB.month.branch, label: "B月" },
    { stem: resultB.day.stem, branch: resultB.day.branch, label: "B日" },
    { stem: resultB.hour.stem, branch: resultB.hour.branch, label: "B时" },
  ];
  const raw = computeRelations(pillars);
  const isCross = (positions) =>
    positions.some((p) => p.startsWith("A")) &&
    positions.some((p) => p.startsWith("B"));
  return {
    stemCombos: raw.stemCombos.filter((it) => isCross(it.positions)),
    liuhe: raw.liuhe.filter((it) => isCross(it.positions)),
    sanhe: raw.sanhe.filter((it) => isCross(it.positions)),
    sanhui: raw.sanhui.filter((it) => isCross(it.positions)),
    chong: raw.chong.filter((it) => isCross(it.positions)),
    hai: raw.hai.filter((it) => isCross(it.positions)),
    xing: raw.xing.filter((it) => isCross(it.positions)),
  };
}

function placeFromForm(form) {
  if (form.placeId === "__custom__") {
    const lon = Number(form.customLon);
    const tz = Number(form.customTz);
    if (Number.isFinite(lon) && Number.isFinite(tz)) {
      return { name: "自定义", lon, tzMeridian: tz * 15 };
    }
    return null;
  }
  return BIRTH_PLACES.find((p) => p.id === form.placeId) || null;
}

function writePairToUrl(formA, formB) {
  const params = new URLSearchParams();
  const put = (prefix, form) => {
    if (form.name) params.set(`${prefix}name`, form.name);
    params.set(`${prefix}year`, String(form.year));
    params.set(`${prefix}month`, String(form.month));
    params.set(`${prefix}day`, String(form.day));
    params.set(`${prefix}hour`, String(form.hour));
    if (form.minute) params.set(`${prefix}min`, String(form.minute));
    params.set(`${prefix}gender`, form.gender);
    params.set(`${prefix}place`, form.placeId);
    if (form.isDst) params.set(`${prefix}dst`, "1");
    if (form.placeId === "__custom__") {
      if (form.customLon !== "") params.set(`${prefix}lon`, String(form.customLon));
      if (form.customTz !== "") params.set(`${prefix}tz`, String(form.customTz));
    }
  };
  put("a_", formA);
  put("b_", formB);
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", next);
}

function parseSideFromUrl(params, prefix, defaults) {
  const num = (key, def) => {
    const v = params.get(prefix + key);
    if (v == null) return def;
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  return {
    name: params.get(prefix + "name") || defaults.name,
    year: num("year", defaults.year),
    month: num("month", defaults.month),
    day: num("day", defaults.day),
    hour: num("hour", defaults.hour),
    minute: num("min", defaults.minute),
    gender:
      params.get(prefix + "gender") === "female"
        ? "female"
        : params.get(prefix + "gender") === "male"
          ? "male"
          : defaults.gender,
    placeId: params.get(prefix + "place") || defaults.placeId,
    customLon: params.get(prefix + "lon") || defaults.customLon,
    customTz: params.get(prefix + "tz") || defaults.customTz,
    isDst: params.get(prefix + "dst") === "1",
  };
}
