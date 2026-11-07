// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tally } from "@/components/ui/tally";
export const meta = {
  title: "A vote board" as const,
  description: "Tallies beside the words they count. Each has its own accessible name (\"12 votes for tea\")." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const VOTES: Array<[string, number]> = [["Tea", 12], ["Coffee", 7], ["Hot chocolate", 4], ["Water, thanks", 1]];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="w-full max-w-sm" stock="index-card" tilt>
      <CardHeader>
        <CardTitle class="font-script text-2xl">What shall we drink?</CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="grid gap-2.5">
          {VOTES.map(([name, n]) => <li key={name} class="grid grid-cols-[8rem_1fr_auto] items-center gap-3 text-[17px]">
              {name}
              <Tally count={n} label={`${n} votes for ${name}`} animate />
              <span class="ll-num text-sm text-muted-foreground" aria-hidden="true">
                {n}
              </span>
            </li>)}
        </ul>
      </CardContent>
    </Card>;
  };
});
export default Example;
