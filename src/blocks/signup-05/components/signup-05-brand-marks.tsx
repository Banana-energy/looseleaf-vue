// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ArtDef } from "@/lib/ink/art/types";
import { drawSkeleton, memo } from "@/lib/ink/art-draw";
import { useEnsureInkDefs } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
const MARKS = {
  apple: {
    grid: 24,
    parts: [["s", "M12 8.2 C10.6 7.1 7.5 7.4 6.5 10.3 C5.6 13 6.8 16.6 8.4 18.7 C9.4 20 10.7 19.5 12 19 C13.3 19.5 14.6 20.2 15.7 18.8 C17.3 16.8 18.1 15.3 18.3 14.5 C16.3 13.6 15.9 10.7 17.8 9.3 C16.4 7.3 13.6 7 12 8.2", 1.05], ["s", "M12.1 7.8 C12 6.1 13.1 4.7 14.9 4.3", 1]]
  },
  google: {
    grid: 24,
    parts: [["s", "M20.3 8.6 C18.8 5.2 15.4 3.5 12 3.9 C7.6 4.4 4.2 8.2 4.3 12.6 C4.4 17.2 7.9 20.6 12 20.5 C16.3 20.4 19.8 17.4 20 12.4", 1.15], ["s", "M12.2 12.5 L20.1 12.4", 1.1]]
  }
} satisfies Record<string, ArtDef>;
type BrandMarkName = keyof typeof MARKS;
const BrandMark = defineUi<{
  name: BrandMarkName;
  size?: number;
  className?: string;
}>("BrandMark", ["name", "size", "class"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const size = computed(() => _props["size"] === undefined ? 16 : _props["size"]);
  const className = computed(() => _props["class"]);
  useEnsureInkDefs();
  const res = computed(() => memo(`auth-brand|${name.value}|${size.value}`, () => drawSkeleton(MARKS[name.value], size.value, name.value, {
    tone: "ui" as const,
    kind: "icon" as const,
    nib: 1.6
  })));
  return () => {
    return <svg data-ink="icon" aria-hidden="true" focusable="false" viewBox={`0 0 ${res.value.w} ${res.value.h}`} width={size.value} height={size.value} class={cn("pointer-events-none shrink-0 overflow-visible", className.value)} innerHTML={res.value.svg} />;
  };
});
export { BrandMark };
export type { BrandMarkName };
