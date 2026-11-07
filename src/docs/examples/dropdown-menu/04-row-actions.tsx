// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const meta = {
  title: "Row actions (composed)" as const,
  description: "A real use: a list of notebooks, each row with an ellipsis button that opens its own menu. Choosing Rename or Move to trash changes the list, so you can see the handlers run." as const,
  layout: "center" as const,
  height: 430
};
const START = ["Field notes", "Garden log", "Recipes", "Trip to Lisbon"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const names = shallowRef(initialState(START));
  const setNames = stateSetter(names);
  const last = shallowRef(initialState(""));
  const setLast = stateSetter(last);
  return () => {
    return <Card class="w-full max-w-sm" seed="rows">
      <CardHeader>
        <CardTitle>Notebooks</CardTitle>
        <CardDescription>{last.value || "Open a row's menu with its ellipsis."}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul class="grid gap-1">
          {names.value.map(name => <li key={name} class="flex items-center justify-between gap-2 py-0.5">
              <span class="min-w-0 truncate">{name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${name}`}>
                    <Icon name="ellipsis" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48">
                  <DropdownMenuLabel>{name}</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => setLast(`Opened ${name}`)}>
                    <Icon name="folder-open" /> Open
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setNames(n => n.map(x => x === name ? `${x} (copy)` : x))}>
                    <Icon name="pencil" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => setNames(n => n.filter(x => x !== name))}>
                    <Icon name="trash" /> Move to trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>)}
        </ul>
      </CardContent>
    </Card>;
  };
});
export default Example;
