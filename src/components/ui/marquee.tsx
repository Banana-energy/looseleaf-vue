// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Doodle } from "@/components/ui/doodle";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { marqueeBandRecipe, marqueeControlRecipe } from "@/lib/ink/recipes/marquee-ink";
import type { Accent, TapeKind } from "@/lib/ink/paper/props";
import { clamp } from "@/lib/ink/rng";
import { cn } from "@/lib/utils";
const CSS = `@keyframes ll-marquee{to{transform:translateX(var(--ll-marquee-shift,-50%))}}
@keyframes ll-marquee-rtl{to{transform:translateX(calc(var(--ll-marquee-shift,-50%)*-1))}}
[data-slot=marquee-track]{animation:ll-marquee var(--ll-marquee-dur,30s) linear infinite}
[dir=rtl] [data-slot=marquee-track]{animation-name:ll-marquee-rtl}
[data-slot=marquee-track]:dir(rtl){animation-name:ll-marquee-rtl}
[data-slot=marquee][data-direction=reverse] [data-slot=marquee-track]{animation-direction:reverse}
[data-slot=marquee]:hover [data-slot=marquee-track],[data-slot=marquee]:focus-within [data-slot=marquee-track],[data-slot=marquee][data-paused] [data-slot=marquee-track]{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){[data-slot=marquee-track]{animation:none}[data-slot=marquee-group][data-copy]{display:none}[data-slot=marquee-viewport]{justify-content:center;justify-content:safe center}}
[data-motion=reduced] [data-slot=marquee-track]{animation:none}
[data-motion=reduced] [data-slot=marquee-group][data-copy]{display:none}
[data-motion=reduced] [data-slot=marquee-viewport]{justify-content:center;justify-content:safe center}`;
const MAX_COPIES = 48;
interface MarqueeContextValue {
  paused: boolean;
  toggle(): void;
}
const MarqueeContext = createContext<MarqueeContextValue | null>(null);
type MarqueeProps = Omit<UI.ComponentProps<"div">, "onChange"> & {
  label?: string;
  speed?: number;
  direction?: "start" | "end";
  tape?: TapeKind;
  color?: Accent;
  paused?: boolean;
  defaultPaused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  controls?: boolean;
  seed?: string | number;
};
const Marquee = defineUi<MarqueeProps>("Marquee", ["class", "label", "speed", "direction", "tape", "color", "paused", "defaultPaused", "onPausedChange", "controls", "seed", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const label = computed(() => _props["label"] === undefined ? "Ticker" as const : _props["label"]);
  const speed = computed(() => _props["speed"] === undefined ? 60 : _props["speed"]);
  const direction = computed(() => _props["direction"] === undefined ? "start" as const : _props["direction"]);
  const tape = computed(() => _props["tape"] === undefined ? "washi-stripes" as const : _props["tape"]);
  const color = computed(() => _props["color"]);
  const pausedProp = computed(() => _props["paused"]);
  const defaultPaused = computed(() => _props["defaultPaused"] === undefined ? false : _props["defaultPaused"]);
  const onPausedChange = computed(() => _props["onPausedChange"]);
  const controls = computed(() => _props["controls"] === undefined ? true : _props["controls"]);
  const seed = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "label", "speed", "direction", "tape", "color", "paused", "defaultPaused", "onPausedChange", "controls", "seed", "style"]));
  const inner = shallowRef(initialState(defaultPaused.value));
  const setInner = stateSetter(inner);
  const paused = computed(() => pausedProp.value ?? inner.value);
  const copies = shallowRef(initialState(2));
  const setCopies = stateSetter(copies);
  const dur = shallowRef(initialState(30));
  const setDur = stateSetter(dur);
  const viewport = shallowRef<HTMLDivElement | null | null>(null);
  const group = shallowRef<HTMLDivElement | null | null>(null);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: marqueeBandRecipe,
    params: {
      kind: tape.value,
      color: color.value
    },
    kind: "marquee-band" as const,
    seed: seed.value
  }));
  const ctx = computed<MarqueeContextValue>(() => ({
    paused: paused.value,
    toggle: () => {
      if (pausedProp.value === undefined) setInner(!paused.value);
      onPausedChange.value?.(!paused.value);
    }
  }));
  watchDependencies(() => {
    const v = viewport.value,
      g = group.value;
    if (!v || !g) return;
    const measure = () => {
      const gw = g.offsetWidth,
        vw = v.offsetWidth;
      if (!(gw > 0)) return;
      setCopies(clamp(Math.ceil(vw / gw) + 1, 2, MAX_COPIES));
      setDur(Math.max(4, gw / Math.max(1, speed.value)));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(v);
    ro.observe(g);
    return () => ro.disconnect();
  }, () => [speed.value], true);
  return () => {
    return <MarqueeContext.Provider value={ctx.value}>
      <style>
        {CSS}
      </style>
      <div data-slot="marquee" data-direction={direction.value === "end" ? "reverse" as const : undefined} data-paused={paused.value ? "" as const : undefined} role="marquee" aria-label={label.value} ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate block h-11 w-full overflow-x-clip", className.value)} style={cssStyle({
        "--ll-marquee-shift": `${-100 / copies.value}%`,
        "--ll-marquee-dur": `${dur.value.toFixed(2)}s`,
        ...style.value
      } as UI.CSSProperties)} {...domProps(props.value)}>
        {node.value}
        <div ref={viewport} data-slot="marquee-viewport" class={cn("absolute inset-y-0 start-3 flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]", controls.value ? "end-11" as const : "end-3" as const)}>
          <div data-slot="marquee-track" class="flex w-max shrink-0 items-center">
            {Array.from({
              length: copies.value
            }, (_, i) => <div key={i} ref={i === 0 ? group : undefined} data-slot="marquee-group" data-copy={i ? "" as const : undefined} aria-hidden={i ? true : undefined} inert={i ? true : undefined} class="flex shrink-0 items-center font-script text-2xl leading-none font-semibold whitespace-nowrap text-ink [text-shadow:0_0_2px_var(--ll-slip),0_0_5px_var(--ll-slip)]">
                {readSlot(_slots.default)}
              </div>)}
          </div>
        </div>
        {controls.value ? <MarqueeControl /> : null}
      </div>
    </MarqueeContext.Provider>;
  };
});
const MarqueeItem = defineUi<UI.ComponentProps<"span"> & {
  separator?: UI.ReactNode | false;
}>("MarqueeItem", ["class", "separator"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const separator = computed(() => _props["separator"]);
  const props = computed(() => omitProps(_props, ["class", "children", "separator"]));
  return () => {
    return <span data-slot="marquee-item" class={cn("inline-flex items-center gap-4 pe-4", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      {separator.value === false ? null : separator.value ?? <Doodle name="star" size={24} class="-mt-0.5 opacity-90" />}
    </span>;
  };
});
const MarqueeControl = defineUi<UI.ComponentProps<"button"> & {
  seed?: string | number;
}>("MarqueeControl", ["class", "seed", "onClick"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["class", "seed", "ref", "onClick"]));
  const ctx = useContext(MarqueeContext);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: marqueeControlRecipe,
    params: {
      paused: ctx.value.paused
    },
    kind: "marquee-control" as const,
    size: [28, 28],
    seed: seed.value
  }));
  return () => {
    if (!ctx.value) console.error("MarqueeControl must be used inside <Marquee>");
    return <button type="button" data-slot="marquee-control" aria-label="Pause ticker" aria-pressed={ctx.value.paused} ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} onClick={(e: PointerEvent) => {
      onClick.value?.(e);
      if (!e.defaultPrevented) ctx.value.toggle();
    }} class={cn("absolute end-2 top-1/2 z-(--ll-z-raised) size-7 -translate-y-1/2 cursor-pointer", className.value)} {...domProps(props.value)}>
      {node.value}
    </button>;
  };
});
export { Marquee, MarqueeItem, MarqueeControl };
export type { MarqueeProps };
