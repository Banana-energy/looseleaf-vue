// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "label" as const,
  title: "Label" as const,
  category: "Forms" as const,
  description: "The words that go with a field, in the bold hand font, with an optional red pencil star for required fields. It fades with a disabled control and hands its click to it." as const,
  status: "stable" as const,
  upstream: "label" as const,
  parts: [{
    name: "Label" as const,
    description: "Reka UI Label.Root (a real <label>). htmlFor or nesting associate it with a control; double-clicking its text does not select it. required draws a star after the text." as const,
    props: [{
      name: "required" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A red-pencil star after the text: three crossing strokes, drawn once per label. It is decorative (aria-hidden) and adds nothing to the accessible name: put required on the control so it is announced." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the star. Default: derived from useId()." as const
    }, {
      name: "htmlFor" as const,
      type: "string" as const,
      description: "The id of the control." as const
    }]
  }],
  a11y: ["A native <label>: clicking it focuses or toggles its control; the control's accessible name is the label's text (the star is aria-hidden).", "Bold Kevin Sans at 15 px in ink on paper (14:1). Disabled controls dim their label: put peer on the control before the label (peer-disabled), on a drawn Input / Textarea frame (peer-has-[>input:disabled]), or wrap both in a group with data-disabled=\"true\".", "The star is intrinsic art: it stays visible in Windows high contrast and never takes focus."],
  usage: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Example() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="name" required>Your name</Label>
      <Input id="name" required />
    </div>
  )
}`,
  related: ["input", "textarea", "checkbox", "field"]
} satisfies ComponentDoc;
