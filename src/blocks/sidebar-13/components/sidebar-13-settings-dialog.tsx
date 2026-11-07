// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { settingsSections } from "@/blocks/sidebar-shared/sidebar-data";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
const initial = () => Object.fromEntries(settingsSections.flatMap(section => section.toggles.map(toggle => [toggle.id, toggle.on])));
export const SettingsDialog = defineUi<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCloseAutoFocus?: UI.ComponentProps<typeof DialogContent>["onCloseAutoFocus"];
  defaultSection?: string;
}>("SettingsDialog", ["open", "onOpenChange", "onCloseAutoFocus", "defaultSection"], (_props, {
  slots: _slots
}) => {
  const open = computed(() => _props["open"]);
  const onOpenChange = computed(() => _props["onOpenChange"]);
  const onCloseAutoFocus = computed(() => _props["onCloseAutoFocus"]);
  const defaultSection = computed(() => _props["defaultSection"] === undefined ? "Messages & media" as const : _props["defaultSection"]);
  const section = shallowRef(initialState(defaultSection.value));
  const setSection = stateSetter(section);
  const values = shallowRef<Record<string, boolean>>(initialState(initial));
  const setValues = stateSetter(values);
  const current = computed(() => settingsSections.find(s => s.name === section.value) ?? settingsSections[0]!);
  const selectId = useId();
  return () => {
    return <Dialog open={open.value} onOpenChange={onOpenChange.value}>
      <DialogContent tilt={false} onCloseAutoFocus={onCloseAutoFocus.value} class="max-w-none gap-0 p-0 compact:p-0 calm:p-0 md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle class="sr-only">Settings</DialogTitle>
        <DialogDescription class="sr-only">Customize your settings here.</DialogDescription>
        <div class="overflow-hidden">
          <SidebarProvider class="min-h-0 items-start">
            <Sidebar collapsible="none" role="navigation" aria-label="Settings sections" class="hidden h-auto self-stretch md:flex">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {settingsSections.map(item => <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton isActive={item.name === section.value} aria-current={item.name === section.value ? "true" as const : undefined} onClick={() => setSection(item.name)}>
                            <Icon name={item.icon} />
                            <span class="truncate">{item.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <div class="flex h-[480px] max-h-[calc(100svh-4rem)] min-w-0 flex-1 flex-col overflow-hidden">
              <header class="flex h-16 shrink-0 items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem class="hidden md:block">
                      <BreadcrumbLink href="#settings">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator class="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{current.value.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>
              <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                <div class="grid gap-1.5 md:hidden">
                  <Label for={selectId}>Section</Label>
                  <NativeSelect id={selectId} value={section.value} onChange={event => setSection(event.target.value)} class="w-full">
                    {settingsSections.map(item => <NativeSelectOption key={item.name} value={item.name}>
                        {item.name}
                      </NativeSelectOption>)}
                  </NativeSelect>
                </div>
                <h2 class="font-script text-2xl leading-tight font-semibold">{current.value.name}</h2>
                <p class="-mt-2 text-sm text-muted-foreground">{current.value.intro}</p>
                <ul class="max-w-xl">
                  {current.value.toggles.map(toggle => <li key={toggle.id} class="flex items-start justify-between gap-4 border-b border-pencil-mark/40 py-3 last:border-b-0">
                      <div class="grid gap-1">
                        <Label for={toggle.id}>{toggle.label}</Label>
                        <p id={`${toggle.id}-hint`} class="text-sm text-muted-foreground">
                          {toggle.hint}
                        </p>
                      </div>
                      <Switch id={toggle.id} aria-describedby={`${toggle.id}-hint`} checked={values.value[toggle.id] ?? false} onCheckedChange={checked => setValues(prev => ({
                      ...prev,
                      [toggle.id]: checked
                    }))} />
                    </li>)}
                </ul>
              </div>
            </div>
          </SidebarProvider>
        </div>
      </DialogContent>
    </Dialog>;
  };
});
