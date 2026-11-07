// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { Tally } from "@/components/ui/tally";
import { useCatalog } from "../../core/catalog-context";
import { DeskSection } from "./section";
interface Stat {
  key: string;
  value: string;
  label: string;
  strokes: number;
  per: string;
}
export const Stats = defineUi<{}>("Stats", [], (_props, {
  slots: _slots
}) => {
  const catalog = useCatalog();
  const components = computed(() => catalog.value.components.length);
  const stats = computed<Stat[]>(() => [{
    key: "components" as const,
    value: String(components.value),
    label: "components" as const,
    strokes: Math.floor(components.value / 10),
    per: "one stroke is ten" as const
  }, {
    key: "art" as const,
    value: "300+" as const,
    label: "drawn things: icons, stickers, doodles, Stubby" as const,
    strokes: 30,
    per: "one stroke is ten" as const
  }, {
    key: "categories" as const,
    value: String(catalog.value.groups.length),
    label: "categories, from buttons to charts" as const,
    strokes: catalog.value.groups.length,
    per: "one stroke each" as const
  }, {
    key: "tests" as const,
    value: "6,500+" as const,
    label: "tests, with axe on every page" as const,
    strokes: 13,
    per: "one stroke is five hundred" as const
  }]);
  return () => {
    return <DeskSection id="numbers" title="By the numbers">
      <Paper data-home="stats" stock="graph" tape="top" seed="home-stats" class="px-6 pt-9 pb-8 @xl:px-10">
        <dl class="grid gap-x-10 gap-y-9 @2xl:grid-cols-2">
          {stats.value.map(s => <div key={s.key} class="flex min-w-0 flex-col gap-1">
              <dt class="order-2 text-[15px] leading-snug text-ink-soft">{s.label}</dt>
              <dd class="order-1 m-0 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span class="ll-num font-script text-6xl leading-none font-bold text-ink">{s.value}</span>
                <span class="flex flex-col gap-0.5">
                  {s.strokes > 0 ? <Tally count={s.strokes} size="sm" label={`${s.strokes} strokes: ${s.per}`} /> : null}
                  <span class="font-type text-sm text-pencil-text">{s.per}</span>
                </span>
              </dd>
            </div>)}
        </dl>
      </Paper>
    </DeskSection>;
  };
});
