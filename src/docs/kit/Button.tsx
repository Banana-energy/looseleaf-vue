// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button as LibButton } from "@/components/ui/button";
import { Link, type LinkProps } from "../core/router";
import { Glyph, type GlyphName } from "./glyphs";
type Variant = "default" | "primary" | "quiet";
type Size = "default" | "sm" | "lg";
const VARIANT = {
  default: "outline" as const,
  primary: "default" as const,
  quiet: "ghost" as const
} as const;
export interface ButtonProps extends UI.ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}
export const Button = defineUi<ButtonProps>("Button", ["variant", "size", "type"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const size = computed(() => _props["size"]);
  const type = computed(() => _props["type"] === undefined ? "button" as const : _props["type"]);
  const props = computed(() => omitProps(_props, ["variant", "size", "type"]));
  return () => {
    return <LibButton type={type.value} variant={VARIANT[variant.value]} size={size.value} {...domProps(props.value)}>{_slots.default?.()}</LibButton>;
  };
});
export interface IconButtonProps extends Omit<UI.ComponentProps<"button">, "children"> {
  label: string;
  glyph: GlyphName;
  size?: number;
  variant?: Variant;
  children?: UI.VueNode;
}
export const IconButton = defineUi<IconButtonProps>("IconButton", ["label", "glyph", "size", "variant", "type"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const glyph = computed(() => _props["glyph"]);
  const size = computed(() => _props["size"] === undefined ? 20 : _props["size"]);
  const variant = computed(() => _props["variant"] === undefined ? "quiet" as const : _props["variant"]);
  const type = computed(() => _props["type"] === undefined ? "button" as const : _props["type"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["label", "glyph", "size", "variant", "type", "children"]));
  return () => {
    return <LibButton type={type.value} variant={VARIANT[variant.value]} size={readSlot(_slots.default) ? "default" as const : "icon" as const} aria-label={label.value} {...domProps(props.value)}>
      <Glyph name={glyph.value} size={size.value} />
      {readSlot(_slots.default)}
    </LibButton>;
  };
});
export interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  size?: Size;
}
export const ButtonLink = defineUi<ButtonLinkProps>("ButtonLink", ["variant", "size"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const size = computed(() => _props["size"]);
  const props = computed(() => omitProps(_props, ["variant", "size"]));
  return () => {
    return <LibButton asChild variant={VARIANT[variant.value]} size={size.value}>
      <Link {...domProps(props.value)}>{_slots.default?.()}</Link>
    </LibButton>;
  };
});
