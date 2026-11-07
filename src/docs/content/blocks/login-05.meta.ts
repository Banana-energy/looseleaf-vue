// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Login 05" as const,
  description: "Email first, on a plain sheet of paper that is the whole page: Stubby waves, one field emails a sign-in link, Apple and Google below. After the link is sent the form says so and lets you fix the address. Brings its own paper, so it reads the same on the desk or on paper." as const,
  tags: ["login", "auth", "email", "magic-link", "social"]
} satisfies BlockDoc;
