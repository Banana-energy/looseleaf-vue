// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "arrow" as const,
  title: "Arrow" as const,
  category: "Marks" as const,
  description: "A hand-drawn arrow that points where you tell it: one of eight directions inside its own box, or straight at another element on the page. Straight, curved, or with a loop-the-loop, five heads, and an optional label." as const,
  status: "new" as const,
  parts: [{
    name: "Arrow" as const,
    description: "A <span> that fills its box (`className` sizes it, default 80 x 40) with the drawing. Text inside becomes a label, real text placed outside the tail. The svg is aria-hidden and never takes a click." as const,
    props: [{
      name: "direction" as const,
      type: '"right" | "left" | "up" | "down" | "up-right" | "up-left" | "down-right" | "down-left"' as const,
      default: '"right"' as const,
      description: "Which way it points, inside its own box." as const
    }, {
      name: "curve" as const,
      type: '"straight" | "curved" | "curl"' as const,
      default: '"straight"' as const,
      description: "A straight shaft, one lazy arc, or an arc with a loop-the-loop." as const
    }, {
      name: "head" as const,
      type: '"v" | "two" | "open" | "solid" | "none"' as const,
      default: '"v"' as const,
      description: "The arrowhead: two strokes joined, two loose strokes, an open V, a filled triangle, or none." as const
    }, {
      name: "tone" as const,
      type: '"ink" | "blue" | "red" | "green" | "pencil" | "marker" | "orange"' as const,
      default: '"ink"' as const,
      description: "The pen. Blue felt is the reserved \"you\" ink." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine-liner, felt tip or brush." as const
    }, {
      name: "bend" as const,
      type: '"up" | "down"' as const,
      default: '"up"' as const,
      description: "Which way a curved shaft bulges: toward the top (the left for a vertical arrow) or the bottom (the right)." as const
    }, {
      name: "pointAt" as const,
      type: "RefObject<Element> | Element | string" as const,
      description: "Aim at another element (a ref, an element or a CSS selector). The arrow leaves the middle of its own box and stops `gap` px short of the target, wherever that is; it follows layout changes." as const
    }, {
      name: "gap" as const,
      type: "number" as const,
      default: "6" as const,
      description: "With pointAt, how far short of the target the head stops, px." as const
    }, {
      name: "mirror" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Flip horizontal directions in a right-to-left page, so \"next\" keeps meaning onwards." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Draw the arrow on, shaft first, the first time it scrolls into view." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide it." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds before the drawing starts." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }],
  a11y: ["Decorative: the drawing is aria-hidden and pointer-events-none. If the arrow says something (\"start here\"), put it in text; a label given as children is real text.", "It never affects layout: the box is yours, the drawing may spill 14 px beyond it (or as far as the target with pointAt).", "Windows high contrast hides the drawing, like every overlay ink; the label stays.", "Reduced motion zeroes the draw-on."],
  usage: `import { Arrow } from "@/components/ui/arrow"

export function Example() {
  return (
    <div className="flex items-center">
      <span>Start here</span>
      <Arrow direction="right" curve="curved" tone="blue" />
    </div>
  )
}`,
  related: ["callout", "annotate", "circled", "bracket"]
} satisfies ComponentDoc;
