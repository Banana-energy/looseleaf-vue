// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid";
export const meta = {
  title: "Developing" as const,
  description: "`develop` starts the picture milky and clears it. Change the key and it happens again; with reduced motion the picture is just there." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const n = shallowRef(initialState(0));
  const setN = stateSetter(n);
  return () => {
    return <div class="flex flex-col items-center gap-8 p-4">
      <Polaroid key={n.value} seed="dev" tape="top">
        <PolaroidImage scene="sea" develop seed="dev-img" />
        <PolaroidCaption>wait for it</PolaroidCaption>
      </Polaroid>
      <Button variant="secondary" onClick={() => setN(v => v + 1)}>
        Take another
      </Button>
    </div>;
  };
});
export default Example;
