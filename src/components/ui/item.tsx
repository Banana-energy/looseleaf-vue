// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Separator as SeparatorPrimitive, Slot } from "@/lib/primitives";
import { Separator } from "@/components/ui/separator";
import { useInkSeed } from "@/lib/ink/vue";
import { hashSeed } from "@/lib/ink/rng";
import { ITEM_FRAMES, itemCss } from "@/lib/ink/recipes/item-ink";
import { cn } from "@/lib/utils";
const InList = createContext(false);
const ItemStyles = defineUi<{}>("ItemStyles", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <style>
      {itemCss()}
    </style>;
  };
});
const ItemGroup = defineUi<UI.ComponentProps<"div"> & {
  ruled?: boolean;
}>("ItemGroup", ["class", "ruled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const ruled = computed(() => _props["ruled"] === undefined ? false : _props["ruled"]);
  const props = computed(() => omitProps(_props, ["class", "ruled"]));
  return () => {
    return <InList.Provider value>
      <ItemStyles />
      <div role="list" data-slot="item-group" data-ruled={ruled.value ? "" as const : undefined} class={cn("group/item-group flex flex-col", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>
    </InList.Provider>;
  };
});
const ItemSeparator = defineUi<UI.ComponentProps<typeof Separator>>("ItemSeparator", ["class", "variant", "seed", "decorative", "orientation"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "pencil" as const : _props["variant"]);
  const seed = computed(() => _props["seed"]);
  const decorative = computed(() => _props["decorative"] === undefined ? true : _props["decorative"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "variant", "seed", "decorative", "orientation", "children"]));
  const _nestedHook0 = useInkSeed(() => seed.value);
  const frame = computed(() => hashSeed(_nestedHook0.value) % ITEM_FRAMES);
  return () => {
    if (variant.value !== "pencil" || orientation.value !== "horizontal" || readSlot(_slots.default)) {
      return <Separator data-slot="item-separator" orientation={orientation.value} variant={variant.value} seed={seed.value} decorative={decorative.value} class={cn("my-0", className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </Separator>;
    }
    return <SeparatorPrimitive.Root data-slot="item-separator" data-variant="pencil" data-frame={frame.value} decorative={decorative.value} orientation="horizontal" class={cn("my-0 h-px w-full shrink-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</SeparatorPrimitive.Root>;
  };
});
const itemVariants = cva("group/item flex flex-wrap items-center font-hand text-[15px] outline-offset-2 focus-visible:outline-2 focus-visible:outline-focus [&:is(a,button)]:cursor-pointer [&:is(a,button)]:transition-colors [&:is(a,button)]:duration-(--ll-dur-hover) [&:is(a,button)]:hover:ll-swipe", {
  variants: {
    variant: {
      default: "" as const,
      outline: "" as const,
      muted: "" as const
    },
    size: {
      default: "gap-4 p-4 compact:p-3 calm:p-2.5" as const,
      sm: "gap-2.5 px-4 py-3 compact:px-3 compact:py-2.5 calm:py-2" as const
    }
  },
  defaultVariants: {
    variant: "default" as const,
    size: "default" as const
  }
});
const Item = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof itemVariants> & {
  asChild?: boolean;
  seed?: string | number;
}>("Item", ["class", "variant", "size", "asChild", "seed", "role"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const seed = computed(() => _props["seed"]);
  const role = computed(() => _props["role"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size", "asChild", "seed", "role"]));
  const inList = useContext(InList);
  const _nestedHook0 = useInkSeed(() => seed.value);
  const frame = computed(() => hashSeed(_nestedHook0.value) % ITEM_FRAMES);
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "div" as const));
  const row = renderValue(() => <Comp.value data-slot="item" data-variant={variant.value} data-size={size.value} data-frame={frame.value} role={inList.value && asChild.value && role.value === "listitem" ? undefined : role.value ?? (inList.value && !asChild.value ? "listitem" as const : undefined)} class={cn(itemVariants({
    variant: variant.value,
    size: size.value,
    className: className.value
  }))} {...domProps(props.value)} />);
  const inner = renderValue(() => <InList.Provider value={false}>{row.value}</InList.Provider>);
  return () => {
    return <>
      {inList.value ? null : <ItemStyles />}
      {inList.value && asChild.value ? <div role="listitem" class="flex flex-col">
          {inner.value}
        </div> : inner.value}
    </>;
  };
});
const itemMediaVariants = cva("flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none", {
  variants: {
    variant: {
      default: "bg-transparent" as const,
      icon: "size-9 [&_svg:not([class*='size-'])]:size-4" as const,
      image: "size-10 overflow-hidden bg-photo p-0.5 shadow-hair group-odd/item:-rotate-1 group-even/item:rotate-[.8deg] calm:rotate-0 [&_img]:size-full [&_img]:object-cover" as const
    }
  },
  defaultVariants: {
    variant: "default" as const
  }
});
const ItemMedia = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants> & {
  seed?: string | number;
}>("ItemMedia", ["class", "variant", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "seed"]));
  const _nestedHook0 = useInkSeed(() => seed.value);
  const frame = computed(() => hashSeed(_nestedHook0.value) % ITEM_FRAMES);
  return () => {
    return <div data-slot="item-media" data-variant={variant.value} data-frame={frame.value} class={cn(itemMediaVariants({
      variant: variant.value,
      className: className.value
    }))} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const ItemContent = defineUi<UI.ComponentProps<"div">>("ItemContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="item-content" class={cn("flex min-w-0 flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const ItemTitle = defineUi<UI.ComponentProps<"div">>("ItemTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="item-title" class={cn("flex w-fit items-center gap-2 text-base leading-snug font-bold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const ItemDescription = defineUi<UI.ComponentProps<"p">>("ItemDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <p data-slot="item-description" class={cn("line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground", "[&>a]:text-link [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link-hover", className.value)} {...domProps(props.value)}>{_slots.default?.()}</p>;
  };
});
const ItemActions = defineUi<UI.ComponentProps<"div">>("ItemActions", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="item-actions" class={cn("flex items-center gap-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const ItemHeader = defineUi<UI.ComponentProps<"div">>("ItemHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="item-header" class={cn("flex basis-full items-center justify-between gap-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const ItemFooter = defineUi<UI.ComponentProps<"div">>("ItemFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="item-footer" class={cn("flex basis-full items-center justify-between gap-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemHeader, ItemFooter };
