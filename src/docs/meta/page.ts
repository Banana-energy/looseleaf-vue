// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "page" as const,
  title: "Page" as const,
  category: "Paper" as const,
  description: "The app's main paper column: a sheet on the desk with a header, content and a footer. It can be three-hole punched (the desk shows through the holes), torn from a pad, ringed with a coffee stain, and its title is underlined by the same hand that wrote it." as const,
  status: "new" as const,
  parts: [{
    name: "Page" as const,
    description: "A Paper laid out as a centered flex column (gap 6, px 6 / 10, py 8 / 10). It takes every Paper prop; the holes and the stain are ink behind the content, turned with the sheet. The holes' drawing is exactly the page's box (it adds no bleed of its own); but a page that fills the window is turned by up to 0.35 degrees and its far corners swing a few px past the window's edge, so give a full-width page a container with `overflow-x-clip` (and 8 px of side padding, which keeps its shadow) or lay it square with `tilt={false}`." as const,
    props: [{
      name: "as" as const,
      type: '"div" | "main" | "article" | "section" | "form"' as const,
      default: '"div"' as const,
      description: "The element. Use `main` when the page is the app's main landmark." as const
    }, {
      name: "width" as const,
      type: '"sm" | "md" | "lg" | "xl" | "full"' as const,
      default: '"md"' as const,
      description: "Column width: 32rem, 42rem, 56rem, 72rem or unbounded. Always centered." as const
    }, {
      name: "holes" as const,
      type: '"start" | "top" | "none" | boolean' as const,
      default: "false" as const,
      description: "Punched holes: three down the start edge (mirrored for right-to-left), or two across the top. `true` is `start`. The desk shows through them; the start padding grows to clear them." as const
    }, {
      name: "reinforced" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Gummed reinforcement rings round the holes." as const
    }, {
      name: "stain" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A coffee ring in the lower corner (multiply-printed, faint)." as const
    }, {
      name: "torn" as const,
      type: 'boolean | "top" | "bottom" | "both"' as const,
      description: "Shorthand for a torn edge. `edge` wins if both are given." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"paper"' as const,
      description: "Any Paper stock: paper, slip, graph, dot-grid, kraft, parchment ..." as const
    }, {
      name: "rules" as const,
      type: "RuleName" as const,
      default: '"none"' as const,
      description: "Printed rules (ruled, graph, dots ...). Ruled paper's red margin mirrors in RTL." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "Seeded turn of the sheet (under 0.35 degrees for a page). The holes turn with it; text never does." as const
    }, {
      name: "tape / fastener" as const,
      type: "Paper props" as const,
      description: "Tape it or clip it down, like any sheet." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: tilt, holes, stain." as const
    }]
  }, {
    name: "PageHeader" as const,
    description: "A column for the title and description (gap 2)." as const
  }, {
    name: "PageTitle" as const,
    description: "The title, a heading in the script font (41 px). A hand-drawn mark sits under it." as const,
    props: [{
      name: "as" as const,
      type: '"h1" | "h2" | "h3" | "p" | "div"' as const,
      default: '"h1"' as const,
      description: "The element." as const
    }, {
      name: "underline" as const,
      type: '"single" | "double" | "wavy" | "highlight" | "none"' as const,
      default: '"single"' as const,
      description: "A pen line, two, a wavy one, or a yellow highlighter swipe behind the lower half of the words. Calm density draws a hairline." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the mark." as const
    }]
  }, {
    name: "PageDescription" as const,
    description: "Muted text, at most a prose measure wide." as const
  }, {
    name: "PageContent" as const,
    description: "The body: a growing flex column (gap 4) that pushes the footer down." as const
  }, {
    name: "PageFooter" as const,
    description: "A row at the foot of the sheet (page number, actions), muted, 14 px." as const
  }],
  a11y: ["Page is a plain element (`div` by default): pass `as=\"main\"` for the main landmark, or `as=\"article\"` / `\"section\"` with a label when it means something.", "PageTitle is a real heading (`h1` by default); its mark, the holes, rings, stain, tape and fasteners are aria-hidden, pointer-events-none decoration.", "Ink on paper is 14:1 and the muted description 8.9:1. The tilt is zero in calm density, and Windows high contrast replaces the drawing with a real outline.", "The start padding grows with `holes` so text never reaches the punch; right-to-left pages get their holes and margin rules on the right."],
  usage: `import { Page, PageContent, PageDescription, PageFooter, PageHeader, PageTitle } from "@/components/ui/page"

export function Example() {
  return (
    <Page as="main" holes reinforced>
      <PageHeader>
        <PageTitle>Field notes</PageTitle>
        <PageDescription>A week of small observations.</PageDescription>
      </PageHeader>
      <PageContent>…</PageContent>
      <PageFooter>- 3 -</PageFooter>
    </Page>
  )
}

<Page torn stock="slip" width="sm"><PageTitle underline="highlight">Order pad</PageTitle>…</Page>`,
  related: ["paper", "card", "notebook", "desk"]
} satisfies ComponentDoc;
