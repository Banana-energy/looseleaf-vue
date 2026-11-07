// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "popover" as const,
  title: "Popover" as const,
  category: "Overlays" as const,
  description: "A slip of paper set down next to its trigger. It can be held with a push-pin or a strip of tape, given a hand-drawn arrow to point at what it is about, and cut from any stock. Focus moves into it, Escape puts it away." as const,
  status: "stable" as const,
  upstream: "popover" as const,
  parts: [{
    name: "Popover" as const,
    description: "The root (Reka UI Popover): `open`, `defaultOpen`, `onOpenChange`, `modal`." as const
  }, {
    name: "PopoverTrigger" as const,
    description: "Toggles it. Use `asChild` on a Button." as const
  }, {
    name: "PopoverAnchor" as const,
    description: "Position the popover from another element than the trigger." as const
  }, {
    name: "PopoverContent" as const,
    description: "The slip: a Paper that is also the Reka UI popover content (role=dialog, so give it a name with a title or `aria-label`). A CSS sheet, no SVG, unless a torn edge or the arrow is asked for. It takes every Reka UI Content prop (`side`, `align`, `sideOffset`, ...) and these." as const,
    props: [{
      name: "sideOffset" as const,
      type: "number" as const,
      default: "8" as const,
      description: "Gap between the trigger and the slip (upstream's default is 4: a slip needs room for its shadow and pin). The slip is also capped to the viewport width." as const
    }, {
      name: "collisionPadding" as const,
      type: "number | Partial<Record<Side, number>>" as const,
      default: "8" as const,
      description: "Room kept between the slip and the viewport edge when it has to shift to fit (upstream's default is 0: a wide slip touched the window)." as const
    }, {
      name: "pin" as const,
      type: "boolean | Accent" as const,
      default: "false" as const,
      description: "A push-pin through the top edge: `true` for tomato, or a stationery color (sky, lemon, grass ...)." as const
    }, {
      name: "arrow" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A felt-tip arrow between the slip and the trigger. Reka UI turns it to whichever side the popover opened on and adds its height to `sideOffset`." as const
    }, {
      name: "tape" as const,
      type: '"corner" | "top" | "both" | false' as const,
      default: "false" as const,
      description: "Strips of masking tape at the corners or the top edge." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"slip"' as const,
      description: "What it is made of: slip, paper, kraft, sticky-*, index-card ..." as const
    }, {
      name: "edge" as const,
      type: "EdgeSpec" as const,
      default: '"cut"' as const,
      description: "Cut (pure CSS), torn, deckle, ..." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "Small seeded tilt of the sheet; text stays upright." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }, {
      name: "data-slot" as const,
      type: "string" as const,
      default: '"popover-content"' as const,
      description: "For a component built on the popover to rename the slip (a combobox list is `combobox-content` in shadcn). The Command and Calendar that lie on a popover's paper look for `popover-content`, so keep it unless yours brings its own rules." as const
    }]
  }, {
    name: "PopoverHeader" as const,
    description: "Stacks a title and a description." as const
  }, {
    name: "PopoverTitle" as const,
    description: "A heading in the script font (a div, as upstream)." as const
  }, {
    name: "PopoverDescription" as const,
    description: "Muted explanatory text." as const
  }],
  a11y: ["Reka UI Popover: the trigger has aria-expanded and aria-controls; the content is a role=dialog that needs an accessible name (PopoverTitle wired with `aria-labelledby`, or `aria-label`). Focus moves into it on open, Escape and an outside click close it, and focus returns to the trigger.", "A popover with no trigger (opened by a menu item or a shortcut, positioned by a `PopoverAnchor`) gives the focus back to whoever had it when it opened: Reka UI only knows the trigger and would drop the focus on the page. It does not when you clicked somewhere else, when the app has already moved the focus on, or when your `onCloseAutoFocus` prevents the default.", "Tab moves out of a non-modal popover into the page as usual; set `modal` on Popover to trap focus.", "The pin, tape and arrow are aria-hidden decoration with no pointer events.", "Touch: works with a tap like any button; nothing depends on hover.", "Portalled content repeats the InkProvider's `data-density`, `data-motion` and `data-theme`. With reduced motion it appears without the slide and zoom."],
  usage: `import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"

export function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent pin className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
        <Label htmlFor="width">Width</Label>
        <Input id="width" defaultValue="100%" />
      </PopoverContent>
    </Popover>
  )
}`,
  related: ["hover-card", "tooltip", "dialog", "select"]
} satisfies ComponentDoc;
