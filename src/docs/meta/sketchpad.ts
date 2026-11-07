// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "sketchpad" as const,
  title: "Sketchpad" as const,
  category: "Interactive" as const,
  description: "A real drawing surface. Pointer, touch, pen pressure or the keyboard put strokes on paper, and every stroke is rendered by the interface's own pen (variable-width ribbons, pooled ends, felt / graphite / marker grain), so what people draw looks like the rest of the page. Undo, redo, export as svg, replay." as const,
  status: "new" as const,
  parts: [{
    name: "Sketchpad" as const,
    description: "The root: it owns the strokes, the pen in hand, the history and the export handle, and lays out a toolbar and a canvas when you give it no children. Strokes are plain JSON, stored in canvas units, so a saved drawing looks identical everywhere." as const,
    props: [{
      name: "value / defaultValue" as const,
      type: "SketchStroke[]" as const,
      description: "The drawing: { id, tool, color, size, pts: [x, y, pressure?][] }. Controlled or uncontrolled. Strokes without an id are given one." as const
    }, {
      name: "onValueChange" as const,
      type: "(strokes: SketchStroke[]) => void" as const,
      description: "Called after every stroke, erase, undo, redo and clear." as const
    }, {
      name: "tool / defaultTool / onToolChange" as const,
      type: '"felt" | "brush" | "pencil" | "marker" | "highlighter" | "eraser"' as const,
      default: '"felt"' as const,
      description: "The pen in hand. The eraser removes whole strokes it touches." as const
    }, {
      name: "tools" as const,
      type: "SketchTool[]" as const,
      default: '["felt","pencil","marker","highlighter","eraser"]' as const,
      description: "Which tools the toolbar shows and the keyboard offers." as const
    }, {
      name: "color / defaultColor / onColorChange" as const,
      type: "SketchColor" as const,
      default: '"ink"' as const,
      description: "One of the theme's pens and accents: ink, ink-you, red, green, marker, tangerine, hi, teal, grape, bubblegum. Choosing the highlighter over a dark ink switches to yellow." as const
    }, {
      name: "size / defaultSize / onSizeChange" as const,
      type: "number" as const,
      default: "1" as const,
      description: "Width multiplier of the tool's own nominal line. Presets: 0.6 fine, 1 medium, 1.9 bold." as const
    }, {
      name: "width / height" as const,
      type: "number" as const,
      default: "640 / 400" as const,
      description: "The canvas's logical size. Strokes live in these units and the canvas scales to its container." as const
    }, {
      name: "readOnly" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Look, do not draw. The default toolbar is left out and the canvas becomes a labeled image." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Draws nothing, dims the toolbar, leaves the tab order." as const
    }, {
      name: "replay / replaySpeed" as const,
      type: "boolean / number" as const,
      default: "false / 1" as const,
      description: "Draw the strokes on again, in order, each one uncovered along its own center line. Reduced motion shows the finished picture." as const
    }, {
      name: "apiRef" as const,
      type: "Ref<SketchpadHandle>" as const,
      description: "undo(), redo(), clear(), replay(), strokes(), toSVG(), toDataURL() (svg, no canvas needed), toPNG() (async, null where there is no canvas)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Salts every stroke's hand. Leave it out and the same JSON draws the same picture in every browser." as const
    }]
  }, {
    name: "SketchpadCanvas" as const,
    description: "The sheet the strokes land on. Pointer events with coalesced samples and pen pressure (palm rejection while a pen is in range), touch-action none, and keyboard drawing: arrows move a cursor, Space puts the pen down and lifts it. Children are guides printed under the strokes." as const,
    props: [{
      name: "paper" as const,
      type: '"plain" | "ruled" | "graph" | "dots" | "kraft"' as const,
      default: '"plain"' as const,
      description: "What it is drawn on." as const
    }, {
      name: "paperProps" as const,
      type: "PaperProps" as const,
      description: "Anything the sheet takes: tape, fastener, edge, stock." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      default: '"Drawing"' as const,
      description: "Accessible name of the canvas." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the frame's hand." as const
    }]
  }, {
    name: "SketchpadToolbar" as const,
    description: "A slip of paper that holds the controls. Any layout works; the parts only need to be inside the root." as const,
    props: []
  }, {
    name: "SketchpadTools" as const,
    description: "A radio group of tool buttons. Each shows a sample of what its pen writes, in the current color; the selected one is boxed and highlighted. Roving focus: arrow keys move and select." as const,
    props: [{
      name: "tools" as const,
      type: "SketchTool[]" as const,
      description: "Override the root's tool list for this group." as const
    }]
  }, {
    name: "SketchpadTool" as const,
    description: "One tool button (Reka UI radio item and ink host)." as const,
    props: [{
      name: "value" as const,
      type: "SketchTool" as const,
      required: true,
      description: "Which tool." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "SketchpadColors" as const,
    description: "A radio group of scribbled color swatches." as const,
    props: [{
      name: "colors" as const,
      type: "SketchColor[]" as const,
      description: "Which swatches to show." as const
    }]
  }, {
    name: "SketchpadColor" as const,
    description: "One swatch, named for screen readers (Ink, Blue, Red…)." as const,
    props: [{
      name: "value" as const,
      type: "SketchColor" as const,
      required: true,
      description: "Which color." as const
    }]
  }, {
    name: "SketchpadSizes" as const,
    description: "A radio group of three pooled dots: fine, medium, bold." as const,
    props: []
  }, {
    name: "SketchpadSize" as const,
    description: "One width preset." as const,
    props: [{
      name: "value" as const,
      type: '"fine" | "medium" | "bold"' as const,
      required: true,
      description: "Which preset." as const
    }]
  }, {
    name: "SketchpadUndo" as const,
    description: "A ghost Button; disabled while there is nothing to undo. History keeps the last 100 steps, and clearing is one step." as const,
    props: []
  }, {
    name: "SketchpadRedo" as const,
    description: "A ghost Button; disabled while there is nothing to redo." as const,
    props: []
  }, {
    name: "SketchpadClear" as const,
    description: "A ghost Button that wipes the page. Undo brings it back." as const,
    props: []
  }],
  a11y: ["The canvas is role=\"application\" (aria-roledescription \"drawing canvas\") with a name and a description of the keys; the drawn strokes are aria-hidden. Read-only, it is an image named \"Drawing, N strokes\".", "Keyboard drawing: arrow keys move a cursor (Shift = 32 units, Alt = 2), Space or Enter puts the pen down (\"Pen down.\") and lifts it (\"Stroke added.\"), Escape cancels the stroke or hides the cursor. Leaving the canvas lifts the pen.", "Focus: Undo, Redo and Clear disable themselves when they have nothing left to do; if one of them had focus, focus moves to the canvas instead of falling to the top of the page. Every part composes its own `onClick` with the built-in action (call `event.preventDefault()` to cancel it).", "Shortcuts on the focused canvas: F felt, B brush, P pencil, M marker, H highlighter, E eraser (only tools that are offered), [ and ] change the width, Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl+Y redo.", "Tools, colors and widths are radio groups (Reka UI): Tab enters a group, arrow keys move and select. Every swatch has a color name; toolbar buttons are at least 28 px with a bigger hit area.", "Adding, erasing, undoing and clearing are announced politely (\"Stroke added. 3 strokes.\").", "Windows high contrast: the strokes keep their own colors (forced-color-adjust: none), the toolbar gets real outlines. Reduced motion: replay shows the finished drawing at once.", "Touch: the canvas sets touch-action: none so drawing never scrolls the page. That also means a canvas that fills the screen on a phone traps the scroll: leave a margin around it, or put it in a tab or dialog. Palm rejection: a finger is ignored for 1.5 s after the pen was last seen near the screen (and a palm that got there first is dropped when the pen lands), so a person who switches between pencil and finger is never locked out.", "Scale: a stroke is stored as thinned points (samples closer than 0.8 units are held back) and drawn by the pen as ribbons, which is about 15 to 30 KB of svg for a hundred points and up to 1 MB for a very long scribble; the finished markup is cached (bounded by size, 24 MB) and a live stroke is previewed with at most 480 points. A page with many hundreds of long strokes belongs in the replay/export flow (toSVG), not in a live canvas."],
  usage: `import { Sketchpad } from "@/components/ui/sketchpad"

export function Example() {
  return <Sketchpad className="max-w-2xl" onValueChange={(strokes) => save(JSON.stringify(strokes))} />
}`,
  related: ["signature-pad", "corkboard", "paper", "reveal"]
} satisfies ComponentDoc;
