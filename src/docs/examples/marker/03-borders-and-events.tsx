// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
export const meta = {
  title: "Borders and events" as const,
  description: "A border marker heads a section with one line under it (pencil or a red wavy one). The default variant is small print with an icon: someone joined, a call started." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 pb-4">
      <Marker variant="border" seed="b1">
        <MarkerContent class="text-[15px]">Thursday, 12 March</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <Icon name="user-plus" />
        </MarkerIcon>
        <MarkerContent>Lin joined the conversation</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <Icon name="video" />
        </MarkerIcon>
        <MarkerContent>Ada started a call</MarkerContent>
      </Marker>
      <Marker variant="border" tone="new" rule="wavy" seed="b2">
        <MarkerContent class="text-[15px]">3 unread</MarkerContent>
      </Marker>
    </div>;
  };
});
export default Example;
