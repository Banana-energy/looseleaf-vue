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
  title: "Icon tile" as const,
  description: "The upstream layout: media, title, description and an action. `variant=\"icon\"` puts the icon on a little slip of paper with a hatched shadow; the title is in the script font." as const,
  layout: "center" as const,
  height: 360
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Empty seed="no-projects">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="folder-plus" />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>You have not created any projects yet. Get started by creating your first project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div class="flex gap-2">
          <Button>Create project</Button>
          <Button variant="outline">Import project</Button>
        </div>
        <Button variant="link" size="sm" class="text-muted-foreground">
          Learn more
          <Icon name="arrow-up-right" />
        </Button>
      </EmptyContent>
    </Empty>;
  };
});
export default Example;
