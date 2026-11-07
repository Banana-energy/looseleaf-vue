// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarProvider } from "@/components/ui/sidebar";
export const meta = {
  title: "Search and loading" as const,
  description: "A long menu stays cheap: 40 notebooks are 40 list items with no drawing each, only the current one draws its mark. The search field filters them, the plus on the label adds one, and Reload shows loading rows (their widths come from a seed, so they are the same on the server and the client)." as const,
  layout: "full" as const,
  height: 560,
  stage: "desk" as const
};
const BASE = ["Field notes", "Garden log", "Recipes", "Trip to Lisbon", "Sketches", "Reading list", "Letters", "Budget"];
const ALL = Array.from({
  length: 40
}, (_, i) => `${BASE[i % BASE.length]}${i >= BASE.length ? ` ${Math.floor(i / BASE.length) + 1}` : "" as const}`);
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const q = shallowRef(initialState(""));
  const setQ = stateSetter(q);
  const loading = shallowRef(initialState(false));
  const setLoading = stateSetter(loading);
  const current = shallowRef(initialState(ALL[0]));
  const setCurrent = stateSetter(current);
  const extra = shallowRef<string[]>(initialState([]));
  const setExtra = stateSetter(extra);
  const names = computed(() => [...extra.value, ...ALL].filter(n => n.toLowerCase().includes(q.value.trim().toLowerCase())));
  return () => {
    function reload() {
      setLoading(true);
      setTimeout(() => setLoading(false), 1400);
    }
    return <div class="relative h-[560px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider class="h-full min-h-0">
        <Sidebar class="h-full" seed="search">
          <SidebarHeader>
            <SidebarInput aria-label="Search notebooks" placeholder="Search notebooks…" value={q.value} onChange={e => setQ(e.target.value)} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Notebooks</SidebarGroupLabel>
              <SidebarGroupAction aria-label="New notebook" onClick={() => setExtra(e => [`Untitled ${e.length + 1}`, ...e])}>
                <Icon name="plus" />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {loading.value ? Array.from({
                    length: 7
                  }, (_, i) => <SidebarMenuItem key={i}>
                          <SidebarMenuSkeleton showIcon seed={`sk-${i}`} />
                        </SidebarMenuItem>) : names.value.map(name => <SidebarMenuItem key={name}>
                          <SidebarMenuButton isActive={current.value === name} onClick={() => setCurrent(name)}>
                            <Icon name="file-text" />
                            <span>{name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>)}
                  {!loading.value && names.value.length === 0 ? <li class="px-2 py-1.5 text-sm text-muted-foreground">No notebook matches “{q.value}”.</li> : null}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset class="gap-3 p-4">
          <h2 class="font-script text-2xl leading-none font-semibold">{current.value}</h2>
          <p class="max-w-sm text-sm text-muted-foreground" aria-live="polite">
            {loading.value ? "Loading notebooks…" as const : `${names.value.length} notebooks shown.`}
          </p>
          <Button variant="outline" size="sm" class="w-fit" onClick={reload} disabled={loading.value}>
            <Icon name="rotate-cw" /> Reload
          </Button>
        </SidebarInset>
      </SidebarProvider>
    </div>;
  };
});
export default Example;
