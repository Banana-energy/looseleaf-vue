// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "annotate" as const,
  title: "Annotate" as const,
  category: "Marks" as const,
  description: "One component for every mark, in the spirit of RoughNotation: put a highlight, an underline, a circle, a box, brackets, a strike, a cross-out or a scribble on real words, and draw it on when it scrolls into view." as const,
  status: "new" as const,
  parts: [{
    name: "Annotate" as const,
    description: "Renders the matching mark (Highlight, Underline, Circled, Strike or Scribble) for `type`, so every behavior of those applies: the words stay text, the drawing is aria-hidden and follows line breaks, and `animate` writes it on the first time it scrolls into view." as const,
    props: [{
      name: "type" as const,
      type: '"highlight" | "underline" | "circle" | "box" | "brackets" | "strike-through" | "crossed-off" | "scribble"' as const,
      required: true,
      description: "Which mark to put on the words." as const
    }, {
      name: "color" as const,
      type: "HighlightTone | MarkPen" as const,
      description: "For highlight: yellow, pink, green, blue, orange, lilac or teal. For everything else: ink, blue, red, green, pencil, marker or orange." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine-liner, felt tip or brush pen (a highlighter is held light, regular or heavy)." as const
    }, {
      name: "kind" as const,
      type: '"single" | "double" | "wavy" | "scribble"' as const,
      default: '"single"' as const,
      description: "The line of an underline. Ignored by the other types." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the mark. With animate, turning it on plays the draw-on again." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Hold the mark back and draw it on the first time the words scroll into view. Reduced motion just shows it." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds before the drawing starts." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId(), so server and client draw the same marks." as const
    }]
  }],
  a11y: ["The words are ordinary text: selectable, copyable, found by search and read in order. Every drawing is aria-hidden and pointer-events-none.", "A mark that carries meaning (the right answer, a price that changed) needs the meaning in words as well; a drawing alone is not announced.", "Highlight is a <mark>, strike-through is an <s>. Before the drawing exists, without JavaScript, and in Windows high contrast, the browser's own decoration shows instead.", "Reduced motion (or data-motion=\"reduced\") zeroes the draw-on: marks simply appear."],
  usage: `import { Annotate } from "@/components/ui/annotate"

export function Example() {
  return (
    <p>
      Read <Annotate type="circle" color="red" animate>this</Annotate> twice, and{" "}
      <Annotate type="highlight" animate>underline nothing</Annotate>.
    </p>
  )
}`,
  related: ["highlight", "underline", "circled", "strike", "scribble", "callout", "arrow"]
} satisfies ComponentDoc;
