// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "avatar" as const,
  title: "Avatar" as const,
  category: "Data display" as const,
  description: "A face, circled in felt tip. The picture is circled by a hand-drawn loop; without one the initials sit on a disc of marker in a stationery color chosen from the name. A status dot goes on the corner, and a group overlaps its faces and ends in a sketched \"+3\"." as const,
  status: "stable" as const,
  upstream: "avatar" as const,
  parts: [{
    name: "Avatar" as const,
    description: "The Reka UI Avatar root, a round `span`. It does not clip (the picture and the disc round themselves, always as circles: the hand-drawn loop is a circle too, so a `rounded-lg` on the root, as some sidebar templates use, does not square the face) so the loop can bleed past its box. `data-size` is read by its parts." as const,
    props: [{
      name: "size" as const,
      type: '"sm" | "default" | "lg" | "xl"' as const,
      default: '"default"' as const,
      description: "24, 32, 40 or 56 px. Anything else: give it a `size-*` class." as const
    }, {
      name: "ring" as const,
      type: '"ink" | "you" | "marker" | "none"' as const,
      default: '"ink"' as const,
      description: "The pen of the loop round the face: ink fine-liner, blue felt, a marker halo (\"this one is current\"), or none, which draws nothing (long lists)." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the loop. Default: derived from useId()." as const
    }]
  }, {
    name: "AvatarImage" as const,
    description: "The picture (`<img>`, round, `object-cover`). Reka UI shows it once it has loaded and the fallback until then, or when it fails." as const
  }, {
    name: "AvatarFallback" as const,
    description: "The initials disc, shown while there is no picture." as const,
    props: [{
      name: "name" as const,
      type: "string" as const,
      description: "The person's name: picks the color, makes the initials when there are no children, and is read out by screen readers in place of the letters." as const
    }, {
      name: "tone" as const,
      type: '"tomato" | "tangerine" | "lemon" | "grass" | "teal" | "sky" | "grape" | "bubblegum"' as const,
      description: "A color of your own instead of the one the name picks." as const
    }, {
      name: "delayMs" as const,
      type: "number" as const,
      description: "Reka UI: wait this long before showing the fallback, to avoid a flash while the picture loads." as const
    }]
  }, {
    name: "AvatarBadge" as const,
    description: "A dot on the corner of the face. Its size follows the avatar's; an icon child shows from `default` up." as const,
    props: [{
      name: "status" as const,
      type: '"online" | "away" | "busy" | "offline" | "marker"' as const,
      default: '"marker"' as const,
      description: "grass, tangerine, tomato, pencil gray, or the marker of the theme. Give it text for screen readers (`<span className=\"sr-only\">online</span>`)." as const
    }]
  }, {
    name: "AvatarGroup" as const,
    description: "Overlaps its avatars by about a quarter of a face (a logical negative margin that follows `size`) and cuts each face out of the one under it with a 2 px ring in the card color. When the group sits on the page or another surface, name that color: `className=\"[--ll-avatar-group-ring:var(--background)]\"`." as const
  }, {
    name: "AvatarGroupCount" as const,
    description: "A sketched dashed disc for \"the rest\": text (`+3`) or an icon. It matches the size of the group's avatars." as const
  }],
  a11y: ["The loop, the disc and the dot are aria-hidden decoration. Give the picture an `alt` (or `alt=\"\"` next to the name in text), and give AvatarFallback a `name` so the person is read out instead of two letters.", "Color is never the only carrier: the initials say who, and the badge needs its own text for its meaning (online, busy). The initials are ink on a 62% marker, 5.5:1 or better on all eight colors.", "An avatar is not interactive. Wrap it in a Button or link yourself, and the hand-drawn loop then sits inside that control's focus ring.", "The same name is always the same color on the server and in the browser (a hash of the trimmed, lower-cased name), so nothing changes at hydration.", "Windows high contrast removes the drawings and keeps the picture or initials."],
  usage: `import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"

export function Example() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="/ada.png" alt="Ada Lovelace" />
        <AvatarFallback name="Ada Lovelace" />
        <AvatarBadge status="online" />
      </Avatar>
      <Avatar>
        <AvatarFallback name="Jo Okafor" />
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  )
}`,
  related: ["badge", "card", "table", "tooltip"]
} satisfies ComponentDoc;
