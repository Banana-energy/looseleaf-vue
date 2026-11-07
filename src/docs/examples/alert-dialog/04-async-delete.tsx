// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Async action (controlled)" as const,
  description: "A confirmation that does real work: the action keeps the dialog open while it runs (preventDefault), disables both answers, then closes it and the page reports the result." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const busy = shallowRef(initialState(false));
  const setBusy = stateSetter(busy);
  const gone = shallowRef(initialState(false));
  const setGone = stateSetter(gone);
  return () => {
    async function remove(e: MouseEvent) {
      e.preventDefault();
      setBusy(true);
      await new Promise(r => setTimeout(r, 900));
      setBusy(false);
      setGone(true);
      setOpen(false);
    }
    return <div class="flex flex-col items-center gap-3 text-center">
      <AlertDialog open={open.value} onOpenChange={o => !busy.value && setOpen(o)}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={gone.value}>
            {gone.value ? "Deleted" as const : "Delete project" as const}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent tone="danger" seed="async">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete the project?</AlertDialogTitle>
            <AlertDialogDescription>Its notebooks, drawings and comments go with it.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy.value}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={busy.value} onClick={remove}>
              {busy.value ? "Deleting…" as const : "Yes, delete it" as const}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p class="min-h-6 text-sm text-muted-foreground" aria-live="polite">
        {gone.value ? "The project was deleted." as const : "Nothing deleted yet." as const}
      </p>
    </div>;
  };
});
export default Example;
