// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "ticket" as const,
  title: "Ticket" as const,
  category: "Paper" as const,
  description: "A ticket with concave corners, a bite out of both edges where the stub tears off, and a row of holes along the tear. The holes are cut out of the paper, so the desk (and the shadow) show through. A body, a stub, spaced capitals in the typewriter font and a serial number in red." as const,
  status: "new" as const,
  parts: [{
    name: "Ticket" as const,
    description: "A flex row. Its whole silhouette is one drawn sheet, tilted and shadowed as one; the content on it is real DOM. Until it is measured (or given `size`) it wears a plain card." as const,
    props: [{
      name: "stock" as const,
      type: "StockName" as const,
      default: '"kraft"' as const,
      description: "What it is printed on: kraft, index-card (cream), sticky-yellow (a cinema ticket), sticky-pink ..." as const
    }, {
      name: "stub" as const,
      type: '"end" | "start" | "none"' as const,
      default: '"end"' as const,
      description: "Where the tear-off stub is. Mirrors in right-to-left layouts." as const
    }, {
      name: "stubWidth" as const,
      type: "number" as const,
      default: "88" as const,
      description: "Width of the stub in px; the tear line sits that far from the edge." as const
    }, {
      name: "punched" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A hole punched through the body, at the end of the reading line beside the tear (the words start at the other side): the ticket has been used." as const
    }, {
      name: "tilt / seed / size" as const,
      type: "boolean | number / string | number / [w, h]" as const,
      description: "A seeded turn under 1.2 degrees (or degrees, or false); pins the hand; the box in px for server-rendered drawings." as const
    }]
  }, {
    name: "TicketBody" as const,
    description: "The part you keep: padded inside the printed frame, in the type font, its content centered vertically." as const
  }, {
    name: "TicketStub" as const,
    description: "The part the doorman tears off: an `aside` with `role=\"note\"` (ancillary to the ticket, not a page landmark), `stubWidth` wide, content centered." as const
  }, {
    name: "TicketTitle" as const,
    description: "The big line, 24 px spaced capitals (ADMIT ONE)." as const
  }, {
    name: "TicketDescription" as const,
    description: "The place and time, 14 px spaced capitals." as const
  }, {
    name: "TicketNumber" as const,
    description: "The serial number in red, tabular figures." as const
  }],
  a11y: ["A ticket is a `div`. Give it `role=\"group\"` and a label when several sit on a page. The stub is an `aside` with `role=\"note\"`, so a page of tickets does not fill up with unnamed complementary landmarks.", "The drawn paper, notches, holes and frames are aria-hidden decoration; the ticket's information is text in the body and stub. Punched is shown by a hole and a data attribute: also say it in text (\"Used\") if it matters.", "Ink on every ticket stock is at least 9:1; the serial number is a red darkened with ink and reads at least 4.9:1 on kraft, yellow and pink. The tilt is zero in calm density; Windows high contrast replaces the drawing with an outline."],
  usage: `import { Ticket, TicketBody, TicketDescription, TicketNumber, TicketStub, TicketTitle } from "@/components/ui/ticket"

<Ticket role="group" aria-label="Ticket 0042">
  <TicketBody>
    <TicketTitle>Admit one</TicketTitle>
    <TicketDescription>Le Grand Jardin</TicketDescription>
  </TicketBody>
  <TicketStub><TicketNumber>No. 0042</TicketNumber></TicketStub>
</Ticket>`,
  related: ["receipt", "label-tag", "paper", "stamp"]
} satisfies ComponentDoc;
