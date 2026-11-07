// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
export const meta = {
  title: "In a dropdown" as const,
  description: "shadcn's `item-dropdown`: each menu row is an Item (`className=\"p-0\"` on the menu item, `p-2` on the Item), so a menu can show a face, a name and a line of detail. Arrow keys and typeahead still belong to the menu." as const,
  layout: "center" as const,
  height: 340
};
const people = [{
  username: "shadcn" as const,
  email: "shadcn@looseleaf.example" as const
}, {
  username: "maxleiter" as const,
  email: "maxleiter@looseleaf.example" as const
}, {
  username: "evilrabbit" as const,
  email: "evilrabbit@looseleaf.example" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" class="w-fit">
            Select <Icon name="chevron-down" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-72" align="end">
          {people.map(person => <DropdownMenuItem key={person.username} class="p-0">
              <Item size="sm" class="w-full p-2">
                <ItemMedia>
                  <Avatar class="size-8">
                    <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent class="gap-0.5">
                  <ItemTitle>{person.username}</ItemTitle>
                  <ItemDescription>{person.email}</ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
  };
});
export default Example;
