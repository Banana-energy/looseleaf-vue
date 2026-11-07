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
  title: "Tones and patterns" as const,
  description: "`info`, `success` and `warning` are additions. Each has its own pattern in the margin: a double blue pencil rule, a strip of green marker, a panel of highlighter. Without an icon there is no circle, and without a title the description is one plain line." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-xl items-start gap-5">
      <Alert variant="info">
        <Icon name="info" />
        <AlertTitle>New in this version</AlertTitle>
        <AlertDescription>Tabs can now stand up on their side, like binder dividers.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <Icon name="circle-check" />
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>Your changes are on the page. Nothing else to do.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <Icon name="triangle-alert" />
        <AlertTitle>Careful with the highlighter</AlertTitle>
        <AlertDescription>Two coats will bleed through to the next page.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertDescription>No icon and no title: just the box, the rule and one line.</AlertDescription>
      </Alert>
    </div>;
  };
});
export default Example;
