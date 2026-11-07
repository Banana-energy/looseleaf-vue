// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef } from "vue";
import { format as formatDate, isSameDay, isValid, parse as parseWith, startOfDay } from "date-fns";
import type { Locale } from "date-fns";
import { dateMatchModifiers, type DateRange, type Matcher } from "@/lib/calendar-primitive";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/icon";
import { InputControl } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFormReset } from "@/hooks/use-form-reset";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { datePickerRecipe } from "@/lib/ink/recipes/date-picker-ink";
import { cn } from "@/lib/utils";
const FALLBACK_FORMATS = ["P", "PP", "PPP", "yyyy-MM-dd", "yyyy/M/d", "M/d/yyyy", "MMM d, yyyy", "MMMM d, yyyy", "MMM d yyyy", "MMMM d yyyy", "d MMM yyyy", "d MMMM yyyy", "d.M.yyyy", "M/d/yy", "d.M.yy"];
const TWO_DIGIT_YEAR_PIVOT = new Date(2000, 0, 1);
const isDate = (d: Date | undefined): d is Date => !!d && isValid(d);
function parseDateInput(text: string, o: {
  format?: string;
  locale?: Locale;
  reference?: Date;
} = {}): Date | undefined {
  const s = text.trim();
  if (!s) return undefined;
  const reference = o.reference ?? TWO_DIGIT_YEAR_PIVOT;
  const word = s.toLowerCase();
  if (o.reference) {
    if (word === "today") return startOfDay(reference);
    if (word === "tomorrow") return startOfDay(new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() + 1));
    if (word === "yesterday") return startOfDay(new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - 1));
  }
  for (const f of [o.format, ...FALLBACK_FORMATS]) {
    if (!f) continue;
    const d = parseWith(s, f, reference, {
      locale: o.locale
    });
    if (isValid(d) && d.getFullYear() >= 1000 && d.getFullYear() <= 9999) return startOfDay(d);
  }
  return undefined;
}
const toIsoDate = (d: Date): string => isValid(d) ? formatDate(d, "yyyy-MM-dd") : "" as const;
const RANGE_SEPARATOR = /\s+(?:–|—|-|to)\s+|\s*[–—]\s*/;
function useControllable<T>(_source0: MaybeRefOrGetter<object>, _source1: MaybeRefOrGetter<string>, _source2: MaybeRefOrGetter<T>, _source3?: MaybeRefOrGetter<(v: T) => void>): ComputedRef<[T, (v: T) => void, () => void]> {
  const props = computed(() => toValue(_source0));
  const key = computed(() => toValue(_source1));
  const defaultValue = computed(() => toValue(_source2));
  const onChange = computed(() => toValue(_source3));
  const controlled = computed(() => key.value in props.value);
  const inner = shallowRef<T>(initialState(defaultValue.value));
  const setInner = stateSetter(inner);
  const value = computed(() => controlled.value ? (props.value as Record<string, T>)[key.value] : inner.value);
  const set = (v: T) => {
    if (!controlled.value) setInner(v);
    onChange.value?.(v);
  };
  const reset = computed(() => () => {
    if (!controlled.value) setInner(defaultValue.value);
  });
  return computed(() => {
    return [value.value, set, reset.value];
  });
}
type CalendarPass = Partial<Pick<CalendarProps, "captionLayout" | "showWeekNumber" | "weekStartsOn" | "numberOfMonths" | "startMonth" | "endMonth" | "fixedWeeks" | "showOutsideDays" | "dir" | "footer" | "today" | "defaultMonth" | "month" | "onMonthChange" | "modifiers" | "components" | "classNames" | "timeZone" | "numerals" | "sheet" | "ruled" | "buttonVariant">>;
interface PickerBaseProps {
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  typeable?: boolean;
  format?: string;
  locale?: Locale;
  min?: Date;
  max?: Date;
  disabledDates?: Matcher | Matcher[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  calendarLabel?: string;
  invalidMessage?: string;
  calendarProps?: CalendarPass;
  contentProps?: Partial<UI.ComponentProps<typeof PopoverContent>>;
  seed?: string | number;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
interface DatePreset {
  label: string;
  value: Date | (() => Date);
}
interface DateRangePreset {
  label: string;
  value: DateRange | (() => DateRange);
}
const DatePickerPresets = (<P extends {
  label: string;
},>() => {
  return defineUi<{
    presets: readonly P[];
    onPick: (preset: P) => void;
    label?: string;
    className?: string;
  }>("DatePickerPresets", ["presets", "onPick", "label", "class"], (_props, {
    slots: _slots
  }) => {
    const presets = computed(() => _props["presets"]);
    const onPick = computed(() => _props["onPick"]);
    const label = computed(() => _props["label"] === undefined ? "Presets" as const : _props["label"]);
    const className = computed(() => _props["class"]);
    return () => {
      return <div data-slot="date-picker-presets" role="group" aria-label={label.value} class={cn("flex flex-wrap gap-1 border-b border-pencil-mark/40 p-3 pb-2 sm:w-36 sm:flex-col sm:flex-nowrap sm:border-e sm:border-b-0 sm:pb-3", className.value)}>
      {presets.value.map(p => <Button key={p.label} type="button" variant="ghost" size="sm" class="justify-start" onClick={() => onPick.value(p)}>
          {p.label}
        </Button>)}
    </div>;
    };
  });
})();
const FIELD = "relative isolate flex h-9 w-full min-w-0 items-center font-hand text-base text-(--ll-input-ink) caret-(--ll-caret) compact:h-8 calm:h-7 calm:text-[15px]";
interface ShellProps extends Omit<PickerBaseProps, "format" | "locale" | "min" | "max" | "disabledDates" | "calendarProps"> {
  text: string;
  onCommitText: (typed: string) => boolean;
  hidden?: UI.ReactNode;
  presets?: (close: () => void) => UI.ReactNode;
  children: (close: () => void) => UI.ReactNode;
  fallbackPlaceholder: string;
  wide?: boolean;
  onFormReset: () => void;
}
const PickerShell = defineUi<ShellProps>("PickerShell", ["id", "placeholder", "disabled", "readOnly", "invalid", "required", "typeable", "open", "defaultOpen", "onOpenChange", "calendarLabel", "invalidMessage", "contentProps", "seed", "class", "text", "onCommitText", "hidden", "presets", "fallbackPlaceholder", "wide", "onFormReset", "aria-label", "aria-labelledby", "aria-describedby"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const placeholder = computed(() => _props["placeholder"]);
  const disabled = computed(() => _props["disabled"]);
  const readOnly = computed(() => _props["readOnly"]);
  const invalidProp = computed(() => _props["invalid"]);
  const required = computed(() => _props["required"]);
  const typeable = computed(() => _props["typeable"] === undefined ? true : _props["typeable"]);
  const openProp = computed(() => _props["open"]);
  const defaultOpen = computed(() => _props["defaultOpen"]);
  const onOpenChange = computed(() => _props["onOpenChange"]);
  const calendarLabel = computed(() => _props["calendarLabel"] === undefined ? "Choose date" as const : _props["calendarLabel"]);
  const invalidMessage = computed(() => _props["invalidMessage"] === undefined ? "Enter a date we can read." as const : _props["invalidMessage"]);
  const contentProps = computed(() => _props["contentProps"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const text = computed(() => _props["text"]);
  const onCommitText = computed(() => _props["onCommitText"]);
  const hidden = computed(() => _props["hidden"]);
  const presets = computed(() => _props["presets"]);
  const children = computed(() => _slots.default);
  const fallbackPlaceholder = computed(() => _props["fallbackPlaceholder"]);
  const wide = computed(() => _props["wide"]);
  const onFormReset = computed(() => _props["onFormReset"]);
  const ariaLabel = computed(() => _props["aria-label"]);
  const ariaLabelledby = computed(() => _props["aria-labelledby"]);
  const ariaDescribedby = computed(() => _props["aria-describedby"]);
  const aria = computed(() => ({
    "aria-label": ariaLabel.value,
    "aria-labelledby": ariaLabelledby.value,
    "aria-describedby": ariaDescribedby.value
  }));
  const controlledOpen = computed(() => openProp.value !== undefined);
  const innerOpen = shallowRef(initialState(defaultOpen.value ?? false));
  const setInnerOpen = stateSetter(innerOpen);
  const open = computed(() => openProp.value !== undefined ? openProp.value : innerOpen.value);
  const setOpen = (next: boolean) => {
    if (!controlledOpen.value) setInnerOpen(next);
    onOpenChange.value?.(next);
  };
  const draft = shallowRef<{
    text: string;
    base: string;
  } | null>(initialState(null));
  const setDraft = stateSetter(draft);
  const bad = shallowRef(initialState(false));
  const setBad = stateSetter(bad);
  const inputRef = shallowRef<HTMLInputElement | null | null>(null);
  const setReadable = computed(() => (ok: boolean): void => inputRef.value?.setCustomValidity(ok ? "" as const : invalidMessage.value));
  const shown = computed(() => draft.value && draft.value.base === text.value ? draft.value.text : text.value);
  watchDependencies(() => {
    setBad(false);
    inputRef.value?.setCustomValidity("");
  }, () => [text.value], false);
  const invalid = computed(() => !!invalidProp.value || bad.value);
  const inert = computed(() => !!disabled.value || !!readOnly.value);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: datePickerRecipe,
    params: {
      disabled: !!disabled.value,
      invalid: invalid.value && !disabled.value
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  const boxRef = shallowRef<HTMLElement | null | null>(null);
  const boxMerged = computed(() => useMergedRef<HTMLElement>(hostRef, boxRef));
  useFormReset(() => () => boxRef.value, () => () => {
    setDraft(null);
    setBad(false);
    setReadable.value(true);
    onFormReset.value();
  });
  const commitDraft = computed(() => (): boolean => {
    if (!draft.value || draft.value.base !== text.value) return true;
    if (draft.value.text === text.value) {
      setDraft(null);
      return true;
    }
    const ok = onCommitText.value(draft.value.text);
    setBad(!ok);
    setReadable.value(ok);
    if (ok) setDraft(null);
    return ok;
  });
  const handleKeyDown = computed(() => (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!commitDraft.value()) e.preventDefault();
    } else if (e.key === "ArrowDown" && !inert.value) {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape" && draft.value && !open.value) {
      e.preventDefault();
      setDraft(null);
      setBad(false);
      setReadable.value(true);
    }
  });
  const close = () => setOpen(false);
  const field = computed(() => cn(FIELD, wide.value && "max-w-none", className.value));
  const ph = computed(() => placeholder.value ?? fallbackPlaceholder.value);
  return () => {
    return <Popover open={open.value} onOpenChange={setOpen}>
      {typeable.value ? <PopoverAnchor asChild>
          <div data-slot="date-picker" data-state={open.value ? "open" as const : "closed" as const} data-ink-focus="within" ref={boxMerged.value} {...domProps(hostProps.value)} class={field.value}>
            {node.value}
            <InputControl ref={inputRef} id={id.value} type="text" autocomplete="off" spellcheck={false} placeholder={ph.value} disabled={disabled.value} readonly={readOnly.value} required={required.value} aria-invalid={invalid.value || undefined} value={shown.value} onChange={(e: Event) => {
            setBad(false);
            setReadable.value(true);
            setDraft({
              text: (e.target as HTMLInputElement).value,
              base: text.value
            });
          }} onBlur={commitDraft.value} onKeydown={handleKeyDown.value} class="pe-1 aria-invalid:pe-9" {...domProps(aria.value)} />
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" disabled={inert.value} aria-label={calendarLabel.value} class="me-0.5 size-7 shrink-0 calm:size-6">
                <Icon name="calendar" size={16} />
              </Button>
            </PopoverTrigger>
            {hidden.value}
          </div>
        </PopoverAnchor> : <PopoverTrigger asChild>
          <button id={id.value} type="button" data-slot="date-picker" disabled={disabled.value || readOnly.value} aria-invalid={invalid.value || undefined} ref={boxMerged.value} {...domProps(hostProps.value)} {...domProps(aria.value)} class={cn(field.value, "cursor-default justify-between gap-2 ps-3 text-start whitespace-nowrap disabled:cursor-not-allowed disabled:text-pencil-text", !text.value && "text-(--ll-placeholder)")}>
            {node.value}
            <span class="min-w-0 flex-1 truncate">{text.value || ph.value}</span>
            <span aria-hidden="true" class="grid h-full w-8 shrink-0 place-items-center text-ink-soft">
              <Icon name="calendar" size={16} />
            </span>
            {hidden.value}
          </button>
        </PopoverTrigger>}
      <PopoverContent aria-label={calendarLabel.value} align="start" tilt={false} collisionPadding={8} {...domProps(contentProps.value)} class={cn("w-auto max-w-[calc(100vw-1rem)] p-0", contentProps.value?.className)}>
        <div class="flex flex-col sm:flex-row">
          {presets.value?.(close)}
          {_slots.default(close)}
        </div>
      </PopoverContent>
    </Popover>;
  };
});
const toMatchers = (min?: Date, max?: Date, more?: Matcher | Matcher[]): Matcher[] => {
  const out: Matcher[] = [];
  if (min) out.push({
    before: min
  });
  if (max) out.push({
    after: max
  });
  if (more !== undefined) out.push(...(Array.isArray(more) ? more as Matcher[] : [more]));
  return out;
};
interface DatePickerProps extends PickerBaseProps {
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  name?: string;
  presets?: readonly DatePreset[];
  closeOnSelect?: boolean;
}
const DatePicker = defineUi<DatePickerProps>("DatePicker", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const _v = computed(() => props.value);
  const defaultValue = computed(() => props.defaultValue);
  const onValueChange = computed(() => props.onValueChange);
  const name = computed(() => props.name);
  const presets = computed(() => props.presets);
  const closeOnSelect = computed(() => props.closeOnSelect === undefined ? true : props.closeOnSelect);
  const format = computed(() => props.format === undefined ? "PP" as const : props.format);
  const locale = computed(() => props.locale);
  const min = computed(() => props.min);
  const max = computed(() => props.max);
  const disabledDates = computed(() => props.disabledDates);
  const calendarProps = computed(() => props.calendarProps);
  const rest = computed(() => omitProps(props, ["value", "defaultValue", "onValueChange", "name", "presets", "closeOnSelect", "format", "locale", "min", "max", "disabledDates", "calendarProps"]));
  const _hook14 = useControllable<Date | undefined>(() => props, () => "value", () => defaultValue.value, () => onValueChange.value);
  const given = computed(() => _hook14.value[0]);
  const setDate = computed(() => _hook14.value[1]);
  const resetDate = computed(() => _hook14.value[2]);
  const date = computed(() => isDate(given.value) ? given.value : undefined);
  const matchers = computed(() => toMatchers(min.value, max.value, disabledDates.value));
  const text = computed(() => date.value ? formatDate(date.value, format.value, {
    locale: locale.value
  }) : "" as const);
  const handleCommit = computed(() => (typed: string): boolean => {
    if (!typed.trim()) {
      setDate.value(undefined);
      return true;
    }
    const d = parseDateInput(typed, {
      format: format.value,
      locale: locale.value,
      reference: new Date()
    });
    if (!d || matchers.value.length > 0 && dateMatchModifiers(d, matchers.value)) return false;
    if (!date.value || !isSameDay(d, date.value)) setDate.value(d);
    return true;
  });
  return () => {
    void _v.value;
    return <PickerShell {...domProps(rest.value)} text={text.value} onCommitText={handleCommit.value} onFormReset={resetDate.value} fallbackPlaceholder="Pick a date" hidden={name.value ? <input type="hidden" name={name.value} value={date.value ? toIsoDate(date.value) : "" as const} /> : null} presets={presets.value?.length ? close => <DatePickerPresets presets={presets.value} onPick={p => {
      setDate.value(typeof p.value === "function" ? p.value() : p.value);
      if (closeOnSelect.value) close();
    }} /> : undefined}>
      {close => <Calendar mode="single" selected={date.value} onSelect={(d, triggerDate) => {
        if (!d && date.value && props.typeable !== false && isSameDay(triggerDate, date.value)) {
          if (closeOnSelect.value) close();
          return;
        }
        setDate.value(d);
        if (closeOnSelect.value && d) close();
      }} defaultMonth={date.value} disabled={matchers.value.length ? matchers.value : undefined} locale={locale.value} autoFocus {...domProps(calendarProps.value)} />}
    </PickerShell>;
  };
});
interface DateRangePickerProps extends PickerBaseProps {
  value?: DateRange | undefined;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  name?: string;
  nameTo?: string;
  presets?: readonly DateRangePreset[];
  closeOnSelect?: boolean;
}
const DateRangePicker = defineUi<DateRangePickerProps>("DateRangePicker", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const _v = computed(() => props.value);
  const defaultValue = computed(() => props.defaultValue);
  const onValueChange = computed(() => props.onValueChange);
  const name = computed(() => props.name);
  const nameTo = computed(() => props.nameTo);
  const presets = computed(() => props.presets);
  const closeOnSelect = computed(() => props.closeOnSelect === undefined ? true : props.closeOnSelect);
  const format = computed(() => props.format === undefined ? "PP" as const : props.format);
  const locale = computed(() => props.locale);
  const min = computed(() => props.min);
  const max = computed(() => props.max);
  const disabledDates = computed(() => props.disabledDates);
  const calendarProps = computed(() => props.calendarProps);
  const rest = computed(() => omitProps(props, ["value", "defaultValue", "onValueChange", "name", "nameTo", "presets", "closeOnSelect", "format", "locale", "min", "max", "disabledDates", "calendarProps"]));
  const _hook15 = useControllable<DateRange | undefined>(() => props, () => "value", () => defaultValue.value, () => onValueChange.value);
  const given = computed(() => _hook15.value[0]);
  const setRange = computed(() => _hook15.value[1]);
  const resetRange = computed(() => _hook15.value[2]);
  const range = computed(() => isDate(given.value?.from) ? {
    from: given.value.from,
    to: isDate(given.value.to) ? given.value.to : undefined
  } : undefined);
  const matchers = computed(() => toMatchers(min.value, max.value, disabledDates.value));
  const fmt = computed(() => (d: Date) => formatDate(d, format.value, {
    locale: locale.value
  }));
  const text = computed(() => range.value?.from ? range.value.to ? `${fmt.value(range.value.from)} – ${fmt.value(range.value.to)}` : `${fmt.value(range.value.from)} –` : "" as const);
  const handleCommit = computed(() => (typed: string): boolean => {
    if (!typed.trim()) {
      setRange.value(undefined);
      return true;
    }
    const reference = new Date();
    const parts = typed.trim().split(RANGE_SEPARATOR).filter(p => p.trim() !== "");
    if (parts.length < 1 || parts.length > 2) return false;
    const dates = parts.map(p => parseDateInput(p, {
      format: format.value,
      locale: locale.value,
      reference
    }));
    if (dates.some(d => !d)) return false;
    const [a, b] = dates as [Date, Date | undefined];
    const from = b && b < a ? b : a;
    const to = b ? b < a ? a : b : undefined;
    if (matchers.value.length > 0 && [from, to].some(d => d && dateMatchModifiers(d, matchers.value))) return false;
    setRange.value({
      from,
      to
    });
    return true;
  });
  return () => {
    void _v.value;
    return <PickerShell {...domProps(rest.value)} text={text.value} onCommitText={handleCommit.value} onFormReset={resetRange.value} fallbackPlaceholder="Pick a date range" wide calendarLabel={rest.value.calendarLabel ?? "Choose dates"} hidden={name.value || nameTo.value ? <>
            {name.value ? <input type="hidden" name={name.value} value={range.value?.from ? toIsoDate(range.value.from) : "" as const} /> : null}
            {nameTo.value ? <input type="hidden" name={nameTo.value} value={range.value?.to ? toIsoDate(range.value.to) : "" as const} /> : null}
          </> : null} presets={presets.value?.length ? close => <DatePickerPresets presets={presets.value} onPick={p => {
      const next = typeof p.value === "function" ? p.value() : p.value;
      setRange.value(next);
      if (closeOnSelect.value && next?.from && next?.to) close();
    }} /> : undefined}>
      {close => <Calendar mode="range" numberOfMonths={2} selected={range.value} onSelect={r => {
        setRange.value(r);
        if (closeOnSelect.value && r?.from && r.to && !isSameDay(r.from, r.to)) close();
      }} defaultMonth={range.value?.from} disabled={matchers.value.length ? matchers.value : undefined} locale={locale.value} autoFocus {...domProps(calendarProps.value)} />}
    </PickerShell>;
  };
});
export { DatePicker, DateRangePicker, DatePickerPresets, parseDateInput, toIsoDate };
export type { DatePickerProps, DateRangePickerProps, DatePreset, DateRangePreset };
