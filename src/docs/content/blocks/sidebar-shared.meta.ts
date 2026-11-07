// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { BlockDoc } from "@/docs/core/catalog";
export default {
  title: "Sidebar parts" as const,
  description: "The pieces the sixteen sidebar blocks share: brand header, search box, team switcher, account menu, project and secondary lists, folding calendars, a page header with breadcrumbs, and the small hand-written note that stands where content goes. It installs by itself with any sidebar block; copy the parts you like into your app." as const,
  tags: ["sidebar", "parts", "shared"]
} satisfies BlockDoc;
