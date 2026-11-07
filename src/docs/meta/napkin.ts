// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "napkin" as const,
  title: "Napkin" as const,
  category: "Paper" as const,
  description: "A paper napkin to write on: tissue with a pinked edge and a pressed border, folded so it has creases (a valley with a shade on one side and a pale line on the other), optionally ringed by a coffee cup. Notes on it are set in the script font, as if in marker." as const,
  status: "new" as const,
  parts: [{
    name: "Napkin" as const,
    description: "A Paper on the `napkin` stock (crimped edge, embossed border, both drawn once it is measured) with the creases as a second layer of ink. 18 rem wide, at least 14 rem tall, padded 36 px so text sits inside the pressed border." as const,
    props: [{
      name: "fold" as const,
      type: '"quarter" | "half" | "none"' as const,
      default: '"quarter"' as const,
      description: "A crease each way through the middle; one across; or unfolded." as const
    }, {
      name: "stain" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A coffee ring (multiply-printed, faint)." as const
    }, {
      name: "tape / fastener / tilt / seed / size / as" as const,
      type: "Paper props" as const,
      description: "As on any sheet. A napkin turns up to 1.2 degrees." as const
    }]
  }, {
    name: "NapkinTitle" as const,
    description: "A script title, 32 px bold, leading none." as const
  }, {
    name: "NapkinContent" as const,
    description: "The note: script font at 24 px, growing to fill." as const
  }, {
    name: "NapkinFooter" as const,
    description: "Small ink-soft text at the foot." as const
  }],
  a11y: ["A napkin is a plain `div`; use `as=\"article\"` with a label when it means more. The creases, the stain and the pressed border are aria-hidden decoration.", "Ink on the napkin is 14:1; the footer 9:1. The creases only shade the paper by a few percent, so they never cost contrast. The tilt is zero in calm density."],
  usage: `import { Napkin, NapkinContent, NapkinFooter, NapkinTitle } from "@/components/ui/napkin"

<Napkin fold="quarter" stain tape="top">
  <NapkinTitle>Specials</NapkinTitle>
  <NapkinContent>soup of the day, a very small pie</NapkinContent>
  <NapkinFooter>until six</NapkinFooter>
</Napkin>`,
  related: ["paper", "sticky-note", "index-card", "receipt"]
} satisfies ComponentDoc;
