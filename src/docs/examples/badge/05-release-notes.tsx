// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Release notes" as const,
  description: "Badges doing real work in a card: a status next to the title, the kind of each change in front of its line, and a tally of how many are left to read." as const,
  layout: "stack" as const
};
const changes = [{
  kind: "New" as const,
  variant: "default" as const,
  text: "Pencil-drawn spinner that scribbles while it waits" as const
}, {
  kind: "Fixed" as const,
  variant: "secondary" as const,
  text: "Focus rings no longer clip inside scroll areas" as const
}, {
  kind: "Breaking" as const,
  variant: "destructive" as const,
  text: "Badge is a span again; wrap it in a link with asChild" as const
}, {
  kind: "Note" as const,
  variant: "outline" as const,
  text: "The hover tilt is off for reduced motion" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-md" seed="release">
      <CardHeader>
        <CardTitle class="flex items-center gap-3">
          v2.4.0
          <Badge variant="secondary">
            <Icon name="badge-check" />
            Latest
          </Badge>
        </CardTitle>
        <CardDescription>Released this morning, four changes.</CardDescription>
        <CardAction>
          <Badge tally count={4} variant="outline" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul role="list" class="flex flex-col gap-3">
          {changes.map(c => <li key={c.text} class="flex items-baseline gap-3">
              <Badge variant={c.variant} size="sm" class="min-w-16">
                {c.kind}
              </Badge>
              <span class="text-[15px] leading-snug">{c.text}</span>
            </li>)}
        </ul>
      </CardContent>
      <CardFooter class="border-t">
        <Button variant="link" size="sm">
          Read the full changelog
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
