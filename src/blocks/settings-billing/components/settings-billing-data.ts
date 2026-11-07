// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { z } from "zod";
export type PlanId = "starter" | "studio" | "workshop";
export const PLANS: {
  id: PlanId;
  name: string;
  cents: number;
  blurb: string;
  notebooks: number;
  storageGb: number;
  seats: number;
}[] = [{
  id: "starter" as const,
  name: "Starter" as const,
  cents: 0,
  blurb: "One notebook, one pen, no rush." as const,
  notebooks: 3,
  storageGb: 1,
  seats: 1
}, {
  id: "studio" as const,
  name: "Studio" as const,
  cents: 1200,
  blurb: "Ten notebooks and the good highlighters." as const,
  notebooks: 10,
  storageGb: 10,
  seats: 3
}, {
  id: "workshop" as const,
  name: "Workshop" as const,
  cents: 3200,
  blurb: "A whole desk. Washi tape included." as const,
  notebooks: 100,
  storageGb: 100,
  seats: 15
}];
export const money = (cents: number): string => `$${(cents / 100).toFixed(2)}`;
export const DAYS_LEFT = 18;
export const DAYS_IN_CYCLE = 30;
export const RENEWS = "14 Oct";
export type PlanChange = {
  from: PlanId;
  to: PlanId;
  kind: "same" | "upgrade" | "downgrade";
  today: number;
  monthly: number;
};
export function planChange(from: PlanId, to: PlanId): PlanChange {
  const a = PLANS.find(p => p.id === from)!.cents;
  const b = PLANS.find(p => p.id === to)!.cents;
  if (from === to) return {
    from,
    to,
    kind: "same" as const,
    today: 0,
    monthly: b
  };
  if (b > a) return {
    from,
    to,
    kind: "upgrade" as const,
    today: Math.round((b - a) * DAYS_LEFT / DAYS_IN_CYCLE),
    monthly: b
  };
  return {
    from,
    to,
    kind: "downgrade" as const,
    today: 0,
    monthly: b
  };
}
export const USAGE = [{
  id: "notebooks" as const,
  label: "Notebooks" as const,
  used: 8,
  unit: "" as const
}, {
  id: "storage" as const,
  label: "Storage" as const,
  used: 8.4,
  unit: " GB" as const
}, {
  id: "seats" as const,
  label: "People on the desk" as const,
  used: 3,
  unit: "" as const
}] as const;
export type Invoice = {
  number: string;
  date: string;
  lines: {
    name: string;
    price: string;
  }[];
  total: string;
  paidWith: string;
};
export const INVOICES: Invoice[] = [{
  number: "2026-0009" as const,
  date: "14 Sep 2026" as const,
  lines: [{
    name: "Studio plan, September" as const,
    price: "12.00" as const
  }, {
    name: "Extra storage, 5 GB" as const,
    price: "2.50" as const
  }],
  total: "14.50" as const,
  paidWith: "Visa 4242" as const
}, {
  number: "2026-0008" as const,
  date: "14 Aug 2026" as const,
  lines: [{
    name: "Studio plan, August" as const,
    price: "12.00" as const
  }],
  total: "12.00" as const,
  paidWith: "Visa 4242" as const
}, {
  number: "2026-0007" as const,
  date: "14 Jul 2026" as const,
  lines: [{
    name: "Studio plan, July" as const,
    price: "12.00" as const
  }, {
    name: "Washi tape pack, sticker sheet" as const,
    price: "6.00" as const
  }],
  total: "18.00" as const,
  paidWith: "Visa 4242" as const
}, {
  number: "2026-0006" as const,
  date: "14 Jun 2026" as const,
  lines: [{
    name: "Studio plan, June" as const,
    price: "12.00" as const
  }],
  total: "12.00" as const,
  paidWith: "Visa 4242" as const
}, {
  number: "2026-0005" as const,
  date: "14 May 2026" as const,
  lines: [{
    name: "Studio plan, May" as const,
    price: "12.00" as const
  }],
  total: "12.00" as const,
  paidWith: "Visa 4242" as const
}, {
  number: "2026-0004" as const,
  date: "14 Apr 2026" as const,
  lines: [{
    name: "Starter to Studio, part month" as const,
    price: "7.20" as const
  }],
  total: "7.20" as const,
  paidWith: "Visa 4242" as const
}];
export function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return digits.length > 0 && sum % 10 === 0;
}
export function cardBrand(digits: string): "Visa" | "Mastercard" | "Amex" | "Card" {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return "Card";
}
export function formatCardNumber(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 19);
  if (/^3[47]/.test(d)) return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  return d.replace(/(.{4})/g, "$1 ").trim();
}
export function formatExpiry(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (d.length === 1 && Number(d) > 1) return `0${d}/`;
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
export type Month = {
  year: number;
  month: number;
};
export function currentMonth(): Month {
  // lint-house-disable-next-line render-time
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  };
}
export function makeCardSchema(today: Month) {
  return z.object({
    name: z.string().trim().min(2, "Type the name as it is printed on the card."),
    number: z.string().refine(v => /^\d{13,19}$/.test(v.replace(/\s/g, "")), "A card number has 13 to 19 digits.").refine(v => luhn(v.replace(/\s/g, "")), "That number does not add up. Check each digit."),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Write it as MM/YY, like 08/28.").refine(v => {
      const [m, y] = v.split("/").map(Number);
      return 2000 + y > today.year || 2000 + y === today.year && m >= today.month;
    }, "That card has expired."),
    cvc: z.string().regex(/^\d{3,4}$/, "The security code is 3 or 4 digits.")
  });
}
export type CardValues = z.infer<ReturnType<typeof makeCardSchema>>;
export const detailsSchema = z.object({
  email: z.email("Enter an address like billing@notes.dev."),
  company: z.string().trim().max(60, "Keep the company name to 60 characters."),
  taxId: z.string().trim().regex(/^([A-Za-z]{2}[A-Za-z0-9]{8,12})?$/, "A VAT number starts with two letters, like PT123456789.")
});
export type DetailsValues = z.infer<typeof detailsSchema>;
