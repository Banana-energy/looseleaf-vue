// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Link } from "../../core/router";
import { paths } from "../../core/router-core";
import { LazyOnView } from "./lazy-on-view";
import type { DecoItem } from "./deco";
const Deco = vueLazy(() => import("./deco"));
const STAMP: readonly DecoItem[] = [{
  kind: "stamp" as const,
  name: "made-by-hand" as const,
  text: "Made by hand" as const,
  sub: "Looseleaf 0.1.0" as const,
  shape: "rect" as const,
  ink: "red" as const,
  w: 196,
  h: 76,
  rotate: -5,
  className: "top-0 left-0" as const
}];
const LINKS = [{
  to: paths.gettingStarted,
  label: "Get started" as const
}, {
  to: paths.components(),
  label: "Components" as const
}, {
  to: paths.playground,
  label: "Playground" as const
}, {
  to: paths.changelog,
  label: "Changelog" as const
}];
const linkClass = "text-ink underline decoration-ink/40 decoration-2 underline-offset-4 hover:decoration-ink focus-visible:decoration-ink";
export const Footer = defineUi<{}>("Footer", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <footer data-slot="home-footer" class="mt-28 flex flex-wrap items-end justify-between gap-x-10 gap-y-8 border-t-2 border-dashed border-ink/25 pt-9">
      <div class="min-w-0">
        <p class="font-script text-4xl leading-none font-bold text-ink">Looseleaf</p>
        <p class="mt-2 max-w-md text-ink">shadcn/ui, drawn by hand. MIT licensed, with accessible parts and a pencil.</p>
        <nav aria-label="Footer" class="mt-4">
          <ul role="list" class="flex flex-wrap gap-x-6 gap-y-2 text-[17px]">
            {LINKS.map(l => <li key={l.label}>
                <Link to={l.to} class={linkClass}>
                  {l.label}
                </Link>
              </li>)}
          </ul>
        </nav>
      </div>
      <div class="relative h-24 w-56" aria-hidden="true">
        <LazyOnView height={0} slip={false} delay={900} class="contents">
          <Deco items={STAMP} />
        </LazyOnView>
      </div>
    </footer>;
  };
});
