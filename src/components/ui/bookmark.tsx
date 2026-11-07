// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Toggle as TogglePrimitive } from "@/lib/primitives";
import { useShapedSheet } from "@/hooks/use-paper-object";
import type { Accent } from "@/lib/ink/paper/props";
import { bookmarkRecipe } from "@/lib/ink/recipes/bookmark-ink";
import { cn } from "@/lib/utils";
const RIBBON_TILT = "[&>svg]:[rotate:clamp(calc(var(--ll-tilt-max)*-1),var(--ll-tilt,0deg),var(--ll-tilt-max))]";
const RIBBON_SHADOW = "data-[state=on]:[&>svg]:[filter:var(--ll-drop-sticker)]";
const FORCED_ON = "forced-colors:data-[state=on]:bg-[Highlight]";
type BookmarkProps = UI.ComponentProps<typeof TogglePrimitive.Root> & {
  tone?: Accent;
  tilt?: boolean | number;
  seed?: string | number;
  size?: readonly [number, number];
};
const Bookmark = defineUi<BookmarkProps>("Bookmark", ["class", "style", "tone", "tilt", "seed", "size", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const tone = computed(() => _props["tone"] === undefined ? "tomato" as const : _props["tone"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const disabled = computed(() => _props["disabled"]);
  const props = computed(() => omitProps(_props, ["class", "style", "children", "ref", "tone", "tilt", "seed", "size", "disabled"]));
  const o = useShapedSheet(() => ({
    recipe: bookmarkRecipe,
    params: {
      tone: tone.value,
      mode: "toggle" as const,
      disabled: !!disabled.value
    },
    ref: ref.value as UI.Ref<HTMLElement>,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 1.4,
    size: size.value,
    kind: "bookmark" as const
  }));
  return () => {
    return <TogglePrimitive.Root data-slot="bookmark" disabled={disabled.value} {...domProps(o.value.root)} {...domProps(props.value)} class={cn("relative isolate inline-block h-12 w-8 shrink-0 cursor-pointer align-top after:absolute after:-inset-1.5 disabled:cursor-not-allowed", RIBBON_TILT, RIBBON_SHADOW, FORCED_ON, className.value)} style={cssStyle({
      ...o.value.root.style,
      ...style.value
    })}>
      {o.value.node}
      <span class="sr-only">{readSlot(_slots.default) ?? "Bookmark"}</span>
    </TogglePrimitive.Root>;
  };
});
type BookmarkRibbonProps = UI.ComponentProps<"div"> & {
  tone?: Accent;
  tilt?: boolean | number;
  seed?: string | number;
  size?: readonly [number, number];
};
const BookmarkRibbon = defineUi<BookmarkRibbonProps>("BookmarkRibbon", ["class", "style", "tone", "tilt", "seed", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const ref = computed(() => _props["ref"]);
  const tone = computed(() => _props["tone"] === undefined ? "tomato" as const : _props["tone"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "style", "ref", "tone", "tilt", "seed", "size"]));
  const o = useShapedSheet(() => ({
    recipe: bookmarkRecipe,
    params: {
      tone: tone.value,
      mode: "static" as const,
      disabled: false
    },
    ref: ref.value as UI.Ref<HTMLElement>,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 1.4,
    size: size.value,
    kind: "bookmark" as const
  }));
  return () => {
    return <div data-slot="bookmark-ribbon" aria-hidden="true" {...domProps(o.value.root)} {...domProps(props.value)} class={cn("pointer-events-none relative isolate inline-block h-14 w-8 shrink-0 [&>svg]:[filter:var(--ll-drop-sticker)]", RIBBON_TILT, className.value)} style={cssStyle({
      ...o.value.root.style,
      ...style.value
    })}>
      {o.value.node}
    </div>;
  };
});
export { Bookmark, BookmarkRibbon };
export type { BookmarkProps, BookmarkRibbonProps };
