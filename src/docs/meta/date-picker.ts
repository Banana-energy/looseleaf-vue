// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "date-picker" as const,
  title: "Date Picker" as const,
  category: "Forms" as const,
  description: "A date field with a calendar on a slip. Type a date (Sep 17, 2026, 9/17/26, 2026-09-17, tomorrow) or open the calendar and circle one; presets sit in a column beside it; the range version takes two months and closes when you have chosen both ends. Popover + Calendar + Button + Input, composed." as const,
  status: "new" as const,
  parts: [{
    name: "DatePicker" as const,
    description: "One date. The field is the Select trigger's pencil box around a text input and a ghost calendar Button. Typing is read on Enter or when you leave the field (an unreadable date turns the box red until the next edit); ArrowDown opens the calendar. Works uncontrolled (`defaultValue`) and controlled (`value` + `onValueChange`; `value={undefined}` is a controlled, empty field; an Invalid Date counts as empty). Enter (or a second click) on the day that is already chosen confirms it and puts the slip away; only a field with `typeable={false}` clears it that way, having no other way to. Also exported: `parseDateInput(text, { format, locale, reference })` (a two-digit year is read within 50 years of `reference`, or as 1950 to 2049 without one) and `toIsoDate`." as const,
    props: [{
      name: "value" as const,
      type: "Date | undefined" as const,
      description: "The chosen day (controlled)." as const
    }, {
      name: "defaultValue" as const,
      type: "Date" as const,
      description: "The chosen day (uncontrolled)." as const
    }, {
      name: "onValueChange" as const,
      type: "(date: Date | undefined) => void" as const,
      description: "Called when a day is typed, chosen or cleared." as const
    }, {
      name: "typeable" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "`false` makes the whole field a button that shows the date (like a Select), for when free typing is not wanted." as const
    }, {
      name: "format" as const,
      type: "string" as const,
      default: '"PP"' as const,
      description: "A date-fns format string used to show the date and, first, to read typed text. Other common forms (locale short / long, ISO, US, day-month-year with names) are tried after it." as const
    }, {
      name: "locale" as const,
      type: "date-fns Locale" as const,
      description: "Names and patterns for showing and reading dates; passed on to the Calendar. date-fns cannot always read back what it wrote (a few locales' long and medium forms, e.g. Arabic \"PP\", Georgian, Kazakh): the shown text is never re-read unless it was edited, but pick a `format` such as `d MMM yyyy` if your users retype month names. Digits are Latin when typing (Eastern Arabic numerals are shown by the Calendar's `numerals` only)." as const
    }, {
      name: "min / max" as const,
      type: "Date" as const,
      description: "Earliest / latest allowed day. Earlier and later days are hatched out in the calendar and refused when typed." as const
    }, {
      name: "disabledDates" as const,
      type: "Matcher | Matcher[]" as const,
      description: "More days that cannot be chosen (any Reka Calendar matcher: `{ dayOfWeek: [0, 6] }`, `{ before: date }`, a function...)." as const
    }, {
      name: "presets" as const,
      type: "{ label: string; value: Date | (() => Date) }[]" as const,
      description: "A column of shortcuts beside the calendar. A function is called when the preset is chosen, so 'in a week' is computed then." as const
    }, {
      name: "closeOnSelect" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Put the calendar away when a day is chosen." as const
    }, {
      name: "name" as const,
      type: "string" as const,
      description: "Adds a hidden input with the day as `yyyy-MM-dd` for forms. A form reset (`<button type=\"reset\">`) puts an uncontrolled picker back to its `defaultValue`, like a native input (a controlled one is yours to reset)." as const
    }, {
      name: "invalid" as const,
      type: "boolean" as const,
      description: "The red pencil box with a bang (also set by itself when the typed text cannot be read, until the next edit or a day chosen in the calendar)." as const
    }, {
      name: "invalidMessage" as const,
      type: "string" as const,
      default: '"Enter a date we can read."' as const,
      description: "What the browser says when a form is submitted with typed text that cannot be read (that text blocks the form through custom validity, so a click on Submit cannot send an empty date next to text that looks fine). Translate it." as const
    }, {
      name: "disabled / readOnly / required / id / placeholder" as const,
      type: "" as const,
      description: "As on an input. The label points at `id` (the text input, or the button when `typeable={false}`)." as const
    }, {
      name: "open / defaultOpen / onOpenChange" as const,
      type: "" as const,
      description: "Control the calendar slip." as const
    }, {
      name: "calendarProps" as const,
      type: "Partial<CalendarProps>" as const,
      description: "Passed to the Calendar: `captionLayout`, `showWeekNumber`, `weekStartsOn`, `numberOfMonths`, `today`, `footer`..." as const
    }, {
      name: "contentProps" as const,
      type: "Partial<PopoverContentProps>" as const,
      description: "Passed to the PopoverContent: `align`, `side`, `pin`, `tape`, `stock`, `className`..." as const
    }, {
      name: "calendarLabel" as const,
      type: "string" as const,
      default: '"Choose date"' as const,
      description: "Accessible name of the calendar button and of the dialog (translate it)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same field." as const
    }]
  }, {
    name: "DateRangePicker" as const,
    description: "Two dates in one field: \"Sep 9, 2026 – Sep 24, 2026\". Type both ends with a dash or 'to' between them (they are put in order), or open the two-month calendar: the first click starts the range, the second ends it and puts the slip away. Same props as DatePicker, with a `DateRange` value." as const,
    props: [{
      name: "value / defaultValue / onValueChange" as const,
      type: "DateRange | undefined" as const,
      description: "`{ from, to }`. A single typed date is `{ from, to: undefined }`." as const
    }, {
      name: "presets" as const,
      type: "{ label: string; value: DateRange | (() => DateRange) }[]" as const,
      description: "Shortcuts: 'Last 7 days', 'This month'..." as const
    }, {
      name: "name / nameTo" as const,
      type: "string" as const,
      description: "Hidden inputs for the first and the last day (`yyyy-MM-dd`)." as const
    }]
  }, {
    name: "DatePickerPresets" as const,
    description: "The column of shortcut Buttons, exported so you can lay a custom calendar slip out yourself. Props: `presets`, `onPick`, `label` (its accessible name)." as const
  }],
  a11y: ["The typed field is a plain text input (give it a Label or `aria-label`); the calendar button has its own name (\"Choose date\") and `aria-expanded`, and the slip is a named dialog holding the Calendar, whose keyboard model is Reka Calendar's (arrows, Home/End, PageUp/PageDown, Enter/Space).", "ArrowDown in the field opens the calendar; Escape closes it and puts focus back on the button; with unsent text Escape drops it. Enter or leaving the field reads what you typed. Pressing Enter on a date that cannot be read does not submit the form it sits in.", "An unreadable or disallowed date sets `aria-invalid` (and draws the red box) until the next edit, so the error is not only in color: the box is also dashed-red with a bang.", "With `typeable={false}` the field is one button (`aria-haspopup=\"dialog\"`, `aria-expanded`) whose text is the date or the placeholder.", "A single frame draws the focus ring for whichever part has focus (input or calendar button). The slip repeats the InkProvider's density, motion and theme and sits above dialogs, so a DatePicker inside a Dialog works.", "Presets are Buttons in a labeled group; ranges are announced by the Calendar's day names (\"selected\")."],
  usage: `import * as Vue from "vue"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"

export function Example() {
  const [date, setDate] = Vue.useState<Date | undefined>()
  return (
    <div className="grid w-64 gap-2">
      <Label htmlFor="due">Due date</Label>
      <DatePicker id="due" value={date} onValueChange={setDate} />
    </div>
  )
}`,
  related: ["calendar", "popover", "input", "select", "button"]
} satisfies ComponentDoc;
