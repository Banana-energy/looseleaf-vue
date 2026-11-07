// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { createCatalog, type Catalog, type CatalogSources } from "./catalog";
export function discoverSources(): CatalogSources {
  return {
    meta: import.meta.glob(["/src/docs/meta/*.ts", "!/src/docs/meta/_*"], {
      eager: true
    }),
    examples: import.meta.glob(["/src/docs/examples/**/*.tsx", "!/src/docs/examples/**/_*", "!/src/docs/examples/**/_*/**"]),
    exampleSources: import.meta.glob<string>(["/src/docs/examples/**/*.tsx", "!/src/docs/examples/**/_*", "!/src/docs/examples/**/_*/**"], {
      query: "?raw" as const,
      import: "default" as const
    }),
    ui: import.meta.glob<string>("/src/components/ui/*.tsx", {
      query: "?raw" as const,
      import: "default" as const
    }),
    blocks: import.meta.glob<string>(["/src/blocks/**/*.{ts,tsx,css}", "!/src/blocks/**/_*", "!/src/blocks/**/_*/**"], {
      query: "?raw" as const,
      import: "default" as const
    }),
    blockMeta: import.meta.glob(["/src/docs/content/blocks/*.meta.ts", "!/src/docs/content/**/_*", "!/src/docs/content/**/_*/**"], {
      eager: true
    }),
    content: import.meta.glob(["/src/docs/content/**/*.tsx", "!/src/docs/content/**/_*", "!/src/docs/content/**/_*/**"]),
    registry: import.meta.glob<string>("/registry.json", {
      query: "?raw" as const,
      import: "default" as const
    })
  };
}
export function discoverCatalog(): Catalog {
  const catalog = createCatalog(discoverSources());
  if (import.meta.env.DEV) {
    for (const w of catalog.warnings) console.warn(`[docs] ${w}`);
  }
  return catalog;
}
