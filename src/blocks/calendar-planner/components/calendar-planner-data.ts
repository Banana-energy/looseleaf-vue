// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type EventKind = "studio" | "home" | "friends" | "trips" | "errands";
export type PlannerEvent = {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  kind: EventKind;
  notes: string;
};
export const TODAY = "2026-09-25";
export const KINDS: ReadonlyArray<{
  id: EventKind;
  label: string;
  dot: string;
}> = [{
  id: "studio" as const,
  label: "Studio" as const,
  dot: "bg-tomato" as const
}, {
  id: "home" as const,
  label: "Home" as const,
  dot: "bg-grass" as const
}, {
  id: "friends" as const,
  label: "Friends" as const,
  dot: "bg-sky" as const
}, {
  id: "trips" as const,
  label: "Trips" as const,
  dot: "bg-grape" as const
}, {
  id: "errands" as const,
  label: "Errands" as const,
  dot: "bg-lemon" as const
}];
export const kindOf = (id: EventKind) => KINDS.find(k => k.id === id) ?? KINDS[0];
export const events: PlannerEvent[] = [{
  id: "e1" as const,
  title: "Watercolor class" as const,
  date: "2026-09-03" as const,
  start: "18:30" as const,
  end: "20:30" as const,
  kind: "home" as const,
  notes: "Bring the small brushes." as const
}, {
  id: "e2" as const,
  title: "Kiln day" as const,
  date: "2026-09-10" as const,
  start: "09:00" as const,
  end: "13:00" as const,
  kind: "studio" as const,
  notes: "" as const
}, {
  id: "e3" as const,
  title: "Dinner with the neighbors" as const,
  date: "2026-09-12" as const,
  start: "19:30" as const,
  end: "22:00" as const,
  kind: "friends" as const,
  notes: "We are bringing the tart." as const
}, {
  id: "e4" as const,
  title: "Dentist" as const,
  date: "2026-09-16" as const,
  start: "08:30" as const,
  end: "09:15" as const,
  kind: "home" as const,
  notes: "" as const
}, {
  id: "e5" as const,
  title: "Order the boxes" as const,
  date: "2026-09-21" as const,
  start: "11:00" as const,
  end: "11:30" as const,
  kind: "errands" as const,
  notes: "" as const
}, {
  id: "e6" as const,
  title: "Studio stand-up" as const,
  date: "2026-09-25" as const,
  start: "09:30" as const,
  end: "10:00" as const,
  kind: "studio" as const,
  notes: "Price tags, sticker sheet, newsletter." as const
}, {
  id: "e7" as const,
  title: "Lunch with Ada" as const,
  date: "2026-09-25" as const,
  start: "12:30" as const,
  end: "14:00" as const,
  kind: "friends" as const,
  notes: "The place with the good bread." as const
}, {
  id: "e8" as const,
  title: "Post office run" as const,
  date: "2026-09-25" as const,
  start: "16:00" as const,
  end: "16:45" as const,
  kind: "errands" as const,
  notes: "Two parcels and a postcard." as const
}, {
  id: "e9" as const,
  title: "Farmers market" as const,
  date: "2026-09-26" as const,
  start: "10:00" as const,
  end: "12:00" as const,
  kind: "errands" as const,
  notes: "" as const
}, {
  id: "e10" as const,
  title: "Ada's birthday supper" as const,
  date: "2026-09-26" as const,
  start: "19:30" as const,
  end: "23:00" as const,
  kind: "friends" as const,
  notes: "Don't forget the card." as const
}, {
  id: "e11" as const,
  title: "Print the price tags" as const,
  date: "2026-09-28" as const,
  start: "09:00" as const,
  end: "12:00" as const,
  kind: "studio" as const,
  notes: "Kraft card, two hundred." as const
}, {
  id: "e12" as const,
  title: "Newsletter deadline" as const,
  date: "2026-09-29" as const,
  start: "10:00" as const,
  end: "11:00" as const,
  kind: "studio" as const,
  notes: "" as const
}, {
  id: "e13" as const,
  title: "Train to Lyon" as const,
  date: "2026-09-30" as const,
  start: "08:15" as const,
  end: "11:40" as const,
  kind: "trips" as const,
  notes: "Seat 42, by the window." as const
}, {
  id: "e14" as const,
  title: "Paper fair, day one" as const,
  date: "2026-10-01" as const,
  start: "09:00" as const,
  end: "18:00" as const,
  kind: "trips" as const,
  notes: "" as const
}, {
  id: "e15" as const,
  title: "Paper fair, day two" as const,
  date: "2026-10-02" as const,
  start: "09:00" as const,
  end: "17:00" as const,
  kind: "trips" as const,
  notes: "Say hello to the marbling people." as const
}, {
  id: "e16" as const,
  title: "Train home" as const,
  date: "2026-10-02" as const,
  start: "18:30" as const,
  end: "22:00" as const,
  kind: "trips" as const,
  notes: "" as const
}];
const pad = (n: number) => String(n).padStart(2, "0");
export function parseDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export const dayKey = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const clock = (hhmm: string): string => `${Number(hhmm.slice(0, 2))}:${hhmm.slice(3, 5)}`;
export const onDay = (list: readonly PlannerEvent[], iso: string): PlannerEvent[] => list.filter(e => e.date === iso).sort((a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id));
export const after = (list: readonly PlannerEvent[], iso: string, count = 5): PlannerEvent[] => list.filter(e => e.date > iso).sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)).slice(0, count);
