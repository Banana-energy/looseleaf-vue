// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { stepperRecipe, stepperTallyRecipe, tallyWidth, TALLY_H } from "@/lib/ink/recipes/stepper-ink";
import { cn } from "@/lib/utils";
type Direction = 1 | -1;
interface StepperContextValue {
  value: number | undefined;
  min?: number;
  max?: number;
  step: number;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  atMin: boolean;
  atMax: boolean;
  holding: 0 | Direction;
  motion: {
    dir: Direction;
    n: number;
  } | null;
  format: (n: number) => string;
  commitText: (text: string) => boolean;
  adjust: (delta: number) => void;
  jump: (to: number | undefined) => void;
  startHold: (dir: Direction) => void;
  stopHold: () => void;
  largeStep: number;
  wheel: boolean;
  hiddenName: string | undefined;
  inputProps: {
    id?: string;
    name?: string;
    form?: string;
    required?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
  };
  inputRef: UI.RefObject<HTMLInputElement | null>;
  reset: () => void;
  nudge: () => void;
}
const StepperContext = createContext<StepperContextValue | null>(null);
function useStepper(): ComputedRef<StepperContextValue> {
  const ctx = useContext(StepperContext);
  return computed(() => {
    if (!ctx.value) console.error("Stepper parts must be used inside <Stepper>");
    return ctx.value;
  });
}
const decimals = (n: number | undefined): number => {
  if (n === undefined || !Number.isFinite(n)) return 0;
  const s = String(n);
  if (s.includes("e-")) return Number(s.split("e-")[1]);
  const i = s.indexOf(".");
  return i < 0 ? 0 : s.length - i - 1;
};
function parseNumber(text: string): number | undefined {
  const t = text.trim().replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x660)).replace(/[\u06f0-\u06f9]/g, d => String(d.charCodeAt(0) - 0x6f0)).replace(/\u066b/g, ".").replace(/\u066c/g, ",").replace(/[\s\u00a0\u202f']/g, "");
  const m = /^([-+\u2212]?)([\d.,]*)$/.exec(t);
  if (!m || !/\d/.test(m[2])) return undefined;
  const body = m[2];
  const dots = body.split(".").length - 1;
  const commas = body.split(",").length - 1;
  const point = dots && commas ? body.lastIndexOf(".") > body.lastIndexOf(",") ? "." as const : "," as const : dots === 1 && !commas ? "." as const : commas === 1 && !dots ? "," as const : "" as const;
  const group = point === "." ? "," as const : point === "," ? "." as const : dots > 1 ? "." as const : commas > 1 ? "," as const : "" as const;
  const at = point ? body.lastIndexOf(point) : -1;
  const whole = at < 0 ? body : body.slice(0, at);
  const frac = at < 0 ? "" as const : body.slice(at + 1);
  if (!(group ? new RegExp(`^(\\d{1,3}(\\${group}\\d{3})*)?$`) : /^\d*$/).test(whole) || !/^\d*$/.test(frac)) return undefined;
  const n = Number(`${whole.replace(/[.,]/g, "") || "0"}${frac ? `.${frac}` : "" as const}`);
  return Number.isFinite(n) ? m[1] === "-" || m[1] === "\u2212" ? -n : n : undefined;
}
const HOLD_DELAY = 420;
const HOLD_EVERY = 90;
interface StepperProps extends Omit<UI.ComponentProps<"div">, "defaultValue" | "onChange" | "id"> {
  value?: number | undefined;
  defaultValue?: number;
  onValueChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  snap?: boolean;
  precision?: number;
  format?: (value: number) => string;
  parse?: (text: string) => number | undefined;
  wheel?: boolean;
  id?: string;
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  seed?: string | number;
}
const Stepper = defineUi<StepperProps>("Stepper", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const _value = computed(() => props.value);
  const defaultValue = computed(() => props.defaultValue);
  const onValueChange = computed(() => props.onValueChange);
  const min = computed(() => props.min);
  const max = computed(() => props.max);
  const stepProp = computed(() => props.step === undefined ? 1 : props.step);
  const largeStepProp = computed(() => props.largeStep);
  const snap = computed(() => props.snap === undefined ? false : props.snap);
  const precisionProp = computed(() => props.precision);
  const formatProp = computed(() => props.format);
  const parseProp = computed(() => props.parse);
  const wheel = computed(() => props.wheel === undefined ? false : props.wheel);
  const id = computed(() => props.id);
  const name = computed(() => props.name);
  const form = computed(() => props.form);
  const required = computed(() => props.required);
  const disabled = computed(() => props.disabled === undefined ? false : props.disabled);
  const readOnly = computed(() => props.readOnly === undefined ? false : props.readOnly);
  const invalid = computed(() => props.invalid === undefined ? false : props.invalid);
  const ariaLabel = computed(() => props["aria-label"]);
  const ariaLabelledby = computed(() => props["aria-labelledby"]);
  const ariaDescribedby = computed(() => props["aria-describedby"]);
  const seed = computed(() => props.seed);
  const className = computed(() => props.className);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => props.ref);
  const rest = computed(() => omitProps(props, ["value", "defaultValue", "onValueChange", "min", "max", "step", "largeStep", "snap", "precision", "format", "parse", "wheel", "id", "name", "form", "required", "disabled", "readOnly", "invalid", "aria-label", "aria-labelledby", "aria-describedby", "seed", "className", "children", "ref"]));
  const step = computed(() => Number.isFinite(stepProp.value) && stepProp.value > 0 ? stepProp.value : 1);
  const controlled = computed(() => "value" in props);
  const inner = shallowRef<number | undefined>(initialState(defaultValue.value));
  const setInner = stateSetter(inner);
  const rawValue = computed(() => controlled.value ? props.value : inner.value);
  const value = computed(() => rawValue.value !== undefined && Number.isFinite(rawValue.value) ? rawValue.value : undefined);
  const latest = shallowRef(value.value);
  const motion = shallowRef<StepperContextValue["motion"]>(initialState(null));
  const setMotion = stateSetter(motion);
  const holding = shallowRef<0 | Direction>(initialState(0));
  const setHolding = stateSetter(holding);
  const limit = shallowRef(initialState(0));
  const setLimit = stateSetter(limit);
  const nudge = () => setLimit(n => n + 1);
  const inputRef = shallowRef<HTMLInputElement | null | null>(null);
  const places = computed(() => precisionProp.value ?? Math.max(decimals(step.value), decimals(min.value)));
  const round = (n: number, from?: number) => Number(n.toFixed(Math.min(Math.max(places.value, decimals(from)), 12)));
  const clamp = (n: number) => Math.min(max.value ?? Infinity, Math.max(min.value ?? -Infinity, n));
  const format = (n: number) => formatProp.value ? formatProp.value(n) : precisionProp.value !== undefined ? n.toFixed(precisionProp.value) : String(n);
  const parse = (text: string): number | undefined => {
    if (parseProp.value) return parseProp.value(text);
    return parseNumber(text);
  };
  const largeStep = computed(() => largeStepProp.value ?? step.value * 10);
  const set = (next: number | undefined) => {
    latest.value = next;
    if (!controlled.value) setInner(next);
    onValueChange.value?.(next);
  };
  const snapTo = (n: number) => {
    if (!snap.value) return n;
    const origin = min.value ?? 0;
    return origin + Math.round((n - origin) / step.value) * step.value;
  };
  const adjust = (delta: number) => {
    if (disabled.value || readOnly.value) return;
    const from = latest.value;
    const next = clamp(round(snapTo((from ?? 0) + delta), from));
    if (next === from) {
      if (delta !== 0) nudge();
      return;
    }
    setMotion(m => ({
      dir: delta > 0 ? 1 : -1,
      n: (m?.n ?? 0) + 1
    }));
    set(next);
  };
  const jump = (to: number | undefined) => {
    if (disabled.value || readOnly.value || to === undefined || to === latest.value) return;
    setMotion(m => ({
      dir: latest.value === undefined || to > latest.value ? 1 : -1,
      n: (m?.n ?? 0) + 1
    }));
    set(to);
  };
  const commitText = (text: string): boolean => {
    if (text.trim() === "") {
      if (required.value) return false;
      set(undefined);
      return true;
    }
    const n = parse(text);
    if (n === undefined || !Number.isFinite(n)) return false;
    const next = clamp(Number(snapTo(n).toPrecision(12)));
    if (next !== latest.value) set(next);
    return true;
  };
  const timers = shallowRef<{
    wait?: number;
    run?: number;
    count: number;
  }>({
    count: 0
  });
  const stopHold = () => {
    window.clearTimeout(timers.value.wait);
    window.clearInterval(timers.value.run);
    timers.value = {
      count: 0
    };
    setHolding(0);
  };
  const startHold = (dir: Direction) => {
    stopHold();
    if (disabled.value || readOnly.value) return;
    adjust(dir * step.value);
    setHolding(dir);
    const tickOnce = () => {
      const before = latest.value;
      adjust(dir * step.value * (timers.value.count > 24 ? 5 : 1));
      timers.value.count++;
      if (latest.value === before) stopHold();
    };
    timers.value.wait = window.setTimeout(() => {
      timers.value.run = window.setInterval(tickOnce, HOLD_EVERY);
    }, HOLD_DELAY);
  };
  watchDependencies(() => stopHold, () => [stopHold], false);
  const reset = () => {
    if (!controlled.value) {
      latest.value = defaultValue.value;
      setInner(defaultValue.value);
    }
  };
  const hasValue = computed(() => value.value !== undefined);
  const atMin = computed(() => hasValue.value && min.value !== undefined && value.value <= min.value);
  const atMax = computed(() => hasValue.value && max.value !== undefined && value.value >= max.value);
  const ctx = computed<StepperContextValue>(() => ({
    value: value.value,
    min: min.value,
    max: max.value,
    step: step.value,
    disabled: disabled.value,
    readOnly: readOnly.value,
    invalid: invalid.value,
    atMin: atMin.value,
    atMax: atMax.value,
    holding: holding.value,
    motion: motion.value,
    format,
    commitText,
    adjust,
    jump,
    startHold,
    stopHold,
    largeStep: largeStep.value,
    wheel: wheel.value,
    hiddenName: formatProp.value ? name.value : undefined,
    inputProps: {
      id: id.value,
      name: formatProp.value ? undefined : name.value,
      form: form.value,
      required: required.value,
      "aria-label": ariaLabel.value,
      "aria-labelledby": ariaLabelledby.value,
      "aria-describedby": ariaDescribedby.value
    },
    inputRef,
    reset,
    nudge
  }));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: stepperRecipe,
    params: {
      disabled: disabled.value,
      invalid: invalid.value && !disabled.value,
      plain: false
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    void _value.value;
    latest.value = value.value;
    return <StepperContext.Provider value={ctx.value}>
      <style>
        {STEPPER_CSS}
      </style>
      <div data-slot="stepper" role="group" data-ink-focus="within" data-disabled={disabled.value ? "" as const : undefined} data-invalid={invalid.value ? "" as const : undefined} data-limit={limit.value ? limit.value % 2 ? "a" as const : "b" as const : undefined} ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate inline-flex h-9 w-fit items-stretch font-hand text-base text-(--ll-input-ink) compact:h-8 calm:h-7", className.value)} {...domProps(rest.value)}>
        {node.value}
        {readSlot(_slots.default) ?? <>
            <StepperDecrement />
            <StepperInput />
            <StepperIncrement />
          </>}
      </div>
    </StepperContext.Provider>;
  };
});
const STEPPER_CSS = "@keyframes ll-step-shake-a{0%{rotate:0deg}20%{rotate:-1.6deg}45%{rotate:1.3deg}70%{rotate:-.7deg}100%{rotate:0deg}}@keyframes ll-step-shake-b{0%{rotate:0deg}20%{rotate:-1.6deg}45%{rotate:1.3deg}70%{rotate:-.7deg}100%{rotate:0deg}}" + '[data-slot=stepper][data-limit=a]{animation:ll-step-shake-a var(--ll-dur-toss) ease-out both}[data-slot=stepper][data-limit=b]{animation:ll-step-shake-b var(--ll-dur-toss) ease-out both}' + "@keyframes ll-step-up-a{0%{translate:0 38%;opacity:.35}100%{translate:0 0;opacity:1}}@keyframes ll-step-up-b{0%{translate:0 38%;opacity:.35}100%{translate:0 0;opacity:1}}" + "@keyframes ll-step-down-a{0%{translate:0 -38%;opacity:.35}100%{translate:0 0;opacity:1}}@keyframes ll-step-down-b{0%{translate:0 -38%;opacity:.35}100%{translate:0 0;opacity:1}}" + '[data-slot=stepper-input][data-tick="up-a"]{animation:ll-step-up-a var(--ll-dur-pop) var(--ll-ease-settle) both}[data-slot=stepper-input][data-tick="up-b"]{animation:ll-step-up-b var(--ll-dur-pop) var(--ll-ease-settle) both}' + '[data-slot=stepper-input][data-tick="down-a"]{animation:ll-step-down-a var(--ll-dur-pop) var(--ll-ease-settle) both}[data-slot=stepper-input][data-tick="down-b"]{animation:ll-step-down-b var(--ll-dur-pop) var(--ll-ease-settle) both}';
const BUTTON = "relative m-[3px] calm:m-0.5 grid aspect-square shrink-0 cursor-default place-items-center text-ink outline-hidden select-none hover:ll-swipe focus-visible:ll-swipe focus-visible:[outline:2px_solid_var(--ll-focus)] focus-visible:outline-offset-[-2px] active:[background:color-mix(in_srgb,var(--ll-hi)_85%,transparent)] data-[holding=true]:[background:color-mix(in_srgb,var(--ll-hi)_85%,transparent)] aria-disabled:pointer-events-none aria-disabled:text-pencil-text [&_svg]:pointer-events-none";
const StepperButton = defineUi<UI.ComponentProps<"button"> & {
  direction: Direction;
}>("StepperButton", ["direction", "class", "onPointerdown", "onClick", "onKeydown"], (_props, {
  slots: _slots
}) => {
  const direction = computed(() => _props["direction"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const onPointerdown = computed(() => _props["onPointerdown"]);
  const onClick = computed(() => _props["onClick"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const props = computed(() => omitProps(_props, ["direction", "class", "children", "onPointerdown", "onClick", "onKeydown"]));
  const ctx = useStepper();
  const off = computed(() => ctx.value.disabled || ctx.value.readOnly || (direction.value === 1 ? ctx.value.atMax : ctx.value.atMin));
  return () => {
    return <button type="button" tabindex={-1} data-holding={ctx.value.holding === direction.value || undefined} aria-disabled={off.value || undefined} disabled={ctx.value.disabled} onMousedown={(e: MouseEvent) => e.preventDefault()} onPointerdown={(e: PointerEvent) => {
      onPointerdown.value?.(e);
      if (e.defaultPrevented || e.pointerType === "mouse" && e.button !== 0) return;
      if (off.value) {
        if (!ctx.value.disabled && !ctx.value.readOnly) ctx.value.nudge();
        return;
      }
      ctx.value.startHold(direction.value);
      const stop = () => {
        ctx.value.stopHold();
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
      };
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
    }} onClick={(e: PointerEvent) => {
      onClick.value?.(e);
      if (e.defaultPrevented || e.detail !== 0 || off.value) return;
      ctx.value.adjust(direction.value * ctx.value.step);
    }} onKeydown={(e: KeyboardEvent) => {
      onKeydown.value?.(e);
      e.stopPropagation();
    }} class={cn(BUTTON, className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
    </button>;
  };
});
const StepperDecrement = defineUi<UI.ComponentProps<"button">>("StepperDecrement", ["class", "aria-label"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const label = computed(() => _props["aria-label"] === undefined ? "Decrease" as const : _props["aria-label"]);
  const props = computed(() => omitProps(_props, ["class", "children", "aria-label"]));
  return () => {
    return <StepperButton direction={-1} data-slot="stepper-decrement" aria-label={label.value} class={className.value} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? <Icon name="minus" size={18} />}
    </StepperButton>;
  };
});
const StepperIncrement = defineUi<UI.ComponentProps<"button">>("StepperIncrement", ["class", "aria-label"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const label = computed(() => _props["aria-label"] === undefined ? "Increase" as const : _props["aria-label"]);
  const props = computed(() => omitProps(_props, ["class", "children", "aria-label"]));
  return () => {
    return <StepperButton direction={1} data-slot="stepper-increment" aria-label={label.value} class={className.value} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? <Icon name="plus" size={18} />}
    </StepperButton>;
  };
});
const StepperInput = defineUi<Omit<UI.ComponentProps<"input">, "value" | "defaultValue" | "type">>("StepperInput", ["class", "style", "onKeydown", "onBlur", "onChange"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const ref = computed(() => _props["ref"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const onBlur = computed(() => _props["onBlur"]);
  const onChange = computed(() => _props["onChange"]);
  const props = computed(() => omitProps(_props, ["class", "style", "ref", "onKeydown", "onBlur", "onChange"]));
  const ctx = useStepper();
  const inputRef = computed(() => ctx.value.inputRef);
  const inputProps = computed(() => ctx.value.inputProps);
  const draft = shallowRef<{
    text: string;
    base: string;
  } | null>(initialState(null));
  const setDraft = stateSetter(draft);
  const text = computed(() => ctx.value.value === undefined ? "" as const : ctx.value.format(ctx.value.value));
  const shown = computed(() => draft.value && draft.value.base === text.value ? draft.value.text : text.value);
  const adjust = computed(() => ctx.value.adjust);
  const jump = computed(() => ctx.value.jump);
  const step = computed(() => ctx.value.step);
  const largeStep = computed(() => ctx.value.largeStep);
  const min = computed(() => ctx.value.min);
  const max = computed(() => ctx.value.max);
  const wheel = computed(() => ctx.value.wheel);
  const disabled = computed(() => ctx.value.disabled);
  const reset = computed(() => ctx.value.reset);
  watchDependencies(() => {
    const el = inputRef.value.value;
    if (!el || !wheel.value || disabled.value) return;
    const onWheel = (e: WheelEvent) => {
      if (document.activeElement !== el || e.deltaY === 0) return;
      e.preventDefault();
      adjust.value(e.deltaY < 0 ? step.value : -step.value);
    };
    el.addEventListener("wheel", onWheel, {
      passive: false
    });
    return () => el.removeEventListener("wheel", onWheel);
  }, () => [inputRef.value, wheel.value, disabled.value, adjust.value, step.value], false);
  watchDependencies(() => {
    const form = inputRef.value.value?.form;
    if (!form) return;
    const onReset = () => {
      setDraft(null);
      reset.value();
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, () => [inputRef.value, reset.value], false);
  const commit = computed(() => (): void => {
    if (!draft.value || draft.value.base !== text.value) return;
    if (ctx.value.commitText(draft.value.text)) setDraft(null);else setDraft(null);
  });
  const tick = computed(() => ctx.value.motion ? `${ctx.value.motion.dir === 1 ? "up" as const : "down" as const}-${ctx.value.motion.n % 2 ? "a" as const : "b" as const}` : undefined);
  return () => {
    return <>
      <input type="text" inputmode="decimal" role="spinbutton" autocomplete="off" spellcheck={false} data-slot="stepper-input" data-tick={tick.value} aria-valuenow={ctx.value.value} aria-valuemin={min.value} aria-valuemax={max.value} aria-valuetext={ctx.value.value === undefined ? undefined : text.value} aria-invalid={ctx.value.invalid || undefined} disabled={ctx.value.disabled} readonly={ctx.value.readOnly} value={shown.value} style={cssStyle({
        minWidth: `${Math.max(3, shown.value.length) + 1}ch`,
        ...style.value
      })} ref={useMergedRef<HTMLInputElement>(inputRef.value, ref.value)} {...domProps(inputProps.value, true)} onChange={(e: Event) => {
        onChange.value?.(e);
        setDraft({
          text: (e.target as HTMLInputElement).value,
          base: text.value
        });
      }} onBlur={(e: FocusEvent) => {
        onBlur.value?.(e);
        commit.value();
      }} onKeydown={(e: KeyboardEvent) => {
        onKeydown.value?.(e);
        if (e.defaultPrevented || ctx.value.disabled) return;
        const big = e.shiftKey ? largeStep.value : step.value;
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            setDraft(null);
            adjust.value(big);
            break;
          case "ArrowDown":
            e.preventDefault();
            setDraft(null);
            adjust.value(-big);
            break;
          case "PageUp":
            e.preventDefault();
            setDraft(null);
            adjust.value(largeStep.value);
            break;
          case "PageDown":
            e.preventDefault();
            setDraft(null);
            adjust.value(-largeStep.value);
            break;
          case "Home":
            if (min.value !== undefined) {
              e.preventDefault();
              setDraft(null);
              jump.value(min.value);
            }
            break;
          case "End":
            if (max.value !== undefined) {
              e.preventDefault();
              setDraft(null);
              jump.value(max.value);
            }
            break;
          case "Enter":
            commit.value();
            break;
          case "Escape":
            if (draft.value) {
              e.preventDefault();
              setDraft(null);
            }
            break;
        }
      }} class={cn("h-full w-16 min-w-0 flex-1 bg-transparent px-1 text-center font-script text-[1.65rem] leading-none font-bold text-(--ll-input-ink) caret-(--ll-caret) outline-hidden [appearance:textfield] disabled:cursor-not-allowed disabled:text-pencil-text calm:text-[1.35rem]", className.value)} {...domProps(props.value, true)} />
      {ctx.value.hiddenName ? <input type="hidden" name={ctx.value.hiddenName} form={inputProps.value.form} value={ctx.value.value === undefined ? "" as const : String(ctx.value.value)} disabled={ctx.value.disabled} /> : null}
    </>;
  };
});
const StepperTally = defineUi<Omit<UI.ComponentProps<"span">, "children" | "value"> & {
  max?: number;
  seed?: string | number;
  value?: number;
}>("StepperTally", ["class", "style", "max", "seed", "value"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const max = computed(() => _props["max"] === undefined ? 20 : _props["max"]);
  const seed = computed(() => _props["seed"]);
  const valueProp = computed(() => _props["value"]);
  const props = computed(() => omitProps(_props, ["class", "style", "max", "seed", "value"]));
  const ctx = useContext(StepperContext);
  const shown = computed(() => valueProp.value ?? ctx.value?.value ?? 0);
  const count = computed(() => Math.max(0, Math.min(Number.isFinite(shown.value) ? Math.floor(shown.value) : 0, max.value)));
  const width = computed(() => tallyWidth(Math.max(count.value, 1)));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: stepperTallyRecipe,
    params: {
      count: count.value
    },
    kind: "tally" as const,
    size: [width.value, TALLY_H + 4],
    seed: seed.value,
    still: true
  }));
  return () => {
    return <span data-slot="stepper-tally" aria-hidden="true" ref={hostRef} {...domProps(hostProps.value)} style={cssStyle({
      width: width.value,
      ...style.value
    })} class={cn("relative isolate inline-block h-5 shrink-0 text-ink", className.value)} {...domProps(props.value)}>
      {count.value > 0 ? node.value : null}
    </span>;
  };
});
export { Stepper, StepperDecrement, StepperInput, StepperIncrement, StepperTally, useStepper };
export type { StepperProps };
