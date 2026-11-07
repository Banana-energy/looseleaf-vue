// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Slot } from "@/lib/primitives";
import { useShapedSheet } from "@/hooks/use-paper-object";
import type { Accent } from "@/lib/ink/paper/props";
import type { StockName } from "@/lib/ink/paper/stocks";
import { labelTagRecipe, TAG, type TagShape } from "@/lib/ink/recipes/label-tag-ink";
import { cn } from "@/lib/utils";
type LabelTagProps = UI.ComponentProps<"div"> & {
  asChild?: boolean;
  stock?: StockName;
  shape?: TagShape;
  string?: number;
  twine?: "natural" | Accent;
  eyelet?: "brass" | "steel" | "none";
  tilt?: boolean | number;
  seed?: string | number;
  size?: readonly [number, number];
};
const LabelTag = defineUi<LabelTagProps>("LabelTag", ["class", "style", "asChild", "stock", "shape", "string", "twine", "eyelet", "tilt", "seed", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const asChild = computed(() => _props["asChild"]);
  const stock = computed(() => _props["stock"] === undefined ? "kraft" as const : _props["stock"]);
  const shape = computed(() => _props["shape"] === undefined ? "price" as const : _props["shape"]);
  const string = computed(() => _props["string"] === undefined ? 36 : _props["string"]);
  const twine = computed(() => _props["twine"] === undefined ? "natural" as const : _props["twine"]);
  const eyelet = computed(() => _props["eyelet"] === undefined ? "brass" as const : _props["eyelet"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "style", "children", "ref", "asChild", "stock", "shape", "string", "twine", "eyelet", "tilt", "seed", "size"]));
  const o = useShapedSheet(() => ({
    recipe: labelTagRecipe,
    params: {
      stock: stock.value,
      shape: shape.value,
      string: string.value,
      twine: twine.value,
      eyelet: eyelet.value
    },
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 2,
    size: size.value,
    still: !asChild.value
  }));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "div" as const));
  const horizontal = computed(() => shape.value === "luggage");
  const pad = computed(() => string.value + 14);
  const pivot = computed(() => horizontal.value ? `${pad.value + TAG.eyelet + 2}px 50%` : `50% ${pad.value + (shape.value === "round" ? TAG.eyelet + 2 : TAG.eyelet)}px`);
  const pivotRtl = computed(() => horizontal.value ? `calc(100% - ${pad.value + TAG.eyelet + 2}px) 50%` : pivot.value);
  return () => {
    return <Comp.value data-slot="label-tag" data-shape={shape.value} {...domProps(o.value.root)} {...domProps(props.value)} class={cn("relative isolate break-words text-ink [&>:is(svg,[data-slot=paper-face])]:[transform-origin:var(--tag-origin)] rtl:[&>:is(svg,[data-slot=paper-face])]:[transform-origin:var(--tag-origin-rtl)]", horizontal.value ? "ms-(--tag-string) flex h-24 min-w-44 items-center gap-2 py-3 ps-11 pe-5" as const : "mt-(--tag-string) flex w-32 min-h-40 flex-col gap-1 px-3 pt-11 pb-4" as const, shape.value === "round" && "pt-12", !o.value.ready && "bg-index-card shadow-card", asChild.value && "cursor-pointer hover:[&>:is(svg,[data-slot=paper-face])]:[rotate:var(--ll-hover-tilt)]", className.value)} style={cssStyle({
      ...o.value.root.style,
      "--tag-string": `${string.value}px`,
      "--tag-origin": pivot.value,
      "--tag-origin-rtl": pivotRtl.value,
      ...(asChild.value ? {
        "--ll-hover-tilt": "-2.6deg" as const
      } : null),
      ...style.value
    } as UI.CSSProperties)}>
      <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
      {o.value.node}
    </Comp.value>;
  };
});
const LabelTagTitle = defineUi<UI.ComponentProps<"div">>("LabelTagTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="label-tag-title" class={cn("font-script text-[1.65rem] leading-none font-bold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const LabelTagDescription = defineUi<UI.ComponentProps<"div">>("LabelTagDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="label-tag-description" class={cn("text-sm leading-tight text-ink-soft", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const LabelTagPrice = defineUi<UI.ComponentProps<"div">>("LabelTagPrice", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="label-tag-price" class={cn("ll-num mt-auto font-type text-xl leading-none text-[color-mix(in_srgb,var(--ll-red)_60%,var(--ll-ink))]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { LabelTag, LabelTagTitle, LabelTagDescription, LabelTagPrice };
export type { LabelTagProps };
