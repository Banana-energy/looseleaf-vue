// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export interface ContrastRow {
  section: string;
  purpose: string;
  fg: string;
  bg: string;
  fgHex: string;
  bgHex: string;
  ratio: number;
  min: number;
  level: "error" | "warn";
}
export const CONTRAST_ROWS: readonly ContrastRow[] = [{
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on the desk (text straight on the desk: ink / ink-soft / muted only)" as const,
  "fg": "foreground" as const,
  "bg": "background" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 8.49,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on paper" as const,
  "fg": "card-foreground" as const,
  "bg": "card" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 14.06,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on a slip (menus, popovers)" as const,
  "fg": "popover-foreground" as const,
  "bg": "popover" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 14.43,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on paper-shade (code chips, muted fills)" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 12.32,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on slip" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 14.43,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on index card" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 14.19,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on graph paper" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-graph" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f4f7ef" as const,
  "ratio": 14.14,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on kraft" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-kraft" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#dcc8a3" as const,
  "ratio": 9.36,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on ledger" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-check" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#dfe9d8" as const,
  "ratio": 12.24,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on pad (sidebar)" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 13.67,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on photo border" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-photo" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fffdf6" as const,
  "ratio": 15.04,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on a yellow sticky note" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-yellow" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f7e38a" as const,
  "ratio": 11.89,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on a green sticky note" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-green" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#cfe6a8" as const,
  "ratio": 11.33,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on an orange sticky note" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-orange" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f7c08e" as const,
  "ratio": 9.39,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on a pink sticky note" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-pink" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f6b8b0" as const,
  "ratio": 9.04,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on a blue sticky note" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-sticky-blue" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#bcd8f0" as const,
  "ratio": 10.37,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "ink on highlighter yellow" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-hi" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8dc4c" as const,
  "ratio": 11.18,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "selected text on paper (highlighter at 62% flattened onto paper)" as const,
  "fg": "--ll-selection-text" as const,
  "bg": "--ll-hi-select" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8e68a" as const,
  "ratio": 12.16,
  "min": 7,
  "level": "error" as const
}, {
  "section": "body text: ink on every stock (AAA)" as const,
  "purpose": "selected text on the desk" as const,
  "fg": "--ll-selection-text" as const,
  "bg": "--ll-hi-select" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#dad476" as const,
  "ratio": 9.96,
  "min": 7,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "ink-soft directly on the desk" as const,
  "fg": "--ll-ink-soft" as const,
  "bg": "--ll-desk" as const,
  "fgHex": "#4a423b" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 5.46,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "ink-soft on paper" as const,
  "fg": "--ll-ink-soft" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#4a423b" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 9.04,
  "min": 7,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "muted text on the desk" as const,
  "fg": "muted-foreground" as const,
  "bg": "background" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 5.39,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "muted text on paper" as const,
  "fg": "muted-foreground" as const,
  "bg": "card" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 8.93,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "muted text on paper-shade" as const,
  "fg": "muted-foreground" as const,
  "bg": "muted" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 7.83,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "muted text on a slip" as const,
  "fg": "muted-foreground" as const,
  "bg": "popover" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 9.17,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "muted text on the pad" as const,
  "fg": "--ll-ink-muted" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#4a433c" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 8.68,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "graphite text on paper" as const,
  "fg": "--ll-pencil-text" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 6.78,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "graphite text on paper-shade" as const,
  "fg": "--ll-pencil-text" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 5.94,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "graphite text on a slip" as const,
  "fg": "--ll-pencil-text" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 6.96,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "graphite text on an index card" as const,
  "fg": "--ll-pencil-text" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 6.84,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "drawn graphite (meta marks, large text) on paper" as const,
  "fg": "--ll-pencil" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#6b6660" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 5.22,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "drawn graphite on paper-shade" as const,
  "fg": "--ll-pencil" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#6b6660" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.57,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "placeholder on paper" as const,
  "fg": "--ll-placeholder" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 6.78,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "placeholder on paper-shade" as const,
  "fg": "--ll-placeholder" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 5.94,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "placeholder on a slip" as const,
  "fg": "--ll-placeholder" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 6.96,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "typed text (blue felt) on paper (Notebook 7.09)" as const,
  "fg": "--ll-input-ink" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "secondary text (AA)" as const,
  "purpose": "typed text on paper-shade" as const,
  "fg": "--ll-input-ink" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 6.21,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "blue felt (you, links) on paper" as const,
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "red pencil (error text) on paper" as const,
  "fg": "--ll-red" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 4.72,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "green pencil (ok text) on paper" as const,
  "fg": "--ll-green" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#3b7a4b" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 4.74,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "blue felt (you, links) on a slip" as const,
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 7.28,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "red pencil (error text) on a slip" as const,
  "fg": "--ll-red" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 4.84,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "green pencil (ok text) on a slip" as const,
  "fg": "--ll-green" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#3b7a4b" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 4.86,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "blue felt (you, links) on an index card" as const,
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 7.16,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "red pencil (error text) on an index card" as const,
  "fg": "--ll-red" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 4.76,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "green pencil (ok text) on an index card" as const,
  "fg": "--ll-green" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#3b7a4b" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 4.78,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "blue felt on paper-shade" as const,
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 6.21,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "blue felt on the pad" as const,
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 6.89,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "blue felt on the desk: large marks and focus only, never small text" as const,
  "fg": "--ll-ink-you" as const,
  "bg": "--ll-desk" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 4.28,
  "min": 3,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "red pencil on paper-shade: errors belong on paper, not on muted fills" as const,
  "fg": "--ll-red" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.13,
  "min": 4.5,
  "level": "warn" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "working / warm status text on paper" as const,
  "fg": "--ll-orange-text" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#a4502a" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 5.13,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "link on paper" as const,
  "fg": "--ll-link" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "link on hover, on paper" as const,
  "fg": "--ll-link-hover" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#1f3b7a" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 9.82,
  "min": 7,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "destructive text and icons on paper" as const,
  "fg": "destructive" as const,
  "bg": "card" as const,
  "fgHex": "#c2412d" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 4.72,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "ledger print" as const,
  "fg": "--ll-check-ink" as const,
  "bg": "--ll-check" as const,
  "fgHex": "#2f6b45" as const,
  "bgHex": "#dfe9d8" as const,
  "ratio": 5.07,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "ledger 'no' red" as const,
  "fg": "--ll-check-no" as const,
  "bg": "--ll-check" as const,
  "fgHex": "#b23a28" as const,
  "bgHex": "#dfe9d8" as const,
  "ratio": 4.76,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: keyword on a slip" as const,
  "fg": "--ll-syn-keyword" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#ad3d2b" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 5.69,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: keyword on a code chip (paper-shade)" as const,
  "fg": "--ll-syn-keyword" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#ad3d2b" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.86,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: string on a slip" as const,
  "fg": "--ll-syn-string" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#396e45" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 5.67,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: string on a code chip (paper-shade)" as const,
  "fg": "--ll-syn-string" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#396e45" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.84,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: name on a slip" as const,
  "fg": "--ll-syn-name" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 7.28,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: name on a code chip (paper-shade)" as const,
  "fg": "--ll-syn-name" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 6.21,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: number on a slip" as const,
  "fg": "--ll-syn-number" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#984c29" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 5.82,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: number on a code chip (paper-shade)" as const,
  "fg": "--ll-syn-number" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#984c29" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 4.97,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: comment on a slip" as const,
  "fg": "--ll-syn-comment" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 6.96,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "meaning inks on paper (AA)" as const,
  "purpose": "code: comment on a code chip (paper-shade)" as const,
  "fg": "--ll-syn-comment" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#5a554e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 5.94,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "filled controls (labels)" as const,
  "purpose": "ink label on the terracotta marker (primary button)" as const,
  "fg": "primary-foreground" as const,
  "bg": "primary" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#df6b3c" as const,
  "ratio": 4.6,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "filled controls (labels)" as const,
  "purpose": "label on the highlighter tint (secondary button)" as const,
  "fg": "secondary-foreground" as const,
  "bg": "secondary" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8ecb5" as const,
  "ratio": 12.87,
  "min": 7,
  "level": "error" as const
}, {
  "section": "filled controls (labels)" as const,
  "purpose": "hover / selected row text on the highlighter wash" as const,
  "fg": "accent-foreground" as const,
  "bg": "accent" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8e68a" as const,
  "ratio": 12.16,
  "min": 7,
  "level": "error" as const
}, {
  "section": "filled controls (labels)" as const,
  "purpose": "label on red pencil (destructive button)" as const,
  "fg": "destructive-foreground" as const,
  "bg": "destructive" as const,
  "fgHex": "#fbf8f1" as const,
  "bgHex": "#c2412d" as const,
  "ratio": 4.84,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "filled controls (labels)" as const,
  "purpose": "sidebar text" as const,
  "fg": "sidebar-foreground" as const,
  "bg": "sidebar" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 13.67,
  "min": 7,
  "level": "error" as const
}, {
  "section": "filled controls (labels)" as const,
  "purpose": "sidebar primary label" as const,
  "fg": "sidebar-primary-foreground" as const,
  "bg": "sidebar-primary" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#df6b3c" as const,
  "ratio": 4.6,
  "min": 4.5,
  "level": "error" as const
}, {
  "section": "filled controls (labels)" as const,
  "purpose": "sidebar hover / selected text" as const,
  "fg": "sidebar-accent-foreground" as const,
  "bg": "sidebar-accent" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f8e9a4" as const,
  "ratio": 12.53,
  "min": 7,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "focus mark on the desk" as const,
  "fg": "ring" as const,
  "bg": "background" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 4.28,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "focus mark on paper" as const,
  "fg": "ring" as const,
  "bg": "card" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "focus mark on a slip" as const,
  "fg": "--ll-focus" as const,
  "bg": "--ll-slip" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 7.28,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "focus mark on paper-shade" as const,
  "fg": "--ll-focus" as const,
  "bg": "--ll-paper-shade" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 6.21,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "focus mark on the pad" as const,
  "fg": "--ll-focus" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 6.89,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "sidebar focus mark" as const,
  "fg": "sidebar-ring" as const,
  "bg": "sidebar" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 6.89,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "input boundary / drawn line on paper" as const,
  "fg": "border" as const,
  "bg": "card" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.23,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "field outline on paper" as const,
  "fg": "input" as const,
  "bg": "card" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.23,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "drawn line on a slip" as const,
  "fg": "border" as const,
  "bg": "popover" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 3.31,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "hairline mark on paper" as const,
  "fg": "--ll-line" as const,
  "bg": "--ll-paper" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.23,
  "min": 3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "drawn line on the desk (decorative hairline)" as const,
  "fg": "border" as const,
  "bg": "background" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 1.95,
  "min": 1.5,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "drawn line on paper-shade (decorative hairline)" as const,
  "fg": "border" as const,
  "bg": "muted" as const,
  "fgHex": "#8e887f" as const,
  "bgHex": "#ece6da" as const,
  "ratio": 2.83,
  "min": 1.5,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "paper must read lighter than the desk (Notebook 1.95; the palest Penpal pairing, stone table, is 1.3)" as const,
  "fg": "--ll-paper" as const,
  "bg": "--ll-desk" as const,
  "fgHex": "#f8f5ee" as const,
  "bgHex": "#a8c8bb" as const,
  "ratio": 1.66,
  "min": 1.3,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "index-card ruling" as const,
  "fg": "--ll-rule-blue" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#8fb0d4" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 2.09,
  "min": 1.5,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "index-card header line" as const,
  "fg": "--ll-rule-red" as const,
  "bg": "--ll-card" as const,
  "fgHex": "#d9776a" as const,
  "bgHex": "#fbf6e9" as const,
  "ratio": 2.86,
  "min": 1.5,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "pad ruling (sidebar-border)" as const,
  "fg": "--ll-pad-rule" as const,
  "bg": "--ll-pad" as const,
  "fgHex": "#b2c3dc" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 1.6,
  "min": 1.5,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "sidebar divider" as const,
  "fg": "sidebar-border" as const,
  "bg": "sidebar" as const,
  "fgHex": "#b2c3dc" as const,
  "bgHex": "#f8f2de" as const,
  "ratio": 1.6,
  "min": 1.5,
  "level": "error" as const
}, {
  "section": "focus and non-text marks (WCAG 1.4.11)" as const,
  "purpose": "ledger ruling" as const,
  "fg": "--ll-check-rule" as const,
  "bg": "--ll-check" as const,
  "fgHex": "#7fa37c" as const,
  "bgHex": "#dfe9d8" as const,
  "ratio": 2.26,
  "min": 1.5,
  "level": "error" as const
}, {
  "section": "chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "purpose": "chart series 1 on paper" as const,
  "fg": "chart-1" as const,
  "bg": "card" as const,
  "fgHex": "#df6b3c" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.06,
  "min": 3,
  "level": "error" as const
}, {
  "section": "chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "purpose": "chart series 2 on paper" as const,
  "fg": "chart-2" as const,
  "bg": "card" as const,
  "fgHex": "#2c4f9e" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 7.09,
  "min": 3,
  "level": "error" as const
}, {
  "section": "chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "purpose": "chart series 3 on paper" as const,
  "fg": "chart-3" as const,
  "bg": "card" as const,
  "fgHex": "#3b7a4b" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 4.74,
  "min": 3,
  "level": "error" as const
}, {
  "section": "chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "purpose": "chart series 4 on paper" as const,
  "fg": "chart-4" as const,
  "bg": "card" as const,
  "fgHex": "#a87f0c" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.38,
  "min": 3,
  "level": "error" as const
}, {
  "section": "chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "purpose": "chart series 5 on paper" as const,
  "fg": "chart-5" as const,
  "bg": "card" as const,
  "fgHex": "#8f6fd6" as const,
  "bgHex": "#f8f5ee" as const,
  "ratio": 3.56,
  "min": 3,
  "level": "error" as const
}, {
  "section": "chart series (3:1 against the surface they are drawn on; a hatch channel carries the rest)" as const,
  "purpose": "chart series 1 on a slip (tooltips)" as const,
  "fg": "chart-1" as const,
  "bg": "popover" as const,
  "fgHex": "#df6b3c" as const,
  "bgHex": "#fbf8f1" as const,
  "ratio": 3.14,
  "min": 3,
  "level": "error" as const
}, {
  "section": "decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "purpose": "ink label on a tomato sticker / badge" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-tomato" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#e8483a" as const,
  "ratio": 3.95,
  "min": 4.5,
  "level": "warn" as const
}, {
  "section": "decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "purpose": "ink label on a tangerine sticker / badge" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-tangerine" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f59a2f" as const,
  "ratio": 6.96,
  "min": 4.5,
  "level": "warn" as const
}, {
  "section": "decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "purpose": "ink label on a lemon sticker / badge" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-lemon" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#fbd63a" as const,
  "ratio": 10.78,
  "min": 4.5,
  "level": "warn" as const
}, {
  "section": "decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "purpose": "ink label on a grass sticker / badge" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-grass" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#5db85c" as const,
  "ratio": 6.18,
  "min": 4.5,
  "level": "warn" as const
}, {
  "section": "decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "purpose": "ink label on a teal sticker / badge" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-teal" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#2fb1a3" as const,
  "ratio": 5.79,
  "min": 4.5,
  "level": "warn" as const
}, {
  "section": "decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "purpose": "ink label on a sky sticker / badge" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-sky" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#4aa8e8" as const,
  "ratio": 5.87,
  "min": 4.5,
  "level": "warn" as const
}, {
  "section": "decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "purpose": "ink label on a grape sticker / badge" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-grape" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#8f6fd6" as const,
  "ratio": 3.95,
  "min": 4.5,
  "level": "warn" as const
}, {
  "section": "decoration: sticker labels on the stationery accents (informational; stickers are not the only carrier of meaning)" as const,
  "purpose": "ink label on a bubblegum sticker / badge" as const,
  "fg": "--ll-ink" as const,
  "bg": "--ll-bubblegum" as const,
  "fgHex": "#2a2420" as const,
  "bgHex": "#f38bb8" as const,
  "ratio": 6.7,
  "min": 4.5,
  "level": "warn" as const
}];
