// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { DayPicker, getDefaultClassNames, useDayPicker, type ChevronProps, type DayButtonProps, type DayProps, type DropdownProps, type MonthGridProps, type MonthProps, type NextMonthButtonProps, type PreviousMonthButtonProps, type RootProps } from "@/lib/calendar-primitive";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useInk, useInkContext } from "@/lib/ink/vue";
import { calendarCss, calendarDropdownRecipe, calendarGridRecipe, RING_HANDS } from "@/lib/ink/recipes/calendar-ink";
import { cn } from "@/lib/utils";
type SheetProps = Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "tapeKind" | "fastener" | "fastenerTone" | "fastenerClassName" | "shadow" | "seed">;
interface CalendarSetup {
  buttonVariant: UI.ComponentProps<typeof Button>["variant"];
  ruled: boolean;
  sheet: SheetProps | false;
  seed?: string | number;
  weekNumbers: boolean;
}
const CalendarContext = createContext<CalendarSetup>({
  buttonVariant: "ghost" as const,
  ruled: true,
  sheet: false,
  weekNumbers: false
});
const MonthContext = createContext({
  rows: 6,
  index: 0
});
const CalendarRoot = defineUi<RootProps>("CalendarRoot", ["class", "rootRef"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const rootRef = computed(() => _props["rootRef"]);
  const props = computed(() => omitProps(_props, ["class", "rootRef"]));
  const _context3 = useContext(CalendarContext);
  const sheet = computed(() => _context3.value.sheet);
  const clipSlot = computed(() => sheet.value && sheet.value.fastener === "clip" ? "right-[3.125rem] rtl:right-auto rtl:left-[3.125rem]" as const : undefined);
  return () => {
    if (sheet.value) return <Paper data-slot="calendar" ref={rootRef.value as UI.Ref<HTMLElement>} rules="none" {...domProps(sheet.value)} fastenerClassName={cn(clipSlot.value, sheet.value.fastenerClassName)} class={className.value} {...domProps(props.value)}>{_slots.default?.()}</Paper>;
    return <div data-slot="calendar" ref={rootRef.value} class={className.value} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const CalendarMonth = defineUi<MonthProps>("CalendarMonth", ["calendarMonth", "displayIndex"], (_props, {
  slots: _slots
}) => {
  const calendarMonth = computed(() => _props["calendarMonth"]);
  const displayIndex = computed(() => _props["displayIndex"]);
  const props = computed(() => omitProps(_props, ["calendarMonth", "displayIndex"]));
  const value = computed(() => ({
    rows: calendarMonth.value.weeks.length,
    index: displayIndex.value
  }));
  return () => {
    return <MonthContext.Provider value={value.value}>
      <div {...domProps(props.value)}>{_slots.default?.()}</div>
    </MonthContext.Provider>;
  };
});
const CalendarMonthGrid = defineUi<MonthGridProps>("CalendarMonthGrid", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const _context3 = useContext(CalendarContext);
  const ruled = computed(() => _context3.value.ruled);
  const seed = computed(() => _context3.value.seed);
  const weekNumbers = computed(() => _context3.value.weekNumbers);
  const _context7 = useContext(MonthContext);
  const rows = computed(() => _context7.value.rows);
  const index = computed(() => _context7.value.index);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: calendarGridRecipe,
    params: {
      rows: rows.value,
      weekNumbers: weekNumbers.value
    },
    kind: "calendar" as const,
    seed: seed.value === undefined ? undefined : `${seed.value}|${index.value}`,
    still: true
  }));
  return () => {
    return <div data-slot="calendar-grid" ref={ruled.value ? hostRef : undefined} {...domProps(ruled.value ? hostProps.value : {})} class="relative isolate w-fit [grid-area:grid]">
      {ruled.value ? node.value : null}
      <table class={className.value} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </table>
    </div>;
  };
});
const CalendarDay = defineUi<DayProps>("CalendarDay", ["day", "modifiers"], (_props, {
  slots: _slots
}) => {
  const day = computed(() => _props["day"]);
  const modifiers = computed(() => _props["modifiers"]);
  const props = computed(() => omitProps(_props, ["day", "modifiers"]));
  const range = computed(() => modifiers.value.range_start && modifiers.value.range_end ? "single" as const : modifiers.value.range_start ? "start" as const : modifiers.value.range_end ? "end" as const : modifiers.value.range_middle ? "mid" as const : undefined);
  return () => {
    return <td data-range={range.value} {...domProps(props.value)}>{_slots.default?.()}</td>;
  };
});
const CalendarDayButton = defineUi<DayButtonProps>("CalendarDayButton", ["class", "day", "modifiers"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const day = computed(() => _props["day"]);
  const modifiers = computed(() => _props["modifiers"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "day", "modifiers", "children"]));
  const ref = shallowRef<HTMLButtonElement | null>(null);
  watchDependencies(() => {
    if (modifiers.value.focused) ref.value?.focus();
  }, () => [modifiers.value.focused], false);
  const ranged = computed(() => modifiers.value.range_start || modifiers.value.range_end || modifiers.value.range_middle);
  return () => {
    return <button ref={ref} data-slot="calendar-day" data-day={day.value.isoDate} data-v={day.value.date.getDate() % RING_HANDS} data-selected-single={modifiers.value.selected && !ranged.value ? "true" as const : undefined} data-range-start={modifiers.value.range_start || undefined} data-range-end={modifiers.value.range_end || undefined} data-range-middle={modifiers.value.range_middle || undefined} aria-current={modifiers.value.today ? "date" as const : undefined} class={cn("grid aspect-square w-[calc(100%-6px)] place-items-center m-[3px] cursor-default p-0 font-script text-[1.3rem] leading-none font-semibold text-inherit outline-hidden select-none compact:text-[1.2rem] calm:text-[1.05rem]", "data-[selected-single=true]:font-bold data-[range-start=true]:font-bold data-[range-end=true]:font-bold", "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      {modifiers.value.today && <span data-part="today" aria-hidden="true" />}
    </button>;
  };
});
const CalendarNavButton = defineUi<PreviousMonthButtonProps | NextMonthButtonProps>("CalendarNavButton", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const _context3 = useContext(CalendarContext);
  const buttonVariant = computed(() => _context3.value.buttonVariant);
  const disabled = computed(() => props.value["aria-disabled"] === true || props.value["aria-disabled"] === "true");
  return () => {
    return <Button asChild variant={buttonVariant.value} size="icon-sm" disabled={disabled.value} class="select-none">
      <button class={className.value} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </button>
    </Button>;
  };
});
const CalendarChevron = defineUi<ChevronProps>("CalendarChevron", ["orientation", "class"], (_props, {
  slots: _slots
}) => {
  const orientation = computed(() => _props["orientation"] === undefined ? "left" as const : _props["orientation"]);
  const className = computed(() => _props["class"]);
  const name = computed(() => orientation.value === "up" ? "chevron-up" as const : orientation.value === "down" ? "chevron-down" as const : orientation.value === "right" ? "chevron-right" as const : "chevron-left" as const);
  return () => {
    return <Icon name={name.value} size={orientation.value === "down" ? 14 : 16} class={className.value} />;
  };
});
const CalendarDropdown = defineUi<DropdownProps>("CalendarDropdown", ["options", "class"], (_props, {
  slots: _slots
}) => {
  const options = computed(() => _props["options"]);
  const className = computed(() => _props["class"]);
  const selectProps = computed(() => omitProps(_props, ["options", "class"]));
  const _hook3 = useDayPicker();
  const classNames = computed(() => _hook3.value.classNames);
  const _context5 = useContext(CalendarContext);
  const seed = computed(() => _context5.value.seed);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: calendarDropdownRecipe,
    params: {
      disabled: !!selectProps.value.disabled
    },
    kind: "field" as const,
    seed: seed.value === undefined ? undefined : `${seed.value}|${selectProps.value["aria-label"] ?? "dropdown"}`,
    still: true
  }));
  return () => {
    return <span data-slot="calendar-dropdown" data-disabled={selectProps.value.disabled || undefined} ref={hostRef} {...domProps(hostProps.value)} class={cn("group/dropdown relative isolate inline-flex h-8 items-center text-ink calm:h-7", classNames.value.dropdown_root)}>
      {node.value}
      <select class={cn("h-full cursor-pointer appearance-none bg-transparent ps-2.5 pe-7 font-script text-[1.15rem] font-semibold text-inherit outline-none disabled:cursor-not-allowed disabled:text-pencil-text", classNames.value.dropdown, className.value)} {...domProps(selectProps.value)}>
        {options.value?.map(({
          value,
          label,
          disabled
        }) => <option key={value} value={value} disabled={disabled}>
            {label}
          </option>)}
      </select>
      <Icon name="chevron-down" size={14} class="pointer-events-none absolute end-1.5 text-ink-soft group-has-disabled/dropdown:text-pencil-text" />
    </span>;
  };
});
const components = {
  Root: CalendarRoot,
  Month: CalendarMonth,
  MonthGrid: CalendarMonthGrid,
  Day: CalendarDay,
  DayButton: CalendarDayButton,
  PreviousMonthButton: CalendarNavButton,
  NextMonthButton: CalendarNavButton,
  Chevron: CalendarChevron,
  Dropdown: CalendarDropdown
};
type CalendarProps = UI.ComponentProps<typeof DayPicker> & {
  buttonVariant?: UI.ComponentProps<typeof Button>["variant"];
  ruled?: boolean;
  sheet?: boolean | SheetProps;
  seed?: string | number;
};
const Calendar = defineUi<CalendarProps>("Calendar", ["class", "classNames", "showOutsideDays", "captionLayout", "buttonVariant", "formatters", "components", "ruled", "sheet", "seed", "dir"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const classNames = computed(() => _props["classNames"]);
  const showOutsideDays = computed(() => _props["showOutsideDays"] === undefined ? true : _props["showOutsideDays"]);
  const captionLayout = computed(() => _props["captionLayout"] === undefined ? "label" as const : _props["captionLayout"]);
  const buttonVariant = computed(() => _props["buttonVariant"] === undefined ? "ghost" as const : _props["buttonVariant"]);
  const formatters = computed(() => _props["formatters"]);
  const userComponents = computed(() => _props["components"]);
  const ruled = computed(() => _props["ruled"] === undefined ? true : _props["ruled"]);
  const sheet = computed(() => _props["sheet"] === undefined ? false : _props["sheet"]);
  const seed = computed(() => _props["seed"]);
  const dirProp = computed(() => _props["dir"]);
  const props = computed(() => omitProps(_props, ["class", "classNames", "showOutsideDays", "captionLayout", "buttonVariant", "formatters", "components", "ruled", "sheet", "seed", "dir"]));
  const d = computed(() => getDefaultClassNames());
  const ink = useInkContext();
  const setup = computed<CalendarSetup>(() => ({
    buttonVariant: buttonVariant.value,
    ruled: ruled.value,
    seed: seed.value,
    weekNumbers: !!props.value.showWeekNumber,
    sheet: sheet.value === false ? false : sheet.value === true ? {
      stock: "card" as const
    } : sheet.value
  }));
  const merged = computed(() => userComponents.value ? {
    ...components,
    ...userComponents.value
  } : components);
  return () => {
    return <>
      <style>
        {calendarCss()}
      </style>
      <CalendarContext.Provider value={setup.value}>
        <DayPicker showOutsideDays={showOutsideDays.value} captionLayout={captionLayout.value} navLayout="around" dir={dirProp.value ?? (ink.value.hasProvider ? ink.value.dir : undefined)} class={cn("group/calendar p-3 [--cell:2.5rem] [--wn:2rem] compact:[--cell:2.125rem] calm:[--cell:1.875rem] calm:p-2 [[data-slot=card-content]_&]:p-0 [[data-slot=popover-content]_&]:bg-transparent", className.value)} formatters={{
          formatMonthDropdown: (date, dateLib) => dateLib ? dateLib.format(date, "LLL") : date.toLocaleString("en", {
            month: "short" as const
          }),
          ...formatters.value
        }} classNames={{
          root: cn("w-fit", d.value.root),
          months: cn("relative flex flex-wrap justify-center gap-5", d.value.months),
          month: cn("grid w-fit grid-cols-[var(--cell)_minmax(0,1fr)_var(--cell)] [grid-template-areas:'prev_cap_next'_'grid_grid_grid']", d.value.month),
          nav: cn("absolute inset-x-0 top-0 z-(--ll-z-raised) flex h-(--cell) w-full items-center justify-between", d.value.nav),
          button_previous: cn("place-self-center select-none [grid-area:prev] aria-disabled:opacity-40", d.value.button_previous),
          button_next: cn("place-self-center select-none [grid-area:next] aria-disabled:opacity-40", d.value.button_next),
          month_caption: cn("flex min-h-(--cell) w-full items-center justify-center [container-type:inline-size] [grid-area:cap]", d.value.month_caption),
          dropdowns: cn("flex h-(--cell) w-full items-center justify-center gap-2.5", d.value.dropdowns),
          caption_label: cn("font-script text-[min(1.65rem,13cqi)] leading-none font-semibold whitespace-nowrap text-ink select-none calm:text-[min(1.4rem,13cqi)]", d.value.caption_label),
          month_grid: cn("table-fixed border-collapse [border-spacing:0]", d.value.month_grid),
          weekdays: cn(d.value.weekdays),
          weekday: cn("h-7 w-(--cell) p-0 text-center align-middle font-type text-[0.78rem] leading-none font-normal text-pencil-text select-none", d.value.weekday),
          week: cn(d.value.week),
          week_number_header: cn("w-(--wn) p-0", d.value.week_number_header),
          week_number: cn("w-(--wn) p-0 pe-2 text-end align-middle font-type text-xs font-normal text-pencil-text select-none", d.value.week_number),
          day: cn("group/day w-(--cell) p-0 text-center align-middle text-ink data-outside:text-pencil-text data-outside:[&>button]:font-normal data-disabled:text-pencil-text", d.value.day),
          hidden: cn("invisible", d.value.hidden),
          footer: cn("mt-2 text-center font-hand text-sm text-ink-muted", d.value.footer),
          ...classNames.value
        }} components={merged.value} {...domProps(props.value)}>{_slots.default?.()}</DayPicker>
      </CalendarContext.Provider>
    </>;
  };
});
export { Calendar, CalendarDayButton };
export type { CalendarProps };
