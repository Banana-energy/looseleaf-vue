// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sticker } from "@/components/ui/sticker";
import { StickerPicker, StickerPickerContent, StickerPickerTrigger } from "@/components/ui/sticker-picker";
export const meta = {
  title: "A sticker for the job" as const,
  description: "Type to search, click a category, or walk the grid with the arrow keys. The highlighted sticker peels its corner; Enter sticks it." as const,
  layout: "center" as const,
  height: 520
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const name = shallowRef<string | null>(initialState(null));
  const setName = stateSetter(name);
  return () => {
    return <div class="flex items-center gap-4">
      <StickerPicker value={name.value} onSelect={s => setName(s.name)}>
        <StickerPickerTrigger asChild>
          <Button variant="outline">
            <Icon name="star" />
            Add sticker
          </Button>
        </StickerPickerTrigger>
        <StickerPickerContent />
      </StickerPicker>
      <div class="grid size-28 place-items-center text-muted-foreground" aria-live="polite">
        {name.value ? <Sticker name={name.value} size={88} label={`Chosen: ${name.value}`} /> : <span class="font-script text-xl">none yet</span>}
      </div>
    </div>;
  };
});
export default Example;
