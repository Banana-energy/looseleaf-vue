// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
export const meta = {
  title: "Custom" as const,
  description: "Official `spinner-custom`: a spinner is nothing more than a status role around an icon that turns, so you can build one from any glyph. Here the hand-drawn `loader-circle` spins with `animate-spin` (and stops for reduced motion, which Tailwind's utility alone does not do). A drawn icon must stay decorative, so the role and the name sit on a span around it instead of on the icon, as they do on the original's lucide svg." as const,
  layout: "center" as const
};
const Spinner = defineUi<UI.ComponentProps<"span">>("Spinner", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <span role="status" aria-label="Loading" class="inline-flex" {...domProps(props.value)}>
      <Icon name="loader-circle" class={cn("size-4 animate-spin motion-reduce:animate-none", className.value)} />
    </span>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-center gap-4">
      <Spinner />
    </div>;
  };
});
export default Example;
