// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "ribbon" as const,
  title: "Ribbon" as const,
  category: "Marks" as const,
  description: "A ribbon label: a band of colored paper with words on it, folded ends and all. For a section heading, a New flag on a card, a price label or a call to action." as const,
  status: "new" as const,
  parts: [{
    name: "Ribbon" as const,
    description: "A span (or your own link or button, with asChild) with the ribbon drawn behind its words. The band is a marker fill that misses its felt-tip outline; a banner's tails are one shade darker and tucked under the band with a small fold. The host is as wide as its words need." as const,
    props: [{
      name: "variant" as const,
      type: '"banner" | "swallow" | "flag"' as const,
      default: '"banner"' as const,
      description: "Folded swallow-tailed ends; a V notch at both ends; square at the start and notched at the end." as const
    }, {
      name: "tone" as const,
      type: '"marker" | "hi" | "tangerine" | "lemon" | "grass" | "teal" | "sky" | "bubblegum" | "paper"' as const,
      default: '"marker"' as const,
      description: "The paper. Tomato and grape are left out: ink on them is 3.95:1, large text only." as const
    }, {
      name: "size" as const,
      type: '"sm" | "default" | "lg"' as const,
      default: '"default"' as const,
      description: "Band height 26 / 34 / 46 px with 14 / 16 / 20 px type." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Draw the ribbon on the child element (an a or a button). A ribbon with asChild, onClick or href lifts 1 px on hover and shows a drop-line." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed draws the same ribbon." as const
    }, {
      name: "children" as const,
      type: "VueNode" as const,
      description: "A few words on one line: the ribbon grows with them and never wraps, so keep it short on a narrow screen. A ribbon with onClick but no asChild is only a span: give a clickable one a link or a button." as const
    }]
  }],
  a11y: ["The words are real DOM text on a plain span; the drawing is aria-hidden, ignores the pointer and never affects layout.", "With asChild the ribbon is whatever you gave it: a link or a button, with its own role, keyboard behavior and name. Focus-visible draws a blue ring round the whole ribbon, tails included.", "Ink text on each offered tone is at least 4.5:1 (marker 4.6 on its drawn fill, lemon and highlighter 12+). Windows high contrast hides the drawing and gives the element a real outline.", "Hover lifts a link ribbon 1 px, draws a drop-line under it and underlines its words, so it is visible without hue. Reduced motion makes the lift instant. Calm density draws a hairline outline and a single-pass fill."],
  usage: `import { Ribbon } from "@/components/ui/ribbon"

export function Example() {
  return (
    <>
      <Ribbon size="lg">New arrivals</Ribbon>
      <Ribbon asChild variant="flag" tone="lemon">
        <a href="/sale">Sale ends Friday</a>
      </Ribbon>
    </>
  )
}`,
  related: ["badge", "seal", "label-tag", "bookmark", "tape"]
} satisfies ComponentDoc;
