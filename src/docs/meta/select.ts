// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "select" as const,
  title: "Select" as const,
  category: "Forms" as const,
  description: "A drop-down field. The trigger is a pencil box with a tick before its chevron; the list is a slip of paper set down over or under it, where the row you are on gets the highlighter and the chosen row is bold with a blue tick. Reka UI Select underneath: typeahead, keyboard, form value, item-aligned or popper placement." as const,
  status: "stable" as const,
  upstream: "select" as const,
  parts: [{
    name: "Select" as const,
    description: "The root (Reka UI Select): `value`, `defaultValue`, `onValueChange`, `open`, `onOpenChange`, `name`, `required`, `disabled`, `dir`." as const
  }, {
    name: "SelectTrigger" as const,
    description: "The field you press: a `<button role=\"combobox\">` with the Input's pencil box drawn behind it." as const,
    props: [{
      name: "size" as const,
      type: '"default" | "sm"' as const,
      default: '"default"' as const,
      description: "36 px or 32 px tall (28 px in calm density)." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "true draws the red pencil box with a wavy underline and a bang before the chevron." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      description: "Dashed pencil on a pale wash. Not focusable, no hover." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same box. Default: derived from useId()." as const
    }]
  }, {
    name: "SelectValue" as const,
    description: "Shows the chosen item's text, or the `placeholder` (graphite) until there is a choice. The chosen value is blue felt, like typed text." as const
  }, {
    name: "SelectContent" as const,
    description: "The list: a Paper slip that is also the Reka UI listbox. A CSS sheet, no SVG. The viewport scrolls, not the paper, so the shadow and any tape stay whole. Every Reka UI Content prop passes through." as const,
    props: [{
      name: "position" as const,
      type: '"item-aligned" | "popper"' as const,
      default: '"item-aligned"' as const,
      description: "`item-aligned` lays the chosen row over the value in the field (Reka UI's default); `popper` opens under (or over) it and matches its width." as const
    }, {
      name: "align" as const,
      type: '"start" | "center" | "end"' as const,
      default: '"center"' as const,
      description: "Alignment against the trigger in popper mode." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"slip"' as const,
      description: "What the list is cut from: slip, paper, kraft, sticky-* ..." as const
    }, {
      name: "edge" as const,
      type: "EdgeSpec" as const,
      default: '"cut"' as const,
      description: "Cut (pure CSS), torn, deckle ... A drawn edge is measured when the list opens." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "A small seeded tilt of the sheet; text stays upright." as const
    }, {
      name: "tape" as const,
      type: '"corner" | "top" | "both" | false' as const,
      default: "false" as const,
      description: "Strips of masking tape holding the slip." as const
    }]
  }, {
    name: "SelectGroup" as const,
    description: "Groups items under a SelectLabel (role=group)." as const
  }, {
    name: "SelectLabel" as const,
    description: "A typewriter-set kicker above a group." as const
  }, {
    name: "SelectItem" as const,
    description: "One choice: `value`, `disabled`, `textValue`. Highlighted = highlighter swipe; chosen = bold with a blue tick that is written on as the list opens." as const
  }, {
    name: "SelectSeparator" as const,
    description: "A hand-drawn pencil rule between groups." as const
  }, {
    name: "SelectScrollUpButton" as const,
    description: "Chevron shown at the top edge of a scrolling list; hovering it scrolls." as const
  }, {
    name: "SelectScrollDownButton" as const,
    description: "Chevron shown at the bottom edge of a scrolling list." as const
  }],
  a11y: ["The trigger is a role=combobox button with aria-expanded and aria-controls; the list is a role=listbox with role=option items (aria-selected on the chosen one). Reka UI handles everything else.", "Enter, Space, ArrowDown and ArrowUp open it. Arrow keys, Home and End move the highlight, letters jump by typeahead, Enter or Space chooses, Escape closes and puts focus back on the trigger.", "Give the trigger a name with a Label (`htmlFor` + `id`) or `aria-label`; SelectValue's text becomes its value.", "With `name` (or inside a form) Reka UI keeps a hidden native select in sync, so the value is in FormData and `required` blocks the submit.", "The drawing is aria-hidden and never takes the pointer. The highlight does not depend on hue alone: the row also sits on a highlighter shape and the chosen row is bold with a tick. In Windows high contrast the trigger gets a real border.", "Portalled content repeats the InkProvider's `data-density`, `data-motion` and `data-theme`, and sits above dialogs so a Select inside a Dialog works. Reduced motion shows the list without the slide and zoom.", "Right-to-left: the chevron cell, the divider tick and the bang move to the start of the field, and the tick of the chosen row follows."],
  usage: `import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Example() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="pen">Pen</Label>
      <Select defaultValue="felt">
        <SelectTrigger id="pen" className="w-[190px]">
          <SelectValue placeholder="Pick a pen" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="felt">Felt tip</SelectItem>
          <SelectItem value="pencil">Pencil</SelectItem>
          <SelectItem value="marker">Marker</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}`,
  related: ["native-select", "input", "field", "popover", "dropdown-menu"]
} satisfies ComponentDoc;
