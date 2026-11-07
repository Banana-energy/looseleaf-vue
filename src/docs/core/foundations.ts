// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export interface Swatch {
  token: string;
  label: string;
}
export interface FontSample {
  token: string;
  label: string;
  role: string;
}
export interface FoundationTopic {
  slug: string;
  title: string;
  summary: string;
  facts: string[];
  swatches?: Swatch[];
  fonts?: FontSample[];
  see?: {
    label: string;
    to: string;
  }[];
}
export const FOUNDATIONS: readonly FoundationTopic[] = [{
  slug: "principles" as const,
  title: "Principles" as const,
  summary: "The ten laws of the hand, what each pen means and a checklist for shipping: the why behind every other page." as const,
  facts: ["A notebook on a tidy desk: cream paper, a dark felt-tip for the words, blue felt for you and anything you can act on, graphite for the small print. Every color is a tool with one job.", "Ten laws decide whether a component looks drawn by a person: lines are ribbons with pressure, straight lines are ruled, no two things are identical, fills are a separate layer, paper has tooth, shadows are warm and short, paper tilts and text never does, text sits on real baselines, color is ink and marker, and the charm is a dial you can turn down.", "Every drawing is seeded, so the same seed draws the same hand on the server and in the browser.", "A short list of questions to ask before a component or a screen ships."],
  see: [{
    label: "Color" as const,
    to: "/foundations/color" as const
  }, {
    label: "Pens" as const,
    to: "/foundations/pens" as const
  }]
}, {
  slug: "color" as const,
  title: "Color" as const,
  summary: "Ink, pencil, marker and highlighter on cream paper. Loud colors stay in the decoration layer." as const,
  facts: ["Real UI is calm: cream paper, dark brown-black felt-tip, blue felt for you and anything interactive, graphite pencil for meta text.", "Red pencil means correction or danger, green pencil means ok, terracotta marker is the primary action, yellow highlighter is emphasis and selection.", "Saturated stationery accents (tomato, tangerine, lemon, grass, teal, sky, grape, bubblegum) exist only in stickers, washi, badges, avatars, chart fills and stamps.", "Every color is a --ll-* custom property and shadcn's semantic names (--background, --primary, ...) alias them, so a theme is a block of variable overrides."],
  swatches: [{
    token: "--ll-paper" as const,
    label: "paper" as const
  }, {
    token: "--ll-paper-shade" as const,
    label: "paper shade" as const
  }, {
    token: "--ll-slip" as const,
    label: "slip" as const
  }, {
    token: "--ll-card" as const,
    label: "card" as const
  }, {
    token: "--ll-graph" as const,
    label: "graph" as const
  }, {
    token: "--ll-kraft" as const,
    label: "kraft" as const
  }, {
    token: "--ll-desk" as const,
    label: "desk" as const
  }, {
    token: "--ll-ink" as const,
    label: "ink" as const
  }, {
    token: "--ll-ink-you" as const,
    label: "blue felt" as const
  }, {
    token: "--ll-pencil" as const,
    label: "pencil" as const
  }, {
    token: "--ll-red" as const,
    label: "red pencil" as const
  }, {
    token: "--ll-green" as const,
    label: "green pencil" as const
  }, {
    token: "--ll-marker" as const,
    label: "marker" as const
  }, {
    token: "--ll-hi" as const,
    label: "highlighter" as const
  }, {
    token: "--ll-tomato" as const,
    label: "tomato" as const
  }, {
    token: "--ll-tangerine" as const,
    label: "tangerine" as const
  }, {
    token: "--ll-lemon" as const,
    label: "lemon" as const
  }, {
    token: "--ll-grass" as const,
    label: "grass" as const
  }, {
    token: "--ll-teal" as const,
    label: "teal" as const
  }, {
    token: "--ll-sky" as const,
    label: "sky" as const
  }, {
    token: "--ll-grape" as const,
    label: "grape" as const
  }, {
    token: "--ll-bubblegum" as const,
    label: "bubblegum" as const
  }],
  see: [{
    label: "Theming" as const,
    to: "/foundations/theming" as const
  }]
}, {
  slug: "typography" as const,
  title: "Typography" as const,
  summary: "Four handwriting-and-typewriter faces, real DOM text on real baselines." as const,
  facts: ["Kevin Sans is the one hand, tuned for three roles: font-hand is the UI text, font-script is for titles, notes and numbers, font-type is for stamps, kickers and receipts. IBM Plex Mono (font-mono) is code.", "Handwriting fonts run about 1.25 times wider than a neutral face at the same visual size, so labels start at 14 px and touch inputs at 16 px.", "Text is always real text. Per-word jitter is an inline-block transform; it switches off in the calm density and under reduced motion.", "Display titles can take a riso offset shadow with the ll-riso utility."],
  fonts: [{
    token: "--font-hand" as const,
    label: "Kevin Sans Hand" as const,
    role: "UI text" as const
  }, {
    token: "--font-script" as const,
    label: "Kevin Sans Script" as const,
    role: "titles and notes" as const
  }, {
    token: "--font-type" as const,
    label: "Kevin Sans Type" as const,
    role: "stamps and kickers" as const
  }, {
    token: "--font-mono" as const,
    label: "IBM Plex Mono" as const,
    role: "code" as const
  }]
}, {
  slug: "pens" as const,
  title: "Pens" as const,
  summary: "Every line is a ribbon with pressure: felt-tip, pencil, marker and highlighter each have their own grain." as const,
  facts: ["A stroke is a filled variable-width polygon, not a uniform SVG stroke: it swells on the down-stroke, skips where the pen runs dry and wanders like a hand.", "Two weight classes give drawings hierarchy: fine-liner for detail, brush for the main shapes.", "Fills are a separate layer printed in register: one solid color that reaches right under its outline, so nothing is left unfilled.", "Grain is one color-independent mask per material; marker and highlighter blend with multiply."],
  see: [{
    label: "Paper" as const,
    to: "/foundations/paper" as const
  }]
}, {
  slug: "paper" as const,
  title: "Paper" as const,
  summary: "Sheets, edges, desk and the small props that hold them together." as const,
  facts: ["A sheet is a stock color, a baked relief tile lit from the upper left, an edge profile and a short umber shadow. Only the sheet tilts, never the text.", "edge=\"cut\" is pure CSS, so ordinary cards cost no SVG. Torn and deckle edges draw an ink outline.", "Props: masking and washi tape, paper clips, push-pins, staples, binder clips, stitches, rubber bands, coffee rings.", "The desk is a linen weave with a soft vignette."],
  see: [{
    label: "Stickers and doodles" as const,
    to: "/foundations/stickers-doodles" as const
  }]
}, {
  slug: "icons" as const,
  title: "Icons" as const,
  summary: "Hand-drawn doodle icons, redrawn at every size instead of scaled." as const,
  facts: ["More than 120 icons, lucide-name compatible, single color with an optional accent.", "Size tiers 16, 20, 24, 32, 48, 64, 96 and 128. Small sizes are redrawn with a heavier pen and fewer details, not scaled down.", "No lucide compatible anywhere: every glyph is one of ours.", "Icons are decorative by default (aria-hidden); pair them with a text label or give the button an accessible name."]
}, {
  slug: "stickers-doodles" as const,
  title: "Stickers & doodles" as const,
  summary: "Die-cut stickers, margin doodles, stamps and Stubby the pencil stub." as const,
  facts: ["Stickers are drawings with a fat white die-cut border, a cut line and a short shadow; some peel at a fold line.", "Doodles (40 or more) are unframed marks: arrows, stars, tally marks, underlines.", "Stubby the pencil stub has poses for idle, wave, think, sleep, write, celebrate, oops and peek, used by Empty, 404 and Spinner.", "Art below about 60 px is redrawn with fewer details, because it muddies when scaled down."],
  see: [{
    label: "Icons" as const,
    to: "/foundations/icons" as const
  }]
}, {
  slug: "motion" as const,
  title: "Motion" as const,
  summary: "Short, physical, and off when asked." as const,
  facts: ["Durations: press .09 s, hover .12, fade .15, pop .18, sheet .3, drop .34, soak .52. Easings: out, settle and pop.", "Interaction never re-renders the art: hover, press and focus toggle pre-drawn layers with opacity and transform.", "One token, --ll-motion (1 or 0), collapses every duration. prefers-reduced-motion and [data-motion=\"reduced\"] both set it to 0.", "Boiling lines and jitter are decoration and stop under reduced motion."]
}, {
  slug: "density" as const,
  title: "Density" as const,
  summary: "Comfortable, compact and calm: charm is a dial, not a mandate." as const,
  facts: ["comfortable: 40 px hit targets. compact: 32 px. calm: 28 px, hairline pencil rules, no jitter, no fill offset.", "Use calm for dense data and long forms. The whole tree switches with data-density on any ancestor.", "Type floors stay put: 14 px labels, 16 px input text on touch, 12 px chart axes, 24 px minimum hit box."]
}, {
  slug: "accessibility" as const,
  title: "Accessibility" as const,
  summary: "Reka UI behavior underneath, ink on top: the drawing never gets in the way." as const,
  facts: ["Keyboard and ARIA come from Reka UI (or native elements) exactly as in shadcn/ui. Ink layers are aria-hidden, pointer-events none and never affect layout.", "Text is at least AA against its paper. Focus is a drawn ring that keeps 3:1 against paper.", "Hit areas are DOM boxes of at least 24 px; the drawing may be smaller than the target, never larger.", "Under forced-colors the drawn borders fall back to real ones. In forced-colors mode chart series switch to pencil patterns."]
}, {
  slug: "theming" as const,
  title: "Theming" as const,
  summary: "One default theme, Notebook. A second one is a block of CSS variables." as const,
  facts: ["Tokens come in four tiers: palette (T0), shadcn roles (T1), recipe knobs like wobble, misregistration and tilt (T2), and geometry and motion (T3).", "A theme is a [data-theme=\"name\"] block that overrides the palette, plus an optional small recipe object for pen weights.", "Dark mode is shadcn's: the dark class on <html>. It will be its own material system with opaque pens and a normal blend mode.", "Components never need editing to be re-themed."],
  see: [{
    label: "Color" as const,
    to: "/foundations/color" as const
  }]
}];
export const FOUNDATION_BY_SLUG: ReadonlyMap<string, FoundationTopic> = new Map(FOUNDATIONS.map(t => [t.slug, t]));
