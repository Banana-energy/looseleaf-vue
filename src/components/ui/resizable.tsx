// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import * as ResizablePrimitive from "@/lib/resizable-primitive";
import { Icon } from "@/components/ui/icon";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { resizableRecipe } from "@/lib/ink/recipes/resizable-ink";
import { cn } from "@/lib/utils";
const SEAM_STATE = ["data-[separator=hover]:[&>svg_[data-layer=hover]]:visible data-[separator=hover]:[&>svg_[data-layer=hover]]:opacity-100", "data-[separator=active]:[&>svg_[data-layer=hover]]:opacity-0 data-[separator=active]:[&>svg_[data-layer=pressed]]:visible data-[separator=active]:[&>svg_[data-layer=pressed]]:opacity-100"].join(" ");
const GroupContext = createContext<{
  orientation: "horizontal" | "vertical";
  disabled: boolean;
}>({
  orientation: "horizontal" as const,
  disabled: false
});
const ResizablePanelGroup = defineUi<ResizablePrimitive.GroupProps>("ResizablePanelGroup", ["class", "orientation", "disabled", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const disabled = computed(() => _props["disabled"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "orientation", "disabled", "style"]));
  const context = computed(() => ({
    orientation: orientation.value,
    disabled: !!disabled.value
  }));
  return () => {
    return <GroupContext.Provider value={context.value}>
      <ResizablePrimitive.Group data-slot="resizable-panel-group" data-orientation={orientation.value} orientation={orientation.value} disabled={disabled.value} resizeTargetMinimumSize={{
        coarse: 37,
        fine: 24
      }} style={cssStyle({
        height: undefined,
        width: undefined,
        ...style.value
      })} class={cn("flex h-full w-full", className.value)} {...domProps(props.value)}>{_slots.default?.()}</ResizablePrimitive.Group>
    </GroupContext.Provider>;
  };
});
const ResizablePanel = defineUi<ResizablePrimitive.PanelProps>("ResizablePanel", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <ResizablePrimitive.Panel data-slot="resizable-panel" {...domProps(props.value)}>{_slots.default?.()}</ResizablePrimitive.Panel>;
  };
});
const ResizableHandle = defineUi<ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
  seed?: string | number;
}>("ResizableHandle", ["withHandle", "class", "disabled", "elementRef", "seed"], (_props, {
  slots: _slots
}) => {
  const withHandle = computed(() => _props["withHandle"]);
  const className = computed(() => _props["class"]);
  const disabled = computed(() => _props["disabled"]);
  const elementRef = computed(() => _props["elementRef"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["withHandle", "class", "disabled", "elementRef", "seed", "children"]));
  const group = useContext(GroupContext);
  const line = computed(() => group.value.orientation === "horizontal" ? "vertical" as const : "horizontal" as const);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: resizableRecipe,
    params: {
      line: line.value,
      grip: !!withHandle.value,
      disabled: !!(disabled.value ?? group.value.disabled)
    },
    kind: "seam" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <ResizablePrimitive.Separator data-slot="resizable-handle" disabled={disabled.value} elementRef={useMergedRef<HTMLDivElement>(hostRef, elementRef.value)} {...domProps(node.value ? hostProps.value : {})} class={cn("relative isolate flex shrink-0 items-center justify-center", line.value === "vertical" ? "w-2" as const : "h-2" as const, SEAM_STATE, className.value)} {...domProps(props.value)}>
      {node.value}
      {withHandle.value ? <div data-slot="resizable-handle-grip" class="pointer-events-none z-10 flex items-center justify-center">
          <Icon name="grip-vertical" size={14} class={line.value === "horizontal" ? "rotate-90" as const : undefined} />
        </div> : null}
      {readSlot(_slots.default)}
    </ResizablePrimitive.Separator>;
  };
});
export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
export { useDefaultLayout, useGroupRef, usePanelRef } from "@/lib/resizable-primitive";
export type { GroupImperativeHandle, Layout, LayoutStorage, PanelImperativeHandle } from "@/lib/resizable-primitive";
