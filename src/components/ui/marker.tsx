// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/lib/primitives";
import { useInk } from "@/lib/ink/vue";
import { markerRuleRecipe, type MarkerSide, type MarkerTone } from "@/lib/ink/recipes/marker-ink";
import { cn } from "@/lib/utils";
const markerVariants = cva("group/marker relative flex min-h-4 w-full items-center gap-2 text-start font-hand text-sm text-muted-foreground [&_svg:not([class*='size-']):not(.absolute)]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground", {
  variants: {
    variant: {
      default: "" as const,
      separator: "" as const,
      border: "pb-3" as const
    }
  }
});
const MarkerRule = defineUi<{
  side: MarkerSide;
  tone: MarkerTone;
  seed?: string | number;
  wavy?: boolean;
}>("MarkerRule", ["side", "tone", "seed", "wavy"], (_props, {
  slots: _slots
}) => {
  const side = computed(() => _props["side"]);
  const tone = computed(() => _props["tone"]);
  const seed = computed(() => _props["seed"]);
  const wavy = computed(() => _props["wavy"]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: markerRuleRecipe,
    params: {
      side: side.value,
      tone: tone.value,
      style: wavy.value ? "wavy" as const : "line" as const
    },
    kind: "rule" as const,
    seed: seed.value === undefined ? undefined : `${seed.value}|${side.value}`,
    still: true
  }));
  return () => {
    return <span data-slot="marker-rule" data-side={side.value} ref={hostRef} {...domProps(hostProps.value)} class={cn("relative isolate block h-4 min-w-0 forced-colors:h-2 forced-colors:border-b-2 forced-colors:border-[CanvasText] forced-colors:outline-none!", side.value === "full" ? "absolute inset-x-0 bottom-0" as const : "flex-1" as const)}>
      {node.value}
    </span>;
  };
});
const Marker = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof markerVariants> & {
  asChild?: boolean;
  tone?: "default" | "new";
  rule?: "line" | "wavy";
  seed?: string | number;
}>("Marker", ["class", "variant", "tone", "rule", "seed", "asChild"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const tone = computed(() => _props["tone"] === undefined ? "default" as const : _props["tone"]);
  const rule = computed(() => _props["rule"] === undefined ? "line" as const : _props["rule"]);
  const seed = computed(() => _props["seed"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "variant", "tone", "rule", "seed", "asChild", "children"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "div" as const));
  const t = computed<MarkerTone>(() => tone.value ?? "default");
  const v = computed(() => variant.value ?? "default");
  const inner = renderValue(() => asChild.value ? <Slot.Slottable>{children.value}</Slot.Slottable> : children.value);
  return () => {
    return <Comp.value data-slot="marker" data-variant={v.value} data-tone={t.value === "new" ? "new" as const : undefined} class={cn(markerVariants({
      variant: v.value
    }), className.value)} {...domProps(props.value)}>
      {v.value === "separator" ? <MarkerRule side="start" tone={t.value} seed={seed.value} /> : null}
      {inner.value}
      {v.value === "separator" ? <MarkerRule side="end" tone={t.value} seed={seed.value} /> : null}
      {v.value === "border" ? <MarkerRule side="full" tone={t.value} seed={seed.value} wavy={rule.value === "wavy"} /> : null}
    </Comp.value>;
  };
});
const MarkerIcon = defineUi<UI.ComponentProps<"span">>("MarkerIcon", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <span data-slot="marker-icon" aria-hidden="true" class={cn("size-4 shrink-0 group-data-[tone=new]/marker:text-red [&_svg:not([class*='size-']):not(.absolute)]:size-4", className.value)} {...domProps(props.value)}>{_slots.default?.()}</span>;
  };
});
const MarkerContent = defineUi<UI.ComponentProps<"span">>("MarkerContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <span data-slot="marker-content" class={cn("min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center group-data-[variant=separator]/marker:font-script group-data-[variant=separator]/marker:text-xl group-data-[variant=separator]/marker:leading-none group-data-[tone=new]/marker:ll-swipe group-data-[tone=new]/marker:px-2 group-data-[tone=new]/marker:font-bold *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</span>;
  };
});
export { Marker, MarkerIcon, MarkerContent, markerVariants };
