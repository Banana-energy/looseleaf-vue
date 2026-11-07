// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Sidebar 07" as const,
  description: "A sidebar that collapses to icons: the header button, Ctrl/Cmd+B or the strip on the pad's edge shrinks it to a 3rem column, the clip comes off and each icon names itself in a tooltip. Team switcher, folding rows, projects and an account menu. Mirrors shadcn's sidebar-07. Looks right on the desk and on plain paper." as const,
  tags: ["sidebar", "icons", "collapsible", "app"]
} satisfies BlockDoc;
