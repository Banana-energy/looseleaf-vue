// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { toast } from "@/lib/sonner-primitive";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Action and undo" as const,
  description: "The real pattern: do the thing at once, then offer to take it back. The action is a highlighter-marked button (a Looseleaf Button also works as the label); the page updates when you press it." as const,
  layout: "center" as const
};
const ID = "sonner-undo";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const notes = shallowRef(initialState(["Rain from six.", "Tea, two cups.", "Long letter to Ada."]));
  const setNotes = stateSetter(notes);
  return () => {
    function remove(index: number) {
      const gone = notes.value[index];
      setNotes(n => n.filter((_, i) => i !== index));
      toast("Note deleted", {
        toasterId: ID,
        description: `"${gone}"`,
        duration: 6000,
        action: {
          label: "Undo" as const,
          onClick: () => setNotes(n => [...n.slice(0, index), gone, ...n.slice(index)])
        },
        cancel: {
          label: "Dismiss" as const,
          onClick: () => {}
        }
      });
    }
    return <div class="grid w-full max-w-xs gap-2">
      {notes.value.map((n, i) => <div key={n} class="flex items-center justify-between gap-2 border-b border-dashed border-pencil-mark/60 py-1">
          <span>{n}</span>
          <Button size="xs" variant="ghost" onClick={() => remove(i)} aria-label={`Delete "${n}"`}>
            Delete
          </Button>
        </div>)}
      {notes.value.length === 0 && <p class="text-sm text-muted-foreground">Nothing left. Press Undo on the slip.</p>}
      <Toaster id={ID} closeButton />
    </div>;
  };
});
export default Example;
