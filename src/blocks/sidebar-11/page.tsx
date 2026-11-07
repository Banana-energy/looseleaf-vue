// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { AppSidebar } from "@/blocks/sidebar-11/components/sidebar-11-app-sidebar";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
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
  const active = shallowRef(initialState("components/ui/button.tsx"));
  const setActive = stateSetter(active);
  const parts = computed(() => active.value.split("/"));
  const file = computed(() => parts.value[parts.value.length - 1]!);
  return () => {
    return <SidebarProvider class={cn("overflow-x-clip", c.value.provider)}>
      <AppSidebar class={c.value.sidebar} active={active.value} onPick={setActive} />
      <PageSheet class={c.value.inset}>
        <PageHeader crumbs={parts.value} bordered />
        <PageBody title={file.value} kicker={parts.value.length > 1 ? parts.value.slice(0, -1).join(" / ") : "project root" as const}>
          <PageNote title="No editor here yet" pose="think">
            This is where {file.value} would open. Pick another file on the pad and the trail above follows you.
          </PageNote>
        </PageBody>
      </PageSheet>
    </SidebarProvider>;
  };
});
export default Page;
