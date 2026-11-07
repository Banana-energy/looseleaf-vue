// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Route = {
  name: "home";
} | {
  name: "getting-started";
} | {
  name: "foundations";
  topic: string | null;
} | {
  name: "components";
  slug: string | null;
} | {
  name: "blocks";
  slug: string | null;
} | {
  name: "playground";
} | {
  name: "changelog";
} | {
  name: "not-found";
  path: string;
};
export interface ParsedHash {
  path: string;
  anchor: string;
  search: string;
  anchorOnly: boolean;
}
function safeDecode(part: string): string {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}
export function normalisePath(raw: string): string {
  const segments = raw.split("/").map(s => safeDecode(s).trim().toLowerCase()).filter(Boolean);
  return "/" + segments.join("/");
}
export function parseHash(hash: string): ParsedHash {
  const body = hash.startsWith("#") ? hash.slice(1) : hash;
  if (body === "") return {
    path: "/" as const,
    anchor: "" as const,
    search: "" as const,
    anchorOnly: false
  };
  if (!body.startsWith("/")) return {
    path: "" as const,
    anchor: safeDecode(body),
    search: "" as const,
    anchorOnly: true
  };
  const anchorAt = body.indexOf("#");
  let pathPart = anchorAt < 0 ? body : body.slice(0, anchorAt);
  const anchor = anchorAt < 0 ? "" as const : safeDecode(body.slice(anchorAt + 1));
  const queryAt = pathPart.indexOf("?");
  const search = queryAt < 0 ? "" as const : pathPart.slice(queryAt);
  if (queryAt >= 0) pathPart = pathPart.slice(0, queryAt);
  return {
    path: normalisePath(pathPart),
    anchor,
    search,
    anchorOnly: false
  };
}
export function matchRoute(path: string): Route {
  const segments = path.split("/").filter(Boolean);
  const [first, second, ...rest] = segments;
  if (segments.length === 0) return {
    name: "home" as const
  };
  if (rest.length > 0) return {
    name: "not-found" as const,
    path
  };
  switch (first) {
    case "getting-started":
      return second === undefined ? {
        name: "getting-started" as const
      } : {
        name: "not-found" as const,
        path
      };
    case "foundations":
      return {
        name: "foundations" as const,
        topic: second === "colour" ? "color" as const : second ?? null
      };
    case "components":
      return {
        name: "components" as const,
        slug: second ?? null
      };
    case "blocks":
      return {
        name: "blocks" as const,
        slug: second ?? null
      };
    case "playground":
      return second === undefined ? {
        name: "playground" as const
      } : {
        name: "not-found" as const,
        path
      };
    case "changelog":
      return second === undefined ? {
        name: "changelog" as const
      } : {
        name: "not-found" as const,
        path
      };
    default:
      return {
        name: "not-found" as const,
        path
      };
  }
}
export const paths = {
  home: "/" as const,
  gettingStarted: "/getting-started" as const,
  foundations: (topic?: string) => topic ? `/foundations/${topic}` : "/foundations" as const,
  components: (slug?: string) => slug ? `/components/${slug}` : "/components" as const,
  blocks: (slug?: string) => slug ? `/blocks/${slug}` : "/blocks" as const,
  playground: "/playground" as const,
  changelog: "/changelog" as const
} as const;
export function hrefFor(to: string): string {
  if (to.startsWith("#")) return to;
  return "#" + (to.startsWith("/") ? to : "/" + to);
}
export function withAnchor(path: string, anchor: string): string {
  return anchor ? `${path}#${anchor}` : path;
}
export function slugifyAnchor(text: string): string {
  return text.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
