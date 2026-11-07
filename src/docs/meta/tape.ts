// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "tape" as const,
  title: "Tape" as const,
  category: "Paper" as const,
  description: "A strip of masking, washi, kraft or cellophane tape, drawn: translucent, with slit lines along its edges, crinkles and torn or pinked ends. Stick it across a corner, use it as a label, or let Paper place it for you." as const,
  status: "new" as const,
  parts: [{
    name: "Tape" as const,
    description: "An intrinsic svg: its size is its `length` and `height`, so it is complete in server markup and needs no measuring. Position it with className (`absolute -top-3 left-6`)." as const,
    props: [{
      name: "kind" as const,
      type: '"masking" | "washi-dots" | "washi-stripes" | "washi-zigzag" | "washi-gingham" | "kraft" | "clear"' as const,
      default: '"masking"' as const,
      description: "Crepe masking tape; four printed washi patterns (dots, diagonal stripes, zigzag, gingham); gummed kraft with fiber streaks; nearly invisible cellophane." as const
    }, {
      name: "length" as const,
      type: "number" as const,
      default: "72" as const,
      description: "Along the strip, px." as const
    }, {
      name: "height" as const,
      type: "number" as const,
      default: "22" as const,
      description: "Across the strip, px." as const
    }, {
      name: "angle" as const,
      type: "number" as const,
      description: "Degrees it lies at. Default: seeded within +-4. Clamped like a sheet's tilt (calm density lays every strip flat)." as const
    }, {
      name: "ends" as const,
      type: '"saw" | "torn" | "straight" | "scissor"' as const,
      description: "How the strip ends. Default follows the kind: masking and kraft are torn with a sawtooth, washi is pinked, clear is straight." as const
    }, {
      name: "color" as const,
      type: "Accent" as const,
      description: "Print color of a washi tape: tomato, tangerine, lemon, grass, teal, sky, grape or bubblegum." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the drawing: the same seed always draws the same strip." as const
    }]
  }],
  a11y: ["Tape is decoration: aria-hidden, focusable=false, pointer-events: none. Never put the only copy of information on it; a label written on tape is real text next to (not inside) the svg.", "Tape keeps its colors in Windows high contrast (it is an intrinsic ink kind).", "Its tilt collapses to zero in calm density."],
  usage: `import { Tape } from "@/components/ui/tape"

<div className="relative w-64 p-6">
  <Tape kind="washi-dots" className="absolute -top-3 left-6" />
  …content
</div>`,
  related: ["paper", "card", "sticker"]
} satisfies ComponentDoc;
