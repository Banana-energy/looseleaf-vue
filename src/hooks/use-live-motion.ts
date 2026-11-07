// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef } from "vue";
import { useInkContext } from "@/lib/ink/vue";
export function motionIsOff(el?: Element | null, providerReduced = false): boolean {
  if (providerReduced) return true;
  if (typeof window === "undefined") return false;
  const node = el ?? document.documentElement;
  if (node.closest?.('[data-motion="reduced"]')) return true;
  if (window.getComputedStyle(node).getPropertyValue("--ll-motion").trim() === "0") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
export function useReducedMotion(_source0?: MaybeRefOrGetter<UI.RefObject<Element | null>>): ComputedRef<boolean> {
  const ref = computed(() => toValue(_source0));
  const _nestedHook0 = useInkContext();
  const provider = computed(() => _nestedHook0.value.motion === "reduced");
  const off = shallowRef(initialState(false));
  const setOff = stateSetter(off);
  watchDependencies(() => {
    const check = () => setOff(motionIsOff(ref.value?.value, provider.value));
    check();
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    mq?.addEventListener?.("change", check);
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"]
    });
    return () => {
      mq?.removeEventListener?.("change", check);
      mo.disconnect();
    };
  }, () => [ref.value, provider.value], true);
  return computed(() => {
    return off.value;
  });
}
