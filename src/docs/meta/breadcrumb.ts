// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "breadcrumb" as const,
  title: "Breadcrumb" as const,
  category: "Navigation" as const,
  description: "The path to the page you are on, written in a notebook: names between pencil slashes, links that wear the highlighter when pointed at, and the current page underlined twice in blue felt. Swap the slash for a chevron or any node, and fold the middle of a long path into a dropdown." as const,
  status: "stable" as const,
  upstream: "breadcrumb" as const,
  parts: [{
    name: "Breadcrumb" as const,
    description: "The `nav` landmark, labeled \"breadcrumb\"." as const
  }, {
    name: "BreadcrumbList" as const,
    description: "The ordered list (`ol`). It wraps onto several lines when the path is long." as const
  }, {
    name: "BreadcrumbItem" as const,
    description: "One crumb (`li`)." as const
  }, {
    name: "BreadcrumbLink" as const,
    description: "A link on the path (an `a`, or your router link with `asChild`). Pointed at or keyboard-focused it wears the highlighter." as const,
    props: [{
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your element (Next's Link, a router NavLink)." as const
    }]
  }, {
    name: "BreadcrumbPage" as const,
    description: "The page you are on: bold, `aria-current=\"page\"`, underlined twice in blue felt (one pencil line in calm density). The underline is the only drawing in a breadcrumb; it becomes an ink host once it is measured." as const,
    props: [{
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId()." as const
    }]
  }, {
    name: "BreadcrumbSeparator" as const,
    description: "The mark between two crumbs (`li`, hidden from assistive technology). A hand-drawn slash by default; pass any node (an Icon chevron, a dot) as children." as const
  }, {
    name: "BreadcrumbEllipsis" as const,
    description: "Three pencil dots for the crumbs left out, with a screen-reader label. Put it in a DropdownMenuTrigger to open the hidden ones: give the trigger an `aria-label` (the ellipsis itself is aria-hidden) and keep the box at `size-6` (24 px) or more so it is easy to hit." as const
  }],
  a11y: ["Landmark and list semantics as in the WAI-ARIA breadcrumb pattern: `nav` labeled \"breadcrumb\" holding an ordered list; the current page carries `aria-current=\"page\"` (and, as upstream, `role=\"link\"` with `aria-disabled` since it goes nowhere).", "Separators and the ellipsis glyph are hidden from assistive technology; the ellipsis keeps an `sr-only` \"More\", and the button you wrap it in needs its own name (\"Toggle menu\").", "The underline and the highlighter are decoration with no pointer events and never move the text. Links keep the theme's focus ring; the current page is bold and underlined, so it does not depend on color."],
  usage: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`,
  related: ["pagination", "navigation-menu", "dropdown-menu", "tabs"]
} satisfies ComponentDoc;
