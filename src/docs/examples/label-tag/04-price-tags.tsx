// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelTag, LabelTagDescription, LabelTagPrice, LabelTagTitle } from "@/components/ui/label-tag";
export const meta = {
  title: "A shelf of price tags" as const,
  description: "A real use: a product shelf on a kraft card, two tags to a row. Each tag is a labeled group with its price as text; the string hangs from the shelf edge." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 420
};
const goods = [{
  name: "Felt tips" as const,
  note: "twelve colors" as const,
  price: "18.00" as const,
  twine: "tomato" as const
}, {
  name: "Washi tape" as const,
  note: "dots, of course" as const,
  price: "3.00" as const,
  twine: "sky" as const
}, {
  name: "Glue stick" as const,
  note: "acid free" as const,
  price: "2.10" as const,
  twine: "grass" as const
}, {
  name: "Notebook" as const,
  note: "spiral, ruled" as const,
  price: "6.40" as const,
  twine: "grape" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card stock="kraft" seed="shelf" class="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>The stationery shelf</CardTitle>
      </CardHeader>
      <CardContent class="mx-auto grid w-fit grid-cols-2 gap-x-16 gap-y-12 pt-6">
        {goods.map((g, i) => <LabelTag key={g.name} twine={g.twine} seed={g.name} tilt={i % 2 ? 2 : -2} role="group" aria-label={`${g.name}, ${g.price}`} stock={i % 2 ? "paper" as const : "index-card" as const}>
            <LabelTagTitle class="text-[1.4rem]">{g.name}</LabelTagTitle>
            <LabelTagDescription>{g.note}</LabelTagDescription>
            <LabelTagPrice>{g.price}</LabelTagPrice>
          </LabelTag>)}
      </CardContent>
    </Card>;
  };
});
export default Example;
