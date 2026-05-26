"use client";

import { useEffect, useRef, useState } from "react";
import { inputCls } from "./shared";

// Nominatim 地点搜索 — 公共服务，无需 API key。
//   - 防抖 500ms（Nominatim 限 1 req/sec）
//   - accept-language=zh-CN 返回中文地名
//   - 选中后调 onPick({ name, lon, lat, tz })

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

// 简易时区推断：
//   中国大陆/港澳台范围 → +8（与现有逻辑一致）
//   其它地区 → 按经度四舍五入到 15° 整数倍
function inferTzHours(lat, lon) {
  if (lat >= 18 && lat <= 54 && lon >= 73 && lon <= 135.5) return 8;
  return Math.round(lon / 15);
}

export function PlaceSearch({ onPick }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const wrapRef = useRef(null);

  // 点击外部收起下拉
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // 防抖搜索
  useEffect(() => {
    if (!q.trim() || q.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&accept-language=zh-CN&limit=5`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError("搜索失败，请检查网络");
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const handlePick = (r) => {
    const lon = Number(r.lon);
    const lat = Number(r.lat);
    const tz = inferTzHours(lat, lon);
    onPick({ name: r.display_name, lon, lat, tz });
    setQ(r.display_name);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="搜索地点（例如 福州市 / Toronto）"
        className={inputCls}
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          搜索中…
        </span>
      )}
      {error && !loading && (
        <p className="mt-1 text-xs text-rose-700">{error}</p>
      )}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-md border border-input bg-background shadow-md">
          {results.map((r) => (
            <button
              key={r.place_id}
              type="button"
              onClick={() => handlePick(r)}
              className="block w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted/60"
            >
              <p className="text-foreground">{r.display_name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {Number(r.lat).toFixed(3)}°N, {Number(r.lon).toFixed(3)}°E
                <span className="mx-1">·</span>
                推断 UTC{inferTzHours(Number(r.lat), Number(r.lon)) >= 0 ? "+" : ""}
                {inferTzHours(Number(r.lat), Number(r.lon))}
              </p>
            </button>
          ))}
        </div>
      )}
      {open && !loading && q.length >= 2 && results.length === 0 && !error && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-input bg-background px-3 py-2 text-xs text-muted-foreground shadow-md">
          未找到匹配结果
        </div>
      )}
    </div>
  );
}
