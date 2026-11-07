// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "signature-pad" as const,
  title: "Signature pad" as const,
  category: "Forms" as const,
  description: "Sign on the screen. One brush pen with real pressure, a pencil baseline with its x, a clear button, and a typed-name fallback that is set in hand lettering. It carries the image in a hidden field, so it works in a plain form and can be required." as const,
  status: "new" as const,
  parts: [{
    name: "SignaturePad" as const,
    description: "The root: a Sketchpad with one pen, plus the value. The value is a data URL (svg by default, png on request) that is empty until the person has signed; the detail argument carries the strokes, so a signature can be stored as JSON and drawn again later." as const,
    props: [{
      name: "name" as const,
      type: "string" as const,
      description: "Form field name. A hidden input carries the data URL, so FormData and native submit just work." as const
    }, {
      name: "value / defaultValue / onValueChange" as const,
      type: "string / (value: string, detail: { mode, strokes, text }) => void" as const,
      description: "The signature image as a data URL, or \"\". Controlled, the value is the truth: a value the pad did not produce (a saved signature loaded from a server, or \"\" from a reset) replaces whatever was drawn or typed and is shown as an image until the person signs again. A brush signature is about 40 KB as an svg data URL (22 KB of it is the embedded pen grain); store the strokes from `detail` if that matters." as const
    }, {
      name: "required" as const,
      type: "boolean" as const,
      description: "An empty pad blocks the form's submit with the native validation, focuses the canvas (the name field in type mode) and shows the message. A form reset clears the pad and calls onValueChange(\"\")." as const
    }, {
      name: "invalid / message" as const,
      type: "boolean / string" as const,
      default: '"Please sign in the box."' as const,
      description: "A red baseline and a polite alert. Set automatically when a required form is submitted empty." as const
    }, {
      name: "disabled / readOnly" as const,
      type: "boolean" as const,
      description: "Draw nothing. Read-only hides the buttons and shows the signature." as const
    }, {
      name: "mode / defaultMode / onModeChange" as const,
      type: '"draw" | "type"' as const,
      default: '"draw"' as const,
      description: "Draw with a pointer or type the name." as const
    }, {
      name: "typedFallback" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Offer \"Type instead\": the name is hand-lettered as outlines (no font needed in the exported image). Also the way in for people who cannot draw." as const
    }, {
      name: "penColor / pen" as const,
      type: 'SketchColor / "brush" | "felt"' as const,
      default: '"ink-you" / "brush"' as const,
      description: "The brush swells on down-strokes like a fountain pen; the felt keeps an even line." as const
    }, {
      name: "format" as const,
      type: '"svg" | "png"' as const,
      default: '"svg"' as const,
      description: "png is rasterized in the browser through a canvas; where that is not possible the svg is kept." as const
    }, {
      name: "width / height" as const,
      type: "number" as const,
      default: "480 / 180" as const,
      description: "Canvas units; the pad scales to its container." as const
    }]
  }, {
    name: "SignaturePadCanvas" as const,
    description: "The sheet: baseline, \"Sign here\" hint, the strokes or the typed name. Put it where you want it when you compose your own layout." as const,
    props: []
  }, {
    name: "SignaturePadClear" as const,
    description: "A ghost Button that clears the drawn strokes, or the typed name in type mode." as const,
    props: []
  }, {
    name: "SignaturePadModeToggle" as const,
    description: "A link Button with aria-pressed that switches between drawing and typing." as const,
    props: []
  }, {
    name: "SignaturePadTyped" as const,
    description: "The name field, shown only in type mode (autocomplete name)." as const,
    props: []
  }],
  a11y: ["The canvas is a named application (\"Signature\"); the same keyboard drawing as Sketchpad works: arrows move a cursor, Space puts the pen down and lifts it. Typing the name is the accessible alternative and is one button away.", "Type mode replaces the canvas by an image named \"Signature, typed: Ada Lovelace\" and a text field labeled \"Type your full name\".", "Required: a visually hidden text input holds the value so the browser's own validation and message apply; the failure also shows a role=\"alert\" line and moves focus to the canvas (the name field in type mode).", "The baseline turns red pencil when invalid, and the message says why (color is never the only cue).", "Windows high contrast keeps the ink colors of the strokes; the sheet gets a real border."],
  usage: `import { SignaturePad } from "@/components/ui/signature-pad"

export function Example() {
  return (
    <form onSubmit={(e) => { e.preventDefault(); console.log(new FormData(e.currentTarget).get("signature")) }}>
      <SignaturePad name="signature" required />
      <button type="submit">Sign</button>
    </form>
  )
}`,
  related: ["sketchpad", "input", "label", "button"]
} satisfies ComponentDoc;
