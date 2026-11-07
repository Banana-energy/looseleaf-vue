// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Slot } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { RIBBON_SIZES, ribbonDrop, ribbonGutter, ribbonInset, ribbonRecipe, ribbonSizeList, ribbonToneList, ribbonVariantList, type RibbonSize, type RibbonTone, type RibbonVariant } from "@/lib/ink/recipes/ribbon-ink";
import { cn } from "@/lib/utils";
type RibbonProps = Omit<UI.ComponentProps<"span">, "color"> & {
  variant?: RibbonVariant;
  tone?: RibbonTone;
  size?: RibbonSize;
  asChild?: boolean;
  seed?: string | number;
};
const Ribbon = defineUi<RibbonProps>("Ribbon", ["class", "variant", "tone", "size", "asChild", "seed", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "banner" as const : _props["variant"]);
  const tone = computed(() => _props["tone"] === undefined ? "marker" as const : _props["tone"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const seed = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "tone", "size", "asChild", "seed", "style", "children", "ref"]));
  const S = computed(() => RIBBON_SIZES[size.value]);
  const inset = computed(() => ribbonInset(variant.value, size.value));
  const drop = computed(() => ribbonDrop(variant.value, size.value));
  const interactive = computed(() => asChild.value || props.value.onClick !== undefined || (props.value as {
    href?: string;
  }).href !== undefined);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: ribbonRecipe,
    params: {
      variant: variant.value,
      tone: tone.value,
      size: size.value,
      hoverable: interactive.value
    },
    kind: "ribbon" as const,
    seed: seed.value
  }));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "span" as const));
  const pad = computed(() => inset.value + ribbonGutter(variant.value));
  return () => {
    return <Comp.value data-slot="ribbon" data-variant={variant.value} data-tone={tone.value} ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(hostProps.value)} class={cn("relative isolate inline-flex items-center justify-center gap-1.5 font-hand font-bold whitespace-nowrap text-ink transition-[translate] duration-(--ll-dur-hover) ease-(--ll-ease-settle)", S.value.text, "[&_svg:not(.absolute):not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", interactive.value && "cursor-pointer hover:-translate-y-px", className.value)} style={cssStyle({
      height: S.value.band + drop.value,
      paddingInline: pad.value,
      paddingBottom: drop.value,
      minWidth: 2 * inset.value + 24,
      ...style.value
    })} {...domProps(props.value)}>
      <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
      {node.value}
    </Comp.value>;
  };
});
export { Ribbon, ribbonVariantList, ribbonToneList, ribbonSizeList };
export type { RibbonProps };
