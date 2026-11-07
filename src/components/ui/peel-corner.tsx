// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef, useId, proxyRefs } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { motionIsOff } from "@/hooks/use-live-motion";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import type { PaintKey } from "@/lib/ink/paint";
import { PEEL_UNIT, peelFlapRecipe, peelTriggerRecipe } from "@/lib/ink/recipes/peel-corner-ink";
import { clamp } from "@/lib/ink/rng";
import { cn } from "@/lib/utils";
const REST = 0.2;
const PEEK = 0.42;
const OPEN = 1;
const MAX = 1.3;
const HIT = 56;
type Corner = "bottom-right" | "bottom-left";
interface PeelContextValue {
  open: boolean;
  under: string;
}
const PeelContext = createContext<PeelContextValue | null>(null);
function usePeelCorner(): ComputedRef<PeelContextValue> {
  const ctx = useContext(PeelContext);
  return computed(() => {
    if (!ctx.value) console.error("PeelCorner parts must be used inside <PeelCorner>");
    return ctx.value;
  });
}
type PeelCornerProps = Omit<UI.ComponentProps<"div">, "onChange"> & {
  peeled?: boolean;
  defaultPeeled?: boolean;
  onPeeledChange?: (peeled: boolean) => void;
  size?: number;
  corner?: Corner;
  back?: PaintKey;
  label?: string;
  seed?: string | number;
};
const PeelCorner = defineUi<PeelCornerProps>("PeelCorner", ["class", "peeled", "defaultPeeled", "onPeeledChange", "size", "corner", "back", "label", "seed", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const peeledProp = computed(() => _props["peeled"]);
  const defaultPeeled = computed(() => _props["defaultPeeled"] === undefined ? false : _props["defaultPeeled"]);
  const onPeeledChange = computed(() => _props["onPeeledChange"]);
  const size = computed(() => _props["size"] === undefined ? PEEL_UNIT : _props["size"]);
  const corner = computed(() => _props["corner"] === undefined ? "bottom-right" as const : _props["corner"]);
  const back = computed(() => _props["back"] === undefined ? "paper" as const : _props["back"]);
  const label = computed(() => _props["label"] === undefined ? "Peel back the corner" as const : _props["label"]);
  const seed = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "peeled", "defaultPeeled", "onPeeledChange", "size", "corner", "back", "label", "seed", "style"]));
  const inner = shallowRef(initialState(defaultPeeled.value));
  const setInner = stateSetter(inner);
  const open = computed(() => peeledProp.value ?? inner.value);
  const left = computed(() => corner.value === "bottom-left");
  const root = shallowRef<HTMLDivElement | null | null>(null);
  const k = shallowRef(open.value ? OPEN : REST);
  const frame = shallowRef(0);
  const drag = shallowRef<{
    pointer: number;
    moved: boolean;
    startX: number;
    startY: number;
  } | null | null>(null);
  const under = useId();
  const _flapCore = useInk(() => ({
    recipe: peelFlapRecipe,
    params: {
      back: back.value,
      mirror: left.value
    },
    kind: "peel-corner-flap" as const,
    size: [size.value, size.value],
    seed: seed.value
  }));
  const flap = computed(() => proxyRefs(_flapCore));
  const _hitCore = useInk(() => ({
    recipe: peelTriggerRecipe,
    params: {},
    kind: "peel-corner-trigger" as const,
    size: [HIT, HIT],
    seed: seed.value === undefined ? undefined : `${seed.value}|hit`
  }));
  const hit = computed(() => proxyRefs(_hitCore));
  const paint = computed(() => (v: number) => {
    k.value = v;
    root.value?.style.setProperty("--peel-k", v.toFixed(3));
  });
  const tween = computed(() => (to: number) => {
    cancelAnimationFrame(frame.value);
    const from = k.value;
    if (motionIsOff(root.value) || Math.abs(to - from) < 0.005) return paint.value(to);
    let t0 = -1;
    const step = (now: number) => {
      if (t0 < 0) t0 = now;
      const t = clamp((now - t0) / 260, 0, 1);
      paint.value(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame.value = requestAnimationFrame(step);
    };
    frame.value = requestAnimationFrame(step);
  });
  const openNow = shallowRef(open.value);
  const decline = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  watchDependencies(() => () => {
    cancelAnimationFrame(frame.value);
    clearTimeout(decline.value);
  }, () => [], false);
  const settled = shallowRef(open.value);
  watchDependencies(() => {
    if (settled.value === open.value) return;
    settled.value = open.value;
    tween.value(open.value ? OPEN : REST);
  }, () => [open.value], false);
  const set = computed(() => (v: boolean) => {
    settled.value = v;
    if (peeledProp.value === undefined) setInner(v);
    onPeeledChange.value?.(v);
    tween.value(v ? OPEN : REST);
    if (peeledProp.value !== undefined) {
      clearTimeout(decline.value);
      decline.value = setTimeout(() => {
        if (openNow.value === v) return;
        settled.value = openNow.value;
        tween.value(openNow.value ? OPEN : REST);
      }, 0);
    }
  });
  const pull = computed(() => (e: PointerEvent) => {
    const r = root.value?.getBoundingClientRect();
    if (!r) return REST;
    const p = left.value ? (e.clientX - r.left + (r.bottom - e.clientY)) / 2 : (r.right - e.clientX + (r.bottom - e.clientY)) / 2;
    return clamp(p / size.value, 0.05, MAX);
  });
  const down = computed(() => (e: PointerEvent) => {
    if ((e.button ?? 0) !== 0) return;
    drag.value = {
      pointer: e.pointerId,
      moved: false,
      startX: e.clientX,
      startY: e.clientY
    };
    try {
      (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
    } catch {}
    cancelAnimationFrame(frame.value);
    root.value?.setAttribute("data-dragging", "");
  });
  const move = computed(() => (e: PointerEvent) => {
    const d = drag.value;
    if (!d || d.pointer !== e.pointerId) return;
    if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 4) d.moved = true;
    if (d.moved) paint.value(pull.value(e));
  });
  const up = computed(() => (cancel: boolean) => (e: PointerEvent) => {
    const d = drag.value;
    if (!d || d.pointer !== e.pointerId) return;
    drag.value = null;
    root.value?.removeAttribute("data-dragging");
    if (cancel) return tween.value(open.value ? OPEN : REST);
    if (!d.moved) return set.value(!open.value);
    const v = k.value >= 0.62;
    if (v !== open.value) set.value(v);else tween.value(v ? OPEN : REST);
  });
  const _nestedHook0 = shallowRef(String(open.value ? OPEN : REST));
  const first = computed(() => _nestedHook0.value);
  const vars = computed(() => ({
    "--peel-size": `${size.value}px`,
    "--peel-k": first.value,
    "--peel": "calc(var(--peel-k) * var(--peel-size))" as const
  }) as UI.CSSProperties);
  const origin = computed(() => left.value ? "left-0 origin-bottom-left" as const : "right-0 origin-bottom-right" as const);
  return () => {
    openNow.value = open.value;
    return <PeelContext.Provider value={{
      open: open.value,
      under
    }}>
      <div data-slot="peel-corner" data-state={open.value ? "open" as const : "closed" as const} data-corner={corner.value} ref={useMergedRef<HTMLDivElement>(root, ref.value)} class={cn("group/peel relative isolate inline-block", className.value)} style={cssStyle({
        ...vars.value,
        ...style.value
      })} {...domProps(props.value)}>
        {readSlot(_slots.default)}
        <span aria-hidden="true" data-slot="peel-corner-flap" ref={flap.value.hostRef} {...domProps(flap.value.hostProps)} class={cn("pointer-events-none absolute bottom-0 z-2 [scale:var(--peel-k)]", origin.value)} style={cssStyle({
          width: size.value,
          height: size.value
        })}>
          {flap.value.node}
        </span>
        <button type="button" data-slot="peel-corner-trigger" aria-label={label.value} aria-expanded={open.value} aria-controls={under} ref={hit.value.hostRef} {...domProps(hit.value.hostProps)} onPointerenter={() => !open.value && !drag.value && tween.value(PEEK)} onPointerleave={() => !drag.value && tween.value(open.value ? OPEN : REST)} onPointerdown={down.value} onPointermove={move.value} onPointerup={up.value(false)} onPointercancel={up.value(true)} onClick={(e: PointerEvent) => {
          if (e.detail === 0) set.value(!open.value);
        }} class={cn("absolute bottom-0 z-3 cursor-grab touch-none active:cursor-grabbing", left.value ? "left-0" as const : "right-0" as const)} style={cssStyle({
          width: HIT,
          height: HIT
        })}>
          {hit.value.node}
        </button>
      </div>
    </PeelContext.Provider>;
  };
});
type PageProps = Omit<PaperProps, "ref"> & {
  ref?: UI.Ref<HTMLElement>;
};
const PeelCornerPage = defineUi<PageProps>("PeelCornerPage", ["class", "stock", "tilt"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const tilt = computed(() => _props["tilt"] === undefined ? false : _props["tilt"]);
  const props = computed(() => omitProps(_props, ["class", "children", "stock", "tilt"]));
  usePeelCorner();
  return () => {
    return <Paper data-slot="peel-corner-page" stock={stock.value} tilt={tilt.value} class={cn("relative z-1 [clip-path:polygon(-40px_-40px,calc(100%+40px)_-40px,calc(100%+40px)_calc(100%-var(--peel)-40px),calc(100%-var(--peel)-40px)_calc(100%+40px),-40px_calc(100%+40px))]", "group-data-[corner=bottom-left]/peel:[clip-path:polygon(-40px_-40px,calc(100%+40px)_-40px,calc(100%+40px)_calc(100%+40px),calc(var(--peel)+40px)_calc(100%+40px),-40px_calc(100%-var(--peel)-40px))]", "p-5", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
    </Paper>;
  };
});
const PeelCornerUnder = defineUi<PageProps>("PeelCornerUnder", ["class", "stock"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const stock = computed(() => _props["stock"] === undefined ? "kraft" as const : _props["stock"]);
  const props = computed(() => omitProps(_props, ["class", "children", "stock"]));
  const _hook4 = usePeelCorner();
  const open = computed(() => _hook4.value.open);
  const under = computed(() => _hook4.value.under);
  return () => {
    return <Paper id={under.value} data-slot="peel-corner-under" data-state={open.value ? "open" as const : "closed" as const} stock={stock.value} tilt={false} inert={!open.value} aria-hidden={!open.value || undefined} class={cn("absolute inset-0 z-0 flex items-end justify-end p-3 group-data-[corner=bottom-left]/peel:justify-start", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
    </Paper>;
  };
});
export { PeelCorner, PeelCornerPage, PeelCornerUnder, usePeelCorner };
export type { PeelCornerProps };
