// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
const ICON = {
  search: "search" as const,
  menu: "menu" as const,
  close: "x" as const,
  copy: "copy" as const,
  check: "check" as const,
  "chevron-down": "chevron-down" as const,
  "chevron-right": "chevron-right" as const,
  "arrow-left": "arrow-left" as const,
  "arrow-right": "arrow-right" as const,
  sliders: "sliders-horizontal" as const,
  hash: "link" as const,
  external: "external-link" as const,
  leaf: "pencil" as const
} as const;
export type GlyphName = keyof typeof ICON;
export interface GlyphProps extends Omit<UI.ComponentProps<typeof Icon>, "name"> {
  name: GlyphName;
}
export const Glyph = defineUi<GlyphProps>("Glyph", ["name", "size"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const size = computed(() => _props["size"] === undefined ? 20 : _props["size"]);
  const props = computed(() => omitProps(_props, ["name", "size"]));
  return () => {
    return <Icon name={ICON[name.value]} size={size.value} {...domProps(props.value)}>{_slots.default?.()}</Icon>;
  };
});
