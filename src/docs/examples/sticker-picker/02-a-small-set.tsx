// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Sticker } from "@/components/ui/sticker";
import { StickerPicker, StickerPickerContent, StickerPickerTrigger } from "@/components/ui/sticker-picker";
export const meta = {
  title: "Your own set" as const,
  description: "Offer only the stickers you want, under your own names and words. Here a reaction picker: four to a row, it stays open so you can react more than once (choose one again to take it back), and the latest choice is marked." as const,
  layout: "center" as const,
  height: 340
};
const REACTIONS = [{
  name: "thumbs-up" as const,
  label: "Nice" as const,
  category: "Vueions" as const,
  tags: ["like", "good"]
}, {
  name: "party-popper" as const,
  label: "Celebrate" as const,
  category: "Vueions" as const,
  tags: ["party", "yay"]
}, {
  name: "heart-eyes" as const,
  label: "Love it" as const,
  category: "Vueions" as const,
  tags: ["love", "heart"]
}, {
  name: "thinking-face" as const,
  label: "Hmm" as const,
  category: "Vueions" as const,
  tags: ["think", "unsure"]
}, {
  name: "done" as const,
  label: "Done" as const,
  category: "Vueions" as const,
  tags: ["finished", "complete"]
}, {
  name: "wow" as const,
  label: "Wow" as const,
  category: "Vueions" as const,
  tags: ["surprised"]
}, {
  name: "ok" as const,
  label: "OK" as const,
  category: "Vueions" as const,
  tags: ["fine", "agree"]
}, {
  name: "eyes-look" as const,
  label: "Looking" as const,
  category: "Vueions" as const,
  tags: ["watching", "see"]
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const mine = shallowRef<string[]>(initialState([]));
  const setMine = stateSetter(mine);
  return () => {
    return <div class="flex items-center gap-3">
      <StickerPicker stickers={REACTIONS} closeOnSelect={false} onSelect={s => setMine(all => all.includes(s.name) ? all.filter(n => n !== s.name) : [...all, s.name])} value={mine.value[mine.value.length - 1]}>
        <StickerPickerTrigger asChild>
          <Button variant="secondary" size="sm">
            Vue
          </Button>
        </StickerPickerTrigger>
        <StickerPickerContent columns={4} size={48} />
      </StickerPicker>
      <ul role="list" class="flex min-h-14 items-center gap-1" aria-label="Your reactions">
        {mine.value.map(n => <li key={n}>
            <Sticker name={n} size={48} label={n} />
          </li>)}
      </ul>
    </div>;
  };
});
export default Example;
