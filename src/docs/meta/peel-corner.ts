// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "peel-corner" as const,
  title: "Peel corner" as const,
  category: "Interactive" as const,
  description: "A page whose corner curls back to show the sheet underneath. Hover the corner to lift it, drag it to peel along a diagonal crease, click or press Enter to open it. For a discount code, a hint, a secret, a P.S." as const,
  status: "new" as const,
  parts: [{
    name: "PeelCorner" as const,
    description: "The root: a positioned box that holds the page and the sheet under it, draws the turned-back flap (the back of the paper, with its stepped shadow on the sheet underneath) and puts a 56 px corner button over it. The flap is drawn once and scaled about the corner, so crease and shadow stay in proportion at every stage." as const,
    props: [{
      name: "peeled / defaultPeeled / onPeeledChange" as const,
      type: "boolean" as const,
      description: "Controlled or uncontrolled: true when the corner is open and the sheet underneath can be read." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      default: "120" as const,
      description: "How big the turned-back corner is when open, px. A drag can go about a third further." as const
    }, {
      name: "corner" as const,
      type: '"bottom-right" | "bottom-left"' as const,
      default: '"bottom-right"' as const,
      description: "Which corner curls; the bottom left mirrors the flap, the clip and the underneath content." as const
    }, {
      name: "back" as const,
      type: "PaintKey" as const,
      default: '"paper"' as const,
      description: "The token the flap (the back of the page) is made of: \"kraft\" for a kraft page, \"sticky-yellow\" for a sticky note." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      default: '"Peel back the corner"' as const,
      description: "Accessible name of the corner button." as const
    }]
  }, {
    name: "PeelCornerPage" as const,
    description: "The page you see: a Paper (paper stock, no tilt) cut away along the crease with a clip-path that keeps 40 px of room for its own shadow. Takes every Paper prop." as const,
    props: []
  }, {
    name: "PeelCornerUnder" as const,
    description: "The sheet underneath: as big as the page, behind it, kraft by default. Its content sits in the corner that peels. inert and aria-hidden until the corner is open, so its links and buttons cannot be reached early." as const,
    props: []
  }],
  a11y: ["The corner is a real <button> with aria-expanded and aria-controls (the sheet underneath). Enter and Space toggle it, a screen reader's activate works, and a drag is only an extra.", "What is underneath is inert and aria-hidden while the corner is closed, so it is neither focusable nor read early; once open it is ordinary content.", "The corner button is a 56 px square laid over the page's corner: keep links and buttons out of that square, or they cannot be reached with a pointer.", "Controlled: if the parent declines a change (`peeled` stays as it was), the corner eases back to what the prop says instead of staying half open.", "The hit area is 56 px, bigger than the curl. Dragging back toward the corner closes it; a short pull that never gets half way springs back; pointercancel springs back.", "Reduced motion: the corner jumps between rest, open and closed instead of easing. Calm density keeps the flap and the button and trims the flap's shadow to two steps.", "The flap and its shadow are drawn art, aria-hidden and click-through; the keyboard focus ring is drawn round the corner button."],
  usage: `import { PeelCorner, PeelCornerPage, PeelCornerUnder } from "@/components/ui/peel-corner"

export function Example() {
  return (
    <PeelCorner>
      <PeelCornerPage>Spring sale. Peek under the corner for a code.</PeelCornerPage>
      <PeelCornerUnder>SAVE10</PeelCornerUnder>
    </PeelCorner>
  )
}`,
  related: ["paper", "tear-off", "flip-card", "reveal"]
} satisfies ComponentDoc;
