// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "resizable" as const,
  title: "Resizable" as const,
  category: "Layout" as const,
  description: "Panels you can drag apart. The seam between two panels is stitched by hand, gets a paper tab with a grip if you ask, darkens under the pointer and is pulled tight into one blue line while you drag. Built on Reka Splitter 4: keyboard resizing, collapsible panels and persisted layouts included." as const,
  status: "stable" as const,
  upstream: "resizable" as const,
  parts: [{
    name: "ResizablePanelGroup" as const,
    description: "Reka Splitter' `Group`. Sizes are percentages (or px, rem, vh: `\"30%\"`, `240`, `\"20rem\"`). The group clips (`overflow: hidden`, which the library does not let you override except through `style.overflow`): pass `style={{ overflow: \"visible\" }}` if a panel draws beyond its edge. Coming from Reka Splitter 2 (older shadcn code): `direction` is now `orientation`, `autoSaveId` is `useDefaultLayout`, and a number size is pixels, so `defaultSize={30}` becomes `defaultSize=\"30%\"`." as const,
    props: [{
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "Panels side by side (seams are vertical) or stacked (seams are horizontal)." as const
    }, {
      name: "defaultLayout / onLayoutChanged" as const,
      type: "Layout / (layout, meta) => void" as const,
      description: "Remember a layout: keys are panel ids, values percentages. `useDefaultLayout({ id, storage })` returns both props for any storage with getItem / setItem." as const
    }, {
      name: "groupRef" as const,
      type: "Ref<GroupImperativeHandle>" as const,
      description: "`getLayout()` and `setLayout()`; `useGroupRef()` makes one." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "No panel can be resized. Its handles stay focusable (as in the library) and are drawn as the faint disabled thread." as const
    }]
  }, {
    name: "ResizablePanel" as const,
    description: "A panel. `className` goes to the panel's inner element (the library keeps its own flex style on the outer one)." as const,
    props: [{
      name: "id" as const,
      type: "string" as const,
      description: "Identifies the panel in layouts; give one to every panel of a persisted group." as const
    }, {
      name: "defaultSize / minSize / maxSize" as const,
      type: "number | string" as const,
      description: "Numbers are pixels; strings are percentages (\"30\", \"30%\") or units (\"20rem\")." as const
    }, {
      name: "collapsible / collapsedSize / collapsedThreshold" as const,
      type: "boolean / size / size" as const,
      description: "A collapsible panel snaps shut when dragged below its minimum." as const
    }, {
      name: "panelRef / onResize" as const,
      type: "Ref<PanelImperativeHandle> / (size) => void" as const,
      description: "`collapse()`, `expand()`, `resize(size)`, `getSize()`, `isCollapsed()`; `usePanelRef()` makes one." as const
    }]
  }, {
    name: "ResizableHandle" as const,
    description: "The separator (`role=\"separator\"`, focusable). A row of 8 px: stitches, with a slip of paper carrying a grip glyph when `withHandle` is set. Its drawn layers follow the library's `data-separator` (`hover`, `active`) so the wider hit region works." as const,
    props: [{
      name: "withHandle" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Add the paper tab with a grip." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Faint thread, no tab, not draggable." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId()." as const
    }]
  }],
  a11y: ["The handle is a `role=\"separator\"` with `aria-orientation`, `aria-valuenow` / `aria-valuemin` / `aria-valuemax` and `aria-controls` (the primary panel), and is in the tab order. Give it an `aria-label` that says what it resizes.", "Arrow keys move it by 5%, Home and End jump to the limits, Enter collapses or restores a collapsible panel, all from Reka Splitter. Dragging works with mouse, touch and pen; the hit area is larger than the drawing (at least 24 px for a mouse and 37 px for a finger; the group asks the library for that through `resizeTargetMinimumSize`, which you can override).", "ArrowLeft / ArrowRight shrink / grow the first panel whatever the reading direction (Reka Splitter does not mirror them), so on a `dir=\"rtl\"` page the handle moves against the arrow. Up / Down are exact in a vertical group.", "The stitches, the tab and the blue line are aria-hidden decoration; the grip glyph is decorative too.", "Keyboard focus draws a blue ring round the middle of the seam (round the tab, when there is one). Windows high contrast draws a real outline round the handle.", "Hover, dragging and focus each show without hue: the stitches darken, the seam becomes one continuous line, the ring appears."],
  usage: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export function Example() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-64 max-w-md">
      <ResizablePanel defaultSize="50%">One</ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize" />
      <ResizablePanel defaultSize="50%">Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}`,
  related: ["scroll-area", "card", "tabs", "sidebar"]
} satisfies ComponentDoc;
