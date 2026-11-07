// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "radio-group" as const,
  title: "Radio Group" as const,
  category: "Forms" as const,
  description: "Pick exactly one. Each choice is a hand-circled ring; picking it colors the dot in with a terracotta blot and writes a felt spiral into it. Reka UI Radio Group underneath: roving focus, arrow keys, form value, orientation and direction." as const,
  status: "stable" as const,
  upstream: "radio-group" as const,
  parts: [{
    name: "RadioGroup" as const,
    description: "The root (Reka UI RadioGroup, role=radiogroup): a grid with a gap; `orientation=\"horizontal\"` lays it out as a wrapping row." as const,
    props: [{
      name: "value / defaultValue / onValueChange" as const,
      type: "string / string / (value: string) => void" as const,
      description: "Controlled or uncontrolled selection." as const
    }, {
      name: "name / required / disabled / form" as const,
      type: "string | boolean" as const,
      description: "Forwarded to Reka UI's hidden native radios, so the value is in FormData and `required` blocks the submit. A form reset puts the group back to its `defaultValue`. `disabled` on the group draws every radio disabled." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "On the group (where FormControl puts it) every radio is drawn in red pencil; a radio can still set its own aria-invalid." as const
    }, {
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      description: "Arrow-key axis (and, here, the layout). Reka UI arrows work on both axes either way." as const
    }, {
      name: "dir" as const,
      type: '"ltr" | "rtl"' as const,
      description: "Direction for the arrow keys." as const
    }, {
      name: "loop" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Arrow keys wrap around." as const
    }]
  }, {
    name: "RadioGroupItem" as const,
    description: "Reka UI RadioGroup.Item (a <button role=\"radio\">, plus a hidden input inside a form) with the ring drawn behind it. Size it with size-*: 16, 20 and 28 px are drawn and tested. The spiral is written with ll-draw when the state turns checked after a touch (instantly with reduced motion; never at load)." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "The value the group takes when this radio is chosen." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Dashed pencil ring on a graphite wash, graphite dot when chosen. Not focusable." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "true draws the ring in red pencil, and keeps it red over the dot." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same ring and dot. Default: derived from useId()." as const
    }]
  }],
  a11y: ["role=\"radiogroup\" with role=\"radio\" items and aria-checked. Tab enters the group at the chosen radio (or the first), arrow keys move AND choose, Space chooses the focused radio (Reka UI roving focus). Give the group a name with aria-label or aria-labelledby (a fieldset legend works too).", "Label each radio with <Label htmlFor>, wrap it, or use aria-label. A Label beside it is a peer: peer-disabled dims it, and hovering the row (a `group/field`) or the label right after the radio lights the ring's hover overlay.", "The hit area reaches 8 px past the ring on every side (an ::after, so layout never moves): 32 px for the 16 px ring.", "Keyboard focus draws a blue felt ring; the drawing is aria-hidden, pointer-events: none and never focusable. Windows high contrast replaces it by a real border and the Indicator shows a real dot.", "The chosen state is a filled dot, not only a color: a bold blot with a dark spiral. Reduced motion shows the finished dot at once.", "Right-to-left needs nothing: the ring is symmetric and every offset is logical. Pass `dir=\"rtl\"` to mirror the arrow keys."],
  usage: `import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function Example() {
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
    </RadioGroup>
  )
}`,
  related: ["checkbox", "switch", "toggle-group", "field", "label"]
} satisfies ComponentDoc;
