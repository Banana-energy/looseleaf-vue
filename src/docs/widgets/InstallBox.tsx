// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ComponentEntry } from "../core/catalog";
import { useCatalog } from "../core/catalog-context";
import { addCommand, inferDependencies, packagesCommand, registryInfo, type InferredDeps } from "../core/install";
import { Link } from "../core/router";
import { paths } from "../core/router-core";
import { useLocaleText, useSettings } from "../core/settings";
import { Chip, CodeBlock, InlineCode, Tabs } from "../kit";
import { CommandTabs } from "./CommandTabs";
import { useLoaded } from "./use-loaded";
export interface InstallInfo extends InferredDeps {
  files: string[];
  source: "registry" | "source" | "none";
}
const NONE: InstallInfo = {
  dependencies: [],
  registryDependencies: [],
  files: [],
  source: "none" as const
};
export function useInstallInfo(_source0: MaybeRefOrGetter<ComponentEntry>): ComputedRef<{
  info: InstallInfo;
  source: string | null;
  loading: boolean;
}> {
  const entry = computed(() => toValue(_source0));
  const catalog = useCatalog();
  const registry = useLoaded(() => catalog.value.registry);
  const ui = useLoaded(() => entry.value.uiSource);
  const registryReady = computed(() => catalog.value.registry === null || registry.value.status !== "loading");
  const uiReady = computed(() => entry.value.uiSource === null || ui.value.status !== "loading");
  const _nestedHook0 = computed(() => {
    const source = ui.value.status === "ready" ? ui.value.value : null;
    const fromRegistry = registry.value.status === "ready" ? registryInfo(registry.value.value, entry.value.slug) : null;
    let info: InstallInfo = NONE;
    if (fromRegistry) info = {
      ...fromRegistry,
      source: "registry" as const
    };else if (source) info = {
      ...inferDependencies(source),
      files: entry.value.uiPath ? [entry.value.uiPath] : [],
      source: "source" as const
    };
    return {
      info,
      source,
      loading: !(registryReady.value && uiReady.value)
    };
  });
  return computed(() => {
    return _nestedHook0.value;
  });
}
const HINT = "my-2 text-[15px] text-muted-foreground";
export const InstallBox = defineUi<{
  entry: ComponentEntry;
}>("InstallBox", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const _hook1 = useSettings();
  const packageManager = computed(() => _hook1.value.packageManager);
  const _hook3 = useInstallInfo(() => entry.value);
  const info = computed(() => _hook3.value.info);
  const source = computed(() => _hook3.value.source);
  const loading = computed(() => _hook3.value.loading);
  const catalog = useCatalog();
  const slug = computed(() => entry.value.slug);
  const dependsOn = computed(() => info.value.registryDependencies.filter(name => name !== "looseleaf-theme"));
  const text = useLocaleText();
  const zh = computed(() => text.value.locale === "zh-CN");
  return () => {
    return <div class="dk-install min-w-0">
      <Tabs label={zh.value ? "安装方式" : "Installation method"} items={[{
        id: "cli" as const,
        label: zh.value ? "命令行" as const : "CLI" as const,
        content: () => <div class="dk-install-panel flex flex-col gap-2 pt-3">
                <CommandTabs command={pm => addCommand(pm, slug.value)} />
                <p class={HINT}>
                  {zh.value ? <>需要先添加一次 <InlineCode>@looseleaf</InlineCode> 注册表，详见<Link to={`${paths.gettingStarted}#registry`}>快速开始</Link>。如果不添加注册表，可以使用 </> : <>Needs the <InlineCode>@looseleaf</InlineCode> registry added once; see <Link to={`${paths.gettingStarted}#registry`}>Getting started</Link>. Without it, use{" "}</>}
                  <InlineCode>{addCommand(packageManager.value, slug.value, "url")}</InlineCode>.
                </p>
                <InstallSummary info={info.value} dependsOn={dependsOn.value} loading={loading.value} />
              </div>
      }, {
        id: "manual" as const,
        label: zh.value ? "手动" as const : "Manual" as const,
        content: () => <ol class="dk-steps flex list-decimal flex-col gap-5 ps-7 pt-3 marker:font-script marker:text-2xl marker:font-bold marker:text-marker">
                <li class="ps-1">
                  <p>{zh.value ? "安装该组件导入的依赖包。" : "Install the packages this component imports."}</p>
                  {info.value.dependencies.length > 0 ? <CodeBlock code={packagesCommand(packageManager.value, info.value.dependencies)} lang="bash" title={zh.value ? "终端" : "Terminal"} /> : <p class={HINT}>{loading.value ? zh.value ? "正在读取导入项……" : "Reading imports…" : zh.value ? "除了 Vue 和以下工具外无需额外依赖。" : "Nothing beyond Vue and the utilities below."}</p>}
                </li>
                <li class="ps-1">
                  <p>
                    {zh.value ? <>如果跳过了 <InlineCode>shadcn init</InlineCode>，请将 <InlineCode>cn()</InlineCode> 复制到 <InlineCode>lib/utils.ts</InlineCode>，并从<Link to={`${paths.gettingStarted}#manual`}>快速开始</Link>中添加主题、字体和墨水绘制引擎。</> : <>Copy <InlineCode>cn()</InlineCode> into <InlineCode>lib/utils.ts</InlineCode> if you skipped <InlineCode>shadcn init</InlineCode>, and add the theme, fonts and ink engine from <Link to={`${paths.gettingStarted}#manual`}>Getting started</Link>.</>}
                  </p>
                </li>
                {dependsOn.value.length > 0 ? <li class="ps-1">
                    <p>{zh.value ? "添加该组件依赖的 Looseleaf 项：" : "Add the Looseleaf items it builds on:"}</p>
                    <ul class="dk-inline-list mt-2 flex flex-wrap gap-x-4 gap-y-1" role="list">
                      {dependsOn.value.map(name => <li key={name}>{catalog.value.bySlug.has(name) ? <Link to={paths.components(name)}>{name}</Link> : <InlineCode>{name}</InlineCode>}</li>)}
                    </ul>
                  </li> : null}
                <li class="ps-1">
                  <p>
                    {zh.value ? <>将源码复制到 <InlineCode>components/ui/{slug.value}.tsx</InlineCode>，并根据项目别名更新导入路径。</> : <>Copy the source into <InlineCode>components/ui/{slug.value}.tsx</InlineCode> and update the import paths to match your aliases.</>}
                  </p>
                  {source.value ? <Collapsible class="mt-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="link" size="sm" class="px-0">
                          <CollapsibleIndicator size={14} />
                          {zh.value ? `显示 ${slug.value}.tsx` : `Show ${slug.value}.tsx`}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CodeBlock code={source.value} lang="tsx" title={`components/ui/${slug.value}.tsx`} maxHeight={520} />
                    </CollapsibleContent>
                  </Collapsible> : <p class={HINT}>{loading.value ? zh.value ? "正在加载源码……" : "Loading the source…" : zh.value ? "当前构建不包含该源码文件。" : "The source file is not part of this build."}</p>}
                </li>
              </ol>
      }]} />
    </div>;
  };
});
const InstallSummary = defineUi<{
  info: InstallInfo;
  dependsOn: string[];
  loading: boolean;
}>("InstallSummary", ["info", "dependsOn", "loading"], (_props, {
  slots: _slots
}) => {
  const info = computed(() => _props["info"]);
  const dependsOn = computed(() => _props["dependsOn"]);
  const loading = computed(() => _props["loading"]);
  return () => {
    if (loading.value) return <p class={HINT}>{text.value.locale === "zh-CN" ? "正在读取安装内容……" : "Reading what this installs…"}</p>;
    if (info.value.source === "none") return null;
    return <dl class="dk-summary mt-1 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
      {info.value.files.length > 0 ? <>
          <dt class="font-type text-xs text-ink-muted">{text.value.locale === "zh-CN" ? "新增文件" : "Adds"}</dt>
          <dd class="flex flex-wrap gap-2">
            {info.value.files.map(f => <InlineCode key={f}>{f.replace(/^src\//, "")}</InlineCode>)}
          </dd>
        </> : null}
      {dependsOn.value.length > 0 ? <>
          <dt class="font-type text-xs text-ink-muted">{text.value.locale === "zh-CN" ? "同时安装" : "Also installs"}</dt>
          <dd class="flex flex-wrap gap-2">
            {dependsOn.value.map(n => <Chip key={n} tone="outline" plain>
                {n}
              </Chip>)}
          </dd>
        </> : null}
      {info.value.dependencies.length > 0 ? <>
          <dt class="font-type text-xs text-ink-muted">{text.value.locale === "zh-CN" ? "npm 包" : "npm packages"}</dt>
          <dd class="flex flex-wrap gap-2">
            {info.value.dependencies.map(n => <Chip key={n} tone="outline" plain>
                {n}
              </Chip>)}
          </dd>
        </> : null}
    </dl>;
  };
});
