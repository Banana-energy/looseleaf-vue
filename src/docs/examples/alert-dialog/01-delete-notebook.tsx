// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Delete (danger)" as const,
  description: "The risky question: hazard tape across the top corners, a red patch behind the icon, and a hatched destructive answer. Focus starts on Cancel." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete notebook</Button>
      </AlertDialogTrigger>
      <AlertDialogContent tone="danger" seed="delete">
        <AlertDialogHeader>
          <AlertDialogMedia tone="danger">
            <Icon name="trash" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this notebook?</AlertDialogTitle>
          <AlertDialogDescription>This will permanently delete &ldquo;Field notes&rdquo; and its 48 pages. You cannot undo this.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete notebook</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
  };
});
export default Example;
