// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Sidebar 15" as const,
  description: "A left and a right sidebar: the notes pad hangs from the left and folds away, the calendar pad is taped in on the right and stays (from the lg breakpoint up), the page is a sheet between them. Mirrors shadcn's sidebar-15. Looks right on the desk and on plain paper." as const,
  tags: ["sidebar", "calendar", "app"]
} satisfies BlockDoc;
