// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Expr = string | readonly [Expr, number, Expr];
export interface PaletteEntry {
  token: string;
  value: string;
  role: string;
  alias: string;
  group: "surface" | "ink" | "accent" | "shadcn" | "paper";
  onPaper: number | null;
  onDesk: number | null;
  inkOn: number | null;
}
export interface ContrastRow {
  fg: string;
  bg: string;
  fgHex: string;
  bgHex: string;
  ratio: number;
  min: number;
  level: "error" | "warn";
  status: "ok" | "warn" | "fail";
  purpose: string;
  section: string;
  live: {
    fg: Expr;
    bg: Expr;
  } | null;
}
export interface KnobRow {
  token: string;
  value: string;
  role: string;
  readBy: "css" | "code" | "css+code" | "reserved";
}
export interface DurationRow {
  token: string;
  name: string;
  seconds: number;
  ms: number;
  role: string;
}
export interface EasingRow {
  token: string;
  name: string;
  css: string;
  bezier: readonly [number, number, number, number];
  role: string;
}
export interface ForestCheck {
  pairs: number;
  fails: {
    fg: string;
    bg: string;
    fgHex: string;
    bgHex: string;
    ratio: number;
    min: number;
    purpose: string;
  }[];
  warns: number;
}
export interface ForestStep {
  id: string;
  title: string;
  note: string;
  decls: Record<string, string>;
  check: ForestCheck;
}
export interface ForestData {
  steps: ForestStep[];
  final: Record<string, string>;
  notebook: Record<string, string | null>;
  knobs: {
    wobble: number;
    edge: string;
  };
}
