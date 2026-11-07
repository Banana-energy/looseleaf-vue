// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "tear-off" as const,
  title: "Tear-off" as const,
  category: "Interactive" as const,
  description: "A coupon, ticket or raffle strip with a stub you tear off along a perforated line. Pull the stub and it swings off its far corner, tap it or press Enter and it comes away; the ticket keeps a torn edge. Calls onTear once." as const,
  status: "new" as const,
  parts: [{
    name: "TearOff" as const,
    description: "The ticket: an inline flex box holding the body and the stub. Keeps the state (attached or torn), announces the tear politely, and lays the stub beside the ticket or below it." as const,
    props: [{
      name: "onTear" as const,
      type: "() => void" as const,
      description: "Called once when a person tears the stub off (drag, tap or keyboard)." as const
    }, {
      name: "torn / defaultTorn / onTornChange" as const,
      type: "boolean" as const,
      description: "Controlled or uncontrolled. Setting a controlled `torn` back to false puts a fresh stub on, dropping onto the ticket." as const
    }, {
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "The stub is at the end of the line (start side in right-to-left) or below the ticket." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The stub cannot be pulled or torn." as const
    }, {
      name: "tornMessage" as const,
      type: "string" as const,
      default: '"Torn off."' as const,
      description: "What the status line says when the stub comes off." as const
    }]
  }, {
    name: "TearOffBody" as const,
    description: "The ticket you keep: a Paper whose edge along the seam is perforated, and torn afterwards. Takes every Paper prop except edge." as const,
    props: []
  }, {
    name: "TearOffStub" as const,
    description: "The stub: a Paper (index card by default) that is a button. The perforation bites are the paper's own perf edge; on top of it are printed dashes, a pair of scissors at the start of the line, and a curled pencil arrow that says which way to pull." as const,
    props: [{
      name: "label" as const,
      type: "string" as const,
      description: "Accessible name. Default: the stub's own text." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"index-card"' as const,
      description: "What it is made of." as const
    }]
  }],
  a11y: ["The stub is role=\"button\" named by its text (or `label`) and described by \"Press Enter or Space to tear it off along the dotted line, or pull it away with a pointer\". Enter and Space tear it; pointer dragging is an extra, never the only way.", "When it comes off the status line says \"Torn off.\" politely, once; the stub then leaves the tab order and the accessibility tree.", "Pointer: pull at least half way (or all the way) to tear; a shorter pull springs back; a tap tears; a canceled pointer springs back.", "Focus: when the stub is torn off with the keyboard, focus moves to the ticket itself (it becomes programmatically focusable, with no ring), so Tab carries on from the ticket instead of restarting at the top of the page. Keys typed in something inside the stub never tear it.", "Reduced motion: the stub does not swing or fall, it is simply gone. Right-to-left layouts put the stub on the left and pull it that way.", "The perforation and the scissors are decoration (aria-hidden). Calm density leaves the scissors out and keeps the dashes."],
  usage: `import { TearOff, TearOffBody, TearOffStub } from "@/components/ui/tear-off"

export function Example() {
  return (
    <TearOff onTear={() => redeem()}>
      <TearOffBody>Studio night. Friday, doors at 7.</TearOffBody>
      <TearOffStub>10% off your next visit</TearOffStub>
    </TearOff>
  )
}`,
  related: ["paper", "confetti", "flip-card", "peel-corner"]
} satisfies ComponentDoc;
