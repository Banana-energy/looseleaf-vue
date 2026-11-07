// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "Variants and sides" as const,
  description: "sidebar docks to the edge and casts its shadow toward the page; floating is set down on the desk and turned a little; inset leaves a margin and makes the page itself a sheet of paper. Either side of the screen works, and the clip and torn edge follow." as const,
  layout: "full" as const,
  height: 400,
  stage: "desk" as const
};
const ITEMS = [["Overview", "layout-dashboard"], ["Reports", "chart-column"], ["Team", "users"], ["Billing", "credit-card"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const variant = shallowRef<"sidebar" | "floating" | "inset">(initialState("floating"));
  const setVariant = stateSetter(variant);
  const side = shallowRef<"left" | "right">(initialState("left"));
  const setSide = stateSetter(side);
  return () => {
    return <div class="relative h-[400px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider class="h-full min-h-0">
        {side.value === "left" ? <Pad variant={variant.value} side={side.value} /> : null}
        <SidebarInset class="gap-4 p-4">
          <div class="flex flex-wrap items-center gap-3">
            <SidebarTrigger />
            <ToggleGroup type="single" variant="outline" size="sm" value={variant.value} onValueChange={v => v && setVariant(v as typeof variant)} aria-label="Variant">
              <ToggleGroupItem value="sidebar">sidebar</ToggleGroupItem>
              <ToggleGroupItem value="floating">floating</ToggleGroupItem>
              <ToggleGroupItem value="inset">inset</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" variant="outline" size="sm" value={side.value} onValueChange={v => v && setSide(v as typeof side)} aria-label="Side">
              <ToggleGroupItem value="left">left</ToggleGroupItem>
              <ToggleGroupItem value="right">right</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <p class="max-w-sm text-sm text-muted-foreground">
            {variant.value === "inset" ? "This page is a sheet of paper set on the desk, beside the pad." as const : "This page is plain: the pad hangs beside it." as const}
          </p>
        </SidebarInset>
        {side.value === "right" ? <Pad variant={variant.value} side={side.value} /> : null}
      </SidebarProvider>
    </div>;
  };
});
export default Example;
const Pad = defineUi<{
  variant: "sidebar" | "floating" | "inset";
  side: "left" | "right";
}>("Pad", ["variant", "side"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"]);
  const side = computed(() => _props["side"]);
  return () => {
    return <Sidebar variant={variant.value} side={side.value} class="h-full" seed="variants">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map(([title, icon], i) => <SidebarMenuItem key={title}>
                  <SidebarMenuButton isActive={i === 0}>
                    <Icon name={icon} />
                    <span>{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
  };
});
