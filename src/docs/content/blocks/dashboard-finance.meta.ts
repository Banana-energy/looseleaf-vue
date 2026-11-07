// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Finance dashboard" as const,
  description: "A household ledger on a three-hole-punched sheet: balances written up as a till receipt with the total circled, money in and out, budgets as pencil bars that turn to a red word when a pot is overspent, a donut, and a transactions table with status chips you can filter, sort and add to. Brings its own paper, so it reads the same on the desk and on a plain page." as const,
  tags: ["dashboard", "finance", "receipt", "table", "charts"]
} satisfies BlockDoc;
