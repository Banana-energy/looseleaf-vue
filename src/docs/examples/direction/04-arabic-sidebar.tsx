// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { DirectionProvider } from "@/components/ui/direction";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
export const meta = {
  title: "Arabic: sidebar" as const,
  description: "The pad hangs on the right, where a right-to-left page keeps its margin: side=\"right\" is a physical side, so you choose it. The clip, the highlighter, the bracket, the panel icon and the sheet on a phone all follow." as const,
  layout: "full" as const,
  height: 520,
  stage: "desk" as const
};
const PAGES = [{
  title: "الرئيسية" as const,
  icon: "house" as const,
  active: true
}, {
  title: "الملاحظات" as const,
  icon: "file-text" as const,
  count: "12" as const
}, {
  title: "الأصدقاء" as const,
  icon: "users" as const
}, {
  title: "الإعدادات" as const,
  icon: "settings" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <DirectionProvider direction="rtl">
      <div lang="ar" class="relative h-[520px] w-full overflow-hidden [transform:translateZ(0)]">
        <SidebarProvider class="h-full min-h-0">
          <Sidebar side="right" class="h-full" seed="direction-sidebar">
            <SidebarHeader class="font-script text-2xl font-semibold">دفتري</SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel class="tracking-normal">الصفحات</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {PAGES.map(page => <SidebarMenuItem key={page.title}>
                        <SidebarMenuButton isActive={page.active} tooltip={page.title}>
                          <Icon name={page.icon} />
                          <span>{page.title}</span>
                        </SidebarMenuButton>
                        {page.count ? <SidebarMenuBadge>{page.count}</SidebarMenuBadge> : null}
                      </SidebarMenuItem>)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset class="p-4">
            <div class="flex items-center gap-2">
              <SidebarTrigger />
              <h2 class="font-script text-2xl leading-none font-semibold">مرحبًا بك</h2>
            </div>
            <p class="mt-3 max-w-md text-sm text-muted-foreground">الشريط الجانبي على يمين الصفحة. اطوِه بالزر، أو بالاختصار Ctrl/Cmd+B.</p>
            <Button variant="secondary" size="sm" class="mt-4 w-fit">
              <Icon name="sparkles" /> ابدأ
            </Button>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </DirectionProvider>;
  };
});
export default Example;
