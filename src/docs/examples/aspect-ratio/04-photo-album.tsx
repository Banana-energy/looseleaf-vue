// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Doodle } from "@/components/ui/doodle";
export const meta = {
  title: "A photo album" as const,
  description: "Thumbnails that stay 4:3 whatever the columns do, each with its caption underneath. Resize the window: the grid reflows and every picture keeps its shape." as const,
  layout: "stack" as const
};
const photos = [{
  title: "The lake" as const,
  doodle: "sun" as const,
  tint: "bg-sky/35" as const
}, {
  title: "First tulip" as const,
  doodle: "flower" as const,
  tint: "bg-lemon/40" as const
}, {
  title: "The ring behind the shed" as const,
  doodle: "mushroom" as const,
  tint: "bg-bubblegum/35" as const
}, {
  title: "Night walk" as const,
  doodle: "star" as const,
  tint: "bg-grape/25" as const
}, {
  title: "Picnic" as const,
  doodle: "sun" as const,
  tint: "bg-tangerine/25" as const
}, {
  title: "Bread" as const,
  doodle: "flower" as const,
  tint: "bg-grass/30" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-2xl" seed="album">
      <CardHeader>
        <CardTitle>Field trip, June</CardTitle>
        <CardDescription>Six photographs, none of them straight.</CardDescription>
        <CardAction>
          <Badge variant="secondary">6 photos</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map(p => <figure key={p.title} class="flex flex-col gap-1.5">
              <AspectRatio ratio={4 / 3} class={`grid place-items-center overflow-hidden ${p.tint}`}>
                <Doodle name={p.doodle} size={56} />
              </AspectRatio>
              <figcaption class="text-sm leading-tight">{p.title}</figcaption>
            </figure>)}
        </div>
      </CardContent>
    </Card>;
  };
});
export default Example;
