// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentEntry } from "../core/catalog";
import { useCatalog } from "../core/catalog-context";
import { categoryAnchor } from "../core/nav";
import { Link } from "../core/router";
import { paths } from "../core/router-core";
import { List } from "@/components/ui/typography";
import { AnchorHeading, ApiTable, Callout, Chip, CodeBlock, EmptyState, InlineCode, Page, Pager, Section, StatusChip, type TocItem } from "../kit";
import { ComponentActions } from "../widgets/ComponentActions";
import { ExampleViewer } from "../widgets/ExampleViewer";
import { InstallBox } from "../widgets/InstallBox";
import { NotFoundPage } from "./NotFoundPage";
export const ComponentPage = defineUi<{
  slug: string;
}>("ComponentPage", ["slug"], (_props, {
  slots: _slots
}) => {
  const slug = computed(() => _props["slug"]);
  const catalog = useCatalog();
  const entry = computed(() => catalog.value.bySlug.get(slug.value));
  return () => {
    if (!entry.value) return <NotFoundPage what="component" missing={slug.value} />;
    return <ComponentDocPage key={entry.value.slug} entry={entry.value} />;
  };
});
const ComponentDocPage = defineUi<{
  entry: ComponentEntry;
}>("ComponentDocPage", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const catalog = useCatalog();
  const doc = computed(() => entry.value.doc);
  const examples = computed(() => entry.value.examples);
  const prev = computed(() => catalog.value.neighbours(entry.value.slug).prev);
  const next = computed(() => catalog.value.neighbours(entry.value.slug).next);
  const hero = computed(() => examples.value[0]);
  const more = computed(() => examples.value.slice(1));
  const related = computed(() => (doc.value.related ?? []).filter(slug => slug !== entry.value.slug));
  const a11y = computed(() => doc.value.a11y ?? []);
  const toc = computed<TocItem[]>(() => [...(hero.value ? [{
    id: "preview" as const,
    label: "Preview" as const
  }] : []), {
    id: "installation" as const,
    label: "Installation" as const
  }, {
    id: "usage" as const,
    label: "Usage" as const
  }, ...(more.value.length > 0 || !hero.value ? [{
    id: "examples" as const,
    label: "Examples" as const
  }] : []), {
    id: "api" as const,
    label: "API reference" as const
  }, ...(a11y.value.length > 0 ? [{
    id: "accessibility" as const,
    label: "Accessibility" as const
  }] : []), ...(related.value.length > 0 ? [{
    id: "related" as const,
    label: "Related" as const
  }] : [])]);
  return () => {
    return <Page kicker={<Link to={`${paths.components()}#${categoryAnchor(doc.value.category)}`}>{doc.value.category}</Link>} title={doc.value.title} description={doc.value.description} toc={toc.value} meta={<>
          <StatusChip status={doc.value.status} />
          {doc.value.upstream ? <Chip tone="outline">extends shadcn/ui {doc.value.upstream}</Chip> : null}
          <Chip tone="outline">
            {examples.value.length} {examples.value.length === 1 ? "example" as const : "examples" as const}
          </Chip>
          <span class="flex flex-wrap items-center gap-2 max-sm:w-full sm:ms-auto">
            <ComponentActions entry={entry.value} />
          </span>
        </>} footer={<Pager label="Previous and next component" prev={prev.value && {
      to: paths.components(prev.value.slug),
      title: prev.value.doc.title
    }} next={next.value && {
      to: paths.components(next.value.slug),
      title: next.value.doc.title
    }} />}>
      {hero.value ? <Section id="preview" title="Preview">
          <ExampleViewer entry={hero.value} slug={entry.value.slug} headingLevel={3} />
        </Section> : null}

      <Section id="installation" title="Installation">
        <InstallBox key={entry.value.slug} entry={entry.value} />
      </Section>

      <Section id="usage" title="Usage">
        {doc.value.usage ? <CodeBlock code={doc.value.usage} lang="tsx" title={`${entry.value.slug}.tsx`} /> : <p class="dk-hint">No usage snippet yet.</p>}
      </Section>

      {more.value.length > 0 || !hero.value ? <Section id="examples" title="Examples">
          {hero.value ? <div class="flex flex-col gap-12">
              {more.value.map(example => <ExampleViewer key={example.path} entry={example} slug={entry.value.slug} headingLevel={3} lazy />)}
            </div> : <EmptyState title="No examples yet">
              <p>
                Add files to <InlineCode>src/docs/examples/{entry.value.slug}/</InlineCode>; they appear here on their own.
              </p>
            </EmptyState>}
        </Section> : null}

      <Section id="api" title="API reference" description="Props listed here are in addition to those of the element each part renders.">
        {doc.value.parts.length === 0 ? <p class="dk-hint">This component has no parts documented yet.</p> : <div class="flex flex-col gap-10">
            {doc.value.parts.map(part => <div key={part.name} class="dk-part flex flex-col gap-3">
                <AnchorHeading id={`api-${part.name.toLowerCase()}`} level={3}>
                  {part.name}
                </AnchorHeading>
                {part.description ? <p class="dk-part-desc max-w-prose text-ink-soft">{part.description}</p> : null}
                {part.props && part.props.length > 0 ? <ApiTable props={part.props} caption={`${part.name} props`} /> : <p class="dk-hint">No props of its own.</p>}
              </div>)}
          </div>}
      </Section>

      {a11y.value.length > 0 ? <Section id="accessibility" title="Accessibility">
          <List class="my-0">
            {a11y.value.map(line => <li key={line}>{line}</li>)}
          </List>
        </Section> : null}

      {related.value.length > 0 ? <Section id="related" title="Related">
          <ul class="dk-inline-list flex flex-wrap gap-x-5 gap-y-2 font-bold" role="list">
            {related.value.map(slug => {
            const target = catalog.value.bySlug.get(slug);
            return <li key={slug}>
                  {target ? <Link to={paths.components(slug)}>{target.doc.title}</Link> : <>
                      <span>{slug}</span> <span class="dk-hint">(not documented yet)</span>
                    </>}
                </li>;
          })}
          </ul>
        </Section> : null}

      {catalog.value.warnings.length > 0 && import.meta.env.DEV ? <Callout tone="warn" title="Docs tree problems (development only)">
          <List class="my-0">
            {catalog.value.warnings.map(w => <li key={w}>{w}</li>)}
          </List>
        </Callout> : null}
    </Page>;
  };
});
