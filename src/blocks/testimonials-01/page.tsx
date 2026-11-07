// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Lettering } from "@/components/ui/lettering";
import { Rating } from "@/components/ui/rating";
import { Testimonials01Wall } from "@/blocks/testimonials-01/components/testimonials-01-wall";
const Testimonials01 = defineUi<{}>("Testimonials01", [], (_props, {
  slots: _slots
}) => {
  const titleId = useId();
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-8 py-14 @xl:py-20">
        <div class="mx-auto max-w-6xl">
          <header class="mx-auto flex max-w-2xl flex-col items-center text-center [--ll-blend:normal]">
            <Lettering as="h2" id={titleId} size="lg" tone="tangerine" wobble={0.4} seed="testimonials-title">
              Kind words, pinned up
            </Lettering>
            <div class="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <Rating readOnly value={5} aria-label="Rated 4.9 out of 5" />
              <p class="text-lg text-ink-soft">
                <span class="ll-num font-bold text-ink">4.9</span> average from 2,300 reviews
              </p>
            </div>
          </header>

          <div class="mt-14 @xl:mt-16">
            <Testimonials01Wall />
          </div>

          <p class="mt-14 text-center [--ll-blend:normal]">
            <Button asChild variant="outline">
              <a href="#reviews">
                Read all the reviews
                <Icon name="arrow-right" class="rtl:-scale-x-100" />
              </a>
            </Button>
          </p>
        </div>
      </div>
    </section>;
  };
});
export default Testimonials01;
