// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Doodle } from "@/components/ui/doodle";
import { Icon } from "@/components/ui/icon";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment";
export const meta = {
  title: "Prints on the wall" as const,
  description: "orientation=\"vertical\" is a photo with a white border, taped up. Put an `<img>` in the media; here a doodle stands in. A group scrolls sideways and snaps when its prints are wider than the box." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const PRINTS = [{
  name: "harbour.jpg" as const,
  size: "1.8 MB" as const,
  doodle: "sun" as const,
  tint: "bg-sky/45" as const
}, {
  name: "sketch-04.png" as const,
  size: "620 KB" as const,
  doodle: "flower" as const,
  tint: "bg-lemon/50" as const
}, {
  name: "mushrooms.jpg" as const,
  size: "2.1 MB" as const,
  doodle: "mushroom" as const,
  tint: "bg-bubblegum/40" as const
}, {
  name: "night.jpg" as const,
  size: "980 KB" as const,
  doodle: "star" as const,
  tint: "bg-grass/40" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <AttachmentGroup class="mx-auto max-w-2xl">
      {PRINTS.map(p => <Attachment key={p.name} orientation="vertical" seed={p.name}>
          <AttachmentMedia variant="image" class={p.tint}>
            <Doodle name={p.doodle} size={64} seed={p.name} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{p.name}</AttachmentTitle>
            <AttachmentDescription>{p.size}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentTrigger aria-label={`Open ${p.name}`} />
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${p.name}`} size="icon-xs">
              <Icon name="x" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>)}
    </AttachmentGroup>;
  };
});
export default Example;
