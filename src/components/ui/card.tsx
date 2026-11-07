// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { cardRuleRecipe, type CardRuleStyle } from "@/lib/ink/recipes/card-ink";
import { cn } from "@/lib/utils";
type CardProps = PaperProps;
const Card = defineUi<CardProps>("Card", ["class", "stock", "rules"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const stock = computed(() => _props["stock"] === undefined ? "card" as const : _props["stock"]);
  const rules = computed(() => _props["rules"] === undefined ? "none" as const : _props["rules"]);
  const props = computed(() => omitProps(_props, ["class", "stock", "rules"]));
  return () => {
    return <Paper data-slot="card" stock={stock.value} rules={rules.value} class={cn("flex flex-col gap-6 py-6 text-card-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Paper>;
  };
});
type RuleProps = {
  rule?: CardRuleStyle;
};
const hasClass = (className: string | undefined, name: string) => !!className && className.split(/\s+/).includes(name);
function useDivider(_source0: MaybeRefOrGetter<"top" | "bottom">, _source1: MaybeRefOrGetter<boolean>, _source2: MaybeRefOrGetter<CardRuleStyle>, _source3: MaybeRefOrGetter<UI.Ref<HTMLElement> | undefined>) {
  const edge = computed(() => toValue(_source0));
  const drawn = computed(() => toValue(_source1));
  const rule = computed(() => toValue(_source2));
  const ref = computed(() => toValue(_source3));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: cardRuleRecipe,
    params: {
      edge: edge.value,
      style: rule.value
    },
    kind: "rule" as const
  }));
  const merged = computed(() => useMergedRef<HTMLElement>(drawn.value ? hostRef : undefined, ref.value));
  return computed(() => {
    return {
      ref: merged.value,
      hostProps: drawn.value && node.value ? hostProps.value : {},
      node: drawn.value ? node.value : null
    };
  });
}
const CardHeader = defineUi<UI.ComponentProps<"div"> & RuleProps>("CardHeader", ["class", "rule"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const rule = computed(() => _props["rule"] === undefined ? "pencil" as const : _props["rule"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "rule", "ref", "children"]));
  const d = useDivider(() => "bottom", () => hasClass(className.value, "border-b"), () => rule.value, () => ref.value as UI.Ref<HTMLElement> | undefined);
  return () => {
    return <div data-slot="card-header" ref={d.value.ref as UI.Ref<HTMLDivElement>} {...domProps(d.value.hostProps)} class={cn("@container/card-header relative isolate grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:border-transparent [.border-b]:pb-6", className.value)} {...domProps(props.value)}>
      {d.value.node}
      {readSlot(_slots.default)}
    </div>;
  };
});
const CardTitle = defineUi<UI.ComponentProps<"div">>("CardTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="card-title" class={cn("font-script text-[1.7rem] leading-none font-semibold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const CardDescription = defineUi<UI.ComponentProps<"div">>("CardDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="card-description" class={cn("text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const CardAction = defineUi<UI.ComponentProps<"div">>("CardAction", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="card-action" class={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const CardContent = defineUi<UI.ComponentProps<"div">>("CardContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="card-content" class={cn("px-6", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const CardFooter = defineUi<UI.ComponentProps<"div"> & RuleProps>("CardFooter", ["class", "rule"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const rule = computed(() => _props["rule"] === undefined ? "pencil" as const : _props["rule"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "rule", "ref", "children"]));
  const d = useDivider(() => "top", () => hasClass(className.value, "border-t"), () => rule.value, () => ref.value as UI.Ref<HTMLElement> | undefined);
  return () => {
    return <div data-slot="card-footer" ref={d.value.ref as UI.Ref<HTMLDivElement>} {...domProps(d.value.hostProps)} class={cn("relative isolate flex items-center px-6 [.border-t]:border-transparent [.border-t]:pt-6", className.value)} {...domProps(props.value)}>
      {d.value.node}
      {readSlot(_slots.default)}
    </div>;
  };
});
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
export type { CardProps };
