// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Period = "monthly" | "yearly";
export type Tier = {
  id: "starter" | "studio" | "workshop";
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  popular?: boolean;
  tape: "masking" | "washi-dots" | "washi-stripes";
};
export const TIERS: Tier[] = [{
  id: "starter" as const,
  name: "Starter" as const,
  tagline: "One notebook, one pen, no rush." as const,
  monthly: 0,
  yearly: 0,
  features: ["3 notebooks", "1 GB of paper", "Just you at the desk", "Help from the community"],
  cta: "Start for free" as const,
  tape: "masking" as const
}, {
  id: "studio" as const,
  name: "Studio" as const,
  tagline: "Ten notebooks and the good highlighters." as const,
  monthly: 1200,
  yearly: 12000,
  features: ["10 notebooks", "10 GB of paper", "3 people at the desk", "The good highlighters", "Email help, same day"],
  cta: "Get Studio" as const,
  popular: true,
  tape: "washi-dots" as const
}, {
  id: "workshop" as const,
  name: "Workshop" as const,
  tagline: "A whole desk. Washi tape included." as const,
  monthly: 3200,
  yearly: 32000,
  features: ["100 notebooks", "100 GB of paper", "15 people at the desk", "Unlimited washi tape", "A real person, quickly"],
  cta: "Get Workshop" as const,
  tape: "washi-stripes" as const
}];
export const dollars = (cents: number): string => `$${cents % 100 === 0 ? cents / 100 : (cents / 100).toFixed(2)}`;
export const perMonth = (t: Tier, period: Period): number => period === "yearly" ? Math.round(t.yearly / 12) : t.monthly;
export const FAQ = [{
  q: "Can I change plans later?" as const,
  a: "Any time. Going up starts today and you pay only the difference for the days that are left. Going down waits for your next renewal." as const
}, {
  q: "What happens if I run out of notebooks?" as const,
  a: "Nothing is deleted. The extra notebooks stay readable, and you can write in them again when there is room." as const
}, {
  q: "Is there a discount for schools or clubs?" as const,
  a: "Yes, 40% off for teachers, students and anyone running a club. Write to us from your school address and we will sort it out." as const
}, {
  q: "Do you take my card details on this page?" as const,
  a: "No. You pick a plan here and add a card on the next page, where it is checked and stored by our payment provider." as const
}];
