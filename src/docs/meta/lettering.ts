// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "lettering" as const,
  title: "Lettering" as const,
  category: "Typography" as const,
  description: "Display titles in the script font with a riso print look: ink with a second color printed a hair off register. Pure CSS text-shadow, so the words are real text at any size. No gradients, no filters." as const,
  status: "new" as const,
  parts: [{
    name: "Lettering" as const,
    description: "A heading (any element with `as`) in the script role, bold, with `ll-riso`. The offset color is a token (`--ll-riso`) set by `tone`; `calm` density and the misregistration knob bring it to zero." as const,
    props: [{
      name: "as" as const,
      type: "Vue.ElementType" as const,
      default: '"h2"' as const,
      description: "The element: a heading level, or p / span for lettering that is not a heading." as const
    }, {
      name: "size" as const,
      type: '"sm" | "md" | "lg" | "xl" | "hero"' as const,
      default: '"lg"' as const,
      description: "30, 48, 60, 72 to 96 (responsive), and 72 to 128 px (responsive)." as const
    }, {
      name: "tone" as const,
      type: '"marker" | "tomato" | "tangerine" | "lemon" | "grass" | "teal" | "sky" | "grape" | "bubblegum"' as const,
      default: '"marker"' as const,
      description: "The second color of the print." as const
    }, {
      name: "duotone" as const,
      type: "same as tone" as const,
      description: "A third pass in another accent, printed to the other side." as const
    }, {
      name: "wobble" as const,
      type: "number" as const,
      default: "0" as const,
      description: "Per-word baseline jitter, 0 (typeset) to 2 (hurried). Words stay real, selectable text." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the wobble." as const
    }]
  }],
  a11y: ["A real heading (or the element you choose): headings keep their level and outline. The offset color is decoration; the ink text has 14:1 contrast on paper.", "Use one Lettering as the page's h1 at most; for repeated display text prefer p or span.", "The riso offset is a text-shadow, so it scales with the text, follows the density knob (calm = none) and disappears in Windows high contrast."],
  usage: `import { Lettering } from "@/components/ui/lettering"

export function Example() {
  return (
    <Lettering as="h1" size="xl" tone="teal">
      Paper Club
    </Lettering>
  )
}`,
  related: ["typography", "signature", "handwritten", "quote"]
} satisfies ComponentDoc;
