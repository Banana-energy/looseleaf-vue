// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "signature" as const,
  title: "Signature" as const,
  category: "Marks" as const,
  description: "A name signed in the script font with the pen's flourish under it: a swoosh with a loop that flicks up past the last letter. The name is ordinary text; the flourish is a drawing that can write itself on." as const,
  status: "new" as const,
  parts: [{
    name: "Signature" as const,
    description: "An inline-block <span> holding the name (in `data-slot=\"signature-name\"`) and the aria-hidden flourish. Size the name with `size` or any text class." as const,
    props: [{
      name: "flourish" as const,
      type: '"swoosh" | "underline" | "none"' as const,
      default: '"swoosh"' as const,
      description: "The pen's tail: a swoosh with a loop and a crossing stroke, a flourished underline, or nothing." as const
    }, {
      name: "size" as const,
      type: '"sm" | "md" | "lg"' as const,
      default: '"md"' as const,
      description: "The name at 28, 44 or 64 px. Override with a text-* class." as const
    }, {
      name: "tone" as const,
      type: '"blue" | "ink" | "red" | "green" | "pencil" | "marker" | "orange"' as const,
      default: '"blue"' as const,
      description: "The pen of the flourish (and the color of the name for blue and ink)." as const
    }, {
      name: "weight" as const,
      type: '"fine" | "regular" | "brush"' as const,
      default: '"regular"' as const,
      description: "Fine-liner, felt tip or brush." as const
    }, {
      name: "animate" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Sign it in the first time it scrolls into view: the name is written left to right, then the flourish." as const
    }, {
      name: "show" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show or hide the flourish (the name always stays)." as const
    }, {
      name: "delay" as const,
      type: "number" as const,
      description: "Milliseconds before signing starts." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }],
  a11y: ["The name is real text in the page, read by a screen reader; the flourish is aria-hidden. A signature is not proof of anything: say who signed in text if it matters.", "The name text is not clipped by the flourish; the drawing spills 20 px beyond its box and never takes a click.", "Reduced motion zeroes the signing animation."],
  usage: `import { Signature } from "@/components/ui/signature"

export function Example() {
  return <Signature>Ada Lovelace</Signature>
}`,
  related: ["lettering", "handwritten", "quote", "underline"]
} satisfies ComponentDoc;
