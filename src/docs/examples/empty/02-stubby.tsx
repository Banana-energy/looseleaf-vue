// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
export const meta = {
  title: "Stubby" as const,
  description: "`pose` asks for Stubby, the pencil stub who does the drawing: `search` for no results, `sleep` for a quiet day, `unplug` for offline, and the rest of the poses as they are drawn (see the props). Media is decorative, so the title carries the meaning." as const,
  layout: "stack" as const
};
const states = [{
  pose: "search" as const,
  title: "No results" as const,
  text: "Nothing matches “ghost pepper”. Try a shorter word." as const,
  action: "Clear search" as const
}, {
  pose: "sleep" as const,
  title: "All quiet" as const,
  text: "Nothing is scheduled today. Enjoy it." as const
}, {
  pose: "unplug" as const,
  title: "You are offline" as const,
  text: "Changes are kept on this page and sent when the line is back." as const,
  action: "Try again" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full gap-2 md:grid-cols-3">
      {states.map(s => <Empty key={s.pose} seed={s.pose} class="justify-start p-4 md:p-4">
          <EmptyHeader>
            <EmptyMedia pose={s.pose} size={112} />
            <EmptyTitle>{s.title}</EmptyTitle>
            <EmptyDescription>{s.text}</EmptyDescription>
          </EmptyHeader>
          {"action" in s ? <EmptyContent>
              <Button size="sm">{s.action}</Button>
            </EmptyContent> : null}
        </Empty>)}
    </div>;
  };
});
export default Example;
