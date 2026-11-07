// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useShapedSheet } from "@/hooks/use-paper-object";
import { dropShadow } from "@/lib/ink/paper/shadows";
import { PropSvg } from "@/lib/ink/paper/prop-svg";
import { useDensity, useInkSeed, useInkTier } from "@/lib/ink/vue";
import { clipboardBoardRecipe, clipboardClip, type BoardTone } from "@/lib/ink/recipes/clipboard-ink";
import { cn } from "@/lib/utils";
type ClipboardProps = UI.ComponentProps<"div"> & {
  tone?: BoardTone;
  tilt?: boolean | number;
  seed?: string | number;
  size?: readonly [number, number];
};
const Clipboard = defineUi<ClipboardProps>("Clipboard", ["class", "style", "tone", "tilt", "seed", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const tone = computed(() => _props["tone"] === undefined ? "hardboard" as const : _props["tone"]);
  const tilt = computed(() => _props["tilt"]);
  const seedProp = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "style", "children", "ref", "tone", "tilt", "seed", "size"]));
  const seed = useInkSeed(() => seedProp.value);
  const tier = useInkTier();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const o = useShapedSheet(() => ({
    recipe: clipboardBoardRecipe,
    params: {
      tone: tone.value
    },
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 1.2,
    size: size.value
  }));
  const clip = computed(() => clipboardClip(`${seed.value}|clip`, {
    width: 104,
    tier: tier.value,
    calm: calm.value
  }));
  return () => {
    return <div data-slot="clipboard" data-tone={tone.value} {...domProps(o.value.root)} {...domProps(props.value)} class={cn("relative isolate flex w-full max-w-md flex-col px-6 pt-14 pb-6", !o.value.ready && "bg-kraft shadow-card", className.value)} style={cssStyle({
      ...o.value.root.style,
      ...style.value
    })}>
      {o.value.node}
      {readSlot(_slots.default)}
      <PropSvg res={clip.value} kind="prop" data-slot="clipboard-clip" class="pointer-events-none absolute top-3 left-1/2 z-(--ll-z-prop) -translate-x-1/2 calm:hidden" style={cssStyle({
        filter: dropShadow("prop")
      })} />
    </div>;
  };
});
type ClipboardPaperProps = Omit<PaperProps, "stock" | "as"> & {
  stock?: PaperProps["stock"];
  as?: "div" | "section" | "article" | "form" | "fieldset";
};
const ClipboardPaper = defineUi<ClipboardPaperProps>("ClipboardPaper", ["class", "stock", "rules", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const rules = computed(() => _props["rules"] === undefined ? "ruled" as const : _props["rules"]);
  const as = computed(() => _props["as"] === undefined ? "div" as const : _props["as"]);
  const props = computed(() => omitProps(_props, ["class", "stock", "rules", "as"]));
  return () => {
    return <Paper data-slot="clipboard-paper" as={as.value} stock={stock.value} rules={rules.value} class={cn("-mt-6 flex min-h-64 flex-1 flex-col pt-18 pe-5 pb-5 ps-14 text-ink rtl:[&>[data-slot=paper-rules]]:-scale-x-100", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Paper>;
  };
});
export { Clipboard, ClipboardPaper };
export type { ClipboardProps, ClipboardPaperProps };
