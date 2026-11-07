// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "drawer" as const,
  title: "Drawer" as const,
  category: "Overlays" as const,
  description: "A slip of paper you pull up from the bottom of the screen (or in from any edge), built on vaul. From the bottom it is torn off a pad along its top edge with a strip of tape as the grab tab; drag it, flick it away, or give it snap points." as const,
  status: "stable" as const,
  upstream: "drawer" as const,
  parts: [{
    name: "Drawer" as const,
    description: "The root (vaul): `open`, `onOpenChange`, `direction`, `snapPoints`, `activeSnapPoint`, `setActiveSnapPoint`, `dismissible`, `shouldScaleBackground`, `autoFocus`, `modal`." as const
  }, {
    name: "DrawerTrigger" as const,
    description: "Opens it. Use `asChild` on a Button." as const
  }, {
    name: "DrawerPortal" as const,
    description: "Mounts the overlay and content in the body." as const
  }, {
    name: "DrawerOverlay" as const,
    description: "The lamp-lit dim behind the slip. Its opacity follows the drag." as const
  }, {
    name: "DrawerContent" as const,
    description: "The slip: a Paper that is also the vaul drawer. The drag transform vaul writes lands on the sheet, its shadow and the tape together." as const,
    props: [{
      name: "tapeKind" as const,
      type: "TapeKind" as const,
      default: '"kraft"' as const,
      description: "The grab tab's tape (bottom drawers only): kraft, masking, clear or a washi pattern." as const
    }, {
      name: "tapeColor" as const,
      type: "Accent" as const,
      description: "The print color of a washi tape." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"slip"' as const,
      description: "What the slip is made of." as const
    }, {
      name: "edge" as const,
      type: "EdgeSpec" as const,
      default: '{ top: "torn" } from the bottom, "cut" otherwise' as const,
      description: "How it is cut." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "DrawerHeader" as const,
    description: "Title and description; centered for top and bottom drawers." as const
  }, {
    name: "DrawerFooter" as const,
    description: "Buttons pushed to the bottom." as const
  }, {
    name: "DrawerTitle" as const,
    description: "The name of the drawer, in the script font. Required." as const
  }, {
    name: "DrawerDescription" as const,
    description: "What it is for; wired to `aria-describedby`." as const
  }, {
    name: "DrawerClose" as const,
    description: "Any element that closes it." as const
  }],
  a11y: ["vaul builds on Reka UI Dialog: role=dialog named by DrawerTitle and described by DrawerDescription, Escape closes, the page behind is inert, and focus returns to the trigger.", "Focus moves onto the sheet itself when it opens, not onto the first control (vaul's own default leaves it on the trigger behind the dim, and a field would pop a phone keyboard up over the drawer): a screen reader announces the dialog and Tab starts inside it. Pass `autoFocus` on `Drawer` to jump to the first control instead.", "The drawer sits on the same level of the z-scale as dialogs and sheets (`--ll-z-overlay`), so one opened from a dialog stacks above it by open order. A click on a Sonner toast does not count as \"outside\" and does not dismiss it. On a phone with a home indicator the sheet pads its bottom by `env(safe-area-inset-bottom)`.", "Dragging is a pointer shortcut only: every drawer also closes with Escape, the Cancel/Close buttons you provide, or a tap on the dim.", "The tape is a decorative aria-hidden strip, not a control. With reduced motion the slip simply appears; in `calm` density it is a plain cut slip."],
  usage: `import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

export function Example() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          {/* content */}
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}`,
  related: ["sheet", "dialog", "popover", "tape"]
} satisfies ComponentDoc;
