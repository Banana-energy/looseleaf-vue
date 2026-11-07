// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "label-tag" as const,
  title: "Label tag" as const,
  category: "Paper" as const,
  description: "A hang tag: cut card with clipped corners (or an arched top, or a luggage tag's clipped end), a hole with a reinforcing patch and a brass eyelet, and a loop of twine. The whole silhouette is one drawn sheet, so the string and the eyelet turn and cast their shadow with the card. As a link or a button it swings on its eyelet." as const,
  status: "new" as const,
  parts: [{
    name: "LabelTag" as const,
    description: "A `div` (or your own element with `asChild`) whose content sits on the card below the eyelet. Until it is measured (or given `size`) it wears a plain card; the drawing then replaces it." as const,
    props: [{
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your link or button as the tag. It swings 2.6 degrees about its eyelet on hover." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"kraft"' as const,
      description: "What it is cut from: kraft, paper, index-card, sticky-yellow, sticky-pink ..." as const
    }, {
      name: "shape" as const,
      type: '"price" | "round" | "luggage"' as const,
      default: '"price"' as const,
      description: "Clipped top corners; an arched top; or a horizontal luggage tag hung from the start (mirrors in RTL)." as const
    }, {
      name: "string" as const,
      type: "number" as const,
      default: "36" as const,
      description: "How far the loop of twine hangs out, px. The tag gets that much margin on its hanging side (`mt-(--tag-string)`); override it with a margin class." as const
    }, {
      name: "twine" as const,
      type: '"natural" | Accent' as const,
      default: '"natural"' as const,
      description: "The color of the string." as const
    }, {
      name: "eyelet" as const,
      type: '"brass" | "steel" | "none"' as const,
      default: '"brass"' as const,
      description: "The metal ring in the hole, or a bare hole." as const
    }, {
      name: "tilt / seed / size" as const,
      type: "boolean | number / string | number / [w, h]" as const,
      description: "A seeded turn under 2 degrees (or degrees, or false); pins the hand; the box in px for server-rendered drawings." as const
    }]
  }, {
    name: "LabelTagTitle" as const,
    description: "A script title, 26 px, leading none." as const
  }, {
    name: "LabelTagDescription" as const,
    description: "Small ink-soft text under the title." as const
  }, {
    name: "LabelTagPrice" as const,
    description: "A price in the type font, red, pushed to the foot of the tag." as const
  }],
  a11y: ["A tag is a `div`: put text in it. As a link or button (`asChild`) it keeps its native role, focus and keyboard behavior; the drawing is aria-hidden decoration and the swing is a hover-only, reduced-motion-aware nicety (none in calm density).", "Information carried by the twine color or the eyelet must also be in text. Ink on kraft, paper and the sticky stocks is at least 9:1; the price is a red darkened with ink and reads at least 4.9:1 on all of them.", "The tilt is zero in calm density; Windows high contrast replaces the drawing with a real outline around the box (the string is not shown)."],
  usage: `import { LabelTag, LabelTagDescription, LabelTagPrice, LabelTagTitle } from "@/components/ui/label-tag"

<LabelTag twine="tomato">
  <LabelTagTitle>Sale</LabelTagTitle>
  <LabelTagDescription>while stocks last</LabelTagDescription>
  <LabelTagPrice>12.00</LabelTagPrice>
</LabelTag>

<LabelTag asChild shape="round"><a href="/new"><LabelTagTitle>New</LabelTagTitle></a></LabelTag>`,
  related: ["ticket", "paper", "sticky-note", "bookmark"]
} satisfies ComponentDoc;
