// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/ui/paper";
import { StickerBoard, StickerBoardCanvas, addSticker, type StickerBoardItem } from "@/components/ui/sticker-board";
export const meta = {
  title: "The value is JSON" as const,
  description: "The board keeps no secrets: every sticker is { id, name, x, y, rot, scale, z }. Store it, send it, restore it. addSticker puts a new one on top of the pile." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 520
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const items = shallowRef<StickerBoardItem[]>(initialState(() => addSticker([], "rocket", {
    x: 120,
    y: 110,
    rot: -10
  })));
  const setItems = stateSetter(items);
  const wrap = shallowRef<HTMLDivElement | null>(null);
  const row = shallowRef<HTMLDivElement | null>(null);
  const middle = computed(() => () => {
    const r = wrap.value?.querySelector('[data-slot="sticker-board-canvas"]')?.getBoundingClientRect();
    return {
      width: r?.width || 250,
      height: r?.height || 300
    };
  });
  return () => {
    return <div class="grid w-full items-start gap-4 md:grid-cols-[1fr_16rem]">
      <div ref={wrap} class="flex min-w-0 flex-col gap-3">
        <StickerBoard value={items.value} onValueChange={setItems} class="h-[22rem]" size={88}>
          <StickerBoardCanvas class="flex-1" empty="Press a button to stick something down." />
        </StickerBoard>
        <div ref={row} class="flex flex-wrap gap-2">
          {(["rocket", "cloud-smile", "first-place", "stamp-approved"] as const).map(name => <Button key={name} size="sm" variant="outline" onClick={() => {
            const canvas = middle.value();
            setItems(all => addSticker(all, name, {
              canvas
            }));
          }}>
              Add {name.replace("-", " ")}
            </Button>)}
          <Button size="sm" variant="ghost" onClick={() => {
            setItems([]);
            row.value?.querySelector("button")?.focus();
          }} disabled={items.value.length === 0}>
            Clear
          </Button>
        </div>
      </div>
      <Paper stock="slip" tilt={false} class="p-3">
        <pre class="max-h-[22rem] overflow-auto font-mono text-xs leading-relaxed whitespace-pre-wrap text-ink" aria-label="Board value">
          {JSON.stringify(items.value, null, 1)}
        </pre>
      </Paper>
    </div>;
  };
});
export default Example;
