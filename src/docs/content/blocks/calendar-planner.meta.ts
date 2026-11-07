// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Calendar planner" as const,
  description: "A month planner: the hand-ruled Calendar with dots on the days that have something on, the chosen day written one event to a line on an index card, what comes next, and a dialog to add, change or cross out an event. Days say how many events they hold to a screen reader. Made for the desk; the sheets bring their own paper." as const,
  tags: ["calendar", "planner", "dialog", "productivity"]
} satisfies BlockDoc;
