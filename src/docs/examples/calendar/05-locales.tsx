// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
// 日历组件基于 date-fns 的 Locale 类型，直接使用其官方语言包保持格式化行为一致。
import arSA from "date-fns/locale/ar-SA";
import es from "date-fns/locale/es";
import { Calendar } from "@/components/ui/calendar";
export const meta = {
  title: "Other languages" as const,
  description: "Pass a Reka Calendar locale: Spanish starts the week on Monday; Arabic runs right to left, with Eastern Arabic numerals and one-letter weekdays (a `formatWeekdayName`, since the short names of that language do not fit a cell), and the rules, arrows and swipe ends turn around with it." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const a = shallowRef<Date | undefined>(initialState(new Date(2026, 8, 17)));
  const setA = stateSetter(a);
  const b = shallowRef<Date[] | undefined>(initialState([new Date(2026, 8, 6), new Date(2026, 8, 13)]));
  const setB = stateSetter(b);
  return () => {
    return <div class="flex flex-wrap items-start justify-center gap-8">
      <Calendar mode="single" locale={es} weekStartsOn={1} selected={a.value} onSelect={setA} defaultMonth={new Date(2026, 8)} today={new Date(2026, 8, 15)} sheet seed="es" />
      <Calendar mode="multiple" locale={arSA} dir="rtl" numerals="arab" formatters={{
        formatWeekdayName: d => d.toLocaleDateString("ar", {
          weekday: "narrow" as const
        })
      }} selected={b.value} onSelect={setB} defaultMonth={new Date(2026, 8)} today={new Date(2026, 8, 15)} sheet seed="ar" />
    </div>;
  };
});
export default Example;
