// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "sidebar" as const,
  title: "Sidebar" as const,
  category: "Navigation" as const,
  description: "An order pad hung from the top of the screen: cream paper with a torn top edge and a binder clip. Rows carry their own line of the pad's ruling, hover is the highlighter, and the current page is marked with a highlighter swipe and a bracket in the margin. It collapses to icons or slides away, becomes a sheet on phones, and stays cheap for a long menu: only the one active row draws anything." as const,
  status: "stable" as const,
  upstream: "sidebar" as const,
  parts: [{
    name: "SidebarProvider" as const,
    description: "Holds the open state (cookie `sidebar_state`, 7 days), the Ctrl/Cmd+B shortcut, the phone sheet's state and a TooltipProvider. Set the widths with `--sidebar-width` and `--sidebar-width-icon` in `style`." as const,
    props: [{
      name: "defaultOpen" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Initial state when uncontrolled. Read the cookie on the server to restore it." as const
    }, {
      name: "open / onOpenChange" as const,
      type: "boolean / (open: boolean) => void" as const,
      description: "Controlled state." as const
    }]
  }, {
    name: "Sidebar" as const,
    description: "The pad. Desktop: a fixed container beside a gap that reserves its width, holding the pad (a Paper: order-pad stock, torn top edge drawn, binder clip). Phone: the same pad in a Sheet. `className` and props go to the fixed container, as upstream." as const,
    props: [{
      name: "side" as const,
      type: '"left" | "right"' as const,
      default: '"left"' as const,
      description: "Which edge it hangs on." as const
    }, {
      name: "variant" as const,
      type: '"sidebar" | "floating" | "inset"' as const,
      default: '"sidebar"' as const,
      description: "`sidebar` docks to the edge and casts its shadow toward the page; `floating` is set down on the desk a little turned; `inset` leaves room around the pad and turns SidebarInset into a sheet of paper." as const
    }, {
      name: "collapsible" as const,
      type: '"offcanvas" | "icon" | "none"' as const,
      default: '"offcanvas"' as const,
      description: "Slide away, shrink to icons (3rem, labels fade, the margin bracket hides), or never collapse." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"pad"' as const,
      description: "What the pad is made of. A stock with a cut edge (`paper`, `kraft`...) is a pure CSS sheet." as const
    }, {
      name: "clip" as const,
      type: "boolean" as const,
      default: "true (false with collapsible=\"none\")" as const,
      description: "The binder clip at the top. A docked pad hangs it in the gutter above the torn edge; the phone sheet and a `collapsible=\"none\"` pad have no gutter, so the clip stands on the paper and the pad's top padding grows to clear it (`collapsible=\"none\"` is opt-in, since a static pad sits wherever you put it). Never drawn in calm density or when collapsed to icons." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always tears and clips the pad the same way." as const
    }]
  }, {
    name: "SidebarTrigger" as const,
    description: "A ghost icon Button with a drawn panel glyph that toggles the sidebar (the sheet on phones). Takes every Button prop." as const
  }, {
    name: "SidebarRail" as const,
    description: "A thin strip on the pad's edge that toggles it on click. Not in the tab order (the trigger and Ctrl/Cmd+B are the keyboard routes)." as const
  }, {
    name: "SidebarInset" as const,
    description: "The page beside the pad, a `main` region. With `variant=\"inset\"` on the Sidebar it is a sheet of paper on the desk from the `md` breakpoint up (a CSS sheet: no SVG); with any other variant, and on a phone, the sheet is switched off. Pass `before:block` in `className` to keep the sheet beside every pad." as const
  }, {
    name: "SidebarHeader" as const,
    description: "Top of the pad: a column with 8 px padding." as const
  }, {
    name: "SidebarFooter" as const,
    description: "Bottom of the pad." as const
  }, {
    name: "SidebarContent" as const,
    description: "The scrolling middle. It does not scroll when collapsed to icons." as const
  }, {
    name: "SidebarSeparator" as const,
    description: "A pencil rule (the Separator component)." as const
  }, {
    name: "SidebarInput" as const,
    description: "An Input sized for the pad (32 px)." as const
  }, {
    name: "SidebarGroup" as const,
    description: "A section of the pad." as const
  }, {
    name: "SidebarGroupLabel" as const,
    description: "The section's heading, in the typewriter. It fades and closes up when collapsed to icons." as const,
    props: [{
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your element (a Collapsible trigger, say)." as const
    }]
  }, {
    name: "SidebarGroupAction" as const,
    description: "A small button at the end of the group's label row." as const,
    props: [{
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your element." as const
    }]
  }, {
    name: "SidebarGroupContent" as const,
    description: "Wraps a group's menu." as const
  }, {
    name: "SidebarMenu" as const,
    description: "The list (`ul`) of rows." as const
  }, {
    name: "SidebarMenuItem" as const,
    description: "One row (`li`)." as const
  }, {
    name: "SidebarMenuButton" as const,
    description: "The row's button, or your link with `asChild`. Not an ink host: hover and keyboard focus wear the highlighter as a CSS background, and a CSS gradient under it is the row's line of the pad's ruling (so the lines always meet the rows; hidden when collapsed to icons and in calm density). The current page (`isActive`) mounts one small drawing inside it, a highlighter swipe with a bracket in the margin; the `outline` variant draws a pencil box the same way." as const,
    props: [{
      name: "isActive" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Marks the current page: bold, highlighter, margin bracket, `data-active`. With `asChild` the link gets `aria-current=\"page\"` too." as const
    }, {
      name: "variant" as const,
      type: '"default" | "outline"' as const,
      default: '"default"' as const,
      description: "`outline` adds a pencil box." as const
    }, {
      name: "size" as const,
      type: '"default" | "sm" | "lg"' as const,
      default: '"default"' as const,
      description: "32, 28 or 48 px high." as const
    }, {
      name: "tooltip" as const,
      type: "string | TooltipContent props" as const,
      description: "Names the row when the sidebar is collapsed to icons (never shown when expanded or on phones)." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your link instead of a button; the mark lands inside it." as const
    }]
  }, {
    name: "SidebarMenuAction" as const,
    description: "A small button at the end of a row." as const,
    props: [{
      name: "showOnHover" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Only visible on hover or focus within the row (always visible on touch)." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your element (a DropdownMenuTrigger)." as const
    }]
  }, {
    name: "SidebarMenuBadge" as const,
    description: "A count at the end of a row, written in blue felt in the script font." as const
  }, {
    name: "SidebarMenuSkeleton" as const,
    description: "A loading row of pencil hatch. Its width is derived from the seed (50 to 90 %), not from a random number, so the server and the client agree." as const,
    props: [{
      name: "showIcon" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A square for the icon." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the width. Default: from useId()." as const
    }]
  }, {
    name: "SidebarMenuSub" as const,
    description: "A nested list under a row, indented, with a pencil line drawn down its start edge (one small drawing per open sub-menu)." as const
  }, {
    name: "SidebarMenuSubItem" as const,
    description: "One sub-row (`li`)." as const
  }, {
    name: "SidebarMenuSubButton" as const,
    description: "The sub-row's link (`a`), or your element with `asChild`. The current one is bold on the highlighter. 28 px high for one line; a title that wraps makes its row taller instead of running over the next one (a trailing `span` still truncates)." as const,
    props: [{
      name: "isActive" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Marks the current page." as const
    }, {
      name: "size" as const,
      type: '"sm" | "md"' as const,
      default: '"md"' as const,
      description: "15 or 16 px text." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your link." as const
    }]
  }, {
    name: "useSidebar" as const,
    description: "`{ state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }`. Throws outside a SidebarProvider." as const
  }],
  a11y: ["The sidebar adds no landmark of its own: wrap it in a `nav` (or give it `aria-label` on the Sidebar's container) so screen readers can find it. The rows are ordinary buttons and links in a list; `isActive` on a link (`asChild`) or a sub-menu button sets `aria-current=\"page\"` for you (pass your own to override; a plain button gets none); the drawing is decoration.", "Ctrl or Cmd + B toggles it from anywhere; the SidebarTrigger is a labeled button (\"Toggle Sidebar\"). The rail is not a tab stop. On phones the pad opens in a Sheet: a dialog named \"Sidebar\" that traps focus, closes with Escape or a tap on the scrim and gives focus back to whatever opened it (Reka UI only does that for its own Trigger, so the Sidebar remembers the opener itself). Growing the window past the phone width closes the sheet, so it does not come back by itself when the window shrinks again. Ctrl/Cmd+B is left alone when something nearer (a rich-text editor's Bold) has already handled the key.", "Keyboard focus on a row shows the highlighter and the theme's blue focus ring. Every row is at least 28 px high (32 by default); collapsed rows are 32 px squares, named by their tooltip and their text (keep the label in a `span` so it stays in the accessible name).", "When it collapses to icons the labels are hidden with CSS only, so the accessible names stay. Tooltips appear on hover and keyboard focus, never on touch.", "The torn edge, ruled lines, binder clip, bracket and sub-menu line are aria-hidden decoration with no pointer events. In forced-colors mode the clip is hidden and the drawings give way to real outlines. Reduced motion collapses the slide of the pad and the fade of the labels.", "The open state is remembered in the `sidebar_state` cookie; read it on the server to render the right state on first paint."],
  usage: `import { Icon } from "@/components/ui/icon"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function Layout({ children }: { children: Vue.VueNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive tooltip="Home">
                    <a href="/">
                      <Icon name="house" />
                      <span>Home</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}`,
  related: ["sheet", "collapsible", "dropdown-menu", "tooltip", "navigation-menu", "breadcrumb"]
} satisfies ComponentDoc;
