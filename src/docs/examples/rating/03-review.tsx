// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Rating } from "@/components/ui/rating";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "Review card" as const,
  description: "A real-world use: a read-only display (an image with a text alternative, so no tab stop), a form control with `name` and `required`, and a submit that reads the value from FormData." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sent = shallowRef(initialState(""));
  const setSent = stateSetter(sent);
  return () => {
    return <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Field Notes, No. 3</CardTitle>
        <CardDescription class="flex items-center gap-2">
          <Rating readOnly value={4.5} allowHalf size="sm" />
          <span>4.5 from 212 readers</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="review" class="grid gap-3" onSubmit={(e: SubmitEvent) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget as HTMLFormElement);
          setSent(`Thanks: ${d.get("stars")} stars`);
        }}>
          <Label id="your-rating">Your rating</Label>
          <Rating name="stars" required allowHalf aria-labelledby="your-rating" defaultValue={0} />
          <Label for="review-text">A few words</Label>
          <Textarea id="review-text" name="text" placeholder="The paper takes ink beautifully..." />
        </form>
      </CardContent>
      <CardFooter class="gap-3">
        <Button type="submit" form="review">
          Post review
        </Button>
        <span role="status" class="text-sm text-ink-muted">
          {sent.value}
        </span>
      </CardFooter>
    </Card>;
  };
});
export default Example;
