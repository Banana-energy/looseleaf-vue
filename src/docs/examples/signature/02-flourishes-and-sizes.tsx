// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Signature } from "@/components/ui/signature";
export const meta = {
  title: "Flourishes, sizes and pens" as const,
  description: "A swoosh, an underline, none; three sizes; blue, ink and red pens. A signature keeps its own size in a row or a grid, so names of different sizes sit on one baseline with `self-baseline`." as const,
  layout: "stack" as const
};
const row = "flex flex-wrap items-baseline gap-x-10 gap-y-3";
const kicker = "mb-1 font-type text-xs text-muted-foreground";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-6">
      <div>
        <p class={kicker}>Flourish</p>
        <div class={row}>
          <Signature flourish="swoosh" class="self-baseline">Grace Hopper</Signature>
          <Signature flourish="underline" class="self-baseline">Grace Hopper</Signature>
          <Signature flourish="none" class="self-baseline">Grace Hopper</Signature>
        </div>
      </div>
      <div>
        <p class={kicker}>Size</p>
        <div class={row}>
          <Signature size="sm" class="self-baseline">Grace Hopper</Signature>
          <Signature size="md" class="self-baseline">Grace Hopper</Signature>
          <Signature size="lg" class="self-baseline">Grace Hopper</Signature>
        </div>
      </div>
      <div>
        <p class={kicker}>Pen</p>
        <div class={row}>
          <Signature class="self-baseline">Katherine J.</Signature>
          <Signature tone="ink" class="self-baseline">Katherine J.</Signature>
          <Signature tone="red" weight="brush" class="self-baseline">M. Curie</Signature>
        </div>
      </div>
    </div>;
  };
});
export default Example;
