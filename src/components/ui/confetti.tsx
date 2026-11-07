// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { Slot } from "@/lib/primitives";
import { motionIsOff } from "@/hooks/use-live-motion";
import { useMergedRef } from "@/lib/ink/vue";
import { CONFETTI_COLORS, CONFETTI_KINDS, STEP_MS, confettiPiece, simulate, type ConfettiColor, type ConfettiKind } from "@/lib/ink/recipes/confetti-ink";
import { cn } from "@/lib/utils";
type Origin = Element | {
  x: number;
  y: number;
} | {
  clientX: number;
  clientY: number;
} | null | undefined;
interface ConfettiOptions {
  origin?: Origin;
  count?: number;
  spread?: number;
  angle?: number;
  velocity?: number;
  gravity?: number;
  drift?: number;
  duration?: number;
  colors?: readonly ConfettiColor[];
  shapes?: readonly ConfettiKind[];
  scalar?: number;
  seed?: number;
  onDone?: () => void;
}
let bursts = 0;
const layers = new WeakMap<Element, HTMLElement>();
function layerFor(host: HTMLElement): HTMLElement {
  const known = layers.get(host);
  if (known?.isConnected) return known;
  const layer = document.createElement("div");
  layer.setAttribute("data-slot", "confetti-layer");
  layer.setAttribute("aria-hidden", "true");
  const s = layer.style;
  s.pointerEvents = "none";
  s.overflow = "hidden";
  s.position = host === document.body ? "fixed" as const : "absolute" as const;
  s.inset = "0";
  s.zIndex = "var(--ll-z-splash)";
  host.appendChild(layer);
  layers.set(host, layer);
  return layer;
}
const centreOf = (el: Element) => {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2
  };
};
function confetti(options: ConfettiOptions & {
  container?: HTMLElement | null;
} = {}): () => void {
  if (typeof document === "undefined") return () => {};
  const host = options.container ?? document.body;
  if (motionIsOff(host)) return () => {};
  const layer = layerFor(host);
  const box = layer.getBoundingClientRect();
  const at = options.origin;
  const o = at && "getBoundingClientRect" in at ? centreOf(at) : at && "clientX" in at ? {
    x: at.clientX,
    y: at.clientY
  } : at && "x" in at ? at : {
    x: box.left + box.width / 2,
    y: box.top + box.height / 2
  };
  const ox = o.x - box.left,
    oy = o.y - box.top;
  const duration = options.duration ?? 2600;
  const flights = simulate({
    count: Math.min(400, Math.max(0, Math.round(options.count ?? 70))),
    spread: options.spread ?? 70,
    angle: options.angle ?? 90,
    velocity: options.velocity ?? 1100,
    gravity: options.gravity ?? 520,
    drift: options.drift ?? 0,
    duration,
    seed: options.seed ?? ++bursts
  }, options.shapes ?? CONFETTI_KINDS, options.colors ?? CONFETTI_COLORS);
  const scalar = options.scalar ?? 1;
  const live = new Set<Animation>();
  const pieces: Element[] = [];
  const done = (el: Element) => {
    el.remove();
    if (!layer.childElementCount) layer.remove();
  };
  let over = false;
  const end = () => {
    if (over) return;
    over = true;
    live.clear();
    pieces.length = 0;
    options.onDone?.();
  };
  for (const f of flights) {
    const p = confettiPiece(f.kind, f.color, f.variant);
    const k = f.scale * scalar;
    const wrap = document.createElement("div");
    wrap.innerHTML = `<svg aria-hidden="true" focusable="false" viewBox="0 0 ${p.w} ${p.h}" width="${(p.w * k).toFixed(1)}" height="${(p.h * k).toFixed(1)}" style="position:absolute;left:${(-p.w * k / 2).toFixed(1)}px;top:${(-p.h * k / 2).toFixed(1)}px;will-change:transform,opacity;overflow:visible">${p.svg}</svg>`;
    const el = wrap.firstElementChild as SVGElement;
    layer.appendChild(el);
    pieces.push(el);
    if (typeof el.animate !== "function") {
      done(el);
      continue;
    }
    const anim = el.animate(f.frames.map(fr => ({
      transform: `translate(${(ox + fr.x).toFixed(1)}px, ${(oy + fr.y).toFixed(1)}px) rotate(${fr.rot.toFixed(0)}deg) scale(1, ${fr.flip.toFixed(2)})`,
      opacity: fr.opacity
    })), {
      duration: (f.frames.length - 1) * STEP_MS,
      easing: "linear" as const,
      fill: "forwards" as const
    });
    live.add(anim);
    anim.onfinish = () => {
      live.delete(anim);
      done(el);
      if (!live.size) end();
    };
  }
  if (!live.size) end();
  return () => {
    for (const a of live) a.cancel();
    for (const el of pieces) done(el);
    end();
  };
}
interface ConfettiHandle {
  burst(options?: ConfettiOptions): () => void;
}
type ConfettiProps = Omit<UI.ComponentProps<"div">, "children"> & ConfettiOptions & {
  active?: boolean;
  burstKey?: number | string;
  apiRef?: UI.Ref<ConfettiHandle>;
};
const Confetti = defineUi<ConfettiProps>("Confetti", ["class", "active", "burstKey", "apiRef", "origin", "count", "spread", "angle", "velocity", "gravity", "drift", "duration", "colors", "shapes", "scalar", "seed", "onDone"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const active = computed(() => _props["active"]);
  const burstKey = computed(() => _props["burstKey"]);
  const apiRef = computed(() => _props["apiRef"]);
  const origin = computed(() => _props["origin"]);
  const count = computed(() => _props["count"]);
  const spread = computed(() => _props["spread"]);
  const angle = computed(() => _props["angle"]);
  const velocity = computed(() => _props["velocity"]);
  const gravity = computed(() => _props["gravity"]);
  const drift = computed(() => _props["drift"]);
  const duration = computed(() => _props["duration"]);
  const colors = computed(() => _props["colors"]);
  const shapes = computed(() => _props["shapes"]);
  const scalar = computed(() => _props["scalar"]);
  const seed = computed(() => _props["seed"]);
  const onDone = computed(() => _props["onDone"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "active", "burstKey", "apiRef", "origin", "count", "spread", "angle", "velocity", "gravity", "drift", "duration", "colors", "shapes", "scalar", "seed", "onDone", "ref"]));
  const el = shallowRef<HTMLDivElement | null | null>(null);
  const opts = computed(() => ({
    origin: origin.value,
    count: count.value,
    spread: spread.value,
    angle: angle.value,
    velocity: velocity.value,
    gravity: gravity.value,
    drift: drift.value,
    duration: duration.value,
    colors: colors.value,
    shapes: shapes.value,
    scalar: scalar.value,
    seed: seed.value,
    onDone: onDone.value
  }));
  const latest = shallowRef(opts.value);
  const flying = shallowRef(new Set<() => void>());
  const throwIt = (extra?: ConfettiOptions) => {
    const merged = {
      ...latest.value,
      ...extra
    };
    let over = false;
    let stop: () => void = () => {};
    stop = confetti({
      ...merged,
      container: el.value,
      onDone: () => {
        over = true;
        flying.value.delete(stop);
        merged.onDone?.();
      }
    });
    if (!over) flying.value.add(stop);
    return stop;
  };
  useImperativeHandle(apiRef.value, () => ({
    burst: throwIt
  }));
  watchDependencies(() => {
    if (active.value) throwIt();
  }, () => [active.value, throwIt], false);
  const key = shallowRef(burstKey.value);
  watchDependencies(() => {
    if (key.value !== burstKey.value) {
      key.value = burstKey.value;
      throwIt();
    }
  }, () => [burstKey.value, throwIt], false);
  watchDependencies(() => {
    const set = flying.value;
    return () => {
      for (const stop of [...set]) stop();
      set.clear();
    };
  }, () => [], false);
  return () => {
    latest.value = opts.value;
    return <div data-slot="confetti" aria-hidden="true" ref={useMergedRef<HTMLDivElement>(el, ref.value)} class={cn("pointer-events-none absolute inset-0 overflow-hidden", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
type ConfettiTriggerProps = UI.ComponentProps<"button"> & ConfettiOptions & {
  asChild?: boolean;
};
const ConfettiTrigger = defineUi<ConfettiTriggerProps>("ConfettiTrigger", ["asChild", "onClick", "origin", "count", "spread", "angle", "velocity", "gravity", "drift", "duration", "colors", "shapes", "scalar", "seed", "onDone"], (_props, {
  slots: _slots
}) => {
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const onClick = computed(() => _props["onClick"]);
  const origin = computed(() => _props["origin"]);
  const count = computed(() => _props["count"]);
  const spread = computed(() => _props["spread"]);
  const angle = computed(() => _props["angle"]);
  const velocity = computed(() => _props["velocity"]);
  const gravity = computed(() => _props["gravity"]);
  const drift = computed(() => _props["drift"]);
  const duration = computed(() => _props["duration"]);
  const colors = computed(() => _props["colors"]);
  const shapes = computed(() => _props["shapes"]);
  const scalar = computed(() => _props["scalar"]);
  const seed = computed(() => _props["seed"]);
  const onDone = computed(() => _props["onDone"]);
  const props = computed(() => omitProps(_props, ["asChild", "onClick", "origin", "count", "spread", "angle", "velocity", "gravity", "drift", "duration", "colors", "shapes", "scalar", "seed", "onDone"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "button" as const));
  return () => {
    return <Comp.value data-slot="confetti-trigger" type={asChild.value ? undefined : "button" as const} onClick={(e: MouseEvent) => {
      onClick.value?.(e);
      if (!e.defaultPrevented) confetti({
        origin: origin.value ?? e.currentTarget as HTMLButtonElement,
        count: count.value,
        spread: spread.value,
        angle: angle.value,
        velocity: velocity.value,
        gravity: gravity.value,
        drift: drift.value,
        duration: duration.value,
        colors: colors.value,
        shapes: shapes.value,
        scalar: scalar.value,
        seed: seed.value,
        onDone: onDone.value
      });
    }} {...domProps(props.value)}>{_slots.default?.()}</Comp.value>;
  };
});
function useConfetti(_source0: MaybeRefOrGetter<ConfettiOptions> = {}): ComputedRef<(options?: ConfettiOptions) => () => void> {
  const defaults = computed(() => toValue(_source0) === undefined ? {} : toValue(_source0));
  const latest = shallowRef(defaults.value);
  const _nestedHook0 = (options?: ConfettiOptions) => confetti({
    ...latest.value,
    ...options
  });
  return computed(() => {
    latest.value = defaults.value;
    return _nestedHook0;
  });
}
export { confetti, Confetti, ConfettiTrigger, useConfetti };
export type { ConfettiOptions, ConfettiProps, ConfettiHandle, ConfettiTriggerProps, ConfettiColor, ConfettiKind };
