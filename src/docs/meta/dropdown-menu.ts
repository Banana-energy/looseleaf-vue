// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "dropdown-menu" as const,
  title: "Dropdown Menu" as const,
  category: "Overlays" as const,
  description: "A menu written on a slip of paper that drops from a button. The row under the pointer or the keyboard wears the highlighter, a ticked row is a pencil box with a felt-tip tick over it, shortcuts are drawn keycaps, and a destructive row hatches in red pencil instead. Sub-menus, typeahead and focus handling are Reka UI's." as const,
  status: "stable" as const,
  upstream: "dropdown-menu" as const,
  parts: [{
    name: "DropdownMenu" as const,
    description: "The Reka UI root: `open`, `defaultOpen`, `onOpenChange`, `modal`, `dir`." as const
  }, {
    name: "DropdownMenuTrigger" as const,
    description: "Opens the menu. Use `asChild` on a Button." as const
  }, {
    name: "DropdownMenuPortal" as const,
    description: "Portal for content you compose by hand." as const
  }, {
    name: "DropdownMenuContent" as const,
    description: "The slip: a Paper that is also the Reka UI content (role=menu). A CSS sheet with no SVG unless a torn edge is asked for. Rows scroll in a viewport inside it, never the slip, so its shadow and tape are not cut. `max-h-*`, `overflow-*` and `overscroll-*` in `className` are applied to that viewport (shadcn code writes them on the content), the rest stays on the slip. Every Reka UI Content prop passes through (`side`, `align`, `sideOffset`, `collisionPadding`...)." as const,
    props: [{
      name: "sideOffset" as const,
      type: "number" as const,
      default: "6" as const,
      description: "Gap between the trigger and the slip (upstream's is 4)." as const
    }, {
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
    name: "DropdownMenuGroup" as const,
    description: "Groups rows (role=group)." as const
  }, {
    name: "DropdownMenuLabel" as const,
    description: "A heading in the typewriter, like the kicker of a form." as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }]
  }, {
    name: "DropdownMenuItem" as const,
    description: "A row. It is not an ink host: the highlighter is a CSS background, so a plain row costs one element. (A ticked row carries two small icons, about 4 KB of markup: for a list of hundreds to choose from, reach for Command or Combobox.)" as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }, {
      name: "variant" as const,
      type: '"default" | "destructive"' as const,
      default: '"default"' as const,
      description: "Destructive is red, and its highlight is a red pencil hatch (a pattern, not only a hue)." as const
    }, {
      name: "onSelect" as const,
      type: "(event: Event) => void" as const,
      description: "Runs when it is chosen; call `event.preventDefault()` to keep the menu open." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Pencil-gray, skipped by the arrow keys, cannot be chosen." as const
    }]
  }, {
    name: "DropdownMenuCheckboxItem" as const,
    description: "A toggle row: a pencil box at the start, ticked in blue felt (written on) when `checked`." as const,
    props: [{
      name: "checked" as const,
      type: "boolean | 'indeterminate'" as const,
      description: "Controlled state." as const
    }, {
      name: "onCheckedChange" as const,
      type: "(checked: boolean) => void" as const,
      description: "Called when it is toggled." as const
    }]
  }, {
    name: "DropdownMenuRadioGroup" as const,
    description: "Holds radio rows; `value` and `onValueChange` make it controlled." as const
  }, {
    name: "DropdownMenuRadioItem" as const,
    description: "One choice: a pencil ring with a bold felt dot in the chosen one." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "The value this row stands for." as const
    }]
  }, {
    name: "DropdownMenuSeparator" as const,
    description: "A pencil rule between groups (the Separator component, so it is hand-drawn)." as const
  }, {
    name: "DropdownMenuShortcut" as const,
    description: "Keys at the end of a row. A string is drawn as keycaps: `⌘S` is two keys, `⇧⌘P` three (`⌘` is the drawn command glyph), `Ctrl+K` two, `F2` one. Anything that is not a string is put in as it is." as const
  }, {
    name: "DropdownMenuSub" as const,
    description: "A nested menu (Reka UI Sub): `open`, `defaultOpen`, `onOpenChange`." as const
  }, {
    name: "DropdownMenuSubTrigger" as const,
    description: "The row that opens it, with a hand-drawn chevron. It keeps the highlighter while its sub-menu is open." as const,
    props: [{
      name: "inset" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Lines the text up with rows that carry a tick or an icon." as const
    }]
  }, {
    name: "DropdownMenuSubContent" as const,
    description: "The sub-menu's own slip, set down beside its row with its first row level with the one that opened it (`alignOffset` -4, the slip's padding). Takes the same paper props as the content." as const
  }],
  a11y: ["Reka UI DropdownMenu: the trigger has aria-haspopup=menu, aria-expanded and aria-controls; the content is role=menu labeled by the trigger. Rows are menuitem, menuitemcheckbox (aria-checked) and menuitemradio.", "Enter, Space and ArrowDown on the trigger open it with the first row highlighted (ArrowUp opens nothing). Up and Down move (pass `loop` to the content to wrap), Home and End jump, typing a letter jumps to the next row that starts with it, ArrowRight opens a sub-menu and ArrowLeft closes it, Enter or Space chooses, Escape closes and returns focus to the trigger. Disabled rows are skipped.", "The highlight follows the keyboard as well as the pointer (`data-highlighted`) and is the focus indicator: dark text on the highlighter is 12:1, and because the highlighter itself is faint against the slip, a row with keyboard focus also gets a bar of blue felt at its start edge. A destructive row's cue is the word, the red glyph and the hatch.", "Ticks, dots, chevrons and the pencil boxes are aria-hidden drawings. Keycaps are real `kbd` elements; the command glyph carries the name Command.", "Rows are 32 px high (28 compact and calm). Nothing depends on hover. Portalled content repeats the InkProvider's data-density, data-motion and data-theme; with reduced motion it appears without the slide and zoom. In forced-colors mode the ticks keep the system text color and the highlighted row takes the system highlight colors."],
  usage: `import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>
          Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`,
  related: ["context-menu", "menubar", "select", "popover", "kbd"]
} satisfies ComponentDoc;
