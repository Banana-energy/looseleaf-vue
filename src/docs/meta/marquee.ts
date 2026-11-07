// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "marquee" as const,
  title: "Marquee" as const,
  category: "Interactive" as const,
  description: "A ticker written on a strip of washi tape. The text runs along it, fades at the ends, stops while you point at it or focus inside it, and has a pause button. With reduced motion it is a still strip with the text centered." as const,
  status: "new" as const,
  parts: [{
    name: "Marquee" as const,
    description: "The band: a strip of the engine's tape drawn to the width of the box, with the moving text in a clipped, edge-faded viewport. It repeats its content just enough times to fill the band and loops seamlessly with a CSS animation (keyframes come with the component)." as const,
    props: [{
      name: "speed" as const,
      type: "number" as const,
      default: "60" as const,
      description: "px per second. A short text is never slower than a 4 second loop." as const
    }, {
      name: "direction" as const,
      type: '"start" | "end"' as const,
      default: '"start"' as const,
      description: "Toward the start of the line (like a news ticker, mirrored in right-to-left) or away from it." as const
    }, {
      name: "tape / color" as const,
      type: "TapeKind / Accent" as const,
      default: '"washi-stripes"' as const,
      description: "masking, washi-dots, washi-stripes, washi-zigzag, washi-gingham, kraft or clear; color is the print of a washi. `washi-dots` has white dots as big as small letters: keep it for short, large words and put customer names on `washi-gingham`, `washi-stripes` or `masking`." as const
    }, {
      name: "paused / defaultPaused / onPausedChange" as const,
      type: "boolean" as const,
      description: "Controlled or uncontrolled pause. Hover and keyboard focus pause it as well." as const
    }, {
      name: "controls" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The pause button. Leave it on for any ticker that runs more than five seconds." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      default: '"Ticker"' as const,
      description: "Accessible name (role=\"marquee\")." as const
    }]
  }, {
    name: "MarqueeItem" as const,
    description: "One phrase, followed by a small hand-drawn star. Pass `separator` for your own glyph, or `false` for none." as const,
    props: [{
      name: "separator" as const,
      type: "VueNode | false" as const,
      description: "What comes after the phrase." as const
    }]
  }, {
    name: "MarqueeControl" as const,
    description: "The pause button, aria-pressed while paused, drawn as a ringed disc with two bars or a triangle. Marquee includes one; compose it yourself only to place it elsewhere." as const,
    props: []
  }],
  a11y: ["Only the first copy of the text is exposed; every repeat is aria-hidden and inert, so a screen reader reads the ticker once and Tab does not visit links twice.", "It pauses on hover and while focus is inside it (WCAG 2.2.2), and the pause button has aria-pressed. The button is on by default; do not remove it for a ticker that moves for more than five seconds.", "Reduced motion (the OS setting or data-motion=\"reduced\"): the animation is off, the repeats are hidden and the one copy is centered on the tape.", "Put the words that matter in the first copy in the DOM order you want them read; the ticker itself is role=\"marquee\", which assistive technology treats as a non-live region.", "Ink on the default orange washi is 7:1 and on the dotted and gingham tapes above 6:1. The text is 24 px semibold script with a paper halo (a CSS text-shadow), so it holds on patterned tape; keep phrases short, and use `masking` when the words are long.", "A short phrase on a wide screen is repeated as often as it takes to fill the band (at most 48 copies, all but the first hidden and inert)."],
  usage: `import { Marquee, MarqueeItem } from "@/components/ui/marquee"

export function Example() {
  return (
    <Marquee label="Shop news">
      <MarqueeItem>Fresh bread at seven</MarqueeItem>
      <MarqueeItem>Open late on Fridays</MarqueeItem>
    </Marquee>
  )
}`,
  related: ["tape", "typewriter", "reveal", "boil"]
} satisfies ComponentDoc;
