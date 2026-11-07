// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "A mail toolbar (groups in a group)" as const,
  description: "The shadcn demo: a ButtonGroup of ButtonGroups. A back button, two text buttons, and a Snooze button joined to a menu trigger whose slip has groups, a destructive row and a sub-menu with a radio choice. Groups put a gap between them; each keeps its own seams." as const,
  layout: "stack" as const,
  height: 500
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const label = shallowRef(initialState("personal"));
  const setLabel = stateSetter(label);
  return () => {
    return <ButtonGroup aria-label="Message actions">
      <ButtonGroup class="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go back">
          <Icon name="arrow-left" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More options">
              <Icon name="ellipsis" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-52" seed="mail-more">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon name="mail-check" />
                Mark as read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="archive" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon name="clock" />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="calendar-plus" />
                Add to calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="list-filter" />
                Add to list
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Icon name="tag" />
                  Label as...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={label.value} onValueChange={setLabel}>
                    <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Icon name="trash" />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>;
  };
});
export default Example;
