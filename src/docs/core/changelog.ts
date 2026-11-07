// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  notes: string[];
}
export const CHANGELOG: readonly ChangelogEntry[] = [{
  version: "Unreleased" as const,
  date: "Unreleased" as const,
  title: "Building the notebook" as const,
  notes: ["Documentation site: getting started, foundations, component pages with live examples and code, blocks, search (press / or Ctrl K).", "The Notebook theme: cream paper, felt-tip ink, marker and highlighter, defined once as --ll-* tokens.", "Components arrive as their docs and examples are written; each is listed on its own page as soon as it exists."]
}];
