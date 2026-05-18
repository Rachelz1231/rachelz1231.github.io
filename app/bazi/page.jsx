"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateBazi,
  majorLuckCycles,
  elementAnalysis,
  strengthAssessment,
  pickGeJu,
  analyzeRelations,
  BIRTH_PLACES,
} from "@/lib/bazi";
import { InputForm } from "@/components/bazi/InputForm";
import { ResultSummary } from "@/components/bazi/ResultSummary";
import { PillarTable } from "@/components/bazi/PillarTable";
import { RelationsPanel } from "@/components/bazi/RelationsPanel";
import { StrengthPanel } from "@/components/bazi/StrengthPanel";
import { ElementsPanel } from "@/components/bazi/ElementsPanel";
import { DaYunPanel } from "@/components/bazi/DaYunPanel";
import { LiuNianPanel } from "@/components/bazi/LiuNianPanel";

export default function BaziPage() {
  const today = new Date();
  const [form, setForm] = useState({
    year: today.getFullYear() - 30,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    gender: "male",
    placeId: "beijing",
    customLon: "",
    customTz: "",
    isDst: false,
  });
  const [result, setResult] = useState(null);
  const [luck, setLuck] = useState(null);
  const [strength, setStrength] = useState(null);
  const [elements, setElements] = useState(null);
  const [geJu, setGeJu] = useState(null);
  const [relations, setRelations] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [selDaYun, setSelDaYun] = useState(null);
  const [selLiuNian, setSelLiuNian] = useState(null);

  const groupedPlaces = useMemo(() => {
    const out = {};
    for (const p of BIRTH_PLACES) (out[p.group] ||= []).push(p);
    return out;
  }, []);

  const place = useMemo(() => placeFromForm(form), [form.placeId, form.customLon, form.customTz]);

  const update = (field) => (e) => {
    const t = e.target;
    const v =
      t.type === "checkbox"
        ? t.checked
        : ["placeId", "customLon", "customTz", "gender"].includes(field)
          ? t.value
          : t.value === ""
            ? ""
            : Number(t.value);
    setForm((f) => ({ ...f, [field]: v }));
  };

  // 给定一份表单状态，计算并填进所有面板；返回 true 表示成功。
  const runFromForm = (formData) => {
    const p = placeFromForm(formData);
    if (!p) return false;
    const { year, month, day, hour, minute, isDst, gender } = formData;
    if ([year, month, day, hour, minute].some((n) => n === "" || Number.isNaN(n))) {
      return false;
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
    const adj = r.solar
      ? { y: r.solar.year, m: r.solar.month, d: r.solar.day, h: r.solar.hour, mi: Math.floor(r.solar.minute) }
      : { y, m: mo, d, h, mi };
    const ll = majorLuckCycles({
      pillars: r,
      birthYear: adj.y, birthMonth: adj.m, birthDay: adj.d,
      birthHour: adj.h, birthMinute: adj.mi,
      gender,
    });
    setResult(r);
    setLuck(ll);
    setStrength(strengthAssessment(r));
    setElements(elementAnalysis(r));
    setGeJu(pickGeJu(r));
    setRelations(analyzeRelations(r));
    setSubmitted({ ...formData, place: p });
    setSelDaYun(null);
    setSelLiuNian(null);
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (runFromForm(form)) writeFormToUrl(form);
  };

  // 进入页面时如带 query 参数，预填表单并自动排盘
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("year")) return;
    const parsed = parseFormFromUrl(params);
    setForm(parsed);
    runFromForm(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40vh] bg-gradient-to-b from-cream via-sage-50 to-transparent"
      />

      <section className="container-narrow pt-16 pb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          BaZi · 四柱八字
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          八字排盘
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          填入阳历出生年月日时分与出生地点，自动按真太阳时（经度时差 + 均时差）
          换算后排出年、月、日、时四柱。
        </p>

        <InputForm
          form={form}
          update={update}
          groupedPlaces={groupedPlaces}
          onSubmit={onSubmit}
        />
      </section>

      {result && (
        <section className="container-narrow pb-24">
          <ResultSummary form={submitted} result={result} />
          <PillarTable result={result} form={submitted} />
          <RelationsPanel relations={relations} />
          <StrengthPanel strength={strength} geJu={geJu} />
          <ElementsPanel elements={elements} />
          <DaYunPanel
            result={result}
            luck={luck}
            form={submitted}
            selectedIdx={selDaYun}
            onSelect={setSelDaYun}
          />
          <LiuNianPanel
            result={result}
            luck={luck}
            form={submitted}
            selectedIdx={selLiuNian}
            onSelect={setSelLiuNian}
            selectedDaYunIdx={selDaYun}
          />
        </section>
      )}
    </div>
  );
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

// 把表单状态写入 URL 查询串（用 replaceState，避免堆积历史记录）
function writeFormToUrl(form) {
  const params = new URLSearchParams();
  params.set("year", String(form.year));
  params.set("month", String(form.month));
  params.set("day", String(form.day));
  params.set("hour", String(form.hour));
  if (form.minute) params.set("min", String(form.minute));
  params.set("gender", form.gender);
  params.set("place", form.placeId);
  if (form.isDst) params.set("dst", "1");
  if (form.placeId === "__custom__") {
    if (form.customLon !== "") params.set("lon", String(form.customLon));
    if (form.customTz !== "") params.set("tz", String(form.customTz));
  }
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", next);
}

// 从 URL 查询串读回表单状态（缺省值兜底）
function parseFormFromUrl(params) {
  const num = (key, def) => {
    const v = params.get(key);
    if (v == null) return def;
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  return {
    year: num("year", new Date().getFullYear() - 30),
    month: num("month", 1),
    day: num("day", 1),
    hour: num("hour", 12),
    minute: num("min", 0),
    gender: params.get("gender") === "female" ? "female" : "male",
    placeId: params.get("place") || "beijing",
    customLon: params.get("lon") || "",
    customTz: params.get("tz") || "",
    isDst: params.get("dst") === "1",
  };
}
