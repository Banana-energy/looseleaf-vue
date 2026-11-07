// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Collapsible as CollapsiblePrimitive } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useShapedSheet } from "@/hooks/use-paper-object";
import type { Accent } from "@/lib/ink/paper/props";
import { useInkFaces } from "@/lib/ink/paper/sheet-layers";
import type { StockName } from "@/lib/ink/paper/stocks";
import { useMergedRef } from "@/lib/ink/vue";
import { envelopeBackRecipe, envelopeFrontRecipe } from "@/lib/ink/recipes/envelope-ink";
import { cn } from "@/lib/utils";
type EnvelopeContextValue = {
  stock: StockName;
  stamp: Accent | "none";
  postmark: boolean;
  airmail: boolean;
  seed: string;
};
const EnvelopeContext = createContext<EnvelopeContextValue | null>(null);
const FRONT_TILT = "[&>svg]:[rotate:clamp(calc(var(--ll-tilt-max)*-1),var(--ll-tilt,0deg),var(--ll-tilt-max))]";
type EnvelopeProps = Omit<UI.ComponentProps<"div">, "onChange"> & {
  stock?: StockName;
  stamp?: Accent | false;
  postmark?: boolean;
  airmail?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openOnHover?: boolean;
  disabled?: boolean;
  tilt?: boolean | number;
  seed?: string | number;
  size?: readonly [number, number];
};
const Envelope = defineUi<EnvelopeProps>("Envelope", ["class", "style", "stock", "stamp", "postmark", "airmail", "open", "defaultOpen", "onOpenChange", "openOnHover", "disabled", "tilt", "seed", "size", "onPointerenter", "onPointerleave"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const stock = computed(() => _props["stock"] === undefined ? "kraft" as const : _props["stock"]);
  const stamp = computed(() => _props["stamp"] === undefined ? "tomato" as const : _props["stamp"]);
  const postmark = computed(() => _props["postmark"] === undefined ? true : _props["postmark"]);
  const airmail = computed(() => _props["airmail"] === undefined ? false : _props["airmail"]);
  const openProp = computed(() => _props["open"]);
  const defaultOpen = computed(() => _props["defaultOpen"] === undefined ? false : _props["defaultOpen"]);
  const onOpenChange = computed(() => _props["onOpenChange"]);
  const openOnHover = computed(() => _props["openOnHover"] === undefined ? false : _props["openOnHover"]);
  const disabled = computed(() => _props["disabled"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const onPointerenter = computed(() => _props["onPointerenter"]);
  const onPointerleave = computed(() => _props["onPointerleave"]);
  const props = computed(() => omitProps(_props, ["class", "style", "children", "ref", "stock", "stamp", "postmark", "airmail", "open", "defaultOpen", "onOpenChange", "openOnHover", "disabled", "tilt", "seed", "size", "onPointerenter", "onPointerleave"]));
  const inner = shallowRef(initialState(defaultOpen.value));
  const setInner = stateSetter(inner);
  const controlled = computed(() => openProp.value !== undefined);
  const open = computed(() => openProp.value !== undefined ? openProp.value : inner.value);
  const setOpen = (v: boolean) => {
    if (!controlled.value) setInner(v);
    onOpenChange.value?.(v);
  };
  const hoverOpened = shallowRef(false);
  const o = useShapedSheet(() => ({
    recipe: envelopeBackRecipe,
    params: {
      stock: stock.value
    },
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 1.1,
    size: size.value
  }));
  const ctx = computed<EnvelopeContextValue>(() => ({
    stock: stock.value,
    stamp: stamp.value || "none",
    postmark: postmark.value && !!stamp.value,
    airmail: airmail.value,
    seed: o.value.seed
  }));
  const state = computed(() => open.value ? "open" as const : "closed" as const);
  return () => {
    return <EnvelopeContext.Provider value={ctx.value}>
      <div data-slot="envelope" data-state={state.value} ref={ref.value} class={cn("group/env @container w-full max-w-sm", className.value)} style={cssStyle(style.value)} {...domProps(props.value)}>
        <div aria-hidden="true" class="h-0 transition-[height] duration-(--ll-dur-sheet) ease-(--ll-ease-settle) group-data-[state=open]/env:h-[31cqw]" />
        <CollapsiblePrimitive.Root open={open.value} disabled={disabled.value} onOpenChange={v => {
          if (!v && hoverOpened.value) {
            hoverOpened.value = false;
            return;
          }
          hoverOpened.value = false;
          setOpen(v);
        }} asChild>
          <div data-slot="envelope-body" {...domProps(o.value.root)} onPointerenter={(e: PointerEvent) => {
            onPointerenter.value?.(e as never);
            if (openOnHover.value && !disabled.value && e.pointerType === "mouse" && !open.value) {
              hoverOpened.value = true;
              setOpen(true);
            }
          }} onPointerleave={(e: PointerEvent) => {
            onPointerleave.value?.(e as never);
            if (openOnHover.value && e.pointerType === "mouse" && hoverOpened.value) {
              hoverOpened.value = false;
              if ((e.currentTarget as HTMLElement).querySelector('[data-slot="envelope-letter"]')?.contains(document.activeElement)) return;
              setOpen(false);
            }
          }} class={cn("relative isolate aspect-[8/5] w-full", !o.value.ready && "bg-card shadow-card")} style={cssStyle(o.value.root.style)}>
            {o.value.node}
            {readSlot(_slots.default)}
          </div>
        </CollapsiblePrimitive.Root>
      </div>
    </EnvelopeContext.Provider>;
  };
});
type EnvelopeLetterProps = Omit<PaperProps, "stock" | "as"> & {
  stock?: StockName;
};
const EnvelopeLetter = defineUi<EnvelopeLetterProps>("EnvelopeLetter", ["class", "stock"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "stock", "children"]));
  return () => {
    return <CollapsiblePrimitive.Content asChild>
      <Paper data-slot="envelope-letter" stock={stock.value} class={cn("absolute inset-x-[5%] bottom-[9%] z-10 h-[86%] -translate-y-[38%] overflow-hidden p-5 text-ink data-[state=closed]:hidden", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-[30%] data-[state=open]:duration-(--ll-dur-sheet)", className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </Paper>
    </CollapsiblePrimitive.Content>;
  };
});
const EnvelopeFront = defineUi<UI.ComponentProps<"div">>("EnvelopeFront", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref"]));
  const ctx = useContext(EnvelopeContext);
  const {
    hostRef,
    hostProps,
    node
  } = useInkFaces(() => ({
    recipe: envelopeFrontRecipe,
    params: {
      stock: ctx.value?.stock ?? "paper",
      stamp: ctx.value?.stamp ?? "none",
      postmark: ctx.value?.postmark ?? false,
      airmail: ctx.value?.airmail ?? false
    },
    kind: "envelope" as const,
    seed: `${ctx.value?.seed ?? "envelope"}|front`,
    still: true
  }));
  const merged = computed(() => useMergedRef<HTMLDivElement>(hostRef, ref.value));
  return () => {
    return <div data-slot="envelope-front" ref={merged.value} {...domProps(node.value ? hostProps.value : {})} class={cn("absolute inset-0 z-20 isolate flex flex-col justify-end ps-[13%] pe-[8%] pb-[8%] text-ink", FRONT_TILT, className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const EnvelopeTrigger = defineUi<UI.ComponentProps<typeof CollapsiblePrimitive.Trigger>>("EnvelopeTrigger", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <CollapsiblePrimitive.Trigger data-slot="envelope-trigger" class={cn("absolute inset-0 z-10 cursor-pointer disabled:cursor-not-allowed", className.value)} {...domProps(props.value)}>
      <span class="sr-only">{readSlot(_slots.default) ?? "Open the letter"}</span>
    </CollapsiblePrimitive.Trigger>;
  };
});
const EnvelopeAddress = defineUi<UI.ComponentProps<"div">>("EnvelopeAddress", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="envelope-address" class={cn("max-w-[62%] font-script text-[1.35rem] leading-7 break-words [background-image:linear-gradient(to_bottom,transparent_calc(100%-1px),color-mix(in_srgb,var(--ll-pencil-mark)_55%,transparent)_calc(100%-1px))] [background-size:100%_28px]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const EnvelopeSender = defineUi<UI.ComponentProps<"div">>("EnvelopeSender", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="envelope-sender" class={cn("absolute start-[5%] top-[7%] max-w-[40%] text-xs leading-tight break-words text-ink-soft", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Envelope, EnvelopeLetter, EnvelopeFront, EnvelopeTrigger, EnvelopeAddress, EnvelopeSender };
export type { EnvelopeProps, EnvelopeLetterProps };
