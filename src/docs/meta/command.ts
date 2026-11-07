// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "command" as const,
  title: "Command" as const,
  category: "Overlays" as const,
  description: "A command palette on a slip of paper. Type and the list is sorted and cut down (cmdk's fuzzy match); the row you are on wears the highlighter, keys show as pencil keycaps, an empty search gets Stubby with his magnifier. Put it in a dialog and it is set on a napkin." as const,
  status: "stable" as const,
  upstream: "command" as const,
  parts: [{
    name: "Command" as const,
    description: "The palette (cmdk `Command`): every cmdk prop works (`value`, `onValueChange`, `filter`, `shouldFilter`, `loop`, `label`...). It lies on a slip of paper of its own, which switches itself off inside a Popover, Dialog, Card, Sheet or Drawer that already is paper. Like upstream's it is `h-full w-full`: put it in a box with a height, or pass `className=\"h-auto\"` (in a container that only has a `min-height` WebKit resolves `100%` against that and stretches the slip)." as const,
    props: [{
      name: "sheet" as const,
      type: "boolean | { stock, edge, tilt, tape, tapeKind, shadow, seed }" as const,
      default: "true" as const,
      description: "The slip under the palette. `false` draws none; an object picks another stock (`{ stock: \"napkin\" }`)." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "Accessible name (cmdk keeps it in a screen-reader-only label)." as const
    }]
  }, {
    name: "CommandDialog" as const,
    description: "The palette in a Dialog, set on a napkin with a pinked edge, pinned near the top of the window (a centered sheet would move the search field under your eyes as the list grows and shrinks; `className` overrides it). The title and description are for screen readers only. Opening it with a shortcut (Ctrl / Cmd + K) is yours to wire (see the example)." as const,
    props: [{
      name: "title / description" as const,
      type: "string" as const,
      default: '"Command Palette" / "Search for a command to run..."' as const,
      description: "The dialog's accessible name and description." as const
    }, {
      name: "showCloseButton" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The corner x. Off by default (upstream: on): a palette closes with Escape or a click outside." as const
    }, {
      name: "stock / edge / tape / tilt / seed" as const,
      type: "PaperProps" as const,
      default: 'stock "napkin"' as const,
      description: "What the sheet is made of and how it is cut; passed to the dialog's Paper." as const
    }, {
      name: "commandProps" as const,
      type: "Omit<CommandProps, 'children'>" as const,
      description: "Props for the Command inside (`shouldFilter`, `filter`, `loop`, `value`...)." as const
    }]
  }, {
    name: "CommandInput" as const,
    description: "The search field: a magnifier, blue felt text, a double rule drawn under the row (a blue one joins it when the field has focus). One ink drawing, on the wrapper; the input is a plain direct child. A polite status says how many results are left." as const,
    props: [{
      name: "resultsLabel" as const,
      type: "(count: number) => string" as const,
      default: '"No results" | "1 result" | "n results"' as const,
      description: "Text of the screen-reader status (translate it). It stays empty until something is typed." as const
    }, {
      name: "wrapperClassName" as const,
      type: "string" as const,
      description: "Classes for the row around the input." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand that draws the rule." as const
    }]
  }, {
    name: "CommandList" as const,
    description: "The scrolling list (`role=listbox`, max 300 px). The list scrolls, not the paper, so the slip's shadow and edge stay whole. cmdk sets `--cmdk-list-height` on it if you want to animate the height. A listbox may only hold options and groups (axe fails anything else), so `CommandEmpty` and `CommandLoading` are written into a slot beside it; put any other text (a hint, a footer) outside the list." as const
  }, {
    name: "CommandEmpty" as const,
    description: "Shown by cmdk when nothing matches: Stubby with his magnifier and your words in script. Write it inside `CommandList` as usual; it is drawn just below the (empty) listbox so the listbox stays valid." as const,
    props: [{
      name: "mascot" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "`false` leaves Stubby out." as const
    }]
  }, {
    name: "CommandLoading" as const,
    description: "cmdk's `Loading` (a `progressbar`) for results on their way: a line of cursive loops and your words, written beside the listbox like `CommandEmpty`. Pass `progress` if you know it." as const
  }, {
    name: "CommandGroup" as const,
    description: "Items under a `heading`, set like a typewritten kicker. Groups with no match hide themselves." as const
  }, {
    name: "CommandItem" as const,
    description: "One command. Props of cmdk's Item: `value`, `keywords`, `onSelect`, `disabled`, `forceMount`. The row under the cursor (`data-selected`) wears the highlighter; a disabled row is graphite and inert. No ink per row, so a palette of hundreds of commands costs nothing extra." as const
  }, {
    name: "CommandShortcut" as const,
    description: "The keys for a command at the end of its row. A text child becomes a pencil keycap (Kbd); pass several `<Kbd>`s yourself for a chord." as const
  }, {
    name: "CommandSeparator" as const,
    description: "A hand-drawn pencil rule between groups. It is `role=\"none\"` (a listbox may not contain a separator) and hides while a search is typed, like cmdk's own." as const
  }],
  a11y: ["cmdk: the input is a `role=combobox` with `aria-controls` and `aria-activedescendant`; the list is a `role=listbox` of `role=option` rows with `aria-selected` and `aria-disabled`. Focus stays in the input; the arrow keys move the highlight, Home and End jump, Enter chooses, and `loop` wraps.", "Ctrl + N / P / J / K also move the highlight (cmdk's vim bindings; `vimBindings={false}` turns them off).", "A polite status under the search field says \"3 results\" or \"No results\" after each keystroke, which cmdk does not do by itself. The empty message is shown as well.", "The highlighted row is a highlighter-yellow shape, not only a hue; a disabled row is graphite and dimmed but still readable.", "CommandDialog is a Reka UI dialog: focus goes into the input and Escape closes. Reka UI returns focus only to a `DialogTrigger`; a palette opened by a shortcut or a button that sets `open` has none, so CommandDialog remembers who had the focus when it opened and gives it back when it closes, unless the app has moved it on by then (choose a result, go to that page, and the focus stays on the new page's heading instead of jumping back to the button). Its title and description are `sr-only`.", "The input's `aria-activedescendant` always names the selected row: cmdk records it before it has redrawn the rows, so after typing it could name a row that was gone; `CommandInput` corrects it after every keystroke. If you render cmdk's `Command.Input` yourself inside a `Command`, call `useFreshActiveDescendant(inputRef)` from this file.", "Reduced motion: no drop-in or zoom, and no loop animation in Loading. Forced colors: the rule under the field becomes a real border and the highlighted row gets a Highlight background."],
  usage: `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command"

export function Example() {
  return (
    <Command className="w-80">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>
            Settings
            <CommandShortcut>Ctrl S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`,
  related: ["combobox", "dialog", "popover", "kbd"]
} satisfies ComponentDoc;
