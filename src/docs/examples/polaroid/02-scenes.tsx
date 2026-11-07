// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid";
export const meta = {
  title: "Four scenes, four ways to hold it up" as const,
  description: "Hills, sea, a house and a night sky, drawn in marker and felt tip. Taped, pinned, clipped and washi-taped; the sea has a date stamp." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container w-full">
      <div class="grid grid-cols-2 justify-items-center gap-x-6 gap-y-12 p-6 @3xl:grid-cols-4">
        <Polaroid tape="top" seed="p1" class="w-full max-w-56">
          <PolaroidImage scene="hills" seed="s1" />
          <PolaroidCaption>august, finally</PolaroidCaption>
        </Polaroid>
        <Polaroid fastener="pin" seed="p2" class="w-full max-w-56">
          <PolaroidImage scene="sea" date="'25 8 09" seed="s2" />
          <PolaroidCaption>the ferry home</PolaroidCaption>
        </Polaroid>
        <Polaroid fastener="clip" seed="p3" class="w-full max-w-56">
          <PolaroidImage scene="house" seed="s3" />
          <PolaroidCaption>gran&apos;s house</PolaroidCaption>
        </Polaroid>
        <Polaroid tape="both" tapeKind="washi-dots" seed="p4" class="w-full max-w-56">
          <PolaroidImage scene="night" date="'25 9 24" seed="s4" />
          <PolaroidCaption>last night, 11pm</PolaroidCaption>
        </Polaroid>
      </div>
    </div>;
  };
});
export default Example;
