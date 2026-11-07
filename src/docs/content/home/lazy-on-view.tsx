// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { cn } from "@/lib/utils";
export const Slip = defineUi<{
  height: number;
  label?: string;
  className?: string;
}>("Slip", ["height", "label", "class"], (_props, {
  slots: _slots
}) => {
  const height = computed(() => _props["height"]);
  const label = computed(() => _props["label"] === undefined ? "sharpening a pencil..." as const : _props["label"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <div aria-hidden="true" data-slot="home-slip" class={cn("grid place-items-center border-2 border-dashed border-ink/25 bg-paper/35 px-4 text-center font-script text-2xl text-ink-muted", className.value)} style={cssStyle({
      minHeight: `${height.value}rem`
    })}>
      {label.value}
    </div>;
  };
});
export interface LazyOnViewProps {
  children: UI.VueNode;
  height: number;
  order?: number;
  delay?: number;
  label?: string;
  className?: string;
  slip?: boolean;
  eager?: boolean;
}
const BASE_DELAY = 1400;
const STEP = 260;
const MAX_DELAY = 5200;
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, options?: {
    timeout: number;
  }) => number;
  cancelIdleCallback?: (id: number) => void;
};
export const LazyOnView = defineUi<LazyOnViewProps>("LazyOnView", ["height", "order", "delay", "label", "class", "slip", "eager"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const height = computed(() => _props["height"]);
  const order = computed(() => _props["order"] === undefined ? 0 : _props["order"]);
  const delay = computed(() => _props["delay"]);
  const label = computed(() => _props["label"]);
  const className = computed(() => _props["class"]);
  const slip = computed(() => _props["slip"] === undefined ? true : _props["slip"]);
  const eager = computed(() => _props["eager"] === undefined ? false : _props["eager"]);
  const ref = shallowRef<HTMLDivElement | null>(null);
  const on = shallowRef(initialState(eager.value));
  const setOn = stateSetter(on);
  watchDependencies(() => {
    if (on.value) return;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setOn(true);
    };
    const el = ref.value;
    let io: IntersectionObserver | undefined;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) go();
      }, {
        rootMargin: "400px 0px" as const
      });
      io.observe(el);
    }
    const win = window as IdleWindow;
    let idle: number | undefined;
    const timer = setTimeout(() => {
      if (win.requestIdleCallback) idle = win.requestIdleCallback(go, {
        timeout: 1500
      });else go();
    }, delay.value ?? Math.min(MAX_DELAY, BASE_DELAY + order.value * STEP));
    return () => {
      done = true;
      io?.disconnect();
      clearTimeout(timer);
      if (idle !== undefined) win.cancelIdleCallback?.(idle);
    };
  }, () => [on.value, order.value, delay.value], false);
  const holder = renderValue(() => slip.value ? <Slip height={height.value} label={label.value} /> : null);
  return () => {
    return <div ref={ref} data-slot="lazy-on-view" data-ready={on.value || undefined} class={className.value}>
      {on.value ? <Suspense fallback={holder.value}>{readSlot(_slots.default)}</Suspense> : holder.value}
    </div>;
  };
});
