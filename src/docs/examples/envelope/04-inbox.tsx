// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Envelope, EnvelopeAddress, EnvelopeFront, EnvelopeLetter, EnvelopeSender, EnvelopeTrigger } from "@/components/ui/envelope";
export const meta = {
  title: "An inbox" as const,
  description: "A real use: messages that arrive as envelopes. Opening one marks it read; only one is open at a time. State lives in your app; the envelope only shows it." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 560
};
const mail = [{
  id: "ada" as const,
  from: "Ada" as const,
  to: "You" as const,
  line: "The flap is up, and the letter comes out." as const,
  stamp: "tomato" as const
}, {
  id: "lin" as const,
  from: "Lin" as const,
  to: "You" as const,
  line: "The install page is written. Please read it." as const,
  stamp: "sky" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef<string | null>(initialState(null));
  const setOpen = stateSetter(open);
  const read = shallowRef<Record<string, boolean>>(initialState({}));
  const setRead = stateSetter(read);
  return () => {
    return <div class="mx-auto flex w-full max-w-xs flex-col gap-10 pt-2">
      {mail.map(m => <Envelope key={m.id} seed={m.id} stamp={m.stamp} open={open.value === m.id} onOpenChange={o => {
        setOpen(o ? m.id : null);
        if (o) setRead(r => ({
          ...r,
          [m.id]: true
        }));
      }}>
          <EnvelopeFront>
            <EnvelopeSender>{m.from}</EnvelopeSender>
            <EnvelopeAddress class="text-[1.1rem]">
              <p>{m.to}</p>
              <p>{read.value[m.id] ? "read" as const : "unread" as const}</p>
            </EnvelopeAddress>
            <EnvelopeTrigger>
              {read.value[m.id] ? "Reopen" as const : "Open" as const} the letter from {m.from}
            </EnvelopeTrigger>
          </EnvelopeFront>
          <EnvelopeLetter>
            <p class="font-script text-2xl leading-none font-bold">Dear you,</p>
            <p class="mt-1">{m.line}</p>
          </EnvelopeLetter>
        </Envelope>)}
      <Button variant="secondary" onClick={() => setOpen(null)} disabled={open.value === null}>
        Close them all
      </Button>
    </div>;
  };
});
export default Example;
