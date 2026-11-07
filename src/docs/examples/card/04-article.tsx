// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Article card" as const,
  description: "A card taped at the corners with a torn bottom edge, for something you would pin above your desk." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card tape="both" tapeKind="washi-dots" edge={{
      bottom: "torn" as const
    }} seed="article" class="mx-auto w-full max-w-md pb-8">
      <CardHeader>
        <CardDescription>Notebook - 4 min read</CardDescription>
        <CardTitle class="text-3xl">Why the margin is the best part</CardTitle>
      </CardHeader>
      <CardContent class="text-[15px] leading-relaxed">
        <p>Most of what I remember from a book is in the margins: an arrow, a question mark, a small argument with a dead author.</p>
      </CardContent>
      <CardFooter>
        <Button variant="link" size="sm" class="-ml-3">
          Keep reading
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
