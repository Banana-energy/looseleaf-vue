// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Separator as SeparatorPrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { separatorRecipe, type SeparatorVariant } from "@/lib/ink/recipes/separator-ink";
import { cn } from "@/lib/utils";
type Orientation = "horizontal" | "vertical";
const Rule = defineUi<UI.ComponentProps<"div"> & {
  variant: SeparatorVariant;
  orientation: Orientation;
  seed?: string | number;
}>("Rule", ["variant", "orientation", "seed", "class"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"]);
  const orientation = computed(() => _props["orientation"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["variant", "orientation", "seed", "class", "children", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: separatorRecipe,
    params: {
      variant: variant.value,
      orientation: orientation.value
    },
    kind: "rule" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <div ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(hostProps.value)} data-variant={variant.value} class={cn("relative isolate shrink-0 bg-pencil-mark/60 outline-hidden data-ink-ready:bg-transparent data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=horizontal]:overflow-x-clip data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px data-[orientation=vertical]:overflow-y-clip", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const Separator = defineUi<Omit<UI.ComponentProps<typeof SeparatorPrimitive.Root>, "asChild"> & {
  variant?: SeparatorVariant;
  seed?: string | number;
}>("Separator", ["class", "orientation", "decorative", "variant", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const decorative = computed(() => _props["decorative"] === undefined ? true : _props["decorative"]);
  const variant = computed(() => _props["variant"] === undefined ? "pencil" as const : _props["variant"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "orientation", "decorative", "variant", "seed", "children"]));
  return () => {
    if (readSlot(_slots.default) === undefined || readSlot(_slots.default) === null || readSlot(_slots.default) === false) {
      return <SeparatorPrimitive.Root data-slot="separator" asChild decorative={decorative.value} orientation={orientation.value} {...domProps(props.value)}>
        <Rule variant={variant.value} orientation={orientation.value} seed={seed.value} class={className.value} />
      </SeparatorPrimitive.Root>;
    }
    const vertical = orientation.value === "vertical";
    return <SeparatorPrimitive.Root data-slot="separator" data-variant={variant.value} decorative={decorative.value} orientation={orientation.value} class={cn("flex shrink-0 items-center gap-3 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col", className.value)} {...domProps(props.value)}>
      <Rule variant={variant.value} orientation={orientation.value} seed={seed.value === undefined ? undefined : `${seed.value}:a`} data-orientation={orientation.value} data-slot="separator-line" class={vertical ? "data-[orientation=vertical]:h-auto flex-1" as const : "data-[orientation=horizontal]:w-auto flex-1" as const} />
      <span data-slot="separator-label" class="shrink-0 font-hand text-sm leading-none font-bold text-muted-foreground select-none">
        {readSlot(_slots.default)}
      </span>
      <Rule variant={variant.value} orientation={orientation.value} seed={seed.value === undefined ? undefined : `${seed.value}:b`} data-orientation={orientation.value} data-slot="separator-line" class={vertical ? "data-[orientation=vertical]:h-auto flex-1" as const : "data-[orientation=horizontal]:w-auto flex-1" as const} />
    </SeparatorPrimitive.Root>;
  };
});
export { Separator };
