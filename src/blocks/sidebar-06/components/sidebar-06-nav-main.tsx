// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { NavSection } from "@/blocks/sidebar-shared/sidebar-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
export const NavMain = defineUi<{
  items: NavSection[];
}>("NavMain", ["items"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  const _hook1 = useSidebar();
  const isMobile = computed(() => _hook1.value.isMobile);
  return () => {
    return <SidebarGroup>
      <SidebarMenu>
        {items.value.map(section => {
          const holdsCurrent = section.items.some(item => item.isActive);
          return <SidebarMenuItem key={section.title}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton isActive={holdsCurrent} aria-current={holdsCurrent ? "true" as const : undefined} class="data-[state=open]:ll-swipe">
                    {section.title}
                    <Icon name="ellipsis" class="ms-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                {section.items.length ? <DropdownMenuContent side={isMobile.value ? "bottom" as const : "right" as const} align={isMobile.value ? "end" as const : "start" as const} class="min-w-56">
                    {section.items.map(item => <DropdownMenuItem asChild key={item.title}>
                        <a href={item.url} aria-current={item.isActive ? "page" as const : undefined} class={item.isActive ? "font-bold" as const : undefined}>
                          {item.title}
                          {item.isActive ? <Icon name="check" class="ms-auto" /> : null}
                        </a>
                      </DropdownMenuItem>)}
                  </DropdownMenuContent> : null}
              </DropdownMenu>
            </SidebarMenuItem>;
        })}
      </SidebarMenu>
    </SidebarGroup>;
  };
});
