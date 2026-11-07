// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "card" as const,
  title: "Card" as const,
  category: "Layout" as const,
  description: "A card is a sheet of paper: header, title, description, action, content and footer with shadcn's spacing, on any stock and edge. Dividers are drawn pencil rules, and a card can be taped, pinned or clipped to the desk." as const,
  status: "stable" as const,
  upstream: "card" as const,
  parts: [{
    name: "Card" as const,
    description: "A Paper with shadcn's card layout (a flex column, gap 6, py 6). It takes every Paper prop; its default stock is `card` (paper color, a small shadow)." as const,
    props: [{
      name: "stock" as const,
      type: "StockName" as const,
      default: '"card"' as const,
      description: "Paper, slip, index-card, graph, dot-grid, check, ledger, pad, kraft, napkin, sticky-*, photo, parchment, receipt." as const
    }, {
      name: "edge" as const,
      type: "EdgeSpec" as const,
      default: '"cut"' as const,
      description: "Cut (pure CSS), torn, deckle, crimp, zig, perf, scallop, or one kind per side." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "Seeded tilt of the sheet; text stays upright." as const
    }, {
      name: "rules" as const,
      type: "RuleName" as const,
      default: '"none"' as const,
      description: "Printed rules: ruled, index, graph, dots, ledger, pad. Off by default (unlike Paper, which prints its stock's own rules) because arbitrary content does not sit on ruled lines." as const
    }, {
      name: "tape" as const,
      type: '"corner" | "top" | "both" | false' as const,
      description: "Tape strips at the corners or the top edge." as const
    }, {
      name: "fastener" as const,
      type: '"clip" | "pin" | "staple" | "binder-clip" | false' as const,
      description: "Hold the card down with a drawn prop." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "CardHeader" as const,
    description: "A container query grid (`@container/card-header`): title and description on the left, an optional CardAction on the right. `border-b` asks for a drawn divider and adds the usual bottom padding." as const,
    props: [{
      name: "rule" as const,
      type: '"pencil" | "dashed" | "wavy"' as const,
      default: '"pencil"' as const,
      description: "How the divider under a header with `border-b` is drawn: a pencil line that rises to the right, dashes like a ledger, or a wavy underline." as const
    }]
  }, {
    name: "CardTitle" as const,
    description: "The title in the script font at 27 px, leading none, semibold." as const
  }, {
    name: "CardDescription" as const,
    description: "Muted text in the hand font, 14 px." as const
  }, {
    name: "CardAction" as const,
    description: "Placed top right of the header grid, spanning both rows." as const
  }, {
    name: "CardContent" as const,
    description: "The body, px 6." as const
  }, {
    name: "CardFooter" as const,
    description: "A flex row. `border-t` draws a divider above it and adds the top padding." as const,
    props: [{
      name: "rule" as const,
      type: '"pencil" | "dashed" | "wavy"' as const,
      default: '"pencil"' as const,
      description: "How the divider above a footer with `border-t` is drawn." as const
    }]
  }],
  a11y: ["A Card is a plain div, as upstream: give it a role or an element (`as=\"article\"`, `role=\"group\"` with a label) when it means something more.", "The sheet, dividers, tape and fasteners are aria-hidden decoration; nothing in them is focusable or takes pointer events.", "Ink on paper is 14:1; muted descriptions 8.9:1. Text stays upright while the sheet turns, and the tilt is zero in calm density.", "Calm density also draws a plain cut edge with a hairline shadow and hides tape and fasteners."],
  usage: `import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function Example() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what lands in your inbox.</CardDescription>
        <CardAction><Button variant="link" size="sm">Reset</Button></CardAction>
      </CardHeader>
      <CardContent>…</CardContent>
      <CardFooter className="border-t"><Button>Save</Button></CardFooter>
    </Card>
  )
}

<Card stock="index-card" edge="torn" tape="both">…</Card>`,
  related: ["paper", "tape", "button", "separator"]
} satisfies ComponentDoc;
