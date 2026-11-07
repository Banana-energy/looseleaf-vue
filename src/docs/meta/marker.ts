// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "marker" as const,
  title: "Marker" as const,
  category: "Chat" as const,
  description: "The pencil line between two days of a conversation, the red one where you stopped reading, and the quiet note that someone joined. A separator, a border or a plain line of small print." as const,
  status: "new" as const,
  upstream: "marker" as const,
  parts: [{
    name: "Marker" as const,
    description: "A flex row. `separator` pulls a pencil line on each side of the words; `border` pulls one under them; `default` is small print. The lines are aria-hidden drawings, so they never affect layout or the reading order." as const,
    props: [{
      name: "variant" as const,
      type: '"default" | "separator" | "border"' as const,
      default: '"default"' as const,
      description: "Where the line goes." as const
    }, {
      name: "tone" as const,
      type: '"default" | "new"' as const,
      default: '"default"' as const,
      description: "`new` pulls the lines in red pencil, sets the words bold on a highlighter swipe and reddens a MarkerIcon: the unread marker." as const
    }, {
      name: "rule" as const,
      type: '"line" | "wavy"' as const,
      default: '"line"' as const,
      description: "How a `border` marker's line is drawn." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render your own element (a button that jumps to the first unread message, say)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the lines." as const
    }]
  }, {
    name: "MarkerIcon" as const,
    description: "A 16 px slot for an Icon (aria-hidden). Red inside a `tone=\"new\"` marker." as const
  }, {
    name: "MarkerContent" as const,
    description: "The words. In a separator they are set in the script font at 20 px, like a date written in the margin." as const
  }],
  a11y: ["Markers are plain divs (as upstream). Inside a `role=\"log\"` transcript a separator is announced as its words: 'Today', 'New messages'.", "Nothing is conveyed by the drawing alone: the unread state is the words, and color is backed by the asterisk and the highlighter swipe.", "Use `asChild` with a `button` to make 'New messages' a control; the drawn focus ring is the button's own.", "Difference from upstream: `markerVariants` gives the layout only. The lines of `separator` and `border` are drawn parts of `Marker` (a pseudo-element cannot hold a drawing), so applying the variants to your own element draws no line.", "Ink lines are 3:1 or more against paper; the words are muted text at 8.9:1 (ink on the highlighter swipe 12:1)."],
  usage: `import { Icon } from "@/components/ui/icon"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export function Example() {
  return (
    <>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="separator" tone="new">
        <MarkerIcon><Icon name="asterisk" /></MarkerIcon>
        <MarkerContent>New messages</MarkerContent>
      </Marker>
    </>
  )
}`,
  related: ["message", "bubble", "message-scroller", "separator"]
} satisfies ComponentDoc;
