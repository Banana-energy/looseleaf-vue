// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { MARK_REVEAL, useMarkPhase } from "@/hooks/use-mark-ink";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { quoteRecipe } from "@/lib/ink/recipes/quote-ink";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
const SIZE = {
  sm: 24,
  md: 32,
  lg: 46
} as const;
const PADDING = {
  sm: "ps-10 pe-8 py-1" as const,
  md: "ps-[3.25rem] pe-10 py-1.5" as const,
  lg: "ps-[4.75rem] pe-14 py-2" as const
} as const;
const Quote = defineUi<UI.ComponentProps<"figure">>("Quote", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <figure data-slot="quote" class={cn("m-0 grid w-fit max-w-full content-start gap-2.5 self-start justify-self-start", className.value)} {...domProps(props.value)}>{_slots.default?.()}</figure>;
  };
});
const QuoteText = defineUi<UI.ComponentProps<"blockquote"> & {
  size?: keyof typeof SIZE;
  tone?: MarkPen;
  weight?: MarkWeight;
  rule?: boolean;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
}>("QuoteText", ["size", "tone", "weight", "rule", "animate", "show", "delay", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const size = computed(() => _props["size"] === undefined ? "md" as const : _props["size"]);
  const tone = computed(() => _props["tone"] === undefined ? "marker" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const rule = computed(() => _props["rule"] === undefined ? false : _props["rule"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["size", "tone", "weight", "rule", "animate", "show", "delay", "seed", "class", "style", "children", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: quoteRecipe,
    params: {
      tone: tone.value,
      weight: weight.value,
      size: SIZE[size.value],
      rule: rule.value,
      animate: animate.value
    },
    kind: "quote" as const,
    seed: seed.value
  }));
  const _hook14 = useMarkPhase(() => ({
    animate: animate.value,
    show: show.value
  }));
  const phaseRef = computed(() => _hook14.value.phaseRef);
  const phaseProps = computed(() => _hook14.value.phaseProps);
  const ready = computed(() => !!node.value && show.value);
  return () => {
    return <blockquote data-slot="quote-text" ref={useMergedRef<HTMLElement>(hostRef, phaseRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(ready.value ? hostProps.value : {})} {...domProps(phaseProps.value)} style={cssStyle({
      ...(animate.value ? {
        "--ll-draw-delay": `${delay.value ?? 0}ms`
      } as UI.CSSProperties : undefined),
      ...style.value
    })} class={cn("relative isolate m-0 outline-none font-script text-[26px] leading-[1.3] text-foreground", PADDING[size.value], !node.value && show.value && !animate.value && "before:absolute before:start-0 before:top-0 before:font-script before:text-5xl before:text-marker before:content-['\\201C']", "forced-colors:before:absolute forced-colors:before:start-0 forced-colors:before:top-0 forced-colors:before:font-script forced-colors:before:text-5xl forced-colors:before:content-['\\201C']", animate.value && MARK_REVEAL, className.value)} {...domProps(props.value)}>
      {ready.value ? node.value : null}
      {readSlot(_slots.default)}
    </blockquote>;
  };
});
const QuoteAttribution = defineUi<UI.ComponentProps<"figcaption">>("QuoteAttribution", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <figcaption data-slot="quote-attribution" class={cn("ps-[3.25rem] font-hand text-sm text-muted-foreground before:content-['—_']", className.value)} {...domProps(props.value)}>{_slots.default?.()}</figcaption>;
  };
});
export { Quote, QuoteText, QuoteAttribution };
