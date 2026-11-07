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
  title: "Default" as const,
  description: "The shadcn demo: five cards and two arrows. Previous is dashed on the first slide; swipe or drag, click the arrows, or press Left and Right while focus is inside." as const,
  layout: "center" as const,
  height: 340,
  stage: "desk" as const
};
const STOCKS = ["paper", "sticky-yellow", "kraft", "sticky-blue", "index-card"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-12 w-full max-w-xs">
      <Carousel aria-label="Numbered cards" seed="default">
        <CarouselContent>
          {Array.from({
            length: 5
          }, (_, i) => <CarouselItem key={i} aria-label={`${i + 1} of 5`}>
              <Card seed={`c${i}`} stock={STOCKS[i]}>
                <CardContent class="grid aspect-square place-items-center p-6">
                  <span class="font-script text-6xl font-semibold">{i + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>;
  };
});
export default Example;
