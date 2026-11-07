// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { fileChanges, fileTree, type FileNode } from "@/blocks/sidebar-shared/sidebar-data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarRail } from "@/components/ui/sidebar";
const OPEN_BY_DEFAULT = new Set(["components", "components/ui"]);
const STATE_NAMES: Record<string, string> = {
  M: "modified" as const,
  U: "untracked" as const
};
function fileIcon(name: string) {
  if (/\.(tsx?|jsx?|json)$/.test(name) || name.startsWith(".")) return "file-code";
  if (/\.(md|txt)$/.test(name)) return "file-text";
  return "file";
}
const Tree = defineUi<{
  node: FileNode;
  parent: string;
  active: string;
  onPick: (path: string) => void;
}>("Tree", ["node", "parent", "active", "onPick"], (_props, {
  slots: _slots
}) => {
  const node = computed(() => _props["node"]);
  const parent = computed(() => _props["parent"]);
  const active = computed(() => _props["active"]);
  const onPick = computed(() => _props["onPick"]);
  const path = computed(() => parent.value ? `${parent.value}/${node.value.name}` : node.value.name);
  return () => {
    if (!node.value.children) {
      return <SidebarMenuItem>
        <SidebarMenuButton isActive={active.value === path.value} aria-current={active.value === path.value ? "true" as const : undefined} onClick={() => onPick.value(path.value)}>
          <Icon name={fileIcon(node.value.name)} />
          <span class="truncate">{node.value.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>;
    }
    return <Collapsible asChild defaultOpen={OPEN_BY_DEFAULT.has(path.value)}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <Icon name="chevron-right" class="transition-transform group-data-[state=open]/collapsible-trigger:rotate-90 rtl:group-data-[state=open]/collapsible-trigger:-rotate-90" />
            <Icon name="folder" class="group-data-[state=open]/collapsible-trigger:hidden" />
            <Icon name="folder-open" class="group-data-[state=closed]/collapsible-trigger:hidden" />
            <span class="truncate">{node.value.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {node.value.children.map(child => <Tree key={child.name} node={child} parent={path.value} active={active.value} onPick={onPick.value} />)}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>;
  };
});
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar> & {
  active: string;
  onPick: (path: string) => void;
}>("AppSidebar", ["active", "onPick"], (_props, {
  slots: _slots
}) => {
  const active = computed(() => _props["active"]);
  const onPick = computed(() => _props["onPick"]);
  const props = computed(() => omitProps(_props, ["active", "onPick"]));
  return () => {
    return <Sidebar role="navigation" aria-label="Files" {...domProps(props.value)}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Changes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fileChanges.map(change => <SidebarMenuItem key={change.file}>
                  <SidebarMenuButton isActive={active.value === change.file} aria-current={active.value === change.file ? "true" as const : undefined} class="group-has-data-[sidebar=menu-badge]/menu-item:pe-8" onClick={() => onPick.value(change.file)}>
                    <Icon name={fileIcon(change.file)} />
                    <span class="truncate">{change.file}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>
                    <span aria-hidden="true">{change.state}</span>
                    <span class="sr-only">{STATE_NAMES[change.state] ?? change.state}</span>
                  </SidebarMenuBadge>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fileTree.map(node => <Tree key={node.name} node={node} parent="" active={active.value} onPick={onPick.value} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>;
  };
});
