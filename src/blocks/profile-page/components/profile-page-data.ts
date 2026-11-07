// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { NotebookCoverProps } from "@/components/ui/notebook";
export type Stat = {
  id: string;
  label: string;
  value: string;
  note: string;
};
export type Week = {
  label: string;
  pages: number;
};
export type ShelfNotebook = {
  tone: NotebookCoverProps["tone"];
  name: string;
  pages: number;
};
export type Badge = {
  id: string;
  sticker: string;
  name: string;
  how: string;
  earned?: string;
};
export type Profile = {
  name: string;
  handle: string;
  pronouns: string;
  place: string;
  joined: string;
  website: string;
  bio: string;
  followers: number;
  following: number;
  photo?: string;
  topics: string[];
  stats?: Stat[];
  streakDays?: number;
  weeks?: Week[];
  feed?: Entry[];
  shelf?: ShelfNotebook[];
  badges?: Badge[];
};
export const PROFILE: Profile = {
  name: "Jo Delacroix" as const,
  handle: "jo_writes" as const,
  pronouns: "she / her" as const,
  place: "Lisbon" as const,
  joined: "March 2024" as const,
  website: "jo.looseleaf.example" as const,
  bio: "I write in the margins. Letterpress on weekends, tea all week, and a running argument with a dead author about semicolons." as const,
  followers: 312,
  following: 148,
  topics: ["Letterpress", "Recipes", "Margins", "Tea"]
};
export const STATS: Stat[] = [{
  id: "pages" as const,
  label: "Pages written" as const,
  value: "1,284" as const,
  note: "up 12% on last month" as const
}, {
  id: "books" as const,
  label: "Notebooks" as const,
  value: "12" as const,
  note: "3 of them full" as const
}, {
  id: "words" as const,
  label: "Words a day" as const,
  value: "640" as const,
  note: "steady since June" as const
}];
export const WEEKS: Week[] = [{
  label: "Aug 4 to 10" as const,
  pages: 28
}, {
  label: "Aug 11 to 17" as const,
  pages: 34
}, {
  label: "Aug 18 to 24" as const,
  pages: 19
}, {
  label: "Aug 25 to 31" as const,
  pages: 41
}, {
  label: "Sep 1 to 7" as const,
  pages: 12
}, {
  label: "Sep 8 to 14" as const,
  pages: 36
}, {
  label: "Sep 15 to 21" as const,
  pages: 30
}, {
  label: "Sep 22 to 28" as const,
  pages: 22
}];
export const STREAK_DAYS = 23;
export type Entry = {
  id: string;
  day: "Today" | "Yesterday" | "Last week";
  icon: "pencil" | "book-open" | "bookmark" | "message-square" | "star";
  title: string;
  where: string;
  time: string;
};
export const FEED: Entry[] = [{
  id: "e1" as const,
  day: "Today" as const,
  icon: "pencil" as const,
  title: "Finished “Porridge, the slow way”" as const,
  where: "Recipes" as const,
  time: "9:12" as const
}, {
  id: "e2" as const,
  day: "Today" as const,
  icon: "message-square" as const,
  title: "Answered a question from Nell about deckle edges" as const,
  where: "Letterpress club" as const,
  time: "8:40" as const
}, {
  id: "e3" as const,
  day: "Yesterday" as const,
  icon: "book-open" as const,
  title: "Read “On owning books” for the seventh time" as const,
  where: "Reading" as const,
  time: "21:05" as const
}, {
  id: "e4" as const,
  day: "Yesterday" as const,
  icon: "star" as const,
  title: "Earned a sticker: 100 pages in a month" as const,
  where: "Stickers" as const,
  time: "18:30" as const
}, {
  id: "e5" as const,
  day: "Last week" as const,
  icon: "bookmark" as const,
  title: "Pinned “Lisbon, three days” to the top of Trips" as const,
  where: "Trips" as const,
  time: "Tue" as const
}];
export const SHELF: ShelfNotebook[] = [{
  tone: "tomato" as const,
  name: "Field notes" as const,
  pages: 48
}, {
  tone: "teal" as const,
  name: "Recipes" as const,
  pages: 31
}, {
  tone: "sky" as const,
  name: "Sketches" as const,
  pages: 22
}, {
  tone: "grape" as const,
  name: "Letters" as const,
  pages: 64
}, {
  tone: "ink" as const,
  name: "Accounts" as const,
  pages: 9
}];
export const BADGES: Badge[] = [{
  id: "first" as const,
  sticker: "first-place" as const,
  name: "First notebook" as const,
  how: "Fill one notebook" as const,
  earned: "Apr 2024" as const
}, {
  id: "hundred" as const,
  sticker: "hundred" as const,
  name: "A hundred pages" as const,
  how: "Write 100 pages in a month" as const,
  earned: "Sep 2026" as const
}, {
  id: "rocket" as const,
  sticker: "rocket" as const,
  name: "Early bird" as const,
  how: "Join in the first year" as const,
  earned: "Mar 2024" as const
}, {
  id: "owl" as const,
  sticker: "owl" as const,
  name: "Night owl" as const,
  how: "Write after midnight, ten times" as const,
  earned: "Jun 2025" as const
}, {
  id: "tea" as const,
  sticker: "teacup" as const,
  name: "Tea break" as const,
  how: "Take a break every day for a week" as const,
  earned: "Nov 2024" as const
}, {
  id: "marker" as const,
  sticker: "highlighter" as const,
  name: "Margin note" as const,
  how: "Mark up 50 lines" as const
}, {
  id: "party" as const,
  sticker: "party-popper" as const,
  name: "Full house" as const,
  how: "Fill ten notebooks" as const
}, {
  id: "member" as const,
  sticker: "stamp-member" as const,
  name: "Club member" as const,
  how: "Join a club" as const
}];
