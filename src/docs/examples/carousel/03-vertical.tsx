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
  title: "Vertical" as const,
  description: "orientation=\"vertical\": the slides scroll up and down, the arrows sit above and below with up and down arrows, and the keys are ArrowUp and ArrowDown. Give the track a fixed height and offset the gap with -mt on the content and pt on the items." as const,
  layout: "center" as const,
  height: 420,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="my-12 w-full max-w-xs">
      <Carousel aria-label="Reminders" orientation="vertical" opts={{
        align: "start" as const
      }} seed="vertical">
        <CarouselContent class="-mt-1 h-[200px]">
          {["Water the plants", "Call the printer", "Sharpen pencils", "Post the letters"].map((t, i) => <CarouselItem key={t} class="pt-1 md:basis-1/2" aria-label={`${i + 1} of 4`}>
              <Card seed={`r${i}`} class="gap-0 py-3">
                <CardContent class="flex items-center justify-center p-4">
                  <span class="font-script text-2xl font-semibold">{t}</span>
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
