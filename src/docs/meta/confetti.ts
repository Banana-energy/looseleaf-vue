// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "confetti" as const,
  title: "Confetti" as const,
  category: "Interactive" as const,
  description: "Paper confetti for the small victories. Strips, punched dots, stars, triangles, streamers and torn scraps, each a tiny drawing from the ink engine, thrown from a click, a state change or a function call. Nothing moves with reduced motion." as const,
  status: "new" as const,
  parts: [{
    name: "ConfettiTrigger" as const,
    description: "A button (or, with asChild, any element) that throws confetti from itself when clicked. It renders no layer of its own: the pieces fly in a click-through layer on the page." as const,
    props: [{
      name: "asChild" as const,
      type: "boolean" as const,
      description: "Wrap your own element (a Button) instead of rendering a <button>." as const
    }, {
      name: "…ConfettiOptions" as const,
      type: "count, spread, angle, velocity, gravity, drift, duration, colors, shapes, scalar, seed, origin, onDone" as const,
      description: "See the options below. The origin defaults to the trigger." as const
    }]
  }, {
    name: "Confetti" as const,
    description: "A decorative layer that fills its positioned parent and throws inside it: when `active` turns true, whenever `burstKey` changes, or from `apiRef.burst()`. Use it to keep a burst inside a card or a dialog." as const,
    props: [{
      name: "active" as const,
      type: "boolean" as const,
      description: "Throw a burst when it turns true (or is true on mount)." as const
    }, {
      name: "burstKey" as const,
      type: "number | string" as const,
      description: "Throw again whenever it changes: bump a counter." as const
    }, {
      name: "apiRef" as const,
      type: "Ref<{ burst(options?) => () => void }>" as const,
      description: "Imperative handle." as const
    }, {
      name: "count" as const,
      type: "number" as const,
      default: "70" as const,
      description: "Pieces, at most 400." as const
    }, {
      name: "spread / angle" as const,
      type: "number" as const,
      default: "70 / 90" as const,
      description: "The cone in degrees and its direction (90 up, 0 right, spread 360 for a ring)." as const
    }, {
      name: "velocity / gravity / drift" as const,
      type: "number" as const,
      default: "1100 / 520 / 0" as const,
      description: "Launch speed of the fastest piece (px/s), fall (px/s²) and wind (px/s²)." as const
    }, {
      name: "duration" as const,
      type: "number" as const,
      default: "2600" as const,
      description: "ms until the last piece has faded." as const
    }, {
      name: "colors / shapes" as const,
      type: "ConfettiColor[] / ConfettiKind[]" as const,
      description: "Stationery accents (tomato … bubblegum) and shapes (strip, dot, star, triangle, curl, scrap)." as const
    }, {
      name: "scalar" as const,
      type: "number" as const,
      default: "1" as const,
      description: "Size multiplier." as const
    }, {
      name: "seed" as const,
      type: "number" as const,
      description: "Same seed, same burst. Default: a counter, so every burst is different." as const
    }, {
      name: "onDone" as const,
      type: "() => void" as const,
      description: "Called once when the last piece has landed, or when the burst was cleared. A Confetti layer forgets a burst the moment it is over." as const
    }]
  }],
  a11y: ["Confetti is decoration: the pieces are aria-hidden, never focusable, and click-through (pointer-events: none). Say what happened in words too (a toast, a status line): confetti alone tells a screen reader nothing.", "Reduced motion (the OS setting, data-motion=\"reduced\", or --ll-motion 0) throws nothing at all: no pieces, no layer.", "Pieces are removed as soon as they have faded, and the layer with them; a burst can be canceled with the function it returns, and unmounting a Confetti layer clears its pieces.", "Flight runs on the Web Animations API (off the main thread). Browsers without it simply show nothing."],
  usage: `import { ConfettiTrigger, confetti } from "@/components/ui/confetti"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <ConfettiTrigger asChild>
      <Button>Celebrate</Button>
    </ConfettiTrigger>
  )
}

export function FromAHandler() {
  return <Button onClick={(event) => confetti({ origin: event.currentTarget, count: 120 })}>Celebrate</Button>
}`,
  related: ["sticker", "reveal", "boil", "tear-off"]
} satisfies ComponentDoc;
