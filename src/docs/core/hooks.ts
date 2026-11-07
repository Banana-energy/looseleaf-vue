// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
export function useMediaQuery(_source0: MaybeRefOrGetter<string>, _source1: MaybeRefOrGetter<boolean | undefined> = false): ComputedRef<boolean> {
  const query = computed(() => toValue(_source0));
  const fallback = computed(() => toValue(_source1) === undefined ? false : toValue(_source1));
  const subscribe = (onChange: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mql = window.matchMedia(query.value);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  };
  const get = computed(() => () => typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query.value).matches : fallback.value);
  const _nestedHook0 = useExternalStore(subscribe, get.value);
  return computed(() => {
    return _nestedHook0.value;
  });
}
export function useIdle(): ComputedRef<boolean> {
  const idle = shallowRef(initialState(false));
  const setIdle = stateSetter(idle);
  watchDependencies(() => {
    const ric = (window as Window & {
      requestIdleCallback?: (cb: () => void, options?: {
        timeout: number;
      }) => number;
    }).requestIdleCallback;
    const cancel = (window as Window & {
      cancelIdleCallback?: (id: number) => void;
    }).cancelIdleCallback;
    if (ric) {
      const id = ric.call(window, () => setIdle(true), {
        timeout: 2000
      });
      return () => cancel?.call(window, id);
    }
    const timer = setTimeout(() => setIdle(true), 250);
    return () => clearTimeout(timer);
  }, () => [], false);
  return computed(() => {
    return idle.value;
  });
}
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),summary';
export function focusableWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true" && !el.closest("[hidden],[inert]"));
}
export function useFocusTrap(_source0: MaybeRefOrGetter<UI.RefObject<HTMLElement | null>>, _source1: MaybeRefOrGetter<boolean>, _source2: MaybeRefOrGetter<{
  onEscape?: () => void;
  initialFocus?: string;
}> = {}) {
  const ref = computed(() => toValue(_source0));
  const active = computed(() => toValue(_source1));
  const options = computed(() => toValue(_source2) === undefined ? {} : toValue(_source2));
  const onEscape = shallowRef(options.value.onEscape);
  watchDependencies(() => {
    onEscape.value = options.value.onEscape;
  }, undefined, false);
  const initialFocus = computed(() => options.value.initialFocus);
  watchDependencies(() => {
    if (!active.value) return;
    const root = ref.value.value;
    if (!root) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const target = (initialFocus.value ? root.querySelector<HTMLElement>(initialFocus.value) : null) ?? focusableWithin(root)[0] ?? root;
    target.focus({
      preventScroll: true
    });
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onEscape.value?.();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusableWithin(root);
      if (items.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !root.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !root.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKeydown);
    return () => {
      root.removeEventListener("keydown", onKeydown);
      if (previous && document.contains(previous)) previous.focus({
        preventScroll: true
      });
    };
  }, () => [ref.value, active.value, initialFocus.value], false);
  return computed(() => {});
}
export function useScrollLock(_source0: MaybeRefOrGetter<boolean>) {
  const active = computed(() => toValue(_source0));
  watchDependencies(() => {
    if (!active.value) return;
    const root = document.documentElement;
    root.setAttribute("data-scroll-locked", "");
    return () => root.removeAttribute("data-scroll-locked");
  }, () => [active.value], false);
  return computed(() => {});
}
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}
export function useCopy(_source0: MaybeRefOrGetter<number | undefined> = 1600) {
  const ms = computed(() => toValue(_source0) === undefined ? 1600 : toValue(_source0));
  const copied = shallowRef(initialState(false));
  const setCopied = stateSetter(copied);
  const timer = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  watchDependencies(() => () => clearTimeout(timer.value), () => [], false);
  const copy = async (text: string) => {
    const ok = await copyText(text);
    if (!ok) return false;
    setCopied(true);
    clearTimeout(timer.value);
    timer.value = setTimeout(() => setCopied(false), ms.value);
    return true;
  };
  return computed(() => {
    return {
      copied: copied.value,
      copy
    };
  });
}
