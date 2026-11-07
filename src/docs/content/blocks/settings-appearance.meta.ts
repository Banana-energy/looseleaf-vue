// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Settings: appearance" as const,
  description: "Appearance settings for the InkProvider on a page punched at the top: theme, density (comfortable, compact, calm), motion, fine ink, reading direction and the paper to write on, as choice cards. A preview inside its own provider wears every choice at once, and the props to paste into your root provider are written out beneath it. It is a sheet of paper, so it looks right on paper or on the desk." as const,
  tags: ["settings", "appearance", "theme", "density", "motion"]
} satisfies BlockDoc;
