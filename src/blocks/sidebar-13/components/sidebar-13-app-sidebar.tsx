// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { SidebarBrand } from "@/blocks/sidebar-shared/sidebar-brand";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
const LINKS = [{
  title: "Notes" as const,
  icon: "file-text" as const,
  isActive: true
}, {
  title: "Calendar" as const,
  icon: "calendar" as const
}, {
  title: "Inbox" as const,
  icon: "inbox" as const
}];
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar> & {
  onOpenSettings: (opener: HTMLElement) => void;
}>("AppSidebar", ["onOpenSettings"], (_props, {
  slots: _slots
}) => {
  const onOpenSettings = computed(() => _props["onOpenSettings"]);
  const props = computed(() => omitProps(_props, ["onOpenSettings"]));
  return () => {
    return <Sidebar role="navigation" aria-label="Main" {...domProps(props.value)}>
      <SidebarHeader>
        <SidebarBrand title="Looseleaf Studio" subtitle="Notebook" icon="book-open" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {LINKS.map(item => <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <a href={`#${item.title.toLowerCase()}`}>
                    <Icon name={item.icon} />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={event => onOpenSettings.value(event.currentTarget)} aria-haspopup="dialog">
                <Icon name="settings" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>;
  };
});
