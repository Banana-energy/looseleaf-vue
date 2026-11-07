// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Features, cards and bento" as const,
  description: "A feature section in two looks: three index cards with doodle icons, or a bento of a ruled page, a sticky note, a polaroid, a receipt and a ticket pinned to a corkboard (variant=\"bento\"). Looks right on paper or on the desk." as const,
  tags: ["marketing", "features", "bento", "corkboard"]
} satisfies BlockDoc;
