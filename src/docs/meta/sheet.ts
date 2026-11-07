// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "sheet" as const,
  title: "Sheet" as const,
  category: "Overlays" as const,
  description: "A notebook page that slides in from the edge of the screen. It is bound along the edge that faces the middle: spiral wire through punched holes, three binder holes, a perforated tear line, or torn out of a pad. Good for settings, filters, carts and mobile navigation." as const,
  status: "stable" as const,
  upstream: "sheet" as const,
  parts: [{
    name: "Sheet" as const,
    description: "The root (Reka UI Dialog): `open`, `defaultOpen`, `onOpenChange`, `modal`." as const
  }, {
    name: "SheetTrigger" as const,
    description: "Opens it. Use `asChild` on a Button." as const
  }, {
    name: "SheetClose" as const,
    description: "Any element that closes it." as const
  }, {
    name: "SheetContent" as const,
    description: "The page: a Paper that is also the Reka UI dialog. Flush to its edge, never tilted, with its shadow cast toward the page underneath. It does not scroll itself (the shadow and coils would be clipped): put long content in a child with `overflow-y-auto`." as const,
    props: [{
      name: "side" as const,
      type: '"top" | "right" | "bottom" | "left"' as const,
      default: '"right"' as const,
      description: "The edge it slides in from." as const
    }, {
      name: "binding" as const,
      type: '"spiral" | "holes" | "perf" | "torn" | "none"' as const,
      default: '"spiral"' as const,
      description: "How the inner edge is finished. `spiral`: wire coils through punched holes, crossing onto the dimmed page. `holes`: three binder holes with reinforcement rings. `perf`: a perforated tear line. `torn`: torn out of a pad. `none`: a plain cut edge." as const
    }, {
      name: "showCloseButton" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The doodled x. It moves clear of the coils when they run along its corner." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"paper"' as const,
      description: "What the page is made of (paper, pad, graph, kraft, ...)." as const
    }, {
      name: "rules" as const,
      type: "RuleName" as const,
      default: '"none"' as const,
      description: "Printed rules (`ruled`, `graph`, `dots` ...). Off by default." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed draws the same coils and edge." as const
    }]
  }, {
    name: "SheetHeader" as const,
    description: "Title and description, padded 16 px." as const
  }, {
    name: "SheetFooter" as const,
    description: "Buttons pushed to the bottom (`mt-auto`)." as const
  }, {
    name: "SheetTitle" as const,
    description: "The name of the sheet, in the script font. Required." as const
  }, {
    name: "SheetDescription" as const,
    description: "What it is for. Wired to `aria-describedby`." as const
  }],
  a11y: ["Reka UI Dialog: role=dialog named by SheetTitle and described by SheetDescription. Focus moves in, Tab cycles inside, Escape closes, focus returns to the trigger; the page behind is inert and scroll is locked.", "A click on a Sonner toast does not count as \"outside\" and does not dismiss the sheet. In a right-to-left page the x steps in from the corner when the coils are on the physical left edge; the coils themselves are physical, like the `side` prop. A top or bottom page is capped at 85dvh: give tall content a `min-h-0 flex-1 overflow-y-auto` child.", "The coils, holes and torn or perforated edge are aria-hidden decoration with no pointer events; the close button is a real button named \"Close\" (a plain × in Windows high contrast).", "Slide and fade durations follow `--ll-motion`, so with reduced motion the page just appears. In `calm` density the coils are hidden and the page is a plain cut sheet.", "Side sheets are physical (`right` is the right edge) as upstream; pass `side=\"left\"` for right-to-left layouts."],
  usage: `import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function Example() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </SheetTrigger>
      <SheetContent side="right" binding="spiral">
        <SheetHeader>
          <SheetTitle>Notebook settings</SheetTitle>
          <SheetDescription>Change how this notebook looks and who can read it.</SheetDescription>
        </SheetHeader>
        {/* fields */}
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}`,
  related: ["dialog", "drawer", "popover", "paper"]
} satisfies ComponentDoc;
