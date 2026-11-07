// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "toggle-group" as const,
  title: "Toggle Group" as const,
  category: "Actions" as const,
  description: "A row of toggles that belong together: pick one (alignment) or several (bold, italic, underline). Joined outline items share one hand-drawn box with a pencil seam between them; the highlighter body marks what is on." as const,
  status: "stable" as const,
  upstream: "toggle-group" as const,
  parts: [{
    name: "ToggleGroup" as const,
    description: "A Reka UI ToggleGroup (single: a radio group; multiple: a toolbar). With variant outline and spacing 0 the group is the ink host and draws the one box around every item; otherwise the items draw themselves. It passes variant, size, spacing and tone down to its items." as const,
    props: [{
      name: "type" as const,
      type: '"single" | "multiple"' as const,
      required: true,
      description: "single = at most one item is on (radio semantics); multiple = any number (aria-pressed buttons)." as const
    }, {
      name: "variant" as const,
      type: '"default" | "outline"' as const,
      default: '"default"' as const,
      description: "Same as Toggle." as const
    }, {
      name: "size" as const,
      type: '"default" | "sm" | "lg"' as const,
      default: '"default"' as const,
      description: "Same as Toggle." as const
    }, {
      name: "aria-invalid" as const,
      type: "boolean" as const,
      description: "Marks the choice as wrong (a Form's `FormControl` sets it). The shared box of an outline group turns red pencil; separate toggles each draw a red box. An item's own `aria-invalid={false}` wins; a disabled group stays graphite. Put the group in a `Field` and it keeps the width of its buttons (a vertical Field stretches every other child)." as const
    }, {
      name: "spacing" as const,
      type: "number" as const,
      default: "0" as const,
      description: "Gap between items in the spacing scale (4 px units). 0 joins them: outline items share one box and the seams between them." as const
    }, {
      name: "tone" as const,
      type: '"hi" | "marker"' as const,
      default: '"hi"' as const,
      description: "The color of an item's body when it is on." as const
    }, {
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      description: "Vertical stacks the items, stretches them to one width, and moves the roving focus to the up and down arrows." as const
    }, {
      name: "value / defaultValue / onValueChange" as const,
      type: "Reka UI" as const,
      description: "Controlled and uncontrolled state: a string for single, a string[] for multiple." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Disables every item; the joined box turns into a dashed pencil box." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the group's box." as const
    }]
  }, {
    name: "ToggleGroupItem" as const,
    description: "A Reka UI ToggleGroup item: a toggle that reads variant and size from its group. In a joined group it draws only its seam (at the edge it shares with the item before it), its body and its focus ring." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "The item's value in the group." as const
    }, {
      name: "variant / size" as const,
      type: "as Toggle" as const,
      description: "Used only when the group does not set them. An item that asks for outline in a group with no variant draws a box of its own (the group draws none); only a group with variant outline and spacing 0 shares one box." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your own element (Reka UI Slot)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of this item." as const
    }]
  }],
  a11y: ["Roving focus by Reka UI: the group is one tab stop, the arrow keys (left and right, or up and down when vertical) move between items and loop, Home and End jump to the ends, Space and Enter press.", "single is announced as a radio group with checked items; multiple as a toolbar of pressed buttons. Give the group an aria-label and every icon-only item its own.", "On is never told by hue alone: a filled body sits under the item, and (separate items) a solid box replaces the whisper box.", "The focus ring is drawn on the item and lifted above its neighbors; Windows high contrast falls back to real borders and the browser's focus ring.", "In right-to-left layouts the seams move to the other edge; the drawing is mirrored by the recipe, not by CSS."],
  usage: `import { Icon } from "@/components/ui/icon"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function Example() {
  return (
    <ToggleGroup type="single" variant="outline" defaultValue="list" aria-label="View">
      <ToggleGroupItem value="list" aria-label="List">
        <Icon name="list" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid">
        <Icon name="layout-grid" />
      </ToggleGroupItem>
      <ToggleGroupItem value="menu" aria-label="Compact">
        <Icon name="menu" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`,
  related: ["toggle", "button-group", "tabs", "radio-group"]
} satisfies ComponentDoc;
