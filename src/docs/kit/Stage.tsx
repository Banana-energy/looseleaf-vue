// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { InkTiles } from "@/lib/ink/vue";
import type { ExampleMeta } from "../types";
import { cx } from "./cx";
export interface StageProps {
  layout?: ExampleMeta["layout"];
  height?: number;
  label?: string;
  surface?: "paper" | "desk";
  contain?: boolean;
  className?: string;
  children: UI.VueNode;
}
const INNER: Record<NonNullable<ExampleMeta["layout"]>, string> = {
  center: "flex w-full min-h-[inherit] flex-wrap items-center justify-center gap-4 px-4 py-10 sm:px-6" as const,
  stack: "mx-auto flex w-full min-h-[inherit] max-w-xl flex-col items-start gap-4 px-4 py-8 sm:px-6" as const,
  full: "block w-full min-h-[inherit]" as const
};
const DESK_TILES = ["linen"] as const;
function swallowPlaceholderLinks(event: MouseEvent) {
  if (!(event.target as HTMLElement instanceof Element)) return;
  const link = (event.target as HTMLElement).closest("a[href]");
  const href = link?.getAttribute("href");
  if (href === "#" || href === "") event.preventDefault();
}
export const Stage = defineUi<StageProps>("Stage", ["layout", "height", "label", "surface", "contain", "class"], (_props, {
  slots: _slots
}) => {
  const layout = computed(() => _props["layout"] === undefined ? "center" as const : _props["layout"]);
  const height = computed(() => _props["height"]);
  const label = computed(() => _props["label"] === undefined ? "Preview" as const : _props["label"]);
  const surface = computed(() => _props["surface"] === undefined ? "paper" as const : _props["surface"]);
  const contain = computed(() => _props["contain"] === undefined ? false : _props["contain"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const style = computed<UI.CSSProperties | undefined>(() => height.value ? {
    minHeight: height.value
  } : undefined);
  const scroll = computed(() => cx("min-w-0 max-w-full overflow-auto", contain.value && "[transform:translateZ(0)]"));
  const inner = renderValue(() => <div data-slot="stage-inner" class={cx("dk-stage-inner", INNER[layout.value])}>
      {children.value}
    </div>);
  const shared = computed(() => ({
    role: "group" as const,
    "aria-label": label.value,
    "data-layout": layout.value,
    "data-slot": "stage" as const,
    onClickCapture: swallowPlaceholderLinks,
    style: style.value
  }) as const);
  const minHeight = computed(() => layout.value === "center" && "min-h-44");
  return () => {
    if (surface.value === "desk") {
      return <>
        <InkTiles tiles={DESK_TILES} />
        <div {...domProps(shared.value)} class={cx("dk-stage ll-desk relative isolate shadow-[inset_0_0_18px_-2px_rgb(var(--ll-shade)/0.4)]", scroll.value, minHeight.value, className.value)}>
          {inner.value}
        </div>
      </>;
    }
    return <Paper {...domProps(shared.value)} stock={layout.value === "full" ? "paper" as const : "dot-grid" as const} tilt={false} shadow="slip" class={cx("dk-stage min-w-0 max-w-full", minHeight.value, className.value)}>
      <div data-slot="stage-scroll" class={cx("min-h-[inherit]", scroll.value)}>
        {inner.value}
      </div>
    </Paper>;
  };
});
