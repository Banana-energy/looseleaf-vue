// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Lettering } from "@/components/ui/lettering";
import { Features01Bento } from "@/blocks/features-01/components/features-01-bento";
import { Features01Cards } from "@/blocks/features-01/components/features-01-cards";
type Features01Props = {
  variant?: "cards" | "bento";
  title?: string;
  lead?: string;
};
const Features01 = defineUi<Features01Props>("Features01", ["variant", "title", "lead"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"] === undefined ? "cards" as const : _props["variant"]);
  const title = computed(() => _props["title"] === undefined ? "Everything a good notebook does" as const : _props["title"]);
  const lead = computed(() => _props["lead"] === undefined ? "Three things we sweated over, and a few we quietly love." as const : _props["lead"]);
  const titleId = useId();
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full" data-variant={variant.value}>
      <div class="px-4 py-14 @xl:px-8 @xl:py-20">
        <div class="mx-auto max-w-6xl">
          <header class="mx-auto max-w-2xl text-center">
            <p class="font-type text-sm text-ink-soft">What&rsquo;s inside</p>
            <Lettering as="h2" id={titleId} size="lg" tone="sky" wobble={0.4} seed={`features-${variant.value}`} class="mt-3">
              {title.value}
            </Lettering>
            <p class="mt-4 text-xl/8 text-ink-soft">{lead.value}</p>
          </header>
          <div class="mt-14 @xl:mt-16">{variant.value === "bento" ? <Features01Bento /> : <Features01Cards />}</div>
        </div>
      </div>
    </section>;
  };
});
export default Features01;
export type { Features01Props };
