// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "checkbox" as const,
  title: "Checkbox" as const,
  category: "Forms" as const,
  description: "A hand-drawn box you tick. Checking fills it with solid marker and writes a heavy felt tick over it, stroke by stroke; a dash means partly checked. Reka UI behavior, keyboard and form support are untouched." as const,
  status: "stable" as const,
  upstream: "checkbox" as const,
  parts: [{
    name: "Checkbox" as const,
    description: "Reka UI Checkbox.Root (a <button role=\"checkbox\">, plus Reka UI's hidden native input inside a form) with the drawing behind it. Size it with size-*: 16, 20 and 28 px are drawn and tested. The tick is written with ll-draw when the state turns checked or indeterminate (instantly with reduced motion)." as const,
    props: [{
      name: "checked" as const,
      type: 'boolean | "indeterminate"' as const,
      description: "Controlled state. \"indeterminate\" draws the dash and reports aria-checked=\"mixed\"." as const
    }, {
      name: "defaultChecked" as const,
      type: "boolean" as const,
      description: "Initial state when uncontrolled." as const
    }, {
      name: "onCheckedChange" as const,
      type: '(checked: boolean | "indeterminate") => void' as const,
      description: "Called on click and Space." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Dashed pencil box on a pale wash, graphite tick when on. Not focusable, no hover." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "true draws the box in red pencil." as const
    }, {
      name: "name / value / required / form" as const,
      type: "string | boolean" as const,
      description: "Forwarded to Reka UI's hidden input, so the value is in FormData (\"on\" unless you give value) and forms validate and reset." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same box and tick. Default: derived from useId()." as const
    }]
  }],
  a11y: ["role=\"checkbox\" with aria-checked true, false or mixed; Space toggles, Tab focuses, Enter is left to the form (Reka UI).", "Label it with <Label htmlFor>, wrap it, or use aria-label. A Label next to it is a peer: peer-disabled dims it, and hovering the label (a Field row with group/field, or a label right after the box) lights the box's hover overlay.", "The hit area is 8 px larger than the box on every side (an ::after, so layout never moves): 28 px for the 16 px box.", "Keyboard focus draws a blue felt ring; the drawing is aria-hidden, pointer-events: none and never focusable. Windows high contrast replaces it by a real border.", "The tick is drawn on with a stroke reveal (0.3 s). Reduced motion (the OS setting or data-motion=\"reduced\") shows the finished mark at once.", "Right-to-left layouts need nothing: the box is symmetric and every offset is logical."],
  usage: `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept the terms</Label>
    </div>
  )
}`,
  related: ["label", "radio-group", "switch", "toggle", "field"]
} satisfies ComponentDoc;
