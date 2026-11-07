// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { MARK_REVEAL, useMarkPhase } from "@/hooks/use-mark-ink";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { squiggleRecipe, type SquiggleKind } from "@/lib/ink/recipes/squiggle-ink";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
const Squiggle = defineUi<Omit<UI.ComponentProps<"div">, "children"> & {
  kind?: SquiggleKind;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  tone?: MarkPen;
  weight?: MarkWeight;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
}>("Squiggle", ["kind", "orientation", "decorative", "tone", "weight", "animate", "show", "delay", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"] === undefined ? "wavy" as const : _props["kind"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const decorative = computed(() => _props["decorative"] === undefined ? true : _props["decorative"]);
  const tone = computed(() => _props["tone"] === undefined ? "ink" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["kind", "orientation", "decorative", "tone", "weight", "animate", "show", "delay", "seed", "class", "style", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: squiggleRecipe,
    params: {
      kind: kind.value,
      orientation: orientation.value,
      tone: tone.value,
      weight: weight.value,
      animate: animate.value
    },
    kind: "squiggle" as const,
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
    return <div data-slot="squiggle" data-kind={kind.value} data-orientation={orientation.value} role={decorative.value ? "none" as const : "separator" as const} aria-orientation={decorative.value ? undefined : orientation.value} ref={useMergedRef<HTMLElement>(hostRef, phaseRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(ready.value ? hostProps.value : {})} {...domProps(phaseProps.value)} style={cssStyle({
      ...(animate.value ? {
        "--ll-draw-delay": `${delay.value ?? 0}ms`
      } as UI.CSSProperties : undefined),
      ...style.value
    })} class={cn("relative isolate shrink-0 outline-none", orientation.value === "horizontal" ? "h-4 w-full" as const : "h-full min-h-8 w-4" as const, animate.value && MARK_REVEAL, className.value)} {...domProps(props.value)}>
      {ready.value ? node.value : null}
    </div>;
  };
});
export { Squiggle };
