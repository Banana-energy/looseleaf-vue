// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/lib/primitives";
import { Button } from "@/components/ui/button";
import { Fastener, Paper } from "@/components/ui/paper";
import { Tape } from "@/components/ui/tape";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { attachmentMediaRecipe, attachmentProgressRecipe, attachmentRecipe, type AttachmentOrientation, type AttachmentState } from "@/lib/ink/recipes/attachment-ink";
import { cn } from "@/lib/utils";
type AttachmentSize = "default" | "sm" | "xs";
const AttachmentContext = createContext<{
  state: AttachmentState;
  orientation: AttachmentOrientation;
  size: AttachmentSize;
  titleId?: string;
}>({
  state: "done" as const,
  orientation: "horizontal" as const,
  size: "default" as const
});
const attachmentVariants = cva("group/attachment relative isolate flex w-fit max-w-full min-w-0 shrink-0 flex-wrap font-hand text-card-foreground not-has-[[data-slot=attachment-trigger]]:[&>svg_[data-layer=hover]]:hidden data-[clip]:not-has-[[data-slot=attachment-actions]]:[&>[data-slot=attachment-content]]:pe-3", {
  variants: {
    size: {
      default: "gap-2 text-[15px] has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2.5" as const,
      sm: "gap-2.5 text-sm has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-2" as const,
      xs: "gap-1.5 text-sm has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1.5" as const
    },
    orientation: {
      horizontal: "min-w-40 items-center" as const,
      vertical: "w-28 flex-col pb-4 has-data-[slot=attachment-content]:w-32" as const
    }
  }
});
const Attachment = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof attachmentVariants> & {
  state?: AttachmentState;
  seed?: string | number;
}>("Attachment", ["class", "state", "size", "orientation", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const state = computed(() => _props["state"] === undefined ? "done" as const : _props["state"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "state", "size", "orientation", "seed", "children", "ref"]));
  const st = computed(() => state.value ?? "done");
  const sz = computed(() => (size.value ?? "default") as AttachmentSize);
  const or = computed(() => (orientation.value ?? "horizontal") as AttachmentOrientation);
  const {
    hostRef,
    hostProps,
    node,
    seed: s
  } = useInk(() => ({
    recipe: attachmentRecipe,
    params: {
      state: st.value,
      orientation: or.value,
      interactive: true
    },
    kind: "attachment" as const,
    seed: seed.value,
    still: true
  }));
  const titleId = useId();
  const ctx = computed(() => ({
    state: st.value,
    orientation: or.value,
    size: sz.value,
    titleId
  }));
  const clipped = computed(() => st.value === "done" && or.value === "horizontal" && sz.value === "default");
  return () => {
    return <AttachmentContext.Provider value={ctx.value}>
      <div data-slot="attachment" data-state={st.value} data-size={sz.value} data-orientation={or.value} data-clip={clipped.value ? "" as const : undefined} data-ink-focus="within" ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined) as UI.Ref<HTMLDivElement>} {...domProps(hostProps.value)} class={cn(attachmentVariants({
        size: sz.value,
        orientation: or.value
      }), className.value)} {...domProps(props.value)}>
        {st.value === "idle" ? null : <span aria-hidden="true" data-slot="attachment-sheet" class="pointer-events-none absolute inset-0 -z-20">
            <Paper stock={or.value === "vertical" ? "photo" as const : "slip" as const} rules="none" tilt={or.value === "vertical" ? undefined : false} seed={`${s.value}|sheet`} class="size-full" />
          </span>}
        {node.value}
        {st.value === "done" && or.value === "vertical" ? <Tape kind="masking" length={52} height={18} seed={`${s.value}|tape`} class="absolute -top-2.5 left-1/2 -ml-[26px] calm:hidden" /> : null}
        {clipped.value ? <Fastener kind="clip" size={30} seed={`${s.value}|clip`} class="absolute -top-3 end-1.5 z-(--ll-z-prop) calm:hidden" /> : null}
        {readSlot(_slots.default)}
      </div>
    </AttachmentContext.Provider>;
  };
});
const attachmentMediaVariants = cva("relative isolate flex aspect-square w-10 shrink-0 items-center justify-center text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[state=error]/attachment:text-red group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not(.absolute):not([data-ink=doodle]):not([data-ink=sticker]):not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not(.absolute):not([data-ink=doodle]):not([data-ink=sticker]):not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not(.absolute):not([data-ink=doodle]):not([data-ink=sticker]):not([class*='size-'])]:size-3.5", {
  variants: {
    variant: {
      icon: "" as const,
      image: "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 [&>img]:m-[3px] [&>img]:aspect-square [&>img]:size-[calc(100%-6px)] [&>img]:object-cover" as const
    }
  },
  defaultVariants: {
    variant: "icon" as const
  }
});
const AttachmentMedia = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants> & {
  seed?: string | number;
}>("AttachmentMedia", ["class", "variant", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "icon" as const : _props["variant"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "variant", "seed", "ref", "children"]));
  const _context6 = useContext(AttachmentContext);
  const state = computed(() => _context6.value.state);
  const v = computed(() => variant.value ?? "icon");
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: attachmentMediaRecipe,
    params: {
      state: state.value,
      variant: v.value
    },
    kind: "media" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <div data-slot="attachment-media" data-variant={v.value} ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined) as UI.Ref<HTMLDivElement>} {...domProps(hostProps.value)} class={cn(attachmentMediaVariants({
      variant: v.value
    }), className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const AttachmentContent = defineUi<UI.ComponentProps<"div">>("AttachmentContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="attachment-content" class={cn("max-w-full min-w-0 flex-1 pe-0.5 leading-tight group-data-[orientation=vertical]/attachment:px-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const AttachmentTitle = defineUi<UI.ComponentProps<"span">>("AttachmentTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const _context2 = useContext(AttachmentContext);
  const titleId = computed(() => _context2.value.titleId);
  return () => {
    return <span data-slot="attachment-title" id={titleId.value} class={cn("ll-ink-room block min-w-0 truncate font-bold group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse", className.value)} {...domProps(props.value)}>{_slots.default?.()}</span>;
  };
});
const AttachmentDescription = defineUi<UI.ComponentProps<"span">>("AttachmentDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <span data-slot="attachment-description" class={cn("ll-ink-room mt-0.5 block min-w-0 truncate text-sm text-muted-foreground group-data-[state=error]/attachment:text-red", className.value)} {...domProps(props.value)}>{_slots.default?.()}</span>;
  };
});
const AttachmentProgress = defineUi<Omit<UI.ComponentProps<"div">, "children"> & {
  value?: number;
  max?: number;
  seed?: string | number;
}>("AttachmentProgress", ["value", "max", "class", "style", "seed"], (_props, {
  slots: _slots
}) => {
  const value = computed(() => _props["value"]);
  const max = computed(() => _props["max"] === undefined ? 100 : _props["max"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["value", "max", "class", "style", "seed", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: attachmentProgressRecipe,
    params: {
      indeterminate: value.value === undefined
    },
    kind: "progress" as const,
    seed: seed.value,
    size: [120, 10],
    still: true
  }));
  const own = shallowRef<HTMLDivElement | null | null>(null);
  const titledBy = shallowRef<string | undefined>(initialState(undefined));
  const setTitledBy = stateSetter(titledBy);
  const named = computed(() => props.value["aria-label"] !== undefined || props.value["aria-labelledby"] !== undefined);
  watchDependencies(() => {
    if (named.value) return;
    const title = own.value?.closest('[data-slot="attachment"]')?.querySelector<HTMLElement>('[data-slot="attachment-title"]');
    setTitledBy(title?.id || undefined);
  }, undefined, true);
  const pct = computed(() => value.value === undefined ? 100 : Math.min(100, Math.max(0, value.value / max.value * 100)));
  return () => {
    return <div data-slot="attachment-progress" role="progressbar" aria-valuemin={0} aria-valuemax={max.value} aria-valuenow={value.value === undefined ? undefined : Math.round(value.value)} data-state={value.value === undefined ? "indeterminate" as const : pct.value >= 100 ? "complete" as const : "loading" as const} aria-labelledby={named.value ? undefined : titledBy.value} ref={useMergedRef<HTMLElement>(hostRef, own, ref.value as UI.Ref<HTMLElement> | undefined) as UI.Ref<HTMLDivElement>} {...domProps(hostProps.value)} style={cssStyle({
      "--ll-progress": `${pct.value}%`,
      ...style.value
    } as UI.CSSProperties)} class={cn("relative isolate mt-1.5 block h-2.5 w-full min-w-16 [&>svg_[data-part=bar]]:transition-[clip-path] [&>svg_[data-part=bar]]:duration-(--ll-dur-sheet) [&>svg_[data-part=bar]]:[clip-path:inset(-15%_calc(100%-var(--ll-progress))_-15%_-3%)] rtl:[&>svg_[data-part=bar]]:[clip-path:inset(-15%_-3%_-15%_calc(100%-var(--ll-progress)))] data-[state=indeterminate]:[&>svg_[data-part=bar]]:animate-pulse", className.value)} {...domProps(props.value)}>
      {node.value}
    </div>;
  };
});
const AttachmentActions = defineUi<UI.ComponentProps<"div">>("AttachmentActions", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="attachment-actions" class={cn("relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:end-2 group-data-[orientation=vertical]/attachment:top-2 group-data-[orientation=vertical]/attachment:gap-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const AttachmentAction = defineUi<UI.ComponentProps<typeof Button>>("AttachmentAction", ["class", "variant", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "icon-xs" as const : _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size"]));
  return () => {
    return <Button data-slot="attachment-action" variant={variant.value ?? "ghost"} size={size.value} class={cn(className.value)} {...domProps(props.value)}>{_slots.default?.()}</Button>;
  };
});
const AttachmentTrigger = defineUi<UI.ComponentProps<"button"> & {
  asChild?: boolean;
}>("AttachmentTrigger", ["class", "asChild", "type"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const type = computed(() => _props["type"]);
  const props = computed(() => omitProps(_props, ["class", "asChild", "type"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "button" as const));
  return () => {
    return <Comp.value data-slot="attachment-trigger" type={asChild.value ? undefined : type.value ?? "button"} class={cn("absolute inset-0 z-10 cursor-pointer outline-hidden", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Comp.value>;
  };
});
const AttachmentGroup = defineUi<UI.ComponentProps<"div">>("AttachmentGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="attachment-group" class={cn("flex min-w-0 snap-x snap-mandatory scroll-px-3 gap-3 overflow-x-auto overscroll-x-contain px-3 pt-4 pb-3 [scrollbar-width:none] *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Attachment, AttachmentGroup, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentProgress, AttachmentActions, AttachmentAction, AttachmentTrigger };
export type { AttachmentState, AttachmentSize };
