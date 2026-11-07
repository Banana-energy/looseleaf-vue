// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export const BrandTile = defineUi<{
  icon: string;
  small?: boolean;
  className?: string;
}>("BrandTile", ["icon", "small", "class"], (_props, {
  slots: _slots
}) => {
  const icon = computed(() => _props["icon"]);
  const small = computed(() => _props["small"] === undefined ? false : _props["small"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <span data-slot="brand-tile" class={cn("grid shrink-0 place-items-center bg-marker/80 text-ink [border-radius:3px_8px_4px_9px/8px_3px_9px_4px]", small.value ? "size-5" as const : "size-8" as const, className.value)}>
      <Icon name={icon.value} size={small.value ? 12 : 16} />
    </span>;
  };
});
export const BrandText = defineUi<{
  title: string;
  subtitle?: string;
}>("BrandText", ["title", "subtitle"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const subtitle = computed(() => _props["subtitle"]);
  return () => {
    return <span class="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
      <span class="truncate font-bold">{title.value}</span>
      {" "}
      {subtitle.value ? <span class="truncate text-sm text-muted-foreground">{subtitle.value}</span> : null}
    </span>;
  };
});
export const SidebarBrand = defineUi<{
  title: string;
  subtitle?: string;
  icon: string;
  href?: string;
  className?: string;
}>("SidebarBrand", ["title", "subtitle", "icon", "href", "class"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const subtitle = computed(() => _props["subtitle"]);
  const icon = computed(() => _props["icon"]);
  const href = computed(() => _props["href"] === undefined ? "#home" as const : _props["href"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild class={className.value}>
          <a href={href.value}>
            <BrandTile icon={icon.value} />
            <BrandText title={title.value} subtitle={subtitle.value} />
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>;
  };
});
