// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { dropShadow, tiltFor } from "@/lib/ink/paper/shadows";
import { tape, type TapeEnds, type TapeKind } from "@/lib/ink/paper/props";
import { PropSvg } from "@/lib/ink/paper/prop-svg";
import { useDensity, useInkSeed, useInkTier } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
type TapeProps = Omit<UI.ComponentProps<"svg">, "children"> & {
  kind?: TapeKind;
  length?: number;
  height?: number;
  angle?: number;
  ends?: TapeEnds;
  color?: "tomato" | "tangerine" | "lemon" | "grass" | "teal" | "sky" | "grape" | "bubblegum";
  seed?: string | number;
};
const Tape = defineUi<TapeProps>("Tape", ["kind", "length", "height", "angle", "ends", "color", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"] === undefined ? "masking" as const : _props["kind"]);
  const length = computed(() => _props["length"] === undefined ? 72 : _props["length"]);
  const height = computed(() => _props["height"] === undefined ? 22 : _props["height"]);
  const angle = computed(() => _props["angle"]);
  const ends = computed(() => _props["ends"]);
  const color = computed(() => _props["color"]);
  const seedProp = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["kind", "length", "height", "angle", "ends", "color", "seed", "class", "style"]));
  const seed = useInkSeed(() => seedProp.value);
  const tier = useInkTier();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const res = computed(() => tape(`${seed.value}|tape`, {
    kind: kind.value,
    length: length.value,
    height: height.value,
    ends: ends.value,
    color: color.value,
    tier: tier.value,
    calm: calm.value
  }));
  const deg = computed(() => angle.value ?? tiltFor(`${seed.value}|tape`, 4));
  return () => {
    return <PropSvg res={res.value} kind="tape" data-slot="tape" data-kind={kind.value} class={cn("pointer-events-none relative z-(--ll-z-prop) block shrink-0", className.value)} style={cssStyle({
      rotate: `clamp(calc(var(--ll-tilt-max) * -2.5), ${deg.value}deg, calc(var(--ll-tilt-max) * 2.5))`,
      filter: dropShadow("tape"),
      ...style.value
    })} {...domProps(props.value)}>{_slots.default?.()}</PropSvg>;
  };
});
export { Tape };
export type { TapeProps };
