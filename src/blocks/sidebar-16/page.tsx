// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AppSidebar } from "@/blocks/sidebar-16/components/sidebar-16-app-sidebar";
import { SiteHeader } from "@/blocks/sidebar-16/components/sidebar-16-site-header";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
import { PageBody, PageNote, PageSheet } from "@/blocks/sidebar-shared/sidebar-page";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const Page = defineUi<{
  contained?: boolean;
}>("Page", ["contained"], (_props, {
  slots: _slots
}) => {
  const contained = computed(() => _props["contained"] === undefined ? false : _props["contained"]);
  const c = computed(() => containedClasses(contained.value));
  return () => {
    return <div class={cn("[--header-height:calc(--spacing(14))]", contained.value && "h-full")}>
      <SidebarProvider class={cn("flex-col overflow-x-clip", c.value.provider)}>
        <SiteHeader />
        <div class="flex min-h-0 flex-1">
          <AppSidebar contained={contained.value} />
          <PageSheet class={c.value.inset}>
            <PageBody title="Margins" kicker="Writing on paper">
              <PageNote title="Header on top, pad below" pose="wave">
                The strip across the top belongs to the whole window, so the search box is always in reach, wherever you have scrolled to.
              </PageNote>
            </PageBody>
          </PageSheet>
        </div>
      </SidebarProvider>
    </div>;
  };
});
export default Page;
