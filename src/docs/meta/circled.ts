// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "circled" as const,
  title: "Circled" as const,
  category: "Marks" as const,
  description: "A hand loop around a word or phrase: a circle that overshoots where it started, a box, or a pair of square brackets. It can be written on as it scrolls into view." as const,
  status: "new" as const,
  parts: [{
    name: "Circled" as const,
    description: "A <span> (or your own element with asChild) that hosts ONE drawing for the whole phrase, in front of the words. For a phrase that wraps, prefer the box or the brackets." as const,
    props: [{
      name: "shape" as const,
      type: '"circle" | "box" | "brackets"' as const,
      default: '"circle"' as const,
      description: "A loop that overshoots, a hand box, or square brackets on both sides." as const
    }, {
      name: "tone" as const,
      type: '"ink" | "blue" | "red" | "green" | "pencil" | "marker" | "orange"' as const,
      default: '"ink"' as const,
      description: "The pen. Red felt is the teacher's circle." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine-liner, felt tip or brush pen." as const
    }, {
      name: "bleed" as const,
      type: "number" as const,
      default: "2" as const,
      description: "How many px the mark stands off the writing, on every side (0 to 16). A loop already hugs one line of text, close enough to leave the words either side alone; raise it for a roomier ring, or for a mark that shares a line with a bigger neighbor." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Write the loop on, following the stroke, the first time it scrolls into view." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the mark. With animate, turning it on plays the draw-on." as const
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
      description: "Render the mark on your own child element." as const
    }]
  }],
  a11y: ["The words are ordinary text; the loop is aria-hidden and pointer-events-none, so it never blocks a click on a link or button inside.", "If the circle carries meaning (the correct answer, the item to check) say so in text as well; a drawing alone is not announced.", "Until the drawing exists a thin outline shows; in Windows high contrast a real outline is shown instead of the drawing."],
  usage: `import { Circled } from "@/components/ui/circled"

export function Example() {
  return (
    <p>
      Please reply by <Circled tone="red">Friday</Circled>.
    </p>
  )
}`,
  related: ["annotate", "underline", "highlight", "arrow"]
} satisfies ComponentDoc;
