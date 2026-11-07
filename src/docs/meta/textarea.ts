// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "textarea" as const,
  title: "Textarea" as const,
  category: "Forms" as const,
  description: "A multi-line text field on paper: a pencil box around a real <textarea> that grows with its text, with optional hand-ruled lines on the baselines, a drawn resize handle and a character counter." as const,
  status: "stable" as const,
  upstream: "textarea" as const,
  parts: [{
    name: "Textarea" as const,
    description: "A <span data-slot=\"textarea-frame\"> (the drawn box) around <textarea data-slot=\"textarea\">. As with Input, every prop and ref go to the <textarea>; className and style go to the frame, and padding, resize-* and control variants (placeholder:, focus:, ...) are moved onto the textarea." as const,
    props: [{
      name: "className" as const,
      type: "string" as const,
      description: "Classes for the frame (width, min/max height, margins, font, text color). Padding, resize-*, field-sizing-* and control-only variants are applied to the <textarea>." as const
    }, {
      name: "inputClassName" as const,
      type: "string" as const,
      description: "Classes appended to the <textarea> itself." as const
    }, {
      name: "ruled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Hand-ruled paper: pencilled rules on the text's baselines. It fixes the rhythm (28 px lines, the first 8 px from the top, min height of three lines) and always grows with its text, so lines and text never drift apart." as const
    }, {
      name: "autoGrow" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Grow with the text using field-sizing: content, as upstream does. false keeps rows and a fixed height." as const
    }, {
      name: "showCount" as const,
      type: "boolean | (info: { length: number; max?: number }) => VueNode" as const,
      default: "false" as const,
      description: "A counter in the bottom corner (12 or 12/280 with maxLength), or your own render function. It is the field's aria-describedby, so a screen reader hears it on focus, not on every keystroke." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same box. Default: derived from useId()." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "true draws the red-pencil box, the wavy underline and a ! in the corner." as const
    }, {
      name: "disabled / readOnly" as const,
      type: "boolean" as const,
      description: "Dashed pencil on a pale wash / a printed field." as const
    }]
  }, {
    name: "TextareaControl" as const,
    description: "The bare <textarea> (data-slot=\"textarea\"): typography and reset, no drawing. For composites that draw the box themselves (InputGroup)." as const
  }],
  a11y: ["A native <textarea>: Enter adds a line, Tab moves on, and label / aria-describedby / required work as usual.", "aria-invalid, disabled and readOnly are the real attributes; the drawing follows them.", "Focus draws the blue felt ring; the browser's outline is used before the drawing exists and in Windows high contrast.", "The counter is aria-describedby text (\"12 characters of 280\"), never a live region.", "Resizing uses the browser's own handle (made transparent and redrawn by hand), so it keeps working with the mouse and touch.", "field-sizing: content needs a current browser; elsewhere the textarea keeps its rows and scrolls."],
  usage: `import { Textarea } from "@/components/ui/textarea"

export function Example() {
  return (
    <>
      <Textarea placeholder="Tell us what happened..." />
      <Textarea ruled showCount maxLength={280} aria-label="Diary" />
    </>
  )
}`,
  related: ["input", "label", "field"]
} satisfies ComponentDoc;
