// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/ui/mascot";
const links = ["Product", "Pricing", "Notes", "Changelog"];
const LandingHero01Nav = defineUi<{}>("LandingHero01Nav", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <header class="flex items-center justify-between gap-4 pt-6">
      <a href="#top" class="flex items-center gap-2 font-script text-3xl leading-none font-bold text-ink">
        <Mascot pose="idle" size={32} />
        penmark
      </a>
      <nav aria-label="Main" class="hidden items-center gap-3 text-base text-ink @2xl:flex">
        {links.map(l => <a key={l} href={`#${l.toLowerCase()}`} class="px-3 py-1 hover:ll-swipe">
            {l}
          </a>)}
      </nav>
      <div class="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" class="hidden @md:inline-flex">
          <a href="#sign-in">Sign in</a>
        </Button>
        <Button asChild size="sm">
          <a href="#start">Get started</a>
        </Button>
      </div>
    </header>;
  };
});
export { LandingHero01Nav };
