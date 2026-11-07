// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Lettering } from "@/components/ui/lettering";
import { Faq01Help } from "@/blocks/faq-01/components/faq-01-help";
import { Faq01Sheet } from "@/blocks/faq-01/components/faq-01-sheet";
const Faq01 = defineUi<{}>("Faq01", [], (_props, {
  slots: _slots
}) => {
  const titleId = useId();
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-8 py-14 @xl:py-20">
        <div class="mx-auto grid max-w-5xl gap-x-12 gap-y-10 @3xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] @3xl:items-start">
          <header class="@3xl:col-start-1 @3xl:row-start-1">
            <Lettering as="h2" id={titleId} size="lg" tone="grass" wobble={0.4} seed="faq-title">
              Questions, answered
            </Lettering>
            <p class="mt-4 text-xl/8 text-ink-soft">The ones we get every week, in our own words.</p>
          </header>
          <div class="@3xl:col-start-2 @3xl:row-span-2 @3xl:row-start-1">
            <Faq01Sheet />
          </div>
          <div class="@3xl:col-start-1 @3xl:row-start-2">
            <Faq01Help />
          </div>
        </div>
      </div>
    </section>;
  };
});
export default Faq01;
