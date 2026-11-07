// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Login 02" as const,
  description: "Two columns: the form on a sheet of paper, and where the photograph would be a hand-made cover on the desk (graph paper, a greeting, Stubby waving, a pinned note, stickers). The cover shows from 48rem of width. Paper on one side, desk on the other, so it works on either." as const,
  tags: ["login", "auth", "split", "collage"]
} satisfies BlockDoc;
