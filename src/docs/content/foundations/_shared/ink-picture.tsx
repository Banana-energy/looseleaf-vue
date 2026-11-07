// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { inkViewBox } from "@/lib/ink/builder";
import { useEnsureInkDefs } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
export interface Drawn {
  svg: string;
  w: number;
  h: number;
  pad: number;
}
export interface InkPictureProps {
  drawn: Drawn;
  label?: string;
  className?: string;
}
export const InkPicture = defineUi<InkPictureProps>("InkPicture", ["drawn", "label", "class"], (_props, {
  slots: _slots
}) => {
  const drawn = computed(() => _props["drawn"]);
  const label = computed(() => _props["label"]);
  const className = computed(() => _props["class"]);
  useEnsureInkDefs();
  const width = computed(() => drawn.value.w + 2 * drawn.value.pad);
  const height = computed(() => drawn.value.h + 2 * drawn.value.pad);
  const viewBox = computed(() => inkViewBox(drawn.value));
  const cls = computed(() => cn("pointer-events-none block h-auto max-w-full overflow-visible", className.value));
  const html = computed(() => ({
    __html: drawn.value.svg
  }));
  return () => {
    if (label.value) return <svg data-ink="illustration" role="img" aria-label={label.value} focusable="false" viewBox={viewBox.value} width={width.value} height={height.value} class={cls.value} innerHTML={html.value.__html} />;
    return <svg data-ink="illustration" aria-hidden="true" focusable="false" viewBox={viewBox.value} width={width.value} height={height.value} class={cls.value} innerHTML={html.value.__html} />;
  };
});
