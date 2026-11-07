// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "tally" as const,
  title: "Tally" as const,
  category: "Marks" as const,
  description: "A count as tally marks, 1 to 99: bundles of four struck through by a fifth. The number is the accessible name, the box is exactly as big as the marks, and it is drawn on the server." as const,
  status: "new" as const,
  parts: [{
    name: "Tally" as const,
    description: "A <span role=\"img\" aria-label=\"7\"> whose box is the marks' own footprint, so it sits in a line of text or a table cell without shifting anything." as const,
    props: [{
      name: "count" as const,
      type: "number" as const,
      required: true,
      description: "The number to show, clamped to 0..99 and rounded down." as const
    }, {
      name: "size" as const,
      type: '"sm" | "md" | "lg" | number' as const,
      default: '"md"' as const,
      description: "Height of the strokes: sm 14 px, md 22, lg 34, or a number of px." as const
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
      name: "label" as const,
      type: "string" as const,
      description: "The accessible name. Default: the number. Say what is counted: \"7 votes\"." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Wipe the marks on, left to right, the first time they scroll into view." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide them." as const
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
  a11y: ["role=\"img\" with aria-label set to the number (or your label): a screen reader hears \"7\", not seven strokes. Add the counted thing in visible text nearby.", "The marks are the only place the number is shown as a drawing, so the svg is kept in Windows high contrast (as system colors).", "Right-to-left pages start the first bundle on the right.", "Reduced motion zeroes the wipe."],
  usage: `import { Tally } from "@/components/ui/tally"

export function Example() {
  return (
    <p>
      Votes for tea: <Tally count={12} label="12 votes for tea" />
    </p>
  )
}`,
  related: ["badge", "annotate", "asterisk"]
} satisfies ComponentDoc;
