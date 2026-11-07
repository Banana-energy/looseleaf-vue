// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Category = "Groceries" | "Rent" | "Eating out" | "Transport" | "Fun" | "Bills" | "Income";
export type Status = "cleared" | "pending" | "flagged";
export type Transaction = {
  id: number;
  date: string;
  description: string;
  account: "Checking" | "Card";
  category: Category;
  cents: number;
  status: Status;
};
export const CATEGORIES: readonly Category[] = ["Groceries", "Rent", "Eating out", "Transport", "Fun", "Bills", "Income"];
export const CATEGORY_ICON: Record<Category, string> = {
  Groceries: "shopping-cart" as const,
  Rent: "house" as const,
  "Eating out": "receipt" as const,
  Transport: "map" as const,
  Fun: "sparkles" as const,
  Bills: "credit-card" as const,
  Income: "wallet" as const
};
export const MONTHS = [{
  id: "2026-09" as const,
  label: "September 2026" as const,
  name: "September" as const
}, {
  id: "2026-08" as const,
  label: "August 2026" as const,
  name: "August" as const
}] as const;
export const TODAY = "2026-09-25";
export const BUDGETS: ReadonlyArray<{
  category: Exclude<Category, "Income">;
  cents: number;
}> = [{
  category: "Groceries" as const,
  cents: 50000
}, {
  category: "Rent" as const,
  cents: 145000
}, {
  category: "Eating out" as const,
  cents: 15000
}, {
  category: "Transport" as const,
  cents: 12000
}, {
  category: "Fun" as const,
  cents: 15000
}, {
  category: "Bills" as const,
  cents: 24000
}];
export const ACCOUNTS: ReadonlyArray<{
  name: string;
  cents: number;
}> = [{
  name: "Checking" as const,
  cents: 421832
}, {
  name: "Savings" as const,
  cents: 1290000
}, {
  name: "Credit card" as const,
  cents: -64210
}, {
  name: "Index funds" as const,
  cents: 845571
}];
export const transactions: Transaction[] = [{
  id: 1,
  date: "2026-09-25" as const,
  description: "Oat latte at the Blue Door" as const,
  account: "Card" as const,
  category: "Eating out" as const,
  cents: -650,
  status: "pending" as const
}, {
  id: 2,
  date: "2026-09-24" as const,
  description: "Whole Foods" as const,
  account: "Card" as const,
  category: "Groceries" as const,
  cents: -8412,
  status: "cleared" as const
}, {
  id: 3,
  date: "2026-09-24" as const,
  description: "Invoice 118, Pemberton & Sons" as const,
  account: "Checking" as const,
  category: "Income" as const,
  cents: 180000,
  status: "pending" as const
}, {
  id: 4,
  date: "2026-09-23" as const,
  description: "Metro pass top-up" as const,
  account: "Checking" as const,
  category: "Transport" as const,
  cents: -3000,
  status: "cleared" as const
}, {
  id: 5,
  date: "2026-09-22" as const,
  description: "Bakery on rue Cler" as const,
  account: "Card" as const,
  category: "Eating out" as const,
  cents: -1840,
  status: "cleared" as const
}, {
  id: 6,
  date: "2026-09-21" as const,
  description: "Anniversary dinner" as const,
  account: "Card" as const,
  category: "Eating out" as const,
  cents: -9800,
  status: "cleared" as const
}, {
  id: 7,
  date: "2026-09-20" as const,
  description: "Farmers market" as const,
  account: "Checking" as const,
  category: "Groceries" as const,
  cents: -4630,
  status: "cleared" as const
}, {
  id: 8,
  date: "2026-09-19" as const,
  description: "Climbing gym" as const,
  account: "Card" as const,
  category: "Fun" as const,
  cents: -3800,
  status: "cleared" as const
}, {
  id: 9,
  date: "2026-09-18" as const,
  description: "Electric bill" as const,
  account: "Checking" as const,
  category: "Bills" as const,
  cents: -9215,
  status: "cleared" as const
}, {
  id: 10,
  date: "2026-09-17" as const,
  description: "Corner shop" as const,
  account: "Card" as const,
  category: "Groceries" as const,
  cents: -6785,
  status: "cleared" as const
}, {
  id: 11,
  date: "2026-09-15" as const,
  description: "Salary, Marigold Paper Co." as const,
  account: "Checking" as const,
  category: "Income" as const,
  cents: 340000,
  status: "cleared" as const
}, {
  id: 12,
  date: "2026-09-14" as const,
  description: "Cinema, two tickets" as const,
  account: "Card" as const,
  category: "Fun" as const,
  cents: -2200,
  status: "cleared" as const
}, {
  id: 13,
  date: "2026-09-12" as const,
  description: "Taxi home (charged twice?)" as const,
  account: "Card" as const,
  category: "Transport" as const,
  cents: -2400,
  status: "flagged" as const
}, {
  id: 14,
  date: "2026-09-10" as const,
  description: "Internet" as const,
  account: "Checking" as const,
  category: "Bills" as const,
  cents: -4900,
  status: "cleared" as const
}, {
  id: 15,
  date: "2026-09-08" as const,
  description: "Whole Foods" as const,
  account: "Card" as const,
  category: "Groceries" as const,
  cents: -10250,
  status: "cleared" as const
}, {
  id: 16,
  date: "2026-09-05" as const,
  description: "Ramen night" as const,
  account: "Card" as const,
  category: "Eating out" as const,
  cents: -6000,
  status: "cleared" as const
}, {
  id: 17,
  date: "2026-09-03" as const,
  description: "Watercolor set" as const,
  account: "Card" as const,
  category: "Fun" as const,
  cents: -3600,
  status: "cleared" as const
}, {
  id: 18,
  date: "2026-09-02" as const,
  description: "Rent" as const,
  account: "Checking" as const,
  category: "Rent" as const,
  cents: -145000,
  status: "cleared" as const
}, {
  id: 19,
  date: "2026-09-01" as const,
  description: "Phone plan" as const,
  account: "Checking" as const,
  category: "Bills" as const,
  cents: -6400,
  status: "cleared" as const
}, {
  id: 20,
  date: "2026-09-01" as const,
  description: "Garden club dues" as const,
  account: "Checking" as const,
  category: "Fun" as const,
  cents: -1200,
  status: "cleared" as const
}, {
  id: 21,
  date: "2026-08-31" as const,
  description: "Whole Foods" as const,
  account: "Card" as const,
  category: "Groceries" as const,
  cents: -9120,
  status: "cleared" as const
}, {
  id: 22,
  date: "2026-08-29" as const,
  description: "Salary, Marigold Paper Co." as const,
  account: "Checking" as const,
  category: "Income" as const,
  cents: 340000,
  status: "cleared" as const
}, {
  id: 23,
  date: "2026-08-27" as const,
  description: "Pottery class" as const,
  account: "Card" as const,
  category: "Fun" as const,
  cents: -4500,
  status: "cleared" as const
}, {
  id: 24,
  date: "2026-08-24" as const,
  description: "Ramen night" as const,
  account: "Card" as const,
  category: "Eating out" as const,
  cents: -5200,
  status: "cleared" as const
}, {
  id: 25,
  date: "2026-08-20" as const,
  description: "Electric bill" as const,
  account: "Checking" as const,
  category: "Bills" as const,
  cents: -8830,
  status: "cleared" as const
}, {
  id: 26,
  date: "2026-08-18" as const,
  description: "Farmers market" as const,
  account: "Checking" as const,
  category: "Groceries" as const,
  cents: -5210,
  status: "cleared" as const
}, {
  id: 27,
  date: "2026-08-14" as const,
  description: "Metro pass top-up" as const,
  account: "Checking" as const,
  category: "Transport" as const,
  cents: -3000,
  status: "cleared" as const
}, {
  id: 28,
  date: "2026-08-12" as const,
  description: "Invoice 112, Pemberton & Sons" as const,
  account: "Checking" as const,
  category: "Income" as const,
  cents: 120000,
  status: "cleared" as const
}, {
  id: 29,
  date: "2026-08-10" as const,
  description: "Trattoria" as const,
  account: "Card" as const,
  category: "Eating out" as const,
  cents: -7300,
  status: "cleared" as const
}, {
  id: 30,
  date: "2026-08-02" as const,
  description: "Rent" as const,
  account: "Checking" as const,
  category: "Rent" as const,
  cents: -145000,
  status: "cleared" as const
}, {
  id: 31,
  date: "2026-08-01" as const,
  description: "Phone plan" as const,
  account: "Checking" as const,
  category: "Bills" as const,
  cents: -6400,
  status: "cleared" as const
}];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function money(cents: number, {
  sign = false
}: {
  sign?: boolean;
} = {}): string {
  const abs = Math.abs(Math.round(cents));
  const dollars = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const body = `$${dollars}.${String(abs % 100).padStart(2, "0")}`;
  if (cents < 0) return `−${body}`;
  return sign && cents > 0 ? `+${body}` : body;
}
export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${MONTH_NAMES[Number(m) - 1] ?? m} ${Number(d)}`;
}
export const inMonth = (list: readonly Transaction[], month: string) => list.filter(t => t.date.startsWith(month));
export function spentBy(list: readonly Transaction[], month: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const t of inMonth(list, month)) if (t.cents < 0) out[t.category] = (out[t.category] ?? 0) - t.cents;
  return out;
}
export function cashFlow(list: readonly Transaction[]) {
  const past = [{
    month: "Apr" as const,
    income: 5200,
    spending: 2410
  }, {
    month: "May" as const,
    income: 5200,
    spending: 2180
  }, {
    month: "Jun" as const,
    income: 5350,
    spending: 2630
  }, {
    month: "Jul" as const,
    income: 5200,
    spending: 2305
  }];
  const totals = (month: string, name: string) => {
    const rows = inMonth(list, month);
    const income = rows.filter(t => t.cents > 0).reduce((a, t) => a + t.cents, 0) / 100;
    const spending = rows.filter(t => t.cents < 0).reduce((a, t) => a - t.cents, 0) / 100;
    return {
      month: name,
      income: Math.round(income),
      spending: Math.round(spending)
    };
  };
  return [...past, totals("2026-08", "Aug"), totals("2026-09", "Sep")];
}
