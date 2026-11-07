// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Handwritten } from "@/components/ui/handwritten";
import type { MascotPose } from "@/components/ui/mascot";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { InkTiles } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
const SHEET = "ll-paper ll-stock-paper ll-tooth-cold";
const SHEET_TILES = ["fibre", "relief", "cloud"] as const;
const STRIP = `${SHEET} [--ll-sheet-shadow:var(--ll-shadow-hair)]`;
export const PageSheet = defineUi<UI.ComponentProps<typeof SidebarInset>>("PageSheet", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <SidebarInset class={cn(SHEET, "before:block min-w-0 md:peer-data-[variant=floating]:m-2 md:peer-data-[variant=floating]:ms-0 md:peer-data-[variant=floating]:peer-data-[state=collapsed]:ms-2", className.value)} {...domProps(props.value)}>
      <InkTiles tiles={SHEET_TILES} />
      {readSlot(_slots.default)}
    </SidebarInset>;
  };
});
export interface Crumb {
  label: string;
  href?: string;
}
export const PageHeader = defineUi<{
  crumbs: (string | Crumb)[];
  bordered?: boolean;
  sticky?: boolean;
  trigger?: "start" | "end" | false;
  className?: string;
  children?: UI.ReactNode;
}>("PageHeader", ["crumbs", "bordered", "sticky", "trigger", "class"], (_props, {
  slots: _slots
}) => {
  const crumbs = computed(() => _props["crumbs"]);
  const bordered = computed(() => _props["bordered"] === undefined ? false : _props["bordered"]);
  const sticky = computed(() => _props["sticky"] === undefined ? false : _props["sticky"]);
  const trigger = computed(() => _props["trigger"] === undefined ? "start" as const : _props["trigger"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const items = computed(() => crumbs.value.map(c => typeof c === "string" ? {
    label: c
  } : c));
  const last = computed(() => items.value.length - 1);
  return () => {
    return <header data-slot="page-header" class={cn("flex h-16 shrink-0 items-center gap-2 px-4 compact:h-14 calm:h-12", (bordered.value || sticky.value) && "relative overflow-x-clip", sticky.value && cn("sticky top-0 z-10", STRIP), className.value)}>
      {trigger.value === "start" ? <>
          <SidebarTrigger class="-ms-1" />
          <Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
        </> : null}
      <Breadcrumb class="min-w-0">
        <BreadcrumbList>
          {items.value.map((item, i) => i === last.value ? <BreadcrumbItem key={item.label} class="min-w-0">
                <BreadcrumbPage class="line-clamp-1">{item.label}</BreadcrumbPage>
              </BreadcrumbItem> : <Fragment key={item.label}>
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink href={item.href ?? `#${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{item.label}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="hidden md:block" />
              </Fragment>)}
        </BreadcrumbList>
      </Breadcrumb>
      {readSlot(_slots.default) ? <div class="ms-auto flex items-center gap-2">{readSlot(_slots.default)}</div> : null}
      {trigger.value === "end" ? <SidebarTrigger class="-me-1 ms-auto" /> : null}
      {bordered.value ? <Separator class="absolute inset-x-0 bottom-0 w-auto" /> : null}
    </header>;
  };
});
export const PageBody = defineUi<{
  title: string;
  kicker?: string;
  className?: string;
  children?: UI.ReactNode;
}>("PageBody", ["title", "kicker", "class"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const kicker = computed(() => _props["kicker"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <div data-slot="page-body" class={cn("flex flex-1 flex-col gap-4 p-4 pt-2 md:px-8", className.value)}>
      <div>
        {kicker.value ? <p class="font-type text-sm tracking-wide text-ink-muted">{kicker.value}</p> : null}
        <h1 class="font-script text-3xl leading-tight font-semibold">{title.value}</h1>
      </div>
      {readSlot(_slots.default)}
    </div>;
  };
});
export const PageNote = defineUi<{
  title: string;
  pose?: MascotPose;
  doodle?: string;
  className?: string;
  children?: UI.ReactNode;
}>("PageNote", ["title", "pose", "doodle", "class"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const pose = computed(() => _props["pose"]);
  const doodle = computed(() => _props["doodle"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <div data-slot="page-note" class={cn("flex flex-1 items-center justify-center", className.value)}>
      <Empty class="max-w-sm p-4 md:p-6">
        <EmptyHeader>
          {pose.value || doodle.value ? <EmptyMedia pose={pose.value} doodle={doodle.value} size={72} /> : null}
          <EmptyTitle class="text-2xl">{title.value}</EmptyTitle>
          {readSlot(_slots.default) ? <EmptyDescription>
              <Handwritten as="span">{readSlot(_slots.default)}</Handwritten>
            </EmptyDescription> : null}
        </EmptyHeader>
      </Empty>
    </div>;
  };
});
