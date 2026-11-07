// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "underline" as const,
  title: "Underline" as const,
  category: "Marks" as const,
  description: "A pen line under real words: single, double, wavy or scribbled, in felt, pencil or marker. It follows the phrase line by line when it wraps, and can draw itself on as it scrolls into view." as const,
  status: "new" as const,
  parts: [{
    name: "Underline" as const,
    description: "A <span> (or your own element with asChild) that hosts the drawing. One aria-hidden line per line of the phrase, measured from the browser's own line boxes." as const,
    props: [{
      name: "kind" as const,
      type: '"single" | "double" | "wavy" | "scribble"' as const,
      default: '"single"' as const,
      description: "The line. Single rises to the right like a real one; double is two pulls; wavy is a squiggle; scribble is a fast zig-zag." as const
    }, {
      name: "tone" as const,
      type: '"ink" | "blue" | "red" | "green" | "pencil" | "marker" | "orange"' as const,
      default: '"ink"' as const,
      description: "The pen. Blue is the reserved \"you\" felt; red is for corrections." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine-liner, felt tip or brush pen. Text under 15 px takes the fine-liner by itself, and the pen grows with larger type." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Draw the line on, left to right, the first time the phrase scrolls into view. Reduced motion just shows it." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the line. With animate, turning it on plays the draw-on." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds to wait before the first line draws on; each further line follows a beat later." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId(), so server and client draw the same line." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render the line on your own child element (a link, a strong)." as const
    }]
  }],
  a11y: ["The words are ordinary text: selectable, copyable, found by search. The line is aria-hidden and pointer-events-none.", "Until the drawing exists (no JavaScript, first paint) and in Windows high contrast, the browser's own text-decoration underline is shown in the pen's color.", "Do not use it as the only sign of a link: put it on a real <a> with asChild (links keep their native focus ring) or keep the link's own underline.", "Reduced motion (or data-motion=\"reduced\") zeroes the draw-on."],
  usage: `import { Underline } from "@/components/ui/underline"

export function Example() {
  return (
    <p>
      Read <Underline tone="blue" kind="wavy">the small print</Underline> first.
    </p>
  )
}`,
  related: ["highlight", "circled", "strike", "annotate"]
} satisfies ComponentDoc;
