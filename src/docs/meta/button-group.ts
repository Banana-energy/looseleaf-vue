// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "button-group" as const,
  title: "Button Group" as const,
  category: "Actions" as const,
  description: "Buttons, fields and printed cells joined into one row (or column) that share their seams: the edge two neighbors have in common is drawn once, by the one before, or by a pencil separator you put between them." as const,
  status: "stable" as const,
  upstream: "button-group" as const,
  parts: [{
    name: "ButtonGroup" as const,
    description: "A role=group flex row. It does not draw anything itself: every child (Button, Input, a Select trigger, ButtonGroupText) is its own hand-drawn host, and the group trims the drawing where they meet: a child that is not first loses its start edge, and one that sits before a ButtonGroupSeparator loses its end edge, so a seam is one stroke, not two. A focused child is never trimmed, so its ring stays whole." as const,
    props: [{
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "Vertical stacks the children and trims their top edges instead. Right-to-left layouts trim the other side." as const
    }, {
      name: "aria-label" as const,
      type: "string" as const,
      description: 'Name the group when the buttons do not explain themselves ("Range", "Text style").' as const
    }]
  }, {
    name: "ButtonGroupText" as const,
    description: 'A printed cell in the row ("https://", "@", "kg"): a paper-shade body under an ink box, real text in the hand font. Not a control: it has no hover or focus.' as const,
    props: [{
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your own element, e.g. a <label htmlFor>, with the cell's drawing inside it." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of this cell." as const
    }]
  }, {
    name: "ButtonGroupSeparator" as const,
    description: "A Separator (pencil, vertical by default) that stretches to the group's height and takes the place of the two edges around it. Takes every Separator prop: variant, orientation, decorative." as const,
    props: [{
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"vertical"' as const,
      description: "Use horizontal in a vertical group." as const
    }]
  }, {
    name: "buttonGroupVariants" as const,
    description: "The cva function behind ButtonGroup, for laying out another container the same way." as const,
    props: [{
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "Same as ButtonGroup." as const
    }]
  }],
  a11y: ["The group is role=group: give it an aria-label when the buttons alone do not say what they belong to. It adds no keyboard behavior of its own; Tab visits each control in order (use ToggleGroup for one tab stop with arrow keys).", "A separator between buttons is decorative (role=none); the buttons keep their own names and states.", "A focused child is lifted above its neighbors and keeps its whole blue felt ring; in Windows high contrast the drawing is replaced by each control's real border.", "ButtonGroupText is plain text: give an input it labels a real label (use asChild with <label htmlFor>) or an aria-label."],
  usage: `import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup aria-label="Range">
        <Button variant="outline">Years</Button>
        <Button variant="outline">Months</Button>
        <Button variant="outline">Days</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary">Copy</Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">Paste</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <Input aria-label="Host" placeholder="example.com" />
        <Button>Go</Button>
      </ButtonGroup>
    </div>
  )
}`,
  related: ["button", "toggle-group", "input-group", "separator", "dropdown-menu"]
} satisfies ComponentDoc;
