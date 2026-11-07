// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cx } from "@/docs/kit";
export const DataTable = defineUi<{
  label: string;
  minWidth?: string;
  className?: string;
  children: UI.VueNode;
}>("DataTable", ["label", "minWidth", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const minWidth = computed(() => _props["minWidth"] === undefined ? "36rem" as const : _props["minWidth"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <div role="region" aria-label={label.value} tabindex={0} class={cx("overflow-x-auto", className.value)}>
      <table class={cx("w-full border-collapse text-start text-[15px] leading-snug text-ink", "[&_th]:border-b-2 [&_th]:border-pencil-mark [&_th]:px-3 [&_th]:py-2 [&_th]:text-start [&_th]:font-script [&_th]:text-xl [&_th]:font-bold [&_th]:text-ink-you", "[&_td]:border-b [&_td]:border-pencil-mark/40 [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-top", "[&_tbody_th]:border-b [&_tbody_th]:border-pencil-mark/40 [&_tbody_th]:font-hand [&_tbody_th]:text-[15px] [&_tbody_th]:text-ink")} style={cssStyle({
        minWidth: minWidth.value
      })}>
        {readSlot(_slots.default)}
      </table>
    </div>;
  };
});
export const Specimen = defineUi<{
  caption: UI.VueNode;
  children: UI.VueNode;
  className?: string;
  onDesk?: boolean;
}>("Specimen", ["caption", "class", "onDesk"], (_props, {
  slots: _slots
}) => {
  const caption = computed(() => _props["caption"]);
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  const onDesk = computed(() => _props["onDesk"]);
  return () => {
    return <figure class={cx("m-0 flex min-w-0 flex-col items-center gap-2 text-ink", className.value)}>
      {readSlot(_slots.default)}
      <figcaption class={cx("text-center text-sm leading-tight", onDesk.value ? "text-ink-soft" as const : "text-pencil-text" as const)}>{caption.value}</figcaption>
    </figure>;
  };
});
export const CaveatCard = defineUi<{
  title: string;
  children: UI.VueNode;
  status: string;
  className?: string;
}>("CaveatCard", ["title", "status", "class"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const children = renderValue(() => readSlot(_slots.default));
  const status = computed(() => _props["status"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <li class={cx("flex min-w-0 flex-col gap-2 border-s-4 border-marker bg-slip px-4 py-3 text-ink shadow-hair", className.value)}>
      <h3 class="m-0 font-script text-2xl leading-tight">{title.value}</h3>
      <div class="flex flex-col gap-1.5 [&>p]:m-0">{readSlot(_slots.default)}</div>
      <p class="m-0 mt-auto font-type text-sm text-pencil-text">{status.value}</p>
    </li>;
  };
});
