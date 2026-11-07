// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, useId, shallowRef, proxyRefs } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useEnsureInkDefs, useInk, useInkSeed } from "@/lib/ink/vue";
import { hasSticker, kissCut, stickerFace, stickerLabel } from "@/lib/ink/recipes/sticker-ink";
import { stickerSheetRecipe, stickerSlotRecipe } from "@/lib/ink/recipes/sticker-sheet-ink";
import { cn } from "@/lib/utils";
interface StickerSheetPeel {
  id: string;
  name: string;
  label: string;
  dragged: boolean;
  x?: number;
  y?: number;
}
interface StickerSheetContextValue {
  peeled: readonly string[];
  peel(item: StickerSheetPeel): void;
  stick(item: StickerSheetPeel): void;
  size: number;
  restorable: boolean;
  disabled: boolean;
  uid: string;
}
const StickerSheetContext = createContext<StickerSheetContextValue | null>(null);
function useStickerSheet(): ComputedRef<StickerSheetContextValue> {
  const ctx = useContext(StickerSheetContext);
  return computed(() => {
    if (!ctx.value) console.error("StickerSheetItem must be used inside <StickerSheet>");
    return ctx.value;
  });
}
const cellOf = (size: number) => Math.round(size + 22);
const BACKINGS = {
  glassine: {
    stock: "slip" as const,
    tint: "color-mix(in srgb, var(--ll-sky) 13%, var(--ll-paper))" as const
  },
  kraft: {
    stock: "kraft" as const,
    tint: undefined
  },
  paper: {
    stock: "paper" as const,
    tint: undefined
  }
} as const satisfies Record<string, {
  stock: PaperProps["stock"];
  tint: string | undefined;
}>;
type StickerSheetProps = Omit<PaperProps, "ref" | "children" | "stock" | "onChange" | "size"> & {
  ref?: UI.Ref<HTMLElement>;
  stickers?: readonly string[];
  children?: UI.ReactNode;
  columns?: number;
  size?: number;
  title?: string;
  backing?: keyof typeof BACKINGS;
  peeled?: readonly string[];
  defaultPeeled?: readonly string[];
  onPeeledChange?: (peeled: string[]) => void;
  onPeel?: (item: StickerSheetPeel) => void;
  onStick?: (item: StickerSheetPeel) => void;
  restorable?: boolean;
  disabled?: boolean;
  label?: string;
};
const StickerSheet = defineUi<StickerSheetProps>("StickerSheet", ["class", "stickers", "columns", "size", "title", "backing", "peeled", "defaultPeeled", "onPeeledChange", "onPeel", "onStick", "restorable", "disabled", "label", "tilt", "seed", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const stickers = computed(() => _props["stickers"]);
  const columns = computed(() => _props["columns"] === undefined ? 4 : _props["columns"]);
  const size = computed(() => _props["size"] === undefined ? 72 : _props["size"]);
  const title = computed(() => _props["title"]);
  const backing = computed(() => _props["backing"] === undefined ? "glassine" as const : _props["backing"]);
  const peeledProp = computed(() => _props["peeled"]);
  const defaultPeeled = computed(() => _props["defaultPeeled"] === undefined ? [] : _props["defaultPeeled"]);
  const onPeeledChange = computed(() => _props["onPeeledChange"]);
  const onPeel = computed(() => _props["onPeel"]);
  const onStick = computed(() => _props["onStick"]);
  const restorable = computed(() => _props["restorable"] === undefined ? true : _props["restorable"]);
  const disabled = computed(() => _props["disabled"] === undefined ? false : _props["disabled"]);
  const label = computed(() => _props["label"] === undefined ? "Sticker sheet" as const : _props["label"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const seedProp = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "stickers", "columns", "size", "title", "backing", "peeled", "defaultPeeled", "onPeeledChange", "onPeel", "onStick", "restorable", "disabled", "label", "tilt", "seed", "style"]));
  const seed = useInkSeed(() => seedProp.value);
  const _nestedHook0 = useId();
  const uid = computed(() => _nestedHook0.replace(/[^a-zA-Z0-9]/g, ""));
  const titleId = useId();
  const inner = shallowRef<readonly string[]>(initialState(defaultPeeled.value));
  const setInner = stateSetter(inner);
  const controlled = computed(() => peeledProp.value !== undefined);
  const peeled = computed(() => peeledProp.value !== undefined ? peeledProp.value : inner.value);
  const status = shallowRef(initialState(""));
  const setStatus = stateSetter(status);
  const latest = shallowRef(peeled.value);
  const change = (next: string[]) => {
    latest.value = next;
    if (!controlled.value) setInner(next);
    onPeeledChange.value?.(next);
  };
  const ctx = computed<StickerSheetContextValue>(() => ({
    peeled: peeled.value,
    size: size.value,
    restorable: restorable.value,
    disabled: disabled.value,
    uid: uid.value,
    peel(item) {
      if (latest.value.includes(item.id)) return;
      change([...latest.value, item.id]);
      onPeel.value?.(item);
      setStatus(`${item.label} peeled off.`);
    },
    stick(item) {
      if (!latest.value.includes(item.id)) return;
      change(latest.value.filter(id => id !== item.id));
      onStick.value?.(item);
      setStatus(`${item.label} stuck back on.`);
    }
  }));
  const cell = computed(() => cellOf(size.value));
  const B = computed(() => BACKINGS[backing.value]);
  const header = computed(() => title.value ? 34 : 0);
  const _printCore = useInk(() => ({
    recipe: stickerSheetRecipe,
    params: {
      top: header.value
    },
    kind: "print" as const,
    seed: `${seed.value}|print`
  }));
  const print = computed(() => proxyRefs(_printCore));
  const items = renderValue(() => Children.count(children.value) ? children.value : (stickers.value ?? []).map(n => <StickerSheetItem key={n} name={n} />));
  const here = computed(() => new Set<string>());
  const unknown = shallowRef(0);
  const left = computed(() => here.value.size + unknown.value - [...here.value].filter(id => peeled.value.includes(id)).length);
  return () => {
    latest.value = peeled.value;
    Children.toArray(items.value).forEach(child => {
      const p = isValidElement(child) ? child.props as {
        name?: unknown;
        id?: unknown;
      } : null;
      if (p && typeof p.name === "string") {
        if (hasSticker(p.name)) here.value.add(typeof p.id === "string" ? p.id : p.name);
      } else unknown.value++;
    });
    return <StickerSheetContext.Provider value={ctx.value}>
      <Paper data-slot="sticker-sheet" data-backing={backing.value} data-disabled={disabled.value ? "" as const : undefined} role="group" aria-labelledby={title.value ? titleId : undefined} aria-label={title.value ? undefined : label.value} ref={ref.value} stock={B.value.stock} tilt={tilt.value} seed={seed.value} class={cn("w-fit max-w-full p-4 pt-4 has-[[data-dragging]]:z-(--ll-z-raised)", disabled.value && "opacity-70", className.value)} style={cssStyle({
        ...(B.value.tint ? {
          "--ll-stock": B.value.tint
        } : null),
        ...style.value
      } as UI.CSSProperties)} {...domProps(props.value)}>
        <div ref={print.value.hostRef} {...domProps(print.value.hostProps)} data-slot="sticker-sheet-print" aria-hidden="true" class="pointer-events-none absolute inset-1.5 isolate">
          {print.value.node}
        </div>
        {backing.value === "glassine" ? <span aria-hidden="true" data-slot="sticker-sheet-sheen" class="pointer-events-none absolute inset-0 [background:linear-gradient(112deg,transparent_30%,color-mix(in_srgb,var(--ll-photo)_42%,transparent)_43%,transparent_56%)] calm:hidden" /> : null}
        {title.value ? <div class="relative mb-2 flex h-6 items-baseline justify-between gap-3 px-1.5">
            <p id={titleId} class="truncate font-type text-sm text-pencil-text">
              {title.value}
            </p>
            <p class="shrink-0 font-type text-xs text-pencil-text ll-num">{Math.max(0, left.value)} left</p>
          </div> : null}
        <div data-slot="sticker-sheet-grid" class="relative grid justify-center gap-1 p-2" style={cssStyle({
          gridTemplateColumns: `repeat(${Math.max(1, columns.value)}, ${cell.value}px)`
        })}>
          {items.value}
        </div>
        <span role="status" class="sr-only">
          {status.value}
        </span>
      </Paper>
    </StickerSheetContext.Provider>;
  };
});
type StickerSheetItemProps = Omit<UI.ComponentProps<"button">, "name" | "id" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel"> & {
  name: string;
  id?: string;
  label?: string;
  size?: number;
};
const DRAG_AT = 6;
const DRAG_OFF = 18;
const StickerSheetItem = defineUi<StickerSheetItemProps>("StickerSheetItem", ["name", "id", "label", "size", "class", "onClick", "disabled"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const idProp = computed(() => _props["id"]);
  const labelProp = computed(() => _props["label"]);
  const sizeProp = computed(() => _props["size"]);
  const className = computed(() => _props["class"]);
  const onClick = computed(() => _props["onClick"]);
  const disabledProp = computed(() => _props["disabled"]);
  const props = computed(() => omitProps(_props, ["name", "id", "label", "size", "class", "onClick", "disabled"]));
  const sheet = useStickerSheet();
  useEnsureInkDefs();
  const id = computed(() => idProp.value ?? name.value);
  const px = computed(() => sizeProp.value ?? sheet.value.size);
  const cell = computed(() => cellOf(px.value));
  const label = computed(() => labelProp.value ?? stickerLabel(name.value));
  const peeled = computed(() => sheet.value.peeled.includes(id.value));
  const prefix = computed(() => `ll-ss${sheet.value.uid}${id.value}`.replace(/[^a-zA-Z0-9-]/g, ""));
  const face = computed(() => stickerFace(name.value, px.value, id.value, {
    idPrefix: prefix.value
  }));
  const warm = shallowRef(initialState(false));
  const setWarm = stateSetter(warm);
  const flap = computed(() => warm.value ? stickerFace(name.value, px.value, id.value, {
    peel: true,
    idPrefix: `${prefix.value}p`
  }) : null);
  const _slotCore = useInk(() => ({
    recipe: stickerSlotRecipe,
    params: {},
    kind: "frame" as const,
    seed: `${prefix.value}`
  }));
  const slot = computed(() => proxyRefs(_slotCore));
  const drag = shallowRef<{
    pointer: number;
    sx: number;
    sy: number;
    started: boolean;
  } | null | null>(null);
  const held = shallowRef<HTMLSpanElement | null | null>(null);
  const slotEl = shallowRef<HTMLDivElement | null | null>(null);
  const suppress = shallowRef(false);
  const peeledNow = shallowRef(peeled.value);
  const disabled = computed(() => disabledProp.value || sheet.value.disabled);
  const spent = computed(() => peeled.value && !sheet.value.restorable);
  const item = computed(() => (dragged: boolean, e?: {
    clientX: number;
    clientY: number;
  }): StickerSheetPeel => ({
    id: id.value,
    name: name.value,
    label: label.value,
    dragged,
    x: e?.clientX,
    y: e?.clientY
  }));
  const carry = computed(() => (dx: number, dy: number) => {
    if (!held.value) return;
    held.value.style.translate = `${dx}px ${dy}px`;
    held.value.style.rotate = `${Math.max(-14, Math.min(14, dx * 0.06))}deg`;
  });
  const putDown = computed(() => () => {
    if (!held.value) return;
    held.value.style.translate = "";
    held.value.style.rotate = "";
  });
  watchDependencies(() => {
    if (peeled.value) return;
    slotEl.value?.removeAttribute("data-drop");
    putDown.value();
  }, () => [peeled.value], false);
  return () => {
    peeledNow.value = peeled.value;
    if (!face.value) return null;
    const cx = face.value.box.x + face.value.box.w / 2;
    const cy = face.value.box.y + face.value.box.h / 2;
    const at = {
      left: cell.value / 2 - cx,
      top: cell.value / 2 - cy
    };
    const kiss = kissCut(face.value, `${prefix.value}k`);
    const down = (e: PointerEvent) => {
      setWarm(true);
      if (disabled.value || peeled.value || e.pointerType === "touch" || (e.button ?? 0) !== 0) return;
      suppress.value = false;
      drag.value = {
        pointer: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        started: false
      };
      try {
        (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
      } catch {}
    };
    const move = (e: PointerEvent) => {
      const d = drag.value;
      if (!d || d.pointer !== e.pointerId) return;
      const dx = e.clientX - d.sx,
        dy = e.clientY - d.sy;
      if (!d.started && Math.hypot(dx, dy) < DRAG_AT) return;
      if (!d.started) {
        d.started = true;
        slotEl.value?.setAttribute("data-dragging", "");
      }
      carry.value(dx, dy);
    };
    const up = (cancel: boolean) => (e: PointerEvent) => {
      const d = drag.value;
      if (!d || d.pointer !== e.pointerId) return;
      drag.value = null;
      if (!d.started) return;
      slotEl.value?.removeAttribute("data-dragging");
      suppress.value = !cancel;
      setTimeout(() => suppress.value = false, 0);
      const far = Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_OFF;
      if (cancel || !far) return putDown.value();
      slotEl.value?.setAttribute("data-drop", "");
      sheet.value.peel(item.value(true, e));
      setTimeout(() => {
        if (peeledNow.value) return;
        slotEl.value?.removeAttribute("data-drop");
        putDown.value();
      }, 0);
    };
    return <div ref={slotEl} data-slot="sticker-sheet-slot" data-state={peeled.value ? "peeled" as const : "stuck" as const} class="group/slot relative shrink-0" style={cssStyle({
      width: cell.value,
      height: cell.value
    })}>
      <svg data-ink="prop" aria-hidden="true" focusable="false" viewBox={`0 0 ${face.value.w} ${face.value.h}`} width={face.value.w} height={face.value.h} class="pointer-events-none absolute block overflow-visible" style={cssStyle(at)} innerHTML={kiss} />
      <button type="button" data-slot="sticker-sheet-item" data-sticker={name.value} aria-label={peeled.value ? sheet.value.restorable ? `Put ${label.value} sticker back` : `${label.value} sticker, peeled` : `Peel ${label.value} sticker`} aria-disabled={spent.value ? true : undefined} disabled={disabled.value} ref={slot.value.hostRef} {...domProps(slot.value.hostProps)} onPointerenter={() => setWarm(true)} onFocus={() => setWarm(true)} onPointerdown={down} onPointermove={move} onPointerup={up(false)} onPointercancel={up(true)} onClick={(e: PointerEvent) => {
        onClick.value?.(e);
        if (e.defaultPrevented || spent.value) return;
        if (suppress.value) {
          suppress.value = false;
          return;
        }
        if (peeled.value) sheet.value.stick(item.value(false));else sheet.value.peel(item.value(false));
      }} class={cn("absolute inset-0 touch-manipulation select-none not-focus-visible:outline-none", "enabled:cursor-grab enabled:active:cursor-grabbing disabled:cursor-default aria-disabled:cursor-default!", "group-data-[dragging]/slot:z-(--ll-z-raised)", className.value)} {...domProps(props.value)}>
        {slot.value.node}
        <span data-slot="sticker-sheet-art" class={cn("pointer-events-none absolute block transition-[translate,rotate,scale,opacity] duration-(--ll-dur-sheet) ease-(--ll-ease-settle)", "group-data-[state=peeled]/slot:translate-x-4 group-data-[state=peeled]/slot:-translate-y-6 group-data-[state=peeled]/slot:-rotate-12 group-data-[state=peeled]/slot:scale-110 group-data-[state=peeled]/slot:opacity-0", "group-data-[drop]/slot:translate-x-0! group-data-[drop]/slot:translate-y-0! group-data-[drop]/slot:rotate-0! group-data-[drop]/slot:scale-100! group-data-[drop]/slot:duration-(--ll-dur-fade)!")} style={cssStyle({
          ...at,
          width: face.value.w,
          height: face.value.h
        })} onTransitionend={e => {
          if (e.target !== e.currentTarget || e.propertyName !== "opacity" || !peeled.value || !slotEl.value?.hasAttribute("data-drop")) return;
          slotEl.value.removeAttribute("data-drop");
          putDown.value();
        }}>
          <span ref={held} class="relative block size-full transition-[scale,rotate] duration-(--ll-dur-hover) ease-(--ll-ease-settle) group-hover/slot:-rotate-2 group-hover/slot:scale-[1.04] group-data-[dragging]/slot:scale-110 group-data-[dragging]/slot:transition-none">
            <svg data-ink="sticker" aria-hidden="true" focusable="false" viewBox={`0 0 ${face.value.w} ${face.value.h}`} width={face.value.w} height={face.value.h} class="ll-drop-sticker pointer-events-none absolute inset-0 block overflow-visible transition-opacity duration-(--ll-dur-fade) group-hover/slot:opacity-0 group-has-[:focus-visible]/slot:opacity-0 group-data-[dragging]/slot:opacity-0 group-data-[state=peeled]/slot:opacity-0" innerHTML={face.value.svg} />
            {flap.value ? <svg data-ink="sticker" aria-hidden="true" focusable="false" viewBox={`0 0 ${flap.value.w} ${flap.value.h}`} width={flap.value.w} height={flap.value.h} class="ll-drop-sticker pointer-events-none absolute inset-0 block overflow-visible opacity-0 transition-opacity duration-(--ll-dur-fade) group-hover/slot:opacity-100 group-has-[:focus-visible]/slot:opacity-100 group-data-[dragging]/slot:opacity-100 group-data-[state=peeled]/slot:opacity-100" innerHTML={flap.value.svg} /> : null}
          </span>
        </span>
      </button>
    </div>;
  };
});
export { StickerSheet, StickerSheetItem, useStickerSheet };
export type { StickerSheetProps, StickerSheetItemProps, StickerSheetPeel };
