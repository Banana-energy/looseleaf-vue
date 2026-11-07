// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Scribble } from "@/components/ui/scribble";
export const meta = {
  title: "Pens" as const,
  description: "Ink brush, a fine liner that leaves the words readable, red felt, blue felt and soft pencil: one change of mind each." as const,
  layout: "stack" as const
};
const row = "grid grid-cols-[6.5rem_1fr] items-baseline gap-x-4";
const pen = "font-type text-xs text-muted-foreground";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <dl class="grid gap-y-3 text-[17px] leading-[1.55]">
      <div class={row}>
        <dt class={pen}>Ink brush</dt>
        <dd>
          Meet on <Scribble>Tuesday</Scribble> Thursday.
        </dd>
      </div>
      <div class={row}>
        <dt class={pen}>Fine liner</dt>
        <dd>
          The password is <Scribble weight="fine">hunter2</Scribble>, still readable.
        </dd>
      </div>
      <div class={row}>
        <dt class={pen}>Red felt</dt>
        <dd>
          Total <Scribble tone="red">14.10</Scribble> 12.00.
        </dd>
      </div>
      <div class={row}>
        <dt class={pen}>Blue felt</dt>
        <dd>
          Call <Scribble tone="blue">Ada</Scribble> Jo about the tomatoes.
        </dd>
      </div>
      <div class={row}>
        <dt class={pen}>Soft pencil</dt>
        <dd>
          Pick up <Scribble tone="pencil">milk</Scribble> oat milk.
        </dd>
      </div>
    </dl>;
  };
});
export default Example;
