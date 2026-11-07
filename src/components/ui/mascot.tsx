// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { cn } from "@/lib/utils";
import { useEnsureInkDefs } from "@/lib/ink/vue";
import { mascot, mascotProps, type MascotPose } from "@/lib/ink/art/mascots";
import { drawMascot } from "@/lib/ink/art/mascot-draw";
import { memo } from "@/lib/ink/art-draw";
import type { ArtDef } from "@/lib/ink/art/types";
const frames = mascotProps.frames as Record<string, ArtDef>;
const Mascot = defineUi<Omit<UI.ComponentProps<"svg">, "children" | "viewBox"> & {
  pose?: MascotPose | string & {};
  size?: number;
  seed?: string | number;
  label?: string;
  frame?: number;
  tier?: "lo" | "hi";
  shadow?: boolean;
}>("Mascot", ["pose", "size", "seed", "label", "frame", "tier", "shadow", "class", "style"], (_props, {
  slots: _slots
}) => {
  const pose = computed(() => _props["pose"] === undefined ? "idle" as const : _props["pose"]);
  const size = computed(() => _props["size"] === undefined ? 96 : _props["size"]);
  const seed = computed(() => _props["seed"]);
  const label = computed(() => _props["label"]);
  const frame = computed(() => _props["frame"]);
  const tier = computed(() => _props["tier"] === undefined ? "lo" as const : _props["tier"]);
  const shadow = computed(() => _props["shadow"] === undefined ? true : _props["shadow"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["pose", "size", "seed", "label", "frame", "tier", "shadow", "class", "style"]));
  useEnsureInkDefs();
  const _nestedHook0 = useId();
  const uid = computed(() => _nestedHook0.replace(/[^a-zA-Z0-9]/g, ""));
  const flip = computed(() => frame.value === undefined ? undefined : frames[`${pose.value}-${frame.value}`]);
  const def = computed(() => flip.value ?? (mascot as Record<string, ArtDef>)[pose.value]);
  return () => {
    if (!def.value) return null;
    const px = Math.max(16, Math.round(size.value));
    const res = memo(`mascot|${pose.value}|${flip.value ? frame.value : "" as const}|${px}|${tier.value}|${seed.value ?? ""}|${uid.value}`, () => drawMascot(def.value, px, seed.value ?? pose.value, {
      tier: tier.value,
      idPrefix: `ll-${uid.value}`
    }), 240);
    return <svg data-slot="mascot" data-ink="mascot" data-pose={pose.value} data-frame={flip.value ? frame.value : undefined} aria-hidden={label.value ? undefined : true} role={label.value ? "img" as const : undefined} aria-label={label.value} focusable="false" viewBox={`0 0 ${res.w} ${res.h}`} width={res.w} height={res.h} style={cssStyle(style.value)} class={cn("pointer-events-none shrink-0 overflow-visible", shadow.value && "ll-drop-sticker", className.value)} innerHTML={res.svg} {...domProps(props.value)} />;
  };
});
export { Mascot };
export type { MascotPose };
