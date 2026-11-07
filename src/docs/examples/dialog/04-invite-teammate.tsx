// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Invite a teammate (controlled)" as const,
  description: "A real flow: a controlled dialog around a form. Submitting closes it and the page answers; the field is cleared for next time. Focus returns to the trigger." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const invited = shallowRef<string[]>(initialState([]));
  const setInvited = stateSetter(invited);
  const email = shallowRef(initialState(""));
  const setEmail = stateSetter(email);
  return () => {
    function submit(e: SubmitEvent) {
      e.preventDefault();
      if (!email.value.trim()) return;
      setInvited(l => [...l, email.value.trim()]);
      setEmail("");
      setOpen(false);
    }
    return <div class="flex flex-col items-center gap-3 text-center">
      <Dialog open={open.value} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Invite a teammate</Button>
        </DialogTrigger>
        <DialogContent tape="top" tapeKind="kraft" seed="invite" class="sm:max-w-sm">
          <form onSubmit={submit} class="grid gap-4">
            <DialogHeader>
              <DialogTitle>Invite a teammate</DialogTitle>
              <DialogDescription>They will get a link to this notebook by email.</DialogDescription>
            </DialogHeader>
            <div class="grid gap-2">
              <Label for="invite-email">Email</Label>
              <Input id="invite-email" type="email" placeholder="ada@analytical.engine" value={email.value} onChange={(e: Event) => setEmail((e.target as HTMLInputElement).value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Not now
              </Button>
              <Button type="submit">Send invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <p class="min-h-6 text-sm text-muted-foreground" aria-live="polite">
        {invited.value.length ? `Invited: ${invited.value.join(", ")}` : "Nobody invited yet." as const}
      </p>
    </div>;
  };
});
export default Example;
