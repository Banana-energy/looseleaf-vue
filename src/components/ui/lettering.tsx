// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Handwritten } from "@/components/ui/handwritten";
import { cn } from "@/lib/utils";
const SIZE = {
  sm: "text-3xl" as const,
  md: "text-5xl" as const,
  lg: "text-6xl" as const,
  xl: "text-7xl sm:text-8xl" as const,
  hero: "text-7xl sm:text-9xl" as const
} as const;
const TONE = {
  marker: "[--ll-riso:var(--ll-marker)]" as const,
  tomato: "[--ll-riso:var(--ll-tomato)]" as const,
  tangerine: "[--ll-riso:var(--ll-tangerine)]" as const,
  lemon: "[--ll-riso:var(--ll-lemon)]" as const,
  grass: "[--ll-riso:var(--ll-grass)]" as const,
  teal: "[--ll-riso:var(--ll-teal)]" as const,
  sky: "[--ll-riso:var(--ll-sky)]" as const,
  grape: "[--ll-riso:var(--ll-grape)]" as const,
  bubblegum: "[--ll-riso:var(--ll-bubblegum)]" as const
} as const;
const DUOTONE = "[text-shadow:calc(0.055em*var(--ll-misreg-k))_calc(0.045em*var(--ll-misreg-k))_0_var(--ll-riso),calc(-0.035em*var(--ll-misreg-k))_calc(0.07em*var(--ll-misreg-k))_0_var(--ll-riso-b)]";
const Lettering = defineUi<Omit<UI.ComponentProps<"h2">, "ref"> & {
  as?: UI.ElementType;
  size?: keyof typeof SIZE;
  tone?: keyof typeof TONE;
  duotone?: keyof typeof TONE;
  wobble?: number;
  seed?: string | number;
  ref?: UI.Ref<HTMLElement>;
}>("Lettering", ["as", "size", "tone", "duotone", "wobble", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const Comp = computed(() => jsxTag(_props["as"] === undefined ? "h2" as const : _props["as"]));
  const size = computed(() => _props["size"] === undefined ? "lg" as const : _props["size"]);
  const tone = computed(() => _props["tone"] === undefined ? "marker" as const : _props["tone"]);
  const duotone = computed(() => _props["duotone"]);
  const wobble = computed(() => _props["wobble"] === undefined ? 0 : _props["wobble"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["as", "size", "tone", "duotone", "wobble", "seed", "class", "style", "children"]));
  const second = computed(() => duotone.value ? {
    "--ll-riso-b": `var(--ll-${duotone.value})`
  } as UI.CSSProperties : undefined);
  return () => {
    return <Comp.value data-slot="lettering" data-size={size.value} style={cssStyle({
      ...second.value,
      ...style.value
    })} class={cn("ll-riso font-script leading-[0.95] font-bold tracking-tight text-balance text-ink", SIZE[size.value], TONE[tone.value], duotone.value && DUOTONE, className.value)} {...domProps(props.value)}>
      {wobble.value > 0 ? <Handwritten as="span" strength={wobble.value} seed={seed.value}>
          {readSlot(_slots.default)}
        </Handwritten> : readSlot(_slots.default)}
    </Comp.value>;
  };
});
export { Lettering };
