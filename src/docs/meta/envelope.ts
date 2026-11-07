// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "envelope" as const,
  title: "Envelope" as const,
  category: "Paper" as const,
  description: "An envelope on the desk with a stamp, a postmark and address lines. It opens: the flap, which belongs to the back panel, stands up behind, and a letter slides out from between the panels, the front panel hiding its foot. Built on Collapsible, so it has a real trigger, `aria-expanded`, and content that is not in the page until it is out." as const,
  status: "new" as const,
  upstream: "collapsible" as const,
  parts: [{
    name: "Envelope" as const,
    description: "The outer element (`w-full max-w-sm`, a container for its own measurements) around the body (`aspect-[8/5]`), whose drawing is the back panel: a sheet with the flap that lifts a sliver on hover and stands up when open. When open the envelope makes room above itself for the flap and the letter." as const,
    props: [{
      name: "stock" as const,
      type: "StockName" as const,
      default: '"kraft"' as const,
      description: "What it is made of: kraft (manila), paper, index-card, a sticky stock ..." as const
    }, {
      name: "stamp" as const,
      type: "Accent | false" as const,
      default: '"tomato"' as const,
      description: "The postage stamp in the top corner (perforated, with a little picture), in a stationery color, or none. It sits at the end corner and mirrors in RTL." as const
    }, {
      name: "postmark" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Two rings and wavy cancellation lines over the stamp (only with a stamp)." as const
    }, {
      name: "airmail" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A border of slanted red and blue stripes." as const
    }, {
      name: "open / defaultOpen / onOpenChange" as const,
      type: "boolean / boolean / (open: boolean) => void" as const,
      description: "As Collapsible: controlled or not." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Sealed: the trigger is disabled (as Collapsible's `disabled`) and hovering opens nothing." as const
    }, {
      name: "openOnHover" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Also open while a mouse is over it and close when it leaves (unless it was opened by a click). Touch never opens it on hover." as const
    }, {
      name: "tilt / seed / size" as const,
      type: "boolean | number / string | number / [w, h]" as const,
      description: "A seeded turn under 1.1 degrees (front and back turn together); pins the hand; the box in px for server-rendered drawings." as const
    }]
  }, {
    name: "EnvelopeLetter" as const,
    description: "The letter: a Paper (paper stock by default) absolutely placed between the panels. It is not in the page while the envelope is closed; when it opens it slides up (and fades in), rising about a third of the envelope's height above its top edge. Only that upper part shows; the front panel hides the rest." as const,
    props: [{
      name: "stock" as const,
      type: "StockName" as const,
      default: '"paper"' as const,
      description: "The letter's paper." as const
    }]
  }, {
    name: "EnvelopeFront" as const,
    description: "The front panel, in front of the letter: the paper, the seams of the bottom flap, the stamp and postmark. Put `EnvelopeAddress`, `EnvelopeSender` and `EnvelopeTrigger` in it, and put it BEFORE `EnvelopeLetter` in the source: z-index (front 20, letter 10) decides what is on top, source order decides the tab order. Nothing inside the front can be clicked or selected, because the trigger covers it." as const
  }, {
    name: "EnvelopeTrigger" as const,
    description: "A button over the whole front (Collapsible.Trigger): `aria-expanded`, `aria-controls`, Space and Enter. Its content is its accessible name (default \"Open the letter\")." as const
  }, {
    name: "EnvelopeAddress" as const,
    description: "The address block in the script font, 28 px rows on pencil rules, at most 62% of the width, sitting in the lower part of the front." as const
  }, {
    name: "EnvelopeSender" as const,
    description: "The return address, small, at the start corner of the top." as const
  }],
  a11y: ["The trigger is a real button with `aria-expanded` and `aria-controls`, named by its content: make the name say what opening does (\"Read the letter from Ada\"). The letter is not rendered until it is open, so a screen reader never meets it twice. Open and closed are not carried by the drawing alone.", "Source order is tab order: put `EnvelopeFront` (with its trigger) before `EnvelopeLetter`, so that Tab from the trigger reaches a link or button inside the letter it just opened. The letter clips to its sheet and most of it sits behind the front: keep it to a few lines, a heading and a link, and put long messages on a page the letter links to. With `openOnHover`, a letter that holds keyboard focus stays open when the mouse leaves.", "Hover opening is a mouse nicety (`openOnHover`); touch and keyboard always use the trigger. The slide-in is skipped with reduced motion, and the flap simply appears.", "The paper, seams, stamp, postmark and flap are aria-hidden decoration. Ink on the kraft is 9:1, and so is the address; the postmark is decoration only. Windows high contrast replaces the drawing with outlines."],
  usage: `import { Envelope, EnvelopeAddress, EnvelopeFront, EnvelopeLetter, EnvelopeSender, EnvelopeTrigger } from "@/components/ui/envelope"

<Envelope>
  <EnvelopeFront>
    <EnvelopeSender>The Stationer</EnvelopeSender>
    <EnvelopeAddress><p>Ada Lovelace</p><p>Paris</p></EnvelopeAddress>
    <EnvelopeTrigger>Read the letter from The Stationer</EnvelopeTrigger>
  </EnvelopeFront>
  {/* after the front in the source, behind it on the page: focus goes trigger, then letter */}
  <EnvelopeLetter>
    <p className="font-script text-2xl">Dear Ada,</p>
    <p>the flap is up and the letter comes out.</p>
  </EnvelopeLetter>
</Envelope>`,
  related: ["collapsible", "paper", "ticket", "card"]
} satisfies ComponentDoc;
