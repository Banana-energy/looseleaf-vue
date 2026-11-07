// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
import { useInk, useInkSeed, useMergedRef } from "@/lib/ink/vue";
import { ratingRecipe, type RatingIcon } from "@/lib/ink/recipes/rating-ink";
import { cn } from "@/lib/utils";
type RatingSize = "sm" | "default" | "lg";
interface RatingContextValue {
  max: number;
  allowHalf: boolean;
  icon: RatingIcon;
  size: RatingSize;
  shown: number;
  current: number;
  interactive: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  tabStop: number;
  seed: string;
  getLabel: (value: number, max: number) => string;
  select: (value: number) => void;
  preview: (value: number | null) => void;
}
const RatingContext = createContext<RatingContextValue | null>(null);
function useRatingContext(): ComputedRef<RatingContextValue> {
  const c = useContext(RatingContext);
  return computed(() => {
    if (!c.value) console.error("RatingItem must be used within <Rating>");
    return c.value;
  });
}
const glyph: Record<RatingSize, string> = {
  sm: "size-5" as const,
  default: "size-6" as const,
  lg: "size-8" as const
};
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const noop = (): void => {};
const RatingItem = defineUi<Omit<UI.ComponentProps<"span">, "children"> & {
  index: number;
}>("RatingItem", ["index", "class"], (_props, {
  slots: _slots
}) => {
  const index = computed(() => _props["index"]);
  const className = computed(() => _props["class"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["index", "class", "ref"]));
  const c = useRatingContext();
  const state = computed(() => c.value.shown >= index.value ? "checked" as const : c.value.allowHalf && c.value.shown >= index.value - 0.5 ? "indeterminate" as const : "unchecked" as const);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: ratingRecipe,
    params: {
      icon: c.value.icon,
      disabled: c.value.disabled,
      invalid: c.value.invalid
    },
    kind: "rating" as const,
    seed: `${c.value.seed}:${index.value}`,
    still: true
  }));
  const values = computed(() => c.value.allowHalf ? [index.value - 0.5, index.value] : [index.value]);
  return () => {
    return <span data-slot="rating-item" data-state={state.value} data-value={index.value} data-ink-focus="within" ref={useMergedRef<HTMLSpanElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate inline-block shrink-0 transition-transform duration-(--ll-dur-pop) ease-pop", glyph[c.value.size], c.value.interactive && "hover:scale-110", "forced-colors:before:absolute forced-colors:before:inset-0 forced-colors:before:grid forced-colors:before:place-content-center forced-colors:before:leading-none forced-colors:before:content-['☆'] forced-colors:data-[state=checked]:before:content-['★'] forced-colors:data-[state=indeterminate]:before:content-['◐']", className.value)} {...domProps(props.value)}>
      {node.value}
      {!c.value.readOnly ? values.value.map((v, i) => <button key={v} type="button" role="radio" data-slot="rating-radio" data-value={v} aria-checked={c.value.current === v} aria-label={c.value.getLabel(v, c.value.max)} tabindex={v === c.value.tabStop ? 0 : -1} disabled={c.value.disabled} onClick={() => c.value.select(v)} onPointerenter={(e: PointerEvent) => {
        if (e.pointerType === "mouse") c.value.preview(v);
      }} class={cn("absolute -inset-y-0.5 cursor-pointer appearance-none bg-transparent outline-hidden disabled:cursor-not-allowed", values.value.length === 1 ? "-inset-x-0.5" as const : i === 0 ? "-start-0.5 w-[calc(50%+2px)]" as const : "-end-0.5 w-[calc(50%+2px)]" as const)} />) : null}
    </span>;
  };
});
const Rating = defineUi<Omit<UI.ComponentProps<"div">, "defaultValue" | "children"> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  icon?: RatingIcon;
  size?: RatingSize;
  clearable?: boolean;
  getLabel?: (value: number, max: number) => string;
  seed?: string | number;
  children?: UI.ReactNode;
}>("Rating", ["value", "defaultValue", "onValueChange", "max", "allowHalf", "readOnly", "disabled", "required", "name", "icon", "size", "clearable", "getLabel", "seed", "class", "onKeydown", "onPointerleave"], (_props, {
  slots: _slots
}) => {
  const value = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"] === undefined ? 0 : _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const max = computed(() => _props["max"] === undefined ? 5 : _props["max"]);
  const allowHalf = computed(() => _props["allowHalf"] === undefined ? false : _props["allowHalf"]);
  const readOnly = computed(() => _props["readOnly"] === undefined ? false : _props["readOnly"]);
  const disabled = computed(() => _props["disabled"] === undefined ? false : _props["disabled"]);
  const required = computed(() => _props["required"]);
  const name = computed(() => _props["name"]);
  const icon = computed(() => _props["icon"] === undefined ? "star" as const : _props["icon"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const clearable = computed(() => _props["clearable"] === undefined ? false : _props["clearable"]);
  const getLabel = computed(() => _props["getLabel"] === undefined ? (v, m) => `${v} of ${m}` : _props["getLabel"]);
  const seedProp = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const onKeydown = computed(() => _props["onKeydown"]);
  const onPointerleave = computed(() => _props["onPointerleave"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["value", "defaultValue", "onValueChange", "max", "allowHalf", "readOnly", "disabled", "required", "name", "icon", "size", "clearable", "getLabel", "seed", "class", "children", "onKeydown", "onPointerleave", "ref"]));
  const step = computed(() => allowHalf.value ? 0.5 : 1);
  const snap = computed(() => (v: number): number => clamp(Math.round(v / step.value) * step.value, 0, max.value));
  const inner = shallowRef(initialState(() => snap.value(defaultValue.value)));
  const setInner = stateSetter(inner);
  const hover = shallowRef<number | null>(initialState(null));
  const setHover = stateSetter(hover);
  const controlled = computed(() => value.value !== undefined);
  const current = computed(() => snap.value(value.value !== undefined ? value.value : inner.value));
  const interactive = computed(() => !readOnly.value && !disabled.value);
  const shown = computed(() => interactive.value && hover.value !== null ? hover.value : current.value);
  const seed = useInkSeed(() => seedProp.value);
  const tabStop = computed(() => current.value > 0 ? current.value : step.value);
  const invalid = computed(() => props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true");
  const rootRef = shallowRef<HTMLDivElement | null>(null);
  const inputRef = shallowRef<HTMLInputElement | null>(null);
  const set = computed(() => (v: number): void => {
    const next = snap.value(v);
    if (!controlled.value) setInner(next);
    if (next !== current.value) onValueChange.value?.(next);
  });
  const latest = shallowRef({
    reset: () => {}
  });
  watchDependencies(() => {
    const form = inputRef.value?.form ?? rootRef.value?.closest("form");
    if (!form) return;
    const reset = () => latest.value.reset();
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, () => [name.value, required.value], false);
  const ctx = computed<RatingContextValue>(() => ({
    max: max.value,
    allowHalf: allowHalf.value,
    icon: icon.value,
    size: size.value,
    shown: shown.value,
    current: current.value,
    interactive: interactive.value,
    disabled: disabled.value,
    readOnly: readOnly.value,
    invalid: invalid.value,
    tabStop: tabStop.value,
    seed: seed.value,
    getLabel: getLabel.value,
    select: v => {
      setHover(null);
      set.value(clearable.value && v === current.value ? 0 : v);
    },
    preview: setHover
  }));
  const items = renderValue(() => children.value ?? Array.from({
    length: max.value
  }, (_, i) => <RatingItem key={i} index={i + 1} />));
  return () => {
    latest.value.reset = () => {
      const next = snap.value(defaultValue.value);
      if (!controlled.value) setInner(next);
      if (next !== current.value) onValueChange.value?.(next);
    };
    return <RatingContext.Provider value={ctx.value}>
      <div data-slot="rating" data-readonly={readOnly.value ? "" as const : undefined} data-disabled={disabled.value ? "" as const : undefined} role={readOnly.value ? "img" as const : "radiogroup" as const} aria-label={readOnly.value && !props.value["aria-label"] && !props.value["aria-labelledby"] ? `Rated ${current.value} out of ${max.value}` : props.value["aria-label"]} aria-required={!readOnly.value && required.value ? true : undefined} aria-disabled={disabled.value && !readOnly.value ? true : undefined} ref={useMergedRef<HTMLDivElement>(rootRef, ref.value)} class={cn("relative inline-flex items-center gap-1 align-middle", className.value)} onPointerleave={(e: PointerEvent) => {
        setHover(null);
        onPointerleave.value?.(e);
      }} onKeydown={(e: KeyboardEvent) => {
        onKeydown.value?.(e);
        if (e.defaultPrevented || !interactive.value || !(e.target as HTMLElement).matches("[role=radio]")) return;
        const rtl = getComputedStyle(e.currentTarget as HTMLElement).direction === "rtl";
        let next: number;
        if (e.key === "ArrowRight") next = current.value + (rtl ? -step.value : step.value);else if (e.key === "ArrowLeft") next = current.value + (rtl ? step.value : -step.value);else if (e.key === "ArrowUp") next = current.value + step.value;else if (e.key === "ArrowDown") next = current.value - step.value;else if (e.key === "Home") next = step.value;else if (e.key === "End") next = max.value;else return;
        e.preventDefault();
        next = clamp(next, step.value, max.value);
        set.value(next);
        (e.currentTarget as HTMLElement).querySelector<HTMLElement>(`[role=radio][data-value="${next}"]`)?.focus();
      }} {...domProps(props.value)}>
        {items.value}
        {required.value && !readOnly.value ? <input ref={inputRef} type="text" name={name.value} value={current.value > 0 ? current.value : "" as const} required disabled={disabled.value} tabindex={-1} aria-hidden="true" autocomplete="off" onChange={noop} class="pointer-events-none absolute inset-0 size-full opacity-0" /> : name.value ? <input ref={inputRef} type="hidden" name={name.value} value={current.value} disabled={disabled.value} /> : null}
      </div>
    </RatingContext.Provider>;
  };
});
export { Rating, RatingItem };
