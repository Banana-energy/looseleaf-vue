// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
export const meta = {
  title: "A slip under each tab" as const,
  description: "viewport={false}: there is no shared slip, so each panel is a slip of its own set down under its tab, at the size of its contents. Good for short menus of a few links." as const,
  layout: "center" as const,
  height: 300
};
const ITEMS = [["Product", ["Notebooks", "Stickers", "Templates"]], ["Company", ["About", "Blog", "Careers"]]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <NavigationMenu viewport={false} aria-label="Company">
      <NavigationMenuList>
        {ITEMS.map(([label, links]) => <NavigationMenuItem key={label}>
            <NavigationMenuTrigger seed={label}>{label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid w-48 gap-1">
                {links.map(l => <li key={l}>
                    <NavigationMenuLink href={`#${l}`}>
                      <span class="flex items-center gap-2">
                        <Icon name="chevron-right" /> {l}
                      </span>
                    </NavigationMenuLink>
                  </li>)}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>)}
      </NavigationMenuList>
    </NavigationMenu>;
  };
});
export default Example;
