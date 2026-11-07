// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Collapsible as CollapsiblePrimitive } from "@/lib/primitives";
import { Icon } from "@/components/ui/icon";
import { useInk } from "@/lib/ink/vue";
import { MARGIN_BRACKET_DRAW, marginBracketRecipe, type MarginBracketParams } from "@/lib/ink/recipes/margin-bracket-ink";
import { markTouched } from "@/lib/ink/recipes/draw-on-ink";
import { cn } from "@/lib/utils";
const FOLD = `@keyframes ll-collapsible-down { from { height: 0; clip-path: inset(0); } to { height: var(--radix-collapsible-content-height); clip-path: inset(0); } }
@keyframes ll-collapsible-up { from { height: var(--radix-collapsible-content-height); clip-path: inset(0); } to { height: 0; clip-path: inset(0); } }`;
const Collapsible = defineUi<UI.ComponentProps<typeof CollapsiblePrimitive.Root>>("Collapsible", ["class", "onClickCapture"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onClickCapture = computed(() => _props["onClickCapture"]);
  const props = computed(() => omitProps(_props, ["class", "onClickCapture"]));
  return () => {
    return <>
      <style>
        {FOLD}
      </style>
      <CollapsiblePrimitive.Root data-slot="collapsible" class={cn("group/collapsible", className.value)} onClickCapture={e => {
        markTouched(e);
        onClickCapture.value?.(e);
      }} {...domProps(props.value)}>{_slots.default?.()}</CollapsiblePrimitive.Root>
    </>;
  };
});
const CollapsibleTrigger = defineUi<UI.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>>("CollapsibleTrigger", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" class={cn("group/collapsible-trigger", className.value)} {...domProps(props.value)}>{_slots.default?.()}</CollapsiblePrimitive.CollapsibleTrigger>;
  };
});
const Bracket = defineUi<{
  kind: MarginBracketParams["kind"];
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
    return <span data-slot="collapsible-bracket" aria-hidden="true" ref={hostRef} {...domProps(node.value ? hostProps.value : {})} class={cn("pointer-events-none absolute inset-y-0 start-0 block w-3.5 forced-colors:hidden", MARGIN_BRACKET_DRAW)}>
      {node.value}
    </span>;
  };
});
const CollapsibleContent = defineUi<UI.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & {
  bracket?: MarginBracketParams["kind"] | false;
}>("CollapsibleContent", ["class", "bracket"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const bracket = computed(() => _props["bracket"] === undefined ? false : _props["bracket"]);
  const props = computed(() => omitProps(_props, ["class", "children", "bracket"]));
  return () => {
    return <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" class={cn("group/collapsible-content data-[state=closed]:animate-[ll-collapsible-up_var(--ll-dur-sheet)_var(--ll-ease-out)] data-[state=open]:animate-[ll-collapsible-down_var(--ll-dur-sheet)_var(--ll-ease-out)]", className.value)} {...domProps(props.value)}>
      {bracket.value ? <div class="relative ps-5 group-data-[state=open]/collapsible-content:animate-soak">
          <Bracket kind={bracket.value} />
          {readSlot(_slots.default)}
        </div> : readSlot(_slots.default)}
    </CollapsiblePrimitive.CollapsibleContent>;
  };
});
const CollapsibleIndicator = defineUi<Omit<UI.ComponentProps<typeof Icon>, "name">>("CollapsibleIndicator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <Icon data-slot="collapsible-indicator" name="chevron-down" size={16} class={cn("transition-transform duration-(--ll-dur-sheet) ease-settle group-data-[state=open]/collapsible-trigger:rotate-180", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Icon>;
  };
});
export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleIndicator };
