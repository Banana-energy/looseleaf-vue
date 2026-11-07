// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Responsive dialog" as const,
  description: "A dialog on wide screens and a drawer on phones, from one component. The media query is read with useSyncExternalStore, so the server renders the desktop dialog and the phone swaps in after hydration." as const,
  layout: "center" as const
};
function useMediaQuery(_source0: MaybeRefOrGetter<string>) {
  const query = computed(() => toValue(_source0));
  const _nestedHook0 = useExternalStore(notify => {
    const mq = window.matchMedia(query.value);
    mq.addEventListener("change", notify);
    return () => mq.removeEventListener("change", notify);
  }, () => window.matchMedia(query.value).matches);
  return computed(() => {
    return _nestedHook0.value;
  });
}
const ProfileForm = defineUi<{
  className?: string;
}>("ProfileForm", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  return () => {
    return <form class={"grid items-start gap-4 " + (className.value ?? "")}>
      <div class="grid gap-2">
        <Label for="rd-email">Email</Label>
        <Input type="email" id="rd-email" defaultValue="ada@analytical.engine" />
      </div>
      <div class="grid gap-2">
        <Label for="rd-username">Username</Label>
        <Input id="rd-username" defaultValue="@ada" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const desktop = useMediaQuery(() => "(min-width: 640px)");
  return () => {
    if (desktop.value) {
      return <Dialog open={open.value} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit profile</Button>
        </DialogTrigger>
        <DialogContent tape="top" tapeKind="kraft" seed="rd" class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>;
    }
    return <Drawer open={open.value} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DrawerTrigger>
      <DrawerContent seed="rd">
        <DrawerHeader class="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile here. Click save when you&apos;re done.</DrawerDescription>
        </DrawerHeader>
        <ProfileForm class="px-4" />
        <DrawerFooter class="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>;
  };
});
export default Example;
