// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef } from "vue";
export function useNearViewport<T extends Element>(_source0: MaybeRefOrGetter<string | undefined> = "600px 0px", _source1: MaybeRefOrGetter<boolean | undefined> = false): ComputedRef<[ref: (el: T | null) => void, seen: boolean]> {
  const rootMargin = computed(() => toValue(_source0) === undefined ? "600px 0px" as const : toValue(_source0));
  const eager = computed(() => toValue(_source1) === undefined ? false : toValue(_source1));
  const seen = shallowRef(initialState(eager.value));
  const setSeen = stateSetter(seen);
  const el = shallowRef<T | null>(initialState(null));
  const setEl = stateSetter(el);
  watchDependencies(() => {
    if (seen.value || !el.value) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, {
      rootMargin: rootMargin.value
    });
    io.observe(el.value);
    return () => io.disconnect();
  }, () => [el.value, seen.value, rootMargin.value], false);
  return computed(() => {
    return [setEl, seen.value];
  });
}
export interface LazyMountProps {
  children: UI.VueNode;
  minHeight?: number;
  eager?: boolean;
  rootMargin?: string;
  className?: string;
}
export const LazyMount = defineUi<LazyMountProps>("LazyMount", ["minHeight", "eager", "rootMargin", "class"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const minHeight = computed(() => _props["minHeight"] === undefined ? 0 : _props["minHeight"]);
  const eager = computed(() => _props["eager"] === undefined ? false : _props["eager"]);
  const rootMargin = computed(() => _props["rootMargin"]);
  const className = computed(() => _props["class"]);
  const _hook5 = useNearViewport<HTMLDivElement>(() => rootMargin.value, () => eager.value);
  const ref = computed(() => _hook5.value[0]);
  const seen = computed(() => _hook5.value[1]);
  return () => {
    return <div ref={ref.value} class={className.value} data-lazy={seen.value ? "drawn" as const : "waiting" as const} style={cssStyle(seen.value ? undefined : {
      minHeight: minHeight.value
    })}>
      {seen.value ? readSlot(_slots.default) : null}
    </div>;
  };
});
export function useColumns(_source0: MaybeRefOrGetter<number>, _source1: MaybeRefOrGetter<number>, _source2: MaybeRefOrGetter<number | undefined> = 6): ComputedRef<[ref: (el: HTMLElement | null) => void, columns: number]> {
  const minTile = computed(() => toValue(_source0));
  const gap = computed(() => toValue(_source1));
  const fallback = computed(() => toValue(_source2) === undefined ? 6 : toValue(_source2));
  const columns = shallowRef(initialState(fallback.value));
  const setColumns = stateSetter(columns);
  const el = shallowRef<HTMLElement | null>(initialState(null));
  const setEl = stateSetter(el);
  const latest = shallowRef({
    minTile: minTile.value,
    gap: gap.value
  });
  watchDependencies(() => {
    latest.value = {
      minTile: minTile.value,
      gap: gap.value
    };
  }, undefined, false);
  watchDependencies(() => {
    if (!el.value || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const width = el.value.clientWidth;
      if (!width) return;
      const {
        minTile: m,
        gap: g
      } = latest.value;
      setColumns(Math.max(1, Math.floor((width + g) / (m + g))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.value);
    return () => ro.disconnect();
  }, () => [el.value, minTile.value, gap.value], false);
  return computed(() => {
    return [setEl, columns.value];
  });
}
