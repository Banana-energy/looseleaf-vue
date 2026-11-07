// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Team card" as const,
  description: "A people list in a card: face, name, role, and a presence dot. Each face is a separate small drawing (the list is short); a list of hundreds would use `ring=\"none\"`." as const,
  layout: "center" as const,
  height: 460
};
const team = [{
  name: "Ada Lovelace" as const,
  role: "Designer" as const,
  status: "online" as const
}, {
  name: "Jo Okafor" as const,
  role: "Engineer" as const,
  status: "busy" as const
}, {
  name: "Mika Kobayashi" as const,
  role: "Writer" as const,
  status: "away" as const
}, {
  name: "Sam Reyes" as const,
  role: "Support" as const,
  status: "offline" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card seed="team" class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>On the team</CardTitle>
        <CardDescription>4 people, 2 of them at their desks.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent class="grid gap-4">
        {team.map(p => <div key={p.name} class="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback name={p.name} />
              <AvatarBadge status={p.status}>
                <span class="sr-only">{p.status}</span>
              </AvatarBadge>
            </Avatar>
            <div class="grid leading-tight">
              <span class="font-bold">{p.name}</span>
              <span class="text-sm text-muted-foreground">{p.role}</span>
            </div>
          </div>)}
        <div class="flex items-center gap-3 pt-1">
          <AvatarGroup>
            {["Priya Nair", "Tomas Berg", "Lena Fischer"].map(n => <Avatar key={n} size="sm">
                <AvatarFallback name={n} />
              </Avatar>)}
            <AvatarGroupCount>+5</AvatarGroupCount>
          </AvatarGroup>
          <span class="text-sm text-muted-foreground">also watching</span>
        </div>
      </CardContent>
    </Card>;
  };
});
export default Example;
