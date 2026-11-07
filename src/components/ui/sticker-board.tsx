// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef, useId, proxyRefs } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useEnsureInkDefs, useInk, useInkSeed, useMergedRef } from "@/lib/ink/vue";
import { HANDLE, composeBoardSvg, stickerBoardItemRecipe, wholeItems, type StickerBoardItem } from "@/lib/ink/recipes/sticker-board-ink";
import { stickerFace, stickerLabel } from "@/lib/ink/recipes/sticker-ink";
import { clamp, hashSeed } from "@/lib/ink/rng";
import { cn } from "@/lib/utils";
const STEP = 8;
const BIG_STEP = 32;
const TURN = 5;
const BIG_TURN = 15;
const ZOOM = 1.1;
const BIG_ZOOM = 1.25;
const DEFAULT_MIN = 0.3;
const DEFAULT_MAX = 3;
const turnTo = (deg: number): number => {
  const a = Math.round(((deg + 180) % 360 + 360) % 360 * 10) / 10 - 180;
  return a === -180 ? 180 : Math.round(a * 10) / 10;
};
const round2 = (v: number): number => Math.round(v * 100) / 100;
type Reorder = "front" | "back" | "forward" | "backward";
function reorderSticker(items: readonly StickerBoardItem[], id: string, how: Reorder): StickerBoardItem[] {
  const zOf = (s: StickerBoardItem) => Number.isFinite(s.z) ? s.z : 0;
  const sorted = [...items].sort((a, b) => zOf(a) - zOf(b));
  const i = sorted.findIndex(s => s.id === id);
  if (i < 0) return items as StickerBoardItem[];
  const [it] = sorted.splice(i, 1);
  const to = how === "front" ? sorted.length : how === "back" ? 0 : how === "forward" ? Math.min(i + 1, sorted.length) : Math.max(i - 1, 0);
  if (to === i && how !== "front" && how !== "back") return items as StickerBoardItem[];
  sorted.splice(to, 0, it);
  const rank = new Map(sorted.map((s, k) => [s.id, k]));
  const next = items.map(s => ({
    ...s,
    z: rank.get(s.id) ?? s.z
  }));
  return next.every((s, k) => s.z === items[k].z) ? items as StickerBoardItem[] : next;
}
interface AddOptions {
  x?: number;
  y?: number;
  rot?: number;
  scale?: number;
  id?: string;
  canvas?: {
    width: number;
    height: number;
  };
}
function addSticker(items: readonly StickerBoardItem[], name: string, o: AddOptions = {}): StickerBoardItem[] {
  const used = new Set(items.map(s => s.id));
  let k = 1;
  while (used.has(`${name}-${k}`)) k++;
  const id = o.id && !used.has(o.id) ? o.id : `${name}-${k}`;
  const cx = o.x ?? (o.canvas ? o.canvas.width / 2 : 160) + (items.length % 5 - 2) * 18;
  const cy = o.y ?? (o.canvas ? o.canvas.height / 2 : 120) + (items.length % 4 - 1.5) * 14;
  const rot = o.rot ?? Math.round((hashSeed(id) % 1600 / 100 - 8) * 10) / 10;
  const z = items.reduce((m, s) => Math.max(m, Number.isFinite(s.z) ? s.z : 0), -1) + 1;
  return [...items, {
    id,
    name,
    x: Math.round(cx),
    y: Math.round(cy),
    rot,
    scale: o.scale ?? 1,
    z
  }];
}
function boardPoint(root: Element | null | undefined, clientX: number, clientY: number): {
  x: number;
  y: number;
  inside: boolean;
} | null {
  const canvas = root?.matches?.('[data-slot="sticker-board-canvas"]') ? root : root?.querySelector?.('[data-slot="sticker-board-canvas"]');
  if (!canvas) return null;
  const r = canvas.getBoundingClientRect();
  return {
    x: Math.round(clientX - r.left),
    y: Math.round(clientY - r.top),
    inside: clientX >= r.left && clientX <= r.left + r.width && clientY >= r.top && clientY <= r.top + r.height
  };
}
type BoundsMode = "center" | "inside" | "none";
function keepIn(x: number, y: number, art: {
  w: number;
  h: number;
  rot: number;
  scale: number;
}, canvas: {
  w: number;
  h: number;
}, mode: BoundsMode): [number, number] {
  if (mode === "none" || !canvas.w || !canvas.h) return [x, y];
  if (mode === "center") return [clamp(x, 0, canvas.w), clamp(y, 0, canvas.h)];
  const a = art.rot * Math.PI / 180;
  const c = Math.abs(Math.cos(a)),
    s = Math.abs(Math.sin(a));
  const ex = Math.min(canvas.w / 2, (art.w * art.scale * c + art.h * art.scale * s) / 2);
  const ey = Math.min(canvas.h / 2, (art.w * art.scale * s + art.h * art.scale * c) / 2);
  return [clamp(x, ex, canvas.w - ex), clamp(y, ey, canvas.h - ey)];
}
const DROP = "drop-shadow(calc(var(--sb-dx) * (1px + 4px * var(--sb-lift))) calc(var(--sb-dy) * (1px + 4px * var(--sb-lift))) calc(0.6px + 2.4px * var(--sb-lift)) rgb(var(--ll-shade) / calc(0.26 * var(--ll-shadow-k)))) " + "drop-shadow(calc(var(--sb-dx) * (3px + 11px * var(--sb-lift))) calc(var(--sb-dy) * (3px + 11px * var(--sb-lift))) calc(3px + 7px * var(--sb-lift)) rgb(var(--ll-shade) / calc(0.14 * var(--ll-shadow-k))))";
const down = (rot: number) => {
  const a = rot * Math.PI / 180;
  return {
    dx: Math.round(Math.sin(a) * 1000) / 1000,
    dy: Math.round(Math.cos(a) * 1000) / 1000
  };
};
interface StickerBoardContextValue {
  items: readonly StickerBoardItem[];
  selectedId: string | null;
  select(id: string | null): void;
  commit(next: StickerBoardItem[], message?: string): void;
  patch(id: string, change: Partial<StickerBoardItem>, message?: string): void;
  remove(id: string): void;
  duplicate(id: string): void;
  reorder(id: string, how: Reorder): void;
  turn(id: string, deg: number): void;
  resize(id: string, factor: number): void;
  exportBoard(): void;
  size: number;
  minScale: number;
  maxScale: number;
  bounds: BoundsMode;
  editable: boolean;
  canvas(): {
    w: number;
    h: number;
  };
  registerCanvas(el: HTMLElement | null): void;
  say(message: string): void;
  help: string;
  canvasId: string;
  label: string;
}
const StickerBoardContext = createContext<StickerBoardContextValue | null>(null);
function useStickerBoard(): ComputedRef<StickerBoardContextValue> {
  const ctx = useContext(StickerBoardContext);
  return computed(() => {
    if (!ctx.value) console.error("Sticker board parts must be used inside <StickerBoard>");
    return ctx.value;
  });
}
interface StickerBoardExport {
  items: StickerBoardItem[];
  json: string;
  svg: string;
  width: number;
  height: number;
  png(scale?: number): Promise<Blob>;
}
function resolveTokens(svg: string, el: Element): string {
  if (typeof getComputedStyle !== "function") return svg;
  const cs = getComputedStyle(el);
  return svg.replace(/var\((--[a-z0-9-]+)\)/gi, (whole, name: string) => cs.getPropertyValue(name).trim() || whole);
}
function rasterise(svg: string, width: number, height: number, scale: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], {
      type: "image/svg+xml;charset=utf-8" as const
    }));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const g = canvas.getContext("2d");
      if (!g) return reject(new Error("No 2d canvas"));
      g.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("The canvas gave no image")), "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The svg could not be drawn"));
    };
    img.src = url;
  });
}
type StickerBoardProps = Omit<UI.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  value?: StickerBoardItem[];
  defaultValue?: StickerBoardItem[];
  onValueChange?: (value: StickerBoardItem[]) => void;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
  size?: number;
  minScale?: number;
  maxScale?: number;
  bounds?: BoundsMode;
  readOnly?: boolean;
  disabled?: boolean;
  label?: string;
  onExport?: (data: StickerBoardExport) => void;
};
const StickerBoard = defineUi<StickerBoardProps>("StickerBoard", ["class", "value", "defaultValue", "onValueChange", "selectedId", "defaultSelectedId", "onSelectedIdChange", "size", "minScale", "maxScale", "bounds", "readOnly", "disabled", "label", "onExport"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const value = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const selectedProp = computed(() => _props["selectedId"]);
  const defaultSelectedId = computed(() => _props["defaultSelectedId"] === undefined ? null : _props["defaultSelectedId"]);
  const onSelectedIdChange = computed(() => _props["onSelectedIdChange"]);
  const size = computed(() => _props["size"] === undefined ? 96 : _props["size"]);
  const minScale = computed(() => _props["minScale"] === undefined ? DEFAULT_MIN : _props["minScale"]);
  const maxScale = computed(() => _props["maxScale"] === undefined ? DEFAULT_MAX : _props["maxScale"]);
  const bounds = computed(() => _props["bounds"] === undefined ? "center" as const : _props["bounds"]);
  const readOnly = computed(() => _props["readOnly"] === undefined ? false : _props["readOnly"]);
  const disabled = computed(() => _props["disabled"] === undefined ? false : _props["disabled"]);
  const label = computed(() => _props["label"] === undefined ? "Sticker board" as const : _props["label"]);
  const onExport = computed(() => _props["onExport"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "value", "defaultValue", "onValueChange", "selectedId", "defaultSelectedId", "onSelectedIdChange", "size", "minScale", "maxScale", "bounds", "readOnly", "disabled", "label", "onExport"]));
  const inner = shallowRef<StickerBoardItem[]>(initialState(defaultValue.value ?? []));
  const setInner = stateSetter(inner);
  const controlled = computed(() => value.value !== undefined);
  const raw = computed(() => value.value !== undefined ? value.value : inner.value);
  const items = computed(() => wholeItems(raw.value));
  const latest = shallowRef(items.value);
  const innerSel = shallowRef<string | null>(initialState(defaultSelectedId.value));
  const setInnerSel = stateSetter(innerSel);
  const selControlled = computed(() => selectedProp.value !== undefined);
  const sel = computed(() => selectedProp.value !== undefined ? selectedProp.value : innerSel.value);
  const selectedId = computed(() => sel.value !== null && items.value.some(s => s.id === sel.value) ? sel.value : null);
  const canvasEl = shallowRef<HTMLElement | null | null>(null);
  const help = useId();
  const canvasId = useId();
  const status = shallowRef(initialState(""));
  const setStatus = stateSetter(status);
  const said = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  watchDependencies(() => () => clearTimeout(said.value), () => [], false);
  const say = (message: string) => {
    clearTimeout(said.value);
    said.value = setTimeout(() => setStatus(message), 300);
  };
  const select = (id: string | null) => {
    if (!selControlled.value) setInnerSel(id);
    onSelectedIdChange.value?.(id);
  };
  const commit = (next: StickerBoardItem[], message?: string) => {
    latest.value = next;
    if (!controlled.value) setInner(next);
    onValueChange.value?.(next);
    if (message) say(message);
  };
  const find = computed(() => (id: string) => latest.value.find(s => s.id === id));
  const nameOf = computed(() => (id: string) => {
    const it = find.value(id);
    return it ? stickerLabel(it.name) : id;
  });
  const patch = (id: string, change: Partial<StickerBoardItem>, message?: string) => commit(latest.value.map(s => s.id === id ? {
    ...s,
    ...change
  } : s), message);
  const api = computed<StickerBoardContextValue>(() => {
    const canvas = () => ({
      w: canvasEl.value?.offsetWidth ?? 0,
      h: canvasEl.value?.offsetHeight ?? 0
    });
    const doExport = () => {
      const el = canvasEl.value;
      const {
        w,
        h
      } = canvas();
      const width = w || 640,
        height = h || 400;
      const build = () => composeBoardSvg(latest.value, {
        width,
        height,
        size: size.value,
        resolve: el ? s => resolveTokens(s, el) : undefined
      });
      const svg = build();
      const data: StickerBoardExport = {
        items: latest.value,
        json: JSON.stringify(latest.value, null, 2),
        svg,
        width,
        height,
        png: (scale = 2) => rasterise(svg, width, height, scale)
      };
      if (onExport.value) return onExport.value(data);
      if (typeof document === "undefined") return;
      const url = URL.createObjectURL(new Blob([svg], {
        type: "image/svg+xml" as const
      }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "stickers.svg";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    return {
      items: items.value,
      selectedId: selectedId.value,
      select,
      commit,
      patch,
      remove(id) {
        const at = latest.value.findIndex(s => s.id === id);
        if (at < 0) return;
        const name = nameOf.value(id);
        commit(latest.value.filter(s => s.id !== id), `${name} removed.`);
        select(null);
      },
      duplicate(id) {
        const it = find.value(id);
        if (!it) return;
        const next = addSticker(latest.value, it.name, {
          x: it.x + 20,
          y: it.y + 20,
          rot: it.rot,
          scale: it.scale
        });
        commit(next, `${nameOf.value(id)} duplicated.`);
        select(next[next.length - 1].id);
      },
      reorder(id, how) {
        const next = reorderSticker(latest.value, id, how);
        if (next === latest.value) return say(`${nameOf.value(id)} is already ${how === "forward" || how === "front" ? "on top" as const : "at the back" as const}.`);
        const word = {
          front: "brought to the front" as const,
          back: "sent to the back" as const,
          forward: "brought forward" as const,
          backward: "sent backward" as const
        }[how];
        commit(next, `${nameOf.value(id)} ${word}.`);
      },
      turn(id, deg) {
        const it = find.value(id);
        if (!it) return;
        const rot = turnTo(it.rot + deg);
        patch(id, {
          rot
        }, `${nameOf.value(id)} turned to ${rot} degrees.`);
      },
      resize(id, factor) {
        const it = find.value(id);
        if (!it) return;
        const scale = clamp(round2(it.scale * factor), minScale.value, maxScale.value);
        if (scale === it.scale) return say(`${nameOf.value(id)} is as ${factor > 1 ? "big" as const : "small" as const} as it goes.`);
        patch(id, {
          scale
        }, `${nameOf.value(id)} at ${Math.round(scale * 100)} percent.`);
      },
      exportBoard: doExport,
      size: size.value,
      minScale: minScale.value,
      maxScale: maxScale.value,
      bounds: bounds.value,
      editable: !readOnly.value && !disabled.value,
      canvas,
      registerCanvas: el => {
        canvasEl.value = el;
      },
      say,
      help,
      canvasId,
      label: label.value
    };
  });
  return () => {
    latest.value = items.value;
    return <StickerBoardContext.Provider value={api.value}>
      <div data-slot="sticker-board" data-disabled={disabled.value ? "" as const : undefined} ref={ref.value} class={cn("flex min-w-0 flex-col gap-3", disabled.value && "opacity-70", className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default) ?? <>
            <StickerBoardCanvas class="flex-1" />
            <StickerBoardToolbar />
          </>}
        {!readOnly.value && !disabled.value ? <span id={help} class="sr-only">
            Stickers can be dragged. Focus one, then the arrow keys move it, Shift makes the steps bigger and Alt makes them one pixel. Left and right square brackets (or R and Shift R) turn it, plus and minus
            size it, Page Up and Page Down move it through the stack, Delete removes it and Escape lets go.
          </span> : null}
        <span role="status" class="sr-only">
          {status.value}
        </span>
      </div>
    </StickerBoardContext.Provider>;
  };
});
type StickerBoardCanvasProps = Omit<PaperProps, "children" | "ref"> & {
  ref?: UI.Ref<HTMLElement>;
  empty?: UI.ReactNode;
};
const StickerBoardCanvas = defineUi<StickerBoardCanvasProps>("StickerBoardCanvas", ["class", "stock", "tilt", "empty"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const ref = computed(() => _props["ref"]);
  const stock = computed(() => _props["stock"] === undefined ? "dot-grid" as const : _props["stock"]);
  const tilt = computed(() => _props["tilt"] === undefined ? false : _props["tilt"]);
  const empty = computed(() => _props["empty"]);
  const props = computed(() => omitProps(_props, ["class", "ref", "stock", "tilt", "empty"]));
  const board = useStickerBoard();
  useEnsureInkDefs();
  const setRef = computed(() => useMergedRef<HTMLElement>(board.value.registerCanvas, ref.value));
  return () => {
    return <Paper data-slot="sticker-board-canvas" id={board.value.canvasId} role="group" aria-label={board.value.label} aria-describedby={board.value.editable ? board.value.help : undefined} ref={setRef.value} stock={stock.value} tilt={tilt.value} class={cn("relative min-h-72 w-full min-w-0", className.value)} {...domProps(props.value)}>
      <div data-slot="sticker-board-surface" tabindex={-1} class="absolute inset-0 overflow-clip outline-none" onPointerdown={(e: PointerEvent) => {
        if (e.target as HTMLElement === e.currentTarget as HTMLElement && board.value.editable) board.value.select(null);
      }}>
        {board.value.items.map(it => <BoardItem key={it.id} item={it} />)}
        {board.value.items.length === 0 ? <div data-slot="sticker-board-empty" class="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center font-script text-2xl text-pencil-text">
            {empty.value ?? "Nothing stuck down yet."}
          </div> : null}
      </div>
    </Paper>;
  };
});
interface DragState {
  pointer: number;
  mode: "move" | "rotate" | "scale";
  sx: number;
  sy: number;
  cx: number;
  cy: number;
  a0: number;
  d0: number;
  x0: number;
  y0: number;
  rot0: number;
  scale0: number;
  x: number;
  y: number;
  rot: number;
  scale: number;
  moved: boolean;
}
const BoardItem = defineUi<{
  item: StickerBoardItem;
}>("BoardItem", ["item"], (_props, {
  slots: _slots
}) => {
  const item = computed(() => _props["item"]);
  const board = useStickerBoard();
  const _nestedHook0 = useId();
  const uid = computed(() => _nestedHook0.replace(/[^a-zA-Z0-9]/g, ""));
  const seed = useInkSeed(() => item.value.id);
  const face = computed(() => stickerFace(item.value.name, board.value.size, item.value.id, {
    idPrefix: `ll-sb${uid.value}`
  }));
  const selected = computed(() => board.value.selectedId === item.value.id);
  const editable = computed(() => board.value.editable);
  const el = shallowRef<HTMLDivElement | null | null>(null);
  const art = shallowRef<HTMLSpanElement | null | null>(null);
  const drag = shallowRef<DragState | null | null>(null);
  const fw = computed(() => face.value?.w ?? 0);
  const fh = computed(() => face.value?.h ?? 0);
  const w = computed(() => face.value?.box.w ?? 0);
  const h = computed(() => face.value?.box.h ?? 0);
  const bx = computed(() => face.value?.box.x ?? 0);
  const by = computed(() => face.value?.box.y ?? 0);
  const _hostCore = useInk(() => ({
    recipe: stickerBoardItemRecipe,
    params: {
      selected: selected.value,
      handles: editable.value
    },
    kind: "frame" as const,
    seed: seed.value
  }));
  const host = computed(() => proxyRefs(_hostCore));
  const name = computed(() => stickerLabel(item.value.name));
  const place = computed(() => (x: number, y: number) => {
    if (el.value) el.value.style.translate = `calc(${x}px - 50%) calc(${y}px - 50%)`;
  });
  const turned = computed(() => (rot: number) => {
    if (!el.value) return;
    el.value.style.rotate = `${rot}deg`;
    const d = down(rot);
    el.value.style.setProperty("--sb-dx", String(d.dx));
    el.value.style.setProperty("--sb-dy", String(d.dy));
  });
  const sized = computed(() => (s: number) => {
    if (!el.value) return;
    el.value.style.width = `${w.value * s}px`;
    el.value.style.height = `${h.value * s}px`;
    if (art.value) {
      art.value.style.scale = String(s);
      art.value.style.translate = `${-bx.value * s}px ${-by.value * s}px`;
    }
  });
  const latest = shallowRef(item.value);
  const settle = computed(() => () => {
    const it = latest.value;
    place.value(it.x, it.y);
    turned.value(it.rot);
    sized.value(it.scale);
    if (el.value) el.value.style.zIndex = String(1 + it.z);
  });
  const merged = computed(() => useMergedRef<HTMLDivElement>(el, host.value.hostRef));
  const start = computed(() => (e: PointerEvent) => {
    if (e.defaultPrevented || !editable.value || (e.button ?? 0) !== 0) return;
    const handle = (e.target as Element).closest?.("[data-handle]")?.getAttribute("data-handle");
    board.value.select(item.value.id);
    const node = e.currentTarget as HTMLDivElement;
    const r = node.getBoundingClientRect();
    const cx = r.left + r.width / 2,
      cy = r.top + r.height / 2;
    drag.value = {
      pointer: e.pointerId,
      mode: handle === "rotate" ? "rotate" as const : handle === "scale" ? "scale" as const : "move" as const,
      sx: e.clientX,
      sy: e.clientY,
      cx,
      cy,
      a0: Math.atan2(e.clientY - cy, e.clientX - cx),
      d0: Math.max(4, Math.hypot(e.clientX - cx, e.clientY - cy)),
      x0: item.value.x,
      y0: item.value.y,
      rot0: item.value.rot,
      scale0: item.value.scale,
      x: item.value.x,
      y: item.value.y,
      rot: item.value.rot,
      scale: item.value.scale,
      moved: false
    };
    try {
      node.setPointerCapture(e.pointerId);
    } catch {}
    node.dataset.dragging = "";
    node.style.zIndex = "1000000";
    node.focus({
      preventScroll: true
    });
  });
  const move = computed(() => (e: PointerEvent) => {
    const d = drag.value;
    if (!d || d.pointer !== e.pointerId) return;
    const dx = e.clientX - d.sx,
      dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 3) return;
    d.moved = true;
    if (d.mode === "move") {
      const [x, y] = keepIn(d.x0 + dx, d.y0 + dy, {
        w: w.value,
        h: h.value,
        rot: d.rot,
        scale: d.scale
      }, board.value.canvas(), board.value.bounds);
      d.x = x;
      d.y = y;
      place.value(x, y);
    } else if (d.mode === "rotate") {
      const a = Math.atan2(e.clientY - d.cy, e.clientX - d.cx);
      let rot = d.rot0 + (a - d.a0) * 180 / Math.PI;
      if (e.shiftKey) rot = Math.round(rot / BIG_TURN) * BIG_TURN;
      d.rot = turnTo(rot);
      turned.value(d.rot);
    } else {
      const dist = Math.hypot(e.clientX - d.cx, e.clientY - d.cy);
      d.scale = clamp(round2(d.scale0 * (dist / d.d0)), board.value.minScale, board.value.maxScale);
      sized.value(d.scale);
    }
  });
  const finish = computed(() => (cancel: boolean) => (e: PointerEvent) => {
    const d = drag.value;
    if (!d || d.pointer !== e.pointerId) return;
    drag.value = null;
    delete (e.currentTarget as HTMLDivElement).dataset.dragging;
    (e.currentTarget as HTMLDivElement).style.zIndex = String(1 + latest.value.z);
    if (cancel || !d.moved) return settle.value();
    const change = d.mode === "move" ? {
      x: Math.round(d.x),
      y: Math.round(d.y)
    } : d.mode === "rotate" ? {
      rot: d.rot
    } : {
      scale: d.scale
    };
    const said = d.mode === "move" ? `${name.value} moved to ${change.x}, ${change.y}.` : d.mode === "rotate" ? `${name.value} turned to ${d.rot} degrees.` : `${name.value} at ${Math.round(d.scale * 100)} percent.`;
    board.value.patch(item.value.id, change, said);
    setTimeout(settle.value, 0);
  });
  const keys = computed(() => (e: KeyboardEvent) => {
    if (e.defaultPrevented || !editable.value || e.target as HTMLDivElement !== e.currentTarget as HTMLDivElement) return;
    const k = e.key;
    const cur = latest.value;
    if (e.metaKey || e.ctrlKey && !e.altKey) {
      if (k.toLowerCase() === "d") {
        e.preventDefault();
        board.value.duplicate(item.value.id);
      }
      return;
    }
    if (drag.value && k === "Escape") {
      drag.value = null;
      delete (e.currentTarget as HTMLDivElement).dataset.dragging;
      return settle.value();
    }
    const step = e.altKey ? 1 : e.shiftKey ? BIG_STEP : STEP;
    const dx = k === "ArrowRight" ? step : k === "ArrowLeft" ? -step : 0;
    const dy = k === "ArrowDown" ? step : k === "ArrowUp" ? -step : 0;
    if (dx || dy) {
      e.preventDefault();
      const [x, y] = keepIn(cur.x + dx, cur.y + dy, {
        w: w.value,
        h: h.value,
        rot: cur.rot,
        scale: cur.scale
      }, board.value.canvas(), board.value.bounds);
      board.value.patch(item.value.id, {
        x,
        y
      }, `${name.value} at ${x}, ${y}.`);
    } else if (k === "[" || k === "{" || k === "]" || k === "}" || k === "r" || k === "R") {
      e.preventDefault();
      const by = e.shiftKey ? BIG_TURN : TURN;
      const left = k === "[" || k === "{" || k === "R";
      board.value.turn(item.value.id, left ? -by : by);
    } else if (k === "+" || k === "=" || k === "-" || k === "_") {
      e.preventDefault();
      const f = e.shiftKey ? BIG_ZOOM : ZOOM;
      board.value.resize(item.value.id, k === "+" || k === "=" ? f : 1 / f);
    } else if (k === "0") {
      e.preventDefault();
      board.value.patch(item.value.id, {
        rot: 0,
        scale: 1
      }, `${name.value} set upright at full size.`);
    } else if (k === "PageUp" || k === "PageDown") {
      e.preventDefault();
      board.value.reorder(item.value.id, k === "PageUp" ? e.shiftKey ? "front" as const : "forward" as const : e.shiftKey ? "back" as const : "backward" as const);
    } else if (k === "Delete" || k === "Backspace") {
      e.preventDefault();
      const sibling = (e.currentTarget as HTMLDivElement).nextElementSibling ?? (e.currentTarget as HTMLDivElement).previousElementSibling;
      board.value.remove(item.value.id);
      const surface = (e.currentTarget as HTMLDivElement).parentElement;
      (sibling instanceof HTMLElement && sibling.dataset.slot === "sticker-board-item" ? sibling : surface)?.focus?.({
        preventScroll: true
      });
    } else if (k === "Escape") {
      e.preventDefault();
      board.value.select(null);
      (e.currentTarget as HTMLDivElement).blur();
    }
  });
  return () => {
    latest.value = item.value;
    if (!face.value) return null;
    const out = 5;
    return <div data-slot="sticker-board-item" data-id={item.value.id} data-sticker={item.value.name} data-selected={selected.value ? "" as const : undefined} role="group" aria-roledescription="sticker" aria-label={name.value} aria-current={selected.value ? "true" as const : undefined} aria-describedby={editable.value ? board.value.help : undefined} tabindex={editable.value ? 0 : undefined} ref={merged.value} {...domProps(host.value.hostProps)} onPointerdown={start.value} onPointermove={move.value} onPointerup={finish.value(false)} onPointercancel={finish.value(true)} onKeydown={keys.value} onFocus={(e: FocusEvent) => {
      if (e.target as HTMLElement === e.currentTarget as HTMLElement && editable.value && !selected.value) board.value.select(item.value.id);
    }} class={cn("absolute top-0 left-0 isolate touch-none select-none not-focus-visible:outline-none", "[transition:scale_var(--ll-dur-hover)_var(--ll-ease-settle)]", editable.value && "cursor-grab data-dragging:cursor-grabbing hover:scale-[1.03] data-dragging:scale-[1.06] calm:hover:scale-100", "[--sb-lift:0] data-dragging:[--sb-lift:1]", "forced-colors:data-selected:outline-2 forced-colors:data-selected:outline-[Highlight]")} style={cssStyle({
      width: w.value * item.value.scale,
      height: h.value * item.value.scale,
      translate: `calc(${item.value.x}px - 50%) calc(${item.value.y}px - 50%)`,
      rotate: `${item.value.rot}deg`,
      zIndex: 1 + item.value.z,
      "--sb-dx": down(item.value.rot).dx,
      "--sb-dy": down(item.value.rot).dy,
      "--ll-drop-sticker": DROP
    } as UI.CSSProperties)}>
      {host.value.node}
      <span ref={art} data-slot="sticker-board-item-art" class="pointer-events-none absolute top-0 left-0 origin-top-left" style={cssStyle({
        width: fw.value,
        height: fh.value,
        translate: `${-bx.value * item.value.scale}px ${-by.value * item.value.scale}px`,
        scale: item.value.scale
      })}>
        <svg data-ink="sticker" aria-hidden="true" focusable="false" viewBox={`0 0 ${fw.value} ${fh.value}`} width={fw.value} height={fh.value} class="ll-drop-sticker pointer-events-none block overflow-visible" innerHTML={face.value.svg} />
      </span>
      {selected.value && editable.value ? <>
          <span data-handle="rotate" aria-hidden="true" class="absolute cursor-grab" style={cssStyle({
          left: "50%" as const,
          top: -(out + HANDLE.rotateUp),
          width: HANDLE.hit,
          height: HANDLE.hit,
          translate: "-50% -50%" as const
        })} />
          <span data-handle="scale" aria-hidden="true" class="absolute cursor-nwse-resize" style={cssStyle({
          left: `calc(100% + ${out + HANDLE.scaleOut - HANDLE.scaleSize / 2}px)`,
          top: `calc(100% + ${out + HANDLE.scaleOut - HANDLE.scaleSize / 2}px)`,
          width: HANDLE.hit,
          height: HANDLE.hit,
          translate: "-50% -50%" as const
        })} />
        </> : null}
    </div>;
  };
});
type ToolbarAction = "turn" | "size" | "layer" | "duplicate" | "delete" | "export";
type StickerBoardToolbarProps = Omit<UI.ComponentProps<"div">, "children"> & {
  actions?: readonly ToolbarAction[];
};
const ALL_ACTIONS: readonly ToolbarAction[] = ["turn", "size", "layer", "duplicate", "delete", "export"];
const StickerBoardToolbar = defineUi<StickerBoardToolbarProps>("StickerBoardToolbar", ["class", "actions", "onKeydown"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const actions = computed(() => _props["actions"] === undefined ? ALL_ACTIONS : _props["actions"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const props = computed(() => omitProps(_props, ["class", "actions", "onKeydown"]));
  const board = useStickerBoard();
  const id = computed(() => board.value.selectedId);
  const off = computed(() => !id.value || !board.value.editable);
  const row = shallowRef<HTMLElement | null | null>(null);
  const item = computed(() => board.value.items.find(s => s.id === id.value));
  const roving = computed(() => (e: KeyboardEvent) => {
    onKeydown.value?.(e);
    if (e.defaultPrevented) return;
    const k = e.key;
    if (k !== "ArrowRight" && k !== "ArrowLeft" && k !== "Home" && k !== "End") return;
    const list = [...(row.value?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])];
    const at = list.indexOf(document.activeElement as HTMLButtonElement);
    if (at < 0) return;
    e.preventDefault();
    const rtl = getComputedStyle(row.value as Element).direction === "rtl";
    const dir = (k === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
    const to = k === "Home" ? 0 : k === "End" ? list.length - 1 : (at + dir + list.length) % list.length;
    list[to].focus();
  });
  const removeAndMoveOn = computed(() => (gone: string) => {
    const surface = document.getElementById(board.value.canvasId)?.querySelector<HTMLElement>('[data-slot="sticker-board-surface"]');
    board.value.remove(gone);
    surface?.focus({
      preventScroll: true
    });
  });
  const tool = renderValue(() => (label: string, icon: string, run: () => void, o: {
    text?: string;
    disabled?: boolean;
    always?: boolean;
    mirror?: boolean;
  } = {}) => <Button key={label} type="button" variant="outline" size={o.text ? "sm" as const : "icon-sm" as const} aria-label={label} title={label} disabled={o.always ? false : o.disabled ?? off.value} onClick={run} data-tool={label}>
      {icon ? <Icon name={icon} size={16} class={o.mirror ? "-scale-x-100" as const : undefined} /> : null}
      {o.text}
    </Button>);
  const has = computed(() => (a: ToolbarAction) => actions.value.includes(a));
  const groups = computed<UI.ReactNode[]>(() => []);
  const group = renderValue(() => (key: string, children: UI.ReactNode) => groups.value.push(<div key={key} role="presentation" class="flex items-center gap-1.5">
        {children}
      </div>));
  return () => {
    if (has.value("turn")) group.value("turn", [tool.value("Turn left", "rotate-cw", () => id.value && board.value.turn(id.value, -TURN), {
      mirror: true
    }), tool.value("Turn right", "rotate-cw", () => id.value && board.value.turn(id.value, TURN))]);
    if (has.value("size")) group.value("size", [tool.value("Smaller", "minus", () => id.value && board.value.resize(id.value, 1 / ZOOM), {
      disabled: off.value || (item.value ? item.value.scale <= board.value.minScale : false)
    }), tool.value("Larger", "plus", () => id.value && board.value.resize(id.value, ZOOM), {
      disabled: off.value || (item.value ? item.value.scale >= board.value.maxScale : false)
    })]);
    if (has.value("layer")) group.value("layer", [tool.value("Send to back", "", () => id.value && board.value.reorder(id.value, "back"), {
      text: "Back" as const
    }), tool.value("Send backward", "arrow-down", () => id.value && board.value.reorder(id.value, "backward")), tool.value("Bring forward", "arrow-up", () => id.value && board.value.reorder(id.value, "forward")), tool.value("Bring to front", "", () => id.value && board.value.reorder(id.value, "front"), {
      text: "Front" as const
    })]);
    if (has.value("duplicate") || has.value("delete")) group.value("edit", [has.value("duplicate") && tool.value("Duplicate", "copy", () => id.value && board.value.duplicate(id.value)), has.value("delete") && tool.value("Delete", "trash", () => id.value && removeAndMoveOn.value(id.value))]);
    if (has.value("export")) group.value("export", [tool.value("Export", "download", board.value.exportBoard, {
      text: "Export" as const,
      always: true
    })]);
    return <Paper data-slot="sticker-board-toolbar" role="toolbar" aria-label="Sticker tools" aria-controls={board.value.canvasId} ref={row} onKeydown={roving.value} stock="slip" edge="cut" tilt={false} shadow="hair" class={cn("flex flex-wrap items-center gap-x-4 gap-y-2 px-2 py-1.5", className.value)} {...domProps(props.value)}>
      {groups.value}
    </Paper>;
  };
});
export { StickerBoard, StickerBoardCanvas, StickerBoardToolbar, useStickerBoard, addSticker, reorderSticker, boardPoint };
export type { StickerBoardItem, StickerBoardProps, StickerBoardCanvasProps, StickerBoardToolbarProps, StickerBoardExport, BoundsMode as StickerBoardBounds };
