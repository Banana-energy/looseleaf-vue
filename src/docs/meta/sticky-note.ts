// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "sticky-note" as const,
  title: "Sticky note" as const,
  category: "Paper" as const,
  description: "A square of colored paper with a gum band, turned a little more than a page. Five pads, any size, written in marker. It can curl a corner, hang from a pin or a strip of tape, and grow a tick box that is ticked with a felt pen." as const,
  status: "new" as const,
  parts: [{
    name: "StickyNote" as const,
    description: "A Paper on a sticky stock: 11 rem wide and at least 10 rem tall by default, padded under the gum band, set in the script font. Its sheet is CSS, so it resizes freely and a wall of them draws no SVG." as const,
    props: [{
      name: "color" as const,
      type: '"yellow" | "green" | "orange" | "pink" | "blue"' as const,
      default: '"yellow"' as const,
      description: "Which pad it came off." as const
    }, {
      name: "done" as const,
      type: "boolean" as const,
      description: "Passing it adds a pencil tick box in the top corner (mirrored in RTL). `true` writes the tick with a felt pen and strikes the content; a note that loads done does not replay the tick. Leave it out for a plain note." as const
    }, {
      name: "onDoneChange" as const,
      type: "(done: boolean) => void" as const,
      description: "Makes the tick box a real control: a `role=\"checkbox\"` button (32 px, over the drawn box) that asks for the opposite of `done` on click or Space. `done` stays yours (controlled). Without it the box only shows the state." as const
    }, {
      name: "doneLabel" as const,
      type: "string" as const,
      default: '"Done"' as const,
      description: "What a screen reader says for a done note (visually hidden text before the content), and the name of the tick box when it is a control: make it say which note (`Design: done`) when a board has several." as const
    }, {
      name: "curl" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lift the bottom-right corner (draws the sheet as SVG: use it for a few, not a hundred)." as const
    }, {
      name: "fastener / tape / tapeKind" as const,
      type: "Paper props" as const,
      description: "Hang it from a push-pin, a paper clip or a strip of tape." as const
    }, {
      name: "tilt / seed / shadow / edge" as const,
      type: "Paper props" as const,
      description: "Stickies turn up to 1.6 degrees; seed pins the hand. A torn or deckled edge works too." as const
    }]
  }, {
    name: "StickyNoteTitle" as const,
    description: "The first word says what the note is: 27 px bold script, leading none." as const
  }, {
    name: "StickyNoteContent" as const,
    description: "The body; it grows to push the footer down." as const
  }, {
    name: "StickyNoteFooter" as const,
    description: "Who wrote it, when: 14 px hand font in ink-soft, at the foot." as const
  }],
  a11y: ["A note is a plain `div`. Give it `role=\"note\"` or `as`-like semantics through props when it means more (for instance `role=\"group\"` with an `aria-label` in a board of notes).", "The gum band, curl, pin and tape are aria-hidden decoration. The tick box is drawing only unless you pass `onDoneChange`, and then it is a real checkbox (named by `doneLabel`, Space toggles, `aria-checked` follows `done`). A done note without it says \"Done.\" to screen readers through hidden text; either way it is struck through, so meaning never rests on color or the drawing alone.", "Ink on every pad is at least 9:1; struck-through text switches to ink-soft (5.8:1 or better). Tilt is zero in calm density.", "Sticky text is real DOM and wraps at any size (`break-words`), so a note resized by its container never clips."],
  usage: `import { StickyNote, StickyNoteContent, StickyNoteFooter, StickyNoteTitle } from "@/components/ui/sticky-note"

<StickyNote color="pink" curl fastener="pin" done={done} onDoneChange={setDone}>
  <StickyNoteTitle>urgent</StickyNoteTitle>
  <StickyNoteContent>call mum before six</StickyNoteContent>
  <StickyNoteFooter>from Ada</StickyNoteFooter>
</StickyNote>`,
  related: ["paper", "tape", "card", "index-card"]
} satisfies ComponentDoc;
