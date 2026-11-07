// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export const meta = {
  title: "Paper, edges and props" as const,
  description: "The sheet is a Paper: any stock, any edge, held down by tape, a clip or a pin. A torn edge is drawn once, when the dialog opens." as const,
  layout: "center" as const
};
const Note = defineUi<{
  label: string;
  title: string;
  children: string;
} & UI.ComponentProps<typeof DialogContent>>("Note", ["label", "title"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const title = computed(() => _props["title"]);
  const children = renderValue(() => readSlot(_slots.default));
  const content = computed(() => omitProps(_props, ["label", "title", "children"]));
  return () => {
    return <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{label.value}</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-sm" {...domProps(content.value)}>
        <DialogHeader>
          <DialogTitle>{title.value}</DialogTitle>
          <DialogDescription>{readSlot(_slots.default)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-3">
      <Note label="Kraft, taped" title="Handle with care" stock="kraft" tape="top" tapeKind="clear" seed="kraft">
        Kraft stock, one strip of clear tape across the top edge.
      </Note>
      <Note label="Torn page" title="Torn from a pad" stock="pad" edge={{
        bottom: "torn" as const,
        top: "torn" as const
      }} fastener="clip" seed="torn">
        A pad sheet torn top and bottom, held with a paper clip. The edge is drawn when the dialog opens.
      </Note>
      <Note label="Pinned" title="Sticky business" stock="sticky-yellow" fastener="pin" tilt={1.4} seed="sticky">
        A sticky note with a push-pin through it, turned a degree and a half.
      </Note>
    </div>;
  };
});
export default Example;
