// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { NotebookCover, NotebookCoverLabel } from "@/components/ui/notebook";
import { Sticker } from "@/components/ui/sticker";
import { BADGES, SHELF, type Badge, type ShelfNotebook } from "@/blocks/profile-page/components/profile-page-data";
import { cn } from "@/lib/utils";
export const ProfilePageNotebooks = defineUi<{
  shelf?: ShelfNotebook[];
}>("ProfilePageNotebooks", ["shelf"], (_props, {
  slots: _slots
}) => {
  const shelf = computed(() => _props["shelf"] === undefined ? SHELF : _props["shelf"]);
  return () => {
    return <ul aria-label="Notebooks" class="flex flex-wrap justify-center gap-x-8 gap-y-10 @md/profile:justify-start">
      {shelf.value.map(n => <li key={n.name} class="grid justify-items-center gap-3">
          <NotebookCover tone={n.tone} band={n.name !== "Letters"} seed={n.name} role="group" aria-label={`${n.name} notebook`}>
            <NotebookCoverLabel>{n.name}</NotebookCoverLabel>
          </NotebookCover>
          <span class="ll-num text-sm text-muted-foreground">{n.pages} pages</span>
        </li>)}
    </ul>;
  };
});
export const ProfilePageStickers = defineUi<{
  badges?: Badge[];
}>("ProfilePageStickers", ["badges"], (_props, {
  slots: _slots
}) => {
  const badges = computed(() => _props["badges"] === undefined ? BADGES : _props["badges"]);
  const earned = computed(() => badges.value.filter(b => b.earned).length);
  return () => {
    return <div class="grid gap-4">
      <p class="text-muted-foreground">
        <b class="ll-num text-foreground">{earned.value}</b> of {badges.value.length} stickers earned.
      </p>
      <ul aria-label="Stickers" class="grid grid-cols-2 gap-x-6 gap-y-8 @lg/profile:grid-cols-3 @3xl/profile:grid-cols-4">
        {badges.value.map(b => <li key={b.id} class="grid justify-items-center gap-2 text-center">
            <Sticker name={b.sticker} size={88} seed={b.id} shadow={!!b.earned} class={cn(!b.earned && "opacity-35 grayscale")} />
            <p class="font-bold">{b.name}</p>
            <p class="flex items-center gap-1 text-sm text-muted-foreground">
              {b.earned ? <>
                  <Icon name="check" size={14} />
                  Earned {b.earned}
                </> : <>
                  <Icon name="lock" size={14} />
                  {b.how}
                </>}
            </p>
          </li>)}
      </ul>
    </div>;
  };
});
