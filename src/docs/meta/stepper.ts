// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "stepper" as const,
  title: "Stepper" as const,
  category: "Forms" as const,
  description: "A number you can nudge: minus, the value, plus. One hand-drawn box with a tick before each button, the number in script, buttons that repeat while you hold them, arrow keys and PageUp / PageDown for the keyboard, and a rattle of the box when there is nowhere left to go. The value is a real text input, so it types, pastes and submits with a form." as const,
  status: "new" as const,
  parts: [{
    name: "Stepper" as const,
    description: "The control (`role=\"group\"`, the drawn box). Without children it is `StepperDecrement`, `StepperInput` and `StepperIncrement`; compose your own to add a `StepperTally` or other parts. Uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`; `value={undefined}` is a controlled, empty field). The value is a number, or `undefined` while the field is empty (NaN and Infinity count as empty, never the text \"NaN\")." as const,
    props: [{
      name: "value / defaultValue / onValueChange" as const,
      type: "number | undefined" as const,
      description: "The value. `onValueChange` fires when a button, key, wheel step or typed number (read on Enter or blur) changes it." as const
    }, {
      name: "min / max" as const,
      type: "number" as const,
      description: "Bounds. Steps and typed numbers are clamped; a button with nothing left is `aria-disabled` (not `disabled`, so focus is not lost) and rattles the box when pressed." as const
    }, {
      name: "step" as const,
      type: "number" as const,
      default: "1" as const,
      description: "The size of a button press or an arrow key. Zero, negative or not a number falls back to 1." as const
    }, {
      name: "largeStep" as const,
      type: "number" as const,
      default: "10 x step" as const,
      description: "Shift + arrows and PageUp / PageDown." as const
    }, {
      name: "snap" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Round typed and stepped values to multiples of `step` counted from `min` (or 0)." as const
    }, {
      name: "precision" as const,
      type: "number" as const,
      description: "Decimal places to show and round to. Default: the most places the step, the minimum and the current value have, so 0.1 steps do not drift." as const
    }, {
      name: "format / parse" as const,
      type: "(n: number) => string  /  (text: string) => number | undefined" as const,
      description: "How the number is shown and read back: currency, units. The default reader takes a dot or a comma as the point, both together (\"1,234.5\", \"1.234,5\" are 1234.5), a repeated separator as thousands (\"1,234,567\"), and Eastern Arabic and Persian digits. A lone \"1,234\" is 1.234: with one separator there is no telling a decimal comma from a thousands comma, so pass `parse` for your locale. A `parse` that answers NaN puts the last good value back." as const
    }, {
      name: "wheel" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The mouse wheel steps the number while it has focus (and stops the page scrolling). Off by default: a wheel that changes values under a scrolling page is a trap." as const
    }, {
      name: "id / name / form / required" as const,
      type: "" as const,
      description: "Go to the number's input: `id` for a Label, `name` and `form` for forms (with a `format`, a hidden input carries the plain number and the shown text is only the display), `required` forbids an empty field." as const
    }, {
      name: "aria-label / aria-labelledby / aria-describedby" as const,
      type: "string" as const,
      description: "Names for the number (the spinbutton), not for the group." as const
    }, {
      name: "disabled / readOnly / invalid" as const,
      type: "boolean" as const,
      description: "Dashed pencil on a wash / a value that is shown but not changed / the red pencil box." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same box." as const
    }]
  }, {
    name: "StepperDecrement" as const,
    description: "The minus: a plain button with a hand-drawn `minus`, highlighter under it on hover and while held. It steps on press and keeps stepping after a pause while the pointer stays down. Not a tab stop (the number takes the keyboard). Set an `aria-label` that names the number (\"Decrease quantity\")." as const
  }, {
    name: "StepperIncrement" as const,
    description: "The plus, the same." as const
  }, {
    name: "StepperInput" as const,
    description: "The number: a text input with `role=\"spinbutton\"`, `inputmode=\"decimal\"`, `aria-valuenow / min / max / valuetext`. It ticks a few pixels in the direction of a change. Arrows step, Shift + arrows and PageUp / PageDown take the large step, Home and End go to min and max, Enter or leaving reads what was typed (a non-number is put back), Escape drops the edit." as const
  }, {
    name: "StepperTally" as const,
    description: "The value as tally marks (four strokes and a slash to a group), a companion for a quantity you count on your fingers. Decorative (`aria-hidden`)." as const,
    props: [{
      name: "max" as const,
      type: "number" as const,
      default: "20" as const,
      description: "How many marks to draw at most." as const
    }]
  }],
  a11y: ["The number is a text input with `role=\"spinbutton\"` and `aria-valuenow / valuemin / valuemax / valuetext` (the APG pattern), so screen readers announce it as a number field; ArrowUp / ArrowDown, PageUp / PageDown, Home and End work as the pattern says. Give it a name (a Label with `htmlFor`, or `aria-label`).", "The buttons are not in the tab order (as in the APG spinbutton: the input takes the keyboard) but they are real buttons, so a pointer, a switch and a screen reader's activate (a click with no pointer) step once each. Name them for what they change.", "A button with nothing left is `aria-disabled`, not `disabled`; pressing it rattles the box (a visual cue that goes with the state, not instead of it) and the number's `aria-valuenow` stays.", "Holding a button repeats; releasing (or leaving, or blur) stops, and so does reaching a bound. No motion depends on it: reduced motion turns the number's tick and the box's rattle off.", "The wheel is opt-in, and only acts while the number has focus.", "Hit areas are the whole cell (36 px, 32 compact, 28 calm), the drawn ticks and box are `aria-hidden`; in Windows high contrast the box gets a real border."],
  usage: `import * as Vue from "vue"
import { Stepper } from "@/components/ui/stepper"

export function Example() {
  const [qty, setQty] = Vue.useState<number | undefined>(1)
  return <Stepper aria-label="Quantity" value={qty} onValueChange={setQty} min={1} max={10} name="qty" />
}`,
  related: ["input", "slider", "button", "field"]
} satisfies ComponentDoc;
