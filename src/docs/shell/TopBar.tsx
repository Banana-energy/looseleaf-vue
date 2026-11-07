// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "../core/router";
import { paths } from "../core/router-core";
import { Kbd } from "../kit";
import { SettingsMenu } from "./SettingsMenu";
import { LogoMark } from "./LogoMark";
import { useLocaleText } from "../core/settings";
// 顶栏图标始终指向 Vue 版本仓库，文档地址单独由 README 和 registry 配置维护。
export const GITHUB_URL: string = import.meta.env.VITE_GITHUB_URL ?? "https://github.com/Banana-energy/looseleaf-vue";
function useShortcutHint(): ComputedRef<string> {
  const hint = shallowRef(initialState("Ctrl K"));
  const setHint = stateSetter(hint);
  watchDependencies(() => {
    const platform = navigator.platform || navigator.userAgent || "";
    if (/Mac|iPhone|iPad/i.test(platform)) setHint("⌘K");
  }, () => [], false);
  return computed(() => {
    return hint.value;
  });
}
export interface TopBarProps {
  onSearch: () => void;
}
const PRIMARY = [{
  key: "nav.gettingStarted" as const,
  to: paths.gettingStarted,
  match: "getting-started" as const
}, {
  key: "nav.components" as const,
  to: paths.components(),
  match: "components" as const
}, {
  key: "nav.blocks" as const,
  to: paths.blocks(),
  match: "blocks" as const
}] as const;
export const TopBar = defineUi<TopBarProps>("TopBar", ["onSearch"], (_props, {
  slots: _slots
}) => {
  const onSearch = computed(() => _props["onSearch"]);
  const _hook1 = useLocation();
  const route = computed(() => _hook1.value.route);
  const _hook3 = useSidebar();
  const isMobile = computed(() => _hook3.value.isMobile);
  const open = computed(() => _hook3.value.open);
  const openMobile = computed(() => _hook3.value.openMobile);
  const toggleSidebar = computed(() => _hook3.value.toggleSidebar);
  const hint = useShortcutHint();
  const text = useLocaleText();
  const expanded = computed(() => isMobile.value ? openMobile.value : open.value);
  return () => {
    return <div class="dk-topbar-wrap sticky top-0 z-(--ll-z-sticky) h-14 px-2 pt-2 print:hidden sm:px-4">
      <Paper as="header" stock="slip" tilt={false} rules="none" shadow="loose" class="dk-topbar flex h-full items-center gap-1 px-2 sm:gap-2 sm:px-3">
          <Button variant="ghost" size="icon" aria-label={isMobile.value ? text.value.t("top.menu") : expanded.value ? text.value.t("top.hideNavigation") : text.value.t("top.showNavigation")} aria-expanded={expanded.value} aria-controls={expanded.value ? "site-nav" as const : undefined} aria-keyshortcuts={isMobile.value ? undefined : "Control+B Meta+B" as const} onClick={toggleSidebar.value}>
          <Icon name={isMobile.value ? "menu" as const : "panel-left" as const} size={20} />
        </Button>
        <Link to={paths.home} class="dk-logo group/logo flex shrink-0 items-center gap-1.5 px-1 outline-offset-4">
          <LogoMark size={34} class="transition-transform duration-(--ll-dur-pop) ease-pop group-hover/logo:-rotate-6 max-[359px]:hidden" />
          <span class="font-script text-[1.9rem] leading-none font-bold text-ink">Looseleaf</span>
        </Link>
        <nav aria-label="Primary" class="dk-topnav ms-3 hidden items-center gap-0.5 lg:flex">
          {PRIMARY.map(item => <Link key={item.to} to={item.to} aria-current={route.value.name === item.match ? "page" as const : undefined} class="dk-topnav-link px-3 py-1.5 font-bold text-ink-soft hover:ll-swipe hover:text-ink aria-[current=page]:ll-swipe aria-[current=page]:text-ink">
              {text.value.t(item.key)}
            </Link>)}
        </nav>
        <div class="flex-1" />
        <Button variant="outline" class="dk-search-trigger min-w-0 justify-start gap-2 text-muted-foreground sm:w-56 lg:w-72" onClick={onSearch.value} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">
          <Icon name="search" size={18} />
          <span class="dk-search-label flex-1 truncate text-start max-sm:sr-only">{text.value.t("top.search")}</span>
          <Kbd aria-hidden="true" class="max-sm:hidden">
            {hint.value}
          </Kbd>
        </Button>
        <SettingsMenu />
        <Button variant="ghost" size="icon" asChild class="max-sm:hidden">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener" aria-label={text.value.t("top.github")}>
            <Icon name="git-branch" size={20} />
          </a>
        </Button>
      </Paper>
    </div>;
  };
});
