// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "rating" as const,
  title: "Rating" as const,
  category: "Forms" as const,
  description: "Stars, hearts or suns somebody drew, where you pick how many are filled. Hover previews, half steps are optional, and it is a real radio group (arrow keys, form value), or a plain read-only display with a text alternative. New in Looseleaf: shadcn has no rating." as const,
  status: "new" as const,
  parts: [{
    name: "Rating" as const,
    description: "The row: `role=\"radiogroup\"` of `max` glyphs (or `role=\"img\"` when read-only). The fill of each glyph is its data-state, so previews and choices only change attributes; nothing is redrawn." as const,
    props: [{
      name: "value / defaultValue / onValueChange" as const,
      type: "number / number / (value: number) => void" as const,
      description: "Controlled or uncontrolled value, 0 to max. 0 means none chosen." as const
    }, {
      name: "max" as const,
      type: "number" as const,
      default: "5" as const,
      description: "How many glyphs." as const
    }, {
      name: "allowHalf" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Steps of 0.5: two radios per glyph (one over each half) and a half-filled glyph, read from the start side." as const
    }, {
      name: "icon" as const,
      type: '"star" | "heart" | "sun"' as const,
      default: '"star"' as const,
      description: "The glyph: a single-stroke pentagram, a wavering heart or a sun with rays." as const
    }, {
      name: "size" as const,
      type: '"sm" | "default" | "lg"' as const,
      default: '"default"' as const,
      description: "20, 24 or 32 px glyphs. Hit areas are 2 px larger than the glyph on the outer sides, so the row is a row of 24 px targets at least." as const
    }, {
      name: "readOnly" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A display: an image with the alt text \"Rated 4.5 out of 5\" (or your aria-label), no buttons, no tab stop." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Faint pencil glyphs with a graphite fill. The radios are disabled." as const
    }, {
      name: "clearable" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A click on the chosen value takes it back to 0." as const
    }, {
      name: "name / required" as const,
      type: "string / boolean" as const,
      description: "`name` adds a hidden input so the value is in FormData (not while `disabled`). `required` sets aria-required and adds a native input the browser validates, so the form will not submit while the value is 0. A form reset puts the rating back to `defaultValue` (a controlled rating is asked with onValueChange)." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "The empty glyphs are drawn in red pencil (filled ones keep their felt outline). FormControl sets it for you." as const
    }, {
      name: "getLabel" as const,
      type: "(value: number, max: number) => string" as const,
      default: '"3 of 5"' as const,
      description: "The accessible name of each radio." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same glyphs. Default: derived from useId()." as const
    }]
  }, {
    name: "RatingItem" as const,
    description: "One glyph, `index` counting from 1, to compose your own row inside `<Rating>` (default: `max` of them are rendered for you). It must be inside a Rating." as const,
    props: [{
      name: "index" as const,
      type: "number" as const,
      required: true,
      description: "Which glyph of the row this is (1 to max)." as const
    }]
  }],
  a11y: ["An interactive rating is a radiogroup of role=\"radio\" buttons, named \"3 of 5\" (or with `getLabel`), with aria-checked on the chosen value and a roving tabindex: Tab lands on the chosen glyph (the first when there is none). Name the group with aria-label or aria-labelledby.", "ArrowRight / ArrowUp add a step, ArrowLeft / ArrowDown remove one (left and right swap in right-to-left), Home goes to the first step and End to the last; the arrows choose as they move, like native radios. Enter and Space press the focused radio. There is no way to arrow down to 0: use `clearable` and click the chosen glyph, or a Clear button.", "With `allowHalf` there are two radios per glyph, one over each half, so a half star has its own name (\"3.5 of 5\") and its own hit area; pointer previews show the half under the pointer.", "A read-only rating is role=\"img\" with a text alternative (\"Rated 4.5 out of 5\", or your aria-label) and its glyphs are decorative. Put the number in text next to it as well when it matters.", "Inside a Form, FormLabel's htmlFor cannot name a radiogroup: give the Rating an aria-label, or aria-labelledby with an id on the FormLabel.", "Half steps make narrow targets (half a glyph wide): on touch screens prefer whole steps, or `size=\"lg\"`.", "The preview follows the mouse only (not touch, where hover does not exist). The filled and empty glyphs differ in fill and in outline weight, not in hue alone; in Windows high contrast each glyph shows a text star (filled, empty or half).", "Keyboard focus draws a blue felt ring around the glyph. Reduced motion removes the little bounce under the pointer."],
  usage: `import { Rating } from "@/components/ui/rating"

export function Example() {
  return <Rating defaultValue={3} allowHalf aria-label="Rate this notebook" />
}`,
  related: ["radio-group", "slider", "toggle-group", "field"]
} satisfies ComponentDoc;
