// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "squiggle" as const,
  title: "Squiggle" as const,
  category: "Marks" as const,
  description: "A hand-drawn divider: a wave, a zig-zag, a row of loops, scallops, dashes or dots, drawn to fit whatever width or height you give it. Same semantics as a separator." as const,
  status: "new" as const,
  upstream: "separator" as const,
  parts: [{
    name: "Squiggle" as const,
    description: "A <div> that fills its box with one drawn line along its long side. Full width and 16 px high by default; a vertical one is 16 px wide and as high as its container." as const,
    props: [{
      name: "kind" as const,
      type: '"wavy" | "zigzag" | "loops" | "scallops" | "dashes" | "dots"' as const,
      default: '"wavy"' as const,
      description: "The pattern of the line." as const
    }, {
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "Along the width or the height of the box." as const
    }, {
      name: "decorative" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "true: role=\"none\", hidden from assistive technology. false: a real separator with aria-orientation." as const
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
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Draw the line on, along its length, the first time it scrolls into view." as const
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
  a11y: ["Decorative by default (role=\"none\"), like Reka UI's Separator; pass decorative={false} to expose it as a separator (with aria-orientation) between sections that really are distinct.", "The drawing is aria-hidden and pointer-events-none; it is redrawn when the box is resized. Windows high contrast hides it (a decorative divider loses nothing).", "Cost grows with length: about 3 KB for 420 px in a single pull; keep very long dividers (over 1200 px) to `dots` or `dashes`."],
  usage: `import { Squiggle } from "@/components/ui/squiggle"

export function Example() {
  return (
    <div>
      <p>Before.</p>
      <Squiggle kind="loops" tone="blue" className="my-4" />
      <p>After.</p>
    </div>
  )
}`,
  related: ["separator", "underline", "bracket"]
} satisfies ComponentDoc;
