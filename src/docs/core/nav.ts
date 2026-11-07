// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { Catalog } from "./catalog";
import { FOUNDATIONS, FOUNDATION_BY_SLUG } from "./foundations";
import { paths, slugifyAnchor, type Route } from "./router-core";
import { categoryLabel, translate, type Locale } from "./i18n";
export const SITE_NAME = "Looseleaf";
export const SITE_TAGLINE = "shadcn/ui, drawn by hand";
export interface NavLinkModel {
  id: string;
  label: string;
  to: string;
  active: boolean;
}
export interface NavGroupModel {
  id: string;
  label: string;
  count: number;
  containsActive: boolean;
  links: NavLinkModel[];
}
export interface NavSectionModel {
  id: string;
  label: string;
  to?: string;
  active: boolean;
  count?: number;
  links: NavLinkModel[];
  groups: NavGroupModel[];
  empty?: string;
}
export const categoryAnchor = (category: string) => `category-${slugifyAnchor(category)}`;
const isRoute = (route: Route, name: Route["name"]) => route.name === name;
export function buildNav(catalog: Catalog, route: Route, locale: Locale): NavSectionModel[] {
  const activeComponent = route.name === "components" ? route.slug : null;
  const activeBlock = route.name === "blocks" ? route.slug : null;
  const activeTopic = route.name === "foundations" ? route.topic : null;
  return [{
    id: "start" as const,
    label: translate(locale, "nav.start"),
    active: false,
    links: [{
      id: "getting-started" as const,
      label: translate(locale, "nav.gettingStarted"),
      to: paths.gettingStarted,
      active: isRoute(route, "getting-started")
    }],
    groups: []
  }, {
    id: "foundations" as const,
    label: translate(locale, "nav.foundations"),
    to: paths.foundations(),
    active: route.name === "foundations" && !activeTopic,
    links: FOUNDATIONS.map(t => ({
      id: t.slug,
      label: t.title,
      to: paths.foundations(t.slug),
      active: activeTopic === t.slug
    })),
    groups: []
  }, {
    id: "components" as const,
    label: translate(locale, "nav.components"),
    to: paths.components(),
    active: route.name === "components" && !activeComponent,
    count: catalog.components.length,
    links: [],
    groups: catalog.groups.map(g => ({
      id: g.category,
      label: categoryLabel(locale, g.category),
      count: g.items.length,
      containsActive: g.items.some(c => c.slug === activeComponent),
      links: g.items.map(c => ({
        id: c.slug,
        label: c.doc.title,
        to: paths.components(c.slug),
        active: activeComponent === c.slug
      }))
    })),
    empty: catalog.components.length === 0 ? translate(locale, "nav.noComponents") : undefined
  }, {
    id: "blocks" as const,
    label: translate(locale, "nav.blocks"),
    to: paths.blocks(),
    active: route.name === "blocks" && !activeBlock,
    count: catalog.blocks.length,
    links: catalog.blocks.map(b => ({
      id: b.slug,
      label: b.title,
      to: paths.blocks(b.slug),
      active: activeBlock === b.slug
    })),
    groups: [],
    empty: catalog.blocks.length === 0 ? translate(locale, "nav.noBlocks") : undefined
  }, {
    id: "more" as const,
    label: translate(locale, "nav.more"),
    active: false,
    links: [{
      id: "playground" as const,
      label: translate(locale, "nav.playground"),
      to: paths.playground,
      active: isRoute(route, "playground")
    }, {
      id: "changelog" as const,
      label: translate(locale, "nav.changelog"),
      to: paths.changelog,
      active: isRoute(route, "changelog")
    }],
    groups: []
  }];
}
export function routeTitle(route: Route, catalog: Catalog, locale: Locale): string {
  const page = (() => {
    switch (route.name) {
      case "home":
        return null;
      case "getting-started":
        return translate(locale, "route.gettingStarted");
      case "foundations":
        if (!route.topic) return translate(locale, "route.foundations");
        return FOUNDATION_BY_SLUG.get(route.topic)?.title ?? translate(locale, "route.notFound");
      case "components":
        if (!route.slug) return translate(locale, "route.components");
        return catalog.bySlug.get(route.slug)?.doc.title ?? translate(locale, "route.componentNotFound");
      case "blocks":
        if (!route.slug) return translate(locale, "route.blocks");
        return catalog.blockBySlug.get(route.slug)?.title ?? translate(locale, "route.blockNotFound");
      case "playground":
        return translate(locale, "route.playground");
      case "changelog":
        return translate(locale, "route.changelog");
      case "not-found":
        return translate(locale, "route.notFound");
    }
  })();
  return page ? `${page} — ${SITE_NAME}` : `${SITE_NAME} — ${translate(locale, "route.tagline")}`;
}
