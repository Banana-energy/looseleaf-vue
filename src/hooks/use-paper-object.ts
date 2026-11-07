// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, proxyRefs } from "vue";
import { useInkFaces } from "@/lib/ink/paper/sheet-layers";
import { tiltFor } from "@/lib/ink/paper/shadows";
import { useInk, useInkSeed, useMergedRef } from "@/lib/ink/vue";
import type { Recipe } from "@/lib/ink/recipes";
const DECOR_TILT = "[&>svg[data-ink]:not([data-ink=sheet],[data-ink=tape],[data-ink=sticker],[data-ink=prop])]:[rotate:clamp(calc(var(--ll-tilt-max)*-1),var(--ll-tilt-decor,0deg),var(--ll-tilt-max))]";
interface PaperObjectOptions<P> {
  recipe: Recipe<P>;
  params: P;
  kind: string;
  ref?: UI.Ref<HTMLElement>;
  seed?: string | number;
  tilt?: boolean | number;
  tiltMax?: number;
  size?: readonly [number, number];
  enabled?: boolean;
}
export function usePaperDecor<P>(_source0: MaybeRefOrGetter<PaperObjectOptions<P>>) {
  const recipe = computed(() => toValue(_source0).recipe);
  const params = computed(() => toValue(_source0).params);
  const kind = computed(() => toValue(_source0).kind);
  const ref = computed(() => toValue(_source0).ref);
  const seedProp = computed(() => toValue(_source0).seed);
  const tilt = computed(() => toValue(_source0).tilt);
  const tiltMax = computed(() => toValue(_source0).tiltMax === undefined ? 0.6 : toValue(_source0).tiltMax);
  const size = computed(() => toValue(_source0).size);
  const enabled = computed(() => toValue(_source0).enabled === undefined ? true : toValue(_source0).enabled);
  const seed = useInkSeed(() => seedProp.value);
  const deg = computed(() => tilt.value === false ? 0 : typeof tilt.value === "number" ? tilt.value : tiltFor(seed.value, tiltMax.value));
  const _inkCore = useInk(() => ({
    recipe: recipe.value,
    params: params.value,
    kind: kind.value,
    seed: `${seed.value}|decor`,
    size: enabled.value ? size.value : undefined,
    still: true
  }));
  const ink = computed(() => proxyRefs(_inkCore));
  const merged = computed(() => useMergedRef<HTMLElement>(enabled.value ? ink.value.hostRef : undefined, ref.value));
  const decor = computed(() => enabled.value ? ink.value.node : null);
  return computed(() => {
    return {
      seed: seed.value,
      tilt: deg.value,
      decor: decor.value,
      paper: {
        seed: seed.value,
        tilt: deg.value,
        ref: merged.value,
        className: DECOR_TILT,
        style: {
          "--ll-tilt-decor": `${deg.value}deg`
        } as UI.CSSProperties,
        ...(decor.value ? ink.value.hostProps : {})
      }
    };
  });
}
export function useShapedSheet<P>(_source0: MaybeRefOrGetter<Omit<PaperObjectOptions<P>, "enabled" | "kind"> & {
  kind?: string;
  still?: boolean;
}>) {
  const recipe = computed(() => toValue(_source0).recipe);
  const params = computed(() => toValue(_source0).params);
  const ref = computed(() => toValue(_source0).ref);
  const seedProp = computed(() => toValue(_source0).seed);
  const tilt = computed(() => toValue(_source0).tilt);
  const tiltMax = computed(() => toValue(_source0).tiltMax === undefined ? 0.8 : toValue(_source0).tiltMax);
  const size = computed(() => toValue(_source0).size);
  const kind = computed(() => toValue(_source0).kind === undefined ? "sheet" as const : toValue(_source0).kind);
  const still = computed(() => toValue(_source0).still === undefined ? true : toValue(_source0).still);
  const seed = useInkSeed(() => seedProp.value);
  const deg = computed(() => tilt.value === false ? 0 : typeof tilt.value === "number" ? tilt.value : tiltFor(seed.value, tiltMax.value));
  const _inkCore = useInkFaces(() => ({
    recipe: recipe.value,
    params: params.value,
    kind: kind.value,
    seed: seed.value,
    size: size.value,
    still: still.value ? true : undefined
  }));
  const ink = computed(() => proxyRefs(_inkCore));
  const merged = computed(() => useMergedRef<HTMLElement>(ink.value.hostRef, ref.value));
  return computed(() => {
    return {
      seed: seed.value,
      tilt: deg.value,
      node: ink.value.node,
      ready: ink.value.node !== null,
      root: {
        ref: merged.value,
        style: {
          "--ll-tilt": `${deg.value}deg`
        } as UI.CSSProperties,
        ...(ink.value.node ? ink.value.hostProps : {})
      }
    };
  });
}
