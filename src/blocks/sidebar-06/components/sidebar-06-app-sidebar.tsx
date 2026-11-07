// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { NavMain } from "@/blocks/sidebar-06/components/sidebar-06-nav-main";
import { SidebarOptInForm } from "@/blocks/sidebar-06/components/sidebar-06-opt-in-form";
import { SidebarBrand } from "@/blocks/sidebar-shared/sidebar-brand";
import { docsNav } from "@/blocks/sidebar-shared/sidebar-data";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <Sidebar role="navigation" aria-label="Field guide" {...domProps(props.value)}>
      <SidebarHeader>
        <SidebarBrand title="Field guide" subtitle="v1.0.0" icon="book-open" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={docsNav} />
      </SidebarContent>
      <SidebarFooter>
        <div class="p-1 [@media(max-height:34rem)]:hidden">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>;
  };
});
