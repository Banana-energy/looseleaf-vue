// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Accordion as AccordionPrimitive } from "@/lib/primitives";
import { Icon } from "@/components/ui/icon";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { accordionRuleRecipe, accordionTriggerRecipe } from "@/lib/ink/recipes/accordion-ink";
import { MARGIN_BRACKET_DRAW, marginBracketRecipe, type MarginBracketParams } from "@/lib/ink/recipes/margin-bracket-ink";
import { markTouched } from "@/lib/ink/recipes/draw-on-ink";
import { cn } from "@/lib/utils";
type BracketKind = MarginBracketParams["kind"] | false;
const BracketContext = createContext<BracketKind>("curly");
const FOLD = `@keyframes ll-accordion-down { from { height: 0; clip-path: inset(0); } to { height: var(--radix-accordion-content-height); clip-path: inset(0); } }
@keyframes ll-accordion-up { from { height: var(--radix-accordion-content-height); clip-path: inset(0); } to { height: 0; clip-path: inset(0); } }`;
const SWIPE = "hover:[&>svg_[data-part=swipe]]:animate-[ll-wipe_var(--ll-dur-sheet)_var(--ll-ease-out)_both]";
const Rule = defineUi<{}>("Rule", [], (_props, {
  slots: _slots
}) => {
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: accordionRuleRecipe,
    params: {},
    kind: "rule" as const,
    still: true
  }));
  return () => {
    return <span data-slot="accordion-rule" aria-hidden="true" ref={hostRef} {...domProps(node.value ? hostProps.value : {})} class="pointer-events-none absolute inset-x-0 bottom-0 block h-2 forced-colors:hidden">
      {node.value}
    </span>;
  };
});
const Bracket = defineUi<{
  kind: Exclude<BracketKind, false>;
}>("Bracket", ["kind"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: marginBracketRecipe,
    params: {
      kind: kind.value
    },
    kind: "bracket" as const,
    still: true
  }));
  return () => {
    return <span data-slot="accordion-bracket" aria-hidden="true" ref={hostRef} {...domProps(node.value ? hostProps.value : {})} class={cn("pointer-events-none absolute inset-y-0 start-0 block w-3.5 forced-colors:hidden", MARGIN_BRACKET_DRAW)}>
      {node.value}
    </span>;
  };
});
const Accordion = defineUi<UI.ComponentProps<typeof AccordionPrimitive.Root> & {
  bracket?: BracketKind;
}>("Accordion", ["bracket", "onClickCapture"], (_props, {
  slots: _slots
}) => {
  const bracket = computed(() => _props["bracket"] === undefined ? "curly" as const : _props["bracket"]);
  const onClickCapture = computed(() => _props["onClickCapture"]);
  const props = computed(() => omitProps(_props, ["bracket", "onClickCapture"]));
  return () => {
    return <BracketContext.Provider value={bracket.value}>
      <style>
        {FOLD}
      </style>
      <AccordionPrimitive.Root data-slot="accordion" onClickCapture={e => {
        markTouched(e);
        onClickCapture.value?.(e);
      }} {...domProps(props.value)}>{_slots.default?.()}</AccordionPrimitive.Root>
    </BracketContext.Provider>;
  };
});
const AccordionItem = defineUi<UI.ComponentProps<typeof AccordionPrimitive.Item>>("AccordionItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <AccordionPrimitive.Item data-slot="accordion-item" class={cn("group/accordion-item relative pb-2 last:[&>[data-slot=accordion-rule]]:hidden", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      <Rule />
    </AccordionPrimitive.Item>;
  };
});
const AccordionTrigger = defineUi<UI.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  seed?: string | number;
}>("AccordionTrigger", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "seed", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: accordionTriggerRecipe,
    params: {
      disabled: !!props.value.disabled
    },
    kind: "row" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <AccordionPrimitive.Header class="flex">
      <AccordionPrimitive.Trigger data-slot="accordion-trigger" ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("group/accordion-trigger relative isolate -mx-2 flex flex-1 items-start justify-between gap-4 px-2 py-3.5 text-start font-hand text-base font-bold transition-[color] disabled:pointer-events-none disabled:text-pencil-text compact:py-2.5 calm:py-2 calm:text-[15px]", "[&_svg:not(.absolute):not([class*='size-'])]:size-4 [&[data-state=open]>[data-chevron]]:rotate-180", SWIPE, className.value)} {...domProps(props.value)}>
        {node.value}
        {readSlot(_slots.default)}
        <Icon name="chevron-down" data-chevron="" size={16} class="pointer-events-none mt-1 shrink-0 transition-transform duration-(--ll-dur-sheet) ease-settle" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>;
  };
});
const OUTER_PADDING = /^(?:[^\s:]+:)*!?-?(?:p|py|pt|pb)-/;
function splitContentClass(className?: string) {
  const outer: string[] = [];
  const inner: string[] = [];
  for (const token of (className ?? "").split(/\s+/)) {
    if (!token) continue;
    (OUTER_PADDING.test(token) ? outer : inner).push(token);
  }
  return {
    outer: outer.join(" "),
    inner: inner.join(" ")
  };
}
const AccordionContent = defineUi<UI.ComponentProps<typeof AccordionPrimitive.Content>>("AccordionContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const bracket = useContext(BracketContext);
  const split = computed(() => splitContentClass(className.value));
  return () => {
    return <AccordionPrimitive.Content data-slot="accordion-content" class="group/accordion-content text-sm data-[state=closed]:animate-[ll-accordion-up_var(--ll-dur-sheet)_var(--ll-ease-out)] data-[state=open]:animate-[ll-accordion-down_var(--ll-dur-sheet)_var(--ll-ease-out)]" {...domProps(props.value)}>
      <div class={cn("pt-0 pb-4", split.value.outer)}>
        <div class={cn("relative in-data-touched:group-data-[state=open]/accordion-content:animate-soak", bracket.value && "ps-5", split.value.inner)}>
          {bracket.value ? <Bracket kind={bracket.value} /> : null}
          {readSlot(_slots.default)}
        </div>
      </div>
    </AccordionPrimitive.Content>;
  };
});
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
