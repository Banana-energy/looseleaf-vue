// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "empty" as const,
  title: "Empty" as const,
  category: "Feedback" as const,
  description: "What a page says when there is nothing on it yet: media, a title in the script font, a line of explanation and an action. The media can be an icon on a slip of paper, Stubby the pencil stub in one of his poses, or a doodle; a `border` draws the sketched, dashed placeholder frame." as const,
  status: "stable" as const,
  upstream: "empty" as const,
  parts: [{
    name: "Empty" as const,
    description: "A centered column (gap 6, padding 24, 48 from `md`). Add `border` to `className` and the CSS border becomes a hand-drawn dashed frame with corner ticks; without it nothing is drawn." as const,
    props: [{
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the frame. Default: derived from useId()." as const
    }]
  }, {
    name: "EmptyHeader" as const,
    description: "The column of media, title and description (max 24 rem)." as const
  }, {
    name: "EmptyMedia" as const,
    description: "The picture above the words (`data-slot=\"empty-icon\"`, as upstream). Children go inside it as they are; `pose` and `doodle` are shortcuts for the art components." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "icon"' as const,
      default: '"default"' as const,
      description: "`icon` = a 44 px slip of paper with a hatched shadow and the icon (24 px) on it." as const
    }, {
      name: "pose" as const,
      type: '"idle" | "wave" | "think" | "write" | "sketch" | "celebrate" | "oops" | "shrug" | "sleep" | "peek" | "point" | "carry" | "halt" | "search" | "unplug"' as const,
      description: "Stubby, in a pose. Good matches: `search` no results, `sleep` nothing scheduled, `unplug` offline, `oops` an error, `shrug` not found, `celebrate` all done, `peek` loading, `think` working on it. A pose that has not been drawn yet renders nothing." as const
    }, {
      name: "doodle" as const,
      type: "string" as const,
      description: "A doodle by name (`paper-plane`, `cat-face`, `balloon`, `sparkle`...)." as const
    }, {
      name: "size" as const,
      type: "number" as const,
      default: "96 (Stubby), 80 (doodle)" as const,
      description: "Pixels tall. Stubby is a sticker whose box includes his white border, redrawn under 28, under 56 and from 140; the master starts at 56. Doodles are redrawn at 48 and below." as const
    }]
  }, {
    name: "EmptyTitle" as const,
    description: "The headline, in the script font at 26 px." as const
  }, {
    name: "EmptyDescription" as const,
    description: "Muted explanation; a link inside it is blue and underlined." as const
  }, {
    name: "EmptyContent" as const,
    description: "Actions and anything else below the header: a column, centered, max 24 rem." as const
  }],
  a11y: ["Empty is a plain group of divs, as upstream; the title is not a heading unless you make it one (put an `<h2>` inside `EmptyTitle`, or give the Empty a role and a name).", "Stubby, doodles and the icon tile are decoration (aria-hidden): the title and description carry the meaning. If the state is announced dynamically (search results going to none), put `role=\"status\"` on the Empty.", "Ink on paper is 14:1, the muted description 8.9:1. The dashed frame is decoration and carries no information.", "Buttons and links in EmptyContent are ordinary controls with their own focus rings.", "The frame and the tile are hairline in calm density, and hidden in Windows high contrast in favour of a plain outline."],
  usage: `import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export function Example() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia pose="search" />
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>Nothing matches your search. Try a shorter word.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Clear search</Button>
      </EmptyContent>
    </Empty>
  )
}`,
  related: ["mascot", "doodle", "card", "button"]
} satisfies ComponentDoc;
