// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { StickerBoard, StickerBoardCanvas, StickerBoardToolbar, addSticker, boardPoint, type StickerBoardItem } from "@/components/ui/sticker-board";
import { StickerSheet, StickerSheetItem } from "@/components/ui/sticker-sheet";
export const meta = {
  title: "Sheet to board" as const,
  description: "Peel a sticker off the sheet (click it, or drag it with a mouse and let go over the board) and it lands on the board. Let go anywhere else and it springs back. Delete it on the board and it returns to its outline on the sheet." as const,
  layout: "full" as const,
  stage: "desk" as const,
  height: 640
};
const NAMES = ["rocket", "cloud-smile", "sun-shades", "ringed-planet", "done", "rainbow", "first-place", "number-one", "a-plus"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const items = shallowRef<StickerBoardItem[]>(initialState([]));
  const setItems = stateSetter(items);
  const boardRef = shallowRef<HTMLDivElement | null | null>(null);
  const onBoard = computed(() => items.value.map(s => s.name));
  return () => {
    return <div class="flex w-full flex-wrap items-start justify-center gap-6 p-4">
      <StickerSheet title="Sticker sheet" columns={3} size={68} peeled={onBoard.value} onPeel={({
        name,
        dragged,
        x,
        y
      }) => {
        const at = dragged && x !== undefined && y !== undefined ? boardPoint(boardRef.value, x, y) : null;
        if (dragged && !at?.inside) return;
        setItems(all => addSticker(all, name, at ?? {
          canvas: {
            width: 460,
            height: 380
          }
        }));
      }} onStick={({
        name
      }) => setItems(all => all.filter(s => s.name !== name))}>
        {NAMES.map(name => <StickerSheetItem key={name} name={name} />)}
      </StickerSheet>
      <StickerBoard ref={boardRef} value={items.value} onValueChange={setItems} size={84} class="h-[30rem] w-full max-w-lg">
        <StickerBoardCanvas class="flex-1" empty="Peel a sticker off the sheet." />
        <StickerBoardToolbar actions={["turn", "size", "layer", "delete"]} />
      </StickerBoard>
    </div>;
  };
});
export default Example;
