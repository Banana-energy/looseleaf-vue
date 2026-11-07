// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "typewriter" as const,
  title: "Typewriter" as const,
  category: "Typography" as const,
  description: "Text that types itself in the typewriter face, with an inked caret. Keys land at uneven speeds and hold at commas and periods; several phrases can go one under the other or be typed, held and backspaced in turn." as const,
  status: "new" as const,
  parts: [{
    name: "Typewriter" as const,
    description: "An inline element. The animation is aria-hidden; the whole text sits in the accessibility tree once, in a polite live region that only changes when you change `text`. Without JavaScript, or with reduced motion, the finished text is simply there." as const,
    props: [{
      name: "text" as const,
      type: "string | string[]" as const,
      required: true,
      description: "What to type. An array is several phrases." as const
    }, {
      name: "mode" as const,
      type: '"lines" | "cycle"' as const,
      default: '"lines"' as const,
      description: "lines: each phrase on its own line. cycle: type a phrase, hold it, backspace it, type the next (a loop or a rotating word)." as const
    }, {
      name: "speed" as const,
      type: "number" as const,
      default: "22" as const,
      description: "Characters per second, as an average: every key has its own delay." as const
    }, {
      name: "delay / pause" as const,
      type: "number" as const,
      default: "300 / 1400" as const,
      description: "ms before it starts, and ms to hold a finished phrase." as const
    }, {
      name: "loop" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Start again from an empty page when done. The live region is switched off while it loops, so it is never read twice." as const
    }, {
      name: "cursor" as const,
      type: '"bar" | "block" | "underscore" | false' as const,
      default: '"bar"' as const,
      description: "The caret, drawn with the pen. Solid while typing, blinking when it rests (not blinking with reduced motion)." as const
    }, {
      name: "reserve" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Keep the room of the finished text (the longest phrase of a cycle) from the first frame, so nothing around it moves while it types. The element becomes an `inline-block` (or the `display` your className sets) with an invisible copy of the finished text in flow and the typed text laid over it. Off, it is an inline element that grows as it types and can sit inside a sentence." as const
    }, {
      name: "startOnView" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Wait until it is at least 40 % on screen." as const
    }, {
      name: "onDone" as const,
      type: "() => void" as const,
      description: "Called when the last character is on the page (never when looping)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the caret's hand and the jitter of the words." as const
    }]
  }],
  a11y: ["Screen readers get the whole text once, from a visually hidden polite live region; they never hear it letter by letter. The typed copy is aria-hidden. Changing `text` is announced once.", "In cycle mode and when looping the live region is off, so a rotating word is not announced on every turn; the phrases are all available as one sentence in reading order.", "Reduced motion (the OS setting, data-motion=\"reduced\", or an InkProvider with motion=\"reduced\"): no typing, no blinking; the finished text (the last phrase of a cycle) is shown.", "Without JavaScript the server has already sent the whole text in the page.", "Layout: by default the element grows as it types, so anything below it moves. Pass `reserve` to hold the room of the finished text from the first frame (an invisible copy in flow, aria-hidden, that no one can select), or give a block of several lines a `min-h-*`. It is made for a headline or a few short lines: every key press re-renders the words typed so far, so do not feed it pages of text.", "One key press is one character as a person sees it: an emoji, a flag or a letter with its accent is typed and erased whole, never in halves.", "Words sit up to a pixel off the baseline and a shade lighter, as plain inline text (a word with a layer of its own was cut at its advance by WebKit, which clipped the tail of a hand font's last glyph); calm density and reduced motion turn the jitter off through --ll-jitter-k."],
  usage: `import { Typewriter } from "@/components/ui/typewriter"

export function Example() {
  return <Typewriter text="Every screen, drawn by hand." className="text-3xl" />
}`,
  related: ["marquee", "reveal", "boil", "label"]
} satisfies ComponentDoc;
