// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import type { ComponentEntry } from "../core/catalog";
import { useCatalog } from "../core/catalog-context";
import { categoryAnchor } from "../core/nav";
import { Link, navigate, useAnchorHref } from "../core/router";
import { paths } from "../core/router-core";
import { buildSearchIndex, search } from "../core/search";
import { Button, Chip, EmptyState, InlineCode, SearchInput, Section, StatusChip } from "../kit";
import { THUMBS } from "./home/thumbs.generated";
const BASE = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const TAPE = "after:pointer-events-none after:absolute after:-top-2.5 after:left-1/2 after:h-5 after:w-14 after:-translate-x-1/2 after:-rotate-3 after:border-y after:border-tape-edge after:bg-[color-mix(in_srgb,var(--ll-kraft)_70%,transparent)] after:content-['']";
const Picture = defineUi<{
  entry: ComponentEntry;
}>("Picture", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const thumb = computed(() => THUMBS[entry.value.slug]);
  const failed = shallowRef(initialState(false));
  const setFailed = stateSetter(failed);
  return () => {
    return <span class={`relative block bg-photo p-1.5 shadow-[0_1px_0_rgb(var(--ll-shade)/0.25),1px_2px_0_rgb(var(--ll-shade)/0.12)] ${TAPE}`}>
      <span class="block aspect-[16/10] overflow-hidden bg-graph">
        {thumb.value && !failed.value ? <img src={`${BASE}thumbs/${thumb.value.file}`} width={thumb.value.w} height={thumb.value.h} loading="lazy" decoding="async" alt="" onError={() => setFailed(true)} class="size-full object-cover object-top transition-transform duration-(--ll-dur-sheet) ease-out group-hover:scale-[1.03]" /> : <span aria-hidden="true" class="grid size-full place-items-center font-script text-5xl font-bold text-ink-muted">
            {entry.value.doc.title.slice(0, 1)}
          </span>}
      </span>
    </span>;
  };
});
const GalleryTile = defineUi<{
  entry: ComponentEntry;
}>("GalleryTile", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  return () => {
    return <li class="min-w-0 [--tilt:-0.5deg] nth-[3n+2]:[--tilt:0.45deg] nth-[3n]:[--tilt:-0.15deg]">
      <Link to={paths.components(entry.value.slug)} class="group relative isolate flex h-full flex-col gap-3 p-3 pb-4 text-ink no-underline">
        <span aria-hidden="true" class="absolute inset-0 -z-10 rotate-(--tilt) border-[1.5px] border-pencil-mark bg-slip shadow-[2px_3px_0_rgb(var(--ll-shade)/0.16)] transition-[rotate,translate,box-shadow,background-color] duration-(--ll-dur-hover) ease-out [border-radius:3px_7px_4px_8px/8px_3px_7px_3px] group-hover:-translate-y-0.5 group-hover:rotate-0 group-hover:bg-[color-mix(in_oklab,var(--ll-hi)_16%,var(--ll-slip))] group-hover:shadow-[3px_6px_0_rgb(var(--ll-shade)/0.2)] group-focus-visible:rotate-0" />
        <Picture entry={entry.value} />
        <span class="font-script text-2xl leading-[1.1] font-bold">{entry.value.doc.title}</span>
        <span class="line-clamp-2 text-[15px] leading-snug text-ink-soft">{entry.value.doc.description}</span>
        <span class="mt-auto flex flex-wrap gap-1.5 pt-1 empty:hidden">
          <StatusChip status={entry.value.doc.status} plain />
          {entry.value.doc.upstream ? <Chip tone="outline" plain>
              shadcn: {entry.value.doc.upstream}
            </Chip> : null}
        </span>
      </Link>
    </li>;
  };
});
const Grid = defineUi<{
  entries: readonly ComponentEntry[];
}>("Grid", ["entries"], (_props, {
  slots: _slots
}) => {
  const entries = computed(() => _props["entries"]);
  return () => {
    return <ul role="list" class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(15.5rem,100%),1fr))] gap-x-7 gap-y-9 p-0 pt-3">
      {entries.value.map(entry => <GalleryTile key={entry.slug} entry={entry} />)}
    </ul>;
  };
});
const Jump = defineUi<{
  id: string;
  children: UI.VueNode;
}>("Jump", ["id"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const children = renderValue(() => readSlot(_slots.default));
  const _nestedHook0 = useAnchorHref(() => id.value);
  return () => {
    return <a class="dk-chip-link" href={_nestedHook0.value}>
      {readSlot(_slots.default)}
    </a>;
  };
});
const ComponentsGallery = defineUi<{}>("ComponentsGallery", [], (_props, {
  slots: _slots
}) => {
  const catalog = useCatalog();
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const index = computed(() => buildSearchIndex(catalog.value).filter(e => e.kind === "component"));
  const trimmed = computed(() => query.value.trim());
  const matches = computed(() => {
    if (!trimmed.value) return [];
    return search(index.value, trimmed.value, 200).map(r => catalog.value.bySlug.get(r.entry.id.replace(/^component:/, ""))).filter((c): c is ComponentEntry => Boolean(c));
  });
  return () => {
    if (catalog.value.components.length === 0) {
      return <EmptyState title="No components yet">
        <p>
          A component shows up when it has a <InlineCode>src/docs/meta/&lt;slug&gt;.ts</InlineCode> file. Its picture comes from <InlineCode>node tools/make-thumbs.mjs</InlineCode>.
        </p>
      </EmptyState>;
    }
    const surprise = () => {
      const pick = catalog.value.components[Math.floor(Math.random() * catalog.value.components.length)];
      if (pick) navigate(paths.components(pick.slug));
    };
    return <>
      <div class="flex flex-wrap items-center gap-3">
        <SearchInput label="Filter components" placeholder="Filter components..." value={query.value} onChange={e => setQuery(e.target.value)} class="max-w-sm min-w-56 flex-1" />
        <Button onClick={surprise}>Surprise me</Button>
      </div>

      {trimmed.value ? <div class="mt-6">
          <p role="status" class="dk-hint">
            {matches.value.length === 0 ? `No component matches "${trimmed.value}".` : `${matches.value.length} ${matches.value.length === 1 ? "match" as const : "matches" as const}`}
          </p>
          {matches.value.length > 0 ? <Grid entries={matches.value} /> : null}
        </div> : <>
          <nav aria-label="Categories">
            <ul class="dk-chips" role="list">
              {catalog.value.groups.map(g => <li key={g.category}>
                  <Jump id={categoryAnchor(g.category)}>
                    {g.category} <Chip tone="count">{g.items.length}</Chip>
                  </Jump>
                </li>)}
            </ul>
          </nav>
          {catalog.value.groups.map(group => <Section key={group.category} id={categoryAnchor(group.category)} title={group.category} actions={<Chip tone="count">{group.items.length}</Chip>}>
              <Grid entries={group.items} />
            </Section>)}
        </>}
    </>;
  };
});
export default ComponentsGallery;
