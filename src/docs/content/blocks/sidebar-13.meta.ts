// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Sidebar 13" as const,
  description: "A sidebar in a dialog: the app's settings open in a sheet of their own that is a small app too, with a pad of sections, breadcrumbs and a page of switches. Opens from the Settings row or the header button. Mirrors shadcn's sidebar-13. Looks right on the desk and on plain paper." as const,
  tags: ["sidebar", "dialog", "settings"]
} satisfies BlockDoc;
