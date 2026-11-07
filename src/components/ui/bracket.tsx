// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { MARK_REVEAL, useMarkPhase } from "@/hooks/use-mark-ink";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { bracketRecipe, type BracketKind } from "@/lib/ink/recipes/bracket-ink";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
const Bracket = defineUi<UI.ComponentProps<"div"> & {
  kind?: BracketKind;
  side?: "start" | "end";
  tone?: MarkPen;
  weight?: MarkWeight;
  inset?: number;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
}>("Bracket", ["kind", "side", "tone", "weight", "inset", "animate", "show", "delay", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"] === undefined ? "square" as const : _props["kind"]);
  const side = computed(() => _props["side"] === undefined ? "start" as const : _props["side"]);
  const tone = computed(() => _props["tone"] === undefined ? "ink" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const inset = computed(() => _props["inset"] === undefined ? 8 : _props["inset"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["kind", "side", "tone", "weight", "inset", "animate", "show", "delay", "seed", "class", "style", "children", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: bracketRecipe,
    params: {
      kind: kind.value,
      side: side.value,
      tone: tone.value,
      weight: weight.value,
      inset: inset.value,
      animate: animate.value
    },
    kind: "bracket" as const,
    seed: seed.value
  }));
  const _hook15 = useMarkPhase(() => ({
    animate: animate.value,
    show: show.value
  }));
  const phaseRef = computed(() => _hook15.value.phaseRef);
  const phaseProps = computed(() => _hook15.value.phaseProps);
  const ready = computed(() => !!node.value && show.value);
  return () => {
    return <div data-slot="bracket" data-kind={kind.value} data-side={side.value} ref={useMergedRef<HTMLElement>(hostRef, phaseRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(ready.value ? hostProps.value : {})} {...domProps(phaseProps.value)} style={cssStyle({
      ...(animate.value ? {
        "--ll-draw-delay": `${delay.value ?? 0}ms`
      } as UI.CSSProperties : undefined),
      ...style.value
    })} class={cn("relative isolate outline-none", side.value === "start" ? "ps-7" as const : "pe-7" as const, animate.value && MARK_REVEAL, className.value)} {...domProps(props.value)}>
      {ready.value ? node.value : null}
      {readSlot(_slots.default)}
    </div>;
  };
});
export { Bracket };
