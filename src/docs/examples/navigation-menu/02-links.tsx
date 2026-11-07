// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
export const meta = {
  title: "Links only" as const,
  description: "No panels: a strip of links. In the strip a link is a tab like the triggers, and the current page (active) is filled with highlighter with aria-current. Arrow keys walk the tabs; asChild puts the tab on your router's link." as const,
  layout: "center" as const
};
const PAGES = ["Overview", "Notebooks", "Stickers", "Settings"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const page = shallowRef(initialState("Notebooks"));
  const setPage = stateSetter(page);
  return () => {
    return <div class="grid justify-items-center gap-4">
      <NavigationMenu aria-label="Sections">
        <NavigationMenuList>
          {PAGES.map(p => <NavigationMenuItem key={p}>
              <NavigationMenuLink asChild active={page.value === p} seed={p}>
                <a href={`#${p}`} onClick={(e: PointerEvent) => {
                e.preventDefault();
                setPage(p);
              }}>
                  {p}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>)}
        </NavigationMenuList>
      </NavigationMenu>
      <p class="text-sm text-muted-foreground" aria-live="polite">
        You are on {page.value}.
      </p>
    </div>;
  };
});
export default Example;
