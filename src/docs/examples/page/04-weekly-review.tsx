// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Page, PageContent, PageDescription, PageFooter, PageHeader, PageTitle } from "@/components/ui/page";
import { Sticker } from "@/components/ui/sticker";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "A weekly review" as const,
  description: "A real page: three-hole punched, a form on it, a sticker stuck to the corner. Everything on the sheet is ordinary, accessible DOM." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const done = ["Ink the outline", "Wash the sky, then wait", "Hatch the shade"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Page as="article" holes reinforced seed="review" width="md" aria-labelledby="review-title">
      <Sticker name="done" size={72} rotate={8} class="absolute -top-5 -right-3 z-10" />
      <PageHeader>
        <PageTitle id="review-title">Weekly review</PageTitle>
        <PageDescription>What got finished, what did not, and one thing to try on Monday.</PageDescription>
      </PageHeader>
      <PageContent>
        <fieldset class="space-y-2">
          <legend class="mb-2 font-bold">Finished</legend>
          {done.map((item, i) => <div key={item} class="flex items-center gap-3">
              <Checkbox id={`review-${i}`} defaultChecked={i < 2} />
              <Label for={`review-${i}`}>{item}</Label>
            </div>)}
        </fieldset>
        <div class="space-y-2">
          <Label for="review-note">One thing for Monday</Label>
          <Textarea id="review-note" ruled placeholder="Start with the sky." />
        </div>
      </PageContent>
      <PageFooter>
        <span class="ll-num">week 39</span>
        <Button>File it</Button>
      </PageFooter>
    </Page>;
  };
});
export default Example;
