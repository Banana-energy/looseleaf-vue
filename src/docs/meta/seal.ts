// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "seal" as const,
  title: "Seal" as const,
  category: "Stickers & doodles" as const,
  description: "Rosettes, scalloped seals, medals, ringed seals with rim lettering and wax seals, drawn like the stickers without the white edge. Use one as a verified mark beside a name, an award on a card, or the stamp of approval on a certificate." as const,
  status: "new" as const,
  parts: [{
    name: "Seal" as const,
    description: "Intrinsic art: an svg whose size is its `size`, complete in server markup, named by its words. Made by the badge generator plus a ringed seal and wax; the pens, the solid fills and the grain are the sticker library's." as const,
    props: [{
      name: "variant" as const,
      type: '"scallop" | "starburst" | "rosette" | "medal" | "shield" | "plate" | "ticket" | "tag" | "ring" | "wax"' as const,
      default: '"scallop"' as const,
      description: "The shape. Rosette and medal hang a ribbon; ring letters its rim; wax is a blob of sealing wax with an impression." as const
    }, {
      name: "text" as const,
      type: "string" as const,
      description: "The words in the middle: about 6 letters at 64 px, 10 at 96 (one or two initials on wax). Capitals are set for you." as const
    }, {
      name: "sub" as const,
      type: "string" as const,
      description: "A smaller second line (from 96 px up; dropped in the small redraw). Leave it off a rosette or a medal: their ribbons hang across that line. A ticket is one line (it has no room for a second and ignores `sub`)." as const
    }, {
      name: "mark" as const,
      type: '"check" | "star"' as const,
      description: "A hand-drawn glyph instead of the words. It holds at 16 px where letters do not, so it is what a verified badge should use." as const
    }, {
      name: "tone" as const,
      type: "PaintKey" as const,
      default: '"bubblegum" (wax: "red")' as const,
      description: "The color: a stationery accent, or red, ink-you, green for wax. Ink on tomato and grape reaches 3.95:1: large text only." as const
    }, {
      name: "ribbon" as const,
      type: "PaintKey" as const,
      default: '"tomato"' as const,
      description: "Color of the hanging ribbon of a rosette or a medal." as const
    }, {
      name: "ring" as const,
      type: "string" as const,
      description: "Lettering all the way round the rim of a ring seal, repeated to close the circle (from 72 px up)." as const
    }, {
      name: "deco" as const,
      type: '"tick" | "star" | "sparkle" | "swoosh" | "percent"' as const,
      description: "The generator's small decoration (from 96 px up)." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      default: "96" as const,
      description: "Pixels across. Below 80 the small redraw is used." as const
    }, {
      name: "tilt" as const,
      type: 'number | "auto"' as const,
      default: "0" as const,
      description: "Degrees, or a small seeded tilt." as const
    }, {
      name: "tier" as const,
      type: '"lo" | "hi"' as const,
      description: "Drawing quality: the provider's (lo) by default; hi for hero art costs about three times the markup." as const
    }, {
      name: "shadow" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The soft drop shadow (a CSS filter)." as const
    }, {
      name: "label / decorative" as const,
      type: "string / boolean" as const,
      description: 'Accessible name (default: the words, "Verified" for a check, "Award" for a star), or hide it when the text beside it says the same.' as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }],
  a11y: ["The svg is role=\"img\" named by its words; give `label` for the meaning (\"Identity verified\") and `decorative` when the surrounding text already says it.", "A drawn check or star reads at 16 px, but never carry a status by the seal alone: put the word in the DOM next to it or in `label`.", "Windows high contrast keeps the seal (intrinsic art).", "The ring lettering is decoration inside the image; the name is what a screen reader gets."],
  usage: `import { Seal } from "@/components/ui/seal"

export function Example() {
  return (
    <p className="flex items-center gap-1.5">
      Maya Chen <Seal mark="check" tone="sky" size={20} label="Verified" shadow={false} />
    </p>
  )
}`,
  related: ["sticker", "stamp", "badge", "ribbon", "avatar"]
} satisfies ComponentDoc;
