// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Tabs as TabsPrimitive } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { usePaperDecor } from "@/hooks/use-paper-object";
import { useInkFaces } from "@/lib/ink/paper/sheet-layers";
import type { StockName } from "@/lib/ink/paper/stocks";
import { useMergedRef } from "@/lib/ink/vue";
import { folderBodyRecipe, folderTabRecipe } from "@/lib/ink/recipes/folder-ink";
import { cn } from "@/lib/utils";
const FolderContext = createContext<{
  stock: StockName;
}>({
  stock: "kraft" as const
});
type FolderProps = Omit<UI.ComponentProps<typeof TabsPrimitive.Root>, "orientation"> & {
  stock?: StockName;
};
const Folder = defineUi<FolderProps>("Folder", ["class", "stock"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const stock = computed(() => _props["stock"] === undefined ? "kraft" as const : _props["stock"]);
  const props = computed(() => omitProps(_props, ["class", "stock"]));
  const ctx = computed(() => ({
    stock: stock.value
  }));
  return () => {
    return <FolderContext.Provider value={ctx.value}>
      <TabsPrimitive.Root data-slot="folder" class={cn("flex w-full max-w-2xl flex-col", className.value)} {...domProps(props.value)} orientation="horizontal">{_slots.default?.()}</TabsPrimitive.Root>
    </FolderContext.Provider>;
  };
});
const FolderTabs = defineUi<UI.ComponentProps<typeof TabsPrimitive.List>>("FolderTabs", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <TabsPrimitive.List data-slot="folder-tabs" class={cn("relative z-10 flex items-end gap-1 ps-4 pe-4", className.value)} {...domProps(props.value)}>{_slots.default?.()}</TabsPrimitive.List>;
  };
});
const FolderTab = defineUi<UI.ComponentProps<typeof TabsPrimitive.Trigger>>("FolderTab", ["class", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const disabled = computed(() => _props["disabled"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "disabled"]));
  const _context5 = useContext(FolderContext);
  const stock = computed(() => _context5.value.stock);
  const {
    hostRef,
    hostProps,
    node
  } = useInkFaces(() => ({
    recipe: folderTabRecipe,
    params: {
      stock: stock.value,
      disabled: !!disabled.value
    },
    kind: "folder-tab" as const,
    still: true
  }));
  const merged = computed(() => useMergedRef<HTMLButtonElement>(hostRef, ref.value));
  return () => {
    return <TabsPrimitive.Trigger data-slot="folder-tab" ref={merged.value} disabled={disabled.value} {...domProps(node.value ? hostProps.value : {})} class={cn("relative isolate inline-flex h-9 items-center justify-center whitespace-nowrap px-6 pt-1 font-hand text-[15px] font-bold text-ink compact:h-8 compact:px-5 calm:h-7 calm:px-4", "cursor-pointer data-[state=active]:z-10 data-[state=active]:pt-0.5 data-[state=active]:text-ink disabled:cursor-not-allowed disabled:text-pencil-text", "data-[state=active]:[&>svg_[data-layer=hover]]:hidden", "forced-colors:data-[state=active]:bg-[Highlight] forced-colors:data-[state=active]:text-[HighlightText]", "not-data-[ink-ready]:border not-data-[ink-ready]:border-b-0 not-data-[ink-ready]:border-pencil-mark not-data-[ink-ready]:bg-index-card", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </TabsPrimitive.Trigger>;
  };
});
type FolderContentProps = Omit<UI.ComponentProps<typeof TabsPrimitive.Content>, "ref"> & Pick<PaperProps, "tilt" | "seed" | "edge" | "tape" | "tapeKind" | "fastener" | "fastenerTone" | "shadow" | "size"> & {
  crease?: boolean;
  ref?: UI.Ref<HTMLElement>;
};
const FolderContent = defineUi<FolderContentProps>("FolderContent", ["class", "crease", "tilt", "seed", "size", "edge", "tape", "tapeKind", "fastener", "fastenerTone", "shadow"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const crease = computed(() => _props["crease"] === undefined ? true : _props["crease"]);
  const tilt = computed(() => _props["tilt"] === undefined ? false : _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const edge = computed(() => _props["edge"]);
  const tape = computed(() => _props["tape"]);
  const tapeKind = computed(() => _props["tapeKind"]);
  const fastener = computed(() => _props["fastener"]);
  const fastenerTone = computed(() => _props["fastenerTone"]);
  const shadow = computed(() => _props["shadow"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "crease", "tilt", "seed", "size", "edge", "tape", "tapeKind", "fastener", "fastenerTone", "shadow"]));
  const _context14 = useContext(FolderContext);
  const stock = computed(() => _context14.value.stock);
  const o = usePaperDecor(() => ({
    recipe: folderBodyRecipe,
    params: {
      crease: crease.value
    },
    kind: "folder" as const,
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    size: size.value,
    enabled: crease.value
  }));
  return () => {
    return <TabsPrimitive.Content asChild {...domProps(props.value)}>
      <Paper data-slot="folder-content" stock={stock.value} rules="none" edge={edge.value} tape={tape.value} tapeKind={tapeKind.value} fastener={fastener.value} fastenerTone={fastenerTone.value} shadow={shadow.value} size={size.value} {...domProps(o.value.paper)} class={cn(o.value.paper.className, "min-h-40 px-6 pt-8 pb-6 text-ink", className.value)} style={cssStyle(o.value.paper.style)}>
        {o.value.decor}
        {readSlot(_slots.default)}
      </Paper>
    </TabsPrimitive.Content>;
  };
});
export { Folder, FolderTabs, FolderTab, FolderContent };
export type { FolderProps, FolderContentProps };
