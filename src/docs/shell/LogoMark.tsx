// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
const RULES = [14.5, 20.5, 26.5, 32.5, 38.5];
const HOLES = [12.8, 24.4, 36];
export const LogoMark = defineUi<{
  size?: number;
  className?: string;
}>("LogoMark", ["size", "class"], (_props, {
  slots: _slots
}) => {
  const size = computed(() => _props["size"] === undefined ? 32 : _props["size"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <svg data-slot="logo-mark" viewBox="0 0 48 48" width={size.value} height={size.value} aria-hidden="true" focusable="false" class={cn("shrink-0 overflow-visible", className.value)}>
      <g transform="rotate(-6 26 24)">
        <path d="M14.6 5.1Q26.4 4.5 38.6 4.8Q41 4.9 41.1 7.3Q41.6 24.4 41.4 40.9Q41.3 43.3 38.9 43.4Q25.8 44 14.2 43.8Q11.8 43.7 11.8 41.4Q11.6 24 12 7.6Q12.1 5.2 14.6 5.1Z" fill="var(--ll-paper)" stroke="var(--ll-ink)" stroke-width="2.2" stroke-linejoin="round" />
        {RULES.map(y => <path key={y} d={`M22.8 ${y}H38.4`} stroke="var(--ll-ink-you)" stroke-opacity="0.5" stroke-width="1.2" stroke-linecap="round" />)}
        <path d="M24.2 20.1Q30.2 19.4 35.6 20" stroke="var(--ll-marker)" stroke-opacity="0.9" stroke-width="3.4" stroke-linecap="round" fill="none" />
        <path d="M20.6 5.8L20.8 43" stroke="var(--ll-red)" stroke-opacity="0.85" stroke-width="1.3" stroke-linecap="round" />
        {HOLES.map(y => <circle key={y} cx="16.2" cy={y} r="2.1" fill="var(--ll-desk)" stroke="var(--ll-ink)" stroke-width="1.5" />)}
      </g>
    </svg>;
  };
});
