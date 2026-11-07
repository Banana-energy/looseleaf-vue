// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Balances } from "@/blocks/dashboard-finance/components/dashboard-finance-balances";
import { Budgets, HeadsUp } from "@/blocks/dashboard-finance/components/dashboard-finance-budgets";
import { CashFlow, Spending } from "@/blocks/dashboard-finance/components/dashboard-finance-charts";
import { inMonth, MONTHS, spentBy, TODAY, transactions as sample, type Transaction } from "@/blocks/dashboard-finance/components/dashboard-finance-data";
import { Transactions } from "@/blocks/dashboard-finance/components/dashboard-finance-transactions";
import { Page as Sheet, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const DashboardFinance = defineUi<{
  as?: "main" | "div";
}>("DashboardFinance", ["as"], (_props, {
  slots: _slots
}) => {
  const Root = computed(() => _props["as"] === undefined ? "main" as const : _props["as"]);
  const all = shallowRef<Transaction[]>(initialState(sample));
  const setAll = stateSetter(all);
  const monthId = shallowRef<string>(initialState(MONTHS[0].id));
  const setMonthId = stateSetter(monthId);
  const month = computed(() => MONTHS.find(m => m.id === monthId.value) ?? MONTHS[0]);
  const list = computed(() => inMonth(all.value, month.value.id));
  const spent = computed(() => spentBy(all.value, month.value.id));
  const addDate = computed(() => month.value.id === TODAY.slice(0, 7) ? TODAY : `${month.value.id}-28`);
  return () => {
    return <div class="overflow-x-clip">
      <Sheet as={Root.value} width="full" holes="start" reinforced tilt={false} rules="none" seed="dashboard-finance" class="gap-6 py-6 pe-4 sm:py-8 sm:pe-6 lg:pe-8">
        <header class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <PageHeader>
            <p class="font-type text-sm tracking-wide text-ink-muted">Household ledger</p>
            <PageTitle underline="double" seed="finance-title">
              {month.value.name}
            </PageTitle>
            <PageDescription>Money in, money out, and what is left in each pot.</PageDescription>
          </PageHeader>
          <Select value={monthId.value} onValueChange={setMonthId}>
            <SelectTrigger class="w-48" aria-label="Month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => <SelectItem key={m.id} value={m.id}>
                  {m.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </header>

        <div class="grid items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <Balances />
          <CashFlow list={all.value} />
        </div>

        <div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Budgets spent={spent.value} monthName={month.value.name} />
          <div class="flex min-w-0 flex-col gap-6">
            <Spending list={all.value} month={month.value.id} monthName={month.value.name} />
            <HeadsUp spent={spent.value} />
          </div>
        </div>

        <Transactions list={list.value} monthName={month.value.name} addDate={addDate.value} onAdd={t => setAll(prev => [{
          ...t,
          id: Math.max(0, ...prev.map(x => x.id)) + 1
        }, ...prev])} />
      </Sheet>
    </div>;
  };
});
export default DashboardFinance;
