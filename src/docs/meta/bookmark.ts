// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "bookmark" as const,
  title: "Bookmark" as const,
  category: "Paper" as const,
  description: "A ribbon bookmark you can press. Unpressed, a dashed pencil ghost of a ribbon marks the place; pressed, the woven, edge-stitched cloth ribbon hangs there in its color and casts a short shadow. It is a Toggle underneath, so `aria-pressed`, Space and Enter come for free. `BookmarkRibbon` is the same ribbon as a page marker with no behavior." as const,
  status: "new" as const,
  parts: [{
    name: "Bookmark" as const,
    description: "A Reka UI Toggle (a `button`) 2 rem wide and 3 rem high, with a hit area 6 px larger all round. It takes every Toggle prop. Its content is its accessible name (default \"Bookmark\"), visually hidden." as const,
    props: [{
      name: "tone" as const,
      type: "Accent" as const,
      default: '"tomato"' as const,
      description: "The ribbon's color: tomato, tangerine, lemon, grass, teal, sky, grape or bubblegum." as const
    }, {
      name: "pressed / defaultPressed / onPressedChange" as const,
      type: "boolean / boolean / (pressed: boolean) => void" as const,
      description: "As Toggle: controlled or not." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      description: "A pale ghost that cannot be pressed." as const
    }, {
      name: "tilt / seed / size" as const,
      type: "boolean | number / string | number / [w, h]" as const,
      description: "A seeded turn under 1.4 degrees (flat in calm density); pins the hand; the box in px for server-rendered drawings." as const
    }]
  }, {
    name: "BookmarkRibbon" as const,
    description: "The ribbon alone, hanging: an aria-hidden, pointer-events-none `div` for a page marker. Place it with `absolute -top-1 end-6` on a sheet." as const,
    props: [{
      name: "tone" as const,
      type: "Accent" as const,
      default: '"tomato"' as const,
      description: "The ribbon's color." as const
    }]
  }],
  a11y: ["Bookmark is a real toggle button: it announces \"pressed\" or \"not pressed\", it is reached by Tab and pressed with Space or Enter. Give it a name that says what it saves (\"Save this article\"); the name does not change with the state, `aria-pressed` does.", "The ribbon, its stitching and its ghost are aria-hidden decoration, so the state is never carried by color alone: `aria-pressed` and the ghost-versus-ribbon shape (dashed outline versus a filled tail) both tell it. Focus shows the standard focus ring around the box.", "The hit area is 44 x 60 px with its extension (24 px minimum). Windows high contrast replaces the drawing with a button outline, and a pressed bookmark fills with the system highlight color so the state is still visible; `aria-pressed` follows either way."],
  usage: `import { Bookmark, BookmarkRibbon } from "@/components/ui/bookmark"

<Card className="relative">
  <Bookmark className="absolute -top-1 end-6" defaultPressed onPressedChange={save}>
    Save this article
  </Bookmark>
  …
</Card>

<Paper className="relative"><BookmarkRibbon tone="grape" className="absolute -top-1 end-8" /></Paper>`,
  related: ["toggle", "notebook", "label-tag", "card"]
} satisfies ComponentDoc;
