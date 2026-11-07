// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
export const meta = {
  title: "Color from the name" as const,
  description: "Give `AvatarFallback` a `name` and it makes the initials, picks one of eight stationery colors from the name (the same person is the same color everywhere) and lets a screen reader hear the full name instead of two letters. `ring` picks the pen of the loop, and `\"none\"` draws no loop for long lists." as const,
  layout: "center" as const
};
const people = ["Ada Lovelace", "Jo Okafor", "Mika Kobayashi", "Sam Reyes", "Priya Nair", "Tomas Berg", "Lena Fischer", "Omar Haddad", "Yuki Tanaka", "Ines Moreau", "Kofi Mensah", "Nora Lindqvist"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-6">
      <div class="flex flex-wrap gap-4">
        {people.map(name => <Avatar key={name} size="lg">
            <AvatarFallback name={name} />
          </Avatar>)}
      </div>
      <div class="flex items-center gap-5">
        <Avatar size="lg" ring="you">
          <AvatarFallback name="Ada Lovelace" />
          <AvatarBadge status="online" />
        </Avatar>
        <Avatar size="lg" ring="marker">
          <AvatarFallback name="Ada Lovelace" />
        </Avatar>
        <Avatar size="lg" ring="none">
          <AvatarFallback name="Ada Lovelace" />
        </Avatar>
        <span class="text-sm text-muted-foreground">ring: you, marker, none</span>
      </div>
    </div>;
  };
});
export default Example;
