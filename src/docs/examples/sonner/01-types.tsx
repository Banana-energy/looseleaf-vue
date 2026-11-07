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
  title: "Types" as const,
  description: "Six kinds of paper: a plain slip, a green guest check for success, a pink sticky for errors, yellow for warnings, blue for news, and a slip with a spinning loader. Each has its own drawn icon and a slightly different tilt." as const,
  layout: "center" as const
};
const ID = "sonner-types";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const t = computed(() => ({
    toasterId: ID
  }));
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline" onClick={() => toast("Event created", {
        ...t.value,
        description: "Saturday, 10:00 am" as const
      })}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Notebook saved", {
        ...t.value,
        description: "All 48 pages are safe." as const
      })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Could not sync", {
        ...t.value,
        description: "You are offline. We will try again." as const
      })}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Storage almost full", {
        ...t.value,
        description: "92% of your 1 GB is used." as const
      })}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.info("A new version is ready", {
        ...t.value
      })}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.loading("Uploading photo…", {
        ...t.value,
        description: "IMG_2043.jpg" as const
      })}>
        Loading
      </Button>
      <Toaster id={ID} closeButton />
    </div>;
  };
});
export default Example;
