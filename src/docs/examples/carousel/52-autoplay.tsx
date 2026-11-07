// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Icon } from "@/components/ui/icon";
import { useReducedMotion } from "@/hooks/use-live-motion";
export const meta = {
  title: "Autoplay (an Embla plugin)" as const,
  description: "Anything Embla understands goes in `plugins`; this small autoplay is written inline, so no extra package. It holds still while the pointer, focus or a finger is on the carousel, keeps a Pause through a resize, never starts for readers who asked for less motion, and has a real Pause button (WCAG 2.2.2)." as const,
  layout: "center" as const,
  height: 420,
  stage: "desk" as const
};
type Embla = NonNullable<CarouselApi>;
export function autoplay(delay: number) {
  let embla: Embla | undefined;
  let timer: number | undefined;
  let bound = false;
  let wanted = true;
  const holds = new Set<string>();
  const stop = () => {
    window.clearInterval(timer);
    timer = undefined;
  };
  const sync = () => {
    stop();
    if (!embla || !wanted || holds.size > 0) return;
    timer = window.setInterval(() => embla?.canScrollNext() ? embla.scrollNext() : embla?.scrollTo(0), delay);
  };
  const self = {
    name: "autoplay" as const,
    options: {},
    init(api: Embla) {
      embla = api;
      if (!bound) {
        bound = true;
        api.on("pointerDown", () => self.hold("drag", true));
        api.on("pointerUp", () => self.hold("drag", false));
      }
      sync();
    },
    destroy: stop,
    want(on: boolean) {
      wanted = on;
      sync();
    },
    hold(why: string, on: boolean) {
      if (on) holds.add(why);else holds.delete(why);
      sync();
    }
  };
  return self;
}
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const autoplayer = shallowRef(initialState(() => autoplay(2200)));
  const paused = shallowRef(initialState(false));
  const setPaused = stateSetter(paused);
  const reduced = useReducedMotion();
  const playing = computed(() => !paused.value && !reduced.value);
  watchDependencies(() => autoplayer.value.want(playing.value), () => [autoplayer.value, playing.value], false);
  return () => {
    return <div class="mx-12 flex w-full max-w-xs flex-col gap-3">
      <Carousel aria-label="Numbered cards, playing by themselves" plugins={[autoplayer.value]} seed="autoplay" onMouseenter={() => autoplayer.value.hold("pointer", true)} onMouseleave={() => autoplayer.value.hold("pointer", false)} onFocus={() => autoplayer.value.hold("focus", true)} onBlur={() => autoplayer.value.hold("focus", false)}>
        <CarouselContent>
          {Array.from({
            length: 5
          }, (_, i) => <CarouselItem key={i} aria-label={`${i + 1} of 5`}>
              <div class="p-1">
                <Card seed={`auto${i}`}>
                  <CardContent class="grid aspect-square place-items-center p-6">
                    <span class="font-script text-6xl font-semibold">{i + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {reduced.value ? <p class="text-center text-sm text-muted-foreground">Autoplay is off because you asked for less motion. Use the arrows.</p> : <Button variant="ghost" size="sm" class="self-center" onClick={() => setPaused(!paused.value)}>
          <Icon name={playing.value ? "pause" as const : "play" as const} />
          {playing.value ? "Pause autoplay" as const : "Play autoplay" as const}
        </Button>}
    </div>;
  };
});
export default Example;
