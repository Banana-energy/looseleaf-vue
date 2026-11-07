// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
export const meta = {
  title: "A shortcut sheet" as const,
  description: "Kbd next to the things it triggers: a search field that says how to reach it, and a cheat sheet in a card. The muted keys stay quiet; the words next to them do the talking." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const shortcuts = [{
  what: "Open the command palette" as const,
  keys: ["Ctrl", "K"]
}, {
  what: "Save the page" as const,
  keys: ["Ctrl", "S"]
}, {
  what: "Toggle the sidebar" as const,
  keys: ["Ctrl", "B"]
}, {
  what: "Find in page" as const,
  keys: ["Ctrl", "F"]
}, {
  what: "Close whatever is open" as const,
  keys: ["Esc"]
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-md" seed="shortcuts">
      <CardHeader>
        <CardTitle>Keyboard shortcuts</CardTitle>
        <CardDescription>Everything you can do without lifting a hand.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="relative">
          <Input placeholder="Search shortcuts" aria-label="Search shortcuts" class="pe-14" />
          <span class="pointer-events-none absolute inset-y-0 end-3 flex items-center">
            <Kbd>/</Kbd>
          </span>
        </div>
        <ul class="flex flex-col">
          {shortcuts.map((s, i) => <li key={s.what}>
              {i > 0 && <Separator variant="dashed" class="my-2" />}
              <div class="flex items-center justify-between gap-4">
                <span class="text-[15px]">{s.what}</span>
                <KbdGroup>
                  {s.keys.map((k, j) => <span key={k} class="inline-flex items-center gap-1">
                      {j > 0 && <span class="text-sm text-muted-foreground">+</span>}
                      <Kbd>{k}</Kbd>
                    </span>)}
                </KbdGroup>
              </div>
            </li>)}
        </ul>
      </CardContent>
    </Card>;
  };
});
export default Example;
