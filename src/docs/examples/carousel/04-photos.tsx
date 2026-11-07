// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid";
export const meta = {
  title: "Photo stack (composed)" as const,
  description: "A real use: a trip's snapshots as taped-down polaroids. The line under the tally reads the current photo's date from the Embla API (the polaroid already carries its own caption); the tally counts them, and loops keep both arrows alive." as const,
  layout: "center" as const,
  height: 480,
  stage: "desk" as const
};
const PHOTOS = [["hills", "Day one: the ridge road", "3 Mar"], ["sea", "Lunch by the harbour", "4 Mar"], ["house", "The yellow house", "5 Mar"], ["night", "Lanterns after dark", "5 Mar"], ["hills", "Heading home", "7 Mar"], ["sea", "The last swim", "7 Mar"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const api = shallowRef<CarouselApi>(initialState(undefined));
  const setApi = stateSetter(api);
  const at = shallowRef(initialState(0));
  const setAt = stateSetter(at);
  watchDependencies(() => {
    if (!api.value) return;
    const sync = () => setAt(api.value.selectedScrollSnap());
    sync();
    api.value.on("select", sync);
    return () => {
      api.value.off("select", sync);
    };
  }, () => [api.value], false);
  return () => {
    return <div class="mx-14 w-full max-w-xs">
      <Carousel aria-label="Trip photos" setApi={setApi} opts={{
        loop: true
      }} seed="trip">
        <CarouselContent>
          {PHOTOS.map(([scene, caption, date], i) => <CarouselItem key={caption} aria-label={`${i + 1} of ${PHOTOS.length}`} class="grid place-items-center">
              <Polaroid seed={`p${i}`} tilt={i % 2 ? 1.2 : -1.2}>
                <PolaroidImage scene={scene} date={date} seed={`s${i}`} label={caption} />
                <PolaroidCaption>{caption}</PolaroidCaption>
              </Polaroid>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
      <p class="mt-3 text-center font-script text-xl leading-none text-ink-soft" aria-hidden="true">
        {PHOTOS[at.value][2]} · {at.value + 1} of {PHOTOS.length}
      </p>
    </div>;
  };
});
export default Example;
