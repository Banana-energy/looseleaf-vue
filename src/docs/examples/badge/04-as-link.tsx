// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
export const meta = {
  title: "As a link" as const,
  description: "asChild hands the badge to your own element. Hover a link badge: the filled ones lift a drop-line, the outline gets a highlighter wash, ghost swipes and link underlines. Tab to it for the felt ring." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-4">
      <Badge asChild>
        <a href="#badge">Docs</a>
      </Badge>
      <Badge asChild variant="secondary">
        <a href="#badge">Releases</a>
      </Badge>
      <Badge asChild variant="outline">
        <a href="#badge">#design</a>
      </Badge>
      <Badge asChild variant="ghost">
        <a href="#badge">Ghost link</a>
      </Badge>
      <Badge asChild variant="link">
        <a href="#badge">Read the changelog</a>
      </Badge>
    </div>;
  };
});
export default Example;
