// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef } from "vue";
import type { ExampleEntry, Loader } from "../core/catalog";
import type { ExampleModule } from "../types";
export type Loaded<T> = {
  status: "loading";
} | {
  status: "ready";
  value: T;
} | {
  status: "error";
  error: Error;
};
const toError = (e: unknown) => e instanceof Error ? e : new Error(String(e));
const results = new WeakMap<object, Loaded<unknown>>();
const pending = new WeakMap<object, Promise<void>>();
function peek<T>(loader: Loader<T>): Loaded<T> {
  return results.get(loader) as Loaded<T> | undefined ?? {
    status: "loading" as const
  };
}
function start<T>(loader: Loader<T>): Promise<void> {
  let promise = pending.get(loader);
  if (!promise) {
    promise = loader().then(raw => {
      results.set(loader, {
        status: "ready" as const,
        value: raw
      });
    }, (error: unknown) => {
      results.set(loader, {
        status: "error" as const,
        error: toError(error)
      });
    });
    pending.set(loader, promise);
  }
  return promise;
}
export function useLoaded<T>(_source0: MaybeRefOrGetter<Loader<T> | null>): ComputedRef<Loaded<T>> {
  const loader = computed(() => {
    void _state1.value;
    return toValue(_source0);
  });
  const _state1 = shallowRef(initialState(0));
  const force = stateSetter(_state1);
  const current = computed(() => {
    void _state1.value;
    return loader.value ? peek(loader.value) : {
      status: "loading" as const
    } as Loaded<T>;
  });
  watchDependencies(() => {
    if (!loader.value || peek(loader.value).status !== "loading") return;
    let alive = true;
    start(loader.value).then(() => alive && force(n => n + 1));
    return () => {
      alive = false;
    };
  }, () => [loader.value], false);
  return computed(() => {
    void _state1.value;
    return current.value;
  });
}
function assertExample(raw: unknown, path: string): ExampleModule {
  const mod = raw as Partial<ExampleModule> | undefined;
  const component = mod?.default as unknown;
  if (!component || typeof component !== "function" && typeof component !== "object") {
    console.error(`${path} has no default export. An example file must \`export default function Example() {…}\`.`);
  }
  return {
    default: mod!.default!,
    meta: mod!.meta ?? {
      title: "" as const
    }
  };
}
const validated = new WeakMap<object, Loader<ExampleModule>>();
export function exampleLoader(entry: ExampleEntry): Loader<ExampleModule> {
  let wrapped = validated.get(entry.load);
  if (!wrapped) {
    const inner = entry.load;
    wrapped = () => inner().then(raw => assertExample(raw, entry.path));
    validated.set(entry.load, wrapped);
  }
  return wrapped;
}
export function useExample(_source0: MaybeRefOrGetter<ExampleEntry>): ComputedRef<Loaded<ExampleModule>> {
  const entry = computed(() => toValue(_source0));
  const _nestedHook0 = useLoaded(() => exampleLoader(entry.value));
  return computed(() => {
    return _nestedHook0.value;
  });
}
