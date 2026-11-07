// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef, useId, proxyRefs } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { motionIsOff } from "@/hooks/use-live-motion";
import { useInk, useInkContext, useMergedRef } from "@/lib/ink/vue";
import { tearHintRecipe, tearSeamRecipe, tearStubRecipe } from "@/lib/ink/recipes/tear-off-ink";
import { clamp } from "@/lib/ink/rng";
import { cn } from "@/lib/utils";
type Orientation = "horizontal" | "vertical";
interface TearOffContextValue {
  torn: boolean;
  gone: boolean;
  restored: boolean;
  orientation: Orientation;
  rtl: boolean;
  disabled: boolean;
  help: string;
  tear(): void;
}
const TearOffContext = createContext<TearOffContextValue | null>(null);
function useTearOff(): ComputedRef<TearOffContextValue> {
  const ctx = useContext(TearOffContext);
  return computed(() => {
    if (!ctx.value) console.error("TearOff parts must be used inside <TearOff>");
    return ctx.value;
  });
}
type TearOffProps = Omit<UI.ComponentProps<"div">, "onChange"> & {
  torn?: boolean;
  defaultTorn?: boolean;
  onTornChange?: (torn: boolean) => void;
  onTear?: () => void;
  orientation?: Orientation;
  disabled?: boolean;
  tornMessage?: string;
};
const TearOff = defineUi<TearOffProps>("TearOff", ["class", "torn", "defaultTorn", "onTornChange", "onTear", "orientation", "disabled", "tornMessage"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const tornProp = computed(() => _props["torn"]);
  const defaultTorn = computed(() => _props["defaultTorn"] === undefined ? false : _props["defaultTorn"]);
  const onTornChange = computed(() => _props["onTornChange"]);
  const onTear = computed(() => _props["onTear"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const disabled = computed(() => _props["disabled"] === undefined ? false : _props["disabled"]);
  const tornMessage = computed(() => _props["tornMessage"] === undefined ? "Torn off." as const : _props["tornMessage"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "torn", "defaultTorn", "onTornChange", "onTear", "orientation", "disabled", "tornMessage"]));
  const inner = shallowRef(initialState(defaultTorn.value));
  const setInner = stateSetter(inner);
  const gone = shallowRef(initialState(defaultTorn.value));
  const setGone = stateSetter(gone);
  const restored = shallowRef(initialState(false));
  const setRestored = stateSetter(restored);
  const domRtl = shallowRef(initialState(false));
  const setDomRtl = stateSetter(domRtl);
  const _nestedHook0 = useInkContext();
  const ctxDir = computed(() => _nestedHook0.value.dir);
  const rtl = computed(() => domRtl.value || ctxDir.value === "rtl");
  const root = shallowRef<HTMLDivElement | null | null>(null);
  const torn = computed(() => tornProp.value ?? inner.value);
  const help = useId();
  const timer = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wasTorn = shallowRef(torn.value);
  const heldFocus = shallowRef(false);
  watchDependencies(() => {
    if (root.value) setDomRtl(getComputedStyle(root.value).direction === "rtl");
  }, () => [], true);
  watchDependencies(() => {
    clearTimeout(timer.value);
    if (torn.value) {
      if (heldFocus.value) root.value?.focus({
        preventScroll: true
      });
      heldFocus.value = false;
      timer.value = setTimeout(() => setGone(true), motionIsOff(root.value) ? 0 : 420);
    } else {
      setGone(false);
      if (wasTorn.value) {
        setRestored(true);
        timer.value = setTimeout(() => setRestored(false), 500);
      }
    }
    wasTorn.value = torn.value;
    return () => clearTimeout(timer.value);
  }, () => [torn.value], false);
  const tear = () => {
    if (torn.value || disabled.value) return;
    heldFocus.value = !!root.value?.contains(document.activeElement);
    if (tornProp.value === undefined) setInner(true);
    onTornChange.value?.(true);
    onTear.value?.();
  };
  const ctx = computed<TearOffContextValue>(() => ({
    torn: torn.value,
    gone: gone.value,
    restored: restored.value,
    orientation: orientation.value,
    rtl: rtl.value,
    disabled: disabled.value,
    help,
    tear
  }));
  return () => {
    return <TearOffContext.Provider value={ctx.value}>
      <div data-slot="tear-off" data-state={torn.value ? "torn" as const : "attached" as const} data-orientation={orientation.value} ref={useMergedRef<HTMLDivElement>(root, ref.value)} tabindex={torn.value ? -1 : undefined} class={cn("group/tear relative isolate inline-flex outline-none", orientation.value === "vertical" ? "flex-col" as const : "flex-row" as const, className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
        <span id={help} class="sr-only">
          Press Enter or Space to tear it off along the dotted line, or pull it away with a pointer.
        </span>
        <span role="status" class="sr-only">
          {torn.value ? tornMessage.value : "" as const}
        </span>
      </div>
    </TearOffContext.Provider>;
  };
});
function sides(o: Orientation, rtl: boolean): {
  body: "right" | "left" | "bottom";
  stub: "left" | "right" | "top";
} {
  if (o === "vertical") return {
    body: "bottom" as const,
    stub: "top" as const
  };
  return rtl ? {
    body: "left" as const,
    stub: "right" as const
  } : {
    body: "right" as const,
    stub: "left" as const
  };
}
type PieceProps = Omit<PaperProps, "ref" | "stock" | "edge"> & {
  ref?: UI.Ref<HTMLElement>;
  stock?: PaperProps["stock"];
};
const TearOffBody = defineUi<PieceProps>("TearOffBody", ["class", "stock"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const props = computed(() => omitProps(_props, ["class", "children", "stock"]));
  const _hook4 = useTearOff();
  const torn = computed(() => _hook4.value.torn);
  const orientation = computed(() => _hook4.value.orientation);
  const rtl = computed(() => _hook4.value.rtl);
  const s = computed(() => sides(orientation.value, rtl.value));
  return () => {
    return <Paper data-slot="tear-off-body" stock={stock.value} edge={{
      [s.value.body]: torn.value ? "torn" as const : "perf" as const
    }} tilt={false} class={cn("min-w-0 flex-1 p-4", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
    </Paper>;
  };
});
type StubProps = PieceProps & {
  label?: string;
  seed?: string | number;
};
const TearOffStub = defineUi<StubProps>("TearOffStub", ["class", "stock", "label", "seed", "style", "onKeydown"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const stock = computed(() => _props["stock"] === undefined ? "index-card" as const : _props["stock"]);
  const label = computed(() => _props["label"]);
  const seed = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const ref = computed(() => _props["ref"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const props = computed(() => omitProps(_props, ["class", "children", "stock", "label", "seed", "style", "ref", "onKeydown"]));
  const ctx = useTearOff();
  const orientation = computed(() => ctx.value.orientation);
  const rtl = computed(() => ctx.value.rtl);
  const s = computed(() => sides(orientation.value, rtl.value));
  const vertical = computed(() => orientation.value === "vertical");
  const sign = computed(() => rtl.value ? -1 : 1);
  const el = shallowRef<HTMLDivElement | null | null>(null);
  const drag = shallowRef<{
    pointer: number;
    x: number;
    y: number;
    size: number;
    p: number;
    moved: boolean;
  } | null | null>(null);
  const _hostCore = useInk(() => ({
    recipe: tearStubRecipe,
    params: {},
    kind: "tear-off-stub" as const,
    seed: seed.value
  }));
  const host = computed(() => proxyRefs(_hostCore));
  const _seamCore = useInk(() => ({
    recipe: tearSeamRecipe,
    params: {
      scissors: true,
      inset: rtl.value ? -5 : 5
    },
    kind: "tear-off-seam" as const,
    seed: seed.value === undefined ? undefined : `${seed.value}|seam`
  }));
  const seam = computed(() => proxyRefs(_seamCore));
  const _hintCore = useInk(() => ({
    recipe: tearHintRecipe,
    params: {
      toward: vertical.value ? "down" as const : rtl.value ? "left" as const : "right" as const
    },
    kind: "tear-off-hint" as const,
    size: [36, 28],
    seed: seed.value === undefined ? undefined : `${seed.value}|hint`
  }));
  const hint = computed(() => proxyRefs(_hintCore));
  const progress = computed(() => (p: number) => el.value?.style.setProperty("--tear", String(p)));
  const down = computed(() => (e: PointerEvent) => {
    if (e.defaultPrevented || ctx.value.disabled || ctx.value.torn || (e.button ?? 0) !== 0) return;
    const box = e.currentTarget as HTMLDivElement;
    drag.value = {
      pointer: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      size: (vertical.value ? box.offsetHeight : box.offsetWidth) || 100,
      p: 0,
      moved: false
    };
    try {
      box.setPointerCapture(e.pointerId);
    } catch {}
    box.dataset.dragging = "";
  });
  const move = computed(() => (e: PointerEvent) => {
    const d = drag.value;
    if (!d || d.pointer !== e.pointerId) return;
    const along = vertical.value ? e.clientY - d.y : (e.clientX - d.x) * sign.value;
    if (Math.abs(along) > 4) d.moved = true;
    d.p = clamp(along / Math.max(56, d.size * 0.7), 0, 1);
    progress.value(d.p);
    if (d.p >= 1) release.value(e.currentTarget as HTMLDivElement, true);
  });
  const release = computed(() => (node: HTMLDivElement, doTear: boolean) => {
    const d = drag.value;
    drag.value = null;
    delete node.dataset.dragging;
    node.style.removeProperty("--tear");
    if (d && doTear) ctx.value.tear();
  });
  const up = computed(() => (cancel: boolean) => (e: PointerEvent) => {
    const d = drag.value;
    if (!d || d.pointer !== e.pointerId) return;
    const tap = !d.moved;
    release.value(e.currentTarget as HTMLDivElement, !cancel && (tap || d.p >= 0.5));
  });
  const keys = computed(() => (e: KeyboardEvent) => {
    onKeydown.value?.(e);
    if (e.defaultPrevented || e.target as HTMLDivElement !== e.currentTarget as HTMLDivElement) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ctx.value.tear();
    }
  });
  return () => {
    return <div data-slot="tear-off-stub" role="button" aria-label={label.value} aria-describedby={ctx.value.help} aria-disabled={ctx.value.disabled || undefined} tabindex={ctx.value.disabled || ctx.value.torn ? -1 : 0} hidden={ctx.value.gone} aria-hidden={ctx.value.torn || undefined} ref={useMergedRef<HTMLDivElement>(el, host.value.hostRef)} {...domProps(host.value.hostProps)} onPointerdown={down.value} onPointermove={move.value} onPointerup={up.value(false)} onPointercancel={up.value(true)} onKeydown={keys.value} onClick={(e: PointerEvent) => {
      if (e.detail === 0) ctx.value.tear();
    }} class={cn("relative isolate flex touch-none select-none", vertical.value ? "origin-top-left" as const : rtl.value ? "origin-bottom-right" as const : "origin-bottom-left" as const, ctx.value.disabled ? "cursor-default" as const : "cursor-grab data-dragging:cursor-grabbing" as const, "[transform:translate(calc(var(--tear,0)*var(--tx)),calc(var(--tear,0)*var(--ty)))_rotate(calc(var(--tear,0)*var(--rot)))]", "transition-[transform,opacity] duration-(--ll-dur-drop) ease-(--ll-ease-settle) data-dragging:transition-none", "[--tx:var(--tx0)] [--ty:var(--ty0)] [--rot:var(--rot0)]", "group-data-[state=torn]/tear:pointer-events-none group-data-[state=torn]/tear:opacity-0 group-data-[state=torn]/tear:[--tear:1] group-data-[state=torn]/tear:[--tx:calc(var(--tx0)*3)] group-data-[state=torn]/tear:[--ty:calc(var(--ty0)*3+28px)] group-data-[state=torn]/tear:[--rot:calc(var(--rot0)*1.8)]", ctx.value.restored && "animate-drop")} style={cssStyle({
      "--tx0": vertical.value ? "0px" as const : `${8 * sign.value}px`,
      "--ty0": vertical.value ? "10px" as const : "4px" as const,
      "--rot0": vertical.value ? `${-14}deg` : `${14 * sign.value}deg`,
      ...style.value
    } as UI.CSSProperties)}>
      {host.value.node}
      <Paper data-slot="tear-off-sheet" stock={stock.value} edge={{
        [s.value.stub]: ctx.value.torn ? "torn" as const : "perf" as const
      }} tilt={false} ref={ref.value} class={cn("flex min-w-0 flex-1 flex-col items-center justify-center gap-1 p-4 text-center", className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </Paper>
      <span aria-hidden="true" ref={seam.value.hostRef} {...domProps(seam.value.hostProps)} style={cssStyle({
        outline: "none" as const
      })} class={cn("pointer-events-none absolute z-(--ll-z-raised) isolate", vertical.value ? "inset-x-3 -top-2 h-4" as const : rtl.value ? "inset-y-3 -end-2 w-4" as const : "inset-y-3 -start-2 w-4" as const)}>
        {seam.value.node}
      </span>
      <span aria-hidden="true" ref={hint.value.hostRef} {...domProps(hint.value.hostProps)} class={cn("pointer-events-none absolute z-(--ll-z-raised) isolate h-7 w-9", vertical.value ? "left-1/2 bottom-1 -translate-x-1/2" as const : rtl.value ? "start-1 bottom-1" as const : "end-1 bottom-1" as const)}>
        {hint.value.node}
      </span>
    </div>;
  };
});
export { TearOff, TearOffBody, TearOffStub, useTearOff };
export type { TearOffProps };
