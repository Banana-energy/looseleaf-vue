// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { FOUNDATIONS, FOUNDATION_BY_SLUG, type FoundationTopic } from "../core/foundations";
import { Link } from "../core/router";
import { paths } from "../core/router-core";
import { Callout, Page, Pager, Prose, Section, Tile, TileGrid } from "../kit";
import { ContentSlot } from "../widgets/ContentSlot";
import { NotFoundPage } from "./NotFoundPage";
export const FoundationsIndexPage = defineUi<{}>("FoundationsIndexPage", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Page kicker="Foundations" title="Foundations" description="The ideas the components are built on. Each page is a short brief; the longer versions are drawn as they are written.">
      <TileGrid>
        {FOUNDATIONS.map(t => <Tile key={t.slug} to={paths.foundations(t.slug)} title={t.title} description={t.summary} />)}
      </TileGrid>
    </Page>;
  };
});
export const FoundationPage = defineUi<{
  topic: string;
}>("FoundationPage", ["topic"], (_props, {
  slots: _slots
}) => {
  const topic = computed(() => _props["topic"]);
  const entry = computed(() => FOUNDATION_BY_SLUG.get(topic.value));
  return () => {
    if (!entry.value) return <NotFoundPage what="foundation" missing={topic.value} />;
    const index = FOUNDATIONS.indexOf(entry.value);
    const prev = FOUNDATIONS[index - 1];
    const next = FOUNDATIONS[index + 1];
    return <Page kicker={<Link to={paths.foundations()}>Foundations</Link>} title={entry.value.title} description={entry.value.summary} toc="auto" footer={<Pager label="Previous and next foundation" prev={prev && {
      to: paths.foundations(prev.slug),
      title: prev.title
    }} next={next && {
      to: paths.foundations(next.slug),
      title: next.title
    }} />}>
      <ContentSlot contentKey={`foundations/${entry.value.slug}`} fallback={<Placeholder topic={entry.value} />} />
    </Page>;
  };
});
const Placeholder = defineUi<{
  topic: FoundationTopic;
}>("Placeholder", ["topic"], (_props, {
  slots: _slots
}) => {
  const topic = computed(() => _props["topic"]);
  return () => {
    return <>
      <Callout tone="todo" title="This page is still being drawn">
        <p>Here is the short version. The illustrated page replaces it when it is ready.</p>
      </Callout>

      <Section id="in-brief" title="In brief">
        <Prose>
          <ul>
            {topic.value.facts.map(fact => <li key={fact}>{fact}</li>)}
          </ul>
        </Prose>
      </Section>

      {topic.value.swatches ? <Section id="swatches" title="Palette" description="Drawn live from the tokens in the loaded stylesheet.">
          <ul class="dk-swatches grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4" role="list">
            {topic.value.swatches.map(s => <li key={s.token} class="dk-swatch flex flex-col gap-1">
                <span class="dk-swatch-chip block h-14 shadow-[inset_0_0_0_1.5px_var(--ll-pencil-mark)] [border-radius:3px_8px_4px_9px/8px_3px_9px_4px]" style={cssStyle({
              background: `var(${s.token})`
            })} aria-hidden="true" />
                <span class="dk-swatch-label font-bold">{s.label}</span>
                <code class="dk-swatch-token font-mono text-[0.8125rem] text-ink-muted">{s.token}</code>
              </li>)}
          </ul>
        </Section> : null}

      {topic.value.fonts ? <Section id="faces" title="Faces">
          <ul class="dk-specimens flex flex-col gap-5" role="list">
            {topic.value.fonts.map(f => <li key={f.token} class="dk-specimen flex flex-col gap-1 border-b border-dashed border-pencil-mark/60 pb-4">
                <span class="dk-specimen-text text-3xl leading-tight" style={cssStyle({
              fontFamily: `var(${f.token})`
            })}>
                  Sphinx of black quartz, judge my vow
                </span>
                <span class="dk-specimen-meta text-[15px] text-ink-soft">
                  {f.label} <span class="dk-hint">{f.role}</span> <code class="font-mono text-[0.8125rem]">{f.token}</code>
                </span>
              </li>)}
          </ul>
        </Section> : null}

      {topic.value.see ? <Section id="see-also" title="See also">
          <ul class="dk-inline-list flex flex-wrap gap-x-5 gap-y-2 font-bold" role="list">
            {topic.value.see.map(s => <li key={s.to}>
                <Link to={s.to}>{s.label}</Link>
              </li>)}
          </ul>
        </Section> : null}
    </>;
  };
});
