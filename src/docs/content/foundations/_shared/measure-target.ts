// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export interface Size {
  w: number;
  h: number;
  grow: number;
}
export function measureTarget(root: HTMLElement): Size {
  const box = root.getBoundingClientRect();
  let w = box.width;
  let h = box.height;
  const control = root.querySelector<HTMLElement>("button, input, [role=checkbox], [role=switch], [role=radio]");
  const real = typeof navigator === "undefined" || !/jsdom/i.test(navigator.userAgent);
  if (control && real && (w > 0 || h > 0)) {
    try {
      const after = getComputedStyle(control, "::after");
      if (after.position === "absolute") {
        const aw = Number.parseFloat(after.width);
        const ah = Number.parseFloat(after.height);
        if (aw > w) w = aw;
        if (ah > h) h = ah;
      }
    } catch {}
  }
  return {
    w: Math.round(w),
    h: Math.round(h),
    grow: Math.max(0, Math.round(Math.min(w - box.width, h - box.height) / 2))
  };
}
