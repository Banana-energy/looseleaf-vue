// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "asterisk" as const,
  title: "Asterisk" as const,
  category: "Marks" as const,
  description: "Hand-drawn footnote marks: an asterisk, a star, a dagger or a double dagger, in red pencil, sized like a superscript after the word they belong to. Give it a label and an href and it links to the footnote." as const,
  status: "new" as const,
  parts: [{
    name: "Asterisk" as const,
    description: "A <span> holding the drawn mark. Children come first and the mark follows them: <Asterisk>fine print</Asterisk>. The glyph is intrinsic art (kept in Windows high contrast) drawn once per seed." as const,
    props: [{
      name: "mark" as const,
      type: '"asterisk" | "star" | "dagger" | "double-dagger"' as const,
      default: '"asterisk"' as const,
      description: "Which mark." as const
    }, {
      name: "tone" as const,
      type: '"red" | "ink" | "blue" | "pencil"' as const,
      default: '"red"' as const,
      description: "The pen color of the mark." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "The accessible name (\"footnote 1\"). Without it the mark is decoration and hidden from assistive technology." as const
    }, {
      name: "href" as const,
      type: "string" as const,
      description: "Turns the mark into a link to the footnote. Its accessible name is `label`, or \"footnote\"." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the strokes." as const
    }]
  }],
  a11y: ["Decorative by default (aria-hidden). With `label` it is role=\"img\" with that name; with `label` and `href` it is a real link (its hit area is 24 px or more).", "A footnote mark points at a footnote: keep the footnote in text, and link the two (`href=\"#fn1\"` here and an id on the note).", "Sized in em, so it follows the text it sits in. Kept in Windows high contrast as a drawn glyph."],
  usage: `import { Asterisk } from "@/components/ui/asterisk"

export function Example() {
  return (
    <p>
      Free shipping<Asterisk label="footnote 1" href="#fn1" />
    </p>
  )
}`,
  related: ["label", "annotate", "tally"]
} satisfies ComponentDoc;
