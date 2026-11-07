// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { usePaperDecor } from "@/hooks/use-paper-object";
import { stickyNoteRecipe } from "@/lib/ink/recipes/sticky-note-ink";
import { REVEAL_DASH, REVEAL_WHEN_CHECKED } from "@/lib/ink/recipes/draw-on-ink";
import { cn } from "@/lib/utils";
type StickyColor = "yellow" | "green" | "orange" | "pink" | "blue";
type StickyNoteProps = Omit<PaperProps, "stock"> & {
  color?: StickyColor;
  done?: boolean;
  onDoneChange?: (done: boolean) => void;
  doneLabel?: string;
};
const StickyNote = defineUi<StickyNoteProps>("StickyNote", ["class", "color", "done", "onDoneChange", "doneLabel", "seed", "tilt", "size", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const color = computed(() => _props["color"] === undefined ? "yellow" as const : _props["color"]);
  const done = computed(() => _props["done"]);
  const onDoneChange = computed(() => _props["onDoneChange"]);
  const doneLabel = computed(() => _props["doneLabel"] === undefined ? "Done" as const : _props["doneLabel"]);
  const seed = computed(() => _props["seed"]);
  const tilt = computed(() => _props["tilt"]);
  const size = computed(() => _props["size"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "color", "done", "onDoneChange", "doneLabel", "seed", "tilt", "size", "style"]));
  const tickable = computed(() => done.value !== undefined);
  const o = usePaperDecor(() => ({
    recipe: stickyNoteRecipe,
    params: {},
    kind: "sticky" as const,
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 1.6,
    size: size.value,
    enabled: tickable.value
  }));
  const el = shallowRef<HTMLElement | null | null>(null);
  const seen = shallowRef(done.value);
  watchDependencies(() => {
    if (seen.value === done.value) return;
    seen.value = done.value;
    el.value?.setAttribute("data-touched", "");
  }, () => [done.value], false);
  const setRef = (node: HTMLElement | null) => {
    el.value = node;
    return (o.value.paper.ref as UI.RefCallback<HTMLElement>)(node);
  };
  return () => {
    return <Paper data-slot="sticky-note" data-color={color.value} data-state={done.value !== undefined ? done.value ? "checked" as const : "unchecked" as const : undefined} stock={`sticky-${color.value}`} size={size.value} {...domProps(o.value.paper)} ref={setRef} {...domProps(props.value)} class={cn(o.value.paper.className, "flex min-h-40 w-44 flex-col gap-1 px-4 pt-6 pb-4 font-script text-[1.35rem] leading-[1.15] text-ink break-words", tickable.value && ["pt-8", REVEAL_DASH, REVEAL_WHEN_CHECKED, "data-[state=checked]:[&_[data-slot=sticky-note-content]]:line-through data-[state=checked]:[&_[data-slot=sticky-note-content]]:decoration-1"], className.value)} style={cssStyle({
      ...o.value.paper.style,
      ...style.value
    })}>
      {o.value.decor}
      {tickable.value && onDoneChange.value ? <button type="button" role="checkbox" aria-checked={!!done.value} aria-label={doneLabel.value} data-slot="sticky-note-check" onClick={() => onDoneChange.value(!done.value)} class="absolute end-[3.5px] top-[2.5px] z-(--ll-z-prop) size-8 cursor-pointer rounded-full hover:bg-ink/10" /> : tickable.value && done.value ? <span class="sr-only">{doneLabel.value}. </span> : null}
      {readSlot(_slots.default)}
    </Paper>;
  };
});
const StickyNoteTitle = defineUi<UI.ComponentProps<"div">>("StickyNoteTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sticky-note-title" class={cn("text-[1.7rem] leading-none font-bold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const StickyNoteContent = defineUi<UI.ComponentProps<"div">>("StickyNoteContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sticky-note-content" class={cn("flex-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const StickyNoteFooter = defineUi<UI.ComponentProps<"div">>("StickyNoteFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sticky-note-footer" class={cn("mt-auto pt-2 font-hand text-sm text-ink-soft", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { StickyNote, StickyNoteTitle, StickyNoteContent, StickyNoteFooter };
export type { StickyNoteProps, StickyColor };
