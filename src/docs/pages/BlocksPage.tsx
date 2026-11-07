// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useCatalog } from "../core/catalog-context";
import type { BlockEntry } from "../core/catalog";
import { addCommand } from "../core/install";
import { paths } from "../core/router-core";
import { Link } from "../core/router";
import { useSettings } from "../core/settings";
import { Callout, Chip, CodeBlock, EmptyState, InlineCode, Page, Pager, Section, Skeleton, Stage, Tabs, Tile, TileGrid } from "../kit";
import { CommandTabs } from "../widgets/CommandTabs";
import { ContentSlot } from "../widgets/ContentSlot";
import { PreviewFrame } from "../widgets/PreviewFrame";
import { useLoaded } from "../widgets/use-loaded";
import { NotFoundPage } from "./NotFoundPage";
export const BlocksIndexPage = defineUi<{}>("BlocksIndexPage", [], (_props, {
  slots: _slots
}) => {
  const catalog = useCatalog();
  return () => {
    return <Page kicker="Library" title="Blocks" description="Whole pages composed from the components: sign in, dashboards and more. Install one and edit it; it is your code.">
      {catalog.value.blocks.length === 0 ? <EmptyState title="No blocks yet">
          <p>
            A block appears here when it has files in <InlineCode>src/blocks/&lt;name&gt;/</InlineCode>. Add{" "}
            <InlineCode>src/docs/content/blocks/&lt;name&gt;.tsx</InlineCode> to show a live preview.
          </p>
        </EmptyState> : <TileGrid>
          {catalog.value.blocks.map(b => <Tile key={b.slug} to={paths.blocks(b.slug)} title={b.title} description={b.description || undefined} meta={b.tags.map(t => <Chip key={t} tone="outline" plain>
                  {t}
                </Chip>)} />)}
        </TileGrid>}
    </Page>;
  };
});
export const BlockPage = defineUi<{
  slug: string;
}>("BlockPage", ["slug"], (_props, {
  slots: _slots
}) => {
  const slug = computed(() => _props["slug"]);
  const catalog = useCatalog();
  const block = computed(() => catalog.value.blockBySlug.get(slug.value));
  return () => {
    if (!block.value) return <NotFoundPage what="block" missing={slug.value} />;
    return <BlockDocPage key={block.value.slug} block={block.value} />;
  };
});
const BlockDocPage = defineUi<{
  block: BlockEntry;
}>("BlockDocPage", ["block"], (_props, {
  slots: _slots
}) => {
  const block = computed(() => _props["block"]);
  const catalog = useCatalog();
  const index = computed(() => catalog.value.blocks.indexOf(block.value));
  const prev = computed(() => catalog.value.blocks[index.value - 1]);
  const next = computed(() => catalog.value.blocks[index.value + 1]);
  return () => {
    return <Page kicker={<Link to={paths.blocks()}>Blocks</Link>} title={block.value.title} description={block.value.description || undefined} meta={block.value.tags.map(t => <Chip key={t} tone="outline">
          {t}
        </Chip>)} toc={[{
      id: "preview" as const,
      label: "Preview" as const
    }, {
      id: "installation" as const,
      label: "Installation" as const
    }, {
      id: "files" as const,
      label: "Files" as const
    }]} footer={<Pager label="Previous and next block" prev={prev.value && {
      to: paths.blocks(prev.value.slug),
      title: prev.value.title
    }} next={next.value && {
      to: paths.blocks(next.value.slug),
      title: next.value.title
    }} />}>
      <Section id="preview" title="Preview">
        {block.value.contentKey ? <PreviewFrame>
            <Stage layout="full" height={520} label={`${block.value.title} preview`} surface={block.value.surface}>
              <ContentSlot contentKey={block.value.contentKey} />
            </Stage>
          </PreviewFrame> : <Callout tone="todo" title="No live preview yet">
            <p>
              Add <InlineCode>src/docs/content/blocks/{block.value.slug}.tsx</InlineCode> that default-exports the block to see it here.
            </p>
          </Callout>}
      </Section>

      <Section id="installation" title="Installation">
        <BlockInstall block={block.value} />
      </Section>

      <Section id="files" title="Files">
        <BlockFiles block={block.value} />
      </Section>
    </Page>;
  };
});
const BlockInstall = defineUi<{
  block: BlockEntry;
}>("BlockInstall", ["block"], (_props, {
  slots: _slots
}) => {
  const block = computed(() => _props["block"]);
  const _hook1 = useSettings();
  const packageManager = computed(() => _hook1.value.packageManager);
  return () => {
    return <>
      <CommandTabs command={pm => addCommand(pm, block.value.slug)} />
      <p class="dk-hint">
        Installs under <InlineCode>components/blocks/{block.value.slug}/</InlineCode> together with the components it uses. Not registered yet? See{" "}
        <Link to={`${paths.gettingStarted}#registry`}>Getting started</Link>, or use <InlineCode>{addCommand(packageManager.value, block.value.slug, "url")}</InlineCode>.
      </p>
    </>;
  };
});
const BlockFiles = defineUi<{
  block: BlockEntry;
}>("BlockFiles", ["block"], (_props, {
  slots: _slots
}) => {
  const block = computed(() => _props["block"]);
  return () => {
    if (block.value.files.length === 0) return <p class="dk-hint">No source files found in this build.</p>;
    return <Tabs label={`${block.value.title} files`} items={block.value.files.map(file => ({
      id: file.path,
      label: file.path,
      content: () => <BlockFileSource block={block.value.slug} file={file} />
    }))} />;
  };
});
const BlockFileSource = defineUi<{
  block: string;
  file: BlockEntry["files"][number];
}>("BlockFileSource", ["block", "file"], (_props, {
  slots: _slots
}) => {
  const block = computed(() => _props["block"]);
  const file = computed(() => _props["file"]);
  const state = useLoaded(() => file.value.source);
  return () => {
    if (state.value.status === "loading") return <Skeleton height={120} label="Loading source" />;
    if (state.value.status === "error") return <Callout tone="error">{state.value.error.message}</Callout>;
    const lang = file.value.path.split(".").pop();
    return <CodeBlock code={state.value.value} lang={lang} title={`blocks/${block.value}/${file.value.path}`} lineNumbers maxHeight={560} />;
  };
});
