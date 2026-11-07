// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "highlight" as const,
  title: "Highlight" as const,
  category: "Marks" as const,
  description: "A highlighter swipe behind real words. The phrase stays text you can select and copy; the swipe follows it line by line when it wraps, in yellow or any stationery color, and can draw itself on as it scrolls into view." as const,
  status: "new" as const,
  parts: [{
    name: "Highlight" as const,
    description: "A <mark> (or your own element with asChild) that hosts the drawing. One aria-hidden swipe per line of the phrase, measured from the browser's own line boxes, so it starts and ends where the words do." as const,
    props: [{
      name: "tone" as const,
      type: '"yellow" | "pink" | "green" | "blue" | "orange" | "lilac" | "teal"' as const,
      default: '"yellow"' as const,
      description: "The marker. Yellow is the highlighter; the rest are the stationery accents as translucent markers." as const
    }, {
      name: "weight" as const,
      type: '"light" | "regular" | "heavy"' as const,
      default: '"regular"' as const,
      description: "How fat the marker is held." as const
    }, {
      name: "cover" as const,
      type: '"full" | "under"' as const,
      default: '"full"' as const,
      description: "full covers the letters; under runs along the lower half of the line so the words stay clear above it." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Hold the swipe back and draw it on, left to right, the first time the phrase scrolls into view. Reduced motion just shows it." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the swipe. With animate, turning it on plays the draw-on." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds to wait before the first line draws on; each further line follows a beat later." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId(), so server and client draw the same swipe." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render the swipe on your own child element (a link, a strong)." as const
    }]
  }],
  a11y: ["The words are ordinary text: selectable, copyable, found by search, read in order. The swipe is aria-hidden and pointer-events-none, so it never takes a click or a selection.", "It is a <mark>, so assistive technology that announces highlighted text still does. Text on the swipe stays ink on a translucent tint (about 12:1 on the yellow).", "Before the first measure, without JavaScript and in Windows high contrast you get the browser's own <mark> background (system Mark colors in high contrast). With animate the swipe is only drawn once scripts run.", "Reduced motion (or data-motion=\"reduced\") zeroes the draw-on: the swipe simply appears."],
  usage: `import { Highlight } from "@/components/ui/highlight"

export function Example() {
  return (
    <p>
      The good bits get <Highlight>a swipe of yellow</Highlight> so I can find them again.
    </p>
  )
}`,
  related: ["underline", "circled", "annotate", "strike"]
} satisfies ComponentDoc;
