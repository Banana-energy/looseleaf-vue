// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "sticker-board" as const,
  title: "Sticker board" as const,
  category: "Interactive" as const,
  description: "A page you can stick stickers on: drag them anywhere, turn them, size them, stack them, with the pointer or the keyboard. The value is plain JSON ({ id, name, x, y, rot, scale, z }) and it exports to one standalone SVG." as const,
  status: "new" as const,
  parts: [{
    name: "StickerBoard" as const,
    description: "The state and the layout: a column holding the canvas and the toolbar (pass children to arrange them yourself). Owns the stickers, the picked one, the live region and the export." as const,
    props: [{
      name: "value / defaultValue" as const,
      type: "StickerBoardItem[]" as const,
      description: "The stickers. x and y are the center of the visible sticker in px from the canvas's top-left; rot is degrees clockwise (-180 to 180); scale 1 is the drawn size; a higher z lies on top. Ids must be unique. JSON that lacks a rot, scale or z (written by hand, or by an older version) is completed on the way in (0, 1, its position in the list), and what comes out through onValueChange is always whole. Built for tens of stickers: each is about 35 KB of markup at 96 px." as const
    }, {
      name: "onValueChange" as const,
      type: "(value: StickerBoardItem[]) => void" as const,
      description: "Called once when a drag ends, and on every key press, toolbar action or removal. The pointer writes styles while it drags and does not render per move." as const
    }, {
      name: "selectedId / defaultSelectedId / onSelectedIdChange" as const,
      type: "string | null" as const,
      description: "The picked sticker. Focusing or pressing a sticker picks it; pressing the bare page or Escape lets go." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      default: "96" as const,
      description: "Drawn size of a sticker at scale 1, px. Below 80 the 64 px redraw is used." as const
    }, {
      name: "minScale / maxScale" as const,
      type: "number" as const,
      default: "0.3 / 3" as const,
      description: "The limits of sizing." as const
    }, {
      name: "bounds" as const,
      type: '"center" | "inside" | "none"' as const,
      default: '"center"' as const,
      description: "Where a sticker may go: its center stays on the canvas, all of it stays on the canvas, or anywhere (the canvas clips)." as const
    }, {
      name: "readOnly / disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Look but do not touch: no tab stops, no handles, toolbar actions off (Export still works when read-only)." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      default: '"Sticker board"' as const,
      description: "Accessible name of the canvas group." as const
    }, {
      name: "onExport" as const,
      type: "(data: StickerBoardExport) => void" as const,
      description: "Receives { items, json, svg, width, height, png() } when Export is pressed. Without it, Export downloads stickers.svg." as const
    }]
  }, {
    name: "StickerBoardCanvas" as const,
    description: "The page the stickers lie on: a Paper (dot grid by default; any stock and edge work) whose stickers are clipped to it while its shadow and tape are not. Shows a hint while the board is empty." as const,
    props: [{
      name: "empty" as const,
      type: "VueNode" as const,
      default: '"Nothing stuck down yet."' as const,
      description: "What the empty board says." as const
    }, {
      name: "stock / edge / tape / …" as const,
      type: "PaperProps" as const,
      description: "Everything Paper takes." as const
    }]
  }, {
    name: "StickerBoardToolbar" as const,
    description: "Buttons for what the keyboard does, acting on the picked sticker: turn left and right, smaller and larger, send to back, backward, forward and to front, duplicate, delete and export. One row; every enabled button is a tab stop and left and right arrows also move along it." as const,
    props: [{
      name: "actions" as const,
      type: '("turn" | "size" | "layer" | "duplicate" | "delete" | "export")[]' as const,
      description: "Which groups to show, in order. Default all." as const
    }]
  }, {
    name: "useStickerBoard" as const,
    description: "The board's context for your own controls: items, selectedId, select, patch, remove, duplicate, reorder, turn, resize, exportBoard." as const
  }, {
    name: "addSticker" as const,
    description: "addSticker(items, name, { x, y, rot, scale, id, canvas }) returns the array with a new sticker on top: a fresh id (rocket-1, rocket-2), a small turn seeded from the id, a position that fans out." as const
  }, {
    name: "reorderSticker" as const,
    description: 'reorderSticker(items, id, "front" | "back" | "forward" | "backward") returns the array with z re-ranked 0..n-1, or the same array when nothing moves.' as const
  }, {
    name: "boardPoint" as const,
    description: "boardPoint(root, clientX, clientY) returns { x, y, inside }: where a pointer is on the canvas, and whether that is on the page at all. Use it to drop a sticker that came from a sheet or a drag (ignore the drop when inside is false); null when root holds no canvas." as const
  }],
  a11y: ["The canvas is a named group; every sticker is a focusable group with aria-roledescription \"sticker\", the picked one carries aria-current, and one line of instructions describes them all.", "Keys on a focused sticker: arrows move it 8 px (Shift 32, Alt 1); [ and ] (or R and Shift+R) turn it 5 degrees (Shift 15); + and - size it; 0 sets it upright at full size; PageUp and PageDown move it through the stack (Shift goes to the front or the back); Ctrl or Cmd D duplicates; Delete or Backspace removes it and moves focus on; Escape lets go.", "Every change is announced politely, once, after the last key press (\"Rocket at 216, 150.\").", "The turn ring and the size square are pointer handles only (aria-hidden); the keys and the toolbar do the same. Shift while turning snaps to 15 degrees. Deleting from the toolbar moves focus to the bare page with nothing picked (the button that was pressed is disabled by then), so a second press cannot take the next sticker.", "A read-only or disabled board has no keys, so it offers no instructions: its stickers are named groups and nothing more.", "The frame and the focus ring are drawn; Windows high contrast gives the picked sticker a real outline.", "Reduced motion: the small growth on hover is instant. Calm density: stickers do not grow on hover and the frame is drawn thinner."],
  usage: `import * as Vue from "vue"

import { StickerBoard, addSticker } from "@/components/ui/sticker-board"

export function Example() {
  const [items, setItems] = Vue.useState(() => addSticker([], "rocket", { x: 160, y: 120 }))
  return (
    <>
      <StickerBoard className="h-96" value={items} onValueChange={setItems} />
      <button onClick={() => setItems((all) => addSticker(all, "done"))}>Add</button>
    </>
  )
}`,
  related: ["sticker", "sticker-sheet", "sticker-picker", "corkboard", "paper"]
} satisfies ComponentDoc;
