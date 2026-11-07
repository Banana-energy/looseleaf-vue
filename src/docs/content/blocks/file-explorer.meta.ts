// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "File explorer" as const,
  description: "A filing cabinet: the places are the tabs of a manila folder, and inside one you open folders with a trail back, switch between a list and a grid, sort, search, pick several files and delete them (with an Undo). Files are named to a screen reader with their kind, size and date. Made for the desk, where the folder's kraft looks right." as const,
  tags: ["files", "folders", "list", "grid"]
} satisfies BlockDoc;
