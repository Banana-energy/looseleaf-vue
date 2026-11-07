// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Inbox" as const,
  description: "Letters on one side, the open one on a sheet of its own on the other. Closed envelopes are unread, opened ones are read; the list is a single tab stop moved with the arrow keys. Folders, a search, unread only, archive, delete, star, mark unread and a reply box, with a status line for every move. On a phone it shows one pane at a time with a way back. Made for the desk." as const,
  tags: ["inbox", "mail", "list", "reading pane"]
} satisfies BlockDoc;
