// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Session expired" as const,
  description: "The smallest destructive alert: an icon, the word Error and one plain sentence. Below it, the same message with the way out built in. Alerts are live regions, so the second one is announced when it appears." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const again = shallowRef(initialState(false));
  const setAgain = stateSetter(again);
  return () => {
    return <div class="grid w-full max-w-xl items-start gap-5">
      <Alert variant="destructive">
        <Icon name="circle-alert" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
      </Alert>
      {again.value ? <Alert variant="success">
          <Icon name="circle-check" />
          <AlertTitle>Signed in</AlertTitle>
          <AlertDescription>Welcome back. Your drafts are where you left them.</AlertDescription>
        </Alert> : <Alert variant="destructive">
          <Icon name="circle-alert" />
          <AlertTitle>You were signed out</AlertTitle>
          <AlertDescription>
            <p>It has been a while since your last visit.</p>
            <Button size="sm" variant="outline" class="mt-2" onClick={() => setAgain(true)}>
              Log in again
            </Button>
          </AlertDescription>
        </Alert>}
    </div>;
  };
});
export default Example;
