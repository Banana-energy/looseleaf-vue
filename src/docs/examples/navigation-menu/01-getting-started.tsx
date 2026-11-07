// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Mascot } from "@/components/ui/mascot";
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
export const meta = {
  title: "Getting started" as const,
  description: "The shadcn demo on an index strip: a featured card with the mascot beside three rows, a two-column panel of components, and a plain tab. Move from Getting started to Components: the slip resizes, the panels slide inside it and the felt-tip underline glides along." as const,
  layout: "center" as const,
  height: 420
};
const COMPONENTS = [["Alert Dialog", "A modal dialog that interrupts the user with important content."], ["Hover Card", "For sighted users to preview content available behind a link."], ["Progress", "Displays an indicator showing the completion progress of a task."], ["Scroll Area", "Visually or semantically separates content."], ["Tabs", "A set of layered sections of content, one displayed at a time."], ["Tooltip", "A popup that displays information related to an element."]] as const;
const Row = defineUi<{
  title: string;
  children: UI.VueNode;
  href?: string;
}>("Row", ["title", "href"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const children = renderValue(() => readSlot(_slots.default));
  const href = computed(() => _props["href"] === undefined ? "#" as const : _props["href"]);
  return () => {
    return <li>
      <NavigationMenuLink asChild>
        <a href={href.value}>
          <span class="font-bold">{title.value}</span>
          <span class="line-clamp-2 text-sm leading-snug text-muted-foreground">{readSlot(_slots.default)}</span>
        </a>
      </NavigationMenuLink>
    </li>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <NavigationMenu aria-label="Main" class="self-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger seed="gs">Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li class="row-span-3">
                <NavigationMenuLink asChild>
                  <a href="#looseleaf" class="flex h-full flex-col justify-end gap-1 bg-card p-4 shadow-loose">
                    <Mascot pose="wave" size={64} class="mb-2" style={cssStyle({
                      width: "auto" as const,
                      height: 64
                    })} />
                    <span class="font-script text-2xl leading-none font-semibold">Looseleaf</span>
                    <span class="text-sm leading-snug text-muted-foreground">Beautifully designed components, drawn by hand.</span>
                  </a>
                </NavigationMenuLink>
              </li>
              <Row href="#docs" title="Introduction">
                Re-usable components built with Reka UI UI and Tailwind CSS.
              </Row>
              <Row href="#install" title="Installation">
                How to install dependencies and structure your app.
              </Row>
              <Row href="#type" title="Typography">
                Styles for headings, paragraphs, lists and more.
              </Row>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger seed="cm">Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {COMPONENTS.map(([title, desc]) => <Row key={title} title={title}>
                  {desc}
                </Row>)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#docs" seed="docs">
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>
    </NavigationMenu>;
  };
});
export default Example;
