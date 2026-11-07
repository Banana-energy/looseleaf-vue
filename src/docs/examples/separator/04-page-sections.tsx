// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Separator } from "@/components/ui/separator";
export const meta = {
  title: "Between the sections of a page" as const,
  description: "A torn strip where a page changes subject, a stitch where two things are joined, tape for the fold. Real headings and paragraphs stay real; the dividers are decoration." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <article class="mx-auto flex max-w-md flex-col gap-5">
      <section class="flex flex-col gap-1">
        <h3 class="font-script text-3xl font-bold">Saturday market</h3>
        <p class="text-[15px] leading-snug">Tomatoes that were still warm, a bag of plums, and a man selling only string.</p>
      </section>
      <Separator variant="torn" decorative={false} aria-label="End of the market notes" />
      <section class="flex flex-col gap-1">
        <h3 class="font-script text-3xl font-bold">Sunday, indoors</h3>
        <p class="text-[15px] leading-snug">Rain all morning. Mended the blue coat with orange thread and no regrets.</p>
      </section>
      <Separator variant="stitched" />
      <section class="flex flex-col gap-1">
        <h3 class="font-script text-3xl font-bold">Monday</h3>
        <p class="text-[15px] leading-snug">Back to the desk. Fold here.</p>
      </section>
      <Separator variant="tape" />
      <section class="flex flex-col gap-1">
        <h3 class="font-script text-3xl font-bold">Tuesday</h3>
        <p class="text-[15px] leading-snug">Nothing happened. Wrote it all down anyway.</p>
      </section>
    </article>;
  };
});
export default Example;
