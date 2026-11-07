// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "badge" as const,
  title: "Badge" as const,
  category: "Data display" as const,
  description: "A small mark that sits next to a word: a marker stamp, a highlighter swipe, a red-hatched warning, a circled word, and a count that can be written as tally marks. Same variants and asChild as shadcn." as const,
  status: "stable" as const,
  upstream: "badge" as const,
  parts: [{
    name: "Badge" as const,
    description: "A span (or, with asChild, the element you hand it) with a hand-drawn layer behind its label. The label is DOM text in the hand font; the drawing is measured from the element and centered on it. Unlike shadcn's it has no overflow-hidden (the drawing bleeds a few px outside the box, and clipping would cut it), so to truncate a long label put a truncating span inside it. It draws no aria-invalid state. Each badge is one small ink host (about 2 to 6 KB of svg, drawn at 0.3 to 0.8 ms): fine for a screenful, and for a status column of a few hundred rows if you page it; the ghost variant draws nothing until it is a hovered link." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"' as const,
      default: '"default"' as const,
      description: "default = a terracotta marker blot that misses a felt-tip pill; secondary = one highlighter swipe; destructive = red-pencil hatch in a red pill (a pattern, not only a hue); outline = the label circled once; ghost and link draw nothing until they are hovered as links." as const
    }, {
      name: "size" as const,
      type: '"sm" | "default" | "lg"' as const,
      default: '"default"' as const,
      description: "20, 24 and 28 px high. sm sets its label at 13 px: keep it for dense tables, use default anywhere a badge stands alone." as const
    }, {
      name: "tone" as const,
      type: '"marker" | "hi" | "tangerine" | "lemon" | "grass" | "teal" | "sky" | "bubblegum"' as const,
      default: '"marker"' as const,
      description: "The stationery accent of the default variant's fill. Tomato and grape are left out on purpose: ink on them is 3.95:1." as const
    }, {
      name: "count" as const,
      type: "number" as const,
      description: "A number shown when there are no children, in tabular figures and a min-width, so a column of counts lines up." as const
    }, {
      name: "max" as const,
      type: "number" as const,
      default: "99" as const,
      description: "Largest count written in digits; a bigger one shows as `${max}+`." as const
    }, {
      name: "tally" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Write `count` (1 to 20) as tally marks instead of digits: four uprights and a slash per five. The number stays in the DOM, visually hidden, so screen readers still read it." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render the child element (a link, a button) with the badge's classes and drawing, drawn inside it (Reka UI Slot). A badge that is a link or has an onClick also gets a hover layer. count and tally are ignored." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same badge, also across remounts. Default: derived from useId()." as const
    }]
  }, {
    name: "badgeVariants" as const,
    description: "The cva function behind Badge, for styling another element like a badge. Layout and typography classes only: the drawing comes from Badge." as const,
    props: [{
      name: "variant" as const,
      type: "BadgeVariant" as const,
      default: '"default"' as const,
      description: "Same values as Badge." as const
    }, {
      name: "size" as const,
      type: "BadgeSize" as const,
      default: '"default"' as const,
      description: "Same values as Badge." as const
    }, {
      name: "className" as const,
      type: "string" as const,
      description: "Merged last." as const
    }]
  }],
  a11y: ['A badge is plain inline text in a span: it is read in reading order with what is around it. Give a status badge words ("Beta"), never only a color or a mark.', 'A tally is decoration for the eye; the number is real text in the DOM (visually hidden), so `<Badge tally count={7}>` reads as "7".', "Ink on the marker fill is 4.6:1, on the highlighter 12:1; destructive is told apart by its hatch and its word as well as its red.", "As a link (asChild), the badge keeps the link's role and href, takes keyboard focus and draws the blue felt ring; hover adds a drop-line, a swipe or an underline and is off on touch screens.", "Windows high contrast replaces the drawing with a real 1 px outline. Reduced motion removes the hover tilt and the fill nudge."],
  usage: `import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"

export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>New</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="destructive">Overdue</Badge>
      <Badge variant="outline">v2.4</Badge>
      <Badge variant="secondary">
        <Icon name="badge-check" />
        Verified
      </Badge>
      <Badge tally count={7} variant="outline" />
      <Badge asChild variant="link">
        <a href="/changelog">Changelog</a>
      </Badge>
    </div>
  )
}`,
  related: ["button", "sticker", "stamp", "tabs", "table"]
} satisfies ComponentDoc;
