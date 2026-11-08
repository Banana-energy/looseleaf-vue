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
import { localizedBlockDescription, localizedBlockTitle, localizedTag } from "../core/i18n";
export const BlocksIndexPage = defineUi<{}>("BlocksIndexPage", [], (_props, {
  slots: _slots
}) => {
  const catalog = useCatalog();
  const text = useSettings();
  return () => {
    const zh = text.value.locale === "zh-CN";
    return <Page kicker={text.value.locale === "zh-CN" ? "组件库" : "Library"} title={text.value.locale === "zh-CN" ? "区块" : "Blocks"} description={text.value.locale === "zh-CN" ? "由组件组合而成的完整页面：登录页、仪表盘以及更多界面。安装后即可继续编辑。" : "Whole pages composed from the components: sign in, dashboards and more. Install one and edit it; it is your code."}>
      {catalog.value.blocks.length === 0 ? <EmptyState title={text.value.locale === "zh-CN" ? "暂无区块" : "No blocks yet"}>
          <p>
            {zh ? <>区块在 <InlineCode>src/blocks/&lt;name&gt;/</InlineCode> 中包含文件后会出现在这里；添加 <InlineCode>src/docs/content/blocks/&lt;name&gt;.tsx</InlineCode> 即可显示实时预览。</> : <>A block appears here when it has files in <InlineCode>src/blocks/&lt;name&gt;/</InlineCode>. Add <InlineCode>src/docs/content/blocks/&lt;name&gt;.tsx</InlineCode> to show a live preview.</>}
          </p>
        </EmptyState> : <TileGrid>
          {catalog.value.blocks.map(b => <Tile key={b.slug} to={paths.blocks(b.slug)} title={localizedBlockTitle(text.value.locale, b.slug, b.title)} description={localizedBlockDescription(text.value.locale, b.slug, b.title, b.description)} meta={b.tags.map(t => <Chip key={t} tone="outline" plain>
                  {localizedTag(text.value.locale, t)}
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
  const text = useSettings();
  return () => {
    const zh = text.value.locale === "zh-CN";
    const title = localizedBlockTitle(text.value.locale, block.value.slug, block.value.title);
    return <Page kicker={<Link to={paths.blocks()}>{text.value.locale === "zh-CN" ? "区块" : "Blocks"}</Link>} title={title} description={localizedBlockDescription(text.value.locale, block.value.slug, block.value.title, block.value.description)} meta={block.value.tags.map(t => <Chip key={t} tone="outline">
          {localizedTag(text.value.locale, t)}
        </Chip>)} toc={[{
      id: "preview" as const,
      label: text.value.locale === "zh-CN" ? "预览" : "Preview"
    }, {
      id: "installation" as const,
      label: text.value.locale === "zh-CN" ? "安装" : "Installation"
    }, {
      id: "files" as const,
      label: text.value.locale === "zh-CN" ? "文件" : "Files"
    }]} footer={<Pager label={text.value.locale === "zh-CN" ? "上一区块和下一区块" : "Previous and next block"} prev={prev.value && {
      to: paths.blocks(prev.value.slug),
      title: prev.value.title
    }} next={next.value && {
      to: paths.blocks(next.value.slug),
      title: next.value.title
    }} />}>
      <Section id="preview" title={text.value.locale === "zh-CN" ? "预览" : "Preview"}>
        {block.value.contentKey ? <PreviewFrame>
            <Stage layout="full" height={520} label={`${title} ${text.value.locale === "zh-CN" ? "预览" : "preview"}`} surface={block.value.surface}>
              <ContentSlot contentKey={block.value.contentKey} />
            </Stage>
          </PreviewFrame> : <Callout tone="todo" title={zh ? "暂无实时预览" : "No live preview yet"}>
            <p>{text.value.locale === "zh-CN" ? <>添加默认导出区块的 <InlineCode>src/docs/content/blocks/{block.value.slug}.tsx</InlineCode> 文件，即可在这里看到预览。</> : <>Add <InlineCode>src/docs/content/blocks/{block.value.slug}.tsx</InlineCode> that default-exports the block to see it here.</>}</p>
          </Callout>}
      </Section>

      <Section id="installation" title={text.value.locale === "zh-CN" ? "安装" : "Installation"}>
        <BlockInstall block={block.value} />
      </Section>

      <Section id="files" title={text.value.locale === "zh-CN" ? "文件" : "Files"}>
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
  const text = _hook1;
  return () => {
    return <>
      <CommandTabs command={pm => addCommand(pm, block.value.slug)} />
      <p class="dk-hint">
        {text.value.locale === "zh-CN" ? <>会安装到 <InlineCode>components/blocks/{block.value.slug}/</InlineCode>，并一并安装它使用的组件。还没有注册命名空间？请查看<Link to={`${paths.gettingStarted}#registry`}>快速开始</Link>，或使用 <InlineCode>{addCommand(packageManager.value, block.value.slug, "url")}</InlineCode>。</> : <>Installs under <InlineCode>components/blocks/{block.value.slug}/</InlineCode> together with the components it uses. Not registered yet? See <Link to={`${paths.gettingStarted}#registry`}>Getting started</Link>, or use <InlineCode>{addCommand(packageManager.value, block.value.slug, "url")}</InlineCode>.</>}
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
  const text = useSettings();
  return () => {
    if (block.value.files.length === 0) return <p class="dk-hint">{text.value.locale === "zh-CN" ? "当前构建中没有找到源码文件。" : "No source files found in this build."}</p>;
    const title = localizedBlockTitle(text.value.locale, block.value.slug, block.value.title);
    return <Tabs label={`${title} ${text.value.locale === "zh-CN" ? "文件" : "files"}`} items={block.value.files.map(file => ({
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
  const text = useSettings();
  return () => {
    if (state.value.status === "loading") return <Skeleton height={120} label={text.value.locale === "zh-CN" ? "正在加载源码" : "Loading source"} />;
    if (state.value.status === "error") return <Callout tone="error">{state.value.error.message}</Callout>;
    const lang = file.value.path.split(".").pop();
    return <CodeBlock code={state.value.value} lang={lang} title={`blocks/${block.value}/${file.value.path}`} lineNumbers maxHeight={560} />;
  };
});
