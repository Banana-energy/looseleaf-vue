// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
export type CalloutTone = "note" | "tip" | "warn" | "error" | "todo";
export interface CalloutProps extends Omit<UI.ComponentProps<"div">, "title"> {
  tone?: CalloutTone;
  title?: UI.VueNode;
}
const LABELS: Record<CalloutTone, string> = {
  note: "Note" as const,
  tip: "Tip" as const,
  warn: "Careful" as const,
  error: "Problem" as const,
  todo: "Still drawing" as const
};
const VARIANT = {
  note: "note" as const,
  tip: "success" as const,
  warn: "warning" as const,
  error: "destructive" as const,
  todo: "info" as const
} as const;
const GLYPH = {
  note: null,
  tip: "lightbulb" as const,
  warn: "triangle-alert" as const,
  error: "circle-alert" as const,
  todo: "pencil" as const
} as const;
export const Callout = defineUi<CalloutProps>("Callout", ["tone", "title", "class"], (_props, {
  slots: _slots
}) => {
  const tone = computed(() => _props["tone"] === undefined ? "note" as const : _props["tone"]);
  const title = computed(() => _props["title"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["tone", "title", "class", "children"]));
  const glyph = computed(() => GLYPH[tone.value]);
  return () => {
    return <Alert variant={VARIANT[tone.value]} data-tone={tone.value} role={tone.value === "error" ? "alert" as const : "note" as const} aria-label={typeof title.value === "string" ? undefined : LABELS[tone.value]} class={cn("my-2 text-[15px] [&_p+p]:mt-2 [&_pre]:max-w-full", className.value)} {...domProps(props.value)}>
      {glyph.value ? <Icon name={glyph.value} size={16} /> : null}
      {title.value ? <AlertTitle class="line-clamp-none font-script text-xl leading-tight">{title.value}</AlertTitle> : null}
      <AlertDescription class="text-foreground">{readSlot(_slots.default)}</AlertDescription>
    </Alert>;
  };
});
