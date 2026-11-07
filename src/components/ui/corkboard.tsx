// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef, useId, proxyRefs } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useDensity, useInk, useMergedRef } from "@/lib/ink/vue";
import { CORK_FRAME, corkBoardRecipe, corkNoteRecipe, corkPinRecipe } from "@/lib/ink/recipes/corkboard-ink";
import { clamp, hashSeed } from "@/lib/ink/rng";
import type { PaintKey } from "@/lib/ink/paint";
import { cn } from "@/lib/utils";
interface NotePosition {
  x: number;
  y: number;
  r: number;
  z: number;
}
type CorkboardValue = Record<string, Partial<NotePosition>>;
interface CorkboardContextValue {
  positions: CorkboardValue;
  update(id: string, patch: Partial<NotePosition>, message?: string): void;
  topZ(): number;
  bounds(): {
    w: number;
    h: number;
  };
  onResize(fn: () => void): () => void;
  say(message: string): void;
  help: string;
  disabled: boolean;
}
const CorkboardContext = createContext<CorkboardContextValue | null>(null);
function useCorkboard(): ComputedRef<CorkboardContextValue> {
  const ctx = useContext(CorkboardContext);
  return computed(() => {
    if (!ctx.value) console.error("CorkboardNote must be used inside <Corkboard>");
    return ctx.value;
  });
}
const STEP = 8;
const BIG_STEP = 32;
const TURN = 4;
const MAX_TURN = 24;
const PIN_COLORS: readonly PaintKey[] = ["tomato", "sky", "lemon", "grass", "grape", "tangerine"];
type CorkboardProps = Omit<UI.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  value?: CorkboardValue;
  defaultValue?: CorkboardValue;
  onValueChange?: (value: CorkboardValue) => void;
  label?: string;
  disabled?: boolean;
  seed?: string | number;
};
const Corkboard = defineUi<CorkboardProps>("Corkboard", ["class", "value", "defaultValue", "onValueChange", "label", "disabled", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const value = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const label = computed(() => _props["label"] === undefined ? "Corkboard" as const : _props["label"]);
  const disabled = computed(() => _props["disabled"] === undefined ? false : _props["disabled"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "value", "defaultValue", "onValueChange", "label", "disabled", "seed"]));
  const inner = shallowRef<CorkboardValue>(initialState(defaultValue.value ?? {}));
  const setInner = stateSetter(inner);
  const controlled = computed(() => value.value !== undefined);
  const positions = computed(() => value.value !== undefined ? value.value : inner.value);
  const latest = shallowRef(positions.value);
  const surface = shallowRef<HTMLDivElement | null | null>(null);
  const status = shallowRef(initialState(""));
  const setStatus = stateSetter(status);
  const said = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const watchers = shallowRef(new Set<() => void>());
  const help = useId();
  const say = (message: string) => {
    clearTimeout(said.value);
    said.value = setTimeout(() => setStatus(message), 350);
  };
  const onResize = (fn: () => void) => {
    watchers.value.add(fn);
    return () => void watchers.value.delete(fn);
  };
  const update = (id: string, patch: Partial<NotePosition>, message?: string) => {
    const next: CorkboardValue = {
      ...latest.value,
      [id]: {
        ...latest.value[id],
        ...patch
      }
    };
    latest.value = next;
    if (!controlled.value) setInner(next);
    onValueChange.value?.(next);
    if (message) say(message);
  };
  watchDependencies(() => () => clearTimeout(said.value), () => [], false);
  watchDependencies(() => {
    const el = surface.value;
    const watching = watchers.value;
    watching.forEach(fn => fn());
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => watching.forEach(fn => fn()));
    ro.observe(el);
    return () => ro.disconnect();
  }, () => [], true);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: corkBoardRecipe,
    params: {
      frame: CORK_FRAME
    },
    kind: "corkboard" as const,
    seed: seed.value
  }));
  const ctx = computed<CorkboardContextValue>(() => ({
    positions: positions.value,
    update,
    topZ: () => Math.max(0, ...Object.values(latest.value).map(p => p.z ?? 0)),
    bounds: () => ({
      w: surface.value?.offsetWidth ?? 0,
      h: surface.value?.offsetHeight ?? 0
    }),
    onResize,
    say,
    help,
    disabled: disabled.value
  }));
  return () => {
    latest.value = positions.value;
    return <CorkboardContext.Provider value={ctx.value}>
      <div data-slot="corkboard" role="group" aria-label={label.value} aria-describedby={help} ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate min-h-64 w-full touch-manipulation bg-[color-mix(in_oklab,var(--ll-kraft),var(--ll-marker)_22%)] select-none", className.value)} {...domProps(props.value)}>
        {node.value}
        <div ref={surface} data-slot="corkboard-surface" class="absolute" style={cssStyle({
          inset: CORK_FRAME
        })}>
          {readSlot(_slots.default)}
        </div>
        <span id={help} class="sr-only">
          Notes can be moved with a pointer, or focus one and use the arrow keys (Shift for bigger steps). R turns it clockwise, Shift R back. Enter brings it to the front.
        </span>
        <span role="status" class="sr-only">
          {status.value}
        </span>
      </div>
    </CorkboardContext.Provider>;
  };
});
type CorkboardNoteProps = Omit<UI.ComponentProps<"div">, "id"> & {
  id: string;
  x?: number;
  y?: number;
  rotate?: number;
  stock?: PaperProps["stock"];
  pinned?: boolean;
  pinColor?: PaintKey;
  label?: string;
  paperProps?: Omit<PaperProps, "children" | "ref" | "stock">;
  bare?: boolean;
  seed?: string | number;
};
const CorkboardNote = defineUi<CorkboardNoteProps>("CorkboardNote", ["id", "x", "y", "rotate", "stock", "pinned", "pinColor", "label", "class", "style", "paperProps", "bare", "seed", "onPointerdown", "onPointermove", "onPointerup", "onPointercancel", "onKeydown"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const x = computed(() => _props["x"] === undefined ? 16 : _props["x"]);
  const y = computed(() => _props["y"] === undefined ? 16 : _props["y"]);
  const rotate = computed(() => _props["rotate"]);
  const stock = computed(() => _props["stock"] === undefined ? "sticky-yellow" as const : _props["stock"]);
  const pinned = computed(() => _props["pinned"] === undefined ? true : _props["pinned"]);
  const pinColor = computed(() => _props["pinColor"]);
  const label = computed(() => _props["label"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const paperProps = computed(() => _props["paperProps"]);
  const bare = computed(() => _props["bare"] === undefined ? false : _props["bare"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const onPointerdown = computed(() => _props["onPointerdown"]);
  const onPointermove = computed(() => _props["onPointermove"]);
  const onPointerup = computed(() => _props["onPointerup"]);
  const onPointercancel = computed(() => _props["onPointercancel"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const props = computed(() => omitProps(_props, ["id", "x", "y", "rotate", "stock", "pinned", "pinColor", "label", "class", "style", "children", "paperProps", "bare", "seed", "ref", "onPointerdown", "onPointermove", "onPointerup", "onPointercancel", "onKeydown"]));
  const board = useCorkboard();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const at = computed(() => board.value.positions[id.value]);
  const auto = computed(() => calm.value ? 0 : Math.round((hashSeed(id.value) % 700 / 100 - 3.5) * 10) / 10);
  const pos = computed<NotePosition>(() => ({
    x: at.value?.x ?? x.value,
    y: at.value?.y ?? y.value,
    r: at.value?.r ?? rotate.value ?? auto.value,
    z: at.value?.z ?? 0
  }));
  const el = shallowRef<HTMLDivElement | null | null>(null);
  const drag = shallowRef<{
    pointer: number;
    sx: number;
    sy: number;
    x0: number;
    y0: number;
    x: number;
    y: number;
    moved: boolean;
    z: number;
  } | null | null>(null);
  const _hostCore = useInk(() => ({
    recipe: corkNoteRecipe,
    params: {},
    kind: "corkboard-note" as const,
    seed: seed.value
  }));
  const host = computed(() => proxyRefs(_hostCore));
  const pin = computed(() => pinColor.value ?? PIN_COLORS[hashSeed(id.value) % PIN_COLORS.length]);
  const limits = computed(() => () => {
    const b = board.value.bounds();
    const node = el.value;
    return {
      maxX: b.w && node ? Math.max(0, b.w - node.offsetWidth) : Infinity,
      maxY: b.h && node ? Math.max(0, b.h - node.offsetHeight) : Infinity
    };
  });
  const put = computed(() => (nx: number, ny: number) => {
    if (el.value) el.value.style.translate = `${nx}px ${ny}px`;
  });
  const rendered = shallowRef(pos.value);
  const fit = computed(() => () => {
    if (drag.value) return;
    const {
      maxX,
      maxY
    } = limits.value();
    put.value(clamp(rendered.value.x, 0, maxX), clamp(rendered.value.y, 0, maxY));
  });
  const fitLatest = shallowRef(fit.value);
  watchDependencies(() => board.value.onResize(() => fitLatest.value()), () => [board.value.onResize], true);
  const settle = computed(() => () => setTimeout(() => fitLatest.value(), 0));
  watchDependencies(() => fitLatest.value(), () => [pos.value.x, pos.value.y], true);
  const start = computed(() => (e: PointerEvent) => {
    onPointerdown.value?.(e);
    if (e.defaultPrevented || board.value.disabled || (e.button ?? 0) !== 0) return;
    if ((e.target as Element).closest("a, button, input, textarea, select, [contenteditable='true'], [data-corkboard-nodrag]")) return;
    const z = board.value.topZ() + 1;
    const {
      maxX,
      maxY
    } = limits.value();
    const x0 = clamp(pos.value.x, 0, maxX),
      y0 = clamp(pos.value.y, 0, maxY);
    drag.value = {
      pointer: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      x0,
      y0,
      x: x0,
      y: y0,
      moved: false,
      z
    };
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}
    (e.currentTarget as HTMLDivElement).dataset.dragging = "";
    (e.currentTarget as HTMLDivElement).style.zIndex = String(1 + z);
    (e.currentTarget as HTMLDivElement).focus({
      preventScroll: true
    });
  });
  const move = computed(() => (e: PointerEvent) => {
    onPointermove.value?.(e);
    const d = drag.value;
    if (!d || d.pointer !== e.pointerId) return;
    const dx = e.clientX - d.sx,
      dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 3) return;
    d.moved = true;
    const {
      maxX,
      maxY
    } = limits.value();
    d.x = clamp(d.x0 + dx, 0, maxX);
    d.y = clamp(d.y0 + dy, 0, maxY);
    put.value(d.x, d.y);
  });
  const finish = computed(() => (cancel: boolean) => (e: PointerEvent) => {
    if (cancel) onPointercancel.value?.(e);else onPointerup.value?.(e);
    const d = drag.value;
    if (!d || d.pointer !== e.pointerId) return;
    drag.value = null;
    const node = e.currentTarget as HTMLDivElement;
    delete node.dataset.dragging;
    if (cancel || !d.moved) {
      fit.value();
      node.style.zIndex = String(1 + pos.value.z);
      return;
    }
    node.dataset.dropped = "";
    board.value.update(id.value, {
      x: Math.round(d.x),
      y: Math.round(d.y),
      z: d.z
    }, `${label.value ?? id.value} moved to ${Math.round(d.x)}, ${Math.round(d.y)}.`);
    settle.value();
  });
  const keys = computed(() => (e: KeyboardEvent) => {
    onKeydown.value?.(e);
    if (e.defaultPrevented || board.value.disabled || e.target as HTMLDivElement !== e.currentTarget as HTMLDivElement || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (drag.value && k === "Escape") {
      const d = drag.value;
      drag.value = null;
      delete (e.currentTarget as HTMLDivElement).dataset.dragging;
      put.value(d.x0, d.y0);
      return;
    }
    const step = e.shiftKey ? BIG_STEP : STEP;
    const dx = k === "ArrowRight" ? step : k === "ArrowLeft" ? -step : 0;
    const dy = k === "ArrowDown" ? step : k === "ArrowUp" ? -step : 0;
    if (dx || dy) {
      e.preventDefault();
      const {
        maxX,
        maxY
      } = limits.value();
      const nx = clamp(pos.value.x + dx, 0, maxX),
        ny = clamp(pos.value.y + dy, 0, maxY);
      board.value.update(id.value, {
        x: nx,
        y: ny
      }, `${label.value ?? id.value} at ${nx}, ${ny}.`);
    } else if (k.toLowerCase() === "r") {
      e.preventDefault();
      const nr = clamp(pos.value.r + (e.shiftKey ? -TURN : TURN), -MAX_TURN, MAX_TURN);
      board.value.update(id.value, {
        r: nr
      }, `${label.value ?? id.value} turned to ${nr} degrees.`);
    } else if (k === "Enter" || k === " ") {
      e.preventDefault();
      board.value.update(id.value, {
        z: board.value.topZ() + 1
      }, `${label.value ?? id.value} brought to the front.`);
    }
  });
  return () => {
    rendered.value = pos.value;
    fitLatest.value = fit.value;
    return <div data-slot="corkboard-note" data-id={id.value} data-pinned={pinned.value ? "" as const : undefined} role="group" aria-roledescription="note" aria-label={label.value ?? id.value} aria-describedby={board.value.help} aria-disabled={board.value.disabled || undefined} tabindex={board.value.disabled ? undefined : 0} ref={useMergedRef<HTMLDivElement>(el, host.value.hostRef, ref.value)} {...domProps(host.value.hostProps)} onPointerdown={start.value} onPointermove={move.value} onPointerup={finish.value(false)} onPointercancel={finish.value(true)} onKeydown={keys.value} onAnimationend={e => delete e.currentTarget.dataset.dropped} class={cn("group absolute top-0 left-0 isolate w-44 touch-none [transition:scale_var(--ll-dur-hover)_var(--ll-ease-settle)] outline-none", board.value.disabled ? "cursor-default" as const : "cursor-grab data-dragging:cursor-grabbing hover:scale-[1.015] data-dragging:scale-[1.05]" as const, "data-dragging:[&_[data-slot=corkboard-sheet]]:[--ll-sheet-shadow:var(--ll-shadow-lift)]", className.value)} style={cssStyle({
      translate: `${pos.value.x}px ${pos.value.y}px`,
      rotate: `${pos.value.r}deg`,
      zIndex: 1 + pos.value.z,
      ...style.value
    })} {...domProps(props.value)}>
      {host.value.node}
      {bare.value ? <div data-slot="corkboard-sheet">{readSlot(_slots.default)}</div> : <Paper data-slot="corkboard-sheet" stock={stock.value} edge="cut" tilt={false} tape={pinned.value ? false : "top" as const} class="w-full font-script text-xl leading-tight" {...domProps(paperProps.value)}>
          <div class="px-3.5 pt-6 pb-4">{readSlot(_slots.default)}</div>
        </Paper>}
      {pinned.value ? <Pin color={pin.value} seed={`${id.value}|pin`} /> : null}
    </div>;
  };
});
const Pin = defineUi<{
  color: PaintKey;
  seed: string;
}>("Pin", ["color", "seed"], (_props, {
  slots: _slots
}) => {
  const color = computed(() => _props["color"]);
  const seed = computed(() => _props["seed"]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: corkPinRecipe,
    params: {
      color: color.value
    },
    kind: "corkboard-pin" as const,
    seed: seed.value,
    size: [24, 24]
  }));
  return () => {
    return <span data-slot="corkboard-pin" aria-hidden="true" ref={hostRef} {...domProps(hostProps.value)} class="pointer-events-none absolute -top-2.5 left-1/2 z-(--ll-z-prop) size-6 -translate-x-1/2 transition-[translate,scale] duration-(--ll-dur-hover) ease-(--ll-ease-settle) group-data-dragging:-translate-y-1.5 group-data-dragging:scale-110 group-data-dropped:animate-pop calm:hidden">
      {node.value}
    </span>;
  };
});
export { Corkboard, CorkboardNote };
export type { CorkboardProps, CorkboardNoteProps, CorkboardValue, NotePosition };
