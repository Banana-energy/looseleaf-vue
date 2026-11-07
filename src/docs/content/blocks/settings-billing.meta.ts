// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Settings: billing" as const,
  description: "Billing settings on a taped, coffee-ringed page: your plan as a ticket with choice cards and an honest price for changing it (upgrades are prorated, downgrades wait for the renewal and warn about what no longer fits), usage as pencil bars, the card on file with a real card form (Luhn check, expiry, auto-formatting), invoice details, and every invoice as a till receipt. It is a sheet of paper, so it looks right on paper or on the desk." as const,
  tags: ["settings", "billing", "invoices", "payment"]
} satisfies BlockDoc;
