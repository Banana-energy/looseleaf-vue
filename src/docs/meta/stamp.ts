// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "../types";
export default {
  slug: "stamp" as const,
  title: "Stamp" as const,
  category: "Stickers & doodles" as const,
  description: "A rubber stamp: solid ink pressed through a worn pad, double-rule border, typewriter capitals, a slight tilt and sometimes the ghost of a first impression. For APPROVED, PAID, DRAFT and friends." as const,
  status: "new" as const,
  parts: [{
    name: "Stamp" as const,
    description: "An intrinsic ink svg in one color of pad ink, drawn through the baked `stamp` wear mask." as const,
    props: [{
      name: "name" as const,
      type: "string" as const,
      description: "A preset from the sticker sheet: `stamp-approved`, `stamp-draft`, `stamp-paid`, `stamp-urgent`, `stamp-received`, `stamp-void`, `stamp-new`, `stamp-member`. Other props override it." as const
    }, {
      name: "text" as const,
      type: "string" as const,
      description: "The main word (capitals are set for you)." as const
    }, {
      name: "shape" as const,
      type: '"rect" | "round" | "burst" | "void"' as const,
      default: '"rect"' as const,
      description: "Double-rule box, double ring with rim text, twelve-point seal, or big diagonal letters struck through." as const
    }, {
      name: "ink" as const,
      type: '"red" | "ink-you" | "green" | "ink"' as const,
      default: '"red"' as const,
      description: "Pad ink. Never a stationery accent." as const
    }, {
      name: "sub" as const,
      type: "string" as const,
      description: "A smaller second line (a date, `issue`)." as const
    }, {
      name: "ring" as const,
      type: "string" as const,
      description: "Text around the rim of a round stamp." as const
    }, {
      name: "w / h / size" as const,
      type: "number" as const,
      description: "Box in px; `size` is the diameter of round and burst stamps." as const
    }, {
      name: "tilt" as const,
      type: "number" as const,
      description: "Degrees; default a seeded -5 to 5." as const
    }, {
      name: "ghost" as const,
      type: "boolean" as const,
      description: "A faint first impression under the main one." as const
    }, {
      name: "dashed" as const,
      type: "boolean" as const,
      description: "Dashed inner rule instead of a solid one." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Wear, wobble and the patches where the pad missed." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "Accessible name (default: the stamp's text)." as const
    }]
  }],
  a11y: ["The svg is an image named by its text (`role=\"img\"`), so a stamped APPROVED is announced as \"Approved\"."],
  usage: `import { Stamp } from "@/components/ui/stamp"

export function Example() {
  return <Stamp name="stamp-approved" />
}`,
  related: ["sticker", "doodle"]
} satisfies ComponentDoc;
