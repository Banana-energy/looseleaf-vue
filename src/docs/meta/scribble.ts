// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "scribble" as const,
  title: "Scribble" as const,
  category: "Marks" as const,
  description: "Words scribbled out with tight back-and-forth strokes, like a note someone changed their mind about. A look, not a redaction: the text underneath stays in the DOM." as const,
  status: "new" as const,
  parts: [{
    name: "Scribble" as const,
    description: "A <span> (or your own element with asChild) that hosts a scribble per line, in front of the words." as const,
    props: [{
      name: "tone" as const,
      type: '"ink" | "red" | "blue" | "green" | "pencil" | "marker" | "orange"' as const,
      default: '"ink"' as const,
      description: "The pen." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine scribbles are light and leave the words legible; regular and brush are dense." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Scribble it out the first time it scrolls into view." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the scribble." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds to wait before scribbling." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render the scribble on your own child element." as const
    }]
  }],
  a11y: ["Never scribble out a secret: the text is still in the DOM, still selectable, still read by a screen reader. Remove sensitive text from the page instead.", "The drawing is aria-hidden and pointer-events-none. Before it exists, and in Windows high contrast, the browser's own line-through is shown."],
  usage: `import { Scribble } from "@/components/ui/scribble"

export function Example() {
  return (
    <p>
      The plan is <Scribble>very secret</Scribble> a surprise.
    </p>
  )
}`,
  related: ["strike", "highlight", "underline"]
} satisfies ComponentDoc;
