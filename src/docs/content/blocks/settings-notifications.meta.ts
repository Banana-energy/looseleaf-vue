// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Settings: notifications" as const,
  description: "Notification settings on a page torn from a pad: a how-much dial as choice cards, a ruled table with a hand-ticked box per event and channel, quiet hours with times and days, and a weekly summary. Choices that cannot work together (nothing reaches you, the same time twice, no days) are written under the box that causes them. It is a sheet of paper, so it looks right on paper or on the desk." as const,
  tags: ["settings", "notifications", "form", "table"]
} satisfies BlockDoc;
