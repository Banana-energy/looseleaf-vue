// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Category = "Actions" | "Forms" | "Feedback" | "Overlays" | "Navigation" | "Layout" | "Data display" | "Charts" | "Paper" | "Marks" | "Stickers & doodles" | "Chat" | "Interactive" | "Typography" | "Icons";
export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}
export interface PartDoc {
  name: string;
  description?: string;
  props?: PropDoc[];
}
export interface ComponentDoc {
  slug: string;
  title: string;
  category: Category;
  description: string;
  status?: "stable" | "new" | "experimental";
  upstream?: string;
  parts: PartDoc[];
  a11y?: string[];
  usage: string;
  related?: string[];
}
export interface ExampleMeta {
  title: string;
  description?: string;
  layout?: "center" | "stack" | "full";
  height?: number;
  stage?: "paper" | "desk";
  contain?: boolean;
}
export interface ExampleModule {
  default: UI.ComponentType;
  meta: ExampleMeta;
}
