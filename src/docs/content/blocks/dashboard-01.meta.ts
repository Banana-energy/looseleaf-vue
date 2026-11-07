// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Dashboard 01" as const,
  description: "The classic admin page: a sidebar hung from a binder clip, four numbers, an area chart you can re-cut by date and a table you can select, hide columns from, page through and edit. Mirrors shadcn's dashboard-01. Looks right on the desk (the page is a sheet set on it) and on plain paper." as const,
  tags: ["dashboard", "sidebar", "chart", "table"]
} satisfies BlockDoc;
