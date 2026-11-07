// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
import { Slot } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { flipTriggerRecipe } from "@/lib/ink/recipes/flip-card-ink";
import { cn } from "@/lib/utils";
const CSS = `@keyframes ll-flip-lift-a{0%,100%{translate:0 0;scale:1}42%{translate:0 -10px;scale:1.045}}
@keyframes ll-flip-lift-b{0%,100%{translate:0 0;scale:1}42%{translate:0 -10px;scale:1.045}}
[data-slot=flip-card][data-touched][data-state=back]>[data-slot=flip-card-inner]{animation:ll-flip-lift-a calc(var(--ll-dur-sheet)*2) var(--ll-ease-out)}
[data-slot=flip-card][data-touched][data-state=front]>[data-slot=flip-card-inner]{animation:ll-flip-lift-b calc(var(--ll-dur-sheet)*2) var(--ll-ease-out)}`;
type Side = "front" | "back";
interface FlipCardContextValue {
  flipped: boolean;
  toggle(): void;
  axis: "x" | "y";
  label: string;
}
const FlipCardContext = createContext<FlipCardContextValue | null>(null);
function useFlipCard(): ComputedRef<FlipCardContextValue> {
  const ctx = useContext(FlipCardContext);
  return computed(() => {
    if (!ctx.value) console.error("FlipCard parts must be used inside <FlipCard>");
    return ctx.value;
  });
}
type FlipCardProps = Omit<UI.ComponentProps<"div">, "onChange"> & {
  flipped?: boolean;
  defaultFlipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
  axis?: "x" | "y";
  trigger?: boolean;
  label?: string;
};
const FlipCard = defineUi<FlipCardProps>("FlipCard", ["class", "flipped", "defaultFlipped", "onFlippedChange", "axis", "trigger", "label"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const flippedProp = computed(() => _props["flipped"]);
  const defaultFlipped = computed(() => _props["defaultFlipped"] === undefined ? false : _props["defaultFlipped"]);
  const onFlippedChange = computed(() => _props["onFlippedChange"]);
  const axis = computed(() => _props["axis"] === undefined ? "y" as const : _props["axis"]);
  const trigger = computed(() => _props["trigger"] === undefined ? true : _props["trigger"]);
  const label = computed(() => _props["label"] === undefined ? "Flip card" as const : _props["label"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "flipped", "defaultFlipped", "onFlippedChange", "axis", "trigger", "label"]));
  const inner = shallowRef(initialState(defaultFlipped.value));
  const setInner = stateSetter(inner);
  const touched = shallowRef(initialState(false));
  const setTouched = stateSetter(touched);
  const flipped = computed(() => flippedProp.value ?? inner.value);
  const toggle = computed(() => () => {
    setTouched(true);
    if (flippedProp.value === undefined) setInner(!flipped.value);
    onFlippedChange.value?.(!flipped.value);
  });
  const state = computed<Side>(() => flipped.value ? "back" as const : "front" as const);
  const ctx = computed<FlipCardContextValue>(() => ({
    flipped: flipped.value,
    toggle: toggle.value,
    axis: axis.value,
    label: label.value
  }));
  return () => {
    return <FlipCardContext.Provider value={ctx.value}>
      <style>
        {CSS}
      </style>
      <div data-slot="flip-card" data-state={state.value} data-touched={touched.value ? "" as const : undefined} ref={ref.value} class={cn("relative isolate block h-48 w-72 [perspective:1200px]", className.value)} {...domProps(props.value)}>
        <div data-slot="flip-card-inner" class={cn("grid size-full [transform-style:preserve-3d] transition-transform duration-[calc(var(--ll-dur-sheet)*2)] ease-(--ll-ease-settle)", flipped.value && (axis.value === "x" ? "[transform:rotateX(180deg)]" as const : "[transform:rotateY(180deg)]" as const))}>
          {readSlot(_slots.default)}
        </div>
        {trigger.value ? <FlipCardTrigger /> : null}
      </div>
    </FlipCardContext.Provider>;
  };
});
type FaceProps = Omit<PaperProps, "ref" | "stock"> & {
  ref?: UI.Ref<HTMLElement>;
  stock?: PaperProps["stock"];
};
const Face = defineUi<FaceProps & {
  side: Side;
}>("Face", ["side", "stock", "class"], (_props, {
  slots: _slots
}) => {
  const side = computed(() => _props["side"]);
  const stock = computed(() => _props["stock"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["side", "stock", "class", "children", "ref"]));
  const _hook6 = useFlipCard();
  const flipped = computed(() => _hook6.value.flipped);
  const axis = computed(() => _hook6.value.axis);
  const hidden = computed(() => side.value === "front" ? flipped.value : !flipped.value);
  return () => {
    return <Paper data-slot={`flip-card-${side.value}`} data-side={side.value} stock={stock.value ?? (side.value === "front" ? "index-card" as const : "slip" as const)} edge="cut" tilt={false} inert={hidden.value} aria-hidden={hidden.value || undefined} ref={ref.value} class={cn("col-start-1 row-start-1 size-full [backface-visibility:hidden] flex flex-col items-center justify-center gap-1 px-6 py-5 text-center font-script text-2xl leading-tight", "[transition:visibility_0s_linear_calc(var(--ll-dur-sheet)*.24)]", hidden.value ? "invisible" as const : "visible" as const, side.value === "back" && (axis.value === "x" ? "[transform:rotateX(180deg)]" as const : "[transform:rotateY(180deg)]" as const), className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
    </Paper>;
  };
});
const FlipCardFront = defineUi<FaceProps>("FlipCardFront", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  return () => {
    return <Face side="front" {...domProps(props)}>{_slots.default?.()}</Face>;
  };
});
const FlipCardBack = defineUi<FaceProps>("FlipCardBack", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  return () => {
    return <Face side="back" {...domProps(props)}>{_slots.default?.()}</Face>;
  };
});
type FlipCardTriggerProps = UI.ComponentProps<"button"> & {
  asChild?: boolean;
  overlay?: boolean;
  hint?: boolean;
  seed?: string | number;
};
const FlipCardTrigger = defineUi<FlipCardTriggerProps>("FlipCardTrigger", ["class", "asChild", "overlay", "hint", "seed", "onClick"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const overlay = computed(() => _props["overlay"] === undefined ? true : _props["overlay"]);
  const hint = computed(() => _props["hint"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["class", "children", "asChild", "overlay", "hint", "seed", "ref", "onClick"]));
  const ctx = useFlipCard();
  const drawn = computed(() => overlay.value && (hint.value ?? true));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: flipTriggerRecipe,
    params: {
      hint: drawn.value
    },
    kind: "flip-card-trigger" as const,
    seed: seed.value
  }));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "button" as const));
  return () => {
    return <Comp.value data-slot="flip-card-trigger" type={asChild.value ? undefined : "button" as const} aria-pressed={ctx.value.flipped} ref={useMergedRef<HTMLButtonElement>(overlay.value ? hostRef : undefined, ref.value)} {...domProps(overlay.value ? hostProps.value : {})} onClick={(e: MouseEvent) => {
      onClick.value?.(e);
      if (!e.defaultPrevented) ctx.value.toggle();
    }} class={cn(overlay.value && "absolute inset-0 z-(--ll-z-raised) block size-full cursor-pointer", className.value)} {...domProps(props.value)}>
      <Slot.Slottable>{readSlot(_slots.default) ?? <span class="sr-only">{ctx.value.label}</span>}</Slot.Slottable>
      {overlay.value ? node.value : null}
    </Comp.value>;
  };
});
export { FlipCard, FlipCardFront, FlipCardBack, FlipCardTrigger, useFlipCard };
export type { FlipCardProps, FlipCardTriggerProps };
