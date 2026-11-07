// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "hover-card" as const,
  title: "Hover Card" as const,
  category: "Overlays" as const,
  description: "A small polaroid that appears when you rest the pointer on a link or move keyboard focus to it: photo stock with a thick lower margin for handwriting, a degree or two of tilt, and tape if you like. A preview for sighted pointer users, never the only home of anything." as const,
  status: "stable" as const,
  upstream: "hover-card" as const,
  parts: [{
    name: "HoverCard" as const,
    description: "The root (Reka UI HoverCard): `openDelay` (700 ms), `closeDelay` (300 ms), `open`, `defaultOpen`, `onOpenChange`." as const
  }, {
    name: "HoverCardTrigger" as const,
    description: "The link or element that shows it on hover and on keyboard focus. Use `asChild` on an `<a>`." as const
  }, {
    name: "HoverCardContent" as const,
    description: "The polaroid: a Paper on photo stock that is also the Reka UI hover card content (a CSS sheet, no SVG). It takes every Reka UI Content prop and these." as const,
    props: [{
      name: "sideOffset" as const,
      type: "number" as const,
      default: "8" as const,
      description: "Gap between the trigger and the card (upstream's default is 4: a polaroid needs room for its shadow and tape). The card is also capped to the viewport width." as const
    }, {
      name: "collisionPadding" as const,
      type: "number | Partial<Record<Side, number>>" as const,
      default: "8" as const,
      description: "Room kept between the card and the viewport edge when it has to shift to fit (upstream's default is 0)." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"photo"' as const,
      description: "What it is printed on." as const
    }, {
      name: "tape" as const,
      type: '"corner" | "top" | "both" | false' as const,
      default: "false" as const,
      description: "Tape across the top edge or corners." as const
    }, {
      name: "edge" as const,
      type: "EdgeSpec" as const,
      default: '"cut"' as const,
      description: "Cut (pure CSS), torn, deckle, ..." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "Seeded tilt of the sheet (photo stock turns up to 1.5 degrees); text stays upright." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "HoverCardMedia" as const,
    description: "Looseleaf addition: the picture window, a recess with a pencil frame shaded along its top and left. Put an image, a Doodle or a Sticker in it." as const
  }, {
    name: "HoverCardCaption" as const,
    description: "Looseleaf addition: handwriting on the wide lower margin (script font)." as const
  }],
  a11y: ["Reka UI HoverCard opens on pointer hover and on keyboard focus of the trigger, closes on blur and on Escape, and lets the pointer travel from the trigger into the card. It is not announced to screen readers as a dialog: treat it as a preview of information that is also available by following the link.", "Touch: hover cards never open on a tap (Reka UI ignores touch pointers). The trigger must work on its own as a link; use a Popover when the content needs to be reachable on a phone.", "The recess frame and tape are aria-hidden decoration. Give the media an accessible name if it carries meaning.", "Portalled content repeats the InkProvider's `data-density`, `data-motion` and `data-theme`; with reduced motion it appears without the zoom."],
  usage: `import { HoverCard, HoverCardCaption, HoverCardContent, HoverCardMedia, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Doodle } from "@/components/ui/doodle"

export function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" asChild>
          <a href="https://kevintngo.github.io/looseleaf">@looseleaf</a>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent tape="top">
        <HoverCardMedia>
          <Doodle name="flower" size={88} />
        </HoverCardMedia>
        <HoverCardCaption>@looseleaf</HoverCardCaption>
        <p className="px-1 text-sm text-muted-foreground">shadcn/ui, drawn by hand.</p>
      </HoverCardContent>
    </HoverCard>
  )
}`,
  related: ["popover", "tooltip", "card", "paper"]
} satisfies ComponentDoc;
