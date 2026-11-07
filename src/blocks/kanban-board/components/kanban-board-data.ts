// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type ColumnId = "todo" | "doing" | "done";
export type Label = "Design" | "Shop" | "Words" | "Studio" | "Admin";
export type Note = {
  id: string;
  title: string;
  detail?: string;
  label: Label;
  who: string;
  due?: string;
  column: ColumnId;
};
export const COLUMNS: ReadonlyArray<{
  id: ColumnId;
  title: string;
  hint: string;
}> = [{
  id: "todo" as const,
  title: "To do" as const,
  hint: "Waiting for a pair of hands" as const
}, {
  id: "doing" as const,
  title: "Doing" as const,
  hint: "Pinned up, in progress" as const
}, {
  id: "done" as const,
  title: "Done" as const,
  hint: "Ticked off" as const
}];
export const LABEL_COLOR = {
  Design: "pink" as const,
  Shop: "orange" as const,
  Words: "green" as const,
  Studio: "blue" as const,
  Admin: "yellow" as const
} as const satisfies Record<Label, string>;
export const LABELS = Object.keys(LABEL_COLOR) as Label[];
export const TEAM = ["Ada Lovelace", "Jo Okafor", "Mika Kobayashi", "Sam Reyes"] as const;
export const notes: Note[] = [{
  id: "n1" as const,
  title: "Order washi tape for the box" as const,
  label: "Shop" as const,
  who: "Ada Lovelace" as const,
  due: "Sep 28" as const,
  column: "todo" as const
}, {
  id: "n2" as const,
  title: "Write the newsletter" as const,
  detail: "Three paragraphs and a link to the journal." as const,
  label: "Words" as const,
  who: "Jo Okafor" as const,
  due: "Sep 29" as const,
  column: "todo" as const
}, {
  id: "n3" as const,
  title: "Photograph the field notebooks" as const,
  label: "Studio" as const,
  who: "Mika Kobayashi" as const,
  due: "Sep 30" as const,
  column: "todo" as const
}, {
  id: "n4" as const,
  title: "Book the courier" as const,
  label: "Admin" as const,
  who: "Sam Reyes" as const,
  column: "todo" as const
}, {
  id: "n5" as const,
  title: "Print the price tags" as const,
  detail: "Kraft card, two hundred of them." as const,
  label: "Shop" as const,
  who: "Ada Lovelace" as const,
  due: "Sep 27" as const,
  column: "doing" as const
}, {
  id: "n6" as const,
  title: "Draw the sticker sheet" as const,
  detail: "Nine stickers. One of them is a snail." as const,
  label: "Design" as const,
  who: "Mika Kobayashi" as const,
  due: "Sep 27" as const,
  column: "doing" as const
}, {
  id: "n7" as const,
  title: "Fix the postal code field at checkout" as const,
  label: "Admin" as const,
  who: "Sam Reyes" as const,
  column: "doing" as const
}, {
  id: "n8" as const,
  title: "Choose the paper stock" as const,
  label: "Design" as const,
  who: "Jo Okafor" as const,
  column: "done" as const
}, {
  id: "n9" as const,
  title: "Name the new notebook" as const,
  detail: "It is called Margin." as const,
  label: "Words" as const,
  who: "Jo Okafor" as const,
  column: "done" as const
}, {
  id: "n10" as const,
  title: "Order the shipping boxes" as const,
  label: "Admin" as const,
  who: "Sam Reyes" as const,
  column: "done" as const
}];
