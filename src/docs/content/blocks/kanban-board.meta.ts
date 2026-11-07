// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Kanban board" as const,
  description: "Three columns of sticky notes on graph paper. Every note has arrow buttons that name the note and the column it goes to, so moving one works from the keyboard and a screen reader; you can also pick a note up and drop it on another column. Add a note at the foot of a column. Made for the desk, fine on a plain page." as const,
  tags: ["kanban", "sticky notes", "drag and drop", "productivity"]
} satisfies BlockDoc;
