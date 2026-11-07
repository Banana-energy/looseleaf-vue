// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Skeleton as Sketch } from "@/components/ui/skeleton";
import { cx } from "./cx";
const EmptyBody = vueLazy(() => import("./EmptyBody"));
export interface EmptyStateProps {
  title: string;
  children?: UI.VueNode;
  className?: string;
}
export const EmptyState = defineUi<EmptyStateProps>("EmptyState", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  return () => {
    return <Suspense fallback={null}>
      <EmptyBody {...domProps(props)}>{_slots.default?.()}</EmptyBody>
    </Suspense>;
  };
});
export const Skeleton = defineUi<{
  height?: number;
  label?: string;
  quiet?: boolean;
}>("Skeleton", ["height", "label", "quiet"], (_props, {
  slots: _slots
}) => {
  const height = computed(() => _props["height"] === undefined ? 120 : _props["height"]);
  const label = computed(() => _props["label"] === undefined ? "Loading" as const : _props["label"]);
  const quiet = computed(() => _props["quiet"] === undefined ? false : _props["quiet"]);
  return () => {
    if (quiet.value) {
      return <div class="dk-skeleton" style={cssStyle({
        minHeight: height.value
      })} aria-hidden="true">
        <Sketch class="w-full" style={cssStyle({
          height: height.value
        })} />
      </div>;
    }
    return <div class="dk-skeleton" style={cssStyle({
      minHeight: height.value
    })} role="status" aria-live="polite">
      <Sketch class="w-full" style={cssStyle({
        height: height.value
      })} />
      <span class="sr-only">{label.value}</span>
    </div>;
  };
});
export const VisuallyHidden = defineUi<UI.ComponentProps<"span">>("VisuallyHidden", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <span class={cx("sr-only", className.value)} {...domProps(props.value)}>{_slots.default?.()}</span>;
  };
});
