// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Checkout 01" as const,
  description: "Checkout on one taped page: contact, delivery (choice cards that show what each costs right now, with no address asked for a pick-up) and a card checked as you type (Luhn, expiry, grouped digits), beside a basket with quantity steppers, a promo code and a till receipt that rewrites itself with the delivery, discount and VAT. A failed try lists what needs a look with buttons to the fields; placing the order swaps the page for a thank-you with the receipt stamped PAID. The text and forms sit on sheets of their own, so it looks right on paper or on the desk." as const,
  tags: ["commerce", "checkout", "receipt", "form", "validation"]
} satisfies BlockDoc;
