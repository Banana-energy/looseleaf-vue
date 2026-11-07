// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Callout } from "@/components/ui/callout";
import { Circled } from "@/components/ui/circled";
import { Highlight } from "@/components/ui/highlight";
import { Paper } from "@/components/ui/paper";
import { Tally } from "@/components/ui/tally";
const Annotated = defineUi<{}>("Annotated", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper data-home="annotated" stock="paper" rules="ruled" tape="corner" seed="home-notes" class="w-full pt-4 pr-6 pb-5 pl-14">
      <p class="font-type text-sm leading-[28px] text-pencil-text">Reading notes / Tuesday</p>
      <p class="font-script text-[2.1rem] leading-[56px] font-bold text-ink">Same parts, new hand</p>
      <p class="text-[17px] leading-[28px]">
        Looseleaf keeps shadcn&rsquo;s API and swaps the skin. Every line is <Highlight>drawn by a pen with pressure</Highlight>, every fill sits{" "}
        <Circled tone="red" animate>
          clean inside it
        </Circled>
        , and no two buttons are quite alike.
      </p>
      <div class="flex justify-end pe-2">
        <Callout direction="up-left" animate delay={500}>
          on purpose!
        </Callout>
      </div>
      <div class="flex items-center gap-3 text-sm leading-[28px] text-pencil-text">
        times I have said &ldquo;hand-drawn&rdquo; <Tally count={7} size="md" animate />
      </div>
    </Paper>;
  };
});
export default Annotated;
