// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
export interface OverlayProps {
  open: boolean;
  onClose: () => void;
  label: string;
  initialFocus?: string;
  className?: string;
  children: UI.VueNode;
}
export const Overlay = defineUi<OverlayProps>("Overlay", ["open", "onClose", "label", "initialFocus", "class"], (_props, {
  slots: _slots
}) => {
  const open = computed(() => _props["open"]);
  const onClose = computed(() => _props["onClose"]);
  const label = computed(() => _props["label"]);
  const initialFocus = computed(() => _props["initialFocus"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const opener = shallowRef<Element | null | null>(null);
  return () => {
    return <Dialog open={open.value} onOpenChange={next => !next && onClose.value()}>
      <DialogContent showCloseButton={false} onOpenAutoFocus={event => {
        opener.value = document.activeElement;
        const first = initialFocus.value && event.target instanceof HTMLElement ? event.target.querySelector<HTMLElement>(initialFocus.value) : null;
        if (first) {
          event.preventDefault();
          first.focus();
        }
      }} onCloseAutoFocus={event => {
        event.preventDefault();
        const el = opener.value;
        opener.value = null;
        if (el instanceof HTMLElement && el !== document.body && el.isConnected) el.focus({
          preventScroll: true
        });
      }} class={cn("max-w-2xl", className.value)}>
        <DialogTitle class="sr-only">{label.value}</DialogTitle>
        <DialogDescription class="sr-only">{label.value}</DialogDescription>
        {readSlot(_slots.default)}
      </DialogContent>
    </Dialog>;
  };
});
export const Scrim = defineUi<{
  open: boolean;
  onClick: () => void;
}>("Scrim", ["open", "onClick"], (_props, {
  slots: _slots
}) => {
  const open = computed(() => _props["open"]);
  const onClick = computed(() => _props["onClick"]);
  return () => {
    if (!open.value) return null;
    return <div class="fixed inset-0 z-(--ll-z-drawer) [background:var(--ll-overlay-dim)]" onClick={onClick.value} aria-hidden="true" />;
  };
});
