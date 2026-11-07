// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "Opening dialogs from a menu" as const,
  description: "shadcn's `dropdown-menu-dialog`: the dialogs live beside the menu, not inside it, and `onSelect` flips their open state. `modal={false}` on the menu keeps the page interactive while it closes, so focus lands in the dialog." as const,
  layout: "center" as const,
  height: 460
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const showNewDialog = shallowRef(initialState(false));
  const setShowNewDialog = stateSetter(showNewDialog);
  const showShareDialog = shallowRef(initialState(false));
  const setShowShareDialog = stateSetter(showShareDialog);
  return () => {
    return <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label="Open menu" size="icon-sm">
            <Icon name="ellipsis" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-40" align="end">
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>New File...</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>Share...</DropdownMenuItem>
            <DropdownMenuItem disabled>Download</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showNewDialog.value} onOpenChange={setShowNewDialog}>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>Provide a name for your new file. Click create when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <FieldGroup class="pb-3">
            <Field>
              <FieldLabel for="dmd-filename">File Name</FieldLabel>
              <Input id="dmd-filename" name="filename" placeholder="document.txt" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showShareDialog.value} onOpenChange={setShowShareDialog}>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription>Anyone with the link will be able to view this file.</DialogDescription>
          </DialogHeader>
          <FieldGroup class="py-3">
            <Field>
              <Label for="dmd-email">Email Address</Label>
              <Input id="dmd-email" name="email" type="email" placeholder="ada@looseleaf.example" autocomplete="off" />
            </Field>
            <Field>
              <FieldLabel for="dmd-message">Message (Optional)</FieldLabel>
              <Textarea id="dmd-message" name="message" placeholder="Check out this file" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
  };
});
export default Example;
