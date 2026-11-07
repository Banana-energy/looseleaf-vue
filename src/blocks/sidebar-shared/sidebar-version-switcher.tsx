// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { BrandTile, BrandText } from "@/blocks/sidebar-shared/sidebar-brand";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
export const VersionSwitcher = defineUi<{
  versions: string[];
  defaultVersion: string;
  title?: string;
  icon?: string;
}>("VersionSwitcher", ["versions", "defaultVersion", "title", "icon"], (_props, {
  slots: _slots
}) => {
  const versions = computed(() => _props["versions"]);
  const defaultVersion = computed(() => _props["defaultVersion"]);
  const title = computed(() => _props["title"] === undefined ? "Field guide" as const : _props["title"]);
  const icon = computed(() => _props["icon"] === undefined ? "book-open" as const : _props["icon"]);
  const selected = shallowRef(initialState(defaultVersion.value));
  const setSelected = stateSetter(selected);
  return () => {
    return <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" class="data-[state=open]:ll-swipe">
              <BrandTile icon={icon.value} />
              <BrandText title={title.value} subtitle={`v${selected.value}`} />
              <Icon name="chevrons-up-down" class="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-(--reka-dropdown-menu-trigger-width)" align="start">
            <DropdownMenuLabel>Editions</DropdownMenuLabel>
            {versions.value.map(version => <DropdownMenuItem key={version} onSelect={() => setSelected(version)}>
                v{version}
                {version === selected.value ? <Icon name="check" class="ms-auto" label="Current edition" /> : null}
              </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>;
  };
});
