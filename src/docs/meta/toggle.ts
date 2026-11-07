// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "toggle" as const,
  title: "Toggle" as const,
  category: "Actions" as const,
  description: "A two-state button that stays down: a whisper of pencil box at rest, and a highlighter body that snaps into register when it is on. Same Reka UI behavior and variants as shadcn." as const,
  status: "stable" as const,
  upstream: "toggle" as const,
  parts: [{
    name: "Toggle" as const,
    description: "A Reka UI Toggle (a real <button aria-pressed>) with a hand-drawn layer behind its content. Pressed state is data-state=on in CSS, so pressing never redraws anything: the highlighter body fades in, settles from a slight turn and snaps into register while the pointer is down." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "outline"' as const,
      default: '"default"' as const,
      description: "default = a whisper of pencil box that turns into a fine-liner box with a highlighter body when on; outline = an inked box at rest that gets the body inside it." as const
    }, {
      name: "size" as const,
      type: '"default" | "sm" | "lg"' as const,
      default: '"default"' as const,
      description: "36, 32 and 40 px high, with the same minimum widths (icon squares). Compact density is one step tighter, calm two." as const
    }, {
      name: "tone" as const,
      type: '"hi" | "marker"' as const,
      default: '"hi"' as const,
      description: "The color of the body when on: yellow highlighter, or terracotta marker for a louder switch." as const
    }, {
      name: "pressed / defaultPressed / onPressedChange" as const,
      type: "Reka UI" as const,
      description: "Controlled and uncontrolled state, exactly as Reka UI Toggle." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your own element with the toggle's classes, state attributes and drawing inside it (Reka UI Slot)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same toggle, also across remounts. Default: derived from useId()." as const
    }]
  }, {
    name: "toggleVariants" as const,
    description: "The cva function behind Toggle (also used by ToggleGroupItem). Layout and typography classes only: the drawing comes from the component." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "outline"' as const,
      default: '"default"' as const,
      description: "Same values as Toggle." as const
    }, {
      name: "size" as const,
      type: '"default" | "sm" | "lg"' as const,
      default: '"default"' as const,
      description: "Same values as Toggle." as const
    }, {
      name: "className" as const,
      type: "string" as const,
      description: "Merged last." as const
    }]
  }],
  a11y: ["Renders a native <button> with aria-pressed: Enter and Space press it, Tab focuses it, disabled removes it from the tab order.", 'An icon-only toggle needs a name: pass aria-label ("Bold"). Keep the label the same when the state changes, and let aria-pressed say on or off.', "On is never told by hue alone: the toggle gains a solid fine-liner box and a filled body, and the drawn body sits under the label at 12:1 (highlighter) or 4.6:1 (marker).", "Keyboard focus draws the blue felt ring (3:1 against paper and desk); Windows high contrast swaps the drawing for a real border and the browser's own pressed styling.", "aria-invalid draws the box in red pencil (again over the body when the toggle is down), so the cue is a line and not only a color.", "Reduced motion removes the settle, the hover tilt and the snap."],
  usage: `import { Toggle } from "@/components/ui/toggle"
import { Icon } from "@/components/ui/icon"

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Toggle visibility">
        <Icon name="eye" />
      </Toggle>
      <Toggle variant="outline" defaultPressed>
        <Icon name="bell" />
        Follow
      </Toggle>
    </div>
  )
}`,
  related: ["toggle-group", "button", "checkbox", "switch"]
} satisfies ComponentDoc;
