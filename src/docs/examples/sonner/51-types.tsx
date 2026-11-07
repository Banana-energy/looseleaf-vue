// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "@/components/ui/sonner";
export const meta = {
  title: "Types" as const,
  description: "Official `sonner-types`: default, success, info, warning, error and a promise that goes from loading to success after two seconds. Each type is a different stock of paper (guest check, blue, yellow and pink stickies), so meaning never rests on color alone." as const,
  layout: "center" as const
};
const ID = "sonner-types-official";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const t = computed(() => ({
    toasterId: ID
  }));
  return () => {
    return <>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Event has been created", t.value)}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success("Event has been created", t.value)}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.info("Be at the area 10 minutes before the event time", t.value)}>
          Info
        </Button>
        <Button variant="outline" onClick={() => toast.warning("Event start time cannot be earlier than 8am", t.value)}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.error("Event has not been created", t.value)}>
          Error
        </Button>
        <Button variant="outline" onClick={() => {
          toast.promise<{
            name: string;
          }>(() => new Promise(resolve => setTimeout(() => resolve({
            name: "Event" as const
          }), 2000)), {
            ...t.value,
            loading: "Loading..." as const,
            success: data => `${data.name} has been created`,
            error: "Error" as const
          });
        }}>
          Promise
        </Button>
      </div>
      <Toaster id={ID} />
    </>;
  };
});
export default Example;
