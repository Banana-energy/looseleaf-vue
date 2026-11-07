// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Stamp } from "@/components/ui/stamp";
import { Sticker } from "@/components/ui/sticker";
export type DecoItem = {
  kind: "sticker";
  name: string;
  size: number;
  rotate: number;
  className: string;
  seed?: string;
} | {
  kind: "stamp";
  name: string;
  className: string;
  rotate?: number;
  text?: string;
  sub?: string;
  size?: number;
  shape?: "rect" | "round" | "burst" | "void";
  ink?: "red" | "ink-you" | "green" | "ink";
  w?: number;
  h?: number;
};
const Deco = defineUi<{
  items: readonly DecoItem[];
}>("Deco", ["items"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  return () => {
    return <>
      {items.value.map(item => item.kind === "sticker" ? <Sticker key={`${item.name}|${item.className}`} name={item.name} size={item.size} rotate={item.rotate} seed={item.seed ?? item.name} class={`absolute z-(--ll-z-prop) ${item.className}`} /> : <Stamp key={`${item.name}|${item.className}`} name={item.name} text={item.text} sub={item.sub} size={item.size} shape={item.shape} ink={item.ink} w={item.w} h={item.h} tilt={item.rotate} aria-hidden="true" class={`absolute z-(--ll-z-prop) ${item.className}`} />)}
    </>;
  };
});
export default Deco;
