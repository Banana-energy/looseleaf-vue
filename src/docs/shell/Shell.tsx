// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Desk, DeskObjects, type DeskObject } from "@/components/ui/desk";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AnnouncerProvider, useAnnouncerState } from "../core/announcer";
import { useCatalog } from "../core/catalog-context";
import { useIdle } from "../core/hooks";
import { routeTitle } from "../core/nav";
import { useLocation, useRouteEffects } from "../core/router";
import { useSettings } from "../core/settings";
import { ErrorBoundary } from "../widgets/ErrorBoundary";
import { DeskKnobProvider, useDeskKnob } from "./desk-knob";
import { MobileNav, NavPad } from "./NavPad";
import { Outlet } from "./Outlet";
import { TopBar } from "./TopBar";
const ON_THE_DESK: readonly DeskObject[] = ["clips", "coffee"];
const SiteFooter = vueLazy(() => import("./SiteFooter").then(m => ({
  default: m.SiteFooter
})));
const CommandPalette = vueLazy(() => import("./CommandPalette").then(m => ({
  default: m.CommandPalette
})));
const nothing = () => null;
function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.closest('[role="combobox"], [role="textbox"], [role="searchbox"], [role="spinbutton"]') !== null;
}
export const Shell = defineUi<{}>("Shell", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <DeskKnobProvider>
      <SidebarProvider class="block min-h-0">
        <ShellFrame />
      </SidebarProvider>
    </DeskKnobProvider>;
  };
});
const ShellFrame = defineUi<{}>("ShellFrame", [], (_props, {
  slots: _slots
}) => {
  const catalog = useCatalog();
  const location = useLocation();
  const settings = useSettings();
  const _hook2 = useSidebar();
  const isMobile = computed(() => _hook2.value.isMobile);
  const open = computed(() => _hook2.value.open);
  const setOpenMobile = computed(() => _hook2.value.setOpenMobile);
  const _hook6 = useDeskKnob();
  const clutter = computed(() => _hook6.value.clutter);
  const homeOwnsFooter = computed(() => location.value.route.name === "home" && catalog.value.content.has("home"));
  const idle = useIdle();
  const paletteOpen = shallowRef(initialState(false));
  const setPaletteOpen = stateSetter(paletteOpen);
  const main = shallowRef<HTMLElement | null>(null);
  useRouteEffects(() => location.value);
  const title = computed(() => routeTitle(location.value.route, catalog.value, settings.value.locale));
  const _hook15 = useAnnouncerState();
  const announcement = computed(() => _hook15.value.text);
  const announce = computed(() => _hook15.value.announce);
  const shownTitle = shallowRef<string | null | null>(null);
  watchDependencies(() => {
    document.title = title.value;
    if (shownTitle.value !== null && shownTitle.value !== title.value) announce.value(`Navigated to ${title.value}`);
    shownTitle.value = title.value;
  }, () => [title.value, announce.value], false);
  watchDependencies(() => setOpenMobile.value(false), () => [location.value.path, setOpenMobile.value], false);
  watchDependencies(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(o => !o);
      } else if (event.key === "/" && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditable(event.target)) {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, () => [], false);
  const openPalette = () => setPaletteOpen(true);
  const closePalette = () => setPaletteOpen(false);
  return () => {
    return <AnnouncerProvider announce={announce.value}>
      <Desk class="dk-app min-h-svh">
        {clutter.value ? <DeskObjects objects={ON_THE_DESK} seed="docs-desk" class="fixed print:hidden" /> : null}
        <a class="dk-skip sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-(--ll-z-splash) focus:ll-swipe focus:px-4 focus:py-2 focus:font-bold focus:shadow-lift" href="#main" onClick={(event: PointerEvent) => {
          event.preventDefault();
          main.value?.focus();
          main.value?.scrollIntoView();
        }}>
          Skip to content
        </a>
        <TopBar onSearch={openPalette} />
        <div class="dk-layout mx-auto flex w-full max-w-[100rem] items-start gap-2 px-2 sm:px-4">
          <ErrorBoundary fallback={nothing}>{!isMobile.value && open.value ? <NavPad /> : null}</ErrorBoundary>
          <main id="main" ref={main} tabindex={-1} class="dk-main min-w-0 flex-1 px-4 pt-6 pb-20 outline-none lg:px-10 lg:pt-9 lg:pb-24">
            <Outlet />
          </main>
        </div>
        {homeOwnsFooter.value || !idle.value ? null : <Suspense fallback={null}>
            <SiteFooter />
          </Suspense>}
        <ErrorBoundary fallback={nothing}>
          <MobileNav />
        </ErrorBoundary>
        <ErrorBoundary fallback={nothing}>
          {paletteOpen.value || idle.value ? <Suspense fallback={null}>
              <CommandPalette open={paletteOpen.value} onClose={closePalette} />
            </Suspense> : null}
        </ErrorBoundary>
        <p class="sr-only" role="status" aria-live="polite">
          {announcement.value}
        </p>
      </Desk>
    </AnnouncerProvider>;
  };
});
