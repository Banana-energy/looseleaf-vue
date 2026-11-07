// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@/components/ui/icon";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
export const meta = {
  title: "Six items (as written)" as const,
  description: "shadcn's `navigation-menu-demo` line for line: `viewport={isMobile}` from `useIsMobile()`, `navigationMenuTriggerStyle()` on a plain link, `flex-wrap` on the list, the last three panels hidden below `md`, and a ListItem helper. Link is an `<a>` here (shadcn's uses next/link)." as const,
  layout: "center" as const,
  height: 460
};
const components: {
  title: string;
  href: string;
  description: string;
}[] = [{
  title: "Alert Dialog" as const,
  href: "#alert-dialog" as const,
  description: "A modal dialog that interrupts the user with important content and expects a response." as const
}, {
  title: "Hover Card" as const,
  href: "#hover-card" as const,
  description: "For sighted users to preview content available behind a link." as const
}, {
  title: "Progress" as const,
  href: "#progress" as const,
  description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar." as const
}, {
  title: "Scroll-area" as const,
  href: "#scroll-area" as const,
  description: "Visually or semantically separates content." as const
}, {
  title: "Tabs" as const,
  href: "#tabs" as const,
  description: "A set of layered sections of content—known as tab panels—that are displayed one at a time." as const
}, {
  title: "Tooltip" as const,
  href: "#tooltip" as const,
  description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it." as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const isMobile = useIsMobile();
  return () => {
    return <NavigationMenu viewport={isMobile.value} aria-label="Main">
      <NavigationMenuList class="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li class="row-span-3">
                <NavigationMenuLink asChild>
                  <a class="flex h-full w-full flex-col justify-end bg-linear-to-b from-muted/50 to-muted p-4 no-underline outline-hidden select-none md:p-6" href="#home">
                    <div class="mb-2 text-lg font-medium sm:mt-4">Looseleaf</div>
                    <p class="text-sm leading-tight text-muted-foreground">Beautifully designed components built with Tailwind CSS.</p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#docs" title="Introduction">
                Re-usable components built using Reka UI UI and Tailwind CSS.
              </ListItem>
              <ListItem href="#installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="#typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map(component => <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild class={navigationMenuTriggerStyle()}>
            <a href="#docs">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem class="hidden md:block">
          <NavigationMenuTrigger>List</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#components">
                    <div class="font-medium">Components</div>
                    <div class="text-muted-foreground">Browse all components in the library.</div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#documentation">
                    <div class="font-medium">Documentation</div>
                    <div class="text-muted-foreground">Learn how to use the library.</div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#blog">
                    <div class="font-medium">Blog</div>
                    <div class="text-muted-foreground">Read our latest blog posts.</div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem class="hidden md:block">
          <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#components">Components</a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#documentation">Documentation</a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#blocks">Blocks</a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem class="hidden md:block">
          <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#backlog" class="flex-row items-center gap-2">
                    <Icon name="circle-question-mark" />
                    Backlog
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#to-do" class="flex-row items-center gap-2">
                    <Icon name="circle" />
                    To Do
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#done" class="flex-row items-center gap-2">
                    <Icon name="circle-check" />
                    Done
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>;
  };
});
export default Example;
const ListItem = defineUi<UI.ComponentPropsWithoutRef<"li"> & {
  href: string;
}>("ListItem", ["title", "href"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const children = renderValue(() => readSlot(_slots.default));
  const href = computed(() => _props["href"]);
  const props = computed(() => omitProps(_props, ["title", "children", "href"]));
  return () => {
    return <li {...domProps(props.value)}>
      <NavigationMenuLink asChild>
        <a href={href.value}>
          <div class="text-sm leading-none font-medium">{title.value}</div>
          <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">{readSlot(_slots.default)}</p>
        </a>
      </NavigationMenuLink>
    </li>;
  };
});
