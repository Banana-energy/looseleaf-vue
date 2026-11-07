// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
const Pagination = defineUi<UI.ComponentProps<"nav">>("Pagination", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <nav role="navigation" aria-label="pagination" data-slot="pagination" class={cn("mx-auto flex w-full justify-center", className.value)} {...domProps(props.value)}>{_slots.default?.()}</nav>;
  };
});
const PaginationContent = defineUi<UI.ComponentProps<"ul">>("PaginationContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <ul data-slot="pagination-content" class={cn("flex flex-row items-center gap-1.5", className.value)} {...domProps(props.value)}>{_slots.default?.()}</ul>;
  };
});
const PaginationItem = defineUi<UI.ComponentProps<"li">>("PaginationItem", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <li data-slot="pagination-item" {...domProps(props.value)}>{_slots.default?.()}</li>;
  };
});
type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<UI.ComponentProps<typeof Button>, "size"> & UI.ComponentProps<"a">;
const PaginationLink = defineUi<PaginationLinkProps>("PaginationLink", ["class", "isActive", "disabled", "size", "onClick"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const isActive = computed(() => _props["isActive"]);
  const disabled = computed(() => _props["disabled"]);
  const size = computed(() => _props["size"] === undefined ? "icon" as const : _props["size"]);
  const onClick = computed(() => _props["onClick"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "isActive", "disabled", "size", "onClick", "children"]));
  return () => {
    return <Button asChild variant={isActive.value ? "secondary" as const : "ghost" as const} size={size.value} class={className.value} disabled={disabled.value}>
      <a aria-current={isActive.value ? "page" as const : undefined} data-slot="pagination-link" data-active={isActive.value} onClick={disabled.value ? undefined : onClick.value} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </a>
    </Button>;
  };
});
const PaginationPrevious = defineUi<UI.ComponentProps<typeof PaginationLink>>("PaginationPrevious", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <PaginationLink aria-label="Go to previous page" size="default" class={cn("gap-1 px-2.5 sm:ps-2.5", className.value)} {...domProps(props.value)}>
      <Icon name="chevron-left" />
      <span class="hidden sm:block">Previous</span>
    </PaginationLink>;
  };
});
const PaginationNext = defineUi<UI.ComponentProps<typeof PaginationLink>>("PaginationNext", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <PaginationLink aria-label="Go to next page" size="default" class={cn("gap-1 px-2.5 sm:pe-2.5", className.value)} {...domProps(props.value)}>
      <span class="hidden sm:block">Next</span>
      <Icon name="chevron-right" />
    </PaginationLink>;
  };
});
const PaginationEllipsis = defineUi<UI.ComponentProps<"span">>("PaginationEllipsis", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <span aria-hidden data-slot="pagination-ellipsis" class={cn("flex size-9 items-center justify-center text-ink-soft", className.value)} {...domProps(props.value)}>
      <Icon name="ellipsis" />
      <span class="sr-only">More pages</span>
    </span>;
  };
});
export { Pagination, PaginationContent, PaginationLink, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis };
