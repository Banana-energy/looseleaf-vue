// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { typingGeometry, typingIndicatorRecipe, type TypingVariant } from "@/lib/ink/recipes/typing-indicator-ink";
import { cn } from "@/lib/utils";
const CSS = `
@keyframes ll-type-dot{0%,8%{opacity:0;transform:scale(.3)}20%{opacity:1;transform:scale(1.3)}30%,100%{opacity:1;transform:scale(1)}}
@keyframes ll-type-hop{0%,10%{translate:calc(var(--ll-type-span)*-1) 0}30%,40%{translate:calc(var(--ll-type-span)*-.5) 0}48%,100%{translate:0 0}}
@keyframes ll-type-wipe{0%{clip-path:inset(-20% 100% -20% -6%)}80%,100%{clip-path:inset(-20% -6% -20% -6%)}}
@keyframes ll-type-walk{0%{translate:calc(var(--ll-type-span)*-1) 0}80%,100%{translate:0 0}}
[data-slot=typing-indicator] [data-part^=dot]{transform-box:fill-box;transform-origin:50% 50%}
`;
const SIZE: Record<TypingVariant, readonly [number, number]> = {
  dots: [56, 24],
  squiggle: [80, 24]
};
const DOTS_ANIM = "[&>svg_[data-part^=dot]]:animate-[ll-type-dot_2s_ease-out_infinite_both] [&>svg_[data-part=dot-2]]:[animation-delay:0.4s] [&>svg_[data-part=dot-3]]:[animation-delay:0.8s] [&>svg_[data-part=pencil]]:animate-[ll-type-hop_2s_ease-in-out_infinite_both]";
const SQUIGGLE_ANIM = "[&>svg_[data-part=line]]:animate-[ll-type-wipe_2.2s_ease-in-out_infinite_both] [&>svg_[data-part=pencil]]:animate-[ll-type-walk_2.2s_ease-in-out_infinite_both]";
const TypingIndicator = defineUi<Omit<UI.ComponentProps<"div">, "children"> & {
  variant?: TypingVariant;
  pen?: "ink" | "you";
  pencil?: boolean;
  active?: boolean;
  label?: string;
  seed?: string | number;
}>("TypingIndicator", ["variant", "pen", "pencil", "active", "label", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"] === undefined ? "dots" as const : _props["variant"]);
  const pen = computed(() => _props["pen"] === undefined ? "ink" as const : _props["pen"]);
  const pencil = computed(() => _props["pencil"] === undefined ? true : _props["pencil"]);
  const active = computed(() => _props["active"] === undefined ? true : _props["active"]);
  const label = computed(() => _props["label"] === undefined ? "Typing" as const : _props["label"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["variant", "pen", "pencil", "active", "label", "seed", "class", "style", "ref"]));
  const w = computed(() => SIZE[variant.value][0]);
  const h = computed(() => SIZE[variant.value][1]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: typingIndicatorRecipe,
    params: {
      variant: variant.value,
      pen: pen.value,
      pencil: pencil.value
    },
    kind: "typing" as const,
    seed: seed.value,
    size: [w.value, h.value],
    still: true
  }));
  const span = computed(() => typingGeometry(w.value, h.value, variant.value).span);
  return () => {
    return <>
      <style>
        {CSS}
      </style>
      <div data-slot="typing-indicator" data-variant={variant.value} data-active={active.value ? "" as const : undefined} role="status" aria-live="polite" ref={useMergedRef<HTMLElement>(active.value ? hostRef : undefined, ref.value as UI.Ref<HTMLElement> | undefined) as UI.Ref<HTMLDivElement>} {...domProps(active.value ? hostProps.value : {})} style={cssStyle({
        "--ll-type-span": `${span.value}px`,
        ...style.value
      } as UI.CSSProperties)} class={cn("relative isolate inline-block h-6 shrink-0 align-middle rtl:[&>svg]:-scale-x-100 forced-colors:text-center forced-colors:leading-6 forced-colors:font-bold forced-colors:outline-none! forced-colors:after:content-['...']", variant.value === "dots" ? "w-14" as const : "w-20" as const, active.value && (variant.value === "dots" ? DOTS_ANIM : SQUIGGLE_ANIM), className.value)} {...domProps(props.value)}>
        {active.value ? node.value : null}
        {active.value ? <span class="sr-only">{label.value}</span> : null}
      </div>
    </>;
  };
});
export { TypingIndicator };
