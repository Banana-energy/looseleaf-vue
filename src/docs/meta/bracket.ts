// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "bracket" as const,
  title: "Bracket" as const,
  category: "Marks" as const,
  description: "A hand bracket down one side of a block: these paragraphs, this list, these three rows belong together. Square, curly or round, on either side, and it flips with the page direction." as const,
  status: "new" as const,
  parts: [{
    name: "Bracket" as const,
    description: "A <div> that wraps the block and draws the bracket in its own inline padding (`ps-7` / `pe-7`) as an aria-hidden svg. The content is untouched." as const,
    props: [{
      name: "kind" as const,
      type: '"square" | "curly" | "round"' as const,
      default: '"square"' as const,
      description: "A square bracket, a curly brace, or a round parenthesis." as const
    }, {
      name: "side" as const,
      type: '"start" | "end"' as const,
      default: '"start"' as const,
      description: "Which side of the block. Logical: start is the right side in a right-to-left page." as const
    }, {
      name: "tone" as const,
      type: '"ink" | "blue" | "red" | "green" | "pencil" | "marker" | "orange"' as const,
      default: '"ink"' as const,
      description: "The pen." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine-liner, felt tip or brush." as const
    }, {
      name: "inset" as const,
      type: "number" as const,
      default: "8" as const,
      description: "How far the spine of the bracket is from the block's edge, px." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Draw the bracket on, top to bottom, the first time the block scrolls into view." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide it." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds before the drawing starts." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }],
  a11y: ["Decorative: the bracket is aria-hidden and pointer-events-none. If grouping matters to everyone, group in the markup as well (a list, a <section>, a fieldset).", "It lives in the block's padding, so text never runs under it; change the padding with className if you move the spine (`inset`).", "Windows high contrast hides the drawing like every overlay ink."],
  usage: `import { Bracket } from "@/components/ui/bracket"

export function Example() {
  return (
    <Bracket kind="curly" tone="blue">
      <p>These two paragraphs are one idea.</p>
      <p>The bracket says so.</p>
    </Bracket>
  )
}`,
  related: ["circled", "annotate", "squiggle", "callout"]
} satisfies ComponentDoc;
