// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "desk" as const,
  title: "Desk" as const,
  category: "Paper" as const,
  description: "The surface everything else lies on: sage bookcloth under a lamp (linen weave, mottling, a warm vignette), with an optional layer of objects behind your content: a coffee ring, a pencil, paper clips, a ruler, push-pins. Paper is only paper against something darker than itself." as const,
  status: "new" as const,
  parts: [{
    name: "Desk" as const,
    description: "A `div` with the `ll-desk` surface. It brings the two desk textures with it (a deduplicated `<style>` each, also in server markup), so it works without a provider." as const,
    props: [{
      name: "as" as const,
      type: '"div" | "main" | "section" | "article"' as const,
      default: '"div"' as const,
      description: "The element." as const
    }, {
      name: "objects" as const,
      type: "DeskObject[] | boolean" as const,
      default: "false" as const,
      description: "Things lying on the blotter behind the content: `coffee`, `pencil`, `clips`, `ruler`, `pins`. `true` is all five. Hidden below the `sm` breakpoint and in calm density." as const
    }, {
      name: "lamp" as const,
      type: "number | boolean" as const,
      default: "1" as const,
      description: "Strength of the vignette: 0 (or false) removes it, 1 is the theme's own (a whisper of shade), above 1 darkens the corners quickly (2.5 is a dim room)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the objects." as const
    }]
  }, {
    name: "DeskObjects" as const,
    description: "The layer of objects on its own: absolutely positioned, aria-hidden, clipped to its container. Place it in any relative container; `Desk` mounts it for you." as const,
    props: [{
      name: "objects" as const,
      type: "DeskObject[]" as const,
      required: true,
      description: "Which objects to lay out." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }],
  a11y: ["The desk is a plain element (`div` by default); pass `as=\"main\"` with an `aria-label` if it is your main landmark. Its texture and objects are decoration: aria-hidden, pointer-events-none.", "Objects lie behind the content (z-index below every sheet) and are hidden on narrow screens and in calm density, so they never crowd a small or a quiet layout.", "Text set straight on the desk must be ink, ink-soft or muted (all at least 4.5:1 on the sage). Windows high contrast replaces the texture with the system canvas."],
  usage: `import { Desk } from "@/components/ui/desk"
import { Page, PageHeader, PageTitle } from "@/components/ui/page"

export function Example() {
  return (
    <Desk as="main" objects={["coffee", "pencil"]} className="min-h-screen px-6 py-12">
      <Page>
        <PageHeader><PageTitle>Monday</PageTitle></PageHeader>
      </Page>
    </Desk>
  )
}`,
  related: ["page", "paper", "card", "tape"]
} satisfies ComponentDoc;
