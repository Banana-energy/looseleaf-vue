// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bookmark } from "@/components/ui/bookmark";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "A reading list" as const,
  description: "A real use: save articles for later. Each card holds a Bookmark; the count follows. State lives in your app, as with any toggle." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const articles = [{
  id: "margin" as const,
  title: "Why the margin is the best part" as const,
  meta: "Notebook - 4 min" as const
}, {
  id: "paper" as const,
  title: "On paper that has tooth" as const,
  meta: "Materials - 6 min" as const
}, {
  id: "hands" as const,
  title: "Nothing is drawn straight" as const,
  meta: "Craft - 3 min" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const saved = shallowRef<Record<string, boolean>>(initialState({
    paper: true
  }));
  const setSaved = stateSetter(saved);
  const count = computed(() => Object.values(saved.value).filter(Boolean).length);
  return () => {
    return <div class="mx-auto flex w-full max-w-sm flex-col gap-8">
      <p class="font-script text-2xl text-ink" aria-live="polite">
        Saved for later: {count.value} of {articles.length}
      </p>
      {articles.map((a, i) => <Card key={a.id} stock="index-card" seed={a.id} class="relative gap-1 py-5" tilt={i % 2 ? 0.2 : -0.2}>
          <Bookmark class="absolute -top-1 end-6" tone={i === 1 ? "teal" as const : "tomato" as const} seed={a.id} pressed={!!saved.value[a.id]} onPressedChange={p => setSaved(s => ({
          ...s,
          [a.id]: p
        }))}>
            Save: {a.title}
          </Bookmark>
          <CardHeader class="pe-16">
            <CardTitle>{a.title}</CardTitle>
            <CardDescription>{a.meta}</CardDescription>
          </CardHeader>
        </Card>)}
    </div>;
  };
});
export default Example;
