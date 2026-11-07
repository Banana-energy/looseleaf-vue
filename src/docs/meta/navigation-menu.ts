// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "navigation-menu" as const,
  title: "Navigation Menu" as const,
  category: "Navigation" as const,
  description: "A site's top navigation as a strip of index dividers: pencil-sketched tabs standing on a pencil line, the open one lifted and washed with highlighter, the current page filled. Its panel drops from under the strip as a slip of paper that follows the size of what is inside, and a felt-tip underline slides along to the open tab. Hover intent, arrow keys and the motion between panels are Reka UI's." as const,
  status: "stable" as const,
  upstream: "navigation-menu" as const,
  parts: [{
    name: "NavigationMenu" as const,
    description: "The Reka UI root (`nav`). Renders the shared viewport slip after its children unless told not to. The panel is not portalled: it hangs from the strip, so its `z-index` counts inside the nearest stacking context. Inside a Paper, a card or any other isolated header, give that element a z-index (`z-(--ll-z-raised)`) so the panel drops over the content that follows it." as const,
    props: [{
      name: "viewport" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "One slip shared by every panel, resized to the open one (and the panels slide inside it). `false`: each panel is a slip of its own set down under its tab." as const
    }, {
      name: "value / defaultValue / onValueChange" as const,
      type: "string / string / (value: string) => void" as const,
      description: "Which item is open." as const
    }, {
      name: "delayDuration / skipDelayDuration" as const,
      type: "number" as const,
      default: "200 / 300" as const,
      description: "Hover intent, in ms." as const
    }, {
      name: "dir / orientation" as const,
      type: "" as const,
      description: "Reka UI's. The tabs, arrows and drawings follow the reading direction." as const
    }]
  }, {
    name: "NavigationMenuList" as const,
    description: "The row of tabs (`ul`). It is the ink host of the pencil line they stand on." as const
  }, {
    name: "NavigationMenuItem" as const,
    description: "One entry: a trigger with its content, or a link (`li`)." as const
  }, {
    name: "NavigationMenuTrigger" as const,
    description: "A tab that opens a panel (a button, `aria-expanded`). Its drawing: a faint pencil sketch at rest, highlighter and felt under the pointer, lifted with a wash while open. The chevron turns over when it opens." as const,
    props: [{
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same tab. Default: from useId()." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A dashed pencil tab that does not open." as const
    }]
  }, {
    name: "NavigationMenuContent" as const,
    description: "A panel's contents. In the shared viewport it slides between items, clipped to the slip; without the viewport it is a slip of its own. Links inside it are rows." as const
  }, {
    name: "NavigationMenuViewport" as const,
    description: "The shared slip the open panel is written on: a Paper (a CSS sheet) around Reka UI's clipping viewport, dropped from under the strip and resized to fit." as const
  }, {
    name: "NavigationMenuLink" as const,
    description: "A link. Inside a panel it is a row that wears the highlighter (the current one stays on it). In the strip itself it is a tab, like the triggers, and the current page (`active`) is filled with highlighter: pass `asChild` to use your router's link. Inside a panel every svg without a `size-*` class is drawn 16 px (the icon rule), so give art such as a Mascot an explicit size." as const,
    props: [{
      name: "active" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The current page: `aria-current=\"page\"`, `data-active`, and the filled tab." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your link; the tab's drawing lands inside it." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of a tab link." as const
    }]
  }, {
    name: "NavigationMenuIndicator" as const,
    description: "The felt-tip underline under the strip that slides to the open tab and stretches to fit it. Shown only while a panel is open. Put it inside the List, after the items." as const
  }, {
    name: "navigationMenuTriggerStyle" as const,
    description: "The class of a tab (a cva). Reka UI links in the strip already wear it; use it for your own element that should look like a tab." as const
  }],
  a11y: ["Reka UI NavigationMenu: a `nav` landmark (give it `aria-label`), a list of items, triggers with `aria-expanded` and `aria-controls`. It is a disclosure pattern, not `role=menu`: panels hold ordinary links.", "Hover (with intent delay), click and Enter or Space open a panel; Escape closes it and returns focus to its trigger. Left and Right (mirrored in RTL) move between triggers and links, ArrowDown from an open trigger steps into the panel, and Tab moves through the panel's links and on. Focus leaving the menu closes it.", "The current page is `aria-current=\"page\"` and a filled tab, so it does not depend on color. The sketches, the pencil line, the underline and the highlighter are aria-hidden decoration with no pointer events. Tabs are 36 px high (32 compact, 28 calm).", "Touch: a tap opens a panel (hover is not needed). Reduced motion removes the drop, the slide between panels and the underline's glide. In forced-colors mode the drawings give way to real outlines."],
  usage: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function Example() {
  return (
    <NavigationMenu aria-label="Main">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-1">
              <li>
                <NavigationMenuLink href="/docs">Introduction</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/docs/install">Installation</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" active>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
  related: ["menubar", "tabs", "breadcrumb", "sidebar", "dropdown-menu"]
} satisfies ComponentDoc;
