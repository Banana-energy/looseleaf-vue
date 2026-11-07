// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export type ChipTone = "neutral" | "stable" | "new" | "experimental" | "count" | "outline";
export interface ChipProps extends UI.ComponentProps<"span"> {
  tone?: ChipTone;
  plain?: boolean;
}
const PLAIN: Record<ChipTone, string> = {
  neutral: "bg-secondary text-secondary-foreground" as const,
  stable: "bg-grass/45 text-ink" as const,
  new: "bg-marker/55 text-ink" as const,
  experimental: "bg-bubblegum/55 text-ink" as const,
  count: "bg-transparent text-ink-you font-script text-lg leading-none" as const,
  outline: "bg-transparent text-foreground shadow-[inset_0_0_0_1.5px_var(--ll-pencil-mark)]" as const
};
export const Chip = defineUi<ChipProps>("Chip", ["tone", "plain", "class"], (_props, {
  slots: _slots
}) => {
  const tone = computed(() => _props["tone"] === undefined ? "neutral" as const : _props["tone"]);
  const plain = computed(() => _props["plain"] === undefined ? false : _props["plain"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["tone", "plain", "class"]));
  return () => {
    if (plain.value) {
      return <span data-slot="chip" data-tone={tone.value} class={cn("inline-flex h-6 items-center px-2 font-hand text-sm font-bold whitespace-nowrap [border-radius:3px_7px_4px_8px/8px_3px_7px_3px]", PLAIN[tone.value], className.value)} {...domProps(props.value)}>{_slots.default?.()}</span>;
    }
    return <Badge data-tone={tone.value} variant={tone.value === "outline" || tone.value === "count" ? "outline" as const : tone.value === "neutral" ? "secondary" as const : "default" as const} tone={tone.value === "stable" ? "grass" as const : tone.value === "experimental" ? "bubblegum" as const : undefined} size={tone.value === "count" ? "sm" as const : "default" as const} class={cn(tone.value === "count" && "ll-num", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Badge>;
  };
});
export const StatusChip = defineUi<{
  status: "stable" | "new" | "experimental" | undefined;
  plain?: boolean;
}>("StatusChip", ["status", "plain"], (_props, {
  slots: _slots
}) => {
  const status = computed(() => _props["status"]);
  const plain = computed(() => _props["plain"]);
  return () => {
    if (!status.value) return null;
    return <Chip tone={status.value} plain={plain.value}>
      {status.value}
    </Chip>;
  };
});
