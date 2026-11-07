// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Napkin, NapkinContent, NapkinFooter, NapkinTitle } from "@/components/ui/napkin";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "A note for the table" as const,
  description: "A real use: a guest writes a note on the napkin and pins it to the board. The napkin holds a form; its script font is only for what is written." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const note = shallowRef(initialState(""));
  const setNote = stateSetter(note);
  const sent = shallowRef(initialState(false));
  const setSent = stateSetter(sent);
  return () => {
    return <Napkin as="article" seed="table" class="mx-auto w-80 min-h-72 gap-3" aria-label="Note for the kitchen">
      <NapkinTitle>{sent.value ? "Sent!" as const : "For the kitchen" as const}</NapkinTitle>
      {sent.value ? <NapkinContent>{note.value || "(nothing, but thank you)"}</NapkinContent> : <>
          <Textarea aria-label="Your note" placeholder="allergies, birthdays, the very small pie..." value={note.value} onChange={(e: Event) => setNote((e.target as HTMLTextAreaElement).value)} class="min-h-24" />
          <NapkinFooter>
            <Button size="sm" onClick={() => setSent(true)}>
              Send it
            </Button>
          </NapkinFooter>
        </>}
    </Napkin>;
  };
});
export default Example;
