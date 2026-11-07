// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "message-scroller" as const,
  title: "Message scroller" as const,
  category: "Chat" as const,
  description: "The scrolling transcript of a chat: it opens on the newest message, sticks to the bottom while a reply streams and lets go the moment you scroll up, pins your new message to the top so the reply grows beneath it, holds your place when older messages are added above, and wakes a \"jump to latest\" button when there is more below. Same parts and hooks as shadcn's message scroller, with the behavior written in, so no extra package." as const,
  status: "new" as const,
  upstream: "message-scroller" as const,
  parts: [{
    name: "MessageScrollerProvider" as const,
    description: "Holds the scroll state. Everything else, and the hooks, live inside it. It renders no element." as const,
    props: [{
      name: "autoScroll" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Follow the bottom while content grows (a streaming reply), until the person scrolls up; it follows again when they come back to the bottom. It may change while mounted (`autoScroll={status === \"streaming\"}`): switched on at the bottom it starts following at once, switched off it stops." as const
    }, {
      name: "defaultScrollPosition" as const,
      type: '"start" | "end" | "last-anchor"' as const,
      default: '"end"' as const,
      description: "Where a conversation opens. `last-anchor` puts the last `scrollAnchor` message at the top of the view when the exchange after it is taller than the page." as const
    }, {
      name: "scrollEdgeThreshold" as const,
      type: "number" as const,
      default: "8" as const,
      description: "How close to an edge counts as being at it, px." as const
    }, {
      name: "scrollPreviousItemPeek" as const,
      type: "number" as const,
      default: "64" as const,
      description: "How much of the message before an anchor stays in sight above it, px." as const
    }, {
      name: "scrollMargin" as const,
      type: "number" as const,
      default: "0" as const,
      description: "Space kept above a message scrolled to, px." as const
    }]
  }, {
    name: "MessageScroller" as const,
    description: "The root: `relative`, `flex-col`, and `data-scrollable=\"start end\"` while there is more to scroll in either direction (CSS reads it to fade the page edge)." as const
  }, {
    name: "MessageScrollerViewport" as const,
    description: "The scrolling element: `role=\"region\"` labeled \"Messages\" and focusable, so the keyboard can scroll it. Wheel, touch and scroll keys toward the start are read as the person taking over." as const,
    props: [{
      name: "preserveScrollOnPrepend" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Hold the message you are reading still when older messages are added above it." as const
    }]
  }, {
    name: "MessageScrollerContent" as const,
    description: "The transcript: `role=\"log\"` (polite, additions) with a hidden spacer at the end that makes room for a pinned message on an empty page." as const,
    props: [{
      name: "spacerClassName" as const,
      type: "string" as const,
      description: "Class for the spacer element." as const
    }]
  }, {
    name: "MessageScrollerItem" as const,
    description: "One message. Give it a `messageId` so it can be scrolled to and reported as visible. Unlike upstream it is not `content-visibility: auto`: that paint containment would cut off the tails and reaction chips that hang past a bubble. For thousands of messages render a window of them, or add `[content-visibility:auto] p-3` yourself." as const,
    props: [{
      name: "messageId" as const,
      type: "string" as const,
      description: "Stable id for `scrollToMessage` and `useMessageScrollerVisibility`." as const
    }, {
      name: "scrollAnchor" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "A message that goes to the top of the view when it arrives (your own, so the reply grows below it)." as const
    }]
  }, {
    name: "MessageScrollerButton" as const,
    description: "The jump button: awake (`data-active=\"true\"`) when there is more to scroll in its direction, inert and hidden otherwise. It is a secondary icon Button by default; pass `render` for your own element." as const,
    props: [{
      name: "direction" as const,
      type: '"start" | "end"' as const,
      default: '"end"' as const,
      description: "Which way it jumps." as const
    }, {
      name: "behavior" as const,
      type: "ScrollBehavior" as const,
      default: '"smooth"' as const,
      description: "How it scrolls." as const
    }, {
      name: "render" as const,
      type: "VueElement | (props, state) => VueElement" as const,
      description: "Render another element, keeping the button's props and state." as const
    }, {
      name: "variant / size" as const,
      type: "ButtonProps" as const,
      default: '"secondary" / "icon-sm"' as const,
      description: "For the default Button." as const
    }]
  }, {
    name: "useMessageScroller" as const,
    description: "`{ scrollToEnd, scrollToStart, scrollToMessage(id, { align, behavior, scrollMargin }) }`. Each returns whether it could. A message asked for before it exists is scrolled to when it arrives." as const
  }, {
    name: "useMessageScrollerScrollable" as const,
    description: "`{ start, end }`: is there more to scroll toward each edge? (`end` is false while the transcript is following the bottom.)" as const
  }, {
    name: "useMessageScrollerVisibility" as const,
    description: "`{ currentAnchorId, visibleMessageIds }`: the messages in view (the peek above does not count) and the last anchor scrolled past." as const
  }],
  a11y: ["The viewport is a labeled `region` and a tab stop, so a keyboard user can scroll with the arrows, Page keys, Home and End; the transcript inside it is a `role=\"log\"`, which announces additions politely.", "Taking over is detected from wheel, touch and scroll keys going toward the start, and from a dragged scrollbar (a scroll the scroller did not make itself; a press on the container, not on a message, while your message is pinned): following and pinning stop immediately and never fight the reader. Scrolling toward the end while you are already there changes nothing, so a stream keeps being followed.", "The jump button is `inert` (not focusable, not clickable) while there is nowhere to jump, and has a visually hidden label. Pressing it hands the keyboard to the transcript, so the arrows and Page keys carry on from there instead of restarting at the top of the page.", "Every word a streaming reply adds is an addition to the `log`, and a screen reader would read the reply piece by piece. While it streams pass `aria-live=\"off\"` to `MessageScrollerContent` and announce the finished reply once from a separate `role=\"status\"` (the examples do); the `TypingIndicator` covers \"someone is writing\".", "Smooth scrolling and the button's slide are decoration: with `prefers-reduced-motion` (or a `data-motion=\"reduced\"` ancestor) the durations collapse and the jump button scrolls instantly, even though it asks for `smooth`.", "The focus ring of the viewport (it is a tab stop) is drawn just inside its edge, because the fade mask would cut a ring drawn outside it.", "The page fades at an edge only while there is more to scroll there; the fade is a CSS mask, not a color."],
  usage: `import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

export function Transcript({ messages }: { messages: Array<{ id: string; mine: boolean; text: string }> }) {
  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="h-[480px]">
        <MessageScrollerViewport>
          <MessageScrollerContent>
            {messages.map((m) => (
              <MessageScrollerItem key={m.id} messageId={m.id} scrollAnchor={m.mine}>
                {m.text}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}`,
  related: ["message", "bubble", "prompt-input", "marker", "scroll-area"]
} satisfies ComponentDoc;
