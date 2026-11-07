// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cx } from "./cx";
import type { EmptyStateProps } from "./Misc";
const EmptyBody = defineUi<EmptyStateProps>("EmptyBody", ["title", "class"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  return () => {
    return <Empty class={cx("dk-empty border", className.value)}>
      <EmptyHeader>
        <EmptyMedia pose="think" size={88} />
        <EmptyTitle class="dk-empty-title">{title.value}</EmptyTitle>
        {readSlot(_slots.default) ? <EmptyDescription class="dk-empty-body">{readSlot(_slots.default)}</EmptyDescription> : null}
      </EmptyHeader>
    </Empty>;
  };
});
export default EmptyBody;
