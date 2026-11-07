// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "button" as const,
  title: "Button" as const,
  category: "Actions" as const,
  description: "The thing you press. A marker-filled primary, a highlighter secondary, an inked outline, a whisper-box ghost, a solid red destructive and a hand-underlined link, in every shadcn size." as const,
  status: "stable" as const,
  upstream: "button" as const,
  parts: [{
    name: "Button" as const,
    description: "A real <button> (or, with asChild, any element you hand it) with a hand-drawn layer behind its label. The label stays DOM text in the hand font; the drawing is measured from the element, never from the text." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"' as const,
      default: '"default"' as const,
      description: "default = terracotta marker fill and an ink box; destructive = a solid red fill with paper lettering and a red box; outline = an inked box on paper; secondary = highlighter; ghost = a whisper of pencil that lights up under a highlighter swipe on hover; link = a blue felt underline that gets a second, heavier stroke on hover." as const
    }, {
      name: "size" as const,
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"' as const,
      default: '"default"' as const,
      description: "36, 24, 32 and 40 px high (the shadcn sizes); the icon sizes are squares of 36, 24, 32 and 40. Compact density is one step tighter, calm two (and calm is hairline: a pencil.fine outline, a single-pass fill). In the xs sizes an Icon inside is drawn at the 12 px tier." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render the child element instead of a <button> and give it the button's classes, data attributes and drawing (Reka UI Slot). The drawing is inserted inside the child. A disabled asChild element gets aria-disabled, tabIndex -1 and a swallowed click." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same button, also across remounts. Default: derived from useId()." as const
    }, {
      name: "className" as const,
      type: "string" as const,
      description: 'Merged last. `rounded-full`, as in upstream, makes a pill: the box is drawn with half-height corners (a hand-drawn circle on a square icon button) and `data-shape="pill"` is set. Other rounded-* classes do nothing, because the box is a drawing, not a border.' as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Dashed pencil box on a pale wash. A real disabled attribute on buttons, aria-disabled on asChild elements." as const
    }]
  }, {
    name: "buttonVariants" as const,
    description: "The cva function behind Button, for styling a link or trigger like a button. Layout and typography classes only: the drawing comes from Button." as const,
    props: [{
      name: "variant" as const,
      type: "ButtonVariant" as const,
      default: '"default"' as const,
      description: "Same values as Button." as const
    }, {
      name: "size" as const,
      type: "ButtonSize" as const,
      default: '"default"' as const,
      description: "Same values as Button." as const
    }, {
      name: "className" as const,
      type: "string" as const,
      description: "Merged last." as const
    }]
  }],
  a11y: ["Renders a native <button>: Enter and Space activate, Tab focuses, disabled removes it from the tab order.", "Keyboard focus draws a blue felt ring (3:1 against paper and desk); a plain outline is used until the drawing exists and in Windows high contrast, where the drawn layer is replaced by a real border.", "The drawing is aria-hidden, pointer-events: none and never focusable. Labels are ink on paper, marker or highlighter (4.6:1 or better).", "With asChild on a link, the element keeps its own role and href; disabled links are announced with aria-disabled.", "Reduced motion removes the hover tilt, the fill nudge and the underline swipe."],
  usage: `import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <div className="flex gap-3">
      <Button>Save changes</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive" size="sm">Delete</Button>
      <Button asChild variant="link">
        <a href="/docs">Read the docs</a>
      </Button>
    </div>
  )
}`,
  related: ["button-group", "toggle", "dropdown-menu", "spinner"]
} satisfies ComponentDoc;
