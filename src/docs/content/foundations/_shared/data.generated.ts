// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ContrastRow, DurationRow, EasingRow, Expr, ForestData, KnobRow, PaletteEntry } from "./data-types";
export const PALETTE: PaletteEntry[] = [{
  "token": "--ll-desk" as const,
  "value": "#a8c8bb" as const,
  "role": "clean mint-sage blotter; makes cream paper glow" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.66,
  "onDesk": 1,
  "inkOn": 8.49
}, {
  "token": "--ll-desk-deep" as const,
  "value": "#93b4a7" as const,
  "role": "vignette, desk edges. Decoration only, never behind text" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 2.07,
  "onDesk": 1.25,
  "inkOn": 6.8
}, {
  "token": "--ll-paper" as const,
  "value": "#f8f5ee" as const,
  "role": "main sheet stock, the \"card\" of the notebook" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1,
  "onDesk": 1.66,
  "inkOn": 14.06
}, {
  "token": "--ll-paper-shade" as const,
  "value": "#ece6da" as const,
  "role": "darker cloud of the sheet: muted fills, code chips, \"more\" bands" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.14,
  "onDesk": 1.45,
  "inkOn": 12.32
}, {
  "token": "--ll-slip" as const,
  "value": "#fbf8f1" as const,
  "role": "scraps: popovers, menus, torn slips" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.03,
  "onDesk": 1.7,
  "inkOn": 14.43
}, {
  "token": "--ll-card" as const,
  "value": "#fbf6e9" as const,
  "role": "index card stock (Tailwind name: index-card)" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.01,
  "onDesk": 1.67,
  "inkOn": 14.19
}, {
  "token": "--ll-graph" as const,
  "value": "#f4f7ef" as const,
  "role": "graph / dot-grid paper" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.01,
  "onDesk": 1.67,
  "inkOn": 14.14
}, {
  "token": "--ll-kraft" as const,
  "value": "#dcc8a3" as const,
  "role": "kraft envelope, stitched border, gummed tape" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.5,
  "onDesk": 1.1,
  "inkOn": 9.36
}, {
  "token": "--ll-check" as const,
  "value": "#dfe9d8" as const,
  "role": "guest-check ledger green" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.15,
  "onDesk": 1.44,
  "inkOn": 12.24
}, {
  "token": "--ll-pad" as const,
  "value": "#f8f2de" as const,
  "role": "order pad: the sidebar" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.03,
  "onDesk": 1.61,
  "inkOn": 13.67
}, {
  "token": "--ll-photo" as const,
  "value": "#fffdf6" as const,
  "role": "polaroid border, sticker border. The whitest thing allowed" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.07,
  "onDesk": 1.77,
  "inkOn": 15.04
}, {
  "token": "--ll-rule-blue" as const,
  "value": "#8fb0d4" as const,
  "role": "index-card ruling" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 2.07,
  "onDesk": 1.25,
  "inkOn": 6.8
}, {
  "token": "--ll-rule-red" as const,
  "value": "#d9776a" as const,
  "role": "index-card header line" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 2.84,
  "onDesk": 1.71,
  "inkOn": 4.96
}, {
  "token": "--ll-pad-rule" as const,
  "value": "#b2c3dc" as const,
  "role": "pad ruling. DNA had #bccbe0 (1.47:1 on the pad); darkened to reach 1.5:1 as a drawn line" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.64,
  "onDesk": 1.01,
  "inkOn": 8.55
}, {
  "token": "--ll-check-rule" as const,
  "value": "#7fa37c" as const,
  "role": "ledger ruling" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 2.59,
  "onDesk": 1.57,
  "inkOn": 5.42
}, {
  "token": "--ll-sticky-yellow" as const,
  "value": "#f7e38a" as const,
  "role": "the classic" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.18,
  "onDesk": 1.4,
  "inkOn": 11.89
}, {
  "token": "--ll-sticky-green" as const,
  "value": "#cfe6a8" as const,
  "role": "sage sticky" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.24,
  "onDesk": 1.33,
  "inkOn": 11.33
}, {
  "token": "--ll-sticky-orange" as const,
  "value": "#f7c08e" as const,
  "role": "apricot sticky" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.5,
  "onDesk": 1.11,
  "inkOn": 9.39
}, {
  "token": "--ll-sticky-pink" as const,
  "value": "#f6b8b0" as const,
  "role": "salmon sticky" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.56,
  "onDesk": 1.07,
  "inkOn": 9.04
}, {
  "token": "--ll-sticky-blue" as const,
  "value": "#bcd8f0" as const,
  "role": "powder-blue sticky" as const,
  "alias": "" as const,
  "group": "surface" as const,
  "onPaper": 1.36,
  "onDesk": 1.22,
  "inkOn": 10.37
}, {
  "token": "--ll-ink" as const,
  "value": "#2a2420" as const,
  "role": "brown-black felt tip: body text, the system's voice" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--ll-ink-soft" as const,
  "value": "#4a423b" as const,
  "role": "secondary text; the lightest text allowed straight on the desk (4.64:1)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 9.04,
  "onDesk": 5.46,
  "inkOn": 1.56
}, {
  "token": "--ll-ink-muted" as const,
  "value": "#4a433c" as const,
  "role": "muted text. DESIGN had #4d4640, measured 4.37:1 on the desk; darkened to 4.59 so muted text passes on paper AND desk" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 8.93,
  "onDesk": 5.39,
  "inkOn": 1.57
}, {
  "token": "--ll-ink-you" as const,
  "value": "#2c4f9e" as const,
  "role": "blue felt: you, links, chosen, typed input, focus" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--ll-pencil" as const,
  "value": "#6b6660" as const,
  "role": "graphite for drawn meta marks and large text (5.2:1 on paper)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 5.22,
  "onDesk": 3.15,
  "inkOn": 2.69
}, {
  "token": "--ll-pencil-text" as const,
  "value": "#5a554e" as const,
  "role": "graphite that is safe for small text on every paper stock (5.9:1 on paper-shade)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 6.78,
  "onDesk": 4.09,
  "inkOn": 2.07
}, {
  "token": "--ll-pencil-mark" as const,
  "value": "#8e887f" as const,
  "role": "graphite for lines only, never text (3.2:1 on paper)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 3.23,
  "onDesk": 1.95,
  "inkOn": 4.36
}, {
  "token": "--ll-red" as const,
  "value": "#c2412d" as const,
  "role": "red pencil: correction, danger, error text (4.7:1)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 4.72,
  "onDesk": 2.85,
  "inkOn": 2.98
}, {
  "token": "--ll-green" as const,
  "value": "#3b7a4b" as const,
  "role": "green pencil: ok, added (4.7:1)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 4.74,
  "onDesk": 2.86,
  "inkOn": 2.97
}, {
  "token": "--ll-marker" as const,
  "value": "#df6b3c" as const,
  "role": "terracotta marker: the primary action (ink label 4.6:1)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 3.06,
  "onDesk": 1.85,
  "inkOn": 4.6
}, {
  "token": "--ll-orange-text" as const,
  "value": "#a4502a" as const,
  "role": "working / warm status text (5.1:1); marker itself is fill only" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 5.13,
  "onDesk": 3.1,
  "inkOn": 2.74
}, {
  "token": "--ll-hi" as const,
  "value": "#f8dc4c" as const,
  "role": "yellow highlighter: emphasis, selection, active row (fill only)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 1.26,
  "onDesk": 1.32,
  "inkOn": 11.18
}, {
  "token": "--ll-hi-deep" as const,
  "value": "#a87f0c" as const,
  "role": "highlighter as a mark that must be seen on paper (chart series, 3.4:1)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 3.38,
  "onDesk": 2.04,
  "inkOn": 4.16
}, {
  "token": "--ll-focus" as const,
  "value": "#2c4f9e" as const,
  "role": "focus mark color; one token recolors every ring" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--ll-link-hover" as const,
  "value": "#1f3b7a" as const,
  "role": "darker blue on hover" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 9.82,
  "onDesk": 5.93,
  "inkOn": 1.43
}, {
  "token": "--ll-check-ink" as const,
  "value": "#2f6b45" as const,
  "role": "ledger print (5.1:1 on the ledger)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 5.83,
  "onDesk": 3.52,
  "inkOn": 2.41
}, {
  "token": "--ll-check-no" as const,
  "value": "#b23a28" as const,
  "role": "ledger \"no\" red (4.8:1 on the ledger)" as const,
  "alias": "" as const,
  "group": "ink" as const,
  "onPaper": 5.47,
  "onDesk": 3.3,
  "inkOn": 2.57
}, {
  "token": "--ll-tomato" as const,
  "value": "#e8483a" as const,
  "role": "ink label 3.95:1: keep sticker text large or dark" as const,
  "alias": "" as const,
  "group": "accent" as const,
  "onPaper": 3.56,
  "onDesk": 2.15,
  "inkOn": 3.95
}, {
  "token": "--ll-tangerine" as const,
  "value": "#f59a2f" as const,
  "role": "ink label 7.0:1" as const,
  "alias": "" as const,
  "group": "accent" as const,
  "onPaper": 2.02,
  "onDesk": 1.22,
  "inkOn": 6.96
}, {
  "token": "--ll-lemon" as const,
  "value": "#fbd63a" as const,
  "role": "ink label 10.8:1" as const,
  "alias": "" as const,
  "group": "accent" as const,
  "onPaper": 1.3,
  "onDesk": 1.27,
  "inkOn": 10.78
}, {
  "token": "--ll-grass" as const,
  "value": "#5db85c" as const,
  "role": "ink label 6.2:1" as const,
  "alias": "" as const,
  "group": "accent" as const,
  "onPaper": 2.28,
  "onDesk": 1.37,
  "inkOn": 6.18
}, {
  "token": "--ll-teal" as const,
  "value": "#2fb1a3" as const,
  "role": "ink label 5.8:1" as const,
  "alias": "" as const,
  "group": "accent" as const,
  "onPaper": 2.43,
  "onDesk": 1.47,
  "inkOn": 5.79
}, {
  "token": "--ll-sky" as const,
  "value": "#4aa8e8" as const,
  "role": "ink label 5.9:1" as const,
  "alias": "" as const,
  "group": "accent" as const,
  "onPaper": 2.39,
  "onDesk": 1.45,
  "inkOn": 5.87
}, {
  "token": "--ll-grape" as const,
  "value": "#8f6fd6" as const,
  "role": "ink label 3.95:1: keep sticker text large or dark" as const,
  "alias": "" as const,
  "group": "accent" as const,
  "onPaper": 3.56,
  "onDesk": 2.15,
  "inkOn": 3.95
}, {
  "token": "--ll-bubblegum" as const,
  "value": "#f38bb8" as const,
  "role": "ink label 6.7:1" as const,
  "alias": "" as const,
  "group": "accent" as const,
  "onPaper": 2.1,
  "onDesk": 1.27,
  "inkOn": 6.7
}];
export const ROLES: PaletteEntry[] = [{
  "token": "--background" as const,
  "value": "#a8c8bb" as const,
  "role": "the desk. Text on it: ink / ink-soft / muted only" as const,
  "alias": "var(--ll-desk)" as const,
  "group": "shadcn" as const,
  "onPaper": 1.66,
  "onDesk": 1,
  "inkOn": 8.49
}, {
  "token": "--foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--card" as const,
  "value": "#f8f5ee" as const,
  "role": "" as const,
  "alias": "var(--ll-paper)" as const,
  "group": "shadcn" as const,
  "onPaper": 1,
  "onDesk": 1.66,
  "inkOn": 14.06
}, {
  "token": "--card-foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--popover" as const,
  "value": "#fbf8f1" as const,
  "role": "" as const,
  "alias": "var(--ll-slip)" as const,
  "group": "shadcn" as const,
  "onPaper": 1.03,
  "onDesk": 1.7,
  "inkOn": 14.43
}, {
  "token": "--popover-foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--primary" as const,
  "value": "#df6b3c" as const,
  "role": "" as const,
  "alias": "var(--ll-marker)" as const,
  "group": "shadcn" as const,
  "onPaper": 3.06,
  "onDesk": 1.85,
  "inkOn": 4.6
}, {
  "token": "--primary-foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--secondary" as const,
  "value": "#f8ecb5" as const,
  "role": "highlighter tint" as const,
  "alias": "color-mix(in srgb, var(--ll-hi) 35%, var(--ll-paper))" as const,
  "group": "shadcn" as const,
  "onPaper": 1.09,
  "onDesk": 1.52,
  "inkOn": 12.87
}, {
  "token": "--secondary-foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--muted" as const,
  "value": "#ece6da" as const,
  "role": "" as const,
  "alias": "var(--ll-paper-shade)" as const,
  "group": "shadcn" as const,
  "onPaper": 1.14,
  "onDesk": 1.45,
  "inkOn": 12.32
}, {
  "token": "--muted-foreground" as const,
  "value": "#4a433c" as const,
  "role": "" as const,
  "alias": "var(--ll-ink-muted)" as const,
  "group": "shadcn" as const,
  "onPaper": 8.93,
  "onDesk": 5.39,
  "inkOn": 1.57
}, {
  "token": "--accent" as const,
  "value": "#f8e68a" as const,
  "role": "highlighter wash: hover / selected rows" as const,
  "alias": "color-mix(in srgb, var(--ll-hi) 62%, var(--ll-paper))" as const,
  "group": "shadcn" as const,
  "onPaper": 1.16,
  "onDesk": 1.43,
  "inkOn": 12.16
}, {
  "token": "--accent-foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--destructive" as const,
  "value": "#c2412d" as const,
  "role": "" as const,
  "alias": "var(--ll-red)" as const,
  "group": "shadcn" as const,
  "onPaper": 4.72,
  "onDesk": 2.85,
  "inkOn": 2.98
}, {
  "token": "--destructive-foreground" as const,
  "value": "#fbf8f1" as const,
  "role": "" as const,
  "alias": "var(--ll-slip)" as const,
  "group": "shadcn" as const,
  "onPaper": 1.03,
  "onDesk": 1.7,
  "inkOn": 14.43
}, {
  "token": "--border" as const,
  "value": "#8e887f" as const,
  "role": "the stroke color of drawn lines" as const,
  "alias": "var(--ll-pencil-mark)" as const,
  "group": "shadcn" as const,
  "onPaper": 3.23,
  "onDesk": 1.95,
  "inkOn": 4.36
}, {
  "token": "--input" as const,
  "value": "#8e887f" as const,
  "role": "" as const,
  "alias": "var(--ll-pencil-mark)" as const,
  "group": "shadcn" as const,
  "onPaper": 3.23,
  "onDesk": 1.95,
  "inkOn": 4.36
}, {
  "token": "--ring" as const,
  "value": "#2c4f9e" as const,
  "role": "" as const,
  "alias": "var(--ll-focus)" as const,
  "group": "shadcn" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--chart-1" as const,
  "value": "#df6b3c" as const,
  "role": "" as const,
  "alias": "var(--ll-marker)" as const,
  "group": "shadcn" as const,
  "onPaper": 3.06,
  "onDesk": 1.85,
  "inkOn": 4.6
}, {
  "token": "--chart-2" as const,
  "value": "#2c4f9e" as const,
  "role": "" as const,
  "alias": "var(--ll-ink-you)" as const,
  "group": "shadcn" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--chart-3" as const,
  "value": "#3b7a4b" as const,
  "role": "" as const,
  "alias": "var(--ll-green)" as const,
  "group": "shadcn" as const,
  "onPaper": 4.74,
  "onDesk": 2.86,
  "inkOn": 2.97
}, {
  "token": "--chart-4" as const,
  "value": "#a87f0c" as const,
  "role": "" as const,
  "alias": "var(--ll-hi-deep)" as const,
  "group": "shadcn" as const,
  "onPaper": 3.38,
  "onDesk": 2.04,
  "inkOn": 4.16
}, {
  "token": "--chart-5" as const,
  "value": "#8f6fd6" as const,
  "role": "" as const,
  "alias": "var(--ll-grape)" as const,
  "group": "shadcn" as const,
  "onPaper": 3.56,
  "onDesk": 2.15,
  "inkOn": 3.95
}, {
  "token": "--sidebar" as const,
  "value": "#f8f2de" as const,
  "role": "" as const,
  "alias": "var(--ll-pad)" as const,
  "group": "shadcn" as const,
  "onPaper": 1.03,
  "onDesk": 1.61,
  "inkOn": 13.67
}, {
  "token": "--sidebar-foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--sidebar-primary" as const,
  "value": "#df6b3c" as const,
  "role": "" as const,
  "alias": "var(--ll-marker)" as const,
  "group": "shadcn" as const,
  "onPaper": 3.06,
  "onDesk": 1.85,
  "inkOn": 4.6
}, {
  "token": "--sidebar-primary-foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--sidebar-accent" as const,
  "value": "#f8e9a4" as const,
  "role": "" as const,
  "alias": "color-mix(in srgb, var(--ll-hi) 40%, var(--ll-pad))" as const,
  "group": "shadcn" as const,
  "onPaper": 1.12,
  "onDesk": 1.48,
  "inkOn": 12.53
}, {
  "token": "--sidebar-accent-foreground" as const,
  "value": "#2a2420" as const,
  "role": "" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "shadcn" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--sidebar-border" as const,
  "value": "#b2c3dc" as const,
  "role": "" as const,
  "alias": "var(--ll-pad-rule)" as const,
  "group": "shadcn" as const,
  "onPaper": 1.64,
  "onDesk": 1.01,
  "inkOn": 8.55
}, {
  "token": "--sidebar-ring" as const,
  "value": "#2c4f9e" as const,
  "role": "" as const,
  "alias": "var(--ll-focus)" as const,
  "group": "shadcn" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--ll-umber" as const,
  "value": "#3a2c1e" as const,
  "role": "color form of the shade triplet, for color-mix()" as const,
  "alias": "rgb(var(--ll-shade))" as const,
  "group": "paper" as const,
  "onPaper": 12.37,
  "onDesk": 7.47,
  "inkOn": 1.14
}, {
  "token": "--ll-line" as const,
  "value": "#8e887f" as const,
  "role": "drawn hairlines" as const,
  "alias": "var(--ll-pencil-mark)" as const,
  "group": "paper" as const,
  "onPaper": 3.23,
  "onDesk": 1.95,
  "inkOn": 4.36
}, {
  "token": "--ll-line-soft" as const,
  "value": "rgba(142,136,127,0.55)" as const,
  "role": "fallback borders, table rules" as const,
  "alias": "color-mix(in srgb, var(--ll-pencil-mark) 55%, transparent)" as const,
  "group": "paper" as const,
  "onPaper": 1.79,
  "onDesk": 1.42,
  "inkOn": 8.26
}, {
  "token": "--ll-link" as const,
  "value": "#2c4f9e" as const,
  "role": "" as const,
  "alias": "var(--ll-ink-you)" as const,
  "group": "paper" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--ll-input-ink" as const,
  "value": "#2c4f9e" as const,
  "role": "what you type is blue felt" as const,
  "alias": "var(--ll-ink-you)" as const,
  "group": "paper" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--ll-caret" as const,
  "value": "#2c4f9e" as const,
  "role": "" as const,
  "alias": "var(--ll-ink-you)" as const,
  "group": "paper" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--ll-placeholder" as const,
  "value": "#5a554e" as const,
  "role": "" as const,
  "alias": "var(--ll-pencil-text)" as const,
  "group": "paper" as const,
  "onPaper": 6.78,
  "onDesk": 4.09,
  "inkOn": 2.07
}, {
  "token": "--ll-hi-select" as const,
  "value": "rgba(248,220,76,0.62)" as const,
  "role": "::selection, <mark>, hover swipes" as const,
  "alias": "color-mix(in srgb, var(--ll-hi) 62%, transparent)" as const,
  "group": "paper" as const,
  "onPaper": 1.16,
  "onDesk": 1.17,
  "inkOn": 12.51
}, {
  "token": "--ll-selection-text" as const,
  "value": "#2a2420" as const,
  "role": "must stay dark" as const,
  "alias": "var(--ll-ink)" as const,
  "group": "paper" as const,
  "onPaper": 14.06,
  "onDesk": 8.49,
  "inkOn": 1
}, {
  "token": "--ll-riso" as const,
  "value": "#df6b3c" as const,
  "role": "default offset color of .ll-riso; set it on a title to change it" as const,
  "alias": "var(--ll-marker)" as const,
  "group": "paper" as const,
  "onPaper": 3.06,
  "onDesk": 1.85,
  "inkOn": 4.6
}, {
  "token": "--ll-stamp-fill" as const,
  "value": "rgba(223,107,60,0.5)" as const,
  "role": "" as const,
  "alias": "color-mix(in srgb, var(--ll-marker) 50%, transparent)" as const,
  "group": "paper" as const,
  "onPaper": 1.72,
  "onDesk": 1.41,
  "inkOn": 8.58
}, {
  "token": "--ll-stamp-fill-red" as const,
  "value": "rgba(194,65,45,0.28)" as const,
  "role": "" as const,
  "alias": "color-mix(in srgb, var(--ll-red) 28%, transparent)" as const,
  "group": "paper" as const,
  "onPaper": 1.49,
  "onDesk": 1.38,
  "inkOn": 10.12
}, {
  "token": "--ll-stamp-fill-green" as const,
  "value": "rgba(59,122,75,0.24)" as const,
  "role": "" as const,
  "alias": "color-mix(in srgb, var(--ll-green) 24%, transparent)" as const,
  "group": "paper" as const,
  "onPaper": 1.37,
  "onDesk": 1.26,
  "inkOn": 11.07
}, {
  "token": "--ll-diff-add" as const,
  "value": "rgba(59,122,75,0.16)" as const,
  "role": "" as const,
  "alias": "color-mix(in srgb, var(--ll-green) 16%, transparent)" as const,
  "group": "paper" as const,
  "onPaper": 1.23,
  "onDesk": 1.15,
  "inkOn": 12.42
}, {
  "token": "--ll-diff-del" as const,
  "value": "rgba(194,65,45,0.14)" as const,
  "role": "" as const,
  "alias": "color-mix(in srgb, var(--ll-red) 14%, transparent)" as const,
  "group": "paper" as const,
  "onPaper": 1.21,
  "onDesk": 1.17,
  "inkOn": 12.48
}, {
  "token": "--ll-syn-keyword" as const,
  "value": "#ad3d2b" as const,
  "role": "code colors: red / green / orange pencil pulled toward ink so they pass 4.5:1 on the paper-shade code chip" as const,
  "alias": "color-mix(in srgb, var(--ll-red), var(--ll-ink) 14%)" as const,
  "group": "paper" as const,
  "onPaper": 5.54,
  "onDesk": 3.35,
  "inkOn": 2.54
}, {
  "token": "--ll-syn-string" as const,
  "value": "#396e45" as const,
  "role": "" as const,
  "alias": "color-mix(in srgb, var(--ll-green), var(--ll-ink) 14%)" as const,
  "group": "paper" as const,
  "onPaper": 5.53,
  "onDesk": 3.34,
  "inkOn": 2.54
}, {
  "token": "--ll-syn-name" as const,
  "value": "#2c4f9e" as const,
  "role": "" as const,
  "alias": "var(--ll-ink-you)" as const,
  "group": "paper" as const,
  "onPaper": 7.09,
  "onDesk": 4.28,
  "inkOn": 1.98
}, {
  "token": "--ll-syn-number" as const,
  "value": "#984c29" as const,
  "role": "" as const,
  "alias": "color-mix(in srgb, var(--ll-orange-text), var(--ll-ink) 10%)" as const,
  "group": "paper" as const,
  "onPaper": 5.67,
  "onDesk": 3.42,
  "inkOn": 2.48
}, {
  "token": "--ll-syn-comment" as const,
  "value": "#5a554e" as const,
  "role": "" as const,
  "alias": "var(--ll-pencil-text)" as const,
  "group": "paper" as const,
  "onPaper": 6.78,
  "onDesk": 4.09,
  "inkOn": 2.07
}];
export const ALIASES: Record<string, Expr> = {
  "--chart-1": "--ll-marker" as const,
  "--chart-2": "--ll-ink-you" as const,
  "--chart-3": "--ll-green" as const,
  "--chart-4": "--ll-hi-deep" as const,
  "--chart-5": "--ll-grape" as const
};
export const CONTRAST: ContrastRow[] = [{
  "fg": "foreground" as const,
  "bg": "background" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 8.49,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on the desk (text straight on the desk: ink / ink-soft / muted only)" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-desk" as const
  }
}, {
  "fg": "card-foreground" as const,
  "bg": "card" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 14.06,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on paper" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "popover-foreground" as const,
  "bg": "popover" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 14.43,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on a slip (menus, popovers)" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 12.32,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on paper-shade (code chips, muted fills)" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 14.43,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on slip" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 14.19,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on index card" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-card" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-graph" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f4f7ef" as const,
  "ratio": 14.14,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on graph paper" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-graph" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-kraft" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#dcc8a3" as const,
  "ratio": 9.36,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on kraft" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-kraft" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-check" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#dfe9d8" as const,
  "ratio": 12.24,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on ledger" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-check" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 13.67,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on pad (sidebar)" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-pad" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-photo" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fffdf6" as const,
  "ratio": 15.04,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on photo border" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-photo" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-yellow" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f7e38a" as const,
  "ratio": 11.89,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on a yellow sticky note" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-sticky-yellow" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-green" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#cfe6a8" as const,
  "ratio": 11.33,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on a green sticky note" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-sticky-green" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-orange" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f7c08e" as const,
  "ratio": 9.39,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on an orange sticky note" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-sticky-orange" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-pink" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f6b8b0" as const,
  "ratio": 9.04,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on a pink sticky note" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-sticky-pink" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-blue" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#bcd8f0" as const,
  "ratio": 10.37,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on a blue sticky note" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-sticky-blue" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-hi" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8dc4c" as const,
  "ratio": 11.18,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink on highlighter yellow" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-hi" as const
  }
}, {
  "fg": "--ll-selection-text" as const,
  "bg": "--ll-hi-select" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8e68a" as const,
  "ratio": 12.16,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "selected text on paper (highlighter at 62% flattened onto paper)" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": null
}, {
  "fg": "--ll-selection-text" as const,
  "bg": "--ll-hi-select" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#dad476" as const,
  "ratio": 9.96,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "selected text on the desk" as const,
  "section": "Body text: ink on every stock (AAA)" as const,
  "live": null
}, {
  "fg": "--ll-ink-soft" as const,
  "bg": "--ll-desk" as const,
  "fgHex": "#4a423b" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 5.46,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink-soft directly on the desk" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-soft" as const,
    "bg": "--ll-desk" as const
  }
}, {
  "fg": "--ll-ink-soft" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#4a423b" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 9.04,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink-soft on paper" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-soft" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "muted-foreground" as const,
  "bg": "background" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 5.39,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "muted text on the desk" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-muted" as const,
    "bg": "--ll-desk" as const
  }
}, {
  "fg": "muted-foreground" as const,
  "bg": "card" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 8.93,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "muted text on paper" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-muted" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "muted-foreground" as const,
  "bg": "muted" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 7.83,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "muted text on paper-shade" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-muted" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "muted-foreground" as const,
  "bg": "popover" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 9.17,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "muted text on a slip" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-muted" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-ink-muted" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 8.68,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "muted text on the pad" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-muted" as const,
    "bg": "--ll-pad" as const
  }
}, {
  "fg": "--ll-pencil-text" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 6.78,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "graphite text on paper" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-pencil-text" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 5.94,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "graphite text on paper-shade" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-pencil-text" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 6.96,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "graphite text on a slip" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-pencil-text" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 6.84,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "graphite text on an index card" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-card" as const
  }
}, {
  "fg": "--ll-pencil" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#6b6660" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 5.22,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "drawn graphite (meta marks, large text) on paper" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-pencil" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#6b6660" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.57,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "drawn graphite on paper-shade" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-placeholder" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 6.78,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "placeholder on paper" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-placeholder" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 5.94,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "placeholder on paper-shade" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-placeholder" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 6.96,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "placeholder on a slip" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-input-ink" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "typed text (blue felt) on paper (Notebook 7.09)" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-input-ink" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 6.21,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "typed text on paper-shade" as const,
  "section": "Secondary text (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "blue felt (you, links) on paper" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-red" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 4.72,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "red pencil (error text) on paper" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-red" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-green" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#3b7a4b" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 4.74,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "green pencil (ok text) on paper" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-green" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 7.28,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "blue felt (you, links) on a slip" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-red" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 4.84,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "red pencil (error text) on a slip" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-red" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-green" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#3b7a4b" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 4.86,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "green pencil (ok text) on a slip" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-green" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 7.16,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "blue felt (you, links) on an index card" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-card" as const
  }
}, {
  "fg": "--ll-red" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 4.76,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "red pencil (error text) on an index card" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-red" as const,
    "bg": "--ll-card" as const
  }
}, {
  "fg": "--ll-green" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#3b7a4b" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 4.78,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "green pencil (ok text) on an index card" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-green" as const,
    "bg": "--ll-card" as const
  }
}, {
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 6.21,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "blue felt on paper-shade" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 6.89,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "blue felt on the pad" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-pad" as const
  }
}, {
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-desk" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 4.28,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "blue felt on the desk: large marks and focus only, never small text" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-desk" as const
  }
}, {
  "fg": "--ll-red" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.13,
  "min": 4.5,
  "level": "warn" as const,
  "status": "warn" as const,
  "purpose": "red pencil on paper-shade: errors belong on paper, not on muted fills" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-red" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-orange-text" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#a4502a" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 5.13,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "working / warm status text on paper" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-orange-text" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-link" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "link on paper" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-link-hover" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#1f3b7a" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 9.82,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "link on hover, on paper" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-link-hover" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "destructive" as const,
  "bg": "card" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 4.72,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "destructive text and icons on paper" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-red" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-check-ink" as const,
  "bg": "--ll-check" as const,
  "fgHex": "#2f6b45" as const,
  "bgHex": "#dfe9d8" as const,
  "ratio": 5.07,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ledger print" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-check-ink" as const,
    "bg": "--ll-check" as const
  }
}, {
  "fg": "--ll-check-no" as const,
  "bg": "--ll-check" as const,
  "fgHex": "#b23a28" as const,
  "bgHex": "#dfe9d8" as const,
  "ratio": 4.76,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ledger 'no' red" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-check-no" as const,
    "bg": "--ll-check" as const
  }
}, {
  "fg": "--ll-syn-keyword" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#ad3d2b" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 5.69,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: keyword on a slip" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": ["--ll-red", 86, "--ll-ink"],
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-syn-keyword" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#ad3d2b" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.86,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: keyword on a code chip (paper-shade)" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": ["--ll-red", 86, "--ll-ink"],
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-syn-string" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#396e45" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 5.67,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: string on a slip" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": ["--ll-green", 86, "--ll-ink"],
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-syn-string" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#396e45" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.84,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: string on a code chip (paper-shade)" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": ["--ll-green", 86, "--ll-ink"],
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-syn-name" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 7.28,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: name on a slip" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-syn-name" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 6.21,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: name on a code chip (paper-shade)" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-ink-you" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-syn-number" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#984c29" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 5.82,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: number on a slip" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": ["--ll-orange-text", 90, "--ll-ink"],
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-syn-number" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#984c29" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.97,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: number on a code chip (paper-shade)" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": ["--ll-orange-text", 90, "--ll-ink"],
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-syn-comment" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 6.96,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: comment on a slip" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-syn-comment" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 5.94,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "code: comment on a code chip (paper-shade)" as const,
  "section": "Meaning inks on paper (AA)" as const,
  "live": {
    "fg": "--ll-pencil-text" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "primary-foreground" as const,
  "bg": "primary" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#df6b3c" as const,
  "ratio": 4.6,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ink label on the terracotta marker (primary button)" as const,
  "section": "Filled controls (labels)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-marker" as const
  }
}, {
  "fg": "secondary-foreground" as const,
  "bg": "secondary" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8ecb5" as const,
  "ratio": 12.87,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "label on the highlighter tint (secondary button)" as const,
  "section": "Filled controls (labels)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": ["--ll-hi", 35, "--ll-paper"]
  }
}, {
  "fg": "accent-foreground" as const,
  "bg": "accent" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8e68a" as const,
  "ratio": 12.16,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "hover / selected row text on the highlighter wash" as const,
  "section": "Filled controls (labels)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": ["--ll-hi", 62, "--ll-paper"]
  }
}, {
  "fg": "destructive-foreground" as const,
  "bg": "destructive" as const,
  "fgHex": "#fbf8f1" as const,
  "bgHex": "#c2412d" as const,
  "ratio": 4.84,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "label on red pencil (destructive button)" as const,
  "section": "Filled controls (labels)" as const,
  "live": {
    "fg": "--ll-slip" as const,
    "bg": "--ll-red" as const
  }
}, {
  "fg": "sidebar-foreground" as const,
  "bg": "sidebar" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 13.67,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "sidebar text" as const,
  "section": "Filled controls (labels)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-pad" as const
  }
}, {
  "fg": "sidebar-primary-foreground" as const,
  "bg": "sidebar-primary" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#df6b3c" as const,
  "ratio": 4.6,
  "min": 4.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "sidebar primary label" as const,
  "section": "Filled controls (labels)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-marker" as const
  }
}, {
  "fg": "sidebar-accent-foreground" as const,
  "bg": "sidebar-accent" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8e9a4" as const,
  "ratio": 12.53,
  "min": 7,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "sidebar hover / selected text" as const,
  "section": "Filled controls (labels)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": ["--ll-hi", 40, "--ll-pad"]
  }
}, {
  "fg": "ring" as const,
  "bg": "background" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 4.28,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "focus mark on the desk" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-focus" as const,
    "bg": "--ll-desk" as const
  }
}, {
  "fg": "ring" as const,
  "bg": "card" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "focus mark on paper" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-focus" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "--ll-focus" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 7.28,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "focus mark on a slip" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-focus" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-focus" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 6.21,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "focus mark on paper-shade" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-focus" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-focus" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 6.89,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "focus mark on the pad" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-focus" as const,
    "bg": "--ll-pad" as const
  }
}, {
  "fg": "sidebar-ring" as const,
  "bg": "sidebar" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 6.89,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "sidebar focus mark" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-focus" as const,
    "bg": "--ll-pad" as const
  }
}, {
  "fg": "border" as const,
  "bg": "card" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.23,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "input boundary / drawn line on paper" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-pencil-mark" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "input" as const,
  "bg": "card" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.23,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "field outline on paper" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-pencil-mark" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "border" as const,
  "bg": "popover" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 3.31,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "drawn line on a slip" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-pencil-mark" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-line" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.23,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "hairline mark on paper" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-pencil-mark" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "border" as const,
  "bg": "background" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 1.95,
  "min": 1.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "drawn line on the desk (decorative hairline)" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-pencil-mark" as const,
    "bg": "--ll-desk" as const
  }
}, {
  "fg": "border" as const,
  "bg": "muted" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 2.83,
  "min": 1.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "drawn line on paper-shade (decorative hairline)" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-pencil-mark" as const,
    "bg": "--ll-paper-shade" as const
  }
}, {
  "fg": "--ll-paper" as const,
  "bg": "--ll-desk" as const,
  "fgHex": "#f8f5ee" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 1.66,
  "min": 1.3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "paper must read lighter than the desk (Notebook 1.95; the palest Penpal pairing, stone table, is 1.3)" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-paper" as const,
    "bg": "--ll-desk" as const
  }
}, {
  "fg": "--ll-rule-blue" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#8fb0d4" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 2.09,
  "min": 1.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "index-card ruling" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-rule-blue" as const,
    "bg": "--ll-card" as const
  }
}, {
  "fg": "--ll-rule-red" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#d9776a" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 2.86,
  "min": 1.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "index-card header line" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-rule-red" as const,
    "bg": "--ll-card" as const
  }
}, {
  "fg": "--ll-pad-rule" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#b2c3dc" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 1.6,
  "min": 1.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "pad ruling (sidebar-border)" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-pad-rule" as const,
    "bg": "--ll-pad" as const
  }
}, {
  "fg": "sidebar-border" as const,
  "bg": "sidebar" as const,
  "fgHex": "#b2c3dc" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 1.6,
  "min": 1.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "sidebar divider" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-pad-rule" as const,
    "bg": "--ll-pad" as const
  }
}, {
  "fg": "--ll-check-rule" as const,
  "bg": "--ll-check" as const,
  "fgHex": "#7fa37c" as const,
  "bgHex": "#dfe9d8" as const,
  "ratio": 2.26,
  "min": 1.5,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "ledger ruling" as const,
  "section": "Focus and non-text marks (WCAG 1.4.11)" as const,
  "live": {
    "fg": "--ll-check-rule" as const,
    "bg": "--ll-check" as const
  }
}, {
  "fg": "chart-1" as const,
  "bg": "card" as const,
  "fgHex": "#df6b3c" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.06,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "chart series 1 on paper" as const,
  "section": "Chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "live": {
    "fg": "--chart-1" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "chart-2" as const,
  "bg": "card" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "chart series 2 on paper" as const,
  "section": "Chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "live": {
    "fg": "--chart-2" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "chart-3" as const,
  "bg": "card" as const,
  "fgHex": "#3b7a4b" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 4.74,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "chart series 3 on paper" as const,
  "section": "Chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "live": {
    "fg": "--chart-3" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "chart-4" as const,
  "bg": "card" as const,
  "fgHex": "#a87f0c" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.38,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "chart series 4 on paper" as const,
  "section": "Chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "live": {
    "fg": "--chart-4" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "chart-5" as const,
  "bg": "card" as const,
  "fgHex": "#8f6fd6" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.56,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "chart series 5 on paper" as const,
  "section": "Chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "live": {
    "fg": "--chart-5" as const,
    "bg": "--ll-paper" as const
  }
}, {
  "fg": "chart-1" as const,
  "bg": "popover" as const,
  "fgHex": "#df6b3c" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 3.14,
  "min": 3,
  "level": "error" as const,
  "status": "ok" as const,
  "purpose": "chart series 1 on a slip (tooltips)" as const,
  "section": "Chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "live": {
    "fg": "--chart-1" as const,
    "bg": "--ll-slip" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-tomato" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#e8483a" as const,
  "ratio": 3.95,
  "min": 4.5,
  "level": "warn" as const,
  "status": "warn" as const,
  "purpose": "ink label on a tomato sticker / badge" as const,
  "section": "Decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-tomato" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-tangerine" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f59a2f" as const,
  "ratio": 6.96,
  "min": 4.5,
  "level": "warn" as const,
  "status": "ok" as const,
  "purpose": "ink label on a tangerine sticker / badge" as const,
  "section": "Decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-tangerine" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-lemon" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fbd63a" as const,
  "ratio": 10.78,
  "min": 4.5,
  "level": "warn" as const,
  "status": "ok" as const,
  "purpose": "ink label on a lemon sticker / badge" as const,
  "section": "Decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-lemon" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-grass" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#5db85c" as const,
  "ratio": 6.18,
  "min": 4.5,
  "level": "warn" as const,
  "status": "ok" as const,
  "purpose": "ink label on a grass sticker / badge" as const,
  "section": "Decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-grass" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-teal" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#2fb1a3" as const,
  "ratio": 5.79,
  "min": 4.5,
  "level": "warn" as const,
  "status": "ok" as const,
  "purpose": "ink label on a teal sticker / badge" as const,
  "section": "Decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-teal" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-sky" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#4aa8e8" as const,
  "ratio": 5.87,
  "min": 4.5,
  "level": "warn" as const,
  "status": "ok" as const,
  "purpose": "ink label on a sky sticker / badge" as const,
  "section": "Decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-sky" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-grape" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#8f6fd6" as const,
  "ratio": 3.95,
  "min": 4.5,
  "level": "warn" as const,
  "status": "warn" as const,
  "purpose": "ink label on a grape sticker / badge" as const,
  "section": "Decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-grape" as const
  }
}, {
  "fg": "--ll-ink" as const,
  "bg": "--ll-bubblegum" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f38bb8" as const,
  "ratio": 6.7,
  "min": 4.5,
  "level": "warn" as const,
  "status": "ok" as const,
  "purpose": "ink label on a bubblegum sticker / badge" as const,
  "section": "Decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "live": {
    "fg": "--ll-ink" as const,
    "bg": "--ll-bubblegum" as const
  }
}];
export const KNOBS: KnobRow[] = [{
  "token": "--ll-wobble" as const,
  "value": "1" as const,
  "role": "1 = felt-tip hand; lower is a steadier hand" as const,
  "readBy": "code" as const
}, {
  "token": "--ll-stroke-fine" as const,
  "value": "1.7" as const,
  "role": "fine-liner weight class" as const,
  "readBy": "code" as const
}, {
  "token": "--ll-stroke-brush" as const,
  "value": "3.2" as const,
  "role": "brush weight class" as const,
  "readBy": "reserved" as const
}, {
  "token": "--ll-bleed" as const,
  "value": "6" as const,
  "role": "ink overshoot padding around a control" as const,
  "readBy": "code" as const
}, {
  "token": "--ll-bleed-loop" as const,
  "value": "11" as const,
  "role": "padding for hand-drawn loops and rings" as const,
  "readBy": "reserved" as const
}, {
  "token": "--ll-bleed-focus" as const,
  "value": "10" as const,
  "role": "focus ring bleed; the ring never changes layout" as const,
  "readBy": "reserved" as const
}, {
  "token": "--ll-misreg-sm" as const,
  "value": "3.2" as const,
  "role": "marker fill misses the outline by this much" as const,
  "readBy": "reserved" as const
}, {
  "token": "--ll-misreg-md" as const,
  "value": "4.6" as const,
  "role": "" as const,
  "readBy": "reserved" as const
}, {
  "token": "--ll-misreg-lg" as const,
  "value": "6" as const,
  "role": "" as const,
  "readBy": "reserved" as const
}, {
  "token": "--ll-misreg-k" as const,
  "value": "1" as const,
  "role": "effective misregistration = --ll-misreg-* x this (0 in calm)" as const,
  "readBy": "css+code" as const
}, {
  "token": "--ll-jitter-k" as const,
  "value": "1" as const,
  "role": "per-word jitter strength (0 in calm and reduced motion)" as const,
  "readBy": "css+code" as const
}, {
  "token": "--ll-tilt-max" as const,
  "value": "2deg" as const,
  "role": "no sheet is turned further than this" as const,
  "readBy": "css+code" as const
}, {
  "token": "--ll-tilt-turn" as const,
  "value": "0.6deg" as const,
  "role": "typical turn of a page-sized sheet" as const,
  "readBy": "reserved" as const
}, {
  "token": "--ll-hover-tilt" as const,
  "value": "-0.9deg" as const,
  "role": "what a hovered control's drawing turns by" as const,
  "readBy": "css+code" as const
}, {
  "token": "--ll-hover-misreg" as const,
  "value": "0.35" as const,
  "role": "hover moves each fill further along its misregistration vector by this share (x1.35)" as const,
  "readBy": "css" as const
}, {
  "token": "--ll-press-misreg" as const,
  "value": "-0.78" as const,
  "role": "pressed pulls it back into register (x.22)" as const,
  "readBy": "css" as const
}, {
  "token": "--ll-press-sink" as const,
  "value": "1px" as const,
  "role": "how far a pressed control's drawing sinks" as const,
  "readBy": "css+code" as const
}, {
  "token": "--ll-shadow-k" as const,
  "value": "1" as const,
  "role": "multiplies every shadow alpha (dark themes: ~2.5)" as const,
  "readBy": "css+code" as const
}, {
  "token": "--ll-grain" as const,
  "value": "1" as const,
  "role": "opacity multiplier of pen grain masks" as const,
  "readBy": "reserved" as const
}, {
  "token": "--ll-blend" as const,
  "value": "multiply" as const,
  "role": "marker and highlighter blend mode (dark themes: normal)" as const,
  "readBy": "css+code" as const
}];
export const GEOMETRY: KnobRow[] = [{
  "token": "--ll-hit" as const,
  "value": "40px" as const,
  "role": "comfortable hit box; density changes it (32 compact, 28 calm)" as const,
  "readBy": "css+code" as const
}, {
  "token": "--ll-hit-min" as const,
  "value": "24px" as const,
  "role": "the floor for any DOM hit box (WCAG 2.5.8)" as const,
  "readBy": "css" as const
}, {
  "token": "--ll-ink-room" as const,
  "value": "0.2em" as const,
  "role": "hand-font glyphs overhang their advance; clipped labels get this room" as const,
  "readBy": "css" as const
}, {
  "token": "--ll-sheet-radius" as const,
  "value": "1px" as const,
  "role": "a cut sheet: guillotine, not a rounded card" as const,
  "readBy": "css" as const
}];
export const DURATIONS: DurationRow[] = [{
  "token": "--ll-dur-press" as const,
  "name": "press" as const,
  "seconds": 0.09,
  "ms": 90,
  "role": "" as const
}, {
  "token": "--ll-dur-hover" as const,
  "name": "hover" as const,
  "seconds": 0.12,
  "ms": 120,
  "role": "" as const
}, {
  "token": "--ll-dur-fade" as const,
  "name": "fade" as const,
  "seconds": 0.15,
  "ms": 150,
  "role": "" as const
}, {
  "token": "--ll-dur-pop" as const,
  "name": "pop" as const,
  "seconds": 0.18,
  "ms": 180,
  "role": "" as const
}, {
  "token": "--ll-dur-sheet" as const,
  "name": "sheet" as const,
  "seconds": 0.3,
  "ms": 300,
  "role": "" as const
}, {
  "token": "--ll-dur-drop" as const,
  "name": "drop" as const,
  "seconds": 0.34,
  "ms": 340,
  "role": "" as const
}, {
  "token": "--ll-dur-toss" as const,
  "name": "toss" as const,
  "seconds": 0.44,
  "ms": 440,
  "role": "" as const
}, {
  "token": "--ll-dur-soak" as const,
  "name": "soak" as const,
  "seconds": 0.52,
  "ms": 520,
  "role": "" as const
}, {
  "token": "--ll-dur-boil" as const,
  "name": "boil" as const,
  "seconds": 0.48,
  "ms": 480,
  "role": "" as const
}, {
  "token": "--ll-dur-draw" as const,
  "name": "draw" as const,
  "seconds": 0.6,
  "ms": 600,
  "role": "" as const
}];
export const EASINGS: EasingRow[] = [{
  "token": "--ll-ease-out" as const,
  "name": "out" as const,
  "css": "ease-out" as const,
  "bezier": [0, 0, 0.58, 1],
  "role": "" as const
}, {
  "token": "--ll-ease-in" as const,
  "name": "in" as const,
  "css": "ease-in" as const,
  "bezier": [0.42, 0, 1, 1],
  "role": "" as const
}, {
  "token": "--ll-ease-settle" as const,
  "name": "settle" as const,
  "css": "cubic-bezier(0.2, 0.9, 0.25, 1.12)" as const,
  "bezier": [0.2, 0.9, 0.25, 1.12],
  "role": "overshoots a little, then settles" as const
}, {
  "token": "--ll-ease-pop" as const,
  "name": "pop" as const,
  "css": "cubic-bezier(0.2, 0.9, 0.3, 1.15)" as const,
  "bezier": [0.2, 0.9, 0.3, 1.15],
  "role": "" as const
}, {
  "token": "--ll-ease-dialog" as const,
  "name": "dialog" as const,
  "css": "cubic-bezier(0.2, 0.85, 0.25, 1.08)" as const,
  "bezier": [0.2, 0.85, 0.25, 1.08],
  "role": "" as const
}];
export const DENSITY: Record<"comfortable" | "compact" | "calm", Record<string, string>> = {
  "comfortable": {
    "--ll-hit": "40px" as const,
    "--ll-wobble": "1" as const,
    "--ll-stroke-fine": "1.7" as const,
    "--ll-stroke-brush": "3.2" as const,
    "--ll-misreg-k": "1" as const,
    "--ll-jitter-k": "1" as const,
    "--ll-tilt-max": "2deg" as const,
    "--ll-tilt-turn": "0.6deg" as const
  },
  "compact": {
    "--ll-hit": "32px" as const,
    "--ll-wobble": "1" as const,
    "--ll-stroke-fine": "1.7" as const,
    "--ll-stroke-brush": "3.2" as const,
    "--ll-misreg-k": "1" as const,
    "--ll-jitter-k": "1" as const,
    "--ll-tilt-max": "2deg" as const,
    "--ll-tilt-turn": "0.6deg" as const
  },
  "calm": {
    "--ll-hit": "28px" as const,
    "--ll-wobble": "0.6" as const,
    "--ll-stroke-fine": "1" as const,
    "--ll-stroke-brush": "1.6" as const,
    "--ll-misreg-k": "0" as const,
    "--ll-jitter-k": "0" as const,
    "--ll-tilt-max": "0deg" as const,
    "--ll-tilt-turn": "0deg" as const
  }
};
export const FONTS: Record<string, number[]> = {
  "kalam": [400, 700],
  "caveat": [400, 500, 600, 700],
  "special-elite": [400],
  "ibm-plex-mono": [400, 500]
};
export const T0: Record<string, string> = {
  "--ll-desk": "#a8c8bb" as const,
  "--ll-desk-deep": "#93b4a7" as const,
  "--ll-paper": "#f8f5ee" as const,
  "--ll-paper-shade": "#ece6da" as const,
  "--ll-slip": "#fbf8f1" as const,
  "--ll-card": "#fbf6e9" as const,
  "--ll-graph": "#f4f7ef" as const,
  "--ll-kraft": "#dcc8a3" as const,
  "--ll-check": "#dfe9d8" as const,
  "--ll-pad": "#f8f2de" as const,
  "--ll-photo": "#fffdf6" as const,
  "--ll-rule-blue": "#8fb0d4" as const,
  "--ll-rule-red": "#d9776a" as const,
  "--ll-pad-rule": "#b2c3dc" as const,
  "--ll-check-rule": "#7fa37c" as const,
  "--ll-sticky-yellow": "#f7e38a" as const,
  "--ll-sticky-green": "#cfe6a8" as const,
  "--ll-sticky-orange": "#f7c08e" as const,
  "--ll-sticky-pink": "#f6b8b0" as const,
  "--ll-sticky-blue": "#bcd8f0" as const,
  "--ll-ink": "#2a2420" as const,
  "--ll-ink-soft": "#4a423b" as const,
  "--ll-ink-muted": "#4a433c" as const,
  "--ll-ink-you": "#2c4f9e" as const,
  "--ll-pencil": "#6b6660" as const,
  "--ll-pencil-text": "#5a554e" as const,
  "--ll-pencil-mark": "#8e887f" as const,
  "--ll-red": "#c2412d" as const,
  "--ll-green": "#3b7a4b" as const,
  "--ll-marker": "#df6b3c" as const,
  "--ll-orange-text": "#a4502a" as const,
  "--ll-hi": "#f8dc4c" as const,
  "--ll-hi-deep": "#a87f0c" as const,
  "--ll-focus": "#2c4f9e" as const,
  "--ll-link-hover": "#1f3b7a" as const,
  "--ll-check-ink": "#2f6b45" as const,
  "--ll-check-no": "#b23a28" as const,
  "--ll-tomato": "#e8483a" as const,
  "--ll-tangerine": "#f59a2f" as const,
  "--ll-lemon": "#fbd63a" as const,
  "--ll-grass": "#5db85c" as const,
  "--ll-teal": "#2fb1a3" as const,
  "--ll-sky": "#4aa8e8" as const,
  "--ll-grape": "#8f6fd6" as const,
  "--ll-bubblegum": "#f38bb8" as const,
  "--ll-shade": "58 44 30" as const
};
export const FOREST: ForestData = {
  "steps": [{
    "id": "surfaces" as const,
    "title": "Surfaces" as const,
    "note": "Pale sage felt for the desk, warm cream for the paper, a kraft-tinted slip. The rules on ruled stocks follow." as const,
    "decls": {
      "--ll-desk": "#cdd2bb" as const,
      "--ll-desk-deep": "#b6bea0" as const,
      "--ll-paper": "#f3eee0" as const,
      "--ll-paper-shade": "#e7e0cc" as const,
      "--ll-slip": "#e7dbbf" as const,
      "--ll-card": "#f6f1e1" as const,
      "--ll-graph": "#eef1e2" as const,
      "--ll-kraft": "#d9c39a" as const,
      "--ll-check": "#e3e7cf" as const,
      "--ll-pad": "#f3eddc" as const,
      "--ll-photo": "#fbf8ee" as const,
      "--ll-rule-blue": "#93a983" as const,
      "--ll-rule-red": "#c98a7a" as const,
      "--ll-pad-rule": "#aebc9c" as const,
      "--ll-check-rule": "#8aa47b" as const
    },
    "check": {
      "pairs": 105,
      "fails": [{
        "fg": "--ll-pencil" as const,
        "bg": "--ll-paper-shade" as const,
        "fgHex": "#6b6660" as const,
        "bgHex": "#e7e0cc" as const,
        "ratio": 4.31,
        "min": 4.5,
        "purpose": "drawn graphite on paper-shade" as const
      }, {
        "fg": "--ll-red" as const,
        "bg": "--ll-paper" as const,
        "fgHex": "#c2412d" as const,
        "bgHex": "#f3eee0" as const,
        "ratio": 4.43,
        "min": 4.5,
        "purpose": "red pencil (error text) on paper" as const
      }, {
        "fg": "--ll-green" as const,
        "bg": "--ll-paper" as const,
        "fgHex": "#3b7a4b" as const,
        "bgHex": "#f3eee0" as const,
        "ratio": 4.45,
        "min": 4.5,
        "purpose": "green pencil (ok text) on paper" as const
      }, {
        "fg": "--ll-red" as const,
        "bg": "--ll-slip" as const,
        "fgHex": "#c2412d" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 3.74,
        "min": 4.5,
        "purpose": "red pencil (error text) on a slip" as const
      }, {
        "fg": "--ll-green" as const,
        "bg": "--ll-slip" as const,
        "fgHex": "#3b7a4b" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 3.75,
        "min": 4.5,
        "purpose": "green pencil (ok text) on a slip" as const
      }, {
        "fg": "destructive" as const,
        "bg": "card" as const,
        "fgHex": "#c2412d" as const,
        "bgHex": "#f3eee0" as const,
        "ratio": 4.43,
        "min": 4.5,
        "purpose": "destructive text and icons on paper" as const
      }, {
        "fg": "--ll-syn-keyword" as const,
        "bg": "--ll-slip" as const,
        "fgHex": "#ad3d2b" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 4.39,
        "min": 4.5,
        "purpose": "code: keyword on a slip" as const
      }, {
        "fg": "--ll-syn-string" as const,
        "bg": "--ll-slip" as const,
        "fgHex": "#396e45" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 4.38,
        "min": 4.5,
        "purpose": "code: string on a slip" as const
      }, {
        "fg": "--ll-syn-number" as const,
        "bg": "--ll-slip" as const,
        "fgHex": "#984c29" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 4.49,
        "min": 4.5,
        "purpose": "code: number on a slip" as const
      }, {
        "fg": "destructive-foreground" as const,
        "bg": "destructive" as const,
        "fgHex": "#e7dbbf" as const,
        "bgHex": "#c2412d" as const,
        "ratio": 3.74,
        "min": 4.5,
        "purpose": "label on red pencil (destructive button)" as const
      }, {
        "fg": "border" as const,
        "bg": "popover" as const,
        "fgHex": "#8e887f" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 2.56,
        "min": 3,
        "purpose": "drawn line on a slip" as const
      }, {
        "fg": "chart-1" as const,
        "bg": "card" as const,
        "fgHex": "#df6b3c" as const,
        "bgHex": "#f3eee0" as const,
        "ratio": 2.87,
        "min": 3,
        "purpose": "chart series 1 on paper" as const
      }, {
        "fg": "chart-1" as const,
        "bg": "popover" as const,
        "fgHex": "#df6b3c" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 2.42,
        "min": 3,
        "purpose": "chart series 1 on a slip (tooltips)" as const
      }],
      "warns": 3
    }
  }, {
    "id": "inks" as const,
    "title": "Inks" as const,
    "note": "The felt tip goes green-black, blue felt becomes petrol teal, and the pencils get a greener gray. Focus follows the blue." as const,
    "decls": {
      "--ll-ink": "#262c24" as const,
      "--ll-ink-soft": "#454b40" as const,
      "--ll-ink-muted": "#3f453a" as const,
      "--ll-ink-you": "#1f5570" as const,
      "--ll-pencil": "#62625a" as const,
      "--ll-pencil-text": "#57564f" as const,
      "--ll-pencil-mark": "#7d7c73" as const,
      "--ll-red": "#943123" as const,
      "--ll-green": "#385b2e" as const,
      "--ll-orange-text": "#86441a" as const,
      "--ll-focus": "#1f5570" as const,
      "--ll-link-hover": "#163f55" as const,
      "--ll-check-ink": "#3a5b30" as const,
      "--ll-check-no": "#a0352a" as const
    },
    "check": {
      "pairs": 105,
      "fails": [{
        "fg": "primary-foreground" as const,
        "bg": "primary" as const,
        "fgHex": "#262c24" as const,
        "bgHex": "#df6b3c" as const,
        "ratio": 4.3,
        "min": 4.5,
        "purpose": "ink label on the terracotta marker (primary button)" as const
      }, {
        "fg": "sidebar-primary-foreground" as const,
        "bg": "sidebar-primary" as const,
        "fgHex": "#262c24" as const,
        "bgHex": "#df6b3c" as const,
        "ratio": 4.3,
        "min": 4.5,
        "purpose": "sidebar primary label" as const
      }, {
        "fg": "chart-1" as const,
        "bg": "card" as const,
        "fgHex": "#df6b3c" as const,
        "bgHex": "#f3eee0" as const,
        "ratio": 2.87,
        "min": 3,
        "purpose": "chart series 1 on paper" as const
      }, {
        "fg": "chart-1" as const,
        "bg": "popover" as const,
        "fgHex": "#df6b3c" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 2.42,
        "min": 3,
        "purpose": "chart series 1 on a slip (tooltips)" as const
      }],
      "warns": 2
    }
  }, {
    "id": "marker" as const,
    "title": "Marker and highlighter" as const,
    "note": "A softer terracotta and a straw-colored highlighter. This is the step the checker will object to." as const,
    "decls": {
      "--ll-marker": "#cf7a3d" as const,
      "--ll-hi": "#e3c86c" as const,
      "--ll-hi-deep": "#8f6d10" as const
    },
    "check": {
      "pairs": 105,
      "fails": [{
        "fg": "primary-foreground" as const,
        "bg": "primary" as const,
        "fgHex": "#262c24" as const,
        "bgHex": "#cf7a3d" as const,
        "ratio": 4.43,
        "min": 4.5,
        "purpose": "ink label on the terracotta marker (primary button)" as const
      }, {
        "fg": "sidebar-primary-foreground" as const,
        "bg": "sidebar-primary" as const,
        "fgHex": "#262c24" as const,
        "bgHex": "#cf7a3d" as const,
        "ratio": 4.43,
        "min": 4.5,
        "purpose": "sidebar primary label" as const
      }, {
        "fg": "chart-1" as const,
        "bg": "card" as const,
        "fgHex": "#cf7a3d" as const,
        "bgHex": "#f3eee0" as const,
        "ratio": 2.79,
        "min": 3,
        "purpose": "chart series 1 on paper" as const
      }, {
        "fg": "chart-1" as const,
        "bg": "popover" as const,
        "fgHex": "#cf7a3d" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 2.35,
        "min": 3,
        "purpose": "chart series 1 on a slip (tooltips)" as const
      }],
      "warns": 2
    }
  }, {
    "id": "shade" as const,
    "title": "Shadow color" as const,
    "note": "Shadows are umber in Notebook. In a green room they are green-black. It is one triplet." as const,
    "decls": {
      "--ll-shade": "34 42 28" as const
    },
    "check": {
      "pairs": 105,
      "fails": [{
        "fg": "primary-foreground" as const,
        "bg": "primary" as const,
        "fgHex": "#262c24" as const,
        "bgHex": "#cf7a3d" as const,
        "ratio": 4.43,
        "min": 4.5,
        "purpose": "ink label on the terracotta marker (primary button)" as const
      }, {
        "fg": "sidebar-primary-foreground" as const,
        "bg": "sidebar-primary" as const,
        "fgHex": "#262c24" as const,
        "bgHex": "#cf7a3d" as const,
        "ratio": 4.43,
        "min": 4.5,
        "purpose": "sidebar primary label" as const
      }, {
        "fg": "chart-1" as const,
        "bg": "card" as const,
        "fgHex": "#cf7a3d" as const,
        "bgHex": "#f3eee0" as const,
        "ratio": 2.79,
        "min": 3,
        "purpose": "chart series 1 on paper" as const
      }, {
        "fg": "chart-1" as const,
        "bg": "popover" as const,
        "fgHex": "#cf7a3d" as const,
        "bgHex": "#e7dbbf" as const,
        "ratio": 2.35,
        "min": 3,
        "purpose": "chart series 1 on a slip (tooltips)" as const
      }],
      "warns": 2
    }
  }, {
    "id": "fix" as const,
    "title": "Fix what the checker found" as const,
    "note": "Lighten the marker until the ink label reads, and give the chart its own darker orange." as const,
    "decls": {
      "--ll-marker": "#d07d41" as const,
      "--chart-1": "#ac6b38" as const
    },
    "check": {
      "pairs": 105,
      "fails": [],
      "warns": 2
    }
  }],
  "final": {
    "--ll-desk": "#cdd2bb" as const,
    "--ll-desk-deep": "#b6bea0" as const,
    "--ll-paper": "#f3eee0" as const,
    "--ll-paper-shade": "#e7e0cc" as const,
    "--ll-slip": "#e7dbbf" as const,
    "--ll-card": "#f6f1e1" as const,
    "--ll-graph": "#eef1e2" as const,
    "--ll-kraft": "#d9c39a" as const,
    "--ll-check": "#e3e7cf" as const,
    "--ll-pad": "#f3eddc" as const,
    "--ll-photo": "#fbf8ee" as const,
    "--ll-rule-blue": "#93a983" as const,
    "--ll-rule-red": "#c98a7a" as const,
    "--ll-pad-rule": "#aebc9c" as const,
    "--ll-check-rule": "#8aa47b" as const,
    "--ll-ink": "#262c24" as const,
    "--ll-ink-soft": "#454b40" as const,
    "--ll-ink-muted": "#3f453a" as const,
    "--ll-ink-you": "#1f5570" as const,
    "--ll-pencil": "#62625a" as const,
    "--ll-pencil-text": "#57564f" as const,
    "--ll-pencil-mark": "#7d7c73" as const,
    "--ll-red": "#943123" as const,
    "--ll-green": "#385b2e" as const,
    "--ll-orange-text": "#86441a" as const,
    "--ll-focus": "#1f5570" as const,
    "--ll-link-hover": "#163f55" as const,
    "--ll-check-ink": "#3a5b30" as const,
    "--ll-check-no": "#a0352a" as const,
    "--ll-marker": "#d07d41" as const,
    "--ll-hi": "#e3c86c" as const,
    "--ll-hi-deep": "#8f6d10" as const,
    "--ll-shade": "34 42 28" as const,
    "--chart-1": "#ac6b38" as const
  },
  "notebook": {
    "--ll-desk": "#a8c8bb" as const,
    "--ll-desk-deep": "#93b4a7" as const,
    "--ll-paper": "#f8f5ee" as const,
    "--ll-paper-shade": "#ece6da" as const,
    "--ll-slip": "#fbf8f1" as const,
    "--ll-card": "#fbf6e9" as const,
    "--ll-graph": "#f4f7ef" as const,
    "--ll-kraft": "#dcc8a3" as const,
    "--ll-check": "#dfe9d8" as const,
    "--ll-pad": "#f8f2de" as const,
    "--ll-photo": "#fffdf6" as const,
    "--ll-rule-blue": "#8fb0d4" as const,
    "--ll-rule-red": "#d9776a" as const,
    "--ll-pad-rule": "#b2c3dc" as const,
    "--ll-check-rule": "#7fa37c" as const,
    "--ll-ink": "#2a2420" as const,
    "--ll-ink-soft": "#4a423b" as const,
    "--ll-ink-muted": "#4a433c" as const,
    "--ll-ink-you": "#2c4f9e" as const,
    "--ll-pencil": "#6b6660" as const,
    "--ll-pencil-text": "#5a554e" as const,
    "--ll-pencil-mark": "#8e887f" as const,
    "--ll-red": "#c2412d" as const,
    "--ll-green": "#3b7a4b" as const,
    "--ll-orange-text": "#a4502a" as const,
    "--ll-focus": "#2c4f9e" as const,
    "--ll-link-hover": "#1f3b7a" as const,
    "--ll-check-ink": "#2f6b45" as const,
    "--ll-check-no": "#b23a28" as const,
    "--ll-marker": "#df6b3c" as const,
    "--ll-hi": "#f8dc4c" as const,
    "--ll-hi-deep": "#a87f0c" as const,
    "--ll-shade": "58 44 30" as const,
    "--chart-1": "#df6b3c" as const
  },
  "knobs": {
    "wobble": 0.8,
    "edge": "deckle" as const
  }
};
