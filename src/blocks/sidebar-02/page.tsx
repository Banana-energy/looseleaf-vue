// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AppSidebar } from "@/blocks/sidebar-02/components/sidebar-02-app-sidebar";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
import { docsTrail } from "@/blocks/sidebar-shared/sidebar-data";
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
        <PageHeader crumbs={docsTrail} sticky bordered class="overflow-x-clip" />
        <PageBody title="Margins" kicker="Writing on paper">
          <PageNote title="Fold what you are not reading" pose="think">
            Every heading on the pad folds shut. Tidy the shelf, and the page you want is one glance away.
          </PageNote>
        </PageBody>
      </PageSheet>
    </SidebarProvider>;
  };
});
export default Page;
