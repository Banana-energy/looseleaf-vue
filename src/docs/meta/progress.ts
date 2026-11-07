// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "progress" as const,
  title: "Progress" as const,
  category: "Feedback" as const,
  description: "A bar somebody hatched in pencil and is coloring in with a marker. The marker is one full-length pass revealed by a CSS clip up to the value, so changing the value is a transition, not a redraw. Without a value it becomes a scribble sliding across. Reka UI Progress underneath." as const,
  status: "stable" as const,
  upstream: "progress" as const,
  parts: [{
    name: "Progress" as const,
    description: "Reka UI Progress.Root (role=progressbar with aria-valuenow / min / max, data-state loading | complete | indeterminate) and its Indicator, both drawn hosts. The Indicator (data-slot=\"progress-indicator\") is stretched over the whole bar and clipped to the value." as const,
    props: [{
      name: "value" as const,
      type: "number | null" as const,
      description: "How far along, out of `max`; clamped to 0..max (an upload that reports 100.4 is a full bar; Reka UI alone would call that invalid and start the waiting animation). Leave it out, pass null or NaN for an indeterminate bar (no aria-valuenow)." as const
    }, {
      name: "max" as const,
      type: "number" as const,
      default: "100" as const,
      description: "The scale: value 3 of max 5 is 60 %." as const
    }, {
      name: "size" as const,
      type: '"sm" | "default" | "lg"' as const,
      default: '"default"' as const,
      description: "12, 16 or 20 px tall. Any h-* class in `className` wins; the drawing follows the box." as const
    }, {
      name: "tone" as const,
      type: '"marker" | "hi" | "green" | "blue"' as const,
      default: '"marker"' as const,
      description: "The ink: terracotta marker, highlighter, grass marker or sky marker." as const
    }, {
      name: "getValueLabel" as const,
      type: "(value: number, max: number) => string" as const,
      description: "Reka UI: builds aria-valuetext. Or pass aria-valuetext yourself." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same bar. Default: derived from useId()." as const
    }]
  }],
  a11y: ["role=\"progressbar\" with aria-valuemin, aria-valuemax and aria-valuenow (omitted while indeterminate); Reka UI also sets data-state, data-value and data-max. Give it a name with aria-label or aria-labelledby; use aria-valuetext for \"Step 2 of 5\" style text.", "It is a status display, not a control: not focusable. Put the percentage in text next to it if people need the number; screen readers get it from aria-valuenow.", "The drawing is aria-hidden and pointer-events: none. The hatch shows how much is left even when the marker's hue is hard to tell; in Windows high contrast the ink is replaced by a real border and a Highlight fill.", "Reduced motion (the OS setting or data-motion=\"reduced\"): value changes jump instead of gliding and the indeterminate scribble stops, sitting still in the middle of the bar.", "Right-to-left: the marker grows from the right and the indeterminate window slides right to left."],
  usage: `import { Progress } from "@/components/ui/progress"

export function Example() {
  return <Progress value={66} className="w-[60%]" aria-label="Chapter progress" />
}`,
  related: ["slider", "spinner", "skeleton", "field"]
} satisfies ComponentDoc;
