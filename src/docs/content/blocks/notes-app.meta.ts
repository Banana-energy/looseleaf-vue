// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Notes app" as const,
  description: "A notebook editor shell: notebooks as binder tabs down a spine, the pages of the open notebook as index cards, and the page itself on ruled spiral paper with a marks toolbar (highlight, underline, circle, cross out). Write mode is plain text in blue felt, Page mode draws the marks; a tally counts how often you have read it. One pane at a time on a phone. Both panes are sheets, so it looks right on paper or on the desk." as const,
  tags: ["app", "notes", "editor", "tabs"]
} satisfies BlockDoc;
