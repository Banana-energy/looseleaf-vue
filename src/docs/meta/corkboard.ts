// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "corkboard" as const,
  title: "Corkboard" as const,
  category: "Interactive" as const,
  description: "A wooden-framed corkboard with notes you can pick up. Drag them with a pointer, or focus one and use the arrow keys to move it and R to turn it. Positions are plain JSON you can store and restore." as const,
  status: "new" as const,
  parts: [{
    name: "Corkboard" as const,
    description: "The board: a frame of marker and felt round a cork made from one seeded speckle tile (an SVG pattern, so a big board costs no more cork than a small one). It is a positioned box; give it a height and put notes in it." as const,
    props: [{
      name: "value / defaultValue" as const,
      type: "Record<string, { x?, y?, r?, z? }>" as const,
      description: "Positions by note id: x and y in px from the top-left of the cork, r the turn in degrees, z the stacking order. Only notes that were moved, turned or raised are in it." as const
    }, {
      name: "onValueChange" as const,
      type: "(value) => void" as const,
      description: "Called when a drag ends, and on every key move, turn or raise." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      default: '"Corkboard"' as const,
      description: "Accessible name of the group." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Nothing can be picked up or moved; notes leave the tab order." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the frame and the cork." as const
    }]
  }, {
    name: "CorkboardNote" as const,
    description: "A piece of paper on the board (a Paper: sticky note by default, any stock works) held by a push-pin or a strip of tape. Lifting it (dragging) raises the pin and lengthens the shadow; dropping it pops the pin back in." as const,
    props: [{
      name: "id" as const,
      type: "string" as const,
      required: true,
      description: "Unique id; the key in the board's value." as const
    }, {
      name: "x / y" as const,
      type: "number" as const,
      default: "16" as const,
      description: "Where it starts, px from the top-left of the cork." as const
    }, {
      name: "rotate" as const,
      type: "number" as const,
      description: "How it starts turned, degrees. Default a small seeded angle (flat in calm density)." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"sticky-yellow"' as const,
      description: "What it is made of: sticky-*, index-card, photo, kraft…" as const
    }, {
      name: "pinned / pinColor" as const,
      type: "boolean / PaintKey" as const,
      default: "true" as const,
      description: "A pin, or a strip of tape when false. The pin color is seeded from the id unless given." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "Accessible name (default the id), also used in announcements." as const
    }, {
      name: "paperProps" as const,
      type: "PaperProps" as const,
      description: "Anything else the sheet takes." as const
    }, {
      name: "bare" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "No sheet of its own: the children are the paper (a StickyNote, a Polaroid, a Ticket). The note still moves, turns, raises and is pinned." as const
    }]
  }],
  a11y: ["The board is a named group; every note is a focusable group with aria-roledescription \"note\", described by one line of instructions.", "Arrow keys move the focused note by 8 px (Shift 32 px), R turns it 4 degrees clockwise (Shift+R back, limited to 24), Enter or Space brings it to the front. Notes stay inside the cork.", "Where a note ended up is announced politely, once, after the last key press (\"Call mum at 56, 30.\").", "Pointer: notes are picked up anywhere except on links, buttons, inputs and elements marked data-corkboard-nodrag, so a note can hold controls. Escape while dragging with the keyboard focus on the note puts it back.", "The focus ring is drawn round the note; it never depends on color alone. Windows high contrast gives the note a real outline.", "Reduced motion: no lift animation, the pin does not pop. Calm density: notes lie flat and the pins are left out.", "Resizing: a layout saved on a wide board is drawn inside a narrower one (a note is pulled back in as the cork changes size), while the stored positions are left alone, so widening the board again puts everything where it was saved.", "Every note is a tab stop, so a board of fifty notes is fifty Tab presses: keep boards to a handful of notes, or put the board behind a skip link. Touch: a note is touch-action none (a drag on it never scrolls the page), the cork around the notes still scrolls."],
  usage: `import { Corkboard, CorkboardNote } from "@/components/ui/corkboard"

export function Example() {
  return (
    <Corkboard className="h-96" onValueChange={(positions) => save(positions)}>
      <CorkboardNote id="mum" x={24} y={28}>Call mum</CorkboardNote>
      <CorkboardNote id="ink" x={220} y={90} stock="sticky-pink" pinned={false}>Buy ink</CorkboardNote>
    </Corkboard>
  )
}`,
  related: ["paper", "tape", "sketchpad", "flip-card"]
} satisfies ComponentDoc;
