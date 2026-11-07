// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
export const meta = {
  title: "The tally, several at a time" as const,
  description: "CarouselDots keeps count like a tally: a stroke per slide, the fifth of each group struck across the four before it, the current one in blue felt (click any to go there). Seven slides, two per view on wide screens, and the API from setApi drives the caption." as const,
  layout: "center" as const,
  height: 380,
  stage: "desk" as const
};
const STOCKS = ["sticky-yellow", "index-card", "kraft", "paper", "sticky-blue", "graph", "sticky-pink"] as const;
const NOTES = ["Ink", "A good eraser", "Tape", "Index cards", "Washi (dots)", "A ruler", "Stamp pad"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const api = shallowRef<CarouselApi>(initialState(undefined));
  const setApi = stateSetter(api);
  const current = shallowRef(initialState(0));
  const setCurrent = stateSetter(current);
  watchDependencies(() => {
    if (!api.value) return;
    const update = () => setCurrent(api.value.selectedScrollSnap());
    update();
    api.value.on("select", update);
    return () => {
      api.value.off("select", update);
    };
  }, () => [api.value], false);
  return () => {
    return <div class="mx-12 w-full max-w-md">
      <Carousel aria-label="Shopping notes" setApi={setApi} seed="tally" opts={{
        align: "start" as const
      }}>
        <CarouselContent>
          {NOTES.map((n, i) => <CarouselItem key={n} class="basis-1/2" aria-label={`${i + 1} of ${NOTES.length}`}>
              <Card seed={`n${i}`} stock={STOCKS[i % STOCKS.length]}>
                <CardContent class="grid aspect-[4/3] place-items-center p-4 text-center">
                  <span class="font-script text-2xl leading-tight font-semibold">{n}</span>
                </CardContent>
              </Card>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
      <p class="mt-3 text-center text-sm text-muted-foreground" aria-hidden="true">
        Slide {current.value + 1} of {api.value?.scrollSnapList().length ?? NOTES.length}
      </p>
    </div>;
  };
});
export default Example;
