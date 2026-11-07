// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "table" as const,
  title: "Table" as const,
  category: "Data display" as const,
  description: "Rows and columns on a ruled page. Every rule is a pencil pull drawn once by the pen and printed by CSS (so a hundred rows cost no drawings), the header has an accountant's double rule, and a hovered or selected row is a highlighter swipe." as const,
  status: "stable" as const,
  upstream: "table" as const,
  parts: [{
    name: "Table" as const,
    description: "A `<table>` in a scroll container. The container is padded 12 px and pulled back by 12 px (layout unchanged) so a focus ring or swipe at the edge is not clipped. `className` goes to the table, `containerClassName` to the container. The other parts read a context from it and throw a readable error when used outside a `Table` (a browser would drop a stray `<tr>` anyway)." as const,
    props: [{
      name: "sticky" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Pin the header row to the top of the container while the body scrolls. Give the container a height with `containerClassName=\"max-h-72\"`. The header takes `--ll-table-bg` (default the card color) so rows scroll under it." as const
    }, {
      name: "containerClassName" as const,
      type: "string" as const,
      description: "Classes for the scroll container (height, max-width, a different bleed). The container's padding is transparent but real: it overlaps 12 px of whatever sits directly above or below the table, so keep a gap of at least 12 px (a `gap-4` or `mt-4` is plenty), or take the bleed away with `containerClassName=\"m-0 w-full p-0\"` when nothing at the table's edge draws outside its box." as const
    }]
  }, {
    name: "TableHeader" as const,
    description: "`<thead>`. Its row carries the double rule underneath." as const
  }, {
    name: "TableBody" as const,
    description: "`<tbody>`. Rows are ruled by hand; the last one is left open, as upstream does." as const
  }, {
    name: "TableFooter" as const,
    description: "`<tfoot>`. Bold text and the double rule turned upside down above the first row." as const
  }, {
    name: "TableRow" as const,
    description: "`<tr>`, 44 px tall (36 compact, 32 calm). Hover lights a 40% swipe; `data-state=\"selected\"` (or `aria-selected=\"true\"`) lights the full swipe. A row cannot hold an svg, so both are CSS." as const
  }, {
    name: "TableHead" as const,
    description: "`<th>`. Column names are written in the script font in blue felt (plain bold in calm density). `aria-sort` on it turns the label to ink; put your sort button inside." as const
  }, {
    name: "TableCell" as const,
    description: "`<td>`. Padded 12 px; a checkbox cell loses its end padding as upstream does." as const
  }, {
    name: "TableCaption" as const,
    description: "`<caption>` under the table, written in the script font." as const
  }],
  a11y: ["Real table semantics: table, rowgroup, columnheader, row, cell. Nothing is drawn inside the table elements; the rules and swipes are painted with CSS pseudo-elements and are invisible to assistive technology.", "Mark the sorted column with `aria-sort=\"ascending\" | \"descending\"` on its TableHead and put a `<button>` inside it (see the data table example); mark chosen rows with `data-state=\"selected\"` and give their checkbox an accessible name.", "Windows high contrast replaces the painted rules and swipe with real cell borders and the system highlight colors.", "Hover only lights the swipe on pointers that can hover (and a row with an open menu, `aria-expanded`, stays lit). Reduced motion removes the fade.", "Contrast on the swipe: ink is 11:1 on the full (selected) swipe, but green and red pencil text drop to about 4:1 there (4.7:1 on paper). Write status words in ink on selectable rows, as the data table example does, or keep colored text out of them.", "Calm density (`data-density=\"calm\"`) draws straight hairline rules, a plain bold header and a flat swipe, for dense data."],
  usage: `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function Example() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableCell className="font-bold">INV001</TableCell>
          <TableCell className="text-end">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
  related: ["checkbox", "scroll-area", "card", "avatar"]
} satisfies ComponentDoc;
