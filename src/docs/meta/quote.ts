// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "quote" as const,
  title: "Quote" as const,
  category: "Marks" as const,
  description: "A pull quote with big hand-drawn quotation marks and an attribution. A real figure, blockquote and figcaption, with marker or felt marks drawn in the gutters: an opening pair at the top, a closing pair at the bottom." as const,
  status: "new" as const,
  parts: [{
    name: "Quote" as const,
    description: "The <figure> that holds a quotation and its attribution." as const
  }, {
    name: "QuoteText" as const,
    description: "The <blockquote> (accepts `cite`) and the ink host: the marks are drawn in its inline padding, which grows with `size`. The browser's own opening quotation mark stands in until the drawing exists." as const,
    props: [{
      name: "size" as const,
      type: '"sm" | "md" | "lg"' as const,
      default: '"md"' as const,
      description: "The size of the quotation marks (24, 32 or 46 px) and the room they get." as const
    }, {
      name: "tone" as const,
      type: '"marker" | "ink" | "blue" | "red" | "green" | "pencil" | "orange"' as const,
      default: '"marker"' as const,
      description: "The pen of the marks. Marker is the terracotta felt." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "How heavy the strokes are." as const
    }, {
      name: "rule" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A quiet pencil rule down the start edge between the pairs of marks." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Draw the marks on the first time the quotation scrolls into view." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the marks." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds before the drawing starts." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "QuoteAttribution" as const,
    description: "The <figcaption>: who said it. An em dash is added before it by CSS." as const
  }],
  a11y: ["Real semantics: <figure> > <blockquote cite> + <figcaption>. Assistive technology announces a quotation and its source.", "The quotation marks are drawings (aria-hidden), not characters in the text, so they are not read aloud or copied with the words.", "The marks live in the blockquote's padding and never overlap the words; RTL mirrors the whole drawing.", "Reduced motion zeroes the draw-on."],
  usage: `import { Quote, QuoteAttribution, QuoteText } from "@/components/ui/quote"

export function Example() {
  return (
    <Quote>
      <QuoteText>The best time to write it down was when it happened.</QuoteText>
      <QuoteAttribution>Ada, in the margin of a book</QuoteAttribution>
    </Quote>
  )
}`,
  related: ["typography", "signature", "lettering", "handwritten"]
} satisfies ComponentDoc;
