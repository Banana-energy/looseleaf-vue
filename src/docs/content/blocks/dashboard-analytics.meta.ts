// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Analytics dashboard" as const,
  description: "Traffic on one sheet of paper: four sparkline numbers, visitors day by day against the days before, where they came from, the top pages and a checkout funnel with its biggest drop circled. The date range re-works every figure. The sheet brings its own paper, so it reads the same on the desk and on a plain page." as const,
  tags: ["dashboard", "analytics", "charts", "table"]
} satisfies BlockDoc;
