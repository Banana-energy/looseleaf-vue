// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment, toValue, type MaybeRefOrGetter, shallowRef } from "vue";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const meta = {
  title: "Responsive: menu or drawer" as const,
  description: "A deep path keeps its first and last two crumbs and folds the rest. The fold opens a dropdown on a wide screen and a drawer on a phone, from one component: the query is read with useSyncExternalStore, so the server renders the wide version and a phone swaps after hydration." as const,
  layout: "center" as const
};
const ITEMS = [{
  href: "#home" as const,
  label: "Home" as const
}, {
  href: "#docs" as const,
  label: "Documentation" as const
}, {
  href: "#build" as const,
  label: "Build your application" as const
}, {
  href: "#fetching" as const,
  label: "Data fetching" as const
}, {
  label: "Caching and revalidating" as const
}];
const ITEMS_TO_DISPLAY = 3;
function useMediaQuery(_source0: MaybeRefOrGetter<string>) {
  const query = computed(() => toValue(_source0));
  const _nestedHook0 = useExternalStore(notify => {
    const mq = window.matchMedia(query.value);
    mq.addEventListener("change", notify);
    return () => mq.removeEventListener("change", notify);
  }, () => window.matchMedia(query.value).matches);
  return computed(() => {
    return _nestedHook0.value;
  });
}
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const isDesktop = useMediaQuery(() => "(min-width: 768px)");
  const folded = computed(() => ITEMS.slice(1, -ITEMS_TO_DISPLAY + 1));
  const tail = computed(() => ITEMS.slice(-ITEMS_TO_DISPLAY + 1));
  return () => {
    return <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={ITEMS[0].href}>{ITEMS[0].label}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {ITEMS.length > ITEMS_TO_DISPLAY ? <>
            <BreadcrumbItem>
              {isDesktop.value ? <DropdownMenu open={open.value} onOpenChange={setOpen}>
                  <DropdownMenuTrigger class="-mx-1 flex items-center gap-1 px-1 hover:ll-swipe focus-visible:ll-swipe data-[state=open]:ll-swipe" aria-label="Toggle menu">
                    <BreadcrumbEllipsis class="size-6" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" class="w-56">
                    {folded.value.map(item => <DropdownMenuItem key={item.label} asChild>
                        <a href={item.href}>{item.label}</a>
                      </DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu> : <Drawer open={open.value} onOpenChange={setOpen}>
                  <DrawerTrigger class="-mx-1 flex items-center px-1 hover:ll-swipe focus-visible:ll-swipe" aria-label="Toggle menu">
                    <BreadcrumbEllipsis class="size-6" />
                  </DrawerTrigger>
                  <DrawerContent seed="crumbs">
                    <DrawerHeader class="text-start">
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>Select a page to navigate to.</DrawerDescription>
                    </DrawerHeader>
                    <div class="grid gap-1 px-4">
                      {folded.value.map(item => <a key={item.label} href={item.href} class="py-1 hover:ll-swipe focus-visible:ll-swipe">
                          {item.label}
                        </a>)}
                    </div>
                    <DrawerFooter class="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </> : null}
        {tail.value.map((item, i) => <Fragment key={item.label}>
            <BreadcrumbItem>
              {item.href ? <BreadcrumbLink href={item.href} class="max-w-20 truncate md:max-w-none">
                  {item.label}
                </BreadcrumbLink> : <BreadcrumbPage seed="responsive" class="max-w-20 truncate md:max-w-none">
                  {item.label}
                </BreadcrumbPage>}
            </BreadcrumbItem>
            {i < tail.value.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>)}
      </BreadcrumbList>
    </Breadcrumb>;
  };
});
export default Example;
