// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, proxyRefs } from "vue";
import { ScrollArea as ScrollAreaPrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { scrollThumbRecipe, scrollTrackRecipe } from "@/lib/ink/recipes/scroll-area-ink";
import { cn } from "@/lib/utils";
const ScrollArea = defineUi<UI.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  bleed?: boolean;
  orientation?: "vertical" | "horizontal" | "both";
}>("ScrollArea", ["class", "bleed", "orientation"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const bleed = computed(() => _props["bleed"] === undefined ? false : _props["bleed"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "vertical" as const : _props["orientation"]);
  const props = computed(() => omitProps(_props, ["class", "children", "bleed", "orientation"]));
  return () => {
    return <ScrollAreaPrimitive.Root data-slot="scroll-area" class={cn("relative", className.value)} {...domProps(props.value)}>
      <ScrollAreaPrimitive.Viewport data-slot="scroll-area-viewport" class={cn("size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ll-focus)", orientation.value === "vertical" && "[&>div]:block!", bleed.value && "p-3")}>
        {readSlot(_slots.default)}
      </ScrollAreaPrimitive.Viewport>
      {orientation.value !== "horizontal" ? <ScrollBar /> : null}
      {orientation.value !== "vertical" ? <ScrollBar orientation="horizontal" /> : null}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>;
  };
});
const ScrollBar = defineUi<UI.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
  seed?: string | number;
}>("ScrollBar", ["class", "orientation", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "vertical" as const : _props["orientation"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "orientation", "seed", "ref"]));
  const _trackCore = useInk(() => ({
    recipe: scrollTrackRecipe,
    params: {
      orientation: orientation.value
    },
    kind: "track" as const,
    seed: seed.value === undefined ? undefined : `${seed.value}|track`,
    still: true
  }));
  const track = computed(() => proxyRefs(_trackCore));
  const _thumbCore = useInk(() => ({
    recipe: scrollThumbRecipe,
    params: {
      orientation: orientation.value
    },
    kind: "thumb" as const,
    seed: seed.value === undefined ? undefined : `${seed.value}|thumb`,
    still: true
  }));
  const thumb = computed(() => proxyRefs(_thumbCore));
  return () => {
    return <ScrollAreaPrimitive.ScrollAreaScrollbar data-slot="scroll-area-scrollbar" orientation={orientation.value} ref={useMergedRef<HTMLDivElement>(track.value.hostRef, ref.value)} {...domProps(track.value.node ? track.value.hostProps : {})} class={cn("isolate flex touch-none p-px transition-colors select-none forced-colors:outline-0! data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:animate-in data-[state=visible]:fade-in-0", orientation.value === "vertical" && "h-full w-2.5 border-l border-l-transparent", orientation.value === "horizontal" && "h-2.5 flex-col border-t border-t-transparent", className.value)} {...domProps(props.value)}>
      {track.value.node}
      <ScrollAreaPrimitive.ScrollAreaThumb data-slot="scroll-area-thumb" ref={thumb.value.hostRef} {...domProps(thumb.value.node ? thumb.value.hostProps : {})} class="relative isolate flex-1 forced-colors:bg-[CanvasText] forced-colors:outline-0!">
        {thumb.value.node}
      </ScrollAreaPrimitive.ScrollAreaThumb>
    </ScrollAreaPrimitive.ScrollAreaScrollbar>;
  };
});
export { ScrollArea, ScrollBar };
