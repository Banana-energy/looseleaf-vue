// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar";
type SearchFormProps = Omit<UI.ComponentProps<"form">, "children"> & {
  placeholder?: string;
  label?: string;
  variant?: "sidebar" | "bar";
};
export const SearchForm = defineUi<SearchFormProps>("SearchForm", ["placeholder", "label", "variant", "class", "onSubmit"], (_props, {
  slots: _slots
}) => {
  const placeholder = computed(() => _props["placeholder"] === undefined ? "Search the guide..." as const : _props["placeholder"]);
  const label = computed(() => _props["label"] === undefined ? "Search" as const : _props["label"]);
  const variant = computed(() => _props["variant"] === undefined ? "sidebar" as const : _props["variant"]);
  const className = computed(() => _props["class"]);
  const onSubmit = computed(() => _props["onSubmit"]);
  const props = computed(() => omitProps(_props, ["placeholder", "label", "variant", "class", "onSubmit"]));
  const id = useId();
  const box = renderValue(() => <>
      <Label for={id} class="sr-only">
        {label.value}
      </Label>
      <SidebarInput id={id} type="search" placeholder={placeholder.value} class={variant.value === "bar" ? "h-8 ps-7" as const : "ps-8" as const} />
      <Icon name="search" class="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 opacity-60 select-none" />
    </>);
  return () => {
    return <form role="search" class={className.value} onSubmit={(event: SubmitEvent) => {
      onSubmit.value?.(event);
      if (!onSubmit.value) event.preventDefault();
    }} {...domProps(props.value)}>
      {variant.value === "bar" ? <div class="relative">{box.value}</div> : <SidebarGroup class="py-0">
          <SidebarGroupContent class="relative">{box.value}</SidebarGroupContent>
        </SidebarGroup>}
    </form>;
  };
});
