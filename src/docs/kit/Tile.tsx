// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { Link } from "../core/router";
import { cx } from "./cx";
export interface TileProps {
  to: string;
  title: UI.VueNode;
  description?: UI.VueNode;
  meta?: UI.VueNode;
  className?: string;
}
export const Tile = defineUi<TileProps>("Tile", ["to", "title", "description", "meta", "class"], (_props, {
  slots: _slots
}) => {
  const to = computed(() => _props["to"]);
  const title = computed(() => _props["title"]);
  const description = computed(() => _props["description"]);
  const meta = computed(() => _props["meta"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <Paper as="li" stock="card" rules="none" shadow="card" tilt seed={to.value} class={cx("dk-tile-li group/tile flex min-w-0 list-none transition-transform duration-(--ll-dur-hover) ease-settle hover:-translate-y-0.5 motion-reduce:transition-none", className.value)}>
      <Link to={to.value} class="dk-tile flex min-w-0 flex-1 flex-col gap-1.5 p-4 outline-offset-[-4px]">
        <span class="dk-tile-title font-script text-2xl leading-none font-bold text-ink group-hover/tile:text-ink-you">{title.value}</span>
        {description.value ? <span class="dk-tile-desc line-clamp-3 text-[15px] leading-snug text-muted-foreground">{description.value}</span> : null}
        {meta.value ? <span class="dk-tile-meta mt-auto flex flex-wrap items-center gap-1.5 pt-1.5">{meta.value}</span> : null}
      </Link>
    </Paper>;
  };
});
export const TileGrid = defineUi<UI.ComponentProps<"ul">>("TileGrid", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <ul role="list" class={cx("dk-tiles grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] gap-x-5 gap-y-6 p-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</ul>;
  };
});
