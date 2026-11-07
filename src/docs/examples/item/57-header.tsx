// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Doodle } from "@/components/ui/doodle";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from "@/components/ui/item";
export const meta = {
  title: "Header" as const,
  description: "shadcn's `item-header`: ItemHeader takes the first, full-width line of a row, so a picture sits above the words. Three cards in a grid; the photographs of the original are doodles here." as const,
  layout: "center" as const
};
const models = [{
  name: "v0-1.5-sm" as const,
  description: "Everyday tasks and UI generation." as const,
  doodle: "feather" as const
}, {
  name: "v0-1.5-lg" as const,
  description: "Advanced thinking or reasoning." as const,
  doodle: "light-bulb" as const
}, {
  name: "v0-2.0-mini" as const,
  description: "Open Source model for everyone." as const,
  doodle: "sprout" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-xl flex-col gap-6">
      <ItemGroup class="grid grid-cols-3 gap-6">
        {models.map(model => <Item key={model.name} variant="outline">
            <ItemHeader>
              <div class="flex aspect-square w-full items-center justify-center">
                <Doodle name={model.doodle} size={64} />
              </div>
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{model.name}</ItemTitle>
              <ItemDescription>{model.description}</ItemDescription>
            </ItemContent>
          </Item>)}
      </ItemGroup>
    </div>;
  };
});
export default Example;
