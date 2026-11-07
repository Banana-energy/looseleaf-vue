import { computed, h, shallowRef, type Component, type VNodeChild, type VNodeRef } from 'vue'
import { CalendarRoot, RangeCalendarRoot, CalendarGrid, CalendarCell, CalendarCellTrigger, CalendarPrev, CalendarNext } from 'reka-ui'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { addDays, format, getWeek, isSameDay, startOfMonth, type Locale } from 'date-fns'
import { defineUi } from './component'
import { createContext, useContext } from './composables'
import type * as UI from './types'

export interface DateRange { from: Date | undefined; to?: Date }
export type Matcher = boolean | Date | Date[] | DateRange | { before: Date } | { after: Date } | { dayOfWeek: number[] } | { after: Date; before: Date } | ((date: Date) => boolean)
// 日期匹配语义与固定上游保持一致，外部仍可用 JavaScript Date 与日期选择器组合。
export function dateMatchModifiers(date: Date, matchers: Matcher | Matcher[]): boolean {
  return (Array.isArray(matchers) ? matchers : [matchers]).some(matcher => {
    if (typeof matcher === 'boolean') return matcher
    if (typeof matcher === 'function') return matcher(date)
    if (matcher instanceof Date) return isSameDay(matcher, date)
    if (Array.isArray(matcher)) return matcher.some(day => isSameDay(day, date))
    if ('dayOfWeek' in matcher) return matcher.dayOfWeek.includes(date.getDay())
    if ('from' in matcher) return !!matcher.from && date >= matcher.from && (!matcher.to || date <= matcher.to)
    if ('after' in matcher && 'before' in matcher) return matcher.after < matcher.before ? date > matcher.after && date < matcher.before : date > matcher.after || date < matcher.before
    if ('before' in matcher) return date < matcher.before
    return date > matcher.after
  })
}
interface CalendarDay { date: Date; isoDate: string; outside: boolean }
type Modifiers = Record<string, boolean>
export type RootProps = UI.ComponentProps<'div'> & { rootRef?: VNodeRef }
export type MonthProps = UI.ComponentProps<'div'> & { calendarMonth: { weeks: DateValue[][] }; displayIndex: number }
export type MonthGridProps = UI.ComponentProps<'table'>
export type DayProps = UI.ComponentProps<'td'> & { day: CalendarDay; modifiers: Modifiers }
export type DayButtonProps = UI.ComponentProps<'button'> & { day: CalendarDay; modifiers: Modifiers }
export type PreviousMonthButtonProps = UI.ComponentProps<'button'>
export type NextMonthButtonProps = UI.ComponentProps<'button'>
export type ChevronProps = UI.ComponentProps<'svg'> & { orientation?: 'left' | 'right' | 'up' | 'down' }
export type DropdownProps = UI.ComponentProps<'select'> & { options?: { value: number; label: string; disabled?: boolean }[] }
interface Parts { Root: Component; Month: Component; MonthGrid: Component; Day: Component; DayButton: Component; PreviousMonthButton: Component; NextMonthButton: Component; Chevron: Component; Dropdown: Component }
interface BaseProps extends Omit<UI.ComponentProps<'div'>, 'onSelect' | 'disabled' | 'dir' | 'hidden'> {
  dir?: 'ltr' | 'rtl'
  labels?: { labelDayButton?: (date: Date, modifiers: Modifiers) => string }
  onDayClick?: (date: Date, modifiers: Modifiers, event: MouseEvent) => void
  classNames?: Record<string, string>; components?: Partial<Parts>; formatters?: { formatMonthDropdown?: (date: Date, dateLib?: { format: typeof format }) => string }; locale?: Locale; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'; navLayout?: string; showOutsideDays?: boolean; showWeekNumber?: boolean; fixedWeeks?: boolean; numberOfMonths?: number; month?: Date; defaultMonth?: Date; onMonthChange?: (month: Date) => void; startMonth?: Date; endMonth?: Date; disabled?: Matcher | Matcher[]; hidden?: Matcher | Matcher[]; modifiers?: Record<string, Matcher | Matcher[]>; today?: Date; autoFocus?: boolean; timeZone?: string; numerals?: string; footer?: VNodeChild; required?: boolean
}
type DayPickerProps = BaseProps & ({ mode?: 'single'; selected?: Date; onSelect?: (date: Date | undefined, triggerDate: Date) => void } | { mode: 'range'; selected?: DateRange; onSelect?: (range: DateRange | undefined, triggerDate: Date) => void; min?: number; max?: number; excludeDisabled?: boolean } | { mode: 'multiple'; selected?: Date[]; onSelect?: (dates: Date[] | undefined, triggerDate: Date) => void; min?: number; max?: number })
const ClassContext = createContext<{ classNames: Record<string, string> }>({ classNames: {} })
export function useDayPicker() { return useContext(ClassContext) }
export function getDefaultClassNames(): Record<string, string> { return {} }
const asDate = (value: DateValue) => new Date(value.year, value.month - 1, value.day)
const asValue = (date: Date) => new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())

