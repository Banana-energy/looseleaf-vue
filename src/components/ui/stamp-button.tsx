// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { Slot } from "@/lib/primitives";
import { Stamp } from "@/components/ui/stamp";
import { motionIsOff } from "@/hooks/use-live-motion";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { STAMP_KNOB, stampButtonRecipe, stampInkList, type StampInk } from "@/lib/ink/recipes/stamp-button-ink";
import { hashSeed } from "@/lib/ink/rng";
import { stickers } from "@/lib/ink/art/stickers";
import type { StampGen, StickerDef } from "@/lib/ink/art/types";
import { cn } from "@/lib/utils";
interface StampImpression {
  id: string;
  press: number;
  x: number;
  y: number;
  name?: string;
  text?: string;
  shape?: StampGen["shape"];
  ink?: StampInk;
  sub?: string;
  ring?: string;
  w?: number;
  h?: number;
  size?: number;
  ghost?: boolean;
  dashed?: boolean;
  turn: number;
  seed: string;
}
interface StampSurfaceContextValue {
  strike(aim: Omit<StampImpression, "press" | "turn" | "seed"> & {
    say: string;
  }): StampImpression;
}
const StampSurfaceContext = createContext<StampSurfaceContextValue | null>(null);
const keyOf = (i: StampImpression) => `${i.id}#${i.press}`;
const RECOIL_MS = 190;
type StampSurfaceProps = Omit<UI.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  value?: StampImpression[];
  defaultValue?: StampImpression[];
  onValueChange?: (value: StampImpression[]) => void;
  max?: number;
};
const StampSurface = defineUi<StampSurfaceProps>("StampSurface", ["class", "value", "defaultValue", "onValueChange", "max"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const value = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const max = computed(() => _props["max"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "value", "defaultValue", "onValueChange", "max"]));
  const inner = shallowRef<StampImpression[]>(initialState(defaultValue.value ?? []));
  const setInner = stateSetter(inner);
  const controlled = computed(() => value.value !== undefined);
  const impressions = computed(() => value.value !== undefined ? value.value : inner.value);
  const latest = shallowRef(impressions.value);
  const el = shallowRef<HTMLDivElement | null | null>(null);
  const status = shallowRef(initialState(""));
  const setStatus = stateSetter(status);
  const struck = shallowRef(new Set<string>());
  const api = computed<StampSurfaceContextValue>(() => ({
    strike({
      say,
      ...rest
    }) {
      const before = latest.value.find(i => i.id === rest.id);
      const press = (before?.press ?? 0) + 1;
      const h = hashSeed(`${rest.id}|${press}`);
      const wander = (bits: number) => ((h >>> bits) % 1000 / 1000 - 0.5) * 0.06;
      const clamp01 = (v: number) => Math.min(0.96, Math.max(0.04, v));
      const impression: StampImpression = {
        ...rest,
        x: clamp01(rest.x + wander(0)),
        y: clamp01(rest.y + wander(10)),
        ghost: rest.ghost ?? (h % 5 === 0 ? true : undefined),
        press,
        turn: (h % 700 - 350) / 100,
        seed: `${rest.id}#${press}`
      };
      let next = [...latest.value.filter(i => i.id !== rest.id), impression];
      if (max.value && next.length > max.value) next = next.slice(next.length - max.value);
      latest.value = next;
      struck.value.add(keyOf(impression));
      for (const k of struck.value) if (!next.some(i => keyOf(i) === k)) struck.value.delete(k);
      if (!controlled.value) setInner(next);
      onValueChange.value?.(next);
      setStatus(`${say} stamped.`);
      const node = el.value;
      if (node && typeof node.animate === "function" && !motionIsOff(node)) {
        node.animate([{
          translate: "0 0" as const
        }, {
          translate: "0 2px" as const,
          offset: 0.35
        }, {
          translate: "0 0" as const
        }], {
          duration: RECOIL_MS,
          easing: "ease-out" as const
        });
      }
      return impression;
    }
  }));
  return () => {
    latest.value = impressions.value;
    return <StampSurfaceContext.Provider value={api.value}>
      <div data-slot="stamp-surface" ref={useMergedRef<HTMLDivElement>(el, ref.value)} class={cn("relative isolate", className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
        <div data-slot="stamp-layer" class="pointer-events-none absolute inset-0 z-(--ll-z-prop)">
          {impressions.value.map(i => <Stamp key={keyOf(i)} data-slot="stamp-impression" data-id={i.id} name={i.name} text={i.text} shape={i.shape} ink={i.ink} sub={i.sub} ring={i.ring} w={i.w} h={i.h} size={i.size} ghost={i.ghost} dashed={i.dashed} seed={i.seed} class={cn("absolute", struck.value.has(keyOf(i)) && "animate-in duration-(--ll-dur-pop) ease-(--ll-ease-pop) fade-in-0 zoom-in-[1.7]")} style={cssStyle({
            left: `${i.x * 100}%`,
            top: `${i.y * 100}%`,
            translate: "-50% -50%" as const,
            rotate: `${i.turn}deg`
          })} />)}
        </div>
        <span role="status" class="sr-only">
          {status.value}
        </span>
      </div>
    </StampSurfaceContext.Provider>;
  };
});
function useStampSurface(): ComputedRef<StampSurfaceContextValue> {
  const ctx = useContext(StampSurfaceContext);
  return computed(() => {
    if (!ctx.value) console.error("useStampSurface must be used inside <StampSurface>");
    return ctx.value;
  });
}
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
type StampButtonProps = Omit<UI.ComponentProps<"button">, "color"> & {
  stamp?: string;
  text?: string;
  shape?: StampGen["shape"];
  ink?: StampInk;
  sub?: string;
  ring?: string;
  w?: number;
  h?: number;
  size?: number;
  ghost?: boolean;
  dashed?: boolean;
  impressionId?: string;
  place?: {
    x: number;
    y: number;
  };
  onStamp?: (impression: StampImpression) => void;
  asChild?: boolean;
  seed?: string | number;
};
const StampButton = defineUi<StampButtonProps>("StampButton", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const surface = useContext(StampSurfaceContext);
  return () => {
    if (!surface.value) {
      return <StampSurface class="inline-flex">
        <StampButtonInner {...domProps(props)}>{_slots.default?.()}</StampButtonInner>
      </StampSurface>;
    }
    return <StampButtonInner {...domProps(props)}>{_slots.default?.()}</StampButtonInner>;
  };
});
const StampButtonInner = defineUi<StampButtonProps>("StampButtonInner", ["class", "stamp", "text", "shape", "ink", "sub", "ring", "w", "h", "size", "ghost", "dashed", "impressionId", "place", "onStamp", "onClick", "asChild", "disabled", "seed", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const stamp = computed(() => _props["stamp"]);
  const text = computed(() => _props["text"]);
  const shape = computed(() => _props["shape"]);
  const inkProp = computed(() => _props["ink"]);
  const sub = computed(() => _props["sub"]);
  const ring = computed(() => _props["ring"]);
  const w = computed(() => _props["w"]);
  const h = computed(() => _props["h"]);
  const size = computed(() => _props["size"]);
  const ghost = computed(() => _props["ghost"]);
  const dashed = computed(() => _props["dashed"]);
  const impressionId = computed(() => _props["impressionId"]);
  const place = computed(() => _props["place"] === undefined ? {
    x: 0.72,
    y: 0.6
  } : _props["place"]);
  const onStamp = computed(() => _props["onStamp"]);
  const onClick = computed(() => _props["onClick"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const disabled = computed(() => _props["disabled"]);
  const seed = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "stamp", "text", "shape", "ink", "sub", "ring", "w", "h", "size", "ghost", "dashed", "impressionId", "place", "onStamp", "onClick", "asChild", "disabled", "seed", "style"]));
  const surface = useStampSurface();
  const preset = computed(() => stamp.value ? (stickers as Record<string, StickerDef>)[stamp.value] as StampGen | undefined : undefined);
  const gen = computed(() => preset.value && "gen" in preset.value && preset.value.gen === "stamp" ? preset.value : undefined);
  const words = computed(() => text.value ?? gen.value?.text ?? stamp.value ?? "");
  const tone = computed<StampInk>(() => inkProp.value ?? gen.value?.ink as StampInk | undefined ?? "red");
  const id = computed(() => impressionId.value ?? stamp.value ?? text.value ?? "stamp");
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: stampButtonRecipe,
    params: {
      ink: tone.value,
      disabled: !!disabled.value
    },
    kind: "stamp-tool" as const,
    seed: seed.value
  }));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "button" as const));
  const press = computed(() => (e: MouseEvent) => {
    onClick.value?.(e);
    if (e.defaultPrevented || disabled.value) return;
    const impression = surface.value.strike({
      id: id.value,
      x: place.value.x,
      y: place.value.y,
      name: stamp.value,
      text: text.value,
      shape: shape.value,
      ink: inkProp.value,
      sub: sub.value,
      ring: ring.value,
      w: w.value,
      h: h.value,
      size: size.value,
      ghost: ghost.value,
      dashed: dashed.value,
      say: titleCase(words.value.replace(/^stamp-/, "").replace(/-/g, " "))
    });
    onStamp.value?.(impression);
  });
  return () => {
    return <Comp.value data-slot="stamp-button" data-ink-tone={tone.value} data-ink-sink="self" ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(hostProps.value)} {...domProps(asChild.value ? {
      "aria-disabled": disabled.value || undefined
    } : {
      type: "button" as const,
      disabled: disabled.value
    })} onClick={press.value as UI.MouseEventHandler<HTMLElement>} class={cn("relative isolate inline-flex min-w-28 shrink-0 cursor-pointer items-center justify-center px-6 pb-2 font-type text-base font-bold tracking-wide whitespace-nowrap text-ink", "transition-[translate] duration-(--ll-dur-press) ease-out hover:-translate-y-px active:translate-y-(--ll-press-sink)", "disabled:cursor-not-allowed disabled:text-pencil-text disabled:hover:translate-y-0", "[&_svg:not(.absolute):not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className.value)} style={cssStyle({
      height: STAMP_KNOB + 38,
      paddingTop: STAMP_KNOB,
      ...style.value
    })} {...domProps(props.value)}>
      {node.value}
      <Slot.Slottable>{readSlot(_slots.default) ?? titleCase(words.value.replace(/^stamp-/, "").replace(/-/g, " "))}</Slot.Slottable>
    </Comp.value>;
  };
});
export { StampSurface, StampButton, useStampSurface, stampInkList };
export type { StampSurfaceProps, StampButtonProps, StampImpression, StampInk };
