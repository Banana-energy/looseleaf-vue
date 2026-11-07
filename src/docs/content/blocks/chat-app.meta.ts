// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Chat app" as const,
  description: "A two-pane chat for a pen-pal look: a pad of conversations with search and an unread filter, and a thread with a transcript that pins your message and follows the reply as it is written word by word, attachments, tool notes, a code slip with a diff, and the composer on its napkin. One pane at a time on a phone. Both panes are sheets of paper, so it looks right on paper or on the desk." as const,
  tags: ["app", "chat", "messages", "composer"]
} satisfies BlockDoc;
