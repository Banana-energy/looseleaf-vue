// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "tooltip" as const,
  title: "Tooltip" as const,
  category: "Overlays" as const,
  description: "A sticky note stuck next to a control, with a felt-tip arrow pointing at it. It names an icon button or adds a hint, opens on hover and keyboard focus with a shared delay, and never hides anything a person needs to be able to read." as const,
  status: "stable" as const,
  upstream: "tooltip" as const,
  parts: [{
    name: "TooltipProvider" as const,
    description: "Wrap the app or a region once. Its delays are shared by every tooltip inside, and after one has opened the next opens at once (`skipDelayDuration`). Renders no element." as const,
    props: [{
      name: "delayDuration" as const,
      type: "number" as const,
      default: "0" as const,
      description: "Milliseconds of hover before a tooltip opens (upstream's default is 0; 300-700 is calmer for dense toolbars)." as const
    }, {
      name: "skipDelayDuration" as const,
      type: "number" as const,
      default: "300" as const,
      description: "How long after one closes the next opens with no delay." as const
    }, {
      name: "disableHoverableContent" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Close as soon as the pointer leaves the trigger, without letting it travel onto the note." as const
    }]
  }, {
    name: "Tooltip" as const,
    description: "The root (Reka UI Tooltip): `open`, `defaultOpen`, `onOpenChange`, and a per-tooltip `delayDuration`. It needs a `TooltipProvider` above it (once, at the app root, as in upstream's current source): without one Reka UI throws \"`Tooltip` must be used within `TooltipProvider`\"." as const
  }, {
    name: "TooltipTrigger" as const,
    description: "The control the note is about. Use `asChild` on a Button or a link." as const
  }, {
    name: "TooltipContent" as const,
    description: "The sticky note: a Paper that is also the tooltip content (a CSS sheet, so it costs no SVG). Reka UI places it (`side`, `align`, `sideOffset`) and turns the arrow to face the trigger." as const,
    props: [{
      name: "arrow" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The hand-drawn arrow between the note and the trigger." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"sticky-yellow"' as const,
      description: "What the note is made of: sticky-yellow, sticky-pink, sticky-blue, sticky-green, slip, index-card ..." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "Seeded tilt of the note (sticky stock turns up to 1.6 degrees); the text stays upright." as const
    }, {
      name: "sideOffset" as const,
      type: "number" as const,
      default: "1" as const,
      description: "Gap between the trigger and the note, on top of the arrow's height." as const
    }, {
      name: "collisionPadding" as const,
      type: "number | Partial<Record<Side, number>>" as const,
      default: "8" as const,
      description: "Room kept between the note and the viewport edge when it has to shift to fit (upstream's default is 0: a note at the edge of a toolbar touched the window)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }],
  a11y: ["Reka UI Tooltip: the note has role=tooltip and the trigger gets `aria-describedby` while it is open; the text is announced as the trigger's description. It opens on hover and on keyboard focus, and Escape closes it.", "Tooltips never open on a touch tap (Reka UI ignores touch pointers) and are not focusable themselves: never put the only copy of a label, an instruction or an error in one. An icon button still needs an `aria-label`.", "A disabled button does not receive pointer or focus events, so it cannot show a tooltip: wrap it in a focusable element (see the example) if the reason it is disabled matters.", "The arrow is aria-hidden decoration. Note text is ink on sticky yellow (about 12:1). With reduced motion the note appears without the zoom; in `calm` density it is a flat, untilted note.", "Portalled content repeats the InkProvider's `data-density`, `data-motion` and `data-theme`."],
  usage: `import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Example() {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Add to library">
            <Icon name="plus" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}`,
  related: ["popover", "hover-card", "button"]
} satisfies ComponentDoc;