// Reka 提供日期网格、键盘移动与区间选择；通过原版部件插槽保持纸面与手绘日期圈。
export const DayPicker = defineUi<DayPickerProps>('DayPickerPrimitive', ['mode', 'selected', 'onSelect', 'classNames', 'components', 'formatters', 'locale', 'weekStartsOn', 'captionLayout', 'navLayout', 'showOutsideDays', 'showWeekNumber', 'fixedWeeks', 'numberOfMonths', 'month', 'defaultMonth', 'onMonthChange', 'startMonth', 'endMonth', 'disabled', 'hidden', 'modifiers', 'today', 'autoFocus', 'timeZone', 'numerals', 'footer', 'required', 'labels', 'onDayClick'], (props) => {
  // 下拉月份与方向按钮共用受控占位日期；未受控时仍保存用户翻到的月份。
  const monthState = shallowRef(props.defaultMonth === undefined ? new Date() : props.defaultMonth)
  const placeholder = computed(() => asValue(props.month === undefined ? monthState.value : props.month))
  const setMonth = (date: Date) => { monthState.value = date; props.onMonthChange?.(startOfMonth(date)) }
  let triggerDate = props.today === undefined ? new Date() : props.today
  const model = computed(() => props.mode === 'range' ? { start: props.selected?.from ? asValue(props.selected.from) : undefined, end: props.selected?.to ? asValue(props.selected.to) : undefined } : props.mode === 'multiple' ? props.selected?.map(asValue) : props.selected ? asValue(props.selected) : undefined)
  const update = (selected: DateValue | DateValue[] | { start?: DateValue; end?: DateValue } | undefined) => {
    if (props.mode === 'range') { const range = selected as { start?: DateValue; end?: DateValue } | undefined; props.onSelect?.(range?.start ? { from: asDate(range.start), to: range.end ? asDate(range.end) : undefined } : undefined, triggerDate) }
    else if (props.mode === 'multiple') props.onSelect?.((selected as DateValue[] | undefined)?.map(asDate), triggerDate)
    else props.onSelect?.(selected ? asDate(selected as DateValue) : undefined, triggerDate)
  }
  return () => {
    const parts = props.components as Parts
    const c = props.classNames!
    const root = props.mode === 'range' ? RangeCalendarRoot : CalendarRoot
    const rootProps = { asChild: true, modelValue: model.value, multiple: props.mode === 'multiple', 'onUpdate:modelValue': update, placeholder: placeholder.value, 'onUpdate:placeholder': (date: DateValue) => setMonth(asDate(date)), numberOfMonths: props.numberOfMonths, weekStartsOn: props.weekStartsOn, fixedWeeks: props.fixedWeeks, locale: props.locale?.code, dir: props.dir, minValue: props.startMonth ? asValue(props.startMonth) : undefined, maxValue: props.endMonth ? asValue(props.endMonth) : undefined, isDateDisabled: (date: DateValue) => props.disabled !== undefined && dateMatchModifiers(asDate(date), props.disabled), initialFocus: props.autoFocus, preventDeselect: props.required }
    return <ClassContext.Provider value={{ classNames: c }}>{h(root as Component, rootProps, { default: ({ grid, weekDays }: { grid: { value: DateValue; rows: DateValue[][] }[]; weekDays: string[] }) => h(parts.Root, { class: [props.class, c.root], dir: props.dir }, { default: () => [<div class={c.months}>{grid.map((month, index) => h(parts.Month, { calendarMonth: { weeks: month.rows }, displayIndex: index, class: c.month }, { default: () => [
      <CalendarPrev asChild>{h(parts.PreviousMonthButton, { class: c.button_previous }, { default: () => h(parts.Chevron, { orientation: 'left' }) })}</CalendarPrev>,
      <div class={c.month_caption}>{props.captionLayout === 'label' ? <span class={c.caption_label}>{format(asDate(month.value), 'LLLL yyyy', { locale: props.locale })}</span> : <div class={c.dropdowns}>{h(parts.Dropdown, { 'aria-label': 'Choose the Month', value: month.value.month - 1, options: Array.from({ length: 12 }, (_, monthIndex) => ({ value: monthIndex, label: props.formatters?.formatMonthDropdown?.(new Date(month.value.year, monthIndex, 1)) ?? format(new Date(month.value.year, monthIndex, 1), 'LLL', { locale: props.locale }) })), onChange: (event: Event) => setMonth(new Date(month.value.year, Number((event.target as HTMLSelectElement).value), 1)) })}{h(parts.Dropdown, { 'aria-label': 'Choose the Year', value: month.value.year, options: Array.from({ length: (props.endMonth?.getFullYear() ?? month.value.year) - (props.startMonth?.getFullYear() ?? month.value.year - 100) + 1 }, (_, yearIndex) => { const year = (props.startMonth?.getFullYear() ?? month.value.year - 100) + yearIndex; return { value: year, label: String(year) } }), onChange: (event: Event) => setMonth(new Date(Number((event.target as HTMLSelectElement).value), month.value.month - 1, 1)) })}</div>}</div>,
      <CalendarNext asChild>{h(parts.NextMonthButton, { class: c.button_next }, { default: () => h(parts.Chevron, { orientation: 'right' }) })}</CalendarNext>,
      h(parts.MonthGrid, { class: c.month_grid }, { default: () => [<thead><tr class={c.weekdays}>{props.showWeekNumber && <th class={c.week_number_header} />}{weekDays.map(day => <th class={c.weekday} scope="col">{day}</th>)}</tr></thead>, <CalendarGrid as="tbody">{month.rows.map(week => <tr class={c.week}>{props.showWeekNumber && <td class={c.week_number}>{getWeek(asDate(week[0]))}</td>}{week.map(value => {
        const date = asDate(value)
        const outside = value.month !== month.value.month
        const selected = props.mode === 'range' ? !!props.selected?.from && date >= props.selected.from && (!props.selected.to || date <= props.selected.to) : props.mode === 'multiple' ? !!props.selected?.some(day => isSameDay(day, date)) : !!props.selected && isSameDay(props.selected, date)
        const modifiers: Modifiers = { selected, outside, today: isSameDay(date, props.today === undefined ? new Date() : props.today), disabled: props.disabled !== undefined && dateMatchModifiers(date, props.disabled), range_start: props.mode === 'range' && !!props.selected?.from && isSameDay(date, props.selected.from), range_end: props.mode === 'range' && !!props.selected?.to && isSameDay(date, props.selected.to), range_middle: props.mode === 'range' && !!props.selected?.from && !!props.selected.to && date > props.selected.from && date < props.selected.to }
        for (const [key, matcher] of Object.entries(props.modifiers ?? {})) modifiers[key] = dateMatchModifiers(date, matcher)
        const hidden = outside && !props.showOutsideDays || props.hidden !== undefined && dateMatchModifiers(date, props.hidden)
        const day: CalendarDay = { date, isoDate: format(date, 'yyyy-MM-dd'), outside }
        return <CalendarCell date={value} asChild>{h(parts.Day, { day, modifiers, class: [c.day, hidden && c.hidden], 'data-outside': outside || undefined, 'data-disabled': modifiers.disabled || undefined }, { default: () => hidden ? null : <CalendarCellTrigger day={value} month={month.value} asChild>{h(parts.DayButton, { day, modifiers, 'aria-label': props.labels?.labelDayButton?.(date, modifiers), onClick: (event: MouseEvent) => { triggerDate = date; props.onDayClick?.(date, modifiers, event) } }, { default: () => date.getDate() })}</CalendarCellTrigger> })}</CalendarCell>
      })}</tr>)}</CalendarGrid>] }),
    ] }))}</div>, props.footer && <div class={c.footer} role="status">{props.footer}</div>] }) })}</ClassContext.Provider>
  }
})

