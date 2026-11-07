// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useChatAlign } from "@/lib/chat-align";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { bubbleReactionsRecipe, bubbleRecipe, type BubbleVariant } from "@/lib/ink/recipes/bubble-ink";
import { cn } from "@/lib/utils";
type BubbleShape = "cloud" | "note" | "sticky";
type BubblePen = "ink" | "you";
type BubbleState = {
  variant: BubbleVariant;
  align: "start" | "end";
  shape: BubbleShape;
  pen: BubblePen;
};
const BubbleContext = createContext<BubbleState>({
  variant: "default" as const,
  align: "start" as const,
  shape: "cloud" as const,
  pen: "ink" as const
});
const BubbleGroup = defineUi<UI.ComponentProps<"div">>("BubbleGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="bubble-group" class={cn("flex min-w-0 flex-col gap-2 [&>[data-slot=bubble]:not(:last-child)_[data-part=tail]]:hidden", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const bubbleVariants = cva("group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full", {
  variants: {
    variant: {
      default: "" as const,
      secondary: "" as const,
      muted: "" as const,
      tinted: "" as const,
      outline: "" as const,
      ghost: "" as const,
      destructive: "" as const
    }
  },
  defaultVariants: {
    variant: "default" as const
  }
});
const Bubble = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof bubbleVariants> & {
  align?: "start" | "end";
  shape?: BubbleShape;
  pen?: BubblePen;
  tail?: boolean;
}>("Bubble", ["variant", "align", "shape", "pen", "tail", "class"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const align = computed(() => _props["align"]);
  const shape = computed(() => _props["shape"] === undefined ? "cloud" as const : _props["shape"]);
  const pen = computed(() => _props["pen"] === undefined ? "ink" as const : _props["pen"]);
  const tail = computed(() => _props["tail"] === undefined ? true : _props["tail"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["variant", "align", "shape", "pen", "tail", "class"]));
  const inherited = useChatAlign();
  const a = computed(() => align.value ?? inherited.value ?? "start");
  const v = computed(() => variant.value ?? "default");
  const state = computed<BubbleState>(() => ({
    variant: v.value,
    align: a.value,
    shape: shape.value,
    pen: pen.value
  }));
  return () => {
    return <BubbleContext.Provider value={state.value}>
      <div data-slot="bubble" data-variant={v.value} data-align={a.value} data-shape={shape.value} data-tail={tail.value ? undefined : "false" as const} class={cn(bubbleVariants({
        variant: v.value
      }), className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>
    </BubbleContext.Provider>;
  };
});
const contentVariants = cva("relative isolate w-fit max-w-full min-w-0 px-4 py-2.5 font-hand text-base leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end compact:px-3.5 compact:py-2 calm:px-3 calm:py-1.5 [&:is(a,button)]:cursor-pointer [&:is(button)]:text-start group-data-[tail=false]/bubble:[&>svg_[data-part=tail]]:hidden", {
  variants: {
    variant: {
      default: "text-paper" as const,
      secondary: "text-secondary-foreground" as const,
      muted: "text-foreground" as const,
      tinted: "text-foreground" as const,
      outline: "text-foreground" as const,
      ghost: "rounded-none bg-transparent p-0 text-foreground compact:p-0 calm:p-0" as const,
      destructive: "text-paper" as const
    }
  },
  defaultVariants: {
    variant: "default" as const
  }
});
const NOTE_STOCK: Record<BubbleVariant, NonNullable<PaperProps["stock"]>> = {
  default: "slip" as const,
  secondary: "index-card" as const,
  muted: "paper" as const,
  tinted: "card" as const,
  outline: "graph" as const,
  ghost: "slip" as const,
  destructive: "slip" as const
};
const STICKY_STOCK: Record<BubbleVariant, NonNullable<PaperProps["stock"]>> = {
  default: "sticky-orange" as const,
  secondary: "sticky-yellow" as const,
  muted: "sticky-blue" as const,
  tinted: "sticky-pink" as const,
  outline: "sticky-green" as const,
  ghost: "sticky-yellow" as const,
  destructive: "sticky-pink" as const
};
const CREASES = "after:pointer-events-none after:absolute after:inset-0 after:z-0 after:content-[''] after:mix-blend-multiply after:[background:linear-gradient(90deg,transparent_31.6%,rgb(var(--ll-shade)/0.16)_32.2%,color-mix(in_srgb,var(--ll-photo)_50%,transparent)_32.9%,transparent_35.5%,transparent_64%,rgb(var(--ll-shade)/0.12)_64.6%,color-mix(in_srgb,var(--ll-photo)_45%,transparent)_65.3%,transparent_68%)]";
const BubbleContent = defineUi<UI.ComponentProps<"div"> & {
  asChild?: boolean;
  seed?: string | number;
  paper?: Partial<PaperProps>;
}>("BubbleContent", ["asChild", "class", "seed", "paper"], (_props, {
  slots: _slots
}) => {
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const paper = computed(() => _props["paper"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["asChild", "class", "seed", "paper", "ref", "children"]));
  const _context7 = useContext(BubbleContext);
  const variant = computed(() => _context7.value.variant);
  const align = computed(() => _context7.value.align);
  const shape = computed(() => _context7.value.shape);
  const pen = computed(() => _context7.value.pen);
  const drawn = computed(() => shape.value === "cloud" && variant.value !== "ghost");
  const interactive = computed(() => asChild.value);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: bubbleRecipe,
    params: {
      variant: variant.value,
      tail: align.value,
      pen: pen.value,
      interactive: interactive.value
    },
    kind: "bubble" as const,
    seed: seed.value,
    still: true
  }));
  const merged = computed(() => useMergedRef<HTMLElement>(drawn.value ? hostRef : undefined, ref.value as UI.Ref<HTMLElement> | undefined));
  const voice = computed(() => pen.value === "you" ? "font-script text-[1.35rem] leading-snug text-ink-you" as const : undefined);
  const base = computed(() => contentVariants({
    variant: variant.value
  }));
  return () => {
    if (shape.value !== "cloud") {
      const sticky = shape.value === "sticky";
      return <Paper data-slot="bubble-content" ref={merged.value as UI.Ref<HTMLElement>} stock={sticky ? STICKY_STOCK[variant.value] : NOTE_STOCK[variant.value]} curl seed={seed.value} class={cn(base.value, "rounded-none font-script text-[1.35rem] leading-snug text-ink", !sticky && CREASES, voice.value, className.value)} {...domProps(paper.value)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </Paper>;
    }
    const Comp = asChild.value ? Slot.Root : "div" as const;
    return <Comp data-slot="bubble-content" ref={merged.value} {...domProps(drawn.value ? hostProps.value : {})} class={cn(base.value, voice.value, className.value)} {...domProps(props.value)}>
      {asChild.value ? <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable> : readSlot(_slots.default)}
      {drawn.value ? node.value : null}
    </Comp>;
  };
});
const bubbleReactionsPlace = cva("absolute z-10 flex min-h-6 w-fit shrink-0 items-center justify-center gap-1 px-2 py-0.5 font-hand text-sm has-[button]:p-0 [&>svg[data-ink]]:[filter:var(--ll-drop-sticker)]", {
  variants: {
    side: {
      top: "top-0 -translate-y-3/4" as const,
      bottom: "bottom-0 translate-y-3/4" as const
    },
    align: {
      start: "start-3" as const,
      end: "end-3" as const
    }
  },
  defaultVariants: {
    side: "bottom" as const,
    align: "end" as const
  }
});
const BubbleReactions = defineUi<UI.ComponentProps<"div"> & {
  align?: "start" | "end";
  side?: "top" | "bottom";
  seed?: string | number;
}>("BubbleReactions", ["side", "align", "seed", "class"], (_props, {
  slots: _slots
}) => {
  const side = computed(() => _props["side"] === undefined ? "bottom" as const : _props["side"]);
  const align = computed(() => _props["align"] === undefined ? "end" as const : _props["align"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["side", "align", "seed", "class", "ref", "children"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: bubbleReactionsRecipe,
    params: {},
    kind: "reactions" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <div data-slot="bubble-reactions" data-align={align.value} data-side={side.value} ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined) as UI.Ref<HTMLDivElement>} {...domProps(hostProps.value)} class={cn(bubbleReactionsPlace({
      side: side.value,
      align: align.value
    }), className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
export { BubbleGroup, Bubble, BubbleContent, BubbleReactions };
export type { BubbleShape, BubblePen };
