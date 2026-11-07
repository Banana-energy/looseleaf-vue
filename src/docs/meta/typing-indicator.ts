// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "typing-indicator" as const,
  title: "Typing indicator" as const,
  category: "Chat" as const,
  description: "\"Somebody is writing\": a small pencil that draws three dots one after another, or scrawls a line of cursive. A polite live region with a screen-reader label, at home inside a bubble." as const,
  status: "new" as const,
  parts: [{
    name: "TypingIndicator" as const,
    description: "A `role=\"status\"` region 56 x 24 px (80 x 24 for the scrawl) holding the drawing and a visually hidden label. Every CSS animation ends on the fully drawn frame, so reduced motion shows the dots, the line and the pencil at rest." as const,
    props: [{
      name: "variant" as const,
      type: '"dots" | "squiggle"' as const,
      default: '"dots"' as const,
      description: "Three dots, or a line of cursive scrawl." as const
    }, {
      name: "pen" as const,
      type: '"ink" | "you"' as const,
      default: '"ink"' as const,
      description: "`you` writes in blue felt." as const
    }, {
      name: "pencil" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Draw the pencil that does the writing." as const
    }, {
      name: "active" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "False leaves an empty live region mounted, so a screen reader announces the label when it turns on." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      default: '"Typing"' as const,
      description: "What assistive technology announces." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }],
  a11y: ["`role=\"status\"` with `aria-live=\"polite\"`: it never interrupts. The label is visually hidden text; the drawing is an aria-hidden svg.", "A live region announces changes, not arrivals: keep the indicator mounted and toggle `active` (the examples do) instead of mounting it when someone starts typing. Keep it exposed too: `hidden`, `display: none` or `visibility: hidden` on an ancestor removes the region from the accessibility tree, so collapse the bubble around it with `sr-only`.", "The animation is decoration. With `prefers-reduced-motion` (or the app's calm setting) every animation ends on its last frame, which is the complete drawing; nothing blinks or loops.", "Ink on paper is 14:1 (blue felt 7.1:1); the marks are not the only carrier of meaning, the label is."],
  usage: `import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { TypingIndicator } from "@/components/ui/typing-indicator"

export function Example({ typing }: { typing: boolean }) {
  return (
    <div className={typing ? undefined : "sr-only"}>
      <Bubble variant="muted">
        <BubbleContent>
          <TypingIndicator active={typing} label="Stubby is typing" />
        </BubbleContent>
      </Bubble>
    </div>
  )
}`,
  related: ["bubble", "message", "spinner", "prompt-input"]
} satisfies ComponentDoc;
