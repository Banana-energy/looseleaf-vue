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
  title: "Demo" as const,
  description: "Official `sonner-demo`: one button, one toast with a description and an Undo action. The slip is tossed onto the desk; Undo is a highlighted word, not a filled button. Official code mounts `<Toaster />` once at the app root; here the example mounts its own so it works on its own." as const,
  layout: "center" as const
};
const ID = "sonner-demo";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <>
      <Button variant="outline" onClick={() => toast("Event has been created", {
        toasterId: ID,
        description: "Sunday, December 03, 2023 at 9:00 AM" as const,
        action: {
          label: "Undo" as const,
          onClick: () => toast("Event removed", {
            toasterId: ID
          })
        }
      })}>
        Show Toast
      </Button>
      <Toaster id={ID} />
    </>;
  };
});
export default Example;
