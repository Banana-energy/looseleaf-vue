// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "alert-dialog" as const,
  title: "Alert Dialog" as const,
  category: "Overlays" as const,
  description: "A dialog that asks one question and will not go away until it is answered: no close button, no dismissing by clicking outside, focus starts on the safe answer. For risky questions it can be taped with hazard strips and given a red patch behind its icon." as const,
  status: "stable" as const,
  upstream: "alert-dialog" as const,
  parts: [{
    name: "AlertDialog" as const,
    description: "The root (Reka UI AlertDialog): `open`, `defaultOpen`, `onOpenChange`." as const
  }, {
    name: "AlertDialogTrigger" as const,
    description: "Opens it. Use `asChild` on a Button." as const
  }, {
    name: "AlertDialogPortal" as const,
    description: "Mounts the overlay and content in the body." as const
  }, {
    name: "AlertDialogOverlay" as const,
    description: "The lamp-lit dim. It scrolls the dialog if the screen is too short, so the sheet's shadow and tape are never clipped." as const
  }, {
    name: "AlertDialogContent" as const,
    description: "The sheet: a Paper that is also the alertdialog. It takes every Reka UI Content prop and these." as const,
    props: [{
      name: "size" as const,
      type: '"default" | "sm"' as const,
      default: '"default"' as const,
      description: "`sm` is a narrow, centered sheet with the buttons in two equal columns." as const
    }, {
      name: "tone" as const,
      type: '"default" | "danger"' as const,
      default: '"default"' as const,
      description: "`danger` tapes red-and-white hazard strips across the top corners." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"paper"' as const,
      description: "What the sheet is made of." as const
    }, {
      name: "edge" as const,
      type: "EdgeSpec" as const,
      default: '"cut"' as const,
      description: "Cut (CSS, no svg), torn, deckle, ..." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "Small seeded tilt of the sheet; text stays upright; phones lay it flat." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "AlertDialogHeader" as const,
    description: "Title and description; with a media it becomes two columns on larger screens." as const
  }, {
    name: "AlertDialogTitle" as const,
    description: "The question, in the script font. Required." as const
  }, {
    name: "AlertDialogDescription" as const,
    description: "The consequence, in plain words. Required." as const
  }, {
    name: "AlertDialogMedia" as const,
    description: "The picture beside the question: put an Icon or a Sticker in it. It sits on a hand-drawn round patch." as const,
    props: [{
      name: "tone" as const,
      type: '"default" | "danger" | "info"' as const,
      default: '"default"' as const,
      description: "The patch color: highlighter, red pencil wash, sky." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "AlertDialogFooter" as const,
    description: "The answers: stacked on phones, right-aligned from `sm`." as const
  }, {
    name: "AlertDialogAction" as const,
    description: "The confirming answer. A Button (asChild over Reka UI Action) that closes the dialog after its onClick." as const,
    props: [{
      name: "variant" as const,
      type: "ButtonVariant" as const,
      default: '"default"' as const,
      description: "Any Button variant; use `destructive` for irreversible actions." as const
    }, {
      name: "size" as const,
      type: "ButtonSize" as const,
      default: '"default"' as const,
      description: "Any Button size." as const
    }]
  }, {
    name: "AlertDialogCancel" as const,
    description: "The safe answer. A Button that closes the dialog; focus starts here." as const,
    props: [{
      name: "variant" as const,
      type: "ButtonVariant" as const,
      default: '"outline"' as const,
      description: "Any Button variant." as const
    }, {
      name: "size" as const,
      type: "ButtonSize" as const,
      default: '"default"' as const,
      description: "Any Button size." as const
    }]
  }],
  a11y: ["Reka UI AlertDialog: role=alertdialog with `aria-labelledby` and `aria-describedby` (always provide a title and description). Focus is trapped, the page behind is inert, and Escape cancels.", "Focus starts on the Cancel button, so an accidental Enter does the safe thing. Clicking outside does not dismiss it.", "The hazard tape and the media patch are decoration; the meaning is in the words and in the destructive button (hatched, not only red).", "With reduced motion the sheet simply appears; in `calm` density it is flat and untaped."],
  usage: `import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete notebook</Button>
      </AlertDialogTrigger>
      <AlertDialogContent tone="danger">
        <AlertDialogHeader>
          <AlertDialogMedia tone="danger"><Icon name="trash" /></AlertDialogMedia>
          <AlertDialogTitle>Delete this notebook?</AlertDialogTitle>
          <AlertDialogDescription>All 48 pages will be gone for good.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
  related: ["dialog", "button", "sheet", "sonner"]
} satisfies ComponentDoc;
