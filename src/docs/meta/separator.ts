// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "separator" as const,
  title: "Separator" as const,
  category: "Layout" as const,
  description: "A rule that visually or semantically separates content, drawn by hand: pencil, ledger dashes, a squiggle, dots, a strip of tape, a running stitch or a torn edge of paper. Horizontal or vertical, with an optional centered label." as const,
  status: "stable" as const,
  upstream: "separator" as const,
  parts: [{
    name: "Separator" as const,
    description: "A Reka UI Separator (asChild is not offered: the element is the drawing's host). Without children it is a 1 px hairline whose drawing is centered on it and spills up to 12 px across it (a hairline host, so layout is exactly shadcn's). Along its length the host clips (`overflow-x: clip` for a horizontal rule, `overflow-y: clip` for a vertical one), so a rule that ends at the window edge never scrolls the page sideways. With children it becomes a labeled divider: two rules around your text." as const,
    props: [{
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "Horizontal is h-px w-full; vertical is w-px h-full (give it a height in a flex row, or self-stretch)." as const
    }, {
      name: "decorative" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "As Reka UI: decorative rules are role=none and invisible to assistive tech; set false for a real thematic break (role=separator)." as const
    }, {
      name: "variant" as const,
      type: '"pencil" | "dashed" | "wavy" | "dotted" | "tape" | "stitched" | "torn"' as const,
      default: '"pencil"' as const,
      description: "pencil = a graphite line drawn against a ruler; dashed = ledger dashes; wavy = a felt-tip squiggle; dotted = ink dots; tape = a strip of kraft tape stuck across; stitched = a running stitch in marker thread; torn = a strip of paper torn along both edges. Calm density draws tape, stitched and torn as the pencil rule." as const
    }, {
      name: "children" as const,
      type: "VueNode" as const,
      description: 'Puts a label in the middle ("or", "continue with"): two rules of the same variant either side, the text in the hand font. The label is real text, read by screen readers when the separator is decorative.' as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same rule. Default: derived from useId()." as const
    }]
  }],
  a11y: ["Decorative by default (role=none), like shadcn: use decorative={false} only for a real thematic break, and give a labeled non-decorative separator an aria-label, since children of role=separator are presentational.", "A vertical separator that is not decorative gets aria-orientation=vertical from Reka UI.", "The drawing is aria-hidden and pointer-events: none. Until it exists, and in Windows high contrast, the rule is a plain 1 px line.", "Tape, stitched and torn are decoration; nothing about the meaning of a divider ever depends on them."],
  usage: `import { Separator } from "@/components/ui/separator"

export function Example() {
  return (
    <div className="w-72">
      <h4 className="font-bold">Field notes</h4>
      <p className="text-sm text-muted-foreground">Sketches and half-thoughts.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" variant="wavy" />
        <span>Docs</span>
        <Separator orientation="vertical" variant="wavy" />
        <span>Source</span>
      </div>
      <Separator className="my-4" variant="stitched">or</Separator>
    </div>
  )
}`,
  related: ["card", "item", "button-group", "paper", "tape"]
} satisfies ComponentDoc;
