// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "receipt" as const,
  title: "Receipt" as const,
  category: "Paper" as const,
  description: "Thermal till paper: pinked (or perforated, or torn) at both ends, printed in the typewriter font, its lines a description list, its total circled in red felt tip by whoever checked it, ending in a barcode made from the number under it." as const,
  status: "new" as const,
  parts: [{
    name: "Receipt" as const,
    description: "A Paper on the `receipt` stock, a centered 18 rem column with the type font. It takes every Paper prop except `stock`, `rules` and `edge`." as const,
    props: [{
      name: "ends" as const,
      type: '"zig" | "perf" | "torn" | "cut" | "deckle" | "crimp" | "scallop"' as const,
      default: '"zig"' as const,
      description: "The cut of both ends: the tear bar's sawtooth, a perforation, torn, or plain." as const
    }]
  }, {
    name: "ReceiptHeader" as const,
    description: "The shop: its first child is the name in spaced capitals, the rest is address and date, centered." as const
  }, {
    name: "ReceiptLines" as const,
    description: "A `dl` between two dashed rules; put a `ReceiptLine` in it for each item." as const
  }, {
    name: "ReceiptLine" as const,
    description: "One item: a `div` holding a `dt` (the item; a long name wraps onto a second line, as a thermal printer would, and never hides behind an ellipsis) and a `dd` (the price, tabular figures, aligned to the end, on the first line)." as const,
    props: [{
      name: "qty" as const,
      type: "number" as const,
      description: "How many, printed before the item as `2 x`." as const
    }, {
      name: "price" as const,
      type: "VueNode" as const,
      required: true,
      description: "The price." as const
    }]
  }, {
    name: "ReceiptTotal" as const,
    description: "A `dl` of its own (label and amount, larger and bold)." as const,
    props: [{
      name: "label" as const,
      type: "VueNode" as const,
      default: '"TOTAL"' as const,
      description: "The label." as const
    }, {
      name: "circled" as const,
      type: 'boolean | "red" | "blue" | "ink"' as const,
      default: "false" as const,
      description: "Circle the amount in felt tip. `true` is red. Calm density draws a hairline loop." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the loop." as const
    }]
  }, {
    name: "ReceiptDivider" as const,
    description: "A dashed rule across the paper (`role=\"separator\"`)." as const
  }, {
    name: "ReceiptBarcode" as const,
    description: "Bars from `value` in a `figure` with the number printed under them. The same number always prints the same bars, on the server and in the browser." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "The number." as const
    }, {
      name: "height" as const,
      type: "number" as const,
      default: "44" as const,
      description: "Bar height in px." as const
    }]
  }, {
    name: "ReceiptFooter" as const,
    description: "The thank-you line, muted, 12 px." as const
  }],
  a11y: ["A receipt is a plain `div` by default, and a name on a `div` is ignored by screen readers: pass `as=\"article\"` (it is a self-contained document) together with `aria-label`, as the examples do.", "The lines are a real description list, so a screen reader hears each item with its price. The total is a list of its own, with the same structure.", "The barcode is `role=\"img\"` named `Barcode <number>`; the number is also printed as text. The circle round the total, the pinked ends, tape and clips are aria-hidden decoration: the amount is text either way.", "Ink on the receipt stock is 14:1; the footer is 8:1. The type font is set at 13 px on a 20 px line. Windows high contrast replaces the drawn ends with an outline."],
  usage: `import { Receipt, ReceiptBarcode, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt"

<Receipt as="article" aria-label="Receipt from Looseleaf Cafe">
  <ReceiptHeader><span>Looseleaf Cafe</span><span>25 sep 2026</span></ReceiptHeader>
  <ReceiptLines>
    <ReceiptLine qty={1} price="4.50">oat latte</ReceiptLine>
    <ReceiptLine qty={3} price="9.00">washi tape</ReceiptLine>
  </ReceiptLines>
  <ReceiptTotal circled>13.50</ReceiptTotal>
  <ReceiptBarcode value="0042 1187" />
  <ReceiptFooter>thank you - come again</ReceiptFooter>
</Receipt>`,
  related: ["paper", "ticket", "card", "stamp"]
} satisfies ComponentDoc;
