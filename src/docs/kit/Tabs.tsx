// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Tabs as TabsRoot, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
export interface TabItem {
  id: string;
  label: UI.VueNode;
  ariaLabel?: string;
  content: UI.VueNode | (() => UI.VueNode);
}
export interface TabsProps {
  label: string;
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  variant?: "underline" | "pill";
  mount?: "lazy" | "always";
  className?: string;
}
export const Tabs = defineUi<TabsProps>("Tabs", ["label", "items", "value", "defaultValue", "onValueChange", "variant", "mount", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const items = computed(() => _props["items"]);
  const value = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const variant = computed(() => _props["variant"] === undefined ? "underline" as const : _props["variant"]);
  const mount = computed(() => _props["mount"] === undefined ? "lazy" as const : _props["mount"]);
  const className = computed(() => _props["class"]);
  const inner = shallowRef(initialState(defaultValue.value ?? items.value[0]?.id ?? ""));
  const setInner = stateSetter(inner);
  const wanted = computed(() => value.value ?? inner.value);
  const active = computed(() => items.value.some(item => item.id === wanted.value) ? wanted.value : items.value[0]?.id ?? "");
  const visited = shallowRef<ReadonlySet<string>>(initialState(() => new Set([active.value])));
  const setVisited = stateSetter(visited);
  const select = computed(() => (id: string) => {
    if (value.value === undefined) setInner(id);
    onValueChange.value?.(id);
  });
  return () => {
    if (!visited.value.has(active.value)) setVisited(new Set(visited.value).add(active.value));
    return <TabsRoot value={active.value} onValueChange={select.value} class={cn("min-w-0", className.value)}>
      <TabsList aria-label={label.value} variant={variant.value === "pill" ? "default" as const : "line" as const} class="max-w-full flex-wrap justify-start gap-y-2 aria-[orientation=horizontal]:h-auto">
        {items.value.map(item => <TabsTrigger key={item.id} value={item.id} aria-label={item.ariaLabel} class="h-auto min-h-9 max-w-full flex-none whitespace-normal wrap-anywhere">
            {item.label}
          </TabsTrigger>)}
      </TabsList>
      {items.value.map(item => {
        const selected = item.id === active.value;
        const mounted = selected || mount.value === "always" || visited.value.has(item.id);
        return <TabsContent key={item.id} value={item.id} forceMount class="min-w-0 data-[state=inactive]:hidden">
            <div hidden={!selected} class="min-w-0">
              {mounted ? typeof item.content === "function" ? item.content() : item.content : null}
            </div>
          </TabsContent>;
      })}
    </TabsRoot>;
  };
});
