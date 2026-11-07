// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { SidebarContent } from "@/components/ui/sidebar";
import { useCatalog } from "../core/catalog-context";
import { buildNav } from "../core/nav";
import { useLocation } from "../core/router";
import { readStored, writeStored } from "../core/storage";
import { useSettings } from "../core/settings";
import { NavGroup, NavItem, NavSection } from "../kit";
function readCollapsed(): Set<string> | null {
  try {
    const raw = readStored("nav-collapsed");
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return null;
  }
}
const COLLAPSE_ABOVE = 40;
export const SideNav = defineUi<{}>("SideNav", [], (_props, {
  slots: _slots
}) => {
  const catalog = useCatalog();
  const settings = useSettings();
  const _hook1 = useLocation();
  const route = computed(() => _hook1.value.route);
  const path = computed(() => _hook1.value.path);
  const sections = computed(() => buildNav(catalog.value, route.value, settings.value.locale));
  const activeGroup = computed(() => sections.value.flatMap(s => s.groups).find(g => g.containsActive)?.id);
  const collapsed = shallowRef<Set<string>>(initialState(() => {
    const initial = readCollapsed() ?? new Set(catalog.value.components.length > COLLAPSE_ABOVE ? catalog.value.groups.map(g => g.category) : []);
    if (activeGroup.value) initial.delete(activeGroup.value);
    return initial;
  }));
  const setCollapsed = stateSetter(collapsed);
  const scroller = shallowRef<HTMLDivElement | null>(null);
  const scrollerRef = elementRef<HTMLDivElement>(element => { scroller.value = element });
  watchDependencies(() => {
    if (!activeGroup.value) return;
    setCollapsed(prev => {
      if (!prev.has(activeGroup.value)) return prev;
      const next = new Set(prev);
      next.delete(activeGroup.value);
      return next;
    });
  }, () => [activeGroup.value], false);
  const groupOpen = computed(() => activeGroup.value ? !collapsed.value.has(activeGroup.value) : true);
  watchDependencies(() => {
    const box = scroller.value;
    const item = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!box || !item) return;
    const b = box.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    if (r.top < b.top + 8) box.scrollTop += r.top - b.top - 8;else if (r.bottom > b.bottom - 8) box.scrollTop += r.bottom - b.bottom + 8;
  }, () => [path.value, groupOpen.value], false);
  const toggle = computed(() => (id: string) => setCollapsed(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);else next.add(id);
    writeStored("nav-collapsed", JSON.stringify([...next]));
    return next;
  }));
  return () => {
    return <nav aria-label="Documentation" class="dk-nav flex min-h-0 flex-1 flex-col">
      <SidebarContent ref={scrollerRef}>
        {sections.value.map(section => <NavSection key={section.id} label={section.label} to={section.to} active={section.active} count={section.count}>
            {section.links.map(link => <NavItem key={link.id} to={link.to} active={link.active}>
                {link.label}
              </NavItem>)}
            {section.groups.map(group => <NavGroup key={group.id} label={group.label} count={group.count} open={!collapsed.value.has(group.id)} containsActive={group.containsActive} onToggle={() => toggle.value(group.id)}>
                {group.links.map(link => <NavItem key={link.id} to={link.to} active={link.active}>
                    {link.label}
                  </NavItem>)}
              </NavGroup>)}
            {section.empty ? <li class="px-2 py-1.5 text-sm text-muted-foreground">{section.empty}</li> : null}
          </NavSection>)}
      </SidebarContent>
    </nav>;
  };
});
