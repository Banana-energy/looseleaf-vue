// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "reveal" as const,
  title: "Reveal" as const,
  category: "Interactive" as const,
  description: "Holds its children back until they scroll into view, then draws them on: a wipe along the line, wet ink drying, a sheet dropped on the desk, a stamp, a toss. Direct children can arrive one after another. Without script, and with reduced motion, everything is simply there." as const,
  status: "new" as const,
  parts: [{
    name: "Reveal" as const,
    description: "A wrapper element. It arms itself after mounting (the server sends everything visible), hides its content with opacity, and plays one of the theme's own keyframes when an IntersectionObserver says enough of it is on screen. It leaves data-state=\"hidden|visible\" on itself, so anything drawn inside can key on it with group-data-[state=visible]/reveal:…" as const,
    props: [{
      name: "effect" as const,
      type: '"wipe" | "soak" | "drop" | "pop" | "toss"' as const,
      default: '"wipe"' as const,
      description: "wipe draws it on along the line (ll-wipe), soak dries it like wet ink (ll-soak), drop lays a sheet down (ll-drop), pop stamps it (ll-pop), toss throws it in (ll-toss)." as const
    }, {
      name: "from" as const,
      type: '"start" | "end"' as const,
      default: '"start"' as const,
      description: "Which end a wipe starts from. The wipe follows the page direction by itself." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      default: "0" as const,
      description: "Seconds to wait once it is in view." as const
    }, {
      name: "stagger" as const,
      type: "number" as const,
      description: "Seconds between direct children (the first 16): they arrive one after another instead of as one block." as const
    }, {
      name: "threshold" as const,
      type: "number" as const,
      default: "0.25" as const,
      description: "How much of it must be on screen, 0 to 1." as const
    }, {
      name: "once" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Play once, or every time it scrolls back into view." as const
    }, {
      name: "onReveal" as const,
      type: "() => void" as const,
      description: "Called each time it is revealed." as const
    }, {
      name: "nib / nibColor" as const,
      type: "boolean / PaintKey" as const,
      default: "false / \"tomato\"" as const,
      description: "A hand-drawn marker tip rides the leading edge of a wipe, as if it were writing the content (wipe without stagger only; a list, `as=\"ul\"` or `\"ol\"`, has nowhere to put the tip and ignores it). The content is wrapped in one block (a span on a p or a span)." as const
    }, {
      name: "as" as const,
      type: '"div" | "section" | "article" | "aside" | "figure" | "ul" | "ol" | "li" | "span" | "p"' as const,
      default: '"div"' as const,
      description: "The element to render." as const
    }]
  }],
  a11y: ["Hiding is opacity only: the content stays in the accessibility tree and in the tab order the whole time, so it is never withheld from assistive technology or from find-in-page.", "The server sends the content visible and unarmed; only after mounting (and only if motion is allowed and IntersectionObserver exists) does it hide and wait. Without script, in old browsers, and with reduced motion (the OS setting, data-motion=\"reduced\" or an InkProvider with motion=\"reduced\") nothing is ever hidden.", "Each effect uses one of the theme's --ll-dur-* tokens, so a reduced-motion context collapses the duration to zero.", "Do not wrap content people need at once (above the fold, error messages, focus targets). It is for things that arrive with a flourish as you read down a page."],
  usage: `import { Reveal } from "@/components/ui/reveal"

export function Example() {
  return (
    <Reveal effect="soak" stagger={0.15}>
      <h2>Three things</h2>
      <p>One.</p>
      <p>Two.</p>
    </Reveal>
  )
}`,
  related: ["boil", "typewriter", "marquee", "confetti"]
} satisfies ComponentDoc;
