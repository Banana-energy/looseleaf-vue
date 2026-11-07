// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useCatalog } from "../core/catalog-context";
import { buildSearchIndex, search } from "../core/search";
import { Link } from "../core/router";
import { paths } from "../core/router-core";
import { Mascot } from "@/components/ui/mascot";
import { ButtonLink, Kbd, Page, Prose } from "../kit";
import { useLocaleText } from "../core/settings";
export interface NotFoundPageProps {
  what?: string;
  missing?: string;
}
export const NotFoundPage = defineUi<NotFoundPageProps>("NotFoundPage", ["what", "missing"], (_props, {
  slots: _slots
}) => {
  const what = computed(() => _props["what"] === undefined ? "page" as const : _props["what"]);
  const missing = computed(() => _props["missing"]);
  const catalog = useCatalog();
  const text = useLocaleText();
  const guesses = computed(() => {
    if (!missing.value) return [];
    const term = missing.value.split("/").filter(Boolean).pop() ?? missing.value;
    return search(buildSearchIndex(catalog.value), term, 5);
  });
  return () => {
    const zh = text.value.locale === "zh-CN";
    const whatLabel = zh ? ({ page: "页面", component: "组件", block: "区块", foundation: "基础主题" } as Record<string, string>)[what.value] : what.value;
    return <Page kicker="404" title={zh ? `找不到这个${whatLabel}` : `We could not find that ${what.value}`} description={missing.value ? zh ? `没有找到“${missing.value}”对应的内容。` : `Nothing is filed under "${missing.value}".` : undefined}>
      <div class="flex flex-wrap items-center gap-x-10 gap-y-4">
        <Mascot pose="search" size={128} label="Stubby looking for the page with a magnifying glass" />
        <Prose class="min-w-0 flex-1 basis-64">
          {guesses.value.length > 0 ? <>
              <p>{zh ? "你是不是要找以下内容？" : "Did you mean one of these?"}</p>
              <ul>
                {guesses.value.map(g => <li key={g.entry.id}>
                    <Link to={g.entry.to}>{g.entry.title}</Link> <span class="dk-hint">{g.entry.group}</span>
                  </li>)}
              </ul>
            </> : <p>
              {zh ? <>可以使用搜索（按 <Kbd>/</Kbd>），或从总览页开始。</> : <>Try the search (press <Kbd>/</Kbd>) or start from the overview.</>}
            </p>}
          <p class="dk-actions">
            <ButtonLink to={paths.components()}>{zh ? "全部组件" : "All components"}</ButtonLink>
            <ButtonLink to={paths.home} variant="quiet">
              {zh ? "首页" : "Home"}
            </ButtonLink>
          </p>
        </Prose>
      </div>
    </Page>;
  };
});
