// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useCatalog } from "../core/catalog-context";
import { addCommand } from "../core/install";
import { categoryAnchor } from "../core/nav";
import { FOUNDATIONS } from "../core/foundations";
import { paths } from "../core/router-core";
import { useSettings } from "../core/settings";
import { ButtonLink, Chip, CodeBlock, EmptyState, Page, Section, StatusChip, Tile, TileGrid } from "../kit";
import { ContentSlot, useHasContent } from "../widgets/ContentSlot";
import { Link } from "../core/router";
export const HomePage = defineUi<{}>("HomePage", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ContentSlot contentKey="home" fallback={<DefaultHome />} />;
  };
});
const PRINCIPLES = [{
  title: "Drop-in" as const,
  text: "Same part names, props and data-slot values as shadcn/ui, on Reka UI. Swap a file, keep your JSX." as const
}, {
  title: "Drawn, not styled" as const,
  text: "Lines have pressure, fills sit inside their outlines, paper has tooth. Every stroke is seeded, so server and client draw the same thing." as const
}, {
  title: "Practical" as const,
  text: "Keyboard support, AA text, real focus rings, reduced motion, three densities. Charm is a dial you can turn down." as const
}] as const;
const DefaultHome = defineUi<{}>("DefaultHome", [], (_props, {
  slots: _slots
}) => {
  const catalog = useCatalog();
  const _hook1 = useSettings();
  const packageManager = computed(() => _hook1.value.packageManager);
  const hasArt = useHasContent(() => "home-hero");
  const fresh = computed(() => catalog.value.components.filter(c => c.doc.status === "new"));
  const showNew = computed(() => fresh.value.length >= 3);
  const featured = computed(() => (showNew.value ? fresh.value : catalog.value.components).slice(0, 6));
  return () => {
    return <Page kicker="shadcn/ui, drawn by hand" title="Looseleaf" description="A shadcn registry of real, accessible Vue components that look like paper, felt-tip, marker and tape. Same APIs as shadcn/ui, a notebook for a skin." meta={<>
          <ButtonLink to={paths.gettingStarted} variant="primary" size="lg">
            Get started
          </ButtonLink>
          <ButtonLink to={paths.components()} size="lg">
            Browse components
          </ButtonLink>
        </>}>
      {hasArt.value ? <div class="dk-hero-art">
          <ContentSlot contentKey="home-hero" />
        </div> : null}

      <CodeBlock code={addCommand(packageManager.value, "looseleaf")} lang="bash" title="Everything, in one line" />

      <dl class="dk-stats grid grid-cols-3 gap-4 text-center">
        {[["Components", catalog.value.components.length], ["Blocks", catalog.value.blocks.length], ["Foundations", FOUNDATIONS.length]].map(([label, value]) => <div key={label} class="flex flex-col-reverse items-center gap-1">
            <dt class="font-type text-xs text-ink-muted">{label}</dt>
            <dd class="ll-num font-script text-5xl leading-none font-bold text-ink-you">{value}</dd>
          </div>)}
      </dl>

      <Section id="principles" title="What you get">
        <ul class="dk-principles grid gap-x-8 gap-y-5 sm:grid-cols-3" role="list">
          {PRINCIPLES.map(p => <li key={p.title}>
              <h3 class="font-script text-2xl leading-tight font-bold">{p.title}</h3>
              <p class="mt-1 text-[15px] leading-snug text-ink-soft">{p.text}</p>
            </li>)}
        </ul>
      </Section>

      <Section id="components" title={showNew.value ? "New and noteworthy" as const : "Components" as const}>
        {catalog.value.components.length === 0 ? <EmptyState title="The library is still being drawn">
            <p>
              Components appear here as their docs are written. Meanwhile, read <Link to={paths.gettingStarted}>how installation works</Link>.
            </p>
          </EmptyState> : <>
            <TileGrid>
              {featured.value.map(c => <Tile key={c.slug} to={paths.components(c.slug)} title={c.doc.title} description={c.doc.description} meta={<StatusChip status={c.doc.status} plain />} />)}
            </TileGrid>
            <ul class="dk-chips mt-2" role="list" aria-label="Categories">
              {catalog.value.groups.map(g => <li key={g.category}>
                  <Link to={`${paths.components()}#${categoryAnchor(g.category)}`} class="dk-chip-link">
                    {g.category}{" "}
                    <Chip tone="count" plain>
                      {g.items.length}
                    </Chip>
                  </Link>
                </li>)}
            </ul>
          </>}
      </Section>

      <Section id="foundations" title="Foundations" description="The ideas underneath: ink, paper, motion, density.">
        <TileGrid>
          {FOUNDATIONS.slice(0, 6).map(t => <Tile key={t.slug} to={paths.foundations(t.slug)} title={t.title} description={t.summary} />)}
        </TileGrid>
      </Section>
    </Page>;
  };
});
