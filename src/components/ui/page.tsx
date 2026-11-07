// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { usePaperDecor } from "@/hooks/use-paper-object";
import type { EdgeSpec } from "@/lib/ink/paper/edges";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { pageRecipe, type PageHoles } from "@/lib/ink/recipes/page-ink";
import { titleMarkRecipe, type TitleMark } from "@/lib/ink/recipes/paper-set-ink";
import { cn } from "@/lib/utils";
type PageElement = "div" | "main" | "article" | "section" | "form";
type PageWidth = "sm" | "md" | "lg" | "xl" | "full";
type PageProps = Omit<PaperProps, "as" | "edge"> & {
  /** 页面内部纸张的真实 DOM 引用，供文档目录等测量逻辑使用。 */
  rootRef?: UI.Ref<HTMLElement>;
  as?: PageElement;
  width?: PageWidth;
  holes?: PageHoles | boolean;
  reinforced?: boolean;
  stain?: boolean;
  torn?: boolean | "top" | "bottom" | "both";
  edge?: EdgeSpec;
};
const WIDTH: Record<PageWidth, string> = {
  sm: "max-w-lg" as const,
  md: "max-w-2xl" as const,
  lg: "max-w-4xl" as const,
  xl: "max-w-6xl" as const,
  full: "max-w-none" as const
};
function tornEdge(torn: PageProps["torn"]): EdgeSpec | undefined {
  if (!torn) return undefined;
  if (torn === "both") return {
    top: "torn" as const,
    bottom: "torn" as const
  };
  if (torn === "bottom") return {
    bottom: "torn" as const
  };
  return {
    top: "torn" as const
  };
}
const Page = defineUi<PageProps>("Page", ["class", "rootRef", "as", "width", "holes", "reinforced", "stain", "torn", "edge", "tilt", "seed", "size", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const rootRef = computed(() => _props["rootRef"]);
  const as = computed(() => _props["as"] === undefined ? "div" as const : _props["as"]);
  const width = computed(() => _props["width"] === undefined ? "md" as const : _props["width"]);
  const holesProp = computed(() => _props["holes"] === undefined ? false : _props["holes"]);
  const reinforced = computed(() => _props["reinforced"] === undefined ? false : _props["reinforced"]);
  const stain = computed(() => _props["stain"] === undefined ? false : _props["stain"]);
  const torn = computed(() => _props["torn"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "rootRef", "ref", "as", "width", "holes", "reinforced", "stain", "torn", "edge", "tilt", "seed", "size", "style"]));
  const holes = computed<PageHoles>(() => holesProp.value === true ? "start" as const : holesProp.value || "none");
  const o = usePaperDecor(() => ({
    recipe: pageRecipe,
    params: {
      holes: holes.value,
      reinforce: reinforced.value,
      stain: stain.value
    },
    kind: "page" as const,
    ref: rootRef.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 0.35,
    size: size.value,
    enabled: holes.value !== "none" || stain.value
  }));
  return () => {
    return <Paper data-slot="page" data-holes={holes.value === "none" ? undefined : holes.value} as={as.value} edge={edge.value ?? tornEdge(torn.value)} size={size.value} {...domProps(o.value.paper)} {...domProps(props.value)} class={cn(o.value.paper.className, "mx-auto flex w-full flex-col gap-6 px-6 py-8 text-foreground sm:px-10 sm:py-10 rtl:[&>[data-slot=paper-rules]]:-scale-x-100", holes.value === "start" && "ps-14 sm:ps-[4.25rem]", holes.value === "top" && "pt-14 sm:pt-16", WIDTH[width.value], className.value)} style={cssStyle({
      ...o.value.paper.style,
      ...style.value
    })}>
      {o.value.decor}
      {readSlot(_slots.default)}
    </Paper>;
  };
});
const PageHeader = defineUi<UI.ComponentProps<"div">>("PageHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="page-header" class={cn("flex flex-col gap-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
type PageTitleProps = UI.ComponentProps<"h1"> & {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  underline?: TitleMark | "none";
  seed?: string | number;
};
const PageTitle = defineUi<PageTitleProps>("PageTitle", ["class", "as", "underline", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const as = computed(() => _props["as"] === undefined ? "h1" as const : _props["as"]);
  const underline = computed(() => _props["underline"] === undefined ? "single" as const : _props["underline"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "as", "underline", "seed"]));
  const Comp = computed(() => jsxTag(as.value as UI.ElementType));
  const drawn = computed(() => underline.value !== "none");
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: titleMarkRecipe,
    params: {
      kind: drawn.value ? underline.value : "single" as const
    },
    kind: "mark" as const,
    seed: seed.value,
    still: true
  }));
  const merged = computed(() => useMergedRef<HTMLElement>(drawn.value ? hostRef : undefined, ref.value as UI.Ref<HTMLElement>));
  return () => {
    return <Comp.value data-slot="page-title" ref={merged.value} {...domProps(drawn.value && node.value ? hostProps.value : {})} class={cn("relative isolate w-fit font-script text-[2.6rem] leading-[1.08] font-bold text-balance pb-1.5", className.value)} {...domProps(props.value)}>
      {drawn.value ? node.value : null}
      {readSlot(_slots.default)}
    </Comp.value>;
  };
});
const PageDescription = defineUi<UI.ComponentProps<"p">>("PageDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <p data-slot="page-description" class={cn("max-w-prose text-base text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</p>;
  };
});
const PageContent = defineUi<UI.ComponentProps<"div">>("PageContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="page-content" class={cn("flex flex-1 flex-col gap-4", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const PageFooter = defineUi<UI.ComponentProps<"div">>("PageFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="page-footer" class={cn("mt-auto flex items-center justify-between gap-4 pt-2 text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Page, PageHeader, PageTitle, PageDescription, PageContent, PageFooter };
export type { PageProps, PageTitleProps };
