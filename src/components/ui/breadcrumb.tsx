// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Slot } from "@/lib/primitives";
import { Icon } from "@/components/ui/icon";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { breadcrumbPageRecipe } from "@/lib/ink/recipes/breadcrumb-ink";
import { cn } from "@/lib/utils";
const Breadcrumb = defineUi<UI.ComponentProps<"nav">>("Breadcrumb", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...domProps(props.value)}>{_slots.default?.()}</nav>;
  };
});
const BreadcrumbList = defineUi<UI.ComponentProps<"ol">>("BreadcrumbList", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <ol data-slot="breadcrumb-list" class={cn("flex flex-wrap items-center gap-1.5 font-hand text-base leading-6 break-words text-muted-foreground sm:gap-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</ol>;
  };
});
const BreadcrumbItem = defineUi<UI.ComponentProps<"li">>("BreadcrumbItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <li data-slot="breadcrumb-item" class={cn("inline-flex items-center gap-1.5", className.value)} {...domProps(props.value)}>{_slots.default?.()}</li>;
  };
});
const BreadcrumbLink = defineUi<UI.ComponentProps<"a"> & {
  asChild?: boolean;
}>("BreadcrumbLink", ["asChild", "class"], (_props, {
  slots: _slots
}) => {
  const asChild = computed(() => _props["asChild"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["asChild", "class"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "a" as const));
  return () => {
    return <Comp.value data-slot="breadcrumb-link" class={cn("-mx-1 px-1 transition-colors hover:ll-swipe focus-visible:ll-swipe", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Comp.value>;
  };
});
const BreadcrumbPage = defineUi<UI.ComponentProps<"span"> & {
  seed?: string | number;
}>("BreadcrumbPage", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "seed", "ref", "children"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: breadcrumbPageRecipe,
    params: {},
    kind: "crumb" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" ref={useMergedRef<HTMLSpanElement>(hostRef, ref.value)} {...domProps(node.value ? hostProps.value : {})} class={cn("relative isolate inline-block px-0.5 pb-1 font-bold text-foreground", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </span>;
  };
});
const BreadcrumbSeparator = defineUi<UI.ComponentProps<"li">>("BreadcrumbSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["children", "class"]));
  return () => {
    return <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" class={cn("text-pencil-mark [&>svg:not(.absolute):not([class*='size-'])]:size-4", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? <Icon name="slash" size={16} />}
    </li>;
  };
});
const BreadcrumbEllipsis = defineUi<UI.ComponentProps<"span">>("BreadcrumbEllipsis", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" class={cn("flex size-9 items-center justify-center", className.value)} {...domProps(props.value)}>
      <Icon name="ellipsis" size={16} />
      <span class="sr-only">More</span>
    </span>;
  };
});
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
