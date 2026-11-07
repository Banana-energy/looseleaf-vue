// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Slot } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { usePaperDecor } from "@/hooks/use-paper-object";
import type { Accent } from "@/lib/ink/paper/props";
import { useShapedSheet } from "@/hooks/use-paper-object";
import { notebookCoverRecipe, notebookRecipe, type NotebookBinding, type NotebookSide } from "@/lib/ink/recipes/notebook-ink";
import { cn } from "@/lib/utils";
type NotebookContextValue = {
  value: string | undefined;
  setValue: (value: string) => void;
};
const NotebookContext = createContext<NotebookContextValue | null>(null);
type NotebookProps = Omit<PaperProps, "as"> & {
  as?: "div" | "section" | "article" | "figure";
  binding?: NotebookBinding;
  side?: NotebookSide;
  pages?: 0 | 1 | 2 | 3;
  tone?: "steel" | Accent;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};
const Notebook = defineUi<NotebookProps>("Notebook", ["class", "as", "binding", "side", "pages", "tone", "curl", "rules", "stock", "value", "defaultValue", "onValueChange", "tilt", "seed", "size", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const as = computed(() => _props["as"] === undefined ? "div" as const : _props["as"]);
  const binding = computed(() => _props["binding"] === undefined ? "spiral" as const : _props["binding"]);
  const side = computed(() => _props["side"] === undefined ? "start" as const : _props["side"]);
  const pages = computed(() => _props["pages"] === undefined ? 2 : _props["pages"]);
  const tone = computed(() => _props["tone"] === undefined ? "steel" as const : _props["tone"]);
  const curl = computed(() => _props["curl"] === undefined ? false : _props["curl"]);
  const rules = computed(() => _props["rules"]);
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const valueProp = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "as", "binding", "side", "pages", "tone", "curl", "rules", "stock", "value", "defaultValue", "onValueChange", "tilt", "seed", "size", "style"]));
  const top = computed(() => side.value === "top");
  const inner = shallowRef(initialState(defaultValue.value));
  const setInner = stateSetter(inner);
  const controlled = computed(() => valueProp.value !== undefined);
  const value = computed(() => valueProp.value !== undefined ? valueProp.value : inner.value);
  const ctx = computed<NotebookContextValue>(() => ({
    value: value.value,
    setValue: v => {
      if (!controlled.value) setInner(v);
      onValueChange.value?.(v);
    }
  }));
  const o = usePaperDecor(() => ({
    recipe: notebookRecipe,
    params: {
      binding: binding.value,
      side: side.value,
      pages: pages.value,
      tone: tone.value,
      curl: curl.value
    },
    kind: "notebook" as const,
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 0.3,
    size: size.value,
    enabled: binding.value !== "none" || pages.value > 0
  }));
  return () => {
    return <NotebookContext.Provider value={ctx.value}>
      <Paper data-slot="notebook" data-binding={binding.value} data-side={side.value} as={as.value} stock={stock.value} curl={curl.value} rules={rules.value ?? (top.value ? "pad" as const : "ruled" as const)} size={size.value} {...domProps(o.value.paper)} {...domProps(props.value)} class={cn(o.value.paper.className, "group/notebook font-hand text-[17px] rtl:[&>[data-slot=paper-rules]]:-scale-x-100", top.value ? "pt-10 pe-6 pb-6 ps-6 leading-[30px]" as const : "pt-4 pe-6 pb-7 ps-14 leading-7 calm:leading-6" as const, className.value)} style={cssStyle({
        ...o.value.paper.style,
        ...style.value
      })}>
        {o.value.decor}
        {readSlot(_slots.default)}
      </Paper>
    </NotebookContext.Provider>;
  };
});
type NotebookPageProps = UI.ComponentProps<"section"> & {
  value?: string;
};
const NotebookPage = defineUi<NotebookPageProps>("NotebookPage", ["class", "value"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const value = computed(() => _props["value"]);
  const props = computed(() => omitProps(_props, ["class", "value"]));
  const ctx = useContext(NotebookContext);
  const paged = computed(() => value.value !== undefined && ctx.value?.value !== undefined);
  const active = computed(() => !paged.value || ctx.value?.value === value.value);
  const armed = shallowRef(initialState(false));
  const setArmed = stateSetter(armed);
  watchDependencies(() => setArmed(true), () => [], false);
  return () => {
    return <section data-slot="notebook-page" data-state={active.value ? "active" as const : "inactive" as const} hidden={!active.value} class={cn("flex flex-col", paged.value && armed.value && "transition-[clip-path] duration-(--ll-dur-soak) ease-(--ll-ease-out) [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] starting:[clip-path:polygon(100%_100%,100%_100%,100%_100%,100%_100%)]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</section>;
  };
});
const NotebookTitle = defineUi<UI.ComponentProps<"h2">>("NotebookTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <h2 data-slot="notebook-title" class={cn("relative top-[calc(2.8px-var(--ll-rule-offset,8px))] font-script text-[1.75rem] leading-7 font-bold calm:top-[calc(0.8px-var(--ll-rule-offset,6px))] calm:leading-6", "group-data-[side=top]/notebook:top-[calc(3.8px-var(--ll-rule-offset,9px))] group-data-[side=top]/notebook:leading-[30px]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</h2>;
  };
});
type NotebookTurnProps = UI.ComponentProps<"button"> & {
  to?: string;
  asChild?: boolean;
};
const NotebookTurn = defineUi<NotebookTurnProps>("NotebookTurn", ["class", "to", "asChild", "onClick", "type"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const to = computed(() => _props["to"]);
  const asChild = computed(() => _props["asChild"]);
  const onClick = computed(() => _props["onClick"]);
  const children = renderValue(() => readSlot(_slots.default));
  const type = computed(() => _props["type"]);
  const props = computed(() => omitProps(_props, ["class", "to", "asChild", "onClick", "children", "type"]));
  const ctx = useContext(NotebookContext);
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "button" as const));
  return () => {
    return <Comp.value data-slot="notebook-turn" type={asChild.value ? undefined : type.value ?? "button"} class={cn("absolute right-0 bottom-0 z-(--ll-z-prop) size-[34px] cursor-pointer", className.value)} onClick={(e: MouseEvent) => {
      onClick.value?.(e);
      if (!e.defaultPrevented && to.value !== undefined) ctx.value?.setValue(to.value);
    }} {...domProps(props.value)}>
      {asChild.value ? readSlot(_slots.default) : <span class="sr-only">{readSlot(_slots.default) ?? "Turn the page"}</span>}
    </Comp.value>;
  };
});
type NotebookCoverProps = UI.ComponentProps<"div"> & {
  tone?: Accent | "ink";
  band?: boolean;
  tilt?: boolean | number;
  seed?: string | number;
  size?: readonly [number, number];
};
const NotebookCover = defineUi<NotebookCoverProps>("NotebookCover", ["class", "style", "tone", "band", "tilt", "seed", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const tone = computed(() => _props["tone"] === undefined ? "tomato" as const : _props["tone"]);
  const band = computed(() => _props["band"] === undefined ? true : _props["band"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "style", "children", "ref", "tone", "band", "tilt", "seed", "size"]));
  const o = useShapedSheet(() => ({
    recipe: notebookCoverRecipe,
    params: {
      tone: tone.value,
      band: band.value
    },
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 1.4,
    size: size.value
  }));
  return () => {
    return <div data-slot="notebook-cover" data-tone={tone.value} {...domProps(o.value.root)} {...domProps(props.value)} class={cn("relative isolate h-60 w-44 text-ink", !o.value.ready && "border border-pencil-mark bg-paper-shade shadow-card", className.value)} style={cssStyle({
      ...o.value.root.style,
      ...style.value
    })}>
      {o.value.node}
      <div data-slot="notebook-cover-body" class="absolute inset-0 flex flex-col items-center pt-[3.25rem] ps-5 pe-[calc(max(22px,15%)+6px)]">
        {readSlot(_slots.default)}
      </div>
    </div>;
  };
});
const NotebookCoverLabel = defineUi<Omit<PaperProps, "stock" | "as">>("NotebookCoverLabel", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <Paper data-slot="notebook-cover-label" stock="index-card" rules="none" class={cn("w-full px-3 py-2 text-center font-script text-xl leading-tight font-bold text-ink", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Paper>;
  };
});
export { Notebook, NotebookPage, NotebookTitle, NotebookTurn, NotebookCover, NotebookCoverLabel };
export type { NotebookProps, NotebookPageProps, NotebookTurnProps, NotebookCoverProps };
