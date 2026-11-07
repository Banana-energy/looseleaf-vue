// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
const LOGOS = [{
  name: "Oatmeal & Co." as const,
  className: "font-script text-3xl font-bold" as const
}, {
  name: "Kiln" as const,
  className: "font-type text-xl tracking-[0.35em]" as const
}, {
  name: "paperwork bros" as const,
  className: "font-hand text-xl font-bold lowercase" as const
}, {
  name: "Northwind Ink" as const,
  className: "font-script text-3xl font-bold italic" as const
}, {
  name: "The Tea Room" as const,
  className: "font-type text-lg tracking-wide" as const
}, {
  name: "Brindle" as const,
  className: "font-script text-3xl font-normal" as const
}, {
  name: "Loom & Lantern" as const,
  className: "font-mono text-sm font-semibold tracking-[0.25em]" as const
}, {
  name: "salt studio" as const,
  className: "font-hand text-xl font-normal lowercase" as const
}] as const;
type Logo = typeof LOGOS[number];
const Logos01Name = defineUi<{
  logo: Logo;
  className?: string;
}>("Logos01Name", ["logo", "class"], (_props, {
  slots: _slots
}) => {
  const logo = computed(() => _props["logo"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <span class={cn("whitespace-nowrap", logo.value.className, className.value)}>{logo.value.name}</span>;
  };
});
export { LOGOS, Logos01Name };
export type { Logo };
