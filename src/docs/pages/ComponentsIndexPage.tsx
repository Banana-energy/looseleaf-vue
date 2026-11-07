// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { useCatalog } from "../core/catalog-context";
import { categoryAnchor } from "../core/nav";
import { paths } from "../core/router-core";
import { buildSearchIndex, search } from "../core/search";
import type { ComponentEntry } from "../core/catalog";
import { Chip, EmptyState, InlineCode, Page, SearchInput, Section, StatusChip, Tile, TileGrid } from "../kit";
import { ContentSlot } from "../widgets/ContentSlot";
import { useLocaleText } from "../core/settings";
import { categoryLabel, localizedComponentDescription, localizedComponentTitle } from "../core/i18n";
const ComponentTile = defineUi<{
  entry: ComponentEntry;
}>("ComponentTile", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const text = useLocaleText();
  return () => {
    return <Tile to={paths.components(entry.value.slug)} title={localizedComponentTitle(text.value.locale, entry.value.doc)} description={localizedComponentDescription(text.value.locale, entry.value.doc)} meta={<>
          <StatusChip status={entry.value.doc.status} plain />
          {entry.value.doc.upstream ? <Chip tone="outline" plain>
              shadcn: {entry.value.doc.upstream}
            </Chip> : null}
        </>} />;
  };
});
export const ComponentsIndexPage = defineUi<{}>("ComponentsIndexPage", [], (_props, {
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
  const empty = computed(() => catalog.value.components.length === 0);
  const text = useLocaleText();
  return () => {
    const zh = text.value.locale === "zh-CN";
    return <Page kicker={text.value.t("page.library")} title={text.value.t("nav.components")} description={empty.value ? text.value.locale === "zh-CN" ? "组件库仍在持续完善，组件会随着文档编写逐步出现。" : "The library is still being drawn. Components appear here as their docs are written." : text.value.locale === "zh-CN" ? `${catalog.value.components.length} 个组件，分为 ${catalog.value.groups.length} 个分类，每个组件都提供实时示例、源码和 API 表格。` : `${catalog.value.components.length} components in ${catalog.value.groups.length} categories, each with live examples, code and API tables.`} toc={empty.value || trimmed.value ? undefined : catalog.value.groups.map(g => ({
      id: categoryAnchor(g.category),
      label: categoryLabel(text.value.locale, g.category)
    }))}>
      {empty.value ? <EmptyState title={text.value.t("nav.noComponents")}>
          <p>
            {zh ? <>组件拥有 <InlineCode>src/docs/meta/&lt;slug&gt;.ts</InlineCode> 文件后会出现在这里，<InlineCode>src/docs/examples/&lt;slug&gt;/</InlineCode> 中的示例会自动收录。</> : <>A component shows up when it has a <InlineCode>src/docs/meta/&lt;slug&gt;.ts</InlineCode> file. Its examples in{" "}<InlineCode>src/docs/examples/&lt;slug&gt;/</InlineCode> are picked up automatically.</>}
          </p>
        </EmptyState> : <ContentSlot contentKey="components-gallery" fallback={<>
                  <SearchInput label={text.value.t("page.filterComponents")} placeholder={text.value.t("page.filterComponents")} value={query.value} onChange={e => setQuery(e.target.value)} class="dk-filter max-w-md" />
              {trimmed.value ? <div class="dk-results flex flex-col gap-4">
                  <p role="status" class="dk-hint">
                    {matches.value.length === 0 ? (text.value.locale === "zh-CN" ? `没有匹配“${trimmed.value}”的组件。` : `No component matches "${trimmed.value}".`) : text.value.locale === "zh-CN" ? `找到 ${matches.value.length} 个匹配项` : `${matches.value.length} ${matches.value.length === 1 ? "match" as const : "matches" as const}`}
                  </p>
                  {matches.value.length > 0 ? <TileGrid>
                      {matches.value.map(entry => <ComponentTile key={entry.slug} entry={entry} />)}
                    </TileGrid> : null}
                </div> : catalog.value.groups.map(group => <Section key={group.category} id={categoryAnchor(group.category)} title={categoryLabel(text.value.locale, group.category)} actions={<Chip tone="count" plain>{group.items.length}</Chip>}>
                    <TileGrid>
                      {group.items.map(entry => <ComponentTile key={entry.slug} entry={entry} />)}
                    </TileGrid>
                  </Section>)}
            </>} />}
    </Page>;
  };
});
