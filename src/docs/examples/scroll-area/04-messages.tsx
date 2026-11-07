// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
export const meta = {
  title: "Message log" as const,
  description: "A real screen: a fixed-height log inside a card, with the newest line kept in view, `bleed` so the edge buttons keep their rings, and an input below. The scroll mark shows while the log is being scrolled." as const,
  layout: "center" as const,
  height: 480
};
const first = [["Ada", "Did the tabs land?"], ["Jo", "Yes, and the binder ones too."], ["Ada", "Lovely. Can you look at the table rules?"], ["Jo", "Pencil, by hand. They wander a little."], ["Ada", "Good. That is the point."], ["Mika", "I redrew the checkbox tick again."], ["Jo", "Which of the four?"], ["Mika", "The one that overshoots."]];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const lines = shallowRef<string[][]>(initialState(first));
  const setLines = stateSetter(lines);
  const draft = shallowRef(initialState(""));
  const setDraft = stateSetter(draft);
  const end = shallowRef<HTMLDivElement | null>(null);
  watchDependencies(() => {
    if (lines.value.length > first.length) end.value?.scrollIntoView({
      block: "nearest" as const
    });
  }, () => [lines.value], false);
  return () => {
    return <Card seed="messages" class="w-full max-w-sm gap-4">
      <CardHeader>
        <CardTitle>Studio</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea type="always" bleed class="-m-3 h-56" aria-label="Messages">
          <ol class="grid gap-3 text-sm">
            {lines.value.map(([who, text], i) => <li key={i} class="grid">
                <span class="font-bold">{who}</span>
                <span class="text-muted-foreground">{text}</span>
              </li>)}
          </ol>
          <div ref={end} />
        </ScrollArea>
      </CardContent>
      <CardFooter class="gap-2">
        <Input aria-label="Your message" placeholder="Say something" value={draft.value} onChange={(e: Event) => setDraft((e.target as HTMLInputElement).value)} />
        <Button size="sm" disabled={!draft.value.trim()} onClick={() => {
          setLines(l => [...l, ["You", draft.value.trim()]]);
          setDraft("");
        }}>
          Send
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
