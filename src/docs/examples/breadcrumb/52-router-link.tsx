// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment, shallowRef } from "vue";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "With your router's Link" as const,
  description: "BreadcrumbLink asChild hands the highlighter, spacing and focus ring to whatever element you give it. Here that is a Link that changes the path without loading a page (a stand-in for next/link, Vue Router or TanStack Router); the trail is built from the path." as const,
  layout: "stack" as const
};
const TITLES: Record<string, string> = {
  docs: "Docs" as const,
  components: "Components" as const,
  breadcrumb: "Breadcrumb" as const,
  button: "Button" as const,
  card: "Card" as const,
  calendar: "Calendar" as const
};
const Link = defineUi<UI.ComponentProps<"a"> & {
  onNavigate: (to: string) => void;
}>("Link", ["href", "onNavigate", "onClick"], (_props, {
  slots: _slots
}) => {
  const href = computed(() => _props["href"] === undefined ? "/" as const : _props["href"]);
  const onNavigate = computed(() => _props["onNavigate"]);
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["href", "onNavigate", "onClick"]));
  return () => {
    return <a href={`#path${href.value.replaceAll("/", "-")}`} onClick={(e: PointerEvent) => {
      onClick.value?.(e);
      if (e.defaultPrevented) return;
      e.preventDefault();
      onNavigate.value(href.value);
    }} {...domProps(props.value)}>{_slots.default?.()}</a>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const path = shallowRef(initialState("/docs/components/breadcrumb"));
  const setPath = stateSetter(path);
  const parts = computed(() => path.value.split("/").filter(Boolean));
  const trail = computed(() => [{
    href: "/" as const,
    title: "Home" as const
  }, ...parts.value.map((p, i) => ({
    href: `/${parts.value.slice(0, i + 1).join("/")}`,
    title: TITLES[p] ?? p
  }))]);
  return () => {
    return <div class="grid justify-items-start gap-5">
      <Breadcrumb>
        <BreadcrumbList>
          {trail.value.map((crumb, i) => <Fragment key={crumb.href}>
              <BreadcrumbItem>
                {i < trail.value.length - 1 ? <BreadcrumbLink asChild>
                    <Link href={crumb.href} onNavigate={setPath}>
                      {crumb.title}
                    </Link>
                  </BreadcrumbLink> : <BreadcrumbPage seed={crumb.href}>{crumb.title}</BreadcrumbPage>}
              </BreadcrumbItem>
              {i < trail.value.length - 1 ? <BreadcrumbSeparator /> : null}
            </Fragment>)}
        </BreadcrumbList>
      </Breadcrumb>
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm" variant="outline" onClick={() => setPath("/docs/components/button")}>
          Open Button
        </Button>
        <Button size="sm" variant="outline" onClick={() => setPath("/docs/components/card")}>
          Open Card
        </Button>
        <Button size="sm" variant="outline" onClick={() => setPath("/docs/components/calendar")}>
          Open Calendar
        </Button>
      </div>
      <p class="font-mono text-sm text-muted-foreground" role="status">
        path: {path.value}
      </p>
    </div>;
  };
});
export default Example;
