// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { toast } from "@/lib/sonner-primitive";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Promise" as const,
  description: "toast.promise follows a request: one slip that starts as a loader, then turns into a success (or an error) paper when the promise settles. Pass a function for the message to use the result." as const,
  layout: "center" as const
};
const ID = "sonner-promise";
const save = (ok: boolean) => new Promise<{
  name: string;
}>((resolve, reject) => setTimeout(() => ok ? resolve({
  name: "Field notes" as const
}) : reject(new Error("offline")), 1800));
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-2">
      <Button onClick={() => toast.promise(save(true), {
        toasterId: ID,
        loading: "Saving notebook…" as const,
        success: data => `${data.name} saved`,
        error: "Could not save" as const
      })}>
        Save (succeeds)
      </Button>
      <Button variant="outline" onClick={() => toast.promise(save(false), {
        toasterId: ID,
        loading: "Saving notebook…" as const,
        success: "Saved" as const,
        error: (e: Error) => `Could not save: ${e.message}`
      })}>
        Save (fails)
      </Button>
      <Toaster id={ID} />
    </div>;
  };
});
export default Example;
