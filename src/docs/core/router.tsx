// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { hrefFor, matchRoute, parseHash, type Route } from "./router-core";
export interface LocationState {
  path: string;
  anchor: string;
  search: string;
  route: Route;
}
function readLocation(hash: string, prev?: LocationState): LocationState {
  const parsed = parseHash(hash);
  const path = parsed.anchorOnly ? prev?.path ?? "/" : parsed.path;
  const search = parsed.anchorOnly ? prev?.search ?? "" : parsed.search;
  return {
    path,
    anchor: parsed.anchor,
    search,
    route: matchRoute(path)
  };
}
export interface HashStore {
  getState(): LocationState;
  subscribe(listener: () => void): () => void;
}
export function createHashStore(win: Pick<Window, "location" | "addEventListener" | "removeEventListener"> = window): HashStore {
  let state = readLocation(win.location.hash);
  const listeners = new Set<() => void>();
  const refresh = () => {
    const next = readLocation(win.location.hash, state);
    if (next.path === state.path && next.anchor === state.anchor && next.search === state.search) return;
    state = next;
    listeners.forEach(l => l());
  };
  return {
    getState: () => state,
    subscribe(listener) {
      if (listeners.size === 0) win.addEventListener("hashchange", refresh);
      listeners.add(listener);
      refresh();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) win.removeEventListener("hashchange", refresh);
      };
    }
  };
}
const HOME: LocationState = {
  path: "/" as const,
  anchor: "" as const,
  search: "" as const,
  route: {
    name: "home" as const
  }
};
const LocationContext = createContext<LocationState>(HOME);
export const RouterProvider = defineUi<{
  children: UI.VueNode;
}>("RouterProvider", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const store = shallowRef(initialState(() => createHashStore()));
  const location = useExternalStore(store.value.subscribe, store.value.getState);
  return () => {
    return <LocationContext.Provider value={location.value}>{readSlot(_slots.default)}</LocationContext.Provider>;
  };
});
export function useLocation(): ComputedRef<LocationState> {
  const _nestedHook0 = useContext(LocationContext);
  return computed(() => {
    return _nestedHook0.value;
  });
}
export function useRoute(): ComputedRef<Route> {
  const _nestedHook0 = useLocation();
  return computed(() => {
    return _nestedHook0.value.route;
  });
}
export function navigate(to: string, options: {
  replace?: boolean;
} = {}) {
  const href = hrefFor(to);
  if (options.replace) window.location.replace(href);else window.location.hash = href.slice(1);
}
export type LinkProps = Omit<UI.ComponentProps<"a">, "href"> & {
  to: string;
};
export const Link = defineUi<LinkProps>("Link", ["to"], (_props, {
  slots: _slots
}) => {
  const to = computed(() => _props["to"]);
  const props = computed(() => omitProps(_props, ["to"]));
  return () => {
    return <a href={hrefFor(to.value)} {...domProps(props.value)}>{_slots.default?.()}</a>;
  };
});
export function useAnchorHref(_source0: MaybeRefOrGetter<string>): ComputedRef<string> {
  const anchor = computed(() => toValue(_source0));
  const _hook1 = useLocation();
  const path = computed(() => _hook1.value.path);
  return computed(() => {
    return hrefFor(`${path.value}#${anchor.value}`);
  });
}
export function scrollToAnchor(id: string, timeoutMs = 2500): () => void {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const started = Date.now();
  const attempt = () => {
    if (cancelled) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        block: "start" as const
      });
      if (el.hasAttribute("tabindex")) el.focus({
        preventScroll: true
      });
      return;
    }
    if (Date.now() - started < timeoutMs) timer = setTimeout(attempt, 60);
  };
  attempt();
  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}
function useTraversal() {
  const traversing = shallowRef(false);
  watchDependencies(() => {
    const nav = (window as unknown as {
      navigation?: EventTarget;
    }).navigation;
    if (!nav?.addEventListener) return;
    const onNavigate = (event: Event) => {
      traversing.value = (event as Event & {
        navigationType?: string;
      }).navigationType === "traverse";
    };
    nav.addEventListener("navigate", onNavigate);
    return () => nav.removeEventListener("navigate", onNavigate);
  }, () => [], false);
  return computed(() => {
    return traversing;
  });
}
export function useRouteEffects(_source0: MaybeRefOrGetter<LocationState>) {
  const location = computed(() => toValue(_source0));
  const previousPath = shallowRef<string | null | null>(null);
  const traversing = useTraversal();
  const path = computed(() => location.value.path);
  const anchor = computed(() => location.value.anchor);
  watchDependencies(() => {
    const first = previousPath.value === null;
    const pathChanged = previousPath.value !== path.value;
    previousPath.value = path.value;
    if (anchor.value) return scrollToAnchor(anchor.value);
    if (first || !pathChanged) return;
    if (!traversing.value.value) {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant" as const
        });
      } catch {}
    }
    const heading = document.querySelector<HTMLElement>("#main h1");
    heading?.focus({
      preventScroll: true
    });
  }, () => [path.value, anchor.value, traversing.value], false);
  return computed(() => {});
}
