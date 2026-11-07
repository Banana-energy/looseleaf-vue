// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { AppSidebar } from "@/blocks/sidebar-13/components/sidebar-13-app-sidebar";
import { SettingsDialog } from "@/blocks/sidebar-13/components/sidebar-13-settings-dialog";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
import { PageBody, PageHeader, PageNote, PageSheet } from "@/blocks/sidebar-shared/sidebar-page";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const Page = defineUi<{
  contained?: boolean;
}>("Page", ["contained"], (_props, {
  slots: _slots
}) => {
  const contained = computed(() => _props["contained"] === undefined ? false : _props["contained"]);
  const c = computed(() => containedClasses(contained.value));
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const opener = shallowRef<HTMLElement | null | null>(null);
  const openSettings = computed(() => (from: HTMLElement) => {
    opener.value = from;
    setOpen(true);
  });
  return () => {
    return <SidebarProvider class={cn("overflow-x-clip", c.value.provider)}>
      <AppSidebar class={c.value.sidebar} onOpenSettings={openSettings.value} />
      <PageSheet class={c.value.inset}>
        <PageHeader crumbs={["Notes", "Untitled"]} bordered>
          <Button variant="outline" size="sm" aria-haspopup="dialog" onClick={event => openSettings.value(event.currentTarget)}>
            <Icon name="settings" />
            Settings
          </Button>
        </PageHeader>
        <PageBody title="Untitled" kicker="Notes">
          <PageNote title="Settings live in a drawer of their own" pose="point">
            Open them from the pad or from the button in the corner. Everything you change is kept while you write.
          </PageNote>
        </PageBody>
      </PageSheet>
      <SettingsDialog open={open.value} onOpenChange={setOpen} onCloseAutoFocus={event => {
        event.preventDefault();
        opener.value?.focus();
      }} />
    </SidebarProvider>;
  };
});
export default Page;
