// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "notebook" as const,
  title: "Notebook" as const,
  category: "Paper" as const,
  description: "An open notebook on the desk: ruled paper with a red margin, bound with a wire spiral, binder rings or a stab-stitched spine, its holes punched, more pages peeking out underneath. Text sits on the lines, and with a dog-ear it turns pages. Its closed sibling, `NotebookCover`, is a cloth-bound cover with a stitched spine and an elastic band." as const,
  status: "new" as const,
  parts: [{
    name: "Notebook" as const,
    description: "A Paper (ruled by default) with the binding drawn over its start edge. Content sits on a 28 px rhythm (`leading-7`; 24 px in calm density; 30 px bound on top): the first line box ends where the first rule's line does, and the rules are printed `--ll-rule-offset` above the foot of each line box, so words stand 2 to 3 px above their rule. Room for the binding and the margin on the start side. It takes every Paper prop." as const,
    props: [{
      name: "binding" as const,
      type: '"spiral" | "rings" | "stitched" | "none"' as const,
      default: '"spiral"' as const,
      description: "A wire spiral (a coil per 24 px, each through its own hole), three binder rings on a steel strip, a stab binding with a running thread, or nothing." as const
    }, {
      name: "side" as const,
      type: '"start" | "top"' as const,
      default: '"start"' as const,
      description: "Which edge is bound. `start` is the left in LTR and mirrors in RTL; `top` is a reporter's pad (30 px pad rules, no margin)." as const
    }, {
      name: "pages" as const,
      type: "0 | 1 | 2 | 3" as const,
      default: "2" as const,
      description: "Sheets peeking out under this one at its foot and far edge." as const
    }, {
      name: "tone" as const,
      type: '"steel" | Accent' as const,
      default: '"steel"' as const,
      description: "Color of the wire (or of the thread for a stitched binding; steel then uses blue thread)." as const
    }, {
      name: "rules" as const,
      type: "RuleName" as const,
      default: '"ruled" ("pad" when bound on top)' as const,
      description: "Printed rules: ruled, graph, dots, pad, none ... The margin and the rules mirror in RTL." as const
    }, {
      name: "curl" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Fold the bottom-right corner (a dog-ear). Pair it with `NotebookTurn`." as const
    }, {
      name: "value / defaultValue / onValueChange" as const,
      type: "string" as const,
      description: "Which `NotebookPage` is shown, when the notebook has several. Controlled or not." as const
    }, {
      name: "stock / edge / tape / fastener / tilt / seed" as const,
      type: "Paper props" as const,
      description: "As on any sheet." as const
    }]
  }, {
    name: "NotebookPage" as const,
    description: "One page of writing (a `section`). With a `value`, only the current page is shown (the others are `hidden`), and a page that is turned to unfolds from the dog-ear in the bottom-right corner (a clip-path wipe, no 3D; not for the page that is there at load; none with reduced motion)." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      description: "The name of this page. A page without one is always shown." as const
    }]
  }, {
    name: "NotebookTitle" as const,
    description: "An `h2` in the script font, one ruled line high. The script role sits lower in its line box than the body font, so the heading is lifted by the rule offset less about 3 px and stands on its rule." as const
  }, {
    name: "NotebookTurn" as const,
    description: "A button over the folded corner (34 px, always bottom right, as the fold is; it sits above the page content, so keep buttons and links out of that corner). Its content is its accessible name; the default is \"Turn the page\"." as const,
    props: [{
      name: "to" as const,
      type: "string" as const,
      description: "The page to turn to." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your own element (a link, say) as the corner." as const
    }]
  }, {
    name: "NotebookCover" as const,
    description: "The cover of a closed notebook, for a shelf or a library: cloth over board with a darker stitched spine on the start edge and an elastic band round the end. One drawn sheet, tilted and shadowed as one; 11 x 15 rem by default. The label goes in as children and sits in a body laid over the cover (its padding is a share of the COVER's width, whatever holds the shelf). Until it is measured it wears a plain card." as const,
    props: [{
      name: "tone" as const,
      type: 'Accent | "ink"' as const,
      default: '"tomato"' as const,
      description: "The cloth: any stationery color, or `ink` for black." as const
    }, {
      name: "band" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The elastic band." as const
    }, {
      name: "tilt / seed / size" as const,
      type: "boolean | number / string | number / [w, h]" as const,
      description: "A seeded turn under 1.4 degrees; pins the hand; the box in px for server-rendered drawings." as const
    }]
  }, {
    name: "NotebookCoverLabel" as const,
    description: "The label on the cover: a card of paper (index-card stock, turned a little) holding the notebook's name in the script font. It keeps clear of the spine and the band." as const
  }],
  a11y: ["A Notebook is a plain element (`div`; `as=\"section\"`, `\"article\"` or `\"figure\"` with a label when it means more). The binding, holes, pages underneath and the fold are aria-hidden, pointer-events-none decoration.", "`NotebookTurn` is a real button (Enter and Space), named by its content; pages that are not current are `hidden`, so a screen reader reads only the open page. Give the button a name that says where it goes (\"Next: Tuesday\").", "Text is ink on paper (14:1). The tilt is under 0.3 degrees and zero in calm density. Calm density also drops the wobble of the ruled lines' hand-drawn variants.", "Block spacing in multiples of 1.75rem (28 px) keeps text on the lines; margins that break the rhythm are yours to choose."],
  usage: `import { Notebook, NotebookPage, NotebookTitle, NotebookTurn } from "@/components/ui/notebook"

export function Example() {
  return (
    <Notebook binding="spiral" curl className="w-[30rem]" defaultValue="mon">
      <NotebookPage value="mon">
        <NotebookTitle>Monday</NotebookTitle>
        <p>Rain on the window, three cups of tea.</p>
      </NotebookPage>
      <NotebookPage value="tue">
        <NotebookTitle>Tuesday</NotebookTitle>
      </NotebookPage>
      <NotebookTurn to="tue">Next: Tuesday</NotebookTurn>
    </Notebook>
  )
}`,
  related: ["page", "paper", "card", "index-card"]
} satisfies ComponentDoc;
