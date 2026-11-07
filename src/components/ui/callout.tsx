// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Arrow } from "@/components/ui/arrow";
import { Handwritten } from "@/components/ui/handwritten";
import { useMarkPhase } from "@/hooks/use-mark-ink";
import { useMergedRef } from "@/lib/ink/vue";
import type { ArrowCurve, ArrowDirection, ArrowHead } from "@/lib/ink/recipes/arrow-ink";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
const LAYOUT: Record<ArrowDirection, string> = {
  right: "flex-row items-center" as const,
  left: "flex-row-reverse items-center" as const,
  down: "flex-col items-center" as const,
  up: "flex-col-reverse items-center" as const,
  "down-right": "flex-row items-start" as const,
  "down-left": "flex-row-reverse items-start" as const,
  "up-right": "flex-row items-end" as const,
  "up-left": "flex-row-reverse items-end" as const
};
const Callout = defineUi<UI.ComponentProps<"span"> & {
  direction?: ArrowDirection;
  curve?: ArrowCurve;
  head?: ArrowHead;
  tone?: MarkPen;
  weight?: MarkWeight;
  bend?: "up" | "down";
  arrow?: boolean;
  arrowClassName?: string;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
}>("Callout", ["direction", "curve", "head", "tone", "weight", "bend", "arrow", "arrowClassName", "animate", "show", "delay", "seed", "class"], (_props, {
  slots: _slots
}) => {
  const direction = computed(() => _props["direction"] === undefined ? "left" as const : _props["direction"]);
  const curve = computed(() => _props["curve"] === undefined ? "curved" as const : _props["curve"]);
  const head = computed(() => _props["head"] === undefined ? "v" as const : _props["head"]);
  const tone = computed(() => _props["tone"] === undefined ? "blue" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const bend = computed(() => _props["bend"] === undefined ? "up" as const : _props["bend"]);
  const arrow = computed(() => _props["arrow"] === undefined ? true : _props["arrow"]);
  const arrowClassName = computed(() => _props["arrowClassName"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["direction", "curve", "head", "tone", "weight", "bend", "arrow", "arrowClassName", "animate", "show", "delay", "seed", "class", "children", "ref"]));
  const _hook16 = useMarkPhase(() => ({
    animate: animate.value,
    show: show.value
  }));
  const phaseRef = computed(() => _hook16.value.phaseRef);
  const phaseProps = computed(() => _hook16.value.phaseProps);
  const arrowEl = renderValue(() => arrow.value ? <Arrow aria-hidden direction={direction.value} curve={curve.value} head={head.value} tone={tone.value} weight={weight.value} bend={bend.value} animate={animate.value} show={show.value} delay={(delay.value ?? 0) + 250} seed={seed.value === undefined ? undefined : `${seed.value}:arrow`} class={cn("h-10 w-14", arrowClassName.value)} /> : null);
  const vertical = computed(() => direction.value === "up" || direction.value === "down");
  return () => {
    return <span data-slot="callout" role="note" ref={useMergedRef<HTMLElement>(phaseRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(phaseProps.value)} class={cn("group/callout inline-flex gap-1.5 data-[mark=off]:hidden", LAYOUT[direction.value], vertical.value && "gap-0.5", className.value)} {...domProps(props.value)}>
      <Handwritten as="span" seed={seed.value} data-slot="callout-text" style={cssStyle(animate.value && delay.value ? {
        transitionDelay: `${delay.value}ms`
      } as UI.CSSProperties : undefined)} class={cn("max-w-[16ch] font-script text-[22px] leading-[1.05] text-ink-you", animate.value && "transition-opacity duration-(--ll-dur-sheet) ease-out group-data-[mark=idle]/callout:opacity-0", vertical.value && "max-w-[22ch] text-center")}>
        {readSlot(_slots.default)}
      </Handwritten>
      {arrowEl.value}
    </span>;
  };
});
export { Callout };
