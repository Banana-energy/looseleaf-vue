// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const meta = {
  title: "Photo and initials" as const,
  description: "A picture circled by hand, and what shows while there is none: initials on a disc of marker whose color is chosen from the name. The four sizes are `sm`, `default`, `lg` and `xl`; `AvatarBadge` puts a status dot on the corner." as const,
  layout: "center" as const
};
const portrait = (a: string, b: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='64' height='64' fill='url(#g)'/><circle cx='32' cy='26' r='11' fill='#3a2f28' opacity='.55'/><ellipse cx='32' cy='62' rx='23' ry='19' fill='#3a2f28' opacity='.5'/></svg>`)}`;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-end gap-6">
      <Avatar size="sm">
        <AvatarImage src={portrait("#f6c9a0", "#c98a68")} alt="Ada Lovelace" />
        <AvatarFallback name="Ada Lovelace" />
      </Avatar>
      <Avatar>
        <AvatarImage src={portrait("#b8d4ea", "#6f97be")} alt="Jo Okafor" />
        <AvatarFallback name="Jo Okafor" />
        <AvatarBadge status="online" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/missing-portrait.png" alt="" />
        <AvatarFallback name="Mika Kobayashi" />
        <AvatarBadge status="away" />
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback name="Sam Reyes" />
        <AvatarBadge status="busy" />
      </Avatar>
    </div>;
  };
});
export default Example;
