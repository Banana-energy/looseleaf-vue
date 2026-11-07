// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "collapsible" as const,
  title: "Collapsible" as const,
  category: "Layout" as const,
  description: "One panel that folds away behind a trigger. Minimal by design: the panel slides, and if you ask for it, writes a margin brace beside its text. The chevron indicator turns over the same way the accordion's does." as const,
  status: "stable" as const,
  upstream: "collapsible" as const,
  parts: [{
    name: "Collapsible" as const,
    description: "The Reka UI Collapsible root (also `group/collapsible`, for your own state-dependent classes)." as const,
    props: [{
      name: "open / defaultOpen / onOpenChange" as const,
      type: "boolean / boolean / (open: boolean) => void" as const,
      description: "Controlled and uncontrolled state." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The trigger stops toggling." as const
    }]
  }, {
    name: "CollapsibleTrigger" as const,
    description: "Any button (use `asChild` with a Button). Reka UI sets `aria-expanded` and `aria-controls` on it. It carries `group/collapsible-trigger`, which is what the indicator inside it reads its state from, so collapsibles can nest." as const
  }, {
    name: "CollapsibleContent" as const,
    description: "The panel. It slides open and shut with a height animation that clips the text only while it moves, so a focus ring or ink bleed inside an open panel is never cut (upstream's animated `overflow-hidden` cuts it for good)." as const,
    props: [{
      name: "bracket" as const,
      type: '"curly" | "square" | false' as const,
      default: "false" as const,
      description: "Draw a margin bracket beside the opened content and let the text soak in. Wraps the children in one element." as const
    }]
  }, {
    name: "CollapsibleIndicator" as const,
    description: "A hand-drawn chevron that turns over when the Collapsible is open. Put it inside the trigger; it takes the props of an Icon (`size`, `className`, `label`)." as const
  }],
  a11y: ["The trigger is a button with `aria-expanded` and `aria-controls`; Enter and Space toggle it. Closed content is not rendered.", "Give the trigger a name: visible text, or a `sr-only` span when it is an icon button.", "The brace and the chevron are decoration (aria-hidden); state is told by aria-expanded.", "Reduced motion opens and closes the panel at once."],
  usage: `import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible"

export function Example() {
  return (
    <Collapsible className="w-[350px]">
      <CollapsibleTrigger asChild>
        <Button variant="link">
          Show details
          <CollapsibleIndicator />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent bracket="curly">Folded away until you ask.</CollapsibleContent>
    </Collapsible>
  )
}`,
  related: ["accordion", "card", "button"]
} satisfies ComponentDoc;
