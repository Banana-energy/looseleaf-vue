// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Sticker } from "@/components/ui/sticker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { stickerBatches } from "@/lib/ink/art/stickers";
export const meta = {
  title: "Every sticker drawn so far" as const,
  description: "One shelf per batch, and it grows by itself as new batches land. Only the open shelf is on the page, so a gallery of nearly ninety stickers stays light." as const,
  layout: "stack" as const
};
const SHELVES = [["statusPointers", "Status"], ["spaceWeather", "Space"], ["foodDrink", "Food"], ["officeDesk", "Office"], ["natureAnimals", "Nature"], ["facesCelebrate", "Faces"], ["badgesStamps", "Badges"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Tabs defaultValue={SHELVES[0][0]} class="w-full">
      <TabsList class="w-full">
        {SHELVES.map(([key, label]) => <TabsTrigger key={key} value={key} class="px-2">
            {label}
          </TabsTrigger>)}
      </TabsList>
      {SHELVES.map(([key, label]) => <TabsContent key={key} value={key}>
          <ul role="list" aria-label={`${label} stickers`} class="grid w-full grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4 pt-2">
            {Object.keys(stickerBatches[key]).filter(name => !name.startsWith("stamp-")).map(name => <li key={name} class="flex flex-col items-center gap-1">
                  <Sticker name={name} size={80} />
                  <span class="text-sm text-pencil-text">{name}</span>
                </li>)}
          </ul>
        </TabsContent>)}
    </Tabs>;
  };
});
export default Example;
