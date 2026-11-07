// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "bubble" as const,
  title: "Bubble" as const,
  category: "Chat" as const,
  description: "A chat bubble drawn like a person draws one: a single felt-tip stroke round a pillowy box, a solid fill (blue for what you send, gray or highlighter for the rest) and a tail on the sender's side. Also a folded note or a sticky note." as const,
  status: "new" as const,
  upstream: "bubble" as const,
  parts: [{
    name: "BubbleGroup" as const,
    description: "A column of bubbles (gap 2). Only the last bubble of a group keeps its tail." as const
  }, {
    name: "Bubble" as const,
    description: "The row of one message body: aligns itself, carries the variant and the shape, and shares them with its content." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"' as const,
      default: '"default"' as const,
      description: "The ink: marker, highlighter, paper shade, a marker wash, paper and a line, nothing at all (prose), or red pencil hatching." as const
    }, {
      name: "align" as const,
      type: '"start" | "end"' as const,
      default: '"start" (or the enclosing Message)' as const,
      description: "Which end of the row it sits on; the tail follows, and flips in right-to-left." as const
    }, {
      name: "shape" as const,
      type: '"cloud" | "note" | "sticky"' as const,
      default: '"cloud"' as const,
      description: "A hand-drawn speech bubble, a folded slip of paper, or a sticky note (note and sticky are a Paper)." as const
    }, {
      name: "pen" as const,
      type: '"ink" | "you"' as const,
      default: '"ink"' as const,
      description: "`you` writes the outline in blue felt and the words in the script font: the person typing." as const
    }, {
      name: "tail" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Draw the tail flick. Inside a BubbleGroup the earlier bubbles hide it by themselves." as const
    }]
  }, {
    name: "BubbleContent" as const,
    description: "The body, and the element that is drawn. Text is real DOM text; the outline and fill are an aria-hidden svg behind it. `asChild` turns a bubble into a button or link (hover drop-lines, a drawn focus ring)." as const,
    props: [{
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render the child element (a button or an anchor) as the bubble." as const
    }, {
      name: "paper" as const,
      type: "Partial<PaperProps>" as const,
      description: "For `note` and `sticky`: tape, fastener, curl, tilt or edge of the sheet." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same bubble." as const
    }]
  }, {
    name: "BubbleReactions" as const,
    description: "A sticker chip that sits on the edge of a bubble: white vinyl, a cut line, a warm shadow. Put emoji, counts or small buttons inside." as const,
    props: [{
      name: "side" as const,
      type: '"top" | "bottom"' as const,
      default: '"bottom"' as const,
      description: "Which edge of the bubble it overlaps." as const
    }, {
      name: "align" as const,
      type: '"start" | "end"' as const,
      default: '"end"' as const,
      description: "Which corner." as const
    }]
  }],
  a11y: ["A bubble is a plain div (as upstream); the drawing is an aria-hidden svg with pointer-events none, so it never affects selection, find-in-page or screen readers.", "Ink on the marker fill is 4.6:1 (the drawn fill is darker), on the highlighter and paper variants 8:1 or more. Muted text on paper is 8.9:1.", "An interactive bubble is a real `button` or `a` through asChild; it gets the drawn focus ring on :focus-visible and the hover drop-lines, and keeps native keyboard behavior.", "The tail follows the reading direction (it is on the right in right-to-left) and is a separate part, so it can be hidden without redrawing.", "Density `calm` draws hairline pencil outlines with a flat wash (the tail included); forced colors replace the drawing with a real outline.", "Difference from upstream: the body is drawn, so `bg-*`, `border-*` and `rounded-*` classes on `BubbleContent` (or `*:data-[slot=bubble-content]:bg-*` on `Bubble`) paint a plain CSS box behind the ink instead of restyling it. Choose the look with `variant`, `pen` and `shape`."],
  usage: `import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble"

export function Example() {
  return (
    <BubbleGroup>
      <Bubble variant="muted">
        <BubbleContent>Can you add tags to my notes?</BubbleContent>
      </Bubble>
      <Bubble variant="default" align="end">
        <BubbleContent>Yes, small ones.</BubbleContent>
        <BubbleReactions>+1</BubbleReactions>
      </Bubble>
    </BubbleGroup>
  )
}

<Bubble shape="note"><BubbleContent paper={{ tilt: -1.5 }}>meet me at four</BubbleContent></Bubble>`,
  related: ["message", "message-scroller", "marker", "attachment", "prompt-input", "typing-indicator"]
} satisfies ComponentDoc;
