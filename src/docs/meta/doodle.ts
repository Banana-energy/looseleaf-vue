// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "../types";
export default {
  slug: "doodle" as const,
  title: "Doodle" as const,
  category: "Stickers & doodles" as const,
  description: "Margin doodles: a star, a sun, a flower, a mushroom. Line-led, with one flat fill in register. Use them in the decoration layer, on empty states and in corners of cards." as const,
  status: "new" as const,
  parts: [{
    name: "Doodle" as const,
    description: "An intrinsic ink svg drawn from a skeleton at the size you ask for, redrawn (not scaled) below 72 px." as const,
    props: [{
      name: "name" as const,
      type: "DoodleName | string" as const,
      required: true,
      description: "A doodle id (`star`, `sun`, `flower`, `mushroom`...)." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      default: "96" as const,
      description: "Pixels. Below 72 the 48 px redraw (silhouette and one detail, heavier line), from 72 the 96 px master, from 128 the hero tier." as const
    }, {
      name: "accent" as const,
      type: "Accent | \"hi\" | \"kraft\"" as const,
      description: "Color of the accent washes, for doodles that have them." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Another seed, another hand." as const
    }, {
      name: "rotate" as const,
      type: "number" as const,
      description: "Degrees. Corner flourishes are drawn for the top-left and turned by you." as const
    }, {
      name: "flip" as const,
      type: "boolean" as const,
      description: "Mirror horizontally (CSS)." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "Accessible name. Decorative (`aria-hidden`) without it." as const
    }]
  }],
  a11y: ["Decorative by default; give it a `label` only when it carries meaning that the surrounding text does not."],
  usage: `import { Doodle } from "@/components/ui/doodle"

export function Example() {
  return <Doodle name="sun" size={96} />
}`,
  related: ["sticker", "icon", "mascot"]
} satisfies ComponentDoc;
