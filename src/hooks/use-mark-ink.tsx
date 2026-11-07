// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef } from "vue";
import { ensureInkDefs, inkFrame, inkViewBox, useInkContext, useInkSeed, useMergedRef } from "@/lib/ink";
import type { Frame, Recipe } from "@/lib/ink";
import { GUESS_RATIOS, lineMetrics, type FontRatios, type LineParams } from "@/lib/ink/recipes/text-marks-ink";
export type MarkPhase = "idle" | "in" | "off";
export interface MarkRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Measured {
  rects: MarkRect[];
  ratios: FontRatios;
  fs: number;
}
export interface UseMarkInkOptions<P extends LineParams> {
  recipe: Recipe<P>;
  params: Omit<P, keyof LineParams>;
  kind: string;
  seed?: string | number;
  mode?: "lines" | "box";
  over?: boolean;
  animate?: boolean;
  show?: boolean;
  delay?: number;
}
export interface UseMarkInkResult {
  hostRef: UI.RefCallback<HTMLElement>;
  hostProps: Record<string, string | undefined>;
  /** 每次渲染时生成笔触节点，避免带 ref 的 VNode 被 computed 提前缓存。 */
  nodes: () => UI.ReactNode;
  phase: MarkPhase;
  ready: boolean;
  seed: string;
}
export const MARK_WIPE = "data-animate:data-[mark=idle]:[&>svg]:[clip-path:inset(-10%_var(--ll-wipe-r,100%)_-10%_var(--ll-wipe-l,-4%))] data-animate:data-[mark=in]:[&>svg]:animate-[ll-wipe_var(--ll-dur-draw)_var(--ll-ease-out)_var(--ll-draw-delay,0s)_both]";
export const MARK_REVEAL = "data-animate:[&>svg_[data-part=reveal]]:[stroke-dasharray:1] data-animate:data-[mark=idle]:[&>svg_[data-part=reveal]]:[stroke-dashoffset:1] data-animate:data-[mark=in]:[&>svg_[data-part=reveal]]:animate-[ll-draw_var(--ll-dur-draw)_var(--ll-ease-out)_var(--ll-draw-delay,0s)_both]";
interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}
export function mergeLineRects(list: readonly RectLike[]): RectLike[] {
  const out: RectLike[] = [];
  for (const r of list) {
    if (!(r.width >= 0.5 && r.height >= 0.5)) continue;
    const same = out.find(o => Math.min(o.top + o.height, r.top + r.height) - Math.max(o.top, r.top) > 0.6 * Math.min(o.height, r.height));
    if (same) {
      const left = Math.min(same.left, r.left);
      const top = Math.min(same.top, r.top);
      const right = Math.max(same.left + same.width, r.left + r.width);
      const bottom = Math.max(same.top + same.height, r.top + r.height);
      same.left = left;
      same.top = top;
      same.width = right - left;
      same.height = bottom - top;
    } else out.push({
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height
    });
  }
  return out;
}
let canvas: {
  measureText(t: string): TextMetrics;
  font: string;
} | null | undefined;
function canvasContext(): typeof canvas {
  if (canvas !== undefined) return canvas;
  canvas = null;
  try {
    if (typeof OffscreenCanvas !== "undefined") canvas = new OffscreenCanvas(1, 1).getContext("2d");else if (typeof document !== "undefined" && !/jsdom/i.test(navigator.userAgent)) canvas = document.createElement("canvas").getContext("2d");
  } catch {
    canvas = null;
  }
  return canvas;
}
const ratioCache = new Map<string, FontRatios>();
function fontRatios(cs: CSSStyleDeclaration): FontRatios | null {
  const ctx = canvasContext();
  if (!ctx) return null;
  const font = `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`;
  const cached = ratioCache.get(font);
  if (cached) return cached;
  try {
    ctx.font = font;
    const m = ctx.measureText("x");
    if (typeof m.fontBoundingBoxAscent !== "number") return null;
    const cap = ctx.measureText("H").actualBoundingBoxAscent / 100;
    const pd = ctx.measureText("p").actualBoundingBoxDescent / 100;
    const r: FontRatios = {
      asc: m.fontBoundingBoxAscent / 100,
      desc: m.fontBoundingBoxDescent / 100,
      xh: m.actualBoundingBoxAscent / 100,
      cap: cap || GUESS_RATIOS.cap,
      pdesc: pd || GUESS_RATIOS.pdesc
    };
    if (typeof document !== "undefined" && document.fonts?.check && !document.fonts.check(`100px ${cs.fontFamily}`)) return r;
    ratioCache.set(font, r);
    return r;
  } catch {
    return null;
  }
}
const q = (v: number) => Math.round(v * 4) / 4;
export const MAX_MARK_LINES = 60;
function measure(host: HTMLElement, origin: HTMLElement | null): Measured | null {
  const cs = getComputedStyle(host);
  if (cs.display === "none") return null;
  const fs = Number.parseFloat(cs.fontSize) || 16;
  const raw = mergeLineRects(Array.from(host.getClientRects()));
  const o = origin?.getBoundingClientRect();
  let rects: MarkRect[];
  if (raw.length > MAX_MARK_LINES) rects = [];else if (raw.length && o) rects = raw.map(r => ({
    x: q(r.left - o.left),
    y: q(r.top - o.top),
    w: q(r.width),
    h: q(r.height)
  }));else {
    const w = host.offsetWidth,
      h = host.offsetHeight;
    if (!(w > 0 && h > 0)) return null;
    rects = [{
      x: 0,
      y: 0,
      w,
      h
    }];
  }
  return {
    rects,
    ratios: fontRatios(cs) ?? GUESS_RATIOS,
    fs
  };
}
function sameMeasure(a: Measured | null, b: Measured | null): boolean {
  if (a === b) return true;
  if (!a || !b || a.rects.length !== b.rects.length || a.fs !== b.fs) return false;
  const ra = a.ratios,
    rb = b.ratios;
  if (ra !== rb && (ra.asc !== rb.asc || ra.desc !== rb.desc || ra.xh !== rb.xh || ra.cap !== rb.cap || ra.pdesc !== rb.pdesc)) return false;
  return a.rects.every((r, i) => r.x === b.rects[i].x && r.y === b.rects[i].y && r.w === b.rects[i].w && r.h === b.rects[i].h);
}
function boxParent(el: HTMLElement): HTMLElement {
  let p: HTMLElement = el;
  for (let i = 0; i < 8; i++) {
    const cs = getComputedStyle(p);
    if (cs.display !== "inline" && cs.display !== "contents") return p;
    if (!p.parentElement) return p;
    p = p.parentElement;
  }
  return p;
}
function detectDir(el: Element): "ltr" | "rtl" | null {
  const d = el.closest("[dir]")?.getAttribute("dir") ?? el.ownerDocument.documentElement.getAttribute("dir");
  return d === "rtl" || d === "ltr" ? d : null;
}
export interface MarkPhaseState {
  phase: MarkPhase;
  phaseRef: UI.RefCallback<HTMLElement>;
  phaseProps: {
    "data-mark": MarkPhase;
    "data-animate"?: "";
  };
}
export function useMarkPhase(_source0: MaybeRefOrGetter<{
  animate?: boolean;
  show?: boolean;
}>): ComputedRef<MarkPhaseState> {
  const o = computed(() => toValue(_source0));
  const show = computed(() => o.value.show !== false);
  const animate = computed(() => !!o.value.animate);
  const inView = shallowRef(initialState(false));
  const setInView = stateSetter(inView);
  const watching = computed(() => animate.value && show.value && !inView.value);
  const phaseRef = (el: HTMLElement | null) => {
    if (!el || !watching.value) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setInView(true);
        io.disconnect();
      }
    }, {
      rootMargin: "0px 0px -12% 0px" as const
    });
    io.observe(el);
    let dwell: ReturnType<typeof setTimeout> | undefined;
    const edge = new IntersectionObserver(entries => {
      const seen = entries.some(e => e.isIntersecting);
      if (seen && dwell === undefined) dwell = setTimeout(() => setInView(true), 1200);else if (!seen && dwell !== undefined) {
        clearTimeout(dwell);
        dwell = undefined;
      }
    });
    edge.observe(el);
    return () => {
      io.disconnect();
      edge.disconnect();
      if (dwell !== undefined) clearTimeout(dwell);
    };
  };
  const phase = computed<MarkPhase>(() => !show.value ? "off" as const : animate.value && !inView.value ? "idle" as const : "in" as const);
  return computed(() => {
    return {
      phase: phase.value,
      phaseRef,
      phaseProps: animate.value ? {
        "data-mark": phase.value,
        "data-animate": "" as const
      } : {
        "data-mark": phase.value
      }
    };
  });
}
export function useMarkInk<P extends LineParams>(_source0: MaybeRefOrGetter<UseMarkInkOptions<P>>): ComputedRef<UseMarkInkResult> {
  const o = computed(() => toValue(_source0));
  const ctx = useInkContext();
  const seed = useInkSeed(() => o.value.seed);
  const show = computed(() => o.value.show !== false);
  const animate = computed(() => !!o.value.animate);
  const originEl = shallowRef<HTMLSpanElement | null | null>(null);
  const measured = shallowRef<Measured | null>(initialState(null));
  const setMeasured = stateSetter(measured);
  const hostDir = shallowRef<"ltr" | "rtl" | null>(initialState(null));
  const setHostDir = stateSetter(hostDir);
  const hasProvider = computed(() => ctx.value.hasProvider);
  const measureRef = (el: HTMLElement | null) => {
    if (!el) return;
    const update = () => {
      const next = measure(el, originEl.value);
      setMeasured(prev => sameMeasure(prev, next) ? prev : next ?? prev);
    };
    update();
    const d = detectDir(el);
    if (d) setHostDir(d);
    if (!hasProvider.value) ensureInkDefs();
    const stops: Array<() => void> = [];
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      const parent = boxParent(el);
      if (parent !== el) ro.observe(parent);
      stops.push(() => ro.disconnect());
    }
    if (typeof MutationObserver !== "undefined") {
      const mo = new MutationObserver(update);
      mo.observe(el, {
        childList: true,
        characterData: true,
        subtree: true
      });
      stops.push(() => mo.disconnect());
    }
    const fonts = typeof document !== "undefined" ? document.fonts : undefined;
    if (fonts) {
      fonts.addEventListener?.("loadingdone", update);
      void fonts.ready?.then(update);
      stops.push(() => fonts.removeEventListener?.("loadingdone", update));
    }
    return () => {
      for (const s of stops) s();
    };
  };
  const _hook12 = useMarkPhase(() => ({
    animate: animate.value,
    show: show.value
  }));
  const phase = computed(() => _hook12.value.phase);
  const phaseRef = computed(() => _hook12.value.phaseRef);
  const phaseProps = computed(() => _hook12.value.phaseProps);
  const hostRef = computed(() => useMergedRef<HTMLElement>(measureRef, phaseRef.value));
  const dir = computed(() => hostDir.value ?? ctx.value.dir);
  const paramsKey = computed(() => JSON.stringify(o.value.params));
  const drawn = computed(() => {
    if (!measured.value || !show.value) return [];
    const {
      rects,
      ratios,
      fs
    } = measured.value;
    if (!rects.length) return [];
    let list: MarkRect[] = rects;
    if (o.value.mode === "box") {
      const x0 = Math.min(...rects.map(r => r.x)),
        x1 = Math.max(...rects.map(r => r.x + r.w));
      const y0 = Math.min(...rects.map(r => r.y)),
        y1 = Math.max(...rects.map(r => r.y + r.h));
      list = [{
        x: q(x0),
        y: q(y0),
        w: q(x1 - x0),
        h: q(y1 - y0)
      }];
    }
    return list.map((r, i) => {
      const lm = lineMetrics(o.value.mode === "box" ? Math.min(r.h, Math.round((ratios.asc + ratios.desc) * fs)) : r.h, fs, ratios);
      const params = {
        ...(o.value.params as object),
        ...lm,
        first: i === 0,
        last: i === list.length - 1,
        n: list.length,
        animate: animate.value
      } as unknown as P;
      const frame = inkFrame(o.value.recipe, {
        box: {
          w: r.w,
          h: r.h
        },
        params,
        seed: `${seed.value}:${i}`,
        tier: ctx.value.tier,
        density: ctx.value.density,
        dir: dir.value,
        knobs: ctx.value.knobs
      });
      return {
        r,
        i,
        frame
      };
    });
  });
  const ready = computed(() => drawn.value.length > 0);
  // 这里返回渲染函数，而不是缓存 VNode；originEl 必须在组件 render 阶段登记 ref owner。
  const nodes = () => <>
      <span ref={originEl} data-part="mark-origin" aria-hidden="true" class="pointer-events-none absolute size-0" style={cssStyle({
      left: 0,
      top: 0
    })} />
      {drawn.value.map(({
      r,
      i,
      frame
    }) => <MarkSvg key={i} kind={o.value.kind} frame={frame} rect={r} over={!!o.value.over} delay={(o.value.delay ?? 0) + i * 380} line={i} />)}
    </>;
  const hostProps = computed<Record<string, string | undefined>>(() => ({
    ...phaseProps.value
  }));
  return computed(() => {
    if (ready.value) {
      hostProps.value["data-ink-host"] = "";
      hostProps.value["data-ink-ready"] = "";
    }
    return {
      hostRef: hostRef.value,
      hostProps: hostProps.value,
      nodes,
      phase: phase.value,
      ready: ready.value,
      seed: seed.value
    };
  });
}
const MarkSvg = defineUi<{
  kind: string;
  frame: Frame;
  rect: MarkRect;
  over: boolean;
  delay: number;
  line: number;
}>("MarkSvg", ["kind", "frame", "rect", "over", "delay", "line"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"]);
  const frame = computed(() => _props["frame"]);
  const rect = computed(() => _props["rect"]);
  const over = computed(() => _props["over"]);
  const delay = computed(() => _props["delay"]);
  const line = computed(() => _props["line"]);
  const pad = computed(() => frame.value.pad);
  return () => {
    return <svg data-ink={kind.value} data-line={line.value} aria-hidden="true" focusable="false" class="pointer-events-none absolute" viewBox={inkViewBox(frame.value)} preserveAspectRatio="none" style={cssStyle({
      position: "absolute" as const,
      pointerEvents: "none" as const,
      left: rect.value.x - pad.value,
      top: rect.value.y - pad.value,
      width: rect.value.w + 2 * pad.value,
      height: rect.value.h + 2 * pad.value,
      overflow: "visible" as const,
      zIndex: over.value ? 1 : -1,
      "--ll-draw-delay": `${delay.value}ms`
    } as UI.CSSProperties)}>
      {frame.value.layers.map(name => <g key={name} data-layer={name} innerHTML={frame.value.parts[name] ?? ""} />)}
    </svg>;
  };
});
export const BlockSvg = defineUi<{
  kind: string;
  frame: Frame;
  keep?: boolean;
}>("BlockSvg", ["kind", "frame", "keep"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"]);
  const frame = computed(() => _props["frame"]);
  const keep = computed(() => _props["keep"]);
  const pad = computed(() => frame.value.pad);
  return () => {
    return <svg data-ink={kind.value} data-ink-keep={keep.value ? "" as const : undefined} aria-hidden="true" focusable="false" class="pointer-events-none absolute" viewBox={inkViewBox(frame.value)} preserveAspectRatio="none" style={cssStyle({
      position: "absolute" as const,
      pointerEvents: "none" as const,
      left: -pad.value,
      top: -pad.value,
      width: `calc(100% + ${2 * pad.value}px)`,
      height: `calc(100% + ${2 * pad.value}px)`,
      overflow: "visible" as const,
      zIndex: -1
    })}>
      {frame.value.layers.map(name => <g key={name} data-layer={name} innerHTML={frame.value.parts[name] ?? ""} />)}
    </svg>;
  };
});
