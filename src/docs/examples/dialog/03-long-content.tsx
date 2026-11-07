// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export const meta = {
  title: "Long content" as const,
  description: "The sheet never scrolls (its shadow and tape would be clipped): put tall content in DialogBody, and the header and footer stay put. Very tall dialogs scroll under the lamp." as const,
  layout: "center" as const
};
const clauses = ["You may keep this notebook as long as you like, and write in it in any color.", "Pages torn out belong to whoever holds them; margins belong to the reader.", "Doodles are protected speech. Coffee rings are an acceptable form of signature.", "If you find a pencil stub in the binding, it is yours, and it was always yours.", "We will never sell your handwriting. We could not read it either.", "By turning the page you agree to turn the next one, if there is a next one.", "Erasers are provided as a courtesy and may be worn down to nothing without notice.", "A drawing of a cat counts as a drawing of any cat, and the cat may object.", "Ink that bleeds through belongs to the page behind it.", "If the notebook is lost, it is not lost: it is simply somewhere else, being written in."];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Terms of the notebook</Button>
      </DialogTrigger>
      <DialogContent seed="terms" class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terms of the notebook</DialogTitle>
          <DialogDescription>Read to the end, or at least to the margin.</DialogDescription>
        </DialogHeader>
        <DialogBody class="max-h-56 space-y-3">
          {clauses.map((c, i) => <p key={i}>
              <span class="font-bold">{i + 1}. </span>
              {c}
            </p>)}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Decline</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>I agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  };
});
export default Example;
