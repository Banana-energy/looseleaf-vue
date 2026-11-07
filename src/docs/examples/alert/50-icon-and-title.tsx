// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Icon, title, description: any combination" as const,
  description: "The shadcn demo. An alert needs no description (icon and a title on one line) and no title (icon and a sentence), and a success message can say everything in three parts. The icon is circled in the alert's own pen." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-xl items-start gap-5">
      <Alert variant="success">
        <Icon name="circle-check" />
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>This is an alert with icon, title and description.</AlertDescription>
      </Alert>
      <Alert>
        <Icon name="sparkles" />
        <AlertTitle>This alert has a title and an icon. No description.</AlertTitle>
      </Alert>
      <Alert variant="info">
        <Icon name="lightbulb" />
        <AlertDescription>An icon and one sentence, with no title: a quiet tip.</AlertDescription>
      </Alert>
    </div>;
  };
});
export default Example;
