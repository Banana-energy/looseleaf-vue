// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Doodle } from "@/components/ui/doodle";
import { Mascot, type MascotPose } from "@/components/ui/mascot";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { emptyFrameRecipe, emptyMediaRecipe } from "@/lib/ink/recipes/empty-ink";
import { cn } from "@/lib/utils";
const hasClass = (className: string | undefined, name: string) => !!className && className.split(/\s+/).includes(name);
const Empty = defineUi<UI.ComponentProps<"div"> & {
  seed?: string | number;
}>("Empty", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "seed", "ref", "children"]));
  const framed = computed(() => hasClass(className.value, "border"));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: emptyFrameRecipe,
    params: {},
    kind: "frame" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <div data-slot="empty" ref={useMergedRef<HTMLDivElement>(framed.value ? hostRef : undefined, ref.value)} {...domProps(framed.value && node.value ? hostProps.value : {})} class={cn("relative isolate flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-6 text-center text-balance md:p-12 [.border]:border-transparent", className.value)} {...domProps(props.value)}>
      {framed.value ? node.value : null}
      {readSlot(_slots.default)}
    </div>;
  };
});
const EmptyHeader = defineUi<UI.ComponentProps<"div">>("EmptyHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="empty-header" class={cn("flex max-w-sm flex-col items-center gap-2 text-center", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const emptyMediaVariants = cva("mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-transparent" as const,
      icon: "relative isolate flex size-11 shrink-0 items-center justify-center text-foreground [&_svg:not(.absolute):not([class*='size-'])]:size-6" as const
    }
  },
  defaultVariants: {
    variant: "default" as const
  }
});
const EmptyMedia = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants> & {
  pose?: MascotPose;
  doodle?: string;
  size?: number;
  seed?: string | number;
}>("EmptyMedia", ["class", "variant", "pose", "doodle", "size", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const pose = computed(() => _props["pose"]);
  const doodle = computed(() => _props["doodle"]);
  const size = computed(() => _props["size"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "variant", "pose", "doodle", "size", "seed", "ref", "children"]));
  const tile = computed(() => variant.value === "icon");
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: emptyMediaRecipe,
    params: {},
    kind: "tile" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <div data-slot="empty-icon" data-variant={variant.value} ref={useMergedRef<HTMLDivElement>(tile.value ? hostRef : undefined, ref.value)} {...domProps(tile.value && node.value ? hostProps.value : {})} class={cn(emptyMediaVariants({
      variant: variant.value
    }), className.value)} {...domProps(props.value)}>
      {tile.value ? node.value : null}
      {pose.value ? <Mascot pose={pose.value} size={size.value ?? 96} seed={seed.value} /> : null}
      {doodle.value ? <Doodle name={doodle.value} size={size.value ?? 80} seed={seed.value} /> : null}
      {readSlot(_slots.default)}
    </div>;
  };
});
const EmptyTitle = defineUi<UI.ComponentProps<"div">>("EmptyTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="empty-title" class={cn("font-script text-[1.65rem] leading-none font-semibold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const EmptyDescription = defineUi<UI.ComponentProps<"p">>("EmptyDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="empty-description" class={cn("text-sm/relaxed text-muted-foreground [&>a]:text-link [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link-hover", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const EmptyContent = defineUi<UI.ComponentProps<"div">>("EmptyContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="empty-content" class={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia };
