// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "combobox" as const,
  title: "Combobox" as const,
  category: "Forms" as const,
  description: "A field you can search. Press it and a command list opens on a slip; type to narrow it, arrow keys and Enter to choose. It can be the single-select of the shadcn docs, an editable field, or a multi-select whose choices are hand-drawn hang-tags you can take back; it can offer to create what you typed and wait for results from a server." as const,
  status: "stable" as const,
  upstream: "combobox" as const,
  parts: [{
    name: "Combobox" as const,
    description: "The root. Holds the value, the open state and the search text, and wraps its children in a cmdk `Command` with no box of its own, so the search input can live in the list or in the field. **Deviation from upstream:** shadcn's new Combobox is built on base-ui; this one is Popover + Command (cmdk) + a field, the recipe shadcn documented before base-ui. The part names are the same where they make sense. Values are strings (the item's `value`), not objects; the label of an item is its text (or `label`, or the `items` you give the root); the search field is a child of `ComboboxContent`, not of the trigger; `ComboboxCollection` takes plain `items` (no `Group items`); `ComboboxChips` draws one tag per chosen value itself, so upstream's `<ComboboxValue>{(values) => values.map(...)}</ComboboxValue>` becomes `renderChip` (or nothing)." as const,
    props: [{
      name: "value / defaultValue / onValueChange" as const,
      type: "string | null  |  string[] (multiple)" as const,
      description: "One value, or an array with `multiple`. `value={null}` is a controlled, empty single-select." as const
    }, {
      name: "multiple" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Choose several. Choosing toggles and keeps the list open." as const
    }, {
      name: "items" as const,
      type: "(string | { value, label?, disabled?, keywords? })[]" as const,
      description: "Optional. Gives every value its label while the list is closed (a trigger or tag can show it before any row was mounted) and feeds a render-function `ComboboxList`." as const
    }, {
      name: "open / defaultOpen / onOpenChange" as const,
      type: "" as const,
      description: "Control the list." as const
    }, {
      name: "inputValue / defaultInputValue / onInputValueChange" as const,
      type: "string" as const,
      description: "The search text. Cleared when the list closes." as const
    }, {
      name: "shouldFilter / filter / loop" as const,
      type: "" as const,
      description: "cmdk's: `shouldFilter={false}` to filter yourself (a server search), `filter` for your own scoring, `loop` to wrap the arrow keys." as const
    }, {
      name: "loading" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Results are on their way: `ComboboxEmpty` waits so a search in flight is not answered with 'no results'." as const
    }, {
      name: "name" as const,
      type: "string" as const,
      description: "Hidden inputs, one per chosen value, for forms (one empty one when nothing is chosen). A form reset puts an uncontrolled combobox back to its `defaultValue`, like a native input (a controlled one is yours to reset)." as const
    }, {
      name: "disabled / invalid" as const,
      type: "boolean" as const,
      description: "As on an input; invalid draws the red pencil box." as const
    }, {
      name: "readOnly" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The value is shown (and submitted) but the list will not open and nothing can be chosen, removed or cleared. `aria-readonly` on the trigger, `readonly` on the input, disabled remove buttons on the tags." as const
    }, {
      name: "required" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A form will not submit while nothing is chosen. (A hidden input is exempt from form validation, so an invisible empty field does the failing; it sends the focus to the combobox. `aria-required` is set on the trigger or the input.)" as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "Accessible name of the list and of the dialog it sits in. Give it: without it a chips field or an editable input has no name." as const
    }, {
      name: "announce" as const,
      type: "false | ({ added, removed }) => string" as const,
      description: "`multiple` only: what the polite status says when values are added or removed (\"Astro selected\", \"Astro removed\"). Translate it, or `false` for none." as const
    }]
  }, {
    name: "ComboboxTrigger" as const,
    description: "The field you press: a `<button role=\"combobox\">` in the select trigger's pencil box with `chevrons-up-down` at its end. ArrowDown / ArrowUp / Enter / Space open the list. Put a ComboboxValue in it (that is the default child)." as const,
    props: [{
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand: the same seed always draws the same box." as const
    }]
  }, {
    name: "ComboboxValue" as const,
    description: "What is chosen, as text: the label(s), comma separated, in blue felt, or the `placeholder` in graphite. A function child gets `(value, labelFor)` to draw it yourself (`n selected`)." as const,
    props: [{
      name: "placeholder" as const,
      type: "VueNode" as const,
      description: "Shown while nothing is chosen." as const
    }]
  }, {
    name: "ComboboxContent" as const,
    description: "The slip the list sits on: a Popover as wide as the field (the paper carries `data-slot=\"popover-content\"`, with `data-slot=\"combobox-content\"` on the box inside). It takes the PopoverContent props (`side`, `align`, `sideOffset`, `pin`, `tape`, `stock`...). When the field is its own search box the focus stays in the field." as const,
    props: [{
      name: "anchor" as const,
      type: "RefObject<Element>" as const,
      description: "Line the list up with another element (from `useComboboxAnchor`)." as const
    }]
  }, {
    name: "ComboboxInput" as const,
    description: "Two things, by where it is. Inside `ComboboxContent`: the search box of the list (magnifier, blue felt text, a rule drawn under it). On its own, under `Combobox`: the field itself, an editable single-select that shows the chosen label until you type, opens as you type and puts the label back if you close without choosing." as const,
    props: [{
      name: "showTrigger" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Field mode: the chevron button that toggles the list." as const
    }, {
      name: "showClear" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Field mode: a small x that empties the field once something is chosen." as const
    }]
  }, {
    name: "ComboboxList" as const,
    description: "The scrolling list (`role=listbox`, named by the root's `label`). A function child draws one row per item of the root's `items`." as const
  }, {
    name: "ComboboxCollection" as const,
    description: "As upstream: one child per item, from its own `items` or the root's (`{(item) => <ComboboxItem value={item.value}>{item.label}</ComboboxItem>}`). It renders no element (cmdk sorts rows inside their group, and a wrapper would be in the way)." as const,
    props: [{
      name: "items" as const,
      type: "(string | { value, label?, disabled?, keywords? })[]" as const,
      description: "Default: the root's items." as const
    }]
  }, {
    name: "ComboboxItem" as const,
    description: "One choice. `value` is what the combobox stores; the label is the text inside (or `label`); both are searched (plus `keywords`). The chosen row ends in a blue tick and says 'selected' to screen readers. Choosing in a single combobox closes the list." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "What is stored." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "The text of the row for filtering and for the trigger, when the children are not a plain string." as const
    }, {
      name: "keywords" as const,
      type: "string[]" as const,
      description: "More words that find the row." as const
    }]
  }, {
    name: "ComboboxGroup" as const,
    description: "cmdk Group: `heading` names the group for screen readers; a group with no match hides itself." as const
  }, {
    name: "ComboboxLabel" as const,
    description: "A visual heading you can put inside a group." as const
  }, {
    name: "ComboboxSeparator" as const,
    description: "A hand-drawn pencil rule between groups." as const
  }, {
    name: "ComboboxEmpty" as const,
    description: "What shows when nothing matches: Stubby with his magnifier and your words. Hidden while `loading`." as const,
    props: [{
      name: "mascot" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "`false` leaves Stubby out." as const
    }]
  }, {
    name: "ComboboxLoading" as const,
    description: "Cursive loops and your words, for results on their way (render it while `loading`)." as const
  }, {
    name: "ComboboxCreate" as const,
    description: "The last row when what is typed is not one of the items: 'Create \"text\"'. Choosing it calls `onCreate(text)` (add it to your list there) and then chooses the text." as const,
    props: [{
      name: "onCreate" as const,
      type: "(text: string) => void" as const,
      description: "Called before the new value is chosen." as const
    }, {
      name: "children" as const,
      type: "VueNode | ((text: string) => VueNode)" as const,
      default: '`Create "text"`' as const,
      description: "The row's text." as const
    }]
  }, {
    name: "ComboboxChips" as const,
    description: "The field of a `multiple` combobox: a pencil box that holds one removable tag per chosen value and the input. Click anywhere in it to type; Backspace in the empty input takes the last tag back. It is the anchor of the list." as const,
    props: [{
      name: "tone" as const,
      type: '"hi" | "sky" | "grass" | "bubblegum" | "auto"' as const,
      default: '"hi"' as const,
      description: "Color of the tags; `auto` gives each value its own, from its text." as const
    }, {
      name: "renderChip" as const,
      type: "(value, label) => VueNode" as const,
      description: "Draw the tags yourself." as const
    }]
  }, {
    name: "ComboboxChip" as const,
    description: "One removable tag: a hang-tag drawn with its pointed end, a punched hole and a solid highlighter (or stationery-color) body, each a little different. The x is a real button named 'Remove <label>' that wears the highlighter on hover." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      description: "The value the x removes. Optional, as upstream: a text child is the value when this is not given." as const
    }, {
      name: "tone" as const,
      type: '"hi" | "sky" | "grass" | "bubblegum"' as const,
      default: '"hi"' as const,
      description: "Color of the body." as const
    }, {
      name: "showRemove" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Leave the x out." as const
    }]
  }, {
    name: "ComboboxChipsInput" as const,
    description: "The bare input inside ComboboxChips." as const
  }, {
    name: "ComboboxClear" as const,
    description: "The x that empties the field (used by `ComboboxInput showClear`); place it yourself in a custom field." as const
  }, {
    name: "useComboboxAnchor" as const,
    description: "A ref for `ComboboxContent anchor`, as upstream. `ComboboxChips` and the field input register their own anchor." as const
  }],
  a11y: ["The trigger is a `role=combobox` button with `aria-haspopup=\"dialog\"` (Reka UI's: the popup is a dialog holding the search box and the list), `aria-expanded` and, when `required`, `aria-required`; it needs a name (`aria-label` or a Label with `htmlFor`). The list opens in a named dialog (the root's `label`) holding cmdk's search combobox and listbox; focus goes to the search box and Escape closes and returns focus to the trigger.", "In field mode (`ComboboxInput` on its own, `ComboboxChips`) the input is the combobox: focus never leaves it, ArrowDown / ArrowUp open the list, the arrow keys move the highlight, Enter chooses, Escape closes. `aria-expanded` follows the list.", "Chosen rows say \"selected\" to screen readers as well as showing a tick. Tags are named \"Remove <label>\" on their x; Backspace in the empty input removes the last one. In a `multiple` combobox a polite status says what was added or removed (a tag taken back leaves nothing else to hear).", "The input's `aria-activedescendant` always names the row that is highlighted, after every keystroke and every arrow key, and is dropped when the list is closed or empty (cmdk records it before it has redrawn the rows, so after typing it named a row that was gone; the same fix is in `CommandInput`).", "Pressing a row with the mouse does not pull the focus out of the search box, so you can pick a tag and keep typing (or press Backspace); the x on a tag hands the focus back to the input.", "A polite status under the search box says how many results are left; the empty message and the loading row are announced by cmdk's own roles (`progressbar` for Loading).", "Nothing depends on hue alone: the highlighted row is a highlighter shape, the chosen row has a tick and a text cue, tags are shapes with a label and a remove button. In Windows high contrast the field gets a real border.", "Touch: the trigger is 36 px tall (32 compact, 28 calm), rows 36 px, the tag's x is a 24 px target."],
  usage: `import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export function Example() {
  return (
    <Combobox items={frameworks} label="Framework">
      <ComboboxTrigger aria-label="Framework" className="w-56">
        <ComboboxValue placeholder="Select framework..." />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search framework..." />
        <ComboboxList>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          {frameworks.map((f) => (
            <ComboboxItem key={f.value} value={f.value}>
              {f.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}`,
  related: ["command", "select", "popover", "input"]
} satisfies ComponentDoc;
