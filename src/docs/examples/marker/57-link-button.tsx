// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { toast } from "@/lib/sonner-primitive";
import { Icon } from "@/components/ui/icon";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Links and buttons" as const,
  description: "shadcn's `marker-link-button`: `asChild` makes the marker a real `<a>` or `<button>`, so it is focusable and announced as one. The button here says so with a toast. `rotate-ccw` is not drawn yet; the revert button wears `undo-2`." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-sm flex-col gap-8 py-4">
      <Marker asChild>
        <a href="#links-and-buttons">
          <MarkerIcon>
            <Icon name="git-branch" />
          </MarkerIcon>
          <MarkerContent>View the pull request</MarkerContent>
        </a>
      </Marker>
      <Marker asChild>
        <button type="button" class="transition-colors hover:text-foreground" onClick={() => toast("You clicked the revert button", {
          toasterId: "marker-link-button" as const
        })}>
          <MarkerIcon>
            <Icon name="undo-2" />
          </MarkerIcon>
          <MarkerContent>Revert this change</MarkerContent>
        </button>
      </Marker>
      <Toaster id="marker-link-button" />
    </div>;
  };
});
export default Example;
