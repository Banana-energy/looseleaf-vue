// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
export const meta = {
  title: "Stubby is writing" as const,
  description: "For a page or a panel that is loading rather than a button: Stubby writes in three frames, flipped like a flip book, and the words say what they are waiting for. The role=status carries the name. With reduced motion he holds still with the scribble finished." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <Card seed="fetching">
        <CardHeader>
          <CardTitle>Fetching your notes</CardTitle>
          <CardDescription>Stubby is finding the right page.</CardDescription>
        </CardHeader>
        <CardContent class="flex justify-center py-2">
          <Spinner variant="write" size={80} aria-label="Fetching your notes" />
        </CardContent>
      </Card>
      <Card stock="index-card" seed="binding">
        <CardHeader>
          <CardTitle>Binding the book</CardTitle>
          <CardDescription>This takes a minute. Pencils are slow, and careful.</CardDescription>
        </CardHeader>
        <CardContent class="flex justify-center py-2">
          <Spinner variant="write" size={112} aria-label="Binding the book" />
        </CardContent>
      </Card>
    </div>;
  };
});
export default Example;
