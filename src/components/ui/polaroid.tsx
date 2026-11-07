// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { polaroidPhotoRecipe, type PolaroidScene } from "@/lib/ink/recipes/polaroid-ink";
import { cn } from "@/lib/utils";
type PolaroidProps = Omit<PaperProps, "stock" | "rules" | "as"> & {
  as?: "figure" | "div" | "article";
};
const Polaroid = defineUi<PolaroidProps>("Polaroid", ["class", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const as = computed(() => _props["as"] === undefined ? "figure" as const : _props["as"]);
  const props = computed(() => omitProps(_props, ["class", "as"]));
  return () => {
    return <Paper data-slot="polaroid" as={as.value} stock="photo" rules="none" class={cn("flex w-64 flex-col gap-2.5 px-3.5 pt-3.5 pb-3 text-ink", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Paper>;
  };
});
type PolaroidImageProps = UI.ComponentProps<"div"> & {
  scene?: PolaroidScene;
  date?: string;
  develop?: boolean;
  label?: string;
  seed?: string | number;
};
const PolaroidImage = defineUi<PolaroidImageProps>("PolaroidImage", ["class", "scene", "date", "develop", "label", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const scene = computed(() => _props["scene"]);
  const date = computed(() => _props["date"]);
  const develop = computed(() => _props["develop"]);
  const label = computed(() => _props["label"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "scene", "date", "develop", "label", "seed", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: polaroidPhotoRecipe,
    params: {
      scene: scene.value ?? "hills"
    },
    kind: "photo" as const,
    seed: seed.value,
    still: true
  }));
  const merged = computed(() => useMergedRef<HTMLDivElement>(scene.value ? hostRef : undefined, ref.value));
  return () => {
    return <div data-slot="polaroid-image" ref={merged.value} {...domProps(scene.value && node.value ? hostProps.value : {})} role={scene.value && label.value ? "img" as const : undefined} aria-label={scene.value && label.value ? label.value : undefined} class={cn("relative isolate aspect-square w-full overflow-hidden bg-paper-shade/60 [&_img]:size-full [&_img]:object-cover", "after:pointer-events-none after:absolute after:inset-0 after:z-(--ll-z-ink) after:shadow-[inset_0_2px_4px_rgb(var(--ll-shade)/0.26),inset_0_0_0_1px_rgb(var(--ll-shade)/0.12)]", className.value)} {...domProps(props.value)}>
      {scene.value ? node.value : null}
      {readSlot(_slots.default)}
      {date.value ? <span aria-hidden="true" class="pointer-events-none absolute end-2.5 bottom-2 z-(--ll-z-ink) font-mono text-[11px] tracking-wider text-tangerine [text-shadow:0_0_2px_rgb(var(--ll-shade)/0.7),0_0_6px_rgb(var(--ll-shade)/0.45)] calm:[text-shadow:none]">
          {date.value}
        </span> : null}
      {develop.value ? <span aria-hidden="true" class="pointer-events-none absolute inset-0 z-(--ll-z-ink) animate-out bg-photo fade-out-0 fill-mode-forwards delay-500 duration-(--ll-dur-soak)" /> : null}
    </div>;
  };
});
const PolaroidCaption = defineUi<UI.ComponentProps<"figcaption">>("PolaroidCaption", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <figcaption data-slot="polaroid-caption" class={cn("flex min-h-12 items-center justify-center px-1 text-center break-words font-script text-[1.65rem] leading-[1.05] font-semibold text-balance", className.value)} {...domProps(props.value)}>{_slots.default?.()}</figcaption>;
  };
});
export { Polaroid, PolaroidImage, PolaroidCaption };
export type { PolaroidProps, PolaroidImageProps };
