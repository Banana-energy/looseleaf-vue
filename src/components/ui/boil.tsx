// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
import { motionIsOff } from "@/hooks/use-live-motion";
import { InkContext, useInkContext, useMergedRef } from "@/lib/ink/vue";
import { BOIL_MAX_FRAMES, boilKnobs, boilSeed } from "@/lib/ink/recipes/boil-ink";
import { cn } from "@/lib/utils";
interface BoilContextValue {
  frame: number;
  frames: number;
}
const BoilContext = createContext<BoilContextValue | null>(null);
function useBoilFrame(): ComputedRef<number> {
  const _nestedHook0 = useContext(BoilContext);
  return computed(() => {
    return _nestedHook0.value?.frame ?? 0;
  });
}
function useBoilSeed(_source0: MaybeRefOrGetter<string | number>): ComputedRef<string> {
  const seed = computed(() => toValue(_source0));
  const _nestedHook0 = useBoilFrame();
  return computed(() => {
    return boilSeed(seed.value, _nestedHook0.value);
  });
}
type BoilProps = Omit<UI.ComponentProps<"span">, "children"> & {
  fps?: number;
  frames?: number;
  strength?: number;
  active?: boolean;
  reseed?: boolean;
  children?: UI.ReactNode | ((frame: {
    frame: number;
    seed: (base: string | number) => string;
  }) => UI.ReactNode);
};
const Boil = defineUi<BoilProps>("Boil", ["class", "fps", "frames", "strength", "active", "reseed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = computed(() => _slots.default);
  const ref = computed(() => _props["ref"]);
  const fps = computed(() => _props["fps"] === undefined ? 6 : _props["fps"]);
  const frames = computed(() => _props["frames"] === undefined ? 3 : _props["frames"]);
  const strength = computed(() => _props["strength"] === undefined ? 1 : _props["strength"]);
  const active = computed(() => _props["active"] === undefined ? true : _props["active"]);
  const reseed = computed(() => _props["reseed"] === undefined ? true : _props["reseed"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "fps", "frames", "strength", "active", "reseed"]));
  const outer = useInkContext();
  const providerReduced = computed(() => outer.value.motion === "reduced" || outer.value.density === "calm");
  const n = computed(() => Math.min(BOIL_MAX_FRAMES, Math.max(2, Math.round(frames.value))));
  const frame = shallowRef(initialState(0));
  const setFrame = stateSetter(frame);
  const onScreen = shallowRef(initialState(true));
  const setOnScreen = stateSetter(onScreen);
  const root = shallowRef<HTMLSpanElement | null | null>(null);
  const hidden = shallowRef(initialState(false));
  const setHidden = stateSetter(hidden);
  const still = shallowRef(initialState(false));
  const setStill = stateSetter(still);
  watchDependencies(() => {
    const el = root.value;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(entries => setOnScreen(entries.some(e => e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, () => [], false);
  watchDependencies(() => {
    const on = () => setHidden(document.hidden);
    on();
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, () => [], false);
  watchDependencies(() => {
    const check = () => setStill(motionIsOff(root.value, providerReduced.value));
    check();
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    mq?.addEventListener?.("change", check);
    return () => mq?.removeEventListener?.("change", check);
  }, () => [providerReduced.value], false);
  const boiling = computed(() => active.value && onScreen.value && !hidden.value && !still.value);
  watchDependencies(() => {
    if (!boiling.value) {
      setFrame(0);
      return;
    }
    const id = setInterval(() => setFrame(f => (f + 1) % n.value), 1000 / Math.min(12, Math.max(1, fps.value)));
    return () => clearInterval(id);
  }, () => [boiling.value, fps.value, n.value], false);
  const f = computed(() => boiling.value ? frame.value % n.value : 0);
  const value = computed(() => f.value === 0 ? outer.value : {
    ...outer.value,
    knobs: mulKnobs(outer.value.knobs, boilKnobs(f.value, strength.value))
  });
  const seedOf = computed(() => (base: string | number) => boilSeed(base, f.value));
  const body = computed(() => typeof children.value === "function" ? children.value({
    frame: f.value,
    seed: seedOf.value
  }) : reseed.value ? Children.map(children.value, (child, i) => {
    if (f.value === 0 || !isValidElement<{
      seed?: string | number;
      name?: string;
      id?: string;
    }>(child) || typeof child.type === "string") return child;
    const base = child.props.seed ?? child.props.name ?? child.props.id ?? i;
    return cloneElement(child, {
      seed: seedOf.value(base)
    });
  }) : children.value);
  return () => {
    return <BoilContext.Provider value={{
      frame: f.value,
      frames: n.value
    }}>
      <InkContext.Provider value={value.value}>
        <span data-slot="boil" data-state={boiling.value ? "boiling" as const : "still" as const} data-frame={f.value} ref={useMergedRef<HTMLSpanElement>(root, ref.value)} class={cn("inline-block", className.value)} {...domProps(props.value)}>
          {body.value}
        </span>
      </InkContext.Provider>
    </BoilContext.Provider>;
  };
});
const mulKnobs = (a: {
  wobble: number;
  misreg: number;
  bleed: number;
  width: number;
}, b: {
  wobble: number;
  misreg: number;
  bleed: number;
  width: number;
}) => ({
  wobble: a.wobble * b.wobble,
  misreg: a.misreg * b.misreg,
  bleed: a.bleed * b.bleed,
  width: a.width * b.width
});
export { Boil, useBoilFrame, useBoilSeed };
export type { BoilProps };
