// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Login 01" as const,
  description: "A taped sheet on the desk with a hand-written welcome back and Stubby looking over its top edge. Email, password with a show toggle, remember me and a Google button, checked with vee-validate and zod. Sits on the desk (it brings its own) and reads the same on paper." as const,
  tags: ["login", "auth", "card", "desk", "mascot"]
} satisfies BlockDoc;
