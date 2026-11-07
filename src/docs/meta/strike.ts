// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "strike" as const,
  title: "Strike" as const,
  category: "Marks" as const,
  description: "A red pencil through real words: one line, two lines, or a cross-out. The text stays readable and real underneath, so a price that was 49 can still be copied and read by a screen reader." as const,
  status: "new" as const,
  parts: [{
    name: "Strike" as const,
    description: "A <s> (or your own element with asChild) that hosts the drawing, in front of the words. One line per line of the phrase; a cross-out is one X over the whole phrase." as const,
    props: [{
      name: "kind" as const,
      type: '"single" | "double" | "cross"' as const,
      default: '"single"' as const,
      description: "One line, two lines, or two long diagonals across the phrase." as const
    }, {
      name: "tone" as const,
      type: '"red" | "ink" | "blue" | "green" | "pencil" | "marker" | "orange"' as const,
      default: '"red"' as const,
      description: "The pen. Red is a waxy colored pencil." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine-liner, regular or brush." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Draw the line on the first time it scrolls into view." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the line. With animate, turning it on plays the draw-on." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds to wait before drawing on." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render the line on your own child element." as const
    }]
  }],
  a11y: ["A real <s> element, which browsers and many screen readers treat as content that is no longer accurate. Say what changed in the surrounding text (\"was\", \"now\") rather than relying on the line alone.", "When the line is only decoration (a ticked-off task whose state a checkbox already announces) use `asChild` on a <span>, so the words are not marked as deleted for everyone, and `show` for the on and off states; with `show={false}` the native line-through is hidden too.", "The text underneath stays selectable and copyable; the drawing is aria-hidden and pointer-events-none.", "Before the drawing exists and in Windows high contrast the browser's own line-through is shown."],
  usage: `import { Strike } from "@/components/ui/strike"

export function Example() {
  return (
    <p>
      Was <Strike>$49</Strike>, now $29.
    </p>
  )
}`,
  related: ["scribble", "underline", "highlight", "annotate"]
} satisfies ComponentDoc;
