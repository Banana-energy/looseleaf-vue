// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "menubar" as const,
  title: "Menubar" as const,
  category: "Navigation" as const,
  description: "A desktop-style menu bar: a strip of paper with a pencil ruler along its foot and the menu titles written on it. Hovered, focused or open, a title wears the highlighter; each menu opens the same slip as the dropdown. Roving focus, hover-to-switch and typeahead are Reka UI's." as const,
  status: "stable" as const,
  upstream: "menubar" as const,
  parts: [{
    name: "Menubar" as const,
    description: "The bar (Reka UI Menubar root, role=menubar) and the ink host of the strip: a pale paper-shade body under a fine felt outline, a pencil ruler's ticks along the foot. Hairline and without the ruler in calm density." as const,
    props: [{
      name: "value / defaultValue / onValueChange" as const,
      type: "string / string / (value: string) => void" as const,
      description: "Which menu is open (a `MenubarMenu` `value`)." as const
    }, {
      name: "dir" as const,
      type: '"ltr" | "rtl"' as const,
      description: "Reading direction; the arrows and the drawings follow it." as const
    }, {
      name: "loop" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Arrow keys wrap around the ends of the bar." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId()." as const
    }]
  }, {
    name: "MenubarMenu" as const,
    description: "One title with its menu (Reka UI Menu). Give it a `value` when the bar is controlled." as const
  }, {
    name: "MenubarTrigger" as const,
    description: "A title on the strip (role=menuitem). It is not an ink host: hover, focus and open wear the highlighter." as const
  }, {
    name: "MenubarPortal" as const,
    description: "Portal for content you compose by hand." as const
  }, {
    name: "MenubarContent" as const,
    description: "The slip: a Paper that is also the Reka UI content (role=menu). Rows scroll in a viewport inside it so the shadow is not cut. `max-h-*`, `overflow-*` and `overscroll-*` in `className` are applied to that viewport (shadcn code writes them on the content), the rest stays on the slip. Every Reka UI Content prop passes through." as const,
    props: [{
      name: "align" as const,
      type: '"start" | "center" | "end"' as const,
      default: '"start"' as const,
      description: "Where the slip sits under its title." as const
    }, {
      name: "alignOffset" as const,
      type: "number" as const,
      default: "-4" as const,
      description: "Nudges the slip so its text lines up with the title." as const
    }, {
      name: "sideOffset" as const,
      type: "number" as const,
      default: "8" as const,
      description: "Gap between the bar and the slip." as const
    }, {
      name: "stock" as const,
      type: "StockName" as const,
      default: '"slip"' as const,
      description: "What it is made of: slip, paper, kraft, sticky-* ..." as const
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
    }]
  }, {
    name: "MenubarGroup" as const,
    description: "Groups rows (role=group)." as const
  }, {
    name: "MenubarLabel" as const,
    description: "A heading in the typewriter." as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }]
  }, {
    name: "MenubarItem" as const,
    description: "A row; the highlighter is a CSS background." as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }, {
      name: "variant" as const,
      type: '"default" | "destructive"' as const,
      default: '"default"' as const,
      description: "Destructive is red, and hatches in red pencil when highlighted." as const
    }]
  }, {
    name: "MenubarCheckboxItem" as const,
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
    name: "MenubarRadioGroup" as const,
    description: "Holds radio rows; `value` and `onValueChange` make it controlled." as const
  }, {
    name: "MenubarRadioItem" as const,
    description: "One choice: a pencil ring with a bold felt dot in the chosen one." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "The value this row stands for." as const
    }]
  }, {
    name: "MenubarSeparator" as const,
    description: "A pencil rule between groups (the Separator component)." as const
  }, {
    name: "MenubarShortcut" as const,
    description: "Keys at the end of a row: a string is drawn as keycaps (`⌘T` is two keys, `Ctrl+N` two, `F5` one), anything else is put in as it is." as const
  }, {
    name: "MenubarSub" as const,
    description: "A nested menu (Reka UI Sub)." as const
  }, {
    name: "MenubarSubTrigger" as const,
    description: "The row that opens it, with a hand-drawn chevron; it keeps the highlighter while its sub-menu is open." as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }]
  }, {
    name: "MenubarSubContent" as const,
    description: "The sub-menu's own slip, set down beside its row with its first row level with the one that opened it (`alignOffset` -4, the slip's padding)." as const
  }],
  a11y: ["Reka UI Menubar: role=menubar with menuitem titles (aria-haspopup, aria-expanded). Left and Right (mirrored in RTL) move between titles; Enter, Space or ArrowDown opens a menu with its first row highlighted (ArrowUp on a title opens nothing). Once one is open, hovering another title or pressing Left or Right from a plain row switches menus.", "Inside a menu: Up and Down move (disabled rows are skipped), Home and End jump, typing a letter jumps to the next row that starts with it, ArrowRight opens a sub-menu and ArrowLeft closes it, Enter or Space chooses, Escape closes and returns focus to the title. The bar is one tab stop.", "The strip and its ruler are aria-hidden decoration with no pointer events; the titles keep a 28 px hit box. The highlight follows the keyboard as well as the pointer, and keyboard focus on a title also shows the theme's blue focus ring; inside a menu the row with keyboard focus gets a bar of blue felt at its start edge.", "Ticks, dots, chevrons and pencil boxes are aria-hidden drawings; keycaps are real `kbd` elements. Portalled content repeats the InkProvider's data-density, data-motion and data-theme. In forced-colors mode the strip gives way to a real outline and the hovered, focused or open title takes the system highlight colors."],
  usage: `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function Example() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`,
  related: ["dropdown-menu", "navigation-menu", "context-menu", "tabs"]
} satisfies ComponentDoc;
