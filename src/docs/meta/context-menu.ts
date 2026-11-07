// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "context-menu" as const,
  title: "Context Menu" as const,
  category: "Overlays" as const,
  description: "The right-click menu, written on the same slip of paper as the dropdown and set down where the pointer was. Highlighter rows, drawn keycaps, pencil boxes and felt ticks, a red pencil hatch for what deletes. It opens on a right click, a long press on touch, or the menu key, and pops in where the pointer was." as const,
  status: "stable" as const,
  upstream: "context-menu" as const,
  parts: [{
    name: "ContextMenu" as const,
    description: "The Reka UI root: `onOpenChange`, `modal`, `dir`." as const
  }, {
    name: "ContextMenuTrigger" as const,
    description: "The region that answers a right click. Use `asChild` to make an existing element the region; `disabled` leaves the browser's own menu." as const
  }, {
    name: "ContextMenuPortal" as const,
    description: "Portal for content you compose by hand." as const
  }, {
    name: "ContextMenuContent" as const,
    description: "The slip: a Paper that is also the Reka UI content (role=menu), opened at the pointer. A CSS sheet with no SVG unless a torn edge is asked for; rows scroll in a viewport inside it so the shadow is not cut. `max-h-*`, `overflow-*` and `overscroll-*` in `className` are applied to that viewport (shadcn code writes them on the content), the rest stays on the slip. Every Reka UI Content prop passes through." as const,
    props: [{
      name: "stock" as const,
      type: "StockName" as const,
      default: '"slip"' as const,
      description: "What it is made of: slip, paper, kraft, sticky-*, index-card ..." as const
    }, {
      name: "edge" as const,
      type: "EdgeSpec" as const,
      default: '"cut"' as const,
      description: "Cut (pure CSS), torn, deckle ..." as const
    }, {
      name: "tilt" as const,
      type: "boolean | number" as const,
      default: "true" as const,
      description: "Small seeded tilt of the sheet; text stays upright." as const
    }, {
      name: "tape" as const,
      type: '"corner" | "top" | "both" | false' as const,
      default: "false" as const,
      description: "Strips of masking tape holding the slip down." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "ContextMenuGroup" as const,
    description: "Groups rows (role=group)." as const
  }, {
    name: "ContextMenuLabel" as const,
    description: "A heading in the typewriter." as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }]
  }, {
    name: "ContextMenuItem" as const,
    description: "A row; the highlighter is a CSS background, so it costs no ink." as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }, {
      name: "variant" as const,
      type: '"default" | "destructive"' as const,
      default: '"default"' as const,
      description: "Destructive is red, and its highlight is a red pencil hatch." as const
    }, {
      name: "onSelect" as const,
      type: "(event: Event) => void" as const,
      description: "Runs when it is chosen; `event.preventDefault()` keeps the menu open." as const
    }]
  }, {
    name: "ContextMenuCheckboxItem" as const,
    description: "A pencil box at the start of the row, ticked in blue felt when `checked`." as const,
    props: [{
      name: "checked" as const,
      type: "boolean | 'indeterminate'" as const,
      description: "Controlled state." as const
    }, {
      name: "onCheckedChange" as const,
      type: "(checked: boolean) => void" as const,
      description: "Called when toggled." as const
    }]
  }, {
    name: "ContextMenuRadioGroup" as const,
    description: "Holds radio rows; `value` and `onValueChange` make it controlled." as const
  }, {
    name: "ContextMenuRadioItem" as const,
    description: "One choice: a pencil ring with a bold felt dot in the chosen one." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "The value this row stands for." as const
    }]
  }, {
    name: "ContextMenuSeparator" as const,
    description: "A pencil rule between groups (the Separator component)." as const
  }, {
    name: "ContextMenuShortcut" as const,
    description: "Keys at the end of a row: a string is drawn as keycaps (`⌘[` is two keys, `Ctrl+R` two, `F2` one), anything else is put in as it is." as const
  }, {
    name: "ContextMenuSub" as const,
    description: "A nested menu (Reka UI Sub)." as const
  }, {
    name: "ContextMenuSubTrigger" as const,
    description: "The row that opens it, with a hand-drawn chevron; it keeps the highlighter while its sub-menu is open." as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }]
  }, {
    name: "ContextMenuSubContent" as const,
    description: "The sub-menu's own slip, set down beside its row with its first row level with the one that opened it (`alignOffset` -4, the slip's padding). Takes the same paper props as the content." as const
  }],
  a11y: ["Reka UI ContextMenu: opens on a right click, a long press on touch and the ContextMenu key or Shift+F10 on the focused region; the content is role=menu with menuitem, menuitemcheckbox and menuitemradio rows.", "Up and Down move (disabled rows are skipped), Home and End jump, typing a letter jumps to the next row that starts with it, ArrowRight opens a sub-menu and ArrowLeft closes it, Enter or Space chooses, Escape closes.", "A context menu must never be the only way to reach an action: put the same actions on a visible control (a DropdownMenu on a button) as well.", "The highlight follows the keyboard as well as the pointer (`data-highlighted`); a row with keyboard focus also gets a bar of blue felt at its start edge. Ticks, dots, chevrons and the pencil boxes are aria-hidden drawings; keycaps are real `kbd` elements.", "Rows are 32 px high (28 compact and calm). Portalled content repeats the InkProvider's data-density, data-motion and data-theme; with reduced motion it appears without the slide and zoom. In forced-colors mode the highlighted row takes the system highlight colors."],
  usage: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="grid h-40 w-72 place-items-center">Right click here</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}`,
  related: ["dropdown-menu", "menubar", "popover"]
} satisfies ComponentDoc;
