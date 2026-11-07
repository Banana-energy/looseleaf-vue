// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { Stamp } from "@/components/ui/stamp";
import { Link } from "../core/router";
import { paths } from "../core/router-core";
import { GITHUB_URL } from "./TopBar";
import { useLocaleText } from "../core/settings";
export const SiteFooter = defineUi<{}>("SiteFooter", [], (_props, {
  slots: _slots
}) => {
  const text = useLocaleText();
  return () => {
    return <footer class="dk-footer mx-auto flex w-full max-w-[100rem] justify-center px-4 pb-12 sm:px-6">
      <Paper stock="slip" tilt={0.6} rules="none" shadow="slip" class="flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-8 py-5">
        <Stamp text="HAND DRAWN" sub="no pixels harmed" ink="ink-you" w={196} h={72} tilt={-4} label="Hand drawn: no pixels harmed" />
        <div class="flex min-w-0 flex-1 basis-64 flex-col gap-1">
          <p class="text-[15px] leading-snug text-ink-soft">{text.value.t("footer.description")}</p>
          <p class="mt-1 text-[15px] leading-snug text-ink-soft">{text.value.t("footer.madeBy")}</p>
          <a href="https://x.com/kevin_t_ngo" target="_blank" rel="noreferrer noopener" class="w-fit font-script text-4xl leading-tight font-bold text-link no-underline hover:text-link-hover">
            @kevin_t_ngo<span class="sr-only">{text.value.t("footer.xLabel")}</span>
          </a>
          <ul role="list" class="flex flex-wrap gap-x-4 gap-y-1 font-bold">
            <li>
              <Link to={paths.gettingStarted}>{text.value.t("nav.gettingStarted")}</Link>
            </li>
            <li>
              <Link to={paths.changelog}>{text.value.t("nav.changelog")}</Link>
            </li>
            <li>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
                {text.value.t("footer.github")}<span class="sr-only">{text.value.t("footer.githubLabel")}</span>
              </a>
            </li>
          </ul>
        </div>
      </Paper>
    </footer>;
  };
});
