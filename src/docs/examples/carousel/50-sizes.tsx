// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
export const meta = {
  title: "Sizes: several slides in view" as const,
  description: "A slide is as wide as its `basis-*` class: `basis-1/2` shows two, `basis-1/3` three. Breakpoint variants change it with the screen (here half from md, a third from lg), and `align: \"start\"` lines the first slide up with the left edge instead of centring it." as const,
  layout: "center" as const,
  height: 340,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-12 w-full max-w-sm">
      <Carousel aria-label="Numbered cards, several at a time" opts={{
        align: "start" as const
      }} seed="sizes">
        <CarouselContent>
          {Array.from({
            length: 5
          }, (_, i) => <CarouselItem key={i} aria-label={`${i + 1} of 5`} class="md:basis-1/2 lg:basis-1/3">
              <div class="p-1">
                <Card seed={`size${i}`}>
                  <CardContent class="grid aspect-square place-items-center p-6">
                    <span class="font-script text-4xl font-semibold">{i + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>;
  };
});
export default Example;
