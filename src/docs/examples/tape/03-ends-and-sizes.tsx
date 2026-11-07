// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Tape, type TapeProps } from "@/components/ui/tape";
export const meta = {
  title: "Ends and sizes" as const,
  description: "Tear it, pink it, cut it straight. Any length and width; the middle stretches, the ends keep their teeth." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const strips: {
  label: string;
  props: TapeProps;
}[] = [{
  label: "saw" as const,
  props: {
    kind: "masking" as const,
    ends: "saw" as const,
    length: 160,
    height: 24
  }
}, {
  label: "torn" as const,
  props: {
    kind: "masking" as const,
    ends: "torn" as const,
    length: 160,
    height: 24
  }
}, {
  label: "scissor" as const,
  props: {
    kind: "washi-dots" as const,
    ends: "scissor" as const,
    length: 160,
    height: 24,
    color: "sky" as const
  }
}, {
  label: "straight" as const,
  props: {
    kind: "washi-dots" as const,
    ends: "straight" as const,
    length: 160,
    height: 24,
    color: "grape" as const
  }
}, {
  label: "short, 64 x 18" as const,
  props: {
    kind: "washi-stripes" as const,
    length: 64,
    height: 18,
    color: "grass" as const
  }
}, {
  label: "wide, 220 x 34" as const,
  props: {
    kind: "kraft" as const,
    length: 220,
    height: 34
  }
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid grid-cols-2 gap-x-8 gap-y-7 p-4 sm:grid-cols-3">
      {strips.map(({
        label,
        props
      }) => <div key={label} class="flex flex-col items-start gap-2">
          <Tape {...domProps(props)} seed={label}>{_slots.default?.()}</Tape>
          <span class="text-sm text-muted-foreground">{label}</span>
        </div>)}
    </div>;
  };
});
export default Example;
