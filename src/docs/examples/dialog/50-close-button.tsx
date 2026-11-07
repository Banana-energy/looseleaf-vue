// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Share link" as const,
  description: "shadcn's `dialog-close-button`, written the same way: a read-only field, a footer aligned to the start and a Close button inside DialogClose. The corner x is still there; this one is the labeled way out." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
        </DialogHeader>
        <div class="flex items-center gap-2">
          <div class="grid flex-1 gap-2">
            <Label for="share-link" class="sr-only">
              Link
            </Label>
            <Input id="share-link" defaultValue="https://looseleaf-vue.banana-energy.cn/docs/installation" readonly />
          </div>
        </div>
        <DialogFooter class="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  };
});
export default Example;

