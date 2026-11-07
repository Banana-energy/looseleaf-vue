// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export interface Thumb {
  file: string;
  w: number;
  h: number;
}
export const THUMBS: Readonly<Record<string, Thumb>> = {
  "accordion": {
    file: "accordion.jpg" as const,
    w: 640,
    h: 336
  },
  "alert": {
    file: "alert.jpg" as const,
    w: 640,
    h: 356
  },
  "alert-dialog": {
    file: "alert-dialog.jpg" as const,
    w: 640,
    h: 400
  },
  "annotate": {
    file: "annotate.jpg" as const,
    w: 640,
    h: 492
  },
  "arrow": {
    file: "arrow.jpg" as const,
    w: 640,
    h: 400
  },
  "aspect-ratio": {
    file: "aspect-ratio.jpg" as const,
    w: 640,
    h: 400
  },
  "asterisk": {
    file: "asterisk.jpg" as const,
    w: 640,
    h: 400
  },
  "attachment": {
    file: "attachment.jpg" as const,
    w: 640,
    h: 467
  },
  "avatar": {
    file: "avatar.jpg" as const,
    w: 640,
    h: 391
  },
  "badge": {
    file: "badge.jpg" as const,
    w: 640,
    h: 399
  },
  "boil": {
    file: "boil.jpg" as const,
    w: 640,
    h: 396
  },
  "bookmark": {
    file: "bookmark.jpg" as const,
    w: 640,
    h: 400
  },
  "bracket": {
    file: "bracket.jpg" as const,
    w: 640,
    h: 400
  },
  "breadcrumb": {
    file: "breadcrumb.jpg" as const,
    w: 640,
    h: 400
  },
  "bubble": {
    file: "bubble.jpg" as const,
    w: 640,
    h: 449
  },
  "button": {
    file: "button.jpg" as const,
    w: 640,
    h: 399
  },
  "button-group": {
    file: "button-group.jpg" as const,
    w: 640,
    h: 400
  },
  "calendar": {
    file: "calendar.jpg" as const,
    w: 640,
    h: 376
  },
  "callout": {
    file: "callout.jpg" as const,
    w: 640,
    h: 400
  },
  "card": {
    file: "card.jpg" as const,
    w: 640,
    h: 400
  },
  "carousel": {
    file: "carousel.jpg" as const,
    w: 640,
    h: 394
  },
  "chart": {
    file: "chart.jpg" as const,
    w: 640,
    h: 395
  },
  "checkbox": {
    file: "checkbox.jpg" as const,
    w: 640,
    h: 400
  },
  "circled": {
    file: "circled.jpg" as const,
    w: 640,
    h: 399
  },
  "clipboard": {
    file: "clipboard.jpg" as const,
    w: 640,
    h: 370
  },
  "code-block": {
    file: "code-block.jpg" as const,
    w: 640,
    h: 411
  },
  "collapsible": {
    file: "collapsible.jpg" as const,
    w: 640,
    h: 399
  },
  "combobox": {
    file: "combobox.jpg" as const,
    w: 640,
    h: 400
  },
  "command": {
    file: "command.jpg" as const,
    w: 640,
    h: 399
  },
  "confetti": {
    file: "confetti.jpg" as const,
    w: 640,
    h: 400
  },
  "context-menu": {
    file: "context-menu.jpg" as const,
    w: 640,
    h: 400
  },
  "corkboard": {
    file: "corkboard.jpg" as const,
    w: 640,
    h: 392
  },
  "date-picker": {
    file: "date-picker.jpg" as const,
    w: 640,
    h: 400
  },
  "desk": {
    file: "desk.jpg" as const,
    w: 640,
    h: 400
  },
  "dialog": {
    file: "dialog.jpg" as const,
    w: 640,
    h: 400
  },
  "direction": {
    file: "direction.jpg" as const,
    w: 640,
    h: 387
  },
  "doodle": {
    file: "doodle.jpg" as const,
    w: 640,
    h: 399
  },
  "drawer": {
    file: "drawer.jpg" as const,
    w: 640,
    h: 400
  },
  "dropdown-menu": {
    file: "dropdown-menu.jpg" as const,
    w: 640,
    h: 400
  },
  "dropzone": {
    file: "dropzone.jpg" as const,
    w: 640,
    h: 400
  },
  "empty": {
    file: "empty.jpg" as const,
    w: 640,
    h: 400
  },
  "envelope": {
    file: "envelope.jpg" as const,
    w: 640,
    h: 336
  },
  "field": {
    file: "field.jpg" as const,
    w: 640,
    h: 362
  },
  "flip-card": {
    file: "flip-card.jpg" as const,
    w: 640,
    h: 400
  },
  "folder": {
    file: "folder.jpg" as const,
    w: 640,
    h: 394
  },
  "form": {
    file: "form.jpg" as const,
    w: 640,
    h: 400
  },
  "handwritten": {
    file: "handwritten.jpg" as const,
    w: 640,
    h: 399
  },
  "highlight": {
    file: "highlight.jpg" as const,
    w: 640,
    h: 400
  },
  "hover-card": {
    file: "hover-card.jpg" as const,
    w: 640,
    h: 400
  },
  "icon": {
    file: "icon.jpg" as const,
    w: 640,
    h: 399
  },
  "index-card": {
    file: "index-card.jpg" as const,
    w: 640,
    h: 399
  },
  "input": {
    file: "input.jpg" as const,
    w: 640,
    h: 399
  },
  "input-group": {
    file: "input-group.jpg" as const,
    w: 640,
    h: 399
  },
  "input-otp": {
    file: "input-otp.jpg" as const,
    w: 640,
    h: 358
  },
  "item": {
    file: "item.jpg" as const,
    w: 640,
    h: 417
  },
  "kbd": {
    file: "kbd.jpg" as const,
    w: 640,
    h: 400
  },
  "label": {
    file: "label.jpg" as const,
    w: 640,
    h: 399
  },
  "label-tag": {
    file: "label-tag.jpg" as const,
    w: 640,
    h: 386
  },
  "lettering": {
    file: "lettering.jpg" as const,
    w: 640,
    h: 400
  },
  "marker": {
    file: "marker.jpg" as const,
    w: 640,
    h: 400
  },
  "marquee": {
    file: "marquee.jpg" as const,
    w: 640,
    h: 365
  },
  "mascot": {
    file: "mascot.jpg" as const,
    w: 640,
    h: 400
  },
  "menubar": {
    file: "menubar.jpg" as const,
    w: 640,
    h: 400
  },
  "message": {
    file: "message.jpg" as const,
    w: 640,
    h: 400
  },
  "message-scroller": {
    file: "message-scroller.jpg" as const,
    w: 640,
    h: 396
  },
  "napkin": {
    file: "napkin.jpg" as const,
    w: 640,
    h: 400
  },
  "native-select": {
    file: "native-select.jpg" as const,
    w: 640,
    h: 400
  },
  "navigation-menu": {
    file: "navigation-menu.jpg" as const,
    w: 640,
    h: 400
  },
  "notebook": {
    file: "notebook.jpg" as const,
    w: 640,
    h: 399
  },
  "page": {
    file: "page.jpg" as const,
    w: 640,
    h: 448
  },
  "pagination": {
    file: "pagination.jpg" as const,
    w: 640,
    h: 381
  },
  "paper": {
    file: "paper.jpg" as const,
    w: 640,
    h: 492
  },
  "peel-corner": {
    file: "peel-corner.jpg" as const,
    w: 640,
    h: 400
  },
  "polaroid": {
    file: "polaroid.jpg" as const,
    w: 640,
    h: 399
  },
  "popover": {
    file: "popover.jpg" as const,
    w: 640,
    h: 400
  },
  "progress": {
    file: "progress.jpg" as const,
    w: 640,
    h: 400
  },
  "prompt-input": {
    file: "prompt-input.jpg" as const,
    w: 640,
    h: 354
  },
  "quote": {
    file: "quote.jpg" as const,
    w: 640,
    h: 400
  },
  "radio-group": {
    file: "radio-group.jpg" as const,
    w: 640,
    h: 400
  },
  "rating": {
    file: "rating.jpg" as const,
    w: 640,
    h: 400
  },
  "receipt": {
    file: "receipt.jpg" as const,
    w: 640,
    h: 399
  },
  "resizable": {
    file: "resizable.jpg" as const,
    w: 640,
    h: 337
  },
  "reveal": {
    file: "reveal.jpg" as const,
    w: 640,
    h: 374
  },
  "ribbon": {
    file: "ribbon.jpg" as const,
    w: 640,
    h: 400
  },
  "scribble": {
    file: "scribble.jpg" as const,
    w: 640,
    h: 399
  },
  "scroll-area": {
    file: "scroll-area.jpg" as const,
    w: 640,
    h: 337
  },
  "seal": {
    file: "seal.jpg" as const,
    w: 640,
    h: 382
  },
  "select": {
    file: "select.jpg" as const,
    w: 640,
    h: 392
  },
  "separator": {
    file: "separator.jpg" as const,
    w: 640,
    h: 387
  },
  "sheet": {
    file: "sheet.jpg" as const,
    w: 640,
    h: 391
  },
  "sidebar": {
    file: "sidebar.jpg" as const,
    w: 640,
    h: 492
  },
  "signature": {
    file: "signature.jpg" as const,
    w: 640,
    h: 400
  },
  "signature-pad": {
    file: "signature-pad.jpg" as const,
    w: 640,
    h: 416
  },
  "skeleton": {
    file: "skeleton.jpg" as const,
    w: 640,
    h: 384
  },
  "sketchpad": {
    file: "sketchpad.jpg" as const,
    w: 640,
    h: 479
  },
  "slider": {
    file: "slider.jpg" as const,
    w: 640,
    h: 399
  },
  "sonner": {
    file: "sonner.jpg" as const,
    w: 640,
    h: 337
  },
  "spinner": {
    file: "spinner.jpg" as const,
    w: 640,
    h: 400
  },
  "squiggle": {
    file: "squiggle.jpg" as const,
    w: 640,
    h: 400
  },
  "stamp": {
    file: "stamp.jpg" as const,
    w: 640,
    h: 399
  },
  "stamp-button": {
    file: "stamp-button.jpg" as const,
    w: 640,
    h: 384
  },
  "stepper": {
    file: "stepper.jpg" as const,
    w: 640,
    h: 400
  },
  "sticker": {
    file: "sticker.jpg" as const,
    w: 640,
    h: 400
  },
  "sticker-board": {
    file: "sticker-board.jpg" as const,
    w: 640,
    h: 499
  },
  "sticker-picker": {
    file: "sticker-picker.jpg" as const,
    w: 640,
    h: 400
  },
  "sticker-sheet": {
    file: "sticker-sheet.jpg" as const,
    w: 640,
    h: 392
  },
  "sticky-note": {
    file: "sticky-note.jpg" as const,
    w: 640,
    h: 492
  },
  "strike": {
    file: "strike.jpg" as const,
    w: 640,
    h: 400
  },
  "switch": {
    file: "switch.jpg" as const,
    w: 640,
    h: 400
  },
  "table": {
    file: "table.jpg" as const,
    w: 640,
    h: 378
  },
  "tabs": {
    file: "tabs.jpg" as const,
    w: 640,
    h: 411
  },
  "tally": {
    file: "tally.jpg" as const,
    w: 640,
    h: 400
  },
  "tape": {
    file: "tape.jpg" as const,
    w: 640,
    h: 400
  },
  "tear-off": {
    file: "tear-off.jpg" as const,
    w: 640,
    h: 400
  },
  "textarea": {
    file: "textarea.jpg" as const,
    w: 640,
    h: 400
  },
  "ticket": {
    file: "ticket.jpg" as const,
    w: 640,
    h: 399
  },
  "toggle": {
    file: "toggle.jpg" as const,
    w: 640,
    h: 400
  },
  "toggle-group": {
    file: "toggle-group.jpg" as const,
    w: 640,
    h: 400
  },
  "tooltip": {
    file: "tooltip.jpg" as const,
    w: 640,
    h: 362
  },
  "typewriter": {
    file: "typewriter.jpg" as const,
    w: 640,
    h: 375
  },
  "typing-indicator": {
    file: "typing-indicator.jpg" as const,
    w: 640,
    h: 399
  },
  "typography": {
    file: "typography.jpg" as const,
    w: 640,
    h: 492
  },
  "underline": {
    file: "underline.jpg" as const,
    w: 640,
    h: 400
  }
};
