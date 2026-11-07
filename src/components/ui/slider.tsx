// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, proxyRefs } from "vue";
import { Direction, Slider as SliderPrimitive } from "@/lib/primitives";
import { useInk, useInkSeed, useMergedRef } from "@/lib/ink/vue";
import { sliderRangeRecipe, sliderThumbRecipe, sliderTrackRecipe, type SliderTone } from "@/lib/ink/recipes/slider-ink";
import { cn } from "@/lib/utils";
const THUMB = 20;
function tickIntervals(ticks: boolean | number | undefined, min: number, max: number, step: number): number {
  if (!ticks) return 0;
  if (typeof ticks === "number") return Math.max(0, Math.min(200, Math.round(ticks)));
  const n = Math.round((max - min) / step);
  return n >= 1 && n <= 20 ? n : 10;
}
function fillWindow(from: number, to: number, thumbAtFrom: boolean, o: {
  vertical: boolean;
  startsLow: boolean;
}): UI.CSSProperties {
  const at = (pct: number, thumb: boolean) => `calc(${thumb ? THUMB / 2 : 0}px + (100% - ${thumb ? THUMB : 0}px) * ${pct / 100})`;
  const a = at(from, thumbAtFrom);
  const b = at(to, true);
  const inset = o.vertical ? o.startsLow ? `calc(100% - ${b}) -12px ${a} -12px` : `${a} -12px calc(100% - ${b}) -12px` : o.startsLow ? `-12px calc(100% - ${b}) -12px ${a}` : `-12px ${a} -12px calc(100% - ${b})`;
  return {
    clipPath: `inset(${inset})`
  };
}
const SliderThumb = defineUi<UI.ComponentProps<typeof SliderPrimitive.Thumb> & {
  seed: string;
  disabled: boolean;
  invalid: boolean;
}>("SliderThumb", ["seed", "disabled", "invalid", "class"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  const disabled = computed(() => _props["disabled"]);
  const invalid = computed(() => _props["invalid"]);
  const className = computed(() => _props["class"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["seed", "disabled", "invalid", "class", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: sliderThumbRecipe,
    params: {
      disabled: disabled.value,
      invalid: invalid.value
    },
    kind: "thumb" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <SliderPrimitive.Thumb data-slot="slider-thumb" ref={useMergedRef<HTMLSpanElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate block size-5 shrink-0 rounded-full outline-hidden transition-transform duration-(--ll-dur-press) ease-out after:absolute after:-inset-1.5 hover:scale-105 active:scale-95 disabled:pointer-events-none", "bg-slip data-ink-ready:bg-transparent forced-colors:rounded-full forced-colors:bg-[ButtonText]", className.value)} {...domProps(props.value)}>
      {node.value}
    </SliderPrimitive.Thumb>;
  };
});
const Slider = defineUi<UI.ComponentProps<typeof SliderPrimitive.Root> & {
  ticks?: boolean | number;
  tone?: SliderTone;
  getValueText?: (value: number, index: number) => string;
  seed?: string | number;
}>("Slider", ["class", "defaultValue", "value", "min", "max", "step", "ticks", "tone", "getValueText", "seed", "onValueChange", "orientation", "inverted", "disabled", "dir", "style", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const defaultValue = computed(() => _props["defaultValue"]);
  const value = computed(() => _props["value"]);
  const min = computed(() => _props["min"] === undefined ? 0 : _props["min"]);
  const max = computed(() => _props["max"] === undefined ? 100 : _props["max"]);
  const step = computed(() => _props["step"] === undefined ? 1 : _props["step"]);
  const ticks = computed(() => _props["ticks"]);
  const tone = computed(() => _props["tone"] === undefined ? "marker" as const : _props["tone"]);
  const getValueText = computed(() => _props["getValueText"]);
  const seedProp = computed(() => _props["seed"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const inverted = computed(() => _props["inverted"] === undefined ? false : _props["inverted"]);
  const disabled = computed(() => _props["disabled"]);
  const dir = computed(() => _props["dir"]);
  const style = computed(() => _props["style"]);
  const ariaLabel = computed(() => _props["aria-label"]);
  const ariaLabelledby = computed(() => _props["aria-labelledby"]);
  const ariaDescribedby = computed(() => _props["aria-describedby"]);
  const ariaInvalid = computed(() => _props["aria-invalid"]);
  const props = computed(() => omitProps(_props, ["class", "defaultValue", "value", "min", "max", "step", "ticks", "tone", "getValueText", "seed", "onValueChange", "orientation", "inverted", "disabled", "dir", "style", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid"]));
  const vertical = computed(() => orientation.value === "vertical");
  const seed = useInkSeed(() => seedProp.value);
  const direction = useLooseleafDirection(() => dir.value);
  const uncontrolled = shallowRef<number[]>(initialState(() => Array.isArray(defaultValue.value) ? defaultValue.value : [min.value]));
  const setUncontrolled = stateSetter(uncontrolled);
  const safeValue = computed(() => Array.isArray(value.value) && value.value.some(v => !Number.isFinite(v)) ? value.value.map(v => Number.isFinite(v) ? v : min.value) : value.value);
  const values = computed(() => Array.isArray(safeValue.value) ? safeValue.value : uncontrolled.value);
  const intervals = computed(() => tickIntervals(ticks.value, min.value, max.value, step.value));
  const isOff = computed(() => !!disabled.value);
  const invalid = computed(() => ariaInvalid.value === true || ariaInvalid.value === "true");
  const _trackCore = useInk(() => ({
    recipe: sliderTrackRecipe,
    params: {
      vertical: vertical.value,
      ticks: intervals.value,
      disabled: isOff.value,
      invalid: invalid.value
    },
    kind: "slider" as const,
    seed: `${seed.value}:track`,
    still: true
  }));
  const track = computed(() => proxyRefs(_trackCore));
  const _rangeCore = useInk(() => ({
    recipe: sliderRangeRecipe,
    params: {
      vertical: vertical.value,
      tone: tone.value,
      disabled: isOff.value
    },
    kind: "slider" as const,
    seed: `${seed.value}:range`,
    still: true
  }));
  const range = computed(() => proxyRefs(_rangeCore));
  const span = computed(() => max.value - min.value || 1);
  const pct = computed(() => values.value.map(v => Math.min(100, Math.max(0, (v - min.value) / span.value * 100))));
  const multi = computed(() => pct.value.length > 1);
  const from = computed(() => multi.value ? Math.min(...pct.value) : 0);
  const to = computed(() => pct.value.length ? Math.max(...pct.value) : 0);
  const startsLow = computed(() => vertical.value ? !inverted.value : direction.value === "ltr" !== inverted.value);
  const window = computed(() => fillWindow(from.value, to.value, multi.value, {
    vertical: vertical.value,
    startsLow: startsLow.value
  }));
  return () => {
    return <SliderPrimitive.Root data-slot="slider" defaultValue={defaultValue.value} value={safeValue.value} min={min.value} max={max.value} step={step.value} orientation={orientation.value} inverted={inverted.value} disabled={disabled.value} dir={dir.value} {...domProps(multi.value ? {
      role: "group" as const,
      "aria-label": ariaLabel.value,
      "aria-labelledby": ariaLabelledby.value,
      "aria-describedby": ariaDescribedby.value
    } : {})} onValueChange={v => {
      if (!Array.isArray(value.value)) setUncontrolled(v);
      onValueChange.value?.(v);
    }} style={cssStyle(style.value)} class={cn("relative flex w-full touch-none items-center select-none data-[orientation=horizontal]:min-h-6 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:min-w-6 data-[orientation=vertical]:flex-col", className.value)} {...domProps(props.value)}>
      <SliderPrimitive.Track data-slot="slider-track" ref={track.value.hostRef} {...domProps(track.value.hostProps)} class="relative isolate grow bg-paper-shade outline-hidden data-ink-ready:bg-transparent forced-colors:border forced-colors:border-[ButtonText] data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2">
        {track.value.node}
        <SliderPrimitive.Range data-slot="slider-range" ref={range.value.hostRef} {...domProps(range.value.hostProps)} style={cssStyle(window.value)} class="absolute isolate bg-marker/70 outline-hidden data-ink-ready:bg-transparent forced-colors:bg-[Highlight] data-[orientation=horizontal]:inset-x-0! data-[orientation=horizontal]:inset-y-0 data-[orientation=vertical]:inset-x-0 data-[orientation=vertical]:inset-y-0!">
          {range.value.node}
        </SliderPrimitive.Range>
      </SliderPrimitive.Track>
      {values.value.map((_, index) => <SliderThumb key={index} seed={`${seed.value}:thumb${index}`} disabled={isOff.value} invalid={invalid.value} aria-invalid={ariaInvalid.value} aria-valuetext={getValueText.value?.(values.value[index], index)} {...domProps(multi.value ? {} : {
        "aria-label": ariaLabel.value,
        "aria-labelledby": ariaLabelledby.value,
        "aria-describedby": ariaDescribedby.value
      })} />)}
    </SliderPrimitive.Root>;
  };
});
export { Slider };
