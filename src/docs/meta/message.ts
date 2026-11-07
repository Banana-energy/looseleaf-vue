// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "message" as const,
  title: "Message" as const,
  category: "Chat" as const,
  description: "The row of a chat message: an avatar, a column with a header, the bubbles and a footer, aligned to the start or the end. Also MessageText, which sets a reply word by word so streaming text soaks in like wet ink." as const,
  status: "new" as const,
  upstream: "message" as const,
  parts: [{
    name: "MessageGroup" as const,
    description: "A column of messages (gap 2)." as const
  }, {
    name: "Message" as const,
    description: "One message row. `align=\"end\"` reverses it and tells the bubbles inside to put their tail on that side." as const,
    props: [{
      name: "align" as const,
      type: '"start" | "end"' as const,
      default: '"start"' as const,
      description: "Which end of the row the message sits on." as const
    }]
  }, {
    name: "MessageAvatar" as const,
    description: "Sits at the bottom of the row, beside the last bubble. Put an avatar, a mascot or a doodle in it." as const
  }, {
    name: "MessageContent" as const,
    description: "The column: header, bubbles, footer. Everything with a data-slot inside it follows the alignment." as const
  }, {
    name: "MessageHeader" as const,
    description: "The name and time above the bubbles, in the hand font." as const
  }, {
    name: "MessageFooter" as const,
    description: "Delivery notes under the bubbles (seen, edited, sent)." as const
  }, {
    name: "MessageText" as const,
    description: "The words of a message as real text, set like a person wrote them: each word sits a hair off the baseline, some a shade lighter. While `streaming`, every word that arrives after the first render soaks in (dark and blurred, then dry in half a second) and a felt-tip caret rides after the last word." as const,
    props: [{
      name: "children" as const,
      type: "string" as const,
      description: "The text so far. Newlines are kept." as const
    }, {
      name: "streaming" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Soak new words in and show the caret." as const
    }, {
      name: "jitter" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The per-word wobble (zero in calm density and with reduced motion)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the wobble." as const
    }]
  }],
  a11y: ["All parts are plain divs (as upstream). Put the transcript in a `role=\"log\"` region, which MessageScrollerContent does for you.", "MessageText renders one span per word with normal spaces between them, so copy, paste, find-in-page and screen readers read it as ordinary text. The animation is a CSS one that reduced motion turns off; the words and the caret stay.", "Text in a right-to-left script (Hebrew, Arabic...) is not split into words. Such text is one plain span with `dir=\"auto\"`, so the browser orders, joins and shapes it itself (no per-word wobble or soak; the caret stays).", "Header and footer are 14 px muted text (8.9:1 on paper)."],
  usage: `import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent, MessageFooter, MessageHeader, MessageText } from "@/components/ui/message"

export function Example({ reply, streaming }: { reply: string; streaming: boolean }) {
  return (
    <Message>
      <MessageContent>
        <MessageHeader>Stubby</MessageHeader>
        <Bubble variant="muted">
          <BubbleContent>
            <MessageText streaming={streaming}>{reply}</MessageText>
          </BubbleContent>
        </Bubble>
        <MessageFooter>9:41</MessageFooter>
      </MessageContent>
    </Message>
  )
}`,
  related: ["bubble", "message-scroller", "marker", "typing-indicator", "prompt-input"]
} satisfies ComponentDoc;
