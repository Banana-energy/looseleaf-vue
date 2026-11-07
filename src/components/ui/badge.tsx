// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/lib/primitives";
import { IconSizeProvider, useInk, useMergedRef } from "@/lib/ink/vue";
import { badgeRecipe, tallyWidth, type BadgeTone } from "@/lib/ink/recipes/badge-ink";
import { cn } from "@/lib/utils";
const badgeVariants = cva("relative isolate inline-flex w-fit shrink-0 items-center justify-center gap-1 font-hand font-bold whitespace-nowrap select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(.absolute):not([class*='size-'])]:size-3.5", {
  variants: {
    variant: {
      default: "text-primary-foreground" as const,
      secondary: "text-secondary-foreground" as const,
      destructive: "text-paper" as const,
      outline: "text-foreground" as const,
      ghost: "text-foreground" as const,
      link: "text-link hover:text-link-hover" as const
    },
    size: {
      sm: "h-5 px-2 text-[13px] leading-none [&:is(a,button)]:after:absolute [&:is(a,button)]:after:inset-x-0 [&:is(a,button)]:after:-inset-y-0.5 has-[>svg:not(.absolute)]:ps-1.5 [&_svg:not(.absolute):not([class*='size-'])]:size-3" as const,
      default: "h-6 px-2.5 text-sm leading-none has-[>svg:not(.absolute)]:ps-2 calm:h-5 calm:[&:is(a,button)]:after:absolute calm:[&:is(a,button)]:after:inset-x-0 calm:[&:is(a,button)]:after:-inset-y-0.5" as const,
      lg: "h-7 px-3 text-base leading-none has-[>svg:not(.absolute)]:ps-2.5 [&_svg:not(.absolute):not([class*='size-'])]:size-4" as const
    }
  },
  defaultVariants: {
    variant: "default" as const,
    size: "default" as const
  }
});
const BADGE_H = {
  sm: 20,
  default: 24,
  lg: 28
} as const;
const ICON_PX = {
  sm: 12,
  default: 14,
  lg: 16
} as const;
const TALLY_MAX = 20;
const Badge = defineUi<UI.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & {
  asChild?: boolean;
  tone?: BadgeTone;
  count?: number;
  max?: number;
  tally?: boolean;
  seed?: string | number;
}>("Badge", ["class", "variant", "size", "tone", "count", "max", "tally", "asChild", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"]);
  const size = computed(() => _props["size"]);
  const tone = computed(() => _props["tone"]);
  const count = computed(() => _props["count"]);
  const max = computed(() => _props["max"] === undefined ? 99 : _props["max"]);
  const tally = computed(() => _props["tally"] === undefined ? false : _props["tally"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size", "tone", "count", "max", "tally", "asChild", "seed", "children", "ref"]));
  const v = computed(() => variant.value ?? "default");
  const s = computed(() => size.value ?? "default");
  const tallied = computed(() => !asChild.value && tally.value && count.value !== undefined && count.value > 0 && count.value <= TALLY_MAX);
  const hoverable = computed(() => asChild.value || typeof props.value.onClick === "function");
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: badgeRecipe,
    params: {
      variant: v.value,
      size: s.value,
      tone: tone.value,
      tally: tallied.value ? count.value : undefined,
      hoverable: hoverable.value
    },
    kind: "chip" as const,
    seed: seed.value
  }));
  const mergedRef = computed(() => useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined));
  const shared = computed(() => ({
    "data-variant": v.value,
    "data-size": s.value,
    ref: mergedRef.value,
    ...hostProps.value,
    ...props.value
  }));
  const iconPx = computed(() => ICON_PX[s.value]);
  return () => {
    if (asChild.value) {
      return <IconSizeProvider value={iconPx.value}>
        <Slot.Root data-slot="badge" {...domProps(shared.value)} class={cn(badgeVariants({
          variant: v.value,
          size: s.value
        }), className.value)}>
          <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
          {node.value}
        </Slot.Root>
      </IconSizeProvider>;
    }
    const shown = readSlot(_slots.default) ?? (count.value === undefined ? undefined : count.value > max.value ? `${max.value}+` : String(count.value));
    return <IconSizeProvider value={iconPx.value}>
      <span data-slot="badge" {...domProps(shared.value)} class={cn(badgeVariants({
        variant: v.value,
        size: s.value
      }), count.value !== undefined && "ll-num min-w-6 px-1.5", className.value)}>
        {node.value}
        {tallied.value ? <>
            <span class="sr-only">{shown}</span>
            <span aria-hidden="true" data-slot="badge-tally" class="inline-block h-full" style={cssStyle({
            width: tallyWidth(count.value, BADGE_H[s.value])
          })} />
          </> : shown}
      </span>
    </IconSizeProvider>;
  };
});
export { Badge, badgeVariants };
