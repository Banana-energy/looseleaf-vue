// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useEnsureInkDefs, useInkTier } from "@/lib/ink/vue";
import { memo } from "@/lib/ink/art-draw";
import { hashSeed } from "@/lib/ink/rng";
import { sealArt, sealMarkList, sealVariantList, type SealMark, type SealParams, type SealTone, type SealVariant } from "@/lib/ink/recipes/seal-ink";
import { cn } from "@/lib/utils";
const autoTilt = (seed: string): number => (hashSeed(seed) % 640 - 320) / 100;
function describe(p: {
  variant: SealVariant;
  text?: string;
  sub?: string;
  mark?: SealMark;
}): string {
  if (p.text) return p.sub ? `${p.text}, ${p.sub}` : p.text;
  if (p.mark === "check") return "Verified";
  if (p.mark === "star") return "Award";
  return `${p.variant} seal`;
}
type SealProps = Omit<UI.ComponentProps<"svg">, "children" | "viewBox" | "name"> & {
  variant?: SealVariant;
  text?: string;
  sub?: string;
  mark?: SealMark;
  tone?: SealTone;
  ribbon?: SealTone;
  ring?: string;
  deco?: "tick" | "star" | "sparkle" | "swoosh" | "percent";
  size?: number;
  tier?: "lo" | "hi";
  tilt?: number | "auto";
  shadow?: boolean;
  label?: string;
  decorative?: boolean;
  seed?: string | number;
};
const Seal = defineUi<SealProps>("Seal", ["variant", "text", "sub", "mark", "tone", "ribbon", "ring", "deco", "size", "tier", "tilt", "shadow", "label", "decorative", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"] === undefined ? "scallop" as const : _props["variant"]);
  const text = computed(() => _props["text"]);
  const sub = computed(() => _props["sub"]);
  const mark = computed(() => _props["mark"]);
  const tone = computed(() => _props["tone"]);
  const ribbon = computed(() => _props["ribbon"]);
  const ring = computed(() => _props["ring"]);
  const deco = computed(() => _props["deco"]);
  const size = computed(() => _props["size"] === undefined ? 96 : _props["size"]);
  const tierProp = computed(() => _props["tier"]);
  const tilt = computed(() => _props["tilt"] === undefined ? 0 : _props["tilt"]);
  const shadow = computed(() => _props["shadow"] === undefined ? true : _props["shadow"]);
  const label = computed(() => _props["label"]);
  const decorative = computed(() => _props["decorative"] === undefined ? false : _props["decorative"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["variant", "text", "sub", "mark", "tone", "ribbon", "ring", "deco", "size", "tier", "tilt", "shadow", "label", "decorative", "seed", "class", "style"]));
  useEnsureInkDefs();
  const providerTier = useInkTier();
  const tier = computed(() => tierProp.value ?? providerTier.value);
  const s = computed(() => `${seed.value ?? `${variant.value}:${text.value ?? mark.value ?? ""}`}`);
  const params = computed<SealParams>(() => ({
    variant: variant.value,
    text: text.value,
    sub: sub.value,
    mark: mark.value,
    tone: tone.value,
    ribbon: ribbon.value,
    ring: ring.value,
    deco: deco.value
  }));
  const px = computed(() => Math.max(16, Math.round(size.value)));
  const res = computed(() => memo(`seal|${px.value}|${tier.value}|${s.value}|${JSON.stringify(params.value)}`, () => sealArt(params.value, px.value, s.value, tier.value), 200));
  const deg = computed(() => tilt.value === "auto" ? autoTilt(s.value) : tilt.value);
  return () => {
    return <svg data-slot="seal" data-ink="badge" data-variant={variant.value} role={decorative.value ? undefined : "img" as const} aria-hidden={decorative.value ? true : undefined} aria-label={decorative.value ? undefined : label.value ?? describe({
      variant: variant.value,
      text: text.value,
      sub: sub.value,
      mark: mark.value
    })} focusable="false" viewBox={`0 0 ${res.value.w} ${res.value.h}`} width={res.value.w} height={res.value.h} style={cssStyle({
      ...(deg.value ? {
        rotate: tilt.value === "auto" ? `clamp(calc(var(--ll-tilt-max) * -1.6), ${deg.value}deg, calc(var(--ll-tilt-max) * 1.6))` : `${deg.value}deg`
      } : null),
      ...style.value
    })} class={cn("pointer-events-none inline-block shrink-0 overflow-visible align-middle", shadow.value && "ll-drop-sticker", className.value)} innerHTML={res.value.svg} {...domProps(props.value)} />;
  };
});
export { Seal, sealVariantList, sealMarkList };
export type { SealProps, SealVariant, SealMark };
