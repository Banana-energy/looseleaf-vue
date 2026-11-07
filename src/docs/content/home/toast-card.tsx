// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { createPortal } from "@/lib/vnode";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/ui/paper";
import { Toaster, toast } from "@/components/ui/sonner";
const TOASTER = "home-toaster";
const ToastCard = defineUi<{}>("ToastCard", [], (_props, {
  slots: _slots
}) => {
  const to = computed(() => ({
    toasterId: TOASTER
  }));
  return () => {
    return <Paper data-home="toast" stock="slip" tape="top" tapeKind="masking" seed="home-toast" class="w-full max-w-sm px-5 pt-7 pb-5 @2xl:mx-auto">
      <p class="font-script text-3xl leading-none font-bold text-ink">Toss a toast</p>
      <p class="mt-1 text-sm text-muted-foreground">Each kind is its own paper, so the meaning is not only a color.</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => toast.success("Notebook saved", {
          ...to.value,
          description: "All 48 pages are safe." as const
        })}>
          Saved
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.error("Could not sync", {
          ...to.value,
          description: "You are offline. We will try again." as const
        })}>
          Oops
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast("Page deleted", {
          ...to.value,
          action: {
            label: "Undo" as const,
            onClick: () => toast.info("The page is back", to.value)
          }
        })}>
          Delete
        </Button>
      </div>
      {createPortal(<Toaster id={TOASTER} closeButton />, document.body)}
    </Paper>;
  };
});
export default ToastCard;
