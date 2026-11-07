// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Sidebar 09" as const,
  description: "Nested sidebars for a mail app: a strip of folder icons and, on the same pad, a second sheet listing the messages of the folder you picked, with search and an Unreads switch. Pick a message and it opens on the page. Mirrors shadcn's sidebar-09. Looks right on the desk and on plain paper." as const,
  tags: ["sidebar", "nested", "mail", "app"]
} satisfies BlockDoc;
