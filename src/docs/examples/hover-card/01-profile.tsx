// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Doodle } from "@/components/ui/doodle";
import { HoverCard, HoverCardCaption, HoverCardContent, HoverCardMedia, HoverCardTrigger } from "@/components/ui/hover-card";
export const meta = {
  title: "Profile" as const,
  description: "The shadcn demo as a polaroid: hover the link (or tab to it) and a small photo with handwriting on its margin lands next to it." as const,
  layout: "center" as const,
  height: 340
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-center gap-1 self-start text-base">
      Made by
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" class="px-1" asChild>
            <a href="https://looseleaf-vue.banana-energy.cn">@looseleaf</a>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent seed="profile">
          <HoverCardMedia>
            <Doodle name="flower" size={88} />
          </HoverCardMedia>
          <HoverCardCaption>@looseleaf</HoverCardCaption>
          <p class="px-1 text-sm text-muted-foreground">shadcn/ui, drawn by hand. Joined September 2026.</p>
        </HoverCardContent>
      </HoverCard>
    </div>;
  };
});
export default Example;

