// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Starred repositories" as const,
  description: "The classic: a heading with a trigger button, one item always shown and the rest folded away. The panel slides open and shut." as const,
  layout: "center" as const,
  height: 240
};
const Repo = defineUi<{
  seed: string;
  stock: "sticky-yellow" | "sticky-blue" | "sticky-green";
  children: UI.VueNode;
}>("Repo", ["seed", "stock"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  const stock = computed(() => _props["stock"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <Paper stock={stock.value} seed={seed.value} class="mx-1 px-3 py-2 font-mono text-sm">
      {readSlot(_slots.default)}
    </Paper>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  return () => {
    return <Collapsible open={open.value} onOpenChange={setOpen} class="flex w-[350px] flex-col gap-2">
      <div class="flex items-center justify-between gap-4 px-1">
        <h4 class="font-script text-xl font-semibold">Starred this week: 3</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Icon name="chevrons-up-down" />
            <span class="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <Repo seed="r1" stock="sticky-yellow">reka-ui/primitives</Repo>
      <CollapsibleContent class="flex flex-col gap-2">
        <Repo seed="r2" stock="sticky-blue">tailwindlabs/tailwindcss</Repo>
        <Repo seed="r3" stock="sticky-green">shadcn-ui/ui</Repo>
      </CollapsibleContent>
    </Collapsible>;
  };
});
export default Example;
