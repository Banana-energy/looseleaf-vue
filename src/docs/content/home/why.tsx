// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useCatalog } from "../../core/catalog-context";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { DeskSection } from "./section";
const REASONS = [{
  key: "practical" as const,
  title: "Practical" as const,
  flag: "tomato" as const,
  text: "Same parts, props and data-slot names. Add one with the CLI and it lands in your repo: your code, not a dependency." as const,
  foot: "drop-in registry" as const
}, {
  key: "handmade" as const,
  title: "Handmade" as const,
  flag: "sky" as const,
  text: "Lines have pressure. Fills are solid and sit in their outlines. Paper has tooth. Every stroke is seeded, so the server and the client draw the same hand." as const,
  foot: "no two alike" as const
}, {
  key: "accessible" as const,
  title: "Accessible" as const,
  flag: "grass" as const,
  text: "Reka UI underneath: keyboard, focus rings, AA text, 24 px targets, reduced motion, forced colors. The charm is decoration; the semantics are ordinary." as const,
  foot: "axe-checked" as const
}, {
  key: "themeable" as const,
  title: "Themeable" as const,
  flag: "grape" as const,
  text: "One set of tokens, three densities. Change --ll-marker and everything follows; switch on calm and a dense dashboard goes quiet." as const,
  foot: "tokens + themes" as const
}] as const;
export const Why = defineUi<{}>("Why", [], (_props, {
  slots: _slots
}) => {
  const _nestedHook0 = useCatalog();
  const own = computed(() => _nestedHook0.value.components.filter(c => !c.doc.upstream).length);
  const lead = computed(() => own.value > 0 ? `Every shadcn component, plus ${own.value} of our own.` : "Every shadcn component." as const);
  return () => {
    return <DeskSection id="why" title="Why Looseleaf" lede="A design system that is fun to look at is only worth shipping if it is also a good component library. Both, on purpose.">
      <ul role="list" class="grid gap-x-10 gap-y-12 @2xl:grid-cols-2">
        {REASONS.map((r, i) => <li key={r.key} class="min-w-0">
            <IndexCard data-home={`why-${r.key}`} seed={`why-${r.key}`} flag={r.flag} stack={i % 2 === 0 ? 1 : 0} class="min-h-72 max-w-none">
              <IndexCardHeader>
                <IndexCardTitle role="heading" aria-level={3}>
                  {r.title}
                </IndexCardTitle>
              </IndexCardHeader>
              <IndexCardContent>
                <p>{r.key === "practical" ? `${lead.value} ${r.text}` : r.text}</p>
              </IndexCardContent>
              <IndexCardFooter>
                <span>{r.foot}</span>
                <span class="ll-num">{i + 1} of 4</span>
              </IndexCardFooter>
            </IndexCard>
          </li>)}
      </ul>
    </DeskSection>;
  };
});
