// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Sidebar 08" as const,
  description: "An inset sidebar with secondary navigation: the pad has a margin round it and the page becomes a sheet of paper set on the desk beside it. Rows fold open from a chevron, projects keep their menus, support and feedback sit at the foot. Mirrors shadcn's sidebar-08. At its best on the desk." as const,
  tags: ["sidebar", "inset", "app"]
} satisfies BlockDoc;
