// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "dialog" as const,
  title: "Dialog" as const,
  category: "Overlays" as const,
  description: "A modal window that is a sheet of paper dropped on the desk: it lands with a small tilt that settles, the page behind goes dim under a lamp, and the close button is a doodled x. Tape it, pin it, tear its edge; on a phone it becomes a sheet at the bottom of the screen." as const,
  status: "stable" as const,
  upstream: "dialog" as const,
  parts: [{
    name: "Dialog" as const,
    description: "The root (Reka UI Dialog): `open`, `defaultOpen`, `onOpenChange`, `modal`." as const
  }, {
    name: "DialogTrigger" as const,
    description: "The button that opens it. Use `asChild` to make your own Button the trigger." as const
  }, {
    name: "DialogPortal" as const,
    description: "Where the overlay and content are mounted (the body). Used by `DialogContent`." as const
  }, {
    name: "DialogOverlay" as const,
    description: "The dim: a lamp-lit umber gradient, lighter in the middle. It is also the scroll container of the dialog, so a tall dialog scrolls under the lamp and the sheet's shadow and tape are never clipped." as const
  }, {
    name: "DialogContent" as const,
    description: "The sheet itself: a Paper that is also the Reka UI dialog (role=dialog, focus trap, scroll lock, Escape, focus return). It takes every Reka UI Content prop and these Paper props." as const,
    props: [{
      name: "showCloseButton" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The doodled x in the top corner." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"paper"' as const,
      description: "What the sheet is made of: paper, card, slip, index-card, graph, kraft, sticky-* ..." as const
    }, {
      name: "edge" as const,
      type: "EdgeSpec" as const,
      default: '"cut"' as const,
      description: "Cut (pure CSS, no svg), torn, deckle, crimp, zig, perf, scallop, or one per side." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "The sheet turns by a small seeded angle; the text never does. Phones lay it flat." as const
    }, {
      name: "tape" as const,
      type: '"corner" | "top" | "both" | false' as const,
      default: "false" as const,
      description: "Tape strips across the top corners or edge." as const
    }, {
      name: "tapeKind" as const,
      type: "TapeKind" as const,
      default: '"masking"' as const,
      description: "masking, washi-dots, washi-stripes, washi-zigzag, washi-gingham, kraft, clear." as const
    }, {
      name: "fastener" as const,
      type: '"clip" | "pin" | "staple" | "binder-clip" | false' as const,
      default: "false" as const,
      description: "Hold the sheet with a drawn prop." as const
    }, {
      name: "rules" as const,
      type: "RuleName" as const,
      default: '"none"' as const,
      description: "Printed rules (ruled, graph, dots ...). Off by default: arbitrary content does not sit on ruled lines." as const
    }, {
      name: "shadow" as const,
      type: "SheetShadowKind | 'none'" as const,
      description: "Which umber shadow the sheet casts. Default: its stock's." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed cuts, tilts and draws the same way." as const
    }]
  }, {
    name: "DialogHeader" as const,
    description: "Title and description; centered on phones, left on larger screens." as const
  }, {
    name: "DialogTitle" as const,
    description: "The name of the dialog (script font, 27 px). Required by screen readers." as const
  }, {
    name: "DialogDescription" as const,
    description: "What it is for. Wired to `aria-describedby` by Reka UI." as const
  }, {
    name: "DialogBody" as const,
    description: "Looseleaf addition: the scrolling middle for long content (`max-h` 60dvh, `overflow-y-auto`). The sheet itself never scrolls. It is a tab stop with a drawn focus ring (`tabIndex={0}`, override it if the body holds focusable controls), because a scroll area with nothing focusable in it cannot be scrolled by keyboard." as const
  }, {
    name: "DialogFooter" as const,
    description: "Buttons, stacked on phones and right-aligned from `sm`." as const,
    props: [{
      name: "showCloseButton" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Adds an outline Close button after the children." as const
    }]
  }, {
    name: "DialogClose" as const,
    description: "Any element that closes the dialog. Use `asChild` on a Button." as const
  }],
  a11y: ["Reka UI Dialog: role=dialog with `aria-labelledby` (the title) and `aria-describedby` (the description); give every dialog both. Focus moves into the sheet, Tab and Shift+Tab cycle inside it, Escape closes it, and focus returns to the trigger.", "The page behind is inert while the dialog is open (pointer events off, aria-hidden on siblings) and scroll is locked.", "The close button is a real button named \"Close\"; the x is decorative ink. In Windows high contrast the ink hides and a plain × takes its place.", "The drop-in, the fade and the hover blot follow `--ll-motion`: with reduced motion the dialog simply appears. In `calm` density the sheet is flat, untilted and untaped.", "Portalled content repeats the InkProvider's `data-density`, `data-motion` and `data-theme`, so density and reduced motion work inside the dialog too.", "`modal={false}` works as in Reka UI: no dim (the sheet sits in a frame that lets clicks through), the page stays interactive and scroll is not locked. Clicking a Sonner toast never counts as \"outside\", so a toast action pressed over a dialog does not dismiss it. On a phone the bottom sheet pads its foot by `env(safe-area-inset-bottom)`, and the dim reserves its scrollbar gutter so the drop-in cannot make a classic scrollbar shove the sheet sideways."],
  usage: `import { Button } from "@/components/ui/button"
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent tape="both" className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        {/* form fields */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
  related: ["alert-dialog", "sheet", "drawer", "popover", "paper", "tape"]
} satisfies ComponentDoc;
