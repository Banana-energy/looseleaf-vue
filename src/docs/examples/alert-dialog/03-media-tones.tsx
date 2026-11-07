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
  title: "Media tones" as const,
  description: "The round patch behind the media says what kind of question this is: highlighter for a plain confirmation, sky for information, red pencil for danger." as const,
  layout: "center" as const
};
const kinds = [{
  tone: "default" as const,
  trigger: "Publish" as const,
  icon: "circle-check" as const,
  title: "Publish now?" as const,
  body: "Everyone with the link will be able to read it. You can unpublish later." as const,
  ok: "Publish" as const
}, {
  tone: "info" as const,
  trigger: "Sign out" as const,
  icon: "info" as const,
  title: "Sign out everywhere?" as const,
  body: "You will be signed out of every device, including this one." as const,
  ok: "Sign out" as const
}, {
  tone: "danger" as const,
  trigger: "Clear history" as const,
  icon: "triangle-alert" as const,
  title: "Clear all history?" as const,
  body: "Every search and every draft will be removed from this device." as const,
  ok: "Clear it" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-3">
      {kinds.map(k => <AlertDialog key={k.tone}>
          <AlertDialogTrigger asChild>
            <Button variant="outline">{k.trigger}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent seed={k.tone}>
            <AlertDialogHeader>
              <AlertDialogMedia tone={k.tone}>
                <Icon name={k.icon} />
              </AlertDialogMedia>
              <AlertDialogTitle>{k.title}</AlertDialogTitle>
              <AlertDialogDescription>{k.body}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Not yet</AlertDialogCancel>
              <AlertDialogAction variant={k.tone === "danger" ? "destructive" as const : "default" as const}>{k.ok}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>)}
    </div>;
  };
});
export default Example;
