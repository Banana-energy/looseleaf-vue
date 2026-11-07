// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "../types";
export default {
  slug: "sticker" as const,
  title: "Sticker" as const,
  category: "Stickers & doodles" as const,
  description: "Die-cut vinyl stickers: the art with a white border, a cut line, a soft shadow and, if you like, a peeled corner. Status badges (done, sale) are generated; the rest are drawn by hand." as const,
  status: "new" as const,
  parts: [{
    name: "Sticker" as const,
    description: "An intrinsic ink svg. The border is a fat round-join stroke of the silhouette, defined once and reused; the shadow is a CSS filter." as const,
    props: [{
      name: "name" as const,
      type: "StickerName | string" as const,
      required: true,
      description: "A sticker id (`done`, `sale`, `cursor-click`, `hand-point-right`...). Stamp ids render as flat stamps." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      default: "96" as const,
      description: "Pixels of the art; the border is added around it. Below 80 the 64 px redraw, from 128 the extras." as const
    }, {
      name: "peel" as const,
      type: "boolean | number" as const,
      default: "false" as const,
      description: "Fold the lower-right corner over. `true` picks a size from the sticker; a number is the fold in px. Works for any silhouette." as const
    }, {
      name: "rotate" as const,
      type: 'number | "auto"' as const,
      default: '"auto"' as const,
      description: "Degrees, or a small seeded tilt that `density=\"calm\"` flattens." as const
    }, {
      name: "border" as const,
      type: "number" as const,
      description: "White border width in px (default 7.5% of the size, 3.5 to 8)." as const
    }, {
      name: "shadow" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The soft drop shadow (`ll-drop-sticker`, a CSS filter)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Another seed, another hand (and another auto tilt)." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "Accessible name. Decorative (`aria-hidden`) without it." as const
    }]
  }],
  a11y: ["Decorative by default. A badge that carries meaning (Done, Sale) should sit next to real text or be given a `label`."],
  usage: `import { Sticker } from "@/components/ui/sticker"

export function Example() {
  return <Sticker name="done" size={96} peel />
}`,
  related: ["doodle", "stamp", "icon"]
} satisfies ComponentDoc;
