"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "./Field";
import { inputCls, fmtUtc } from "./shared";

export function InputForm({ form, update, groupedPlaces, onSubmit }) {
  return (
    <Card className="mt-8 p-6 sm:p-8">
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-2 gap-4 sm:grid-cols-6"
      >
        <Field label="姓名（可选）" className="col-span-2 sm:col-span-6">
          <input
            type="text" maxLength="40"
            value={form.name} onChange={update("name")}
            placeholder="例如 张三"
            className={inputCls}
          />
        </Field>
        <Field label="阳历年" className="col-span-2 sm:col-span-2">
          <input
            type="number" min="1900" max="2100"
            value={form.year} onChange={update("year")}
            required className={inputCls}
          />
        </Field>
        <Field label="月" className="col-span-1">
          <input
            type="number" min="1" max="12"
            value={form.month} onChange={update("month")}
            required className={inputCls}
          />
        </Field>
        <Field label="日" className="col-span-1">
          <input
            type="number" min="1" max="31"
            value={form.day} onChange={update("day")}
            required className={inputCls}
          />
        </Field>
        <Field label="时（0–23）" className="col-span-1">
          <input
            type="number" min="0" max="23"
            value={form.hour} onChange={update("hour")}
            required className={inputCls}
          />
        </Field>
        <Field label="分" className="col-span-1">
          <input
            type="number" min="0" max="59"
            value={form.minute} onChange={update("minute")}
            className={inputCls}
          />
        </Field>

        <Field label="性别" className="col-span-2 sm:col-span-2">
          <div className="flex h-10 items-center gap-4 rounded-md border border-input bg-background px-3 text-sm">
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="radio" name="gender" value="male"
                checked={form.gender === "male"}
                onChange={update("gender")}
                className="h-4 w-4 accent-primary"
              />
              男
            </label>
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="radio" name="gender" value="female"
                checked={form.gender === "female"}
                onChange={update("gender")}
                className="h-4 w-4 accent-primary"
              />
              女
            </label>
          </div>
        </Field>

        <Field label="出生地点" className="col-span-2 sm:col-span-4">
          <select
            value={form.placeId}
            onChange={update("placeId")}
            className={inputCls}
          >
            {Object.entries(groupedPlaces).map(([group, list]) => (
              <optgroup key={group} label={group}>
                {list.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}（{p.lon > 0 ? "东经" : "西经"}
                    {Math.abs(p.lon).toFixed(2)}°，{fmtUtc(p.tzMeridian)}）
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="__custom__">自定义…</option>
          </select>
        </Field>

        <Field
          label="夏令时？"
          className="col-span-2 flex flex-col gap-1.5 sm:col-span-2"
        >
          <label className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm">
            <input
              type="checkbox"
              checked={form.isDst}
              onChange={update("isDst")}
              className="h-4 w-4 accent-primary"
            />
            出生时使用夏令时（自动 −1 小时）
          </label>
        </Field>

        {form.placeId === "__custom__" && (
          <>
            <Field label="经度（°，东+西−）" className="col-span-2 sm:col-span-3">
              <input
                type="number" step="0.01" min="-180" max="180"
                value={form.customLon} onChange={update("customLon")}
                placeholder="例如 116.41"
                className={inputCls}
              />
            </Field>
            <Field label="时区（UTC 偏移小时）" className="col-span-2 sm:col-span-3">
              <input
                type="number" step="0.5" min="-12" max="14"
                value={form.customTz} onChange={update("customTz")}
                placeholder="例如 8 或 -5"
                className={inputCls}
              />
            </Field>
          </>
        )}

        <div className="col-span-2 sm:col-span-6">
          <Button type="submit" className="w-full sm:w-auto">
            排盘
          </Button>
        </div>
      </form>
    </Card>
  );
}
