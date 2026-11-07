// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "native-select" as const,
  title: "Native Select" as const,
  category: "Forms" as const,
  description: "The browser's own <select> in a hand-drawn frame with a pencil chevron. You keep the platform's popup, mobile picker, typeahead and autofill, and a list of hundreds of options costs nothing. Reach for Select when you want the paper slip." as const,
  status: "stable" as const,
  upstream: "native-select" as const,
  parts: [{
    name: "NativeSelect" as const,
    description: "A `<span data-slot=\"native-select-wrapper\">` (the drawn frame, the ink host) around the real `<select data-slot=\"native-select\">` and a chevron. `ref` and every prop go to the select; `className` and `style` go to the frame, except padding and control-only variants (`focus:`, `disabled:` ...)." as const,
    props: [{
      name: "size" as const,
      type: '"default" | "sm"' as const,
      default: '"default"' as const,
      description: "36 px or 32 px tall (28 px in calm density). Not the HTML `size` attribute; use `multiple` for a list box." as const
    }, {
      name: "aria-invalid" as const,
      type: 'boolean | "true" | "false"' as const,
      description: "true draws the red pencil box, a wavy underline and a bang before the chevron." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      description: "Dashed pencil on a pale wash." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same box. Default: derived from useId()." as const
    }]
  }, {
    name: "NativeSelectOption" as const,
    description: "A styled `<option>` (paper background, ink text where the browser allows)." as const
  }, {
    name: "NativeSelectOptGroup" as const,
    description: "A styled `<optgroup label>`." as const
  }],
  a11y: ["It is a native select: role=combobox / listbox, the platform's keyboard (arrows, typeahead, Enter, Escape), its own mobile picker, autofill and form value. Nothing is re-implemented.", "Label it with a Label (`htmlFor` + `id`) or `aria-label`. A first option with an empty value reads as a placeholder (graphite text) when it is selected.", "The frame follows the select's own state: keyboard focus draws the blue ring, `aria-invalid` the red box, `disabled` the dashed one. The popup itself cannot be styled by any library; only its colors and font are asked for.", "The chevron is decorative (aria-hidden) and does not take the pointer, so the whole box opens the list. Windows high contrast replaces the ink by a real border.", "Right-to-left: the chevron cell, the divider tick and the bang are on the start side."],
  usage: `import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export function Example() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="country">Country</Label>
      <NativeSelect id="country" defaultValue="is" className="w-[220px]">
        <NativeSelectOption value="is">Iceland</NativeSelectOption>
        <NativeSelectOption value="pt">Portugal</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}`,
  related: ["select", "input", "field", "input-group"]
} satisfies ComponentDoc;
