// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { StickerBoard, StickerBoardCanvas, StickerBoardToolbar, addSticker, type StickerBoardItem } from "@/components/ui/sticker-board";
import { StickerPicker, StickerPickerContent, StickerPickerTrigger } from "@/components/ui/sticker-picker";
export const meta = {
  title: "Board and picker" as const,
  description: "The picker chooses, addSticker sticks: the new sticker lands in the middle of the page, already picked, so it can be turned and sized straight away. Export downloads the whole page as one SVG." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 640
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const items = shallowRef<StickerBoardItem[]>(initialState([]));
  const setItems = stateSetter(items);
  const selected = shallowRef<string | null>(initialState(null));
  const setSelected = stateSetter(selected);
  const recent = shallowRef<string[]>(initialState([]));
  const setRecent = stateSetter(recent);
  const board = shallowRef<HTMLDivElement | null>(null);
  const page = computed(() => () => {
    const r = board.value?.querySelector('[data-slot="sticker-board-canvas"]')?.getBoundingClientRect();
    return {
      width: r?.width || 520,
      height: r?.height || 380
    };
  });
  return () => {
    return <StickerBoard ref={board} value={items.value} onValueChange={setItems} selectedId={selected.value} onSelectedIdChange={setSelected} class="h-[34rem] w-full max-w-2xl">
      <div class="flex items-center gap-3">
        <StickerPicker recent={recent.value} onSelect={s => {
          const next = addSticker(items.value, s.name, {
            canvas: page.value()
          });
          setItems(next);
          setSelected(next[next.length - 1].id);
          setRecent(r => [s.name, ...r.filter(n => n !== s.name)].slice(0, 6));
        }}>
          <StickerPickerTrigger asChild>
            <Button>
              <Icon name="plus" />
              Add sticker
            </Button>
          </StickerPickerTrigger>
          <StickerPickerContent />
        </StickerPicker>
        <p class="text-muted-foreground">{items.value.length === 0 ? "Start with a sticker." as const : `${items.value.length} on the page`}</p>
      </div>
      <StickerBoardCanvas class="flex-1" empty="Nothing stuck down yet. Add a sticker." />
      <StickerBoardToolbar />
    </StickerBoard>;
  };
});
export default Example;
