// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "item" as const,
  title: "Item" as const,
  category: "Data display" as const,
  description: "A row for lists of things: an icon or photo, a title with a line of description, some actions. Rows sit on ruled paper, a link row lights up under a highlighter swipe, and none of it carries ink of its own, so a list of hundreds costs nothing." as const,
  status: "stable" as const,
  upstream: "item" as const,
  parts: [{
    name: "Item" as const,
    description: "A flex row (a div, or your own element with asChild). The ruled pencil box of variant=outline, the wash of muted and the highlighter hover of a link or button row are CSS (masks made from a few tiny drawn tiles, defined once per page in one hoisted stylesheet), never an svg per row. Inside an ItemGroup it is a list item; an asChild row is wrapped in one, so the link keeps its own role." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "outline" | "muted"' as const,
      default: '"default"' as const,
      description: "default = bare; outline = a ruled pencil box whose corners meet (three hands, by seed); muted = a paper-shade wash with rounded corners." as const
    }, {
      name: "size" as const,
      type: '"default" | "sm"' as const,
      default: '"default"' as const,
      description: "Roomy (gap 16, padding 16) or snug (gap 10, padding 16 x 12). Compact and calm density are a step tighter each." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your own element (a link, a button); it hovers under the highlighter swipe, and takes the focus ring." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Picks which of the three hands draws this row's outline and rule. Default: derived from useId()." as const
    }]
  }, {
    name: "ItemGroup" as const,
    description: "A role=list column of rows." as const,
    props: [{
      name: "ruled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Ruled paper: a blue pencil line under each row, drawn by the stylesheet so it always matches the height of the row." as const
    }]
  }, {
    name: "ItemSeparator" as const,
    description: "A horizontal rule between rows: takes every Separator prop. Its default, the pencil line, is drawn by the same stylesheet as the rows (a mask, no svg), so a separator between each of a few hundred rows costs nothing. Any other variant (dashed, wavy, tape...) is a real Separator with a drawing of its own: use it sparingly. Do not combine it with ruled, which already draws a line under each row." as const
  }, {
    name: "ItemMedia" as const,
    description: "The leading (or trailing) picture." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "icon" | "image"' as const,
      default: '"default"' as const,
      description: "icon = a 36 px well with a ruled box and a paper-shade wash; image = a 40 px photograph with a white border that lies a degree crooked (alternating rows, straight in calm density)." as const
    }]
  }, {
    name: "ItemContent" as const,
    description: "The growing column that holds a title and a description." as const
  }, {
    name: "ItemTitle" as const,
    description: "The title: hand font, 16 px, bold." as const
  }, {
    name: "ItemDescription" as const,
    description: "A muted line of description, clamped to two lines; links inside are blue felt with an underline." as const
  }, {
    name: "ItemActions" as const,
    description: "The trailing controls." as const
  }, {
    name: "ItemHeader" as const,
    description: "A full-width row above the content (basis-full)." as const
  }, {
    name: "ItemFooter" as const,
    description: "A full-width row below the content (basis-full)." as const
  }],
  a11y: ["ItemGroup is role=list and every Item inside it is role=listitem (upstream leaves that to you, and axe reports the group otherwise). An asChild link or button is wrapped in a listitem, so it keeps its own role, name and keyboard behavior.", "A link or button row is one big hit area. Its focus mark is a plain 2 px blue outline, not the drawn felt ring of a Button (a row carries no drawing, so its ring is CSS too); hover is a highlighter swipe that is also visible without its hue (the swipe changes the background's lightness), and is off on touch screens.", "The drawing (outline, rules, wash) is decoration in CSS: it has no role, cannot take focus and does not change layout. In Windows high contrast it becomes a real 1 px border and a real rule.", "Muted text is 8.9:1 on paper; the description is clamped to two lines, so put anything essential in the title."],
  usage: `import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"

export function Example() {
  return (
    <ItemGroup ruled className="max-w-md">
      <Item>
        <ItemMedia variant="icon">
          <Icon name="bell" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Notifications</ItemTitle>
          <ItemDescription>Choose what lands in your inbox.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">Edit</Button>
        </ItemActions>
      </Item>
      <Item asChild>
        <a href="/pages">
          <ItemContent>
            <ItemTitle>All pages</ItemTitle>
          </ItemContent>
        </a>
      </Item>
    </ItemGroup>
  )
}`,
  related: ["card", "separator", "empty", "table", "avatar"]
} satisfies ComponentDoc;
