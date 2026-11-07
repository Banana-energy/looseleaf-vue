// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Mode = "all" | "mentions" | "nothing";
export type Channel = "email" | "push" | "app";
export const CHANNELS: {
  id: Channel;
  label: string;
}[] = [{
  id: "email" as const,
  label: "Email" as const
}, {
  id: "push" as const,
  label: "Push" as const
}, {
  id: "app" as const,
  label: "In the app" as const
}];
export const EVENTS: {
  id: string;
  label: string;
  help: string;
  personal: boolean;
}[] = [{
  id: "comments" as const,
  label: "Comments on my notes" as const,
  help: "Someone wrote in your margin." as const,
  personal: true
}, {
  id: "replies" as const,
  label: "Replies to my questions" as const,
  help: "An answer to something you asked." as const,
  personal: true
}, {
  id: "follows" as const,
  label: "New followers" as const,
  help: "A person started reading your notebooks." as const,
  personal: false
}, {
  id: "shared" as const,
  label: "Notebooks shared with me" as const,
  help: "Someone handed you a notebook." as const,
  personal: false
}, {
  id: "news" as const,
  label: "News from Looseleaf" as const,
  help: "New pens, about once a month." as const,
  personal: false
}];
export const MODES: {
  id: Mode;
  title: string;
  help: string;
}[] = [{
  id: "all" as const,
  title: "Everything" as const,
  help: "Every comment, reply, follower and shared notebook." as const
}, {
  id: "mentions" as const,
  title: "Just me" as const,
  help: "Only replies to you and comments on your own notes." as const
}, {
  id: "nothing" as const,
  title: "Nothing" as const,
  help: "Mute it all. Quiet hours and the weekly summary switch off too." as const
}];
export const DAYS = [{
  id: "mon" as const,
  label: "Monday" as const,
  short: "M" as const
}, {
  id: "tue" as const,
  label: "Tuesday" as const,
  short: "T" as const
}, {
  id: "wed" as const,
  label: "Wednesday" as const,
  short: "W" as const
}, {
  id: "thu" as const,
  label: "Thursday" as const,
  short: "T" as const
}, {
  id: "fri" as const,
  label: "Friday" as const,
  short: "F" as const
}, {
  id: "sat" as const,
  label: "Saturday" as const,
  short: "S" as const
}, {
  id: "sun" as const,
  label: "Sunday" as const,
  short: "S" as const
}];
export type Prefs = {
  mode: Mode;
  on: Record<string, Channel[]>;
  quiet: {
    on: boolean;
    from: string;
    to: string;
    days: string[];
  };
  summary: {
    day: string;
    tally: boolean;
  };
};
export const DEFAULT_PREFS: Prefs = {
  mode: "all" as const,
  on: {
    comments: ["email", "push", "app"],
    replies: ["email", "push", "app"],
    follows: ["app"],
    shared: ["email", "app"],
    news: []
  },
  quiet: {
    on: true,
    from: "22:00" as const,
    to: "07:30" as const,
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  },
  summary: {
    day: "fri" as const,
    tally: true
  }
};
export const TIMES: {
  value: string;
  label: string;
}[] = Array.from({
  length: 48
}, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 ? "30" as const : "00" as const;
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return {
    value: `${String(h).padStart(2, "0")}:${m}`,
    label: `${twelve}:${m} ${h < 12 ? "am" as const : "pm" as const}`
  };
});
export const rowEnabled = (mode: Mode, personal: boolean): boolean => mode === "all" || mode === "mentions" && personal;
export type Problems = {
  channels?: string;
  quiet?: string;
};
export function validate(p: Prefs): Problems {
  const out: Problems = {};
  const reachable = EVENTS.some(e => rowEnabled(p.mode, e.personal) && (p.on[e.id]?.length ?? 0) > 0);
  if (p.mode !== "nothing" && !reachable) out.channels = "You asked to hear about things, but every box is empty. Tick at least one.";
  if (p.mode !== "nothing" && p.quiet.on) {
    if (p.quiet.from === p.quiet.to) out.quiet = "Quiet hours need two different times.";else if (p.quiet.days.length === 0) out.quiet = "Pick at least one day for quiet hours.";
  }
  return out;
}
