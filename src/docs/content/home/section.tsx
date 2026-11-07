// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
export const DeskSection = defineUi<{
  id: string;
  title: UI.VueNode;
  lede?: UI.VueNode;
  className?: string;
  children?: UI.VueNode;
}>("DeskSection", ["id", "title", "lede", "class"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const title = computed(() => _props["title"]);
  const lede = computed(() => _props["lede"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <section aria-labelledby={id.value} class={cn("mt-24", className.value)}>
      <h2 id={id.value} class="font-script text-5xl leading-[1.02] font-bold text-balance text-ink @xl:text-6xl">
        {title.value}
      </h2>
      {lede.value ? <p class="mt-3 max-w-2xl text-lg text-ink-soft">{lede.value}</p> : null}
      <div class="mt-10">{readSlot(_slots.default)}</div>
    </section>;
  };
});
