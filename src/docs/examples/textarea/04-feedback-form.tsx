// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "A feedback form" as const,
  description: "Label, Input and a ruled Textarea in a real form: the note is required, and the button says what happened." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sent = shallowRef(initialState(false));
  const setSent = stateSetter(sent);
  return () => {
    return <form class="grid w-full max-w-md gap-5" onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      setSent(true);
    }}>
      <div class="grid gap-2">
        <Label for="fb-subject">Subject</Label>
        <Input id="fb-subject" name="subject" placeholder="The short version" />
      </div>
      <div class="grid gap-2">
        <Label for="fb-note" required>
          Your note
        </Label>
        <Textarea id="fb-note" name="note" ruled required showCount maxlength={400} placeholder="What should we know?" />
      </div>
      <Button type="submit" disabled={sent.value} class="justify-self-start">
        {sent.value ? "Sent, thank you" as const : "Send feedback" as const}
      </Button>
    </form>;
  };
});
export default Example;
