// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "flip-card" as const,
  title: "Flip card" as const,
  category: "Interactive" as const,
  description: "An index card with two sides. It turns over in 3D when you click it or press Space, lifting off the desk on the way; the side you cannot see is inert and hidden from assistive technology. For flashcards, reveals, and anything with a back." as const,
  status: "new" as const,
  parts: [{
    name: "FlipCard" as const,
    description: "The root: a perspective box holding the two faces in one grid cell (so it is as big as the bigger face) and, by default, a trigger button over the whole card. Size it with className (default h-48 w-72)." as const,
    props: [{
      name: "flipped / defaultFlipped / onFlippedChange" as const,
      type: "boolean / boolean / (flipped: boolean) => void" as const,
      description: "Controlled or uncontrolled: true shows the back." as const
    }, {
      name: "axis" as const,
      type: '"y" | "x"' as const,
      default: '"y"' as const,
      description: "Turn like a page (y) or like a notepad (x)." as const
    }, {
      name: "trigger" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Lay a button over the whole card. Turn it off when the faces hold links or buttons, and compose your own FlipCardTrigger." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      default: '"Flip card"' as const,
      description: "Accessible name of the default trigger." as const
    }]
  }, {
    name: "FlipCardFront" as const,
    description: "The side you see first: a Paper (index card by default). Takes every Paper prop." as const,
    props: []
  }, {
    name: "FlipCardBack" as const,
    description: "The other side: a Paper (plain slip by default)." as const,
    props: []
  }, {
    name: "FlipCardTrigger" as const,
    description: "The button that turns the card, with aria-pressed. The default overlay carries a curled arrow in the corner that darkens on hover and a drawn focus ring round the card." as const,
    props: [{
      name: "asChild" as const,
      type: "boolean" as const,
      description: "Use your own element (a Button) as the trigger." as const
    }, {
      name: "overlay" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Cover the whole card. Off: it is an ordinary button placed by you." as const
    }, {
      name: "hint" as const,
      type: "boolean" as const,
      description: "The corner arrow; default on for the overlay." as const
    }]
  }],
  a11y: ["The trigger is a real <button> with aria-pressed (true while the back shows); Space and Enter turn the card. Give it a name that says what happens (\"Show the answer\").", "The hidden face is inert and aria-hidden, so Tab and screen readers only see the side that is showing.", "The default overlay covers the card, so faces should be static text. Faces with links or buttons: trigger={false} and a FlipCardTrigger placed beside them.", "The card has a fixed size (h-48 w-72 unless you pass another) and its faces do not scroll: size it (`className=\"h-64 w-96\"`) for the longer face, and keep answers short.", "Reduced motion: the card swaps sides without turning or lifting (durations collapse to zero).", "The corner arrow and the focus ring are drawn and aria-hidden; the focus ring is the same blue felt as every other control."],
  usage: `import { FlipCard, FlipCardBack, FlipCardFront } from "@/components/ui/flip-card"

export function Example() {
  return (
    <FlipCard label="Show the answer">
      <FlipCardFront>le chat</FlipCardFront>
      <FlipCardBack>the cat</FlipCardBack>
    </FlipCard>
  )
}`,
  related: ["paper", "card", "corkboard", "reveal"]
} satisfies ComponentDoc;
