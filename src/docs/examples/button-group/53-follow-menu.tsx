// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "A button with a menu (Follow)" as const,
  description: "A split button the way social apps use it: the main action toggles (Follow / Following, with `aria-pressed`) and the chevron opens every other thing you can do with the conversation. The menu's last row is the destructive one." as const,
  layout: "stack" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const following = shallowRef(initialState(false));
  const setFollowing = stateSetter(following);
  return () => {
    return <ButtonGroup aria-label="Conversation">
      <Button variant="outline" aria-pressed={following.value} onClick={() => setFollowing(!following.value)}>
        {following.value ? "Following" as const : "Follow" as const}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More conversation actions">
            <Icon name="chevron-down" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56" seed="follow-menu">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon name="volume-off" />
              Mute conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="check" />
              Mark as read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="flag" />
              Report conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="ban" />
              Block user
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="share" />
              Share conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="copy" />
              Copy conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <Icon name="trash" />
              Delete conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>;
  };
});
export default Example;
