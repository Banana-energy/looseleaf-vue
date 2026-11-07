// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Label as LabelPrimitive } from "@/lib/primitives";
import type { ArtDef } from "@/lib/ink/art/types";
import { drawSkeleton, memo } from "@/lib/ink/art-draw";
import { cn } from "@/lib/utils";
const STAR: ArtDef = {
  kind: "icon" as const,
  grid: 24,
  parts: [["s", "M12.3 4.4 L11.7 19.6", 1.25], ["s", "M4.9 8.3 L19.3 15.9", 1.25], ["s", "M18.7 8.6 L6.4 15.4", 1.25]],
  small: [["s", "M12.4 3.4 L11.6 20.6", 1.05], ["s", "M3.9 7.6 L20.2 16.6", 1.05], ["s", "M19.4 7.9 L5.4 16.1", 1.05]]
};
const RequiredMark = defineUi<{
  seed: string;
}>("RequiredMark", ["seed"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  const res = computed(() => memo(`label-star|${seed.value}`, () => drawSkeleton(STAR, 12, seed.value, {
    tone: "ui" as const,
    kind: "icon" as const
  })));
  return () => {
    return <svg data-slot="label-required" data-ink="icon" aria-hidden="true" focusable="false" viewBox={`0 0 ${res.value.w} ${res.value.h}`} class="pointer-events-none mt-px size-[0.8em] shrink-0 self-start overflow-visible text-red" innerHTML={res.value.svg} />;
  };
});
const Label = defineUi<UI.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
  seed?: string | number;
}>("Label", ["class", "required", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const required = computed(() => _props["required"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "required", "seed", "children"]));
  const id = useId();
  return () => {
    return <LabelPrimitive.Root data-slot="label" class={cn("flex items-center gap-1 font-hand text-[15px] leading-none font-bold text-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-pencil-text peer-disabled:cursor-not-allowed peer-disabled:text-pencil-text peer-has-[>input:disabled]:cursor-not-allowed peer-has-[>input:disabled]:text-pencil-text peer-has-[>textarea:disabled]:cursor-not-allowed peer-has-[>textarea:disabled]:text-pencil-text", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      {required.value && <RequiredMark seed={seed.value === undefined ? id : String(seed.value)} />}
    </LabelPrimitive.Root>;
  };
});
export { Label };
