// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "calendar" as const,
  title: "Calendar" as const,
  category: "Forms" as const,
  description: "A month on planner paper. The grid is ruled by hand, the day you chose is circled in marker, today is underlined in felt, a range is one highlighter swipe per week, and a day you may not pick is hatched out in pencil. Reka Calendar v10 underneath: single, multiple and range selection, locales, right-to-left, week numbers, dropdown captions, several months." as const,
  status: "stable" as const,
  upstream: "calendar" as const,
  parts: [{
    name: "Calendar" as const,
    description: "A Reka Calendar `DayPicker`, so every prop of DayPicker works (`mode`, `selected`, `onSelect`, `required`, `disabled`, `hidden`, `modifiers`, `locale`, `dir`, `numberOfMonths`, `startMonth` / `endMonth`, `showWeekNumber`, `weekStartsOn`, `footer`, `timeZone`, ...). The root is transparent so it sits on the paper it is placed on (Card, Popover, Page); `sheet` gives it a sheet of its own." as const,
    props: [{
      name: "captionLayout" as const,
      type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"' as const,
      default: '"label"' as const,
      description: "The month name in script, or native month / year selects drawn in pencil boxes. Dropdowns default to a hundred years back (set `startMonth` / `endMonth`)." as const
    }, {
      name: "showOutsideDays" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Days of the neighboring months in the first and last week, in graphite." as const
    }, {
      name: "buttonVariant" as const,
      type: "ButtonProps['variant']" as const,
      default: '"ghost"' as const,
      description: "Variant of the previous / next month Buttons (real Buttons: hover swipe, press and drawn focus ring)." as const
    }, {
      name: "ruled" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Hand-rule the grid (weekday rule, week rules, day rules, a red margin rule beside the week numbers). `false` leaves the page plain." as const
    }, {
      name: "sheet" as const,
      type: "boolean | PaperProps" as const,
      default: "false" as const,
      description: "Put the calendar on a sheet of paper. `true` is a card; an object passes `stock`, `edge`, `tilt`, `tape`, `tapeKind`, `fastener`, `fastenerTone`, `fastenerClassName`, `shadow` and `seed` to Paper. A paper clip is set between the next-month arrow and the caption (not on the arrow); `fastenerClassName` moves it." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always rules the same grid." as const
    }, {
      name: "components" as const,
      type: "Partial<CustomComponents>" as const,
      description: "Swap any DayPicker part; yours are merged over ours." as const
    }, {
      name: "classNames" as const,
      type: "Partial<ClassNames>" as const,
      description: "Same keys as upstream shadcn (`root`, `months`, `month`, `nav`, `month_caption`, `weekday`, `day`, `today`, `range_start`, ...); merged over the defaults." as const
    }]
  }, {
    name: "CalendarDayButton" as const,
    description: "The button of one day, exported as upstream does so you can wrap it in `components.DayButton`. A plain `<button>` with no ink of its own: its marks are CSS masks keyed on `data-selected-single`, `data-range-start|end|middle` and `data-v` (the hand that draws them, from the date). Adds `aria-current=\"date\"` on today." as const
  }],
  a11y: ["The month is a `role=grid` table named by its caption, days are buttons with the full date as their name (\"Today, Thursday, September 17th, 2026, selected\"), and the selected cell has `aria-selected`. Today also carries `aria-current=\"date\"`. All of that is Reka Calendar's.", "One day is the tab stop (roving tabindex). Arrow keys move by day and week, Home and End to the week edge, PageUp / PageDown by month, Shift with them by year, Enter and Space select. Right-to-left swaps the horizontal arrows.", "The previous / next buttons keep `aria-disabled` (not `disabled`) at the end of `startMonth` / `endMonth`, so focus is not lost when you reach the limit.", "Nothing depends on hue alone: the chosen day is circled and bold, a range is a swipe with bold ends, a disabled day is hatched (and unclickable), today is underlined, and focus is a drawn blue loop that bleeds past the cell. The month caption is a polite live region, so paging announces the new month.", "Touch: a day is 40 px by default, 34 px in compact density and 30 px in calm. In a space narrower than the month the days shrink but stay square, so the ruled lines always fall between them, and several months stack instead of squeezing side by side.", "Forced colors (Windows high contrast): the masks give way to real borders: a border round the chosen day, top and bottom borders on a range, an underline for today, a line-through for disabled days and a Highlight outline for focus.", "Reduced motion: month changes do not animate (`animate` is off by default)."],
  usage: `import * as Vue from "vue"
import { Calendar } from "@/components/ui/calendar"

export function Example() {
  const [date, setDate] = Vue.useState<Date | undefined>(new Date())
  return <Calendar mode="single" selected={date} onSelect={setDate} sheet />
}`,
  related: ["date-picker", "popover", "card", "button"]
} satisfies ComponentDoc;
