// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "tabs" as const,
  title: "Tabs" as const,
  category: "Navigation" as const,
  description: "Index-divider tabs: the active one is lifted and filled with highlighter, and the pencil baseline breaks under it. Also a hairline `line` style with a blue felt underline, and vertical binder tabs. Reka UI behavior and roving focus are untouched." as const,
  status: "stable" as const,
  upstream: "tabs" as const,
  parts: [{
    name: "Tabs" as const,
    description: "The Reka UI Tabs root. Vertical tabs lay the list and the panel side by side." as const,
    props: [{
      name: "value / defaultValue / onValueChange" as const,
      type: "string / string / (value: string) => void" as const,
      description: "Controlled and uncontrolled state." as const
    }, {
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "Vertical draws binder tabs on a spine and moves with ArrowUp / ArrowDown." as const
    }, {
      name: "activationMode" as const,
      type: '"automatic" | "manual"' as const,
      default: '"automatic"' as const,
      description: "Automatic opens a tab as focus reaches it; manual waits for Enter or Space." as const
    }, {
      name: "dir" as const,
      type: '"ltr" | "rtl"' as const,
      description: "Reading direction; the arrows and the drawings follow it." as const
    }]
  }, {
    name: "TabsList" as const,
    description: "The `role=\"tablist\"` row (or column). `tabsListVariants` is exported for consumers that style their own list." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "line"' as const,
      default: '"default"' as const,
      description: "`default` = paper index tabs; `line` = hairline with the active tab underlined in blue felt." as const
    }]
  }, {
    name: "TabsTrigger" as const,
    description: "A tab (Reka UI Trigger, a button). It hosts its own drawing: sketch and baseline at rest, felt outline on hover, highlighter fill when active, a blue ring on keyboard focus." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "Ties the tab to its TabsContent." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Dashed pencil sketch, skipped by the arrow keys." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId()." as const
    }]
  }, {
    name: "TabsContent" as const,
    description: "The panel (`role=\"tabpanel\"`, focusable with Tab). It fades in when its tab opens." as const
  }],
  a11y: ["Reka UI roles and keys: tablist, tab (aria-selected, aria-controls) and tabpanel (aria-labelledby). Left/Right (Up/Down when vertical, mirrored in RTL) move between tabs and, in automatic mode, open them; Home and End jump to the first and last; Tab goes on into the panel.", "The drawn tab, baseline and underline are aria-hidden and pointer-events: none; the tab keeps a 36 px hit box (32 compact, 28 calm).", "The active tab is told apart by fill and outline, not by hue alone. Inactive text is 4.6:1 on paper, active text 14:1.", "Keyboard focus draws a blue felt ring around the tab. Windows high contrast replaces the drawing with a real outline. Reduced motion turns the lift and the underline wipe into instant changes.", "The tab list keeps its shape in right-to-left layouts: the vertical spine moves to the other side and the drawings mirror."],
  usage: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Example() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}`,
  related: ["accordion", "card", "scroll-area", "navigation-menu"]
} satisfies ComponentDoc;
