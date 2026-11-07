// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef } from "vue";
export function useFormReset(_source0: MaybeRefOrGetter<() => Element | null | undefined>, _source1: MaybeRefOrGetter<() => void>): ComputedRef<void> {
  const getElement = computed(() => toValue(_source0));
  const onReset = computed(() => toValue(_source1));
  const latest = shallowRef({
    getElement: getElement.value,
    onReset: onReset.value
  });
  watchDependencies(() => {
    const onEvent = (event: Event) => {
      const el = latest.value.getElement();
      const form = event.target;
      if (!el || !(form instanceof HTMLFormElement)) return;
      if (form === (el as Element & {
        form?: HTMLFormElement | null;
      }).form || form.contains(el)) latest.value.onReset();
    };
    document.addEventListener("reset", onEvent);
    return () => document.removeEventListener("reset", onEvent);
  }, () => [], false);
  return computed(() => {
    latest.value = {
      getElement: getElement.value,
      onReset: onReset.value
    };
  });
}
