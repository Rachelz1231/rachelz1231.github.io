"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { LiuYuePanel } from "@/components/bazi/LiuYuePanel";
import { MonthlyForecast } from "@/components/bazi/MonthlyForecast";

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

export default function BaziPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [result, setResult] = useState(null);
  const [luck, setLuck] = useState(null);
  const [strength, setStrength] = useState(null);
  const [elements, setElements] = useState(null);
  const [geJu, setGeJu] = useState(null);
  const [relations, setRelations] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [selDaYun, setSelDaYun] = useState(null);
  const [selLiuNian, setSelLiuNian] = useState(null);
  const [selLiuYue, setSelLiuYue] = useState(null);

  // 点大运：切换大运，同时清掉流年/流月
  const onSelectDaYun = (idx) => {
    setSelDaYun(idx);
    setSelLiuNian(null);
    setSelLiuYue(null);
  };

  // 点流年：选中流年，并把大运自动同步到该流年所在那一步；切流年清掉流月
  const onSelectLiuNian = (idx) => {
    setSelLiuNian(idx);
    setSelLiuYue(null);
    if (idx == null || !luck || !submitted) return;
    const year = new Date().getFullYear() + idx;
    const age = year - submitted.year;
    const cycleIdx = luck.cycles.findIndex(
      (c) => age >= c.ageStart && age < c.ageEnd
    );
    setSelDaYun(cycleIdx >= 0 ? cycleIdx : null);
  };

  const onSelectLiuYue = (idx) => setSelLiuYue(idx);

  const groupedPlaces = useMemo(() => {
    const out = {};
    for (const p of BIRTH_PLACES) (out[p.group] ||= []).push(p);
    return out;
  }, []);

  const place = useMemo(() => placeFromForm(form), [form.placeId, form.customLon, form.customTz]);

  const pairHref = useMemo(() => buildPairHref(form), [form]);

  // Nominatim 搜索选中后：切到自定义模式，并写入经度/时区
  const onSearchPick = ({ lon, tz }) => {
    setForm((f) => ({
      ...f,
      placeId: "__custom__",
      customLon: String(lon.toFixed(2)),
      customTz: String(tz),
    }));
  };

  const update = (field) => (e) => {
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
    setSelLiuYue(null);
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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            八字排盘
          </h1>
          <div className="flex flex-wrap gap-2">
            <a
              href="/bazi/reference"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              title="在新标签页打开，不影响当前排盘"
            >
              命理参考 ↗
            </a>
            <Link
              href={pairHref}
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              八字合盘 →
            </Link>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          填入阳历出生年月日时分与出生地点，自动按真太阳时（经度时差 + 均时差）
          换算后排出年、月、日、时四柱。
        </p>

        <InputForm
          form={form}
          update={update}
          groupedPlaces={groupedPlaces}
          onSubmit={onSubmit}
          onSearchPick={onSearchPick}
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
            onSelect={onSelectDaYun}
          />
          <LiuNianPanel
            result={result}
            luck={luck}
            form={submitted}
            selectedIdx={selLiuNian}
            onSelect={onSelectLiuNian}
            selectedDaYunIdx={selDaYun}
          />
          {selLiuNian != null && (
            <>
              <LiuYuePanel
                result={result}
                luck={luck}
                form={submitted}
                liuNianYear={new Date().getFullYear() + selLiuNian}
                selectedIdx={selLiuYue}
                onSelect={onSelectLiuYue}
                selectedDaYunIdx={selDaYun}
              />
              <MonthlyForecast
                result={result}
                luck={luck}
                form={submitted}
                liuNianYear={new Date().getFullYear() + selLiuNian}
                selectedLiuYueIdx={selLiuYue}
                selectedDaYunIdx={selDaYun}
              />
            </>
          )}
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
  if (form.name) params.set("name", form.name);
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

// 当前表单是否与默认表单不同（未改动则不携带数据进合盘）
function isFormCustomized(form) {
  for (const k of Object.keys(DEFAULT_FORM)) {
    if (form[k] !== DEFAULT_FORM[k]) return true;
  }
  return false;
}

// 生成合盘链接：若表单已被修改，把当前数据作为 A 方带过去
function buildPairHref(form) {
  if (!isFormCustomized(form)) return "/bazi/bazi-pair";
  const params = new URLSearchParams();
  const put = (key, val) => {
    if (val !== "" && val != null) params.set(key, String(val));
  };
  if (form.name) put("a_name", form.name);
  put("a_year", form.year);
  put("a_month", form.month);
  put("a_day", form.day);
  put("a_hour", form.hour);
  if (form.minute) put("a_min", form.minute);
  put("a_gender", form.gender);
  put("a_place", form.placeId);
  if (form.isDst) params.set("a_dst", "1");
  if (form.placeId === "__custom__") {
    if (form.customLon !== "") put("a_lon", form.customLon);
    if (form.customTz !== "") put("a_tz", form.customTz);
  }
  return `/bazi/bazi-pair?${params.toString()}`;
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
    name: params.get("name") || "",
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
