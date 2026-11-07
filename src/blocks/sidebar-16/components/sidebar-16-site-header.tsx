// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { docsTrail } from "@/blocks/sidebar-shared/sidebar-data";
import { SearchForm } from "@/blocks/sidebar-shared/sidebar-search-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
const STRIP = "ll-paper ll-stock-paper ll-tooth-cold [--ll-sheet-shadow:var(--ll-shadow-hair)]";
export const SiteHeader = defineUi<{}>("SiteHeader", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <header data-slot="site-header" class={`sticky top-0 z-50 flex w-full items-center ${STRIP}`}>
      <div class="relative flex h-(--header-height) w-full items-center gap-2 px-4">
        <SidebarTrigger class="size-8" />
        <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb class="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#writing-on-paper">{docsTrail[0]}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{docsTrail[1]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm variant="bar" placeholder="Type to search..." class="w-full sm:ms-auto sm:w-auto" />
        <Separator class="absolute inset-x-0 bottom-0 w-auto" />
      </div>
    </header>;
  };
});
