// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { MARK_REVEAL, useMarkPhase } from "@/hooks/use-mark-ink";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { signatureRecipe, type SignatureFlourish } from "@/lib/ink/recipes/signature-ink";
import { cn } from "@/lib/utils";
const NAME_WIPE = "data-animate:data-[mark=idle]:[&>[data-slot=signature-name]]:[clip-path:inset(-10%_var(--ll-wipe-r,100%)_-10%_var(--ll-wipe-l,-4%))] data-animate:data-[mark=in]:[&>[data-slot=signature-name]]:animate-[ll-wipe_calc(var(--ll-dur-draw)*1.6)_var(--ll-ease-out)_var(--ll-name-delay,0s)_both]";
const SIZE: Record<"sm" | "md" | "lg", number> = {
  sm: 28,
  md: 44,
  lg: 64
};
const SIZE_CLASS: Record<"sm" | "md" | "lg", string> = {
  sm: "text-[28px]" as const,
  md: "text-[44px]" as const,
  lg: "text-[64px]" as const
};
const Signature = defineUi<UI.ComponentProps<"span"> & {
  flourish?: SignatureFlourish;
  size?: keyof typeof SIZE;
  tone?: MarkPen;
  weight?: MarkWeight;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
}>("Signature", ["flourish", "size", "tone", "weight", "animate", "show", "delay", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const flourish = computed(() => _props["flourish"] === undefined ? "swoosh" as const : _props["flourish"]);
  const size = computed(() => _props["size"] === undefined ? "md" as const : _props["size"]);
  const tone = computed(() => _props["tone"] === undefined ? "blue" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["flourish", "size", "tone", "weight", "animate", "show", "delay", "seed", "class", "style", "children", "ref"]));
  const fs = computed(() => SIZE[size.value]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: signatureRecipe,
    params: {
      flourish: flourish.value,
      tone: tone.value,
      weight: weight.value,
      fs: fs.value,
      animate: animate.value
    },
    kind: "signature" as const,
    seed: seed.value
  }));
  const _hook15 = useMarkPhase(() => ({
    animate: animate.value,
    show: show.value
  }));
  const phaseRef = computed(() => _hook15.value.phaseRef);
  const phaseProps = computed(() => _hook15.value.phaseProps);
  const ready = computed(() => !!node.value && show.value);
  const t = computed(() => delay.value ?? 0);
  return () => {
    return <span data-slot="signature" ref={useMergedRef<HTMLElement>(hostRef, phaseRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(ready.value ? hostProps.value : {})} {...domProps(phaseProps.value)} style={cssStyle({
      ...(animate.value ? {
        "--ll-name-delay": `${t.value}ms`,
        "--ll-draw-delay": `${t.value + 700}ms`
      } as UI.CSSProperties : undefined),
      ...style.value
    })} class={cn("relative isolate inline-block self-start justify-self-start outline-none pb-3 font-script leading-none whitespace-nowrap text-ink-you", tone.value === "ink" && "text-ink", SIZE_CLASS[size.value], animate.value && NAME_WIPE, animate.value && MARK_REVEAL, className.value)} {...domProps(props.value)}>
      <span data-slot="signature-name">{readSlot(_slots.default)}</span>
      {ready.value ? node.value : null}
    </span>;
  };
});
export { Signature };
