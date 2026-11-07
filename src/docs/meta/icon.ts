// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "../types";
export default {
  slug: "icon" as const,
  title: "Icon" as const,
  category: "Icons" as const,
  description: "Every glyph in Looseleaf is a hand-drawn felt-tip icon, redrawn at each size so a 16 px chevron is a chevron and not a shrunken 24 px one. It takes lucide names, so a shadcn snippet keeps working." as const,
  status: "new" as const,
  parts: [{
    name: "Icon" as const,
    description: "An intrinsic ink svg: no measuring, fully server-rendered, currentColor ink." as const,
    props: [{
      name: "name" as const,
      type: "IconName | string" as const,
      required: true,
      description: "A lucide 1.x name (`chevron-down`), an older one (`trash-2`, `alert-triangle`, `Loader2`) or a PascalCase export (`ChevronDownIcon`). Unknown names draw a boxed question mark." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      default: "16, or the `size-N` class" as const,
      description: "Pixels. Picks the drawing: 12 and below `micro` (when the icon has one), 14 to 19 the 16 px redraw, 20 to 40 the 24 px master, 41 and up the master plus its extras. Without it the tier follows a `size-N` class (or, inside a `xs` / `icon-xs` Button, the 12 px tier the Button hands down), so the shadcn `[&_svg:not([class*=size-])]:size-4` rule and an explicit `size-6` both pick the right drawing." as const
    }, {
      name: "tone" as const,
      type: '"ui" | "doodle"' as const,
      default: '"ui"' as const,
      description: "`ui` is ink only. `doodle` also shows the icon's accent wash (a highlighter behind the warning triangle, a pink head on the user)." as const
    }, {
      name: "accent" as const,
      type: "Accent | \"hi\" | \"kraft\"" as const,
      description: "Color of the wash in doodle tone; defaults to the icon's own." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "The hand: the same icon with another seed is drawn a little differently. Default: the icon name, so identical icons match." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "Accessible name. Without it the icon is decorative (`aria-hidden`); with it, `role=\"img\"` and `aria-label`." as const
    }, {
      name: "weight" as const,
      type: "number" as const,
      default: "1.12 (ui tone, up to 20 px), else 1" as const,
      description: "Pen weight multiplier. Small ui icons are drawn a hair heavier than the engine's floor so they hold their own beside a bold Kevin Sans label; pass `weight={1}` for the plain pen." as const
    }, {
      name: "flip" as const,
      type: 'boolean | "x" | "y"' as const,
      description: "Mirror an icon whose art is marked symmetric. Direction glyphs (chevrons, arrows, panel toggles) flip themselves in RTL through `rtl:-scale-x-100`; nothing with a baked flourish is ever mirrored." as const
    }]
  }],
  a11y: ["Decorative by default: `aria-hidden=\"true\"` and `focusable=\"false\"`. Pass `label` when the icon is the only content of a control, or name the control instead.", "Ink is `currentColor`, so text color utilities and forced-colors mode work; icons are kept in forced-colors mode.", "Status icons differ by silhouette, not only by color: a triangle warns, an octagon stops, a ring informs, an arc waits."],
  usage: `import { Icon } from "@/components/ui/icon"

export function Example() {
  return (
    <button className="inline-flex items-center gap-2">
      <Icon name="trash" />
      Delete
    </button>
  )
}`,
  related: ["doodle", "sticker", "button"]
} satisfies ComponentDoc;
