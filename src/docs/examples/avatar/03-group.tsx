// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Groups" as const,
  description: "`AvatarGroup` overlaps faces and a paper-colored ring cuts each one out of the last (`--ll-avatar-ring` changes the color on a different surface). `AvatarGroupCount` is the sketched disc for everyone who did not fit; it takes text or an icon." as const,
  layout: "center" as const,
  height: 240
};
const portrait = (a: string, b: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='64' height='64' fill='url(#g)'/><circle cx='32' cy='26' r='11' fill='#3a2f28' opacity='.55'/><ellipse cx='32' cy='62' rx='23' ry='19' fill='#3a2f28' opacity='.5'/></svg>`)}`;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-6">
      <AvatarGroup>
        <Avatar>
          <AvatarImage src={portrait("#f6c9a0", "#c98a68")} alt="Ada Lovelace" />
          <AvatarFallback name="Ada Lovelace" />
        </Avatar>
        <Avatar>
          <AvatarFallback name="Jo Okafor" />
        </Avatar>
        <Avatar>
          <AvatarImage src={portrait("#b8d4ea", "#6f97be")} alt="Mika Kobayashi" />
          <AvatarFallback name="Mika Kobayashi" />
        </Avatar>
        <Avatar>
          <AvatarFallback name="Sam Reyes" />
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        {["Priya Nair", "Tomas Berg", "Lena Fischer"].map(n => <Avatar key={n} size="lg">
            <AvatarFallback name={n} />
          </Avatar>)}
        <AvatarGroupCount>
          <Icon name="plus" />
          <span class="sr-only">Invite someone</span>
        </AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        {["Omar Haddad", "Yuki Tanaka", "Ines Moreau", "Kofi Mensah"].map(n => <Avatar key={n} size="sm">
            <AvatarFallback name={n} />
          </Avatar>)}
        <AvatarGroupCount>+8</AvatarGroupCount>
      </AvatarGroup>
    </div>;
  };
});
export default Example;
