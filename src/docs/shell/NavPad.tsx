// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Fastener } from "@/components/ui/paper";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { SideNav } from "./SideNav";
import { LogoMark } from "./LogoMark";
import { useLocaleText } from "../core/settings";
export const NavPad = defineUi<{}>("NavPad", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div id="site-nav" class="dk-sidebar sticky top-[4.75rem] mt-5 hidden h-[calc(100dvh-5.75rem)] w-64 shrink-0 md:block print:hidden">
      <Sidebar collapsible="none" stock="pad" seed="docs-pad" class="pt-6">
        <Fastener kind="binder-clip" size={38} seed="docs-pad|clip" class="absolute start-1/2 -top-3.5 -ms-[19px] calm:hidden forced-colors:hidden" />
        <SideNav />
      </Sidebar>
    </div>;
  };
});
export const MobileNav = defineUi<{}>("MobileNav", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useSidebar();
  const isMobile = computed(() => _hook0.value.isMobile);
  const openMobile = computed(() => _hook0.value.openMobile);
  const setOpenMobile = computed(() => _hook0.value.setOpenMobile);
  const text = useLocaleText();
  const opener = shallowRef<HTMLElement | null | null>(null);
  const content = shallowRef<HTMLDivElement | null>(null);
  return () => {
    if (!isMobile.value) return null;
    return <Sheet open={openMobile.value} onOpenChange={setOpenMobile.value}>
      <SheetContent ref={content} id="site-nav" side="left" stock="pad" binding="none" class="dk-sidebar w-72 max-w-[85vw] gap-2 pt-4" onOpenAutoFocus={event => {
        opener.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const current = content.value?.querySelector<HTMLElement>('[aria-current="page"]');
        if (current) {
          event.preventDefault();
          current.focus({
            preventScroll: true
          });
        }
      }} onCloseAutoFocus={event => {
        event.preventDefault();
        opener.value?.focus({
          preventScroll: true
        });
      }} onClick={event => {
        if ((event.target as HTMLElement).closest("a[href]")) setOpenMobile.value(false);
      }}>
        <SheetHeader class="flex-row items-center gap-2 pb-0">
          <LogoMark size={34} />
          <SheetTitle>{text.value.t("top.menu")}</SheetTitle>
          <SheetDescription class="sr-only">{text.value.t("top.documentationPages")}</SheetDescription>
        </SheetHeader>
        <SideNav />
      </SheetContent>
    </Sheet>;
  };
});
