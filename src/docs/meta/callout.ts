// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "callout" as const,
  title: "Callout" as const,
  category: "Marks" as const,
  description: "A note in the margin: a few handwritten words and a hand arrow pointing at the thing they are about. It is an ordinary box, so put it where it belongs with a class: float it into the margin, absolutely position it, or drop it in a grid cell." as const,
  status: "new" as const,
  parts: [{
    name: "Callout" as const,
    description: "A <span role=\"note\"> with the words (written with a little per-word jitter) and an Arrow. `direction` is where the arrow POINTS, so a note on the right of a paragraph points left. The words sit on the arrow's tail side." as const,
    props: [{
      name: "direction" as const,
      type: '"left" | "right" | "up" | "down" | "up-left" | "up-right" | "down-left" | "down-right"' as const,
      default: '"left"' as const,
      description: "Where the arrow points, so where the thing you are talking about is." as const
    }, {
      name: "curve" as const,
      type: '"straight" | "curved" | "curl"' as const,
      default: '"curved"' as const,
      description: "The shaft of the arrow." as const
    }, {
      name: "head" as const,
      type: '"v" | "two" | "open" | "solid" | "none"' as const,
      default: '"v"' as const,
      description: "The arrowhead." as const
    }, {
      name: "tone" as const,
      type: '"blue" | "ink" | "red" | "green" | "pencil" | "marker" | "orange"' as const,
      default: '"blue"' as const,
      description: "The pen of the arrow. Blue felt is the reserved \"you\" ink and the natural one for notes." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine-liner, felt tip or brush." as const
    }, {
      name: "bend" as const,
      type: '"up" | "down"' as const,
      default: '"up"' as const,
      description: "Which way a curved arrow bulges." as const
    }, {
      name: "arrow" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Draw the arrow. Without it the callout is just handwritten words." as const
    }, {
      name: "arrowClassName" as const,
      type: "string" as const,
      default: '"h-10 w-14"' as const,
      description: "Sizes the arrow." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Write the note on when it first scrolls into view: the words fade in, the arrow draws itself." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the note." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds before the note starts to appear." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the words and the arrow." as const
    }]
  }],
  a11y: ["role=\"note\": announced as a note. The words are real text; the arrow is aria-hidden.", "A margin note should add to the page, not carry it: keep the essential information in the main text.", "The margin pattern (`float-end clear-end -me-56 w-48`) needs room in the page's padding; below the md breakpoint hide it (`max-md:hidden`) or let it flow.", "Per-word jitter is switched off by calm density and reduced motion; the arrow draws on with the same rules as Arrow."],
  usage: `import { Callout } from "@/components/ui/callout"

export function Example() {
  return (
    <p className="pe-56">
      The good bits get a swipe of yellow.
      <Callout className="float-end clear-end -me-56 w-48">the best line</Callout>
    </p>
  )
}`,
  related: ["arrow", "annotate", "handwritten", "bracket"]
} satisfies ComponentDoc;
