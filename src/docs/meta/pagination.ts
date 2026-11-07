// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "pagination" as const,
  title: "Pagination" as const,
  category: "Navigation" as const,
  description: "Page links as drawn buttons: each number is a Button around your own link, the page you are on is a block of highlighter, the arrows and the ellipsis are hand-drawn. It is just links, so it works with any router, or with plain hrefs and no JavaScript at all." as const,
  status: "stable" as const,
  upstream: "pagination" as const,
  parts: [{
    name: "Pagination" as const,
    description: "The `nav` landmark (`role=\"navigation\"`, labeled \"pagination\"), centered." as const
  }, {
    name: "PaginationContent" as const,
    description: "The list (`ul`) of items." as const
  }, {
    name: "PaginationItem" as const,
    description: "One entry (`li`)." as const
  }, {
    name: "PaginationLink" as const,
    description: "A page link: `<Button asChild>` around an `<a>`, so it is drawn (ghost, or secondary when active) and keeps your `href`, `target` and handlers. `buttonVariants()` on a bare anchor would give layout without the drawing, which is why this wraps a Button." as const,
    props: [{
      name: "isActive" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The current page: a block of highlighter, `aria-current=\"page\"`, `data-active`." as const
    }, {
      name: "size" as const,
      type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"' as const,
      default: '"icon"' as const,
      description: "A Button size. A page number is a square icon button." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "For a link that goes nowhere (the first page's Previous): drawn dashed, `aria-disabled`, out of the tab order, its click swallowed (your onClick does not run)." as const
    }]
  }, {
    name: "PaginationPrevious" as const,
    description: "A labeled link (\"Go to previous page\") with a drawn chevron. The word \"Previous\" hides on phones; the label stays." as const
  }, {
    name: "PaginationNext" as const,
    description: "The same, pointing on (\"Go to next page\")." as const
  }, {
    name: "PaginationEllipsis" as const,
    description: "Three pencil dots for the pages left out; hidden from assistive technology with an `sr-only` \"More pages\"." as const
  }],
  a11y: ["A `nav` landmark labeled \"pagination\" holding a list of links. The current page has `aria-current=\"page\"`; it is also bold-on-highlighter, so it does not rely on color.", "Previous and Next carry `aria-label`s that name their destination, so they read the same when the word is hidden on a phone. Give number links an accessible name of their own when the bare number is ambiguous (`aria-label=\"Page 3\"`).", "A disabled link is `aria-disabled`, removed from the tab order and drawn as the dashed alternative; its click is prevented and your `onClick` is not called.", "Each link is at least 36 px square (32 compact, 28 calm), a tab stop with the theme's drawn blue focus ring. Being plain anchors, they work without JavaScript and with any router."],
  usage: `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function Example() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`,
  related: ["button", "breadcrumb", "tabs", "table"]
} satisfies ComponentDoc;
