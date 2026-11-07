// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Profile page" as const,
  description: "A person's page: a taped polaroid holding their photo (or initials) with the name, words, follow and message beside it, four numbers on slips, and three tabs. Activity is pages written week by week in tally marks (this week in marker) and a feed under the day it happened; Notebooks is a shelf of closed covers; Stickers shows the ones earned and, faint, what it takes to earn the rest. The text sits on the page itself, so it reads the same on paper or on the desk." as const,
  tags: ["profile", "social", "activity", "tally", "polaroid"]
} satisfies BlockDoc;
