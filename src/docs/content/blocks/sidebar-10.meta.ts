// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Sidebar 10" as const,
  description: "A sidebar with a popover: a notes app with favorites and workspaces on the pad and, in the page header, a star and a \"...\" that opens a slip of actions built from the same menu parts as the pad. Mirrors shadcn's sidebar-10. Looks right on the desk and on plain paper." as const,
  tags: ["sidebar", "popover", "notes", "app"]
} satisfies BlockDoc;
