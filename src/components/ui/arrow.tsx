// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { MARK_REVEAL, useMarkPhase } from "@/hooks/use-mark-ink";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { arrowRecipe, type ArrowCurve, type ArrowDirection, type ArrowHead } from "@/lib/ink/recipes/arrow-ink";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
type Target = UI.RefObject<Element | null> | Element | string | null | undefined;
const LABEL_SIDE: Record<ArrowDirection, string> = {
  right: "end-full top-1/2 me-2 -translate-y-1/2" as const,
  left: "start-full top-1/2 ms-2 -translate-y-1/2" as const,
  up: "top-full left-1/2 mt-1 -translate-x-1/2" as const,
  down: "bottom-full left-1/2 mb-1 -translate-x-1/2" as const,
  "up-right": "end-full bottom-0 me-2" as const,
  "up-left": "start-full bottom-0 ms-2" as const,
  "down-right": "end-full top-0 me-2" as const,
  "down-left": "start-full top-0 ms-2" as const
};
function resolveTarget(t: Target): Element | null {
  if (!t) return null;
  if (typeof t === "string") return document.querySelector(t);
  if (t instanceof Element) return t;
  return t.value;
}
function vectorTo(host: Element, target: Element, gap: number): {
  dx: number;
  dy: number;
} | null {
  const a = host.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const cx = a.left + a.width / 2,
    cy = a.top + a.height / 2;
  const vx = b.left + b.width / 2 - cx,
    vy = b.top + b.height / 2 - cy;
  const len = Math.hypot(vx, vy);
  if (len < 1) return null;
  const enter = (lo: number, hi: number, o: number, v: number) => v === 0 ? o >= lo && o <= hi ? -Infinity : Infinity : Math.min((lo - o) / v, (hi - o) / v);
  const t = Math.max(enter(b.left, b.right, cx, vx), enter(b.top, b.bottom, cy, vy));
  if (!(t >= 0 && t <= 1)) return null;
  const reach = Math.max(0, len * t - gap);
  return {
    dx: Math.round(vx / len * reach / 2) * 2,
    dy: Math.round(vy / len * reach / 2) * 2
  };
}
const Arrow = defineUi<UI.ComponentProps<"span"> & {
  direction?: ArrowDirection;
  curve?: ArrowCurve;
  head?: ArrowHead;
  tone?: MarkPen;
  weight?: MarkWeight;
  bend?: "up" | "down";
  mirror?: boolean;
  pointAt?: Target;
  gap?: number;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
}>("Arrow", ["direction", "curve", "head", "tone", "weight", "bend", "mirror", "pointAt", "gap", "animate", "show", "delay", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const direction = computed(() => _props["direction"] === undefined ? "right" as const : _props["direction"]);
  const curve = computed(() => _props["curve"] === undefined ? "straight" as const : _props["curve"]);
  const head = computed(() => _props["head"] === undefined ? "v" as const : _props["head"]);
  const tone = computed(() => _props["tone"] === undefined ? "ink" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const bend = computed(() => _props["bend"] === undefined ? "up" as const : _props["bend"]);
  const mirror = computed(() => _props["mirror"] === undefined ? true : _props["mirror"]);
  const pointAt = computed(() => _props["pointAt"]);
  const gap = computed(() => _props["gap"] === undefined ? 6 : _props["gap"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["direction", "curve", "head", "tone", "weight", "bend", "mirror", "pointAt", "gap", "animate", "show", "delay", "seed", "class", "style", "children", "ref"]));
  const host = shallowRef<HTMLElement | null>(initialState(null));
  const setHost = stateSetter(host);
  const vec = shallowRef<{
    dx: number;
    dy: number;
  } | null>(initialState(null));
  const setVec = stateSetter(vec);
  const aimed = computed(() => pointAt.value !== undefined && pointAt.value !== null);
  watchDependencies(() => {
    if (!aimed.value || !host.value) return;
    const update = () => {
      const t = resolveTarget(pointAt.value);
      const v = t ? vectorTo(host.value, t, gap.value) : null;
      setVec(prev => prev && v && prev.dx === v.dx && prev.dy === v.dy ? prev : v);
    };
    update();
    const stops: Array<() => void> = [];
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(host.value);
      const t = resolveTarget(pointAt.value);
      if (t) ro.observe(t);
      ro.observe(document.documentElement);
      stops.push(() => ro.disconnect());
    }
    window.addEventListener("resize", update);
    stops.push(() => window.removeEventListener("resize", update));
    void document.fonts?.ready?.then(update);
    return () => stops.forEach(s => s());
  }, () => [aimed.value, host.value, pointAt.value, gap.value], true);
  const params = computed(() => ({
    direction: direction.value,
    curve: curve.value,
    head: head.value,
    tone: tone.value,
    weight: weight.value,
    bend: bend.value,
    mirror: mirror.value,
    animate: animate.value,
    ...(aimed.value && vec.value ? {
      dx: vec.value.dx,
      dy: vec.value.dy
    } : {})
  }));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: arrowRecipe,
    params: params.value,
    kind: "arrow" as const,
    seed: seed.value
  }));
  const _hook26 = useMarkPhase(() => ({
    animate: animate.value,
    show: show.value
  }));
  const phaseRef = computed(() => _hook26.value.phaseRef);
  const phaseProps = computed(() => _hook26.value.phaseProps);
  const ready = computed(() => !!node.value && show.value && !(aimed.value && !vec.value));
  return () => {
    return <span data-slot="arrow" data-direction={aimed.value ? undefined : direction.value} ref={useMergedRef<HTMLElement>(hostRef, phaseRef.value, ref.value as UI.Ref<HTMLElement> | undefined, setHost)} {...domProps(ready.value ? hostProps.value : {})} {...domProps(phaseProps.value)} style={cssStyle({
      ...(animate.value ? {
        "--ll-draw-delay": `${delay.value ?? 0}ms`
      } as UI.CSSProperties : undefined),
      ...style.value
    })} class={cn("relative isolate inline-block shrink-0 align-middle outline-none", aimed.value ? "size-6" as const : "h-10 w-20" as const, animate.value && MARK_REVEAL, className.value)} {...domProps(props.value)}>
      {ready.value ? node.value : null}
      {readSlot(_slots.default) ? <span data-slot="arrow-label" class={cn("absolute font-script text-xl leading-none whitespace-nowrap text-ink-you", !aimed.value && LABEL_SIDE[direction.value], aimed.value && "start-full top-1/2 ms-2 -translate-y-1/2")}>
          {readSlot(_slots.default)}
        </span> : null}
    </span>;
  };
});
export { Arrow };
