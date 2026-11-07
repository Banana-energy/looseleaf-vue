// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "sticker-sheet" as const,
  title: "Sticker sheet" as const,
  category: "Stickers & doodles" as const,
  description: "A sheet of die-cut stickers on backing paper, each in its own kiss-cut outline. Press one and it peels away, drag one and it comes off under the mouse; the outline stays behind and can take it back. For reward charts, sticker packs and anything you collect." as const,
  status: "new" as const,
  parts: [{
    name: "StickerSheet" as const,
    description: "The backing paper (a Paper) with its printing: a dashed cut margin, crop marks, an optional typed title with how many stickers are left, and the sheen of release paper. Lays its children out on a grid." as const,
    props: [{
      name: "stickers" as const,
      type: "string[]" as const,
      description: "Ids from the art library: one item each, when you need no labels or ids of your own." as const
    }, {
      name: "columns / size" as const,
      type: "number" as const,
      default: "4 / 72" as const,
      description: "Stickers per row, and the drawn size of each in px (below 80 the 64 px redraw is used). The grid keeps its column count and each cell is size + 22 px wide, so choose them for your narrowest screen (3 columns of 56 px fit a 320 px phone)." as const
    }, {
      name: "title" as const,
      type: "string" as const,
      description: "Typed at the top of the sheet, with \"n left\" on the right. Also the group's accessible name." as const
    }, {
      name: "backing" as const,
      type: '"glassine" | "kraft" | "paper"' as const,
      default: '"glassine"' as const,
      description: "Pale blue-gray release paper with a sheen, kraft, or plain paper." as const
    }, {
      name: "peeled / defaultPeeled / onPeeledChange" as const,
      type: "string[]" as const,
      description: "Ids of the stickers that are off the sheet. Controlled: the parent decides what is peeled." as const
    }, {
      name: "onPeel" as const,
      type: "(item) => void" as const,
      description: "{ id, name, label, dragged, x, y }. For a drag, x and y are the pointer's client position at release: drop the sticker there (boardPoint from sticker-board turns them into canvas coordinates, and says whether the point is on the board at all). A controlled sheet that does not add the id to `peeled` declines the drag: the sticker springs back. A click or a key has no position: put it wherever you like." as const
    }, {
      name: "onStick" as const,
      type: "(item) => void" as const,
      description: "A peeled sticker was put back on its outline." as const
    }, {
      name: "restorable" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Whether pressing an empty outline puts the sticker back. When off, a spent outline is dimmed (aria-disabled) rather than disabled, so the key that just peeled it keeps its focus." as const
    }, {
      name: "disabled / label" as const,
      type: "boolean / string" as const,
      description: "Freeze the sheet; the name when there is no title (default \"Sticker sheet\")." as const
    }, {
      name: "stock-like props" as const,
      type: "PaperProps" as const,
      description: "tilt, tape, fastener, shadow, edge and the rest of Paper." as const
    }]
  }, {
    name: "StickerSheetItem" as const,
    description: "One sticker in its outline. A button whose name says what it does now: \"Peel Rocket sticker\", then \"Put Rocket sticker back\". It lifts and turns a little on hover, curls its corner, and flies off up and to the right when peeled." as const,
    props: [{
      name: "name" as const,
      type: "string" as const,
      required: true,
      description: "The sticker's id in the art library." as const
    }, {
      name: "id" as const,
      type: "string" as const,
      description: "Its key in the peeled list. Default the name; give each a different id if a name appears twice." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "What it is called to a reader (default the name in words)." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      description: "Drawn size in px, overriding the sheet's." as const
    }]
  }, {
    name: "useStickerSheet" as const,
    description: "The sheet's context (peeled, size, peel, stick) for building your own items." as const
  }],
  a11y: ["The sheet is a named group; every sticker is a real button whose name changes with what pressing does (\"Peel Rocket sticker\" / \"Put Rocket sticker back\"). Enter and Space peel, exactly like a click.", "What came off is announced politely (\"Rocket peeled off.\", \"Rocket stuck back on.\"); the title shows how many are left.", "While a sticker is in the hand the sheet rises above the rest of the page, so it can be carried over a board that comes after it in the source.", "Dragging is a mouse and pen extra: touch never starts a drag (the page keeps scrolling), a tap peels. Every drag has a click or key equivalent, and releasing a drag near where it started springs the sticker back without peeling it.", "The kiss-cut outlines and the printing are decoration (aria-hidden, no pointer events); the focus ring is drawn round the whole slot and never depends on color alone.", "Reduced motion: no flight or curl animation, the sticker is simply gone or back. Calm density: no sheen, no crop marks.", "Windows high contrast keeps the stickers and outlines (intrinsic art)."],
  usage: `import { StickerSheet, StickerSheetItem } from "@/components/ui/sticker-sheet"

export function Example() {
  return (
    <StickerSheet title="Rewards" onPeel={({ name }) => award(name)}>
      <StickerSheetItem name="rocket" />
      <StickerSheetItem name="first-place" />
      <StickerSheetItem name="a-plus" />
    </StickerSheet>
  )
}`,
  related: ["sticker", "sticker-board", "sticker-picker", "peel-corner", "paper"]
} satisfies ComponentDoc;
