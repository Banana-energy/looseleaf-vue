// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { pageActions } from "@/blocks/sidebar-shared/sidebar-data";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
export const NavActions = defineUi<{
  defaultOpen?: boolean;
}>("NavActions", ["defaultOpen"], (_props, {
  slots: _slots
}) => {
  const defaultOpen = computed(() => _props["defaultOpen"] === undefined ? false : _props["defaultOpen"]);
  const starred = shallowRef(initialState(false));
  const setStarred = stateSetter(starred);
  const open = shallowRef(initialState(defaultOpen.value));
  const setOpen = stateSetter(open);
  return () => {
    return <div class="flex items-center gap-2 text-sm">
      <div class="hidden font-hand text-muted-foreground md:inline-block">Edited just now</div>
      <Button variant="ghost" size="icon-sm" aria-pressed={starred.value} aria-label={starred.value ? "Remove from favorites" as const : "Add to favorites" as const} onClick={() => setStarred(value => !value)}>
        <Icon name="star" tone={starred.value ? "doodle" as const : "ui" as const} />
      </Button>
      <Popover open={open.value} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More actions" class="data-[state=open]:ll-swipe">
            <Icon name="ellipsis" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-56 p-0" align="end" tilt={false} aria-label="Page actions">
          {pageActions.map((group, index) => <SidebarGroup key={index} class="border-b border-sidebar-border last:border-none">
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.map(item => <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton onClick={() => setOpen(false)}>
                        <Icon name={item.icon} />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>)}
        </PopoverContent>
      </Popover>
    </div>;
  };
});
