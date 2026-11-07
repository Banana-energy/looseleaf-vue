// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AppSidebar } from "@/blocks/sidebar-10/components/sidebar-10-app-sidebar";
import { NavActions } from "@/blocks/sidebar-10/components/sidebar-10-nav-actions";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
import { PageBody, PageHeader, PageNote, PageSheet } from "@/blocks/sidebar-shared/sidebar-page";
import { SidebarProvider } from "@/components/ui/sidebar";
const Page = defineUi<{
  contained?: boolean;
}>("Page", ["contained"], (_props, {
  slots: _slots
}) => {
  const contained = computed(() => _props["contained"] === undefined ? false : _props["contained"]);
  const c = computed(() => containedClasses(contained.value));
  return () => {
    return <SidebarProvider class={c.value.provider}>
      <AppSidebar class={c.value.sidebar} />
      <PageSheet class={c.value.inset}>
        <PageHeader crumbs={["Project plan & to-dos"]}>
          <NavActions />
        </PageHeader>
        <PageBody title="Project plan & to-dos" kicker="Favorites">
          <PageNote title="A blank page, for now" pose="write">
            Nothing on this page yet. Open the three dots up in the corner to see what you can do with it.
          </PageNote>
        </PageBody>
      </PageSheet>
    </SidebarProvider>;
  };
});
export default Page;
