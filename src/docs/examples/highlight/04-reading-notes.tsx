// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Highlight } from "@/components/ui/highlight";
export const meta = {
  title: "Reading notes" as const,
  description: "Highlights inside a card: the swipe sits on the paper, behind the words, and the card's tilt never touches the text." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="w-full max-w-md" tape="top" tilt>
      <CardHeader>
        <CardTitle class="font-script text-2xl">Notes on Walden, ch. 2</CardTitle>
        <CardDescription>Read on the train, 14 March</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-3 text-[17px] leading-[1.55]">
        <p>
          &ldquo;I went to the woods because I wished to live deliberately,&rdquo; and then, a page later, <Highlight>to front only the essential facts of life</Highlight>.
        </p>
        <p>
          The part I keep coming back to is <Highlight tone="green">simplicity, simplicity, simplicity</Highlight>: he says it three times, as if the first two were not enough.
        </p>
        <p>
          <Highlight tone="pink" weight="light">Ask Sam what she thinks about the pond.</Highlight>
        </p>
      </CardContent>
    </Card>;
  };
});
export default Example;
