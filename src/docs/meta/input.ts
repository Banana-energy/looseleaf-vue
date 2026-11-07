// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "input" as const,
  title: "Input" as const,
  category: "Forms" as const,
  description: "A one-line text field: a pencil box on paper around a real <input>, with blue felt for what you type. It draws its own hover, focus ring, invalid (red pencil and a !), disabled (dashes) and read-only (printed) states." as const,
  status: "stable" as const,
  upstream: "input" as const,
  parts: [{
    name: "Input" as const,
    description: "A <span data-slot=\"input-frame\"> (the drawn box: it owns the size, the drawing and the state) around <input data-slot=\"input\">. Everything you pass goes to the <input>, as in shadcn, and ref is the input. className and style go to the frame, so width, height, margin, flex and grid placement, font size and text color work as they always did; padding, resize-* and variants like placeholder: or file: are moved onto the input, which keeps the whole box clickable and the text inset exactly as in shadcn." as const,
    props: [{
      name: "className" as const,
      type: "string" as const,
      description: "Classes for the frame (layout, height, font, text color). Padding utilities and control-only variants (placeholder:, file:, selection:, autofill:, focus:, disabled:) are applied to the <input> instead." as const
    }, {
      name: "inputClassName" as const,
      type: "string" as const,
      description: "Classes appended to the <input> itself, after the ones moved there from className." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same box, also across remounts. Default: derived from useId()." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A real disabled input, drawn as dashed pencil on a pale wash. Under a disabled <fieldset> the input is still disabled, but the box is not redrawn." as const
    }, {
      name: "readOnly" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Focusable and selectable, drawn as a printed field: a pale wash and one quiet pencil line, no hover." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "true draws the red-pencil box, the wavy underline and the ! mark (and reserves room for it at the end of the line). Set it from your validation, as with shadcn." as const
    }]
  }, {
    name: "InputControl" as const,
    description: "The bare <input> (data-slot=\"input\"): typography and reset, no drawing. Input renders it inside the frame; a composite that draws the box itself (InputGroup, a search bar) uses it directly." as const
  }],
  a11y: ["A native <input>: label it with <Label htmlFor>, aria-label or aria-labelledby; type, required, pattern, autocomplete and inputmode work as usual.", "aria-invalid, disabled and readOnly are the real attributes; the drawing follows them. Pair aria-invalid with aria-describedby pointing at the error text.", "Focus draws a blue felt ring (3:1 or better against paper) when the input is focused by keyboard or click (text fields always match :focus-visible). Before the drawing exists and in Windows high contrast the browser's own outline and a real border are used.", "The drawing is aria-hidden, pointer-events: none and never focusable. Typed text is blue felt on paper (7:1), placeholders are graphite (6.8:1), disabled text is graphite on a pale wash.", "16 px text on every screen size, so iOS does not zoom on focus. Number spinners, the search clear button and the password reveal of Edge are removed; the keyboard behavior (arrow keys, Escape) is untouched.", "Reduced motion: no fade, no wobble; the field has no hover tilt at all."],
  usage: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Example() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
      <Input className="pl-9" aria-label="Search" type="search" />
    </div>
  )
}`,
  related: ["textarea", "label", "input-group", "field", "checkbox"]
} satisfies ComponentDoc;
