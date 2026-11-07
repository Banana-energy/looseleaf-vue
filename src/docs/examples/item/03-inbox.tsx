// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Doodle } from "@/components/ui/doodle";
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Kbd } from "@/components/ui/kbd";
export const meta = {
  title: "An inbox" as const,
  description: "Rows doing real work in a card: photographs that lie a little crooked, a status badge in the title, actions on the right, and a header and footer on the row that needs them." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const messages = [{
  doodle: "sun" as const,
  from: "Mara" as const,
  subject: "Sunday plans" as const,
  preview: "The lake, if the weather holds, and there will be bread." as const,
  fresh: true
}, {
  doodle: "flower" as const,
  from: "The garden club" as const,
  subject: "Bulbs, finally" as const,
  preview: "Two hundred tulips to plant before the ground freezes." as const
}, {
  doodle: "mushroom" as const,
  from: "Ines" as const,
  subject: "You will not believe it" as const,
  preview: "A whole ring of them, right behind the shed." as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-lg" seed="inbox">
      <CardHeader>
        <CardTitle>Inbox</CardTitle>
        <CardDescription>Three letters, one of them new.</CardDescription>
        <CardAction>
          <Badge tally count={3} variant="outline" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup ruled>
          {messages.map(m => <Item key={m.subject}>
              <ItemMedia variant="image">
                <Doodle name={m.doodle} size={36} class="mx-auto mt-0.5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {m.subject}
                  {"fresh" in m && m.fresh ? <Badge size="sm">New</Badge> : null}
                </ItemTitle>
                <ItemDescription>
                  <span class="font-bold">{m.from}</span> · {m.preview}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="sm">
                  Open
                </Button>
              </ItemActions>
            </Item>)}
          <Item variant="muted" class="mt-4">
            <ItemHeader>
              <ItemTitle>Tip</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>Press a letter and it opens; press it again and it closes.</ItemDescription>
            </ItemContent>
            <ItemFooter>
              <span class="text-sm text-muted-foreground">Keep going</span>
              <Kbd>J</Kbd>
            </ItemFooter>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>;
  };
});
export default Example;
