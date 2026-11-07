// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "index-card" as const,
  title: "Index card" as const,
  category: "Paper" as const,
  description: "A 3 x 5 card of cream stock with a red header rule and blue lines every 30 px. Header, body and footer parts lay out on the printed rules; the card can have its rod hole punched at the foot, a colored flag stuck over its edge, and a pile of cards behind it." as const,
  status: "new" as const,
  parts: [{
    name: "IndexCard" as const,
    description: "A Paper (`index-card` stock, `index` rules) as a flex column, at most 28 rem wide and at least 14 rem tall. It takes every Paper prop except `stock` and `rules`. Body text is 17 px on a 30 px line so it sits on the lines." as const,
    props: [{
      name: "hole" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Punch the rod hole at the bottom center, in the band under the last blue line; the desk shows through it." as const
    }, {
      name: "flag" as const,
      type: "Accent | false" as const,
      default: "false" as const,
      description: "A translucent plastic flag stuck over the end edge (tomato, tangerine, lemon, grass, teal, sky, grape, bubblegum). It mirrors in RTL." as const
    }, {
      name: "stack" as const,
      type: "0 | 1 | 2 | 3" as const,
      default: "0" as const,
      description: "Cards visible behind this one, at its foot and far edge." as const
    }, {
      name: "as / tape / fastener / tilt / seed" as const,
      type: "Paper props" as const,
      description: "As on any sheet. A card turns less than a page (under 0.25 degrees)." as const
    }]
  }, {
    name: "IndexCardHeader" as const,
    description: "The zone above the red line: 49 px high (the first line box of the grid, the rule is printed 9 px above its foot), its children sit on the line." as const
  }, {
    name: "IndexCardTitle" as const,
    description: "The title in the script font, 26 px, leading none. It is one line, sitting on the red rule: a longer title ends in an ellipsis rather than climbing out of the card (the whole text is still in the DOM for screen readers)." as const
  }, {
    name: "IndexCardContent" as const,
    description: "The body: starts where the header ends and grows; text on a 30 px line height sits on the blue lines, 2 to 3 px above each." as const
  }, {
    name: "IndexCardFooter" as const,
    description: "A row at the foot (a number, a filing mark), 14 px muted, on a 30 px line: it sits on a blue rule like the body text. The card keeps its foot on that grid when its height is 104 + 30n px (`min-h-56` is 224); with another `min-h-*` the footer may cross a rule." as const
  }],
  a11y: ["An index card is a plain `div`; use `as=\"article\"` or `role=\"group\"` with a label when it means more. The hole, flag and pile are aria-hidden decoration; put anything a flag stands for into text.", "Body ink is 14:1 on the card; the muted footer 8:1. The printed rules and the red header line are decoration and mirror for right-to-left text.", "The tilt is zero in calm density; Windows high contrast replaces the drawing with a plain outline."],
  usage: `import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card"

<IndexCard hole flag="tomato" stack={2}>
  <IndexCardHeader><IndexCardTitle>Sources</IndexCardTitle></IndexCardHeader>
  <IndexCardContent>sketchbook, dip pen, ink</IndexCardContent>
  <IndexCardFooter><span>filed under P</span><span>12</span></IndexCardFooter>
</IndexCard>`,
  related: ["card", "paper", "sticky-note", "notebook"]
} satisfies ComponentDoc;
