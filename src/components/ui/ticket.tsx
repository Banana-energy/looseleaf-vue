// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useShapedSheet } from "@/hooks/use-paper-object";
import type { StockName } from "@/lib/ink/paper/stocks";
import { ticketRecipe, type TicketStub as TicketStubVariant } from "@/lib/ink/recipes/ticket-ink";
import { cn } from "@/lib/utils";
const TicketContext = createContext<{
  stubWidth: number;
}>({
  stubWidth: 88
});
type TicketProps = UI.ComponentProps<"div"> & {
  stock?: StockName;
  stub?: TicketStubVariant;
  stubWidth?: number;
  punched?: boolean;
  tilt?: boolean | number;
  seed?: string | number;
  size?: readonly [number, number];
};
const Ticket = defineUi<TicketProps>("Ticket", ["class", "style", "stock", "stub", "stubWidth", "punched", "tilt", "seed", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const stock = computed(() => _props["stock"] === undefined ? "kraft" as const : _props["stock"]);
  const stub = computed(() => _props["stub"] === undefined ? "end" as const : _props["stub"]);
  const stubWidth = computed(() => _props["stubWidth"] === undefined ? 88 : _props["stubWidth"]);
  const punched = computed(() => _props["punched"] === undefined ? false : _props["punched"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "style", "children", "ref", "stock", "stub", "stubWidth", "punched", "tilt", "seed", "size"]));
  const o = useShapedSheet(() => ({
    recipe: ticketRecipe,
    params: {
      stock: stock.value,
      stub: stub.value,
      stubWidth: stubWidth.value,
      punched: punched.value
    },
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 1.2,
    size: size.value
  }));
  const ctx = computed(() => ({
    stubWidth: stubWidth.value
  }));
  return () => {
    return <TicketContext.Provider value={ctx.value}>
      <div data-slot="ticket" data-stub={stub.value} data-punched={punched.value ? "" as const : undefined} {...domProps(o.value.root)} {...domProps(props.value)} class={cn("relative isolate flex min-h-28 w-full max-w-lg items-stretch text-ink", stub.value === "start" && "flex-row-reverse", !o.value.ready && "bg-index-card shadow-card", className.value)} style={cssStyle({
        ...o.value.root.style,
        ...style.value
      })}>
        {o.value.node}
        {readSlot(_slots.default)}
      </div>
    </TicketContext.Provider>;
  };
});
const TicketBody = defineUi<UI.ComponentProps<"div">>("TicketBody", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="ticket-body" class={cn("flex min-w-0 flex-1 flex-col justify-center gap-1 px-6 py-4 font-type break-words", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const TicketStub = defineUi<UI.ComponentProps<"aside">>("TicketStub", ["class", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "style"]));
  const _context3 = useContext(TicketContext);
  const stubWidth = computed(() => _context3.value.stubWidth);
  return () => {
    return <aside data-slot="ticket-stub" role="note" class={cn("flex shrink-0 flex-col items-center justify-center gap-1 px-2 py-3 text-center font-type break-words", className.value)} style={cssStyle({
      width: stubWidth.value,
      ...style.value
    })} {...domProps(props.value)}>{_slots.default?.()}</aside>;
  };
});
const TicketTitle = defineUi<UI.ComponentProps<"div">>("TicketTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="ticket-title" class={cn("text-2xl leading-none", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const TicketDescription = defineUi<UI.ComponentProps<"div">>("TicketDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="ticket-description" class={cn("text-sm", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const TicketNumber = defineUi<UI.ComponentProps<"div">>("TicketNumber", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="ticket-number" class={cn("ll-num text-sm tracking-widest text-[color-mix(in_srgb,var(--ll-red)_60%,var(--ll-ink))]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Ticket, TicketBody, TicketStub, TicketTitle, TicketDescription, TicketNumber };
export type { TicketProps };
