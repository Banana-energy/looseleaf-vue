// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Background" as const,
  description: "shadcn's `empty-background`: a soft wash that fades from the muted tone into the paper. Any background utility goes on the root; it is a plain class, nothing is redrawn." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex h-80 w-full max-w-lg">
      <Empty class="h-full bg-linear-to-b from-muted/60 from-30% to-transparent">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon name="bell" />
          </EmptyMedia>
          <EmptyTitle>No Notifications</EmptyTitle>
          <EmptyDescription>You&apos;re all caught up. New notifications will appear here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            <Icon name="rotate-cw" />
            Refresh
          </Button>
        </EmptyContent>
      </Empty>
    </div>;
  };
});
export default Example;
