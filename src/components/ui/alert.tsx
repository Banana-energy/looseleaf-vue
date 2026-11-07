// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Paper } from "@/components/ui/paper";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { alertRecipe, type AlertTone } from "@/lib/ink/recipes/alert-ink";
import { cn } from "@/lib/utils";
const alertVariants = cva("relative isolate grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 px-4 py-3 text-sm compact:py-2.5 calm:px-3 calm:py-2 has-[>svg:not(.absolute)]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg:not(.absolute)]:gap-x-3 [&>svg:not(.absolute)]:size-4 [&>svg:not(.absolute)]:translate-y-0.5 [&>svg:not(.absolute)]:text-current [&:not(:has(>svg:not(.absolute)))>svg_[data-part=icon-mark]]:hidden", {
  variants: {
    variant: {
      default: "text-card-foreground" as const,
      destructive: "text-destructive *:data-[slot=alert-description]:text-destructive [&>svg:not(.absolute)]:text-current" as const,
      info: "text-card-foreground [&>svg:not(.absolute)]:text-ink-you" as const,
      success: "text-card-foreground [&>svg:not(.absolute)]:text-green" as const,
      warning: "text-card-foreground" as const,
      note: "px-5 py-4 text-ink *:data-[slot=alert-description]:text-ink-soft" as const
    }
  },
  defaultVariants: {
    variant: "default" as const
  }
});
const Alert = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof alertVariants> & {
  seed?: string | number;
}>("Alert", ["class", "variant", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "variant", "seed", "ref", "children"]));
  const tone = computed<AlertTone>(() => variant.value ?? "default");
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: alertRecipe,
    params: {
      tone: tone.value
    },
    kind: "alert" as const,
    seed: seed.value,
    still: true
  }));
  const merged = computed(() => useMergedRef<HTMLDivElement>(hostRef, ref.value));
  return () => {
    if (tone.value === "note") {
      return <Paper data-slot="alert" role="alert" stock="sticky-yellow" tape="corner" seed={seed.value} ref={ref.value as UI.Ref<HTMLElement> | undefined} class={cn(alertVariants({
        variant: variant.value
      }), className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </Paper>;
    }
    return <div data-slot="alert" data-variant={tone.value} role="alert" ref={merged.value} {...domProps(hostProps.value)} class={cn(alertVariants({
      variant: variant.value
    }), className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const AlertTitle = defineUi<UI.ComponentProps<"div">>("AlertTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="alert-title" class={cn("col-start-2 line-clamp-1 min-h-4 font-bold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const AlertDescription = defineUi<UI.ComponentProps<"div">>("AlertDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="alert-description" class={cn("col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Alert, AlertTitle, AlertDescription };
