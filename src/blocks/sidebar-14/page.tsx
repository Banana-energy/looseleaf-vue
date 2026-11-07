// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AppSidebar } from "@/blocks/sidebar-14/components/sidebar-14-app-sidebar";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
import { docsTrail } from "@/blocks/sidebar-shared/sidebar-data";
import { PageBody, PageHeader, PageNote, PageSheet } from "@/blocks/sidebar-shared/sidebar-page";
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
    return <SidebarProvider class={cn("overflow-x-clip", c.value.provider)}>
      <PageSheet class={c.value.inset}>
        <PageHeader crumbs={docsTrail} trigger="end" bordered />
        <PageBody title="Margins" kicker="Writing on paper">
          <PageNote title="Read it from the right" pose="peek">
            The pad on this side lists what is on the page. Fold it away with the button in the corner when you would rather just read.
          </PageNote>
        </PageBody>
      </PageSheet>
      <AppSidebar side="right" class={c.value.sidebar} />
    </SidebarProvider>;
  };
});
export default Page;
