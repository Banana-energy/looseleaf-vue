// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Sidebar 04" as const,
  description: "A floating sidebar with submenus: the pad is set down on the desk with a margin all round and turned a little, 19rem wide, and the page beside it is a second sheet. Mirrors shadcn's sidebar-04. At its best on the desk; on plain paper it still reads as two sheets." as const,
  tags: ["sidebar", "floating", "submenu"]
} satisfies BlockDoc;
