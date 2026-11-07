// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef } from "vue";
import useEmblaCarousel, { type UseEmblaCarouselType } from "@/lib/carousel-primitive";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useInk, useInkSeed } from "@/lib/ink/vue";
import { CAROUSEL_TICK_PAD, CAROUSEL_TICK_PAD_PLAIN, carouselTickRecipe } from "@/lib/ink/recipes/carousel-ink";
import { cn } from "@/lib/utils";
type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  snapCount: number;
  seed: string;
} & CarouselProps;
const CarouselContext = createContext<CarouselContextProps | null>(null);
function useCarousel() {
  const context = useContext(CarouselContext);
  return computed(() => {
    if (!context.value) {
      console.error("useCarousel must be used within a <Carousel />");
    }
    return context.value;
  });
}
function isEditable(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.tagName !== "string") return false;
  return el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT";
}
const Carousel = defineUi<UI.ComponentProps<"div"> & CarouselProps & {
  seed?: string | number;
}>("Carousel", ["orientation", "opts", "setApi", "plugins", "class", "seed", "onKeydown"], (_props, {
  slots: _slots
}) => {
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const opts = computed(() => _props["opts"]);
  const setApi = computed(() => _props["setApi"]);
  const plugins = computed(() => _props["plugins"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const seedProp = computed(() => _props["seed"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const props = computed(() => omitProps(_props, ["orientation", "opts", "setApi", "plugins", "class", "children", "seed", "onKeydown"]));
  const seed = useInkSeed(() => seedProp.value);
  const _hook10 = useEmblaCarousel(() => ({
    ...opts.value,
    axis: orientation.value === "horizontal" ? "x" as const : "y" as const
  }), () => plugins.value);
  const carouselRef = computed(() => _hook10.value[0]);
  const api = computed(() => _hook10.value[1]);
  const canScrollPrev = shallowRef(initialState(false));
  const setCanScrollPrev = stateSetter(canScrollPrev);
  const canScrollNext = shallowRef(initialState(false));
  const setCanScrollNext = stateSetter(canScrollNext);
  const selectedIndex = shallowRef(initialState(0));
  const setSelectedIndex = stateSetter(selectedIndex);
  const snapCount = shallowRef(initialState(0));
  const setSnapCount = stateSetter(snapCount);
  const onSelect = (api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
    setSnapCount(api.scrollSnapList().length);
  };
  const scrollPrev = () => {
    api.value?.scrollPrev();
  };
  const scrollNext = () => {
    api.value?.scrollNext();
  };
  const scrollTo = (index: number) => {
    api.value?.scrollTo(index);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    onKeydown.value?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!(event.currentTarget as HTMLDivElement).contains(event.target as Node)) return;
    if (isEditable(event.target as HTMLDivElement)) return;
    const rtl = getComputedStyle(event.currentTarget as HTMLDivElement).direction === "rtl";
    const back = orientation.value === "vertical" ? "ArrowUp" as const : rtl ? "ArrowRight" as const : "ArrowLeft" as const;
    const forward = orientation.value === "vertical" ? "ArrowDown" as const : rtl ? "ArrowLeft" as const : "ArrowRight" as const;
    if (event.key === back) {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === forward) {
      event.preventDefault();
      scrollNext();
    }
  };
  watchDependencies(() => {
    if (!api.value || !setApi.value) return;
    setApi.value(api.value);
  }, () => [api.value, setApi.value], false);
  watchDependencies(() => {
    if (!api.value) return;
    onSelect(api.value);
    api.value.on("reInit", onSelect);
    api.value.on("select", onSelect);
    return () => {
      api.value?.off("reInit", onSelect);
      api.value?.off("select", onSelect);
    };
  }, () => [api.value, onSelect], false);
  return () => {
    return <CarouselContext.Provider value={{
      carouselRef: carouselRef.value,
      api: api.value,
      opts: opts.value,
      orientation: orientation.value || (opts.value?.axis === "y" ? "vertical" as const : "horizontal" as const),
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev: canScrollPrev.value,
      canScrollNext: canScrollNext.value,
      selectedIndex: selectedIndex.value,
      snapCount: snapCount.value,
      seed: seed.value
    }}>
      <div onKeydown={handleKeyDown} class={cn("relative min-w-0", className.value)} role="region" aria-roledescription="carousel" data-slot="carousel" {...domProps(props.value)}>
        {readSlot(_slots.default)}
        <span data-slot="carousel-status" class="sr-only" aria-live="polite" aria-atomic="true">
          {snapCount.value > 1 ? `Slide ${selectedIndex.value + 1} of ${snapCount.value}` : "" as const}
        </span>
      </div>
    </CarouselContext.Provider>;
  };
});
const CarouselContent = defineUi<UI.ComponentProps<"div">>("CarouselContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const _hook2 = useCarousel();
  const carouselRef = computed(() => _hook2.value.carouselRef);
  const orientation = computed(() => _hook2.value.orientation);
  return () => {
    return <div ref={carouselRef.value} class={cn("overflow-hidden", orientation.value === "horizontal" ? "-my-3 py-3" as const : "-mx-3 px-3" as const)} data-slot="carousel-content">
      <div class={cn("flex", orientation.value === "horizontal" ? "-ms-4" as const : "-mt-4 flex-col" as const, className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>
    </div>;
  };
});
const CarouselItem = defineUi<UI.ComponentProps<"div">>("CarouselItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const _hook2 = useCarousel();
  const orientation = computed(() => _hook2.value.orientation);
  return () => {
    return <div role="group" aria-roledescription="slide" data-slot="carousel-item" class={cn("min-w-0 shrink-0 grow-0 basis-full", orientation.value === "horizontal" ? "ps-4" as const : "pt-4" as const, className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const CarouselPrevious = defineUi<UI.ComponentProps<typeof Button>>("CarouselPrevious", ["class", "variant", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "outline" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "icon" as const : _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size"]));
  const _hook4 = useCarousel();
  const orientation = computed(() => _hook4.value.orientation);
  const scrollPrev = computed(() => _hook4.value.scrollPrev);
  const canScrollPrev = computed(() => _hook4.value.canScrollPrev);
  return () => {
    return <Button data-slot="carousel-previous" variant={variant.value} size={size.value} class={cn("absolute size-8", orientation.value === "horizontal" ? "-start-12 top-1/2 -translate-y-1/2" as const : "-top-12 left-1/2 -translate-x-1/2" as const, className.value)} disabled={!canScrollPrev.value} onClick={scrollPrev.value} {...domProps(props.value)}>
      <Icon name={orientation.value === "horizontal" ? "arrow-left" as const : "arrow-up" as const} />
      <span class="sr-only">Previous slide</span>
    </Button>;
  };
});
const CarouselNext = defineUi<UI.ComponentProps<typeof Button>>("CarouselNext", ["class", "variant", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "outline" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "icon" as const : _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size"]));
  const _hook4 = useCarousel();
  const orientation = computed(() => _hook4.value.orientation);
  const scrollNext = computed(() => _hook4.value.scrollNext);
  const canScrollNext = computed(() => _hook4.value.canScrollNext);
  return () => {
    return <Button data-slot="carousel-next" variant={variant.value} size={size.value} class={cn("absolute size-8", orientation.value === "horizontal" ? "-end-12 top-1/2 -translate-y-1/2" as const : "-bottom-12 left-1/2 -translate-x-1/2" as const, className.value)} disabled={!canScrollNext.value} onClick={scrollNext.value} {...domProps(props.value)}>
      <Icon name={orientation.value === "horizontal" ? "arrow-right" as const : "arrow-down" as const} />
      <span class="sr-only">Next slide</span>
    </Button>;
  };
});
const PITCH = 24;
const Tick = defineUi<{
  index: number;
  selected: boolean;
  slash: boolean;
  onSelect: () => void;
  seed: string;
}>("Tick", ["index", "selected", "slash", "onSelect", "seed"], (_props, {
  slots: _slots
}) => {
  const index = computed(() => _props["index"]);
  const selected = computed(() => _props["selected"]);
  const slash = computed(() => _props["slash"]);
  const onSelect = computed(() => _props["onSelect"]);
  const seed = computed(() => _props["seed"]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: carouselTickRecipe,
    params: {
      slash: slash.value,
      pitch: PITCH
    },
    kind: "tick" as const,
    seed: `${seed.value}|tick${index.value}`,
    pad: slash.value ? CAROUSEL_TICK_PAD : CAROUSEL_TICK_PAD_PLAIN,
    still: true
  }));
  return () => {
    return <button type="button" role="tab" data-slot="carousel-dot" data-index={index.value} aria-selected={selected.value} aria-label={`Go to slide ${index.value + 1}`} tabindex={selected.value ? 0 : -1} ref={hostRef} {...domProps(hostProps.value)} onClick={onSelect.value} class="relative isolate block h-8 w-6 shrink-0 cursor-pointer text-ink">
      {node.value}
    </button>;
  };
});
const CarouselDots = defineUi<UI.ComponentProps<"div">>("CarouselDots", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const _hook2 = useCarousel();
  const snapCount = computed(() => _hook2.value.snapCount);
  const selectedIndex = computed(() => _hook2.value.selectedIndex);
  const scrollTo = computed(() => _hook2.value.scrollTo);
  const seed = computed(() => _hook2.value.seed);
  const list = shallowRef<HTMLDivElement | null | null>(null);
  const focusIn = shallowRef(false);
  watchDependencies(() => {
    if (!focusIn.value) return;
    list.value?.querySelector<HTMLElement>(`[data-slot="carousel-dot"][data-index="${selectedIndex.value}"]`)?.focus();
  }, () => [selectedIndex.value], false);
  return () => {
    if (snapCount.value < 2) return null;
    const groups = Math.ceil(snapCount.value / 5);
    return <div data-slot="carousel-dots" role="tablist" aria-label="Choose a slide" ref={list} onFocus={() => {
      focusIn.value = true;
    }} onBlur={(e: FocusEvent) => {
      focusIn.value = (e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null);
    }} class={cn("-mx-4 -mb-4 flex flex-wrap items-center justify-center gap-x-2 overflow-clip p-4", className.value)} {...domProps(props.value)}>
      {Array.from({
        length: groups
      }, (_, g) => <span key={g} class="flex shrink-0">
          {Array.from({
          length: Math.min(5, snapCount.value - g * 5)
        }, (_, k) => {
          const i = g * 5 + k;
          return <Tick key={i} index={i} selected={i === selectedIndex.value} slash={i % 5 === 4} onSelect={() => scrollTo.value(i)} seed={seed.value} />;
        })}
        </span>)}
    </div>;
  };
});
export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots };
