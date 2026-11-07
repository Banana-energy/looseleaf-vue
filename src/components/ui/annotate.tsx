// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Circled } from "@/components/ui/circled";
import { Highlight } from "@/components/ui/highlight";
import { Scribble } from "@/components/ui/scribble";
import { Strike } from "@/components/ui/strike";
import { Underline } from "@/components/ui/underline";
import type { HighlightTone, MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import type { UnderlineKind } from "@/lib/ink/recipes/underline-ink";
export type AnnotateType = "underline" | "box" | "circle" | "highlight" | "strike-through" | "crossed-off" | "brackets" | "scribble";
type Common = {
  type: AnnotateType;
  color?: HighlightTone | MarkPen;
  weight?: MarkWeight;
  kind?: UnderlineKind;
  show?: boolean;
  animate?: boolean;
  delay?: number;
  seed?: string | number;
  className?: string;
  children?: UI.ReactNode;
};
const HIGHLIGHTS: readonly string[] = ["yellow", "pink", "green", "blue", "orange", "lilac", "teal"];
const PENS: readonly string[] = ["ink", "blue", "red", "green", "pencil", "marker", "orange"];
const Annotate = defineUi<Common & Omit<UI.ComponentProps<"span">, keyof Common | "color">>("Annotate", ["type", "color", "weight", "kind"], (_props, {
  slots: _slots
}) => {
  const type = computed(() => _props["type"]);
  const color = computed(() => _props["color"]);
  const weight = computed(() => _props["weight"]);
  const kind = computed(() => _props["kind"]);
  const props = computed(() => omitProps(_props, ["type", "color", "weight", "kind"]));
  const pen = computed<MarkPen | undefined>(() => color.value && PENS.includes(color.value) ? color.value as MarkPen : undefined);
  const tone = computed<HighlightTone | undefined>(() => color.value && HIGHLIGHTS.includes(color.value) ? color.value as HighlightTone : undefined);
  return () => {
    switch (type.value) {
      case "highlight":
        return <Highlight data-annotate={type.value} tone={tone.value} weight={weight.value === "fine" ? "light" as const : weight.value === "brush" ? "heavy" as const : undefined} {...domProps(props.value as UI.ComponentProps<"mark">)} />;
      case "underline":
        return <Underline data-annotate={type.value} kind={kind.value} tone={pen.value} weight={weight.value} {...domProps(props.value)}>{_slots.default?.()}</Underline>;
      case "circle":
        return <Circled data-annotate={type.value} shape="circle" tone={pen.value} weight={weight.value} {...domProps(props.value)}>{_slots.default?.()}</Circled>;
      case "box":
        return <Circled data-annotate={type.value} shape="box" tone={pen.value} weight={weight.value} {...domProps(props.value)}>{_slots.default?.()}</Circled>;
      case "brackets":
        return <Circled data-annotate={type.value} shape="brackets" tone={pen.value} weight={weight.value} {...domProps(props.value)}>{_slots.default?.()}</Circled>;
      case "strike-through":
        return <Strike data-annotate={type.value} kind="single" tone={pen.value} weight={weight.value} {...domProps(props.value as UI.ComponentProps<"s">)} />;
      case "crossed-off":
        return <Strike data-annotate={type.value} kind="cross" tone={pen.value} weight={weight.value} {...domProps(props.value as UI.ComponentProps<"s">)} />;
      case "scribble":
        return <Scribble data-annotate={type.value} tone={pen.value} weight={weight.value} {...domProps(props.value)}>{_slots.default?.()}</Scribble>;
      default:
        return <span {...domProps(props.value)}>{_slots.default?.()}</span>;
    }
  };
});
export { Annotate };
