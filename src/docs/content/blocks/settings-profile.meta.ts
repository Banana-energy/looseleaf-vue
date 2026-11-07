// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Settings: profile" as const,
  description: "Profile settings on a three-hole-punched page: photo upload with size and type checks, name, username (with a taken-name rule), email, bio with a live counter, pronouns, time zone, website and a search switch. vee-validate and zod, every message written under its field, and an index card that shows how others see you as you type. It is a sheet of paper, so it looks right on paper or on the desk." as const,
  tags: ["settings", "profile", "form", "validation"]
} satisfies BlockDoc;
