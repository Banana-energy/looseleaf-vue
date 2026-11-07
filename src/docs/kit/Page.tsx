// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { Page as PageSheet, PageContent, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { Paper } from "@/components/ui/paper";
import { useAnchorHref } from "../core/router";
import { cx } from "./cx";
export interface TocItem {
  id: string;
  label: string;
}
export interface PageProps {
  kicker?: UI.VueNode;
  title: string;
  description?: UI.VueNode;
  meta?: UI.VueNode;
  toc?: readonly TocItem[] | "auto";
  children?: UI.VueNode;
  footer?: UI.VueNode;
  className?: string;
}
export const Page = defineUi<PageProps>("Page", ["kicker", "title", "description", "meta", "toc", "footer", "class"], (_props, {
  slots: _slots
}) => {
  const kicker = computed(() => _props["kicker"]);
  const title = computed(() => _props["title"]);
  const description = computed(() => _props["description"]);
  const meta = computed(() => _props["meta"]);
  const toc = computed(() => _props["toc"]);
  const children = renderValue(() => readSlot(_slots.default));
  const footer = computed(() => _props["footer"]);
  const className = computed(() => _props["class"]);
  const article = shallowRef<HTMLElement | null>(null);
  // 使用 elementRef 将组件 ref 回调解包为真实 DOM，目录扫描需要调用 querySelectorAll。
  const articleRef = elementRef<HTMLElement>(element => {
    article.value = element;
  });
  const found = useHeadings(() => toc.value === "auto", () => article);
  const items = computed(() => toc.value === "auto" ? found.value : toc.value);
  return () => {
    return <div data-slot="docs-page" class={cx("mx-auto flex w-full max-w-[72rem] items-start justify-center gap-8", className.value)}>
      <PageSheet as="article" rootRef={articleRef} width="lg" tape="top" tilt={false} class="dk-article min-w-0 flex-1 gap-10">
        <PageHeader class="gap-3">
          {kicker.value ? <p class="dk-kicker font-type text-sm text-ink-muted [&_a]:underline-offset-4 [&_a]:hover:underline">{kicker.value}</p> : null}
          <PageTitle underline="highlight" tabindex={-1} class="dk-title text-[2.6rem] outline-offset-4 sm:text-5xl">
            {title.value}
          </PageTitle>
          {description.value ? <PageDescription class="dk-lede text-lg leading-snug text-ink-soft">{description.value}</PageDescription> : null}
          {meta.value ? <div class="dk-page-meta mt-1 flex flex-wrap items-center gap-2">{meta.value}</div> : null}
        </PageHeader>
        <PageContent class="gap-10">{readSlot(_slots.default)}</PageContent>
        {footer.value}
      </PageSheet>
      {items.value && items.value.length > 1 ? <TableOfContents items={items.value} /> : null}
    </div>;
  };
});
const sameItems = (a: readonly TocItem[], b: readonly TocItem[]) => a.length === b.length && a.every((item, i) => item.id === b[i]!.id && item.label === b[i]!.label);
function useHeadings(_source0: MaybeRefOrGetter<boolean>, _source1: MaybeRefOrGetter<UI.RefObject<HTMLElement | null>>): ComputedRef<readonly TocItem[]> {
  const enabled = computed(() => toValue(_source0));
  const root = computed(() => toValue(_source1));
  const items = shallowRef<readonly TocItem[]>(initialState([]));
  const setItems = stateSetter(items);
  watchDependencies(() => {
    const el = root.value.value;
    if (!enabled.value || !el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const scan = () => {
      const next = Array.from(el.querySelectorAll<HTMLElement>('[data-slot="page-content"] h2[id]')).filter(h => !h.closest('[data-slot="stage"]')).map(h => ({
        id: h.id,
        label: (h.textContent ?? "").trim()
      })).filter(item => item.label);
      setItems(prev => sameItems(prev, next) ? prev : next);
    };
    scan();
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(scan, 120);
    });
    observer.observe(el, {
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, () => [enabled.value, root.value], false);
  return computed(() => {
    return items.value;
  });
}
function useActiveHeading(_source0: MaybeRefOrGetter<readonly string[]>): ComputedRef<string | null> {
  const ids = computed(() => toValue(_source0));
  const active = shallowRef<string | null>(initialState(null));
  const setActive = stateSetter(active);
  const key = computed(() => ids.value.join("|"));
  watchDependencies(() => {
    const list = key.value ? key.value.split("|") : [];
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current: string | null = null;
      let measured = false;
      for (const id of list) {
        const box = document.getElementById(id)?.getBoundingClientRect();
        if (!box) continue;
        if (box.width > 0 || box.height > 0) measured = true;
        if (box.top <= 120) current = id;
      }
      if (measured) setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, {
      passive: true
    });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, () => [key.value], false);
  return computed(() => {
    return active.value;
  });
}
export const TableOfContents = defineUi<{
  items: readonly TocItem[];
}>("TableOfContents", ["items"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  const active = useActiveHeading(() => items.value.map(item => item.id));
  return () => {
    return <div data-slot="docs-toc" class="dk-toc sticky top-24 hidden w-56 shrink-0 xl:block">
      <Paper as="nav" aria-label="On this page" stock="slip" tape="corner" tilt={1} rules="none" class="px-4 pt-5 pb-4">
        <p class="dk-toc-title font-type text-xs text-ink-muted">On this page</p>
        <ul role="list" class="-mx-1 mt-2 flex max-h-[calc(100dvh-14rem)] flex-col overflow-y-auto px-1">
          {items.value.map(item => <li key={item.id}>
              <TocLink id={item.id} current={active.value === item.id}>
                {item.label}
              </TocLink>
            </li>)}
        </ul>
      </Paper>
    </div>;
  };
});
const TocLink = defineUi<{
  id: string;
  current: boolean;
  children: UI.VueNode;
}>("TocLink", ["id", "current"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const current = computed(() => _props["current"]);
  const children = renderValue(() => readSlot(_slots.default));
  const _nestedHook0 = useAnchorHref(() => id.value);
  return () => {
    return <a href={_nestedHook0.value} aria-current={current.value ? "location" as const : undefined} class="dk-toc-link block px-1.5 py-1 font-script text-xl leading-tight text-ink-you hover:ll-swipe hover:text-ink aria-[current=location]:ll-swipe aria-[current=location]:font-bold aria-[current=location]:text-ink">
      {readSlot(_slots.default)}
    </a>;
  };
});
