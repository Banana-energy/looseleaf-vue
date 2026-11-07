// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "paper" as const,
  title: "Paper" as const,
  category: "Paper" as const,
  description: "A sheet of paper on the desk: a stock (paper, slip, index card, graph, kraft, sticky notes ...), an edge (cut, torn, deckle, pinked ...), printed rules, a shadow and a small seeded tilt. The sheet turns; your content never does." as const,
  status: "new" as const,
  parts: [{
    name: "Paper" as const,
    description: "A container whose background is drawn paper. A plain cut edge is pure CSS (baked tooth tiles, a lit gradient, an umber shadow stack): no SVG at all. A torn, deckled, crimped, pinked, perforated or scalloped edge is the same CSS sheet cut to a drawn outline (`clip-path`), with a small svg of plain paths for the fiber fringe and the edge line: no texture lives in the svg, so a page of drawn sheets costs what a page of cut ones does. Everything behind the content turns together by `--ll-tilt`; children are upright. A drawn edge is a few px larger than the box on every side (the fringe) and a turned sheet's corners swing by half its width times the angle, so a sheet that ends flush with the window (a full-width page, a sheet at the very bottom) can scroll it by that much: put it in a container with `overflow-x-clip` (`overflow-clip` at the bottom), or lay it square with `tilt={false}`." as const,
    props: [{
      name: "stock" as const,
      type: '"paper" | "card" | "slip" | "index-card" | "graph" | "dot-grid" | "check" | "ledger" | "pad" | "kraft" | "napkin" | "sticky-yellow" | "sticky-green" | "sticky-orange" | "sticky-pink" | "sticky-blue" | "photo" | "parchment" | "receipt"' as const,
      default: '"paper"' as const,
      description: "What the sheet is made of: its color token, tooth, shadow stack, default edge and printed rules." as const
    }, {
      name: "edge" as const,
      type: '"cut" | "torn" | "deckle" | "crimp" | "zig" | "perf" | "scallop" | { top?, right?, bottom?, left? }' as const,
      default: "the stock's own" as const,
      description: "How it is cut. One kind, or one per side (missing sides are cut). Anything but `cut` cuts the sheet to a drawn outline; until it has a size the sheet shows as a cut CSS sheet." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "true: a seeded angle within the stock's limit (never under a quarter of it, clamped to --ll-tilt-max, zero in calm density). A number is degrees. false lays it square." as const
    }, {
      name: "rules" as const,
      type: '"none" | "ruled" | "ruled-hand" | "index" | "graph" | "dots" | "ledger" | "pad" | "window"' as const,
      default: "the stock's own" as const,
      description: "Printed rules on the sheet: blue lines and a red margin (`ruled` is gradients, `ruled-hand` is a light svg of wandering pencil lines), an index card's red header rule, graph cells, a dot grid, a ledger, an order pad's lines. One decorative element of CSS gradients; ruled stocks tilt less so text stays on the lines. Text sits on `ruled` (28 px pitch), `pad` and `index` (30) and `ledger` (24) rules when its line-height is the pitch and a line box ends where the first rule's line does (`ruled`: 16 px of padding, then 28 px lines): each rule is printed `--ll-rule-offset` above the bottom of its line box (default 8 px for `ruled`, 9 for `pad` and `index`, 6 for `ledger`), which is where a hand font's baseline leaves room for the rule to run 2 to 3 px under it. Set `--ll-rule-offset` on the sheet or any ancestor to tune it; the script role sits lower in its line box, lift it by the offset less about 3 px." as const
    }, {
      name: "tape" as const,
      type: '"corner" | "top" | "both" | false' as const,
      default: "false" as const,
      description: "Tape strips across one top corner, along the top edge, or across both top corners." as const
    }, {
      name: "tapeKind" as const,
      type: "TapeKind" as const,
      default: '"masking"' as const,
      description: "Which tape: masking, washi-dots, washi-stripes, washi-zigzag, washi-gingham, kraft, clear." as const
    }, {
      name: "fastener" as const,
      type: '"clip" | "pin" | "staple" | "binder-clip" | false' as const,
      default: "false" as const,
      description: "Holds the sheet with a drawn prop that has a lit stroke and a short warm shadow." as const
    }, {
      name: "fastenerTone" as const,
      type: '"steel" | "tomato" | "tangerine" | "lemon" | "grass" | "teal" | "sky" | "grape" | "bubblegum"' as const,
      description: "Color of the clip's plastic coating or the pin's head." as const
    }, {
      name: "fastenerClassName" as const,
      type: "string" as const,
      description: "Classes for the fastener, merged after its default place (a clip stands at `-top-5 right-8`, a pin at `-top-2 left-1/2`), so `right-[3.125rem]` slides a clip along the top edge and `-top-8` lifts it. Use it to keep a fastener off a control at the sheet's corner." as const
    }, {
      name: "shadow" as const,
      type: '"stock" | "none" | "hair" | "loose" | "lift" | "slip" | "card" | "pad" | "check" | "paper" | "sticky"' as const,
      default: '"stock"' as const,
      description: "The umber shadow stack. Calm density swaps it for a hairline. A drawn edge casts the stack's soft layers from a rectangle inset to the mean of its edge, and its tight layer as a hairline that follows the edge." as const
    }, {
      name: "curl" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A sticky note's curling bottom-right corner: the sheet is chamfered and the lifted flap is drawn into it, so it turns and casts with the sheet." as const
    }, {
      name: "as" as const,
      type: '"div" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "li" | "ul" | "ol" | "form" | "fieldset" | "figure"' as const,
      default: '"div"' as const,
      description: "The element to render." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always cuts, tilts and textures the sheet the same way. Default: derived from useId()." as const
    }, {
      name: "size" as const,
      type: "[number, number]" as const,
      description: "The sheet's size in px, if you know it. A drawn edge is then part of the server markup instead of appearing after the first measure." as const
    }]
  }, {
    name: "Fastener" as const,
    description: "A paper clip, push-pin, staple or binder clip as a free-standing prop. Intrinsic size, complete in server markup; place it with className." as const,
    props: [{
      name: "kind" as const,
      type: '"clip" | "pin" | "staple" | "binder-clip"' as const,
      default: '"clip"' as const,
      description: "Which fastener." as const
    }, {
      name: "tone" as const,
      type: '"steel" | Accent' as const,
      description: "Clip coating or pin head color." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      description: "Clip height, pin head diameter, staple length or binder clip width in px." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the drawing." as const
    }]
  }, {
    name: "PaperDefs" as const,
    description: "The paper tiles as SVG `<pattern>`s, for static svg art of your own that wants paper texture. A `Paper` needs none of it: torn, deckled and pinked sheets wear the tiles as CSS backgrounds, cached once per tile by the browser. Do not fill per-instance svgs with these patterns; every instance rasterizes its own copy." as const,
    props: [{
      name: "tiles" as const,
      type: "PaperTileName[]" as const,
      default: "fiber, relief, slip, kraft, cloud" as const,
      description: "Which tiles to define." as const
    }]
  }],
  a11y: ["A CSS sheet brings the tooth tiles of its stock itself (one deduplicated `<style>` per tile, in the server HTML too), so it needs no provider. Saturated sticky notes lay a veil of their own color over the tooth, so orange and pink read as paper, not plaster.", "The sheet, its rules, tape and fasteners are decoration: the drawing is aria-hidden, pointer-events: none and never focusable. Paper adds no role; give it one (`as=\"article\"`, `role=\"region\"` with a label) when the content deserves it.", "Text is ink on paper (14:1 on paper, 9.4:1 on kraft, at least 9:1 on every sticky note) and stays upright: only the sheet and its rules turn.", "Tilt is clamped to --ll-tilt-max and is zero in calm density and in reduced-motion contexts that set it; props are hidden in calm density.", "In Windows high contrast the drawn svg (fiber fringe, edge line) steps aside and the host gets a real 1px outline; the paper stays cut to its edge, and tape stays visible."],
  usage: `import { Paper } from "@/components/ui/paper"

export function Note() {
  return (
    <Paper stock="index-card" tape="both" className="w-72 p-6">
      <h3 className="font-script text-2xl font-bold">Buy more ink</h3>
      <p>Black, blue, and one red for corrections.</p>
    </Paper>
  )
}

<Paper edge={{ bottom: "torn" }} fastener="pin" className="p-6">…</Paper>`,
  related: ["card", "tape", "sticker", "dialog"]
} satisfies ComponentDoc;
