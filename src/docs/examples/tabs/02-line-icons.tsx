// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const meta = {
  title: "Line tabs with icons" as const,
  description: "`variant=\"line\"` is a hairline with the active tab underlined in blue felt, wiped in from the reading side. Icons sit at 16 px in the same weight as the label; a disabled tab is skipped by the arrow keys." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Tabs defaultValue="profile" class="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="profile">
          <Icon name="user" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Icon name="settings" />
          Settings
        </TabsTrigger>
        <TabsTrigger value="alerts" disabled>
          <Icon name="bell" />
          Alerts
        </TabsTrigger>
        <TabsTrigger value="search">
          <Icon name="search" />
          Search
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" class="text-sm text-muted-foreground">
        Your name, your photo and the sentence people see first.
      </TabsContent>
      <TabsContent value="settings" class="text-sm text-muted-foreground">
        Language, density and how much the ink moves.
      </TabsContent>
      <TabsContent value="search" class="text-sm text-muted-foreground">
        Find a page, a note or a person.
      </TabsContent>
    </Tabs>;
  };
});
export default Example;
