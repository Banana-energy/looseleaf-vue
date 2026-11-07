// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Site header (composed)" as const,
  description: "A real use: the logo, the strip and the account buttons in one header on a sheet of paper. The panels open over the page below; the sign-in button is a normal Button." as const,
  layout: "center" as const,
  height: 340,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" seed="header" class="z-(--ll-z-raised) w-full max-w-3xl self-start px-5 pt-3 pb-4">
      <header class="flex flex-wrap items-end gap-x-4 gap-y-2">
        <a href="#home" class="flex items-center gap-2 self-center font-script text-2xl leading-none font-semibold">
          <Icon name="book-open" size={22} /> Looseleaf
        </a>
        <NavigationMenu aria-label="Main" class="max-w-none flex-none">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger seed="h1">Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul class="grid w-60 gap-1">
                  {[["Notebooks", "Write things down."], ["Stickers", "Mark them up."], ["Templates", "Start from a page."]].map(([t, d]) => <li key={t}>
                      <NavigationMenuLink href={`#${t}`}>
                        <span class="font-bold">{t}</span>
                        <span class="text-sm text-muted-foreground">{d}</span>
                      </NavigationMenuLink>
                    </li>)}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#pricing" seed="h2">
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#blog" seed="h3" active>
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuIndicator />
          </NavigationMenuList>
        </NavigationMenu>
        <div class="ms-auto flex items-center gap-2 self-center">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Get started</Button>
        </div>
      </header>
    </Paper>;
  };
});
export default Example;
