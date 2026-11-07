// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "accordion" as const,
  title: "Accordion" as const,
  category: "Layout" as const,
  description: "Ruled rows that open. Each row sits on a hand-pulled pencil rule; a hovered row gets a highlighter swipe, and an opened row turns its chevron over, writes a margin brace beside its text and lets the words soak in. Reka UI behavior and keyboard support are untouched." as const,
  status: "stable" as const,
  upstream: "accordion" as const,
  parts: [{
    name: "Accordion" as const,
    description: "The Reka UI Accordion root." as const,
    props: [{
      name: "type" as const,
      type: '"single" | "multiple"' as const,
      required: true,
      description: "One open row at a time, or as many as you like." as const
    }, {
      name: "collapsible" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Single mode only: allow the open row to be closed again." as const
    }, {
      name: "value / defaultValue / onValueChange" as const,
      type: "string | string[]" as const,
      description: "Controlled and uncontrolled state (an array in multiple mode)." as const
    }, {
      name: "bracket" as const,
      type: '"curly" | "square" | false' as const,
      default: '"curly"' as const,
      description: "The mark drawn in the margin of an opened row." as const
    }, {
      name: "disabled / dir / orientation" as const,
      type: "boolean / \"ltr\" | \"rtl\" / \"vertical\" | \"horizontal\"" as const,
      description: "As Reka UI." as const
    }]
  }, {
    name: "AccordionItem" as const,
    description: "A row: `relative`, with a drawn rule at its foot (not on the last row). Its `value` ties trigger and content together." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "Identifies the row." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The trigger is skipped by the arrow keys and cannot be opened." as const
    }]
  }, {
    name: "AccordionTrigger" as const,
    description: "The row's button, inside the Reka UI header (an h3). Bold hand text, a chevron doodle that turns over when open, a highlighter swipe wiped in on hover and a blue ring on keyboard focus. It is 8 px wider than its text on each side so the swipe has room, and pulled back by the same amount." as const,
    props: [{
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId()." as const
    }]
  }, {
    name: "AccordionContent" as const,
    description: "The panel (`role=\"region\"`, labeled by its trigger). It slides open with a height animation that clips the text only while it moves (at rest nothing is clipped, so a focus ring inside stays whole), and soaks its text in. `className` reaches the box that holds your children, as upstream's does, so `grid gap-3` or `flex flex-col gap-4` space them (the brace's wrapper sits between; vertical padding classes such as `pb-0` stay on the outer div, where the brace's height is measured)." as const
  }],
  a11y: ["The WAI-ARIA accordion pattern from Reka UI: each trigger is a button with `aria-expanded` and `aria-controls` inside a heading; Enter and Space toggle; ArrowDown, ArrowUp, Home and End move between triggers.", "The panel is a `region` labeled by its trigger. Closed panels are removed from the accessibility tree.", "The chevron, the rules, the swipe and the brace are aria-hidden and pointer-events: none. State is told by aria-expanded and the turned chevron, not by color.", "Keyboard focus draws a blue felt ring round the row; hover-only decoration never carries meaning. Windows high contrast hides the drawings and uses the browser's own focus ring.", "Reduced motion (the OS setting or data-motion=\"reduced\") opens rows at once and shows the brace finished.", "Right-to-left layouts mirror the brace and text indent; the chevron is symmetric."],
  usage: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Example() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It follows the WAI-ARIA pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it drawn by hand?</AccordionTrigger>
        <AccordionContent>Every line.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
  related: ["collapsible", "tabs", "card"]
} satisfies ComponentDoc;
