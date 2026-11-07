// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { Arrow } from "@/components/ui/arrow";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Link, navigate } from "../core/router";
import { useLocaleText } from "../core/settings";
export interface PagerLink {
  to: string;
  title: string;
}
const isEditable = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.closest('[role="combobox"], [role="textbox"], [role="searchbox"], [role="spinbutton"]') !== null);
function usePagerKeys(_source0: MaybeRefOrGetter<PagerLink | null | undefined>, _source1: MaybeRefOrGetter<PagerLink | null | undefined>) {
  const prev = computed(() => toValue(_source0));
  const next = computed(() => toValue(_source1));
  const prevTo = computed(() => prev.value?.to);
  const nextTo = computed(() => next.value?.to);
  watchDependencies(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || isEditable(event.target)) return;
      if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
      const to = event.key === "[" ? prevTo.value : event.key === "]" ? nextTo.value : undefined;
      if (!to) return;
      event.preventDefault();
      navigate(to);
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, () => [prevTo.value, nextTo.value], false);
  return computed(() => {});
}
const PagerItem = defineUi<{
  link: PagerLink;
  dir: "prev" | "next";
}>("PagerItem", ["link", "dir"], (_props, {
  slots: _slots
}) => {
  const link = computed(() => _props["link"]);
  const dir = computed(() => _props["dir"]);
  const back = computed(() => dir.value === "prev");
  const text = useLocaleText();
  return () => {
    return <Link to={link.value.to} rel={dir.value} data-dir={dir.value} aria-keyshortcuts={back.value ? "[" as const : "]" as const} class={"dk-pager-link group/pager flex min-w-0 items-center gap-3 px-2 py-2 outline-offset-2 hover:ll-swipe " + (back.value ? "text-start" as const : "flex-row-reverse text-end sm:col-start-2" as const)}>
      <Arrow aria-hidden direction={back.value ? "left" as const : "right" as const} curve="curved" tone="blue" class={"h-8 w-14 shrink-0 transition-transform duration-(--ll-dur-hover) ease-settle " + (back.value ? "group-hover/pager:-translate-x-1" as const : "group-hover/pager:translate-x-1" as const)} />
      <span class="flex min-w-0 flex-col">
        <span class={"dk-pager-label flex items-center gap-1.5 font-type text-xs text-ink-muted " + (back.value ? "" as const : "justify-end" as const)}>
          {back.value ? text.value.t("pager.previous") : text.value.t("pager.next")}
          <Kbd aria-hidden="true" class="max-sm:hidden">
            {back.value ? "[" as const : "]" as const}
          </Kbd>
        </span>
        <span class="dk-pager-title truncate font-script text-2xl leading-tight font-bold text-ink-you">{link.value.title}</span>
      </span>
    </Link>;
  };
});
export const Pager = defineUi<{
  label: string;
  prev?: PagerLink | null;
  next?: PagerLink | null;
}>("Pager", ["label", "prev", "next"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const prev = computed(() => _props["prev"]);
  const next = computed(() => _props["next"]);
  const text = useLocaleText();
  usePagerKeys(() => prev.value, () => next.value);
  return () => {
    if (!prev.value && !next.value) return null;
    return <nav aria-label={label.value} class="dk-pager mt-4 flex flex-col gap-3 print:hidden">
      <Separator variant="dashed" />
      <div class="grid gap-2 sm:grid-cols-2">
        {prev.value ? <PagerItem link={prev.value} dir="prev" /> : null}
        {next.value ? <PagerItem link={next.value} dir="next" /> : null}
      </div>
    </nav>;
  };
});
