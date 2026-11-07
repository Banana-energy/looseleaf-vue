// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";
export const meta = {
  title: "Group with separators" as const,
  description: "shadcn's `item-group`: ItemGroup makes the rows a list and ItemSeparator draws the pencil line between them (the last row has none). Nothing here is an svg per row." as const,
  layout: "center" as const
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
    return <div class="flex w-full max-w-md flex-col gap-6">
      <ItemGroup>
        {people.map((person, index) => <Fragment key={person.username}>
            <Item>
              <ItemMedia>
                <Avatar>
                  <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent class="gap-1">
                <ItemTitle>{person.username}</ItemTitle>
                <ItemDescription>{person.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon" class="rounded-full" aria-label={`Add ${person.username}`}>
                  <Icon name="plus" />
                </Button>
              </ItemActions>
            </Item>
            {index !== people.length - 1 && <ItemSeparator />}
          </Fragment>)}
      </ItemGroup>
    </div>;
  };
});
export default Example;
