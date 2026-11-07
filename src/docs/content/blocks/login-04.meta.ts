// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Login 04" as const,
  description: "A card that opens into two columns: the form, and a kraft panel with three drawn polaroids taped and pinned to it. Three provider buttons in a row. The pictures stay home below 42rem. Made for the desk." as const,
  tags: ["login", "auth", "card", "social", "polaroid"]
} satisfies BlockDoc;
