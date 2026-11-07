// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid";
import { Sticker } from "@/components/ui/sticker";
export const meta = {
  title: "A photo wall" as const,
  description: "A real composition: photographs at different tilts, overlapping a little, with a sticker stuck on. The window takes anything: here every picture is a drawn scene, in an app it would be an `img`." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 460
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex max-w-3xl flex-wrap items-start justify-center gap-y-10 p-6">
      <Polaroid tape="top" tilt={-3} seed="w1" class="-me-4 w-56">
        <PolaroidImage scene="house" seed="w1i" label="A yellow house" />
        <PolaroidCaption>home</PolaroidCaption>
      </Polaroid>
      <Polaroid fastener="pin" tilt={2.5} seed="w2" class="mt-8 w-56">
        <PolaroidImage scene="sea" date="'25 8 09" seed="w2i" label="A sailboat at sunset" />
        <PolaroidCaption>the ferry</PolaroidCaption>
      </Polaroid>
      <Polaroid tape="corner" tilt={-1.5} seed="w3" class="-ms-4 w-56">
        <PolaroidImage scene="night" seed="w3i" label="Roofs under a moon" />
        <PolaroidCaption>11pm</PolaroidCaption>
        <Sticker name="done" size={64} rotate={12} class="absolute -right-5 -bottom-4 z-10" />
      </Polaroid>
    </div>;
  };
});
export default Example;
