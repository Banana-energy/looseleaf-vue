// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "switch" as const,
  title: "Switch" as const,
  category: "Forms" as const,
  description: "An on/off switch drawn as one clean felt pill: the terracotta marker fills the track when it is on, and a paper coin for a thumb slides across. Reka UI Switch underneath." as const,
  status: "stable" as const,
  upstream: "switch" as const,
  parts: [{
    name: "Switch" as const,
    description: "Reka UI Switch.Root (a <button role=\"switch\">, plus Reka UI's hidden checkbox inside a form) with the track drawn behind it and the thumb (data-slot=\"switch-thumb\") inside. On, hover, focus and pressed follow the element's state in CSS, so a click never redraws anything." as const,
    props: [{
      name: "size" as const,
      type: '"default" | "sm"' as const,
      default: '"default"' as const,
      description: "44 x 24 px or 36 x 20 px (calm density always uses the small one). The thumb and its travel follow the size through two custom properties." as const
    }, {
      name: "checked" as const,
      type: "boolean" as const,
      description: "Controlled state." as const
    }, {
      name: "defaultChecked" as const,
      type: "boolean" as const,
      description: "Initial state when uncontrolled." as const
    }, {
      name: "onCheckedChange" as const,
      type: "(checked: boolean) => void" as const,
      description: "Called on click, Space and Enter." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Dashed pencil track on a graphite wash. Not focusable, no hover." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "true draws the outline in red pencil, and keeps it red on top of the fill when the switch is on." as const
    }, {
      name: "name / value / required / form" as const,
      type: "string | boolean" as const,
      description: "Forwarded to Reka UI's hidden input: on submits \"on\" (or `value`), off submits nothing." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same track and coin. Default: derived from useId()." as const
    }]
  }],
  a11y: ["role=\"switch\" with aria-checked true or false. Space and Enter toggle it, Tab focuses it (Reka UI). Label it with <Label htmlFor>, wrap it, or use aria-label.", "State is not carried by color alone: the thumb sits at the start when off and at the end when on, and the track fills when it is on.", "The hit area is 8 px larger than the track on every side (an ::after, so layout never moves). The track is 24 px tall at the default size, 20 px small with the enlarged hit area.", "A Label beside it is a peer: peer-disabled dims it, and hovering the row (a `group/field`) or the label right after it lights the switch's hover overlay.", "Keyboard focus draws a blue felt ring; the drawing is aria-hidden, pointer-events: none and never focusable. Windows high contrast replaces the ink by a real border, a Highlight fill when on and a solid thumb.", "Reduced motion (the OS setting or data-motion=\"reduced\") makes the thumb jump and the marker appear at once.", "Right-to-left: the thumb starts at the right and travels left (rtl: twins)."],
  usage: `import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  )
}`,
  related: ["checkbox", "toggle", "radio-group", "field", "label"]
} satisfies ComponentDoc;
