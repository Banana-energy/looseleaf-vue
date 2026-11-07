// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "In real UI" as const,
  description: "Status rows and three real buttons (an icon with a label, an icon on its own, a label with a chevron): color comes from the parent, size from the usual `size-N` classes, and inside a Button the icon takes the button's own size." as const,
  layout: "stack" as const
};
const STATUS = [{
  icon: "circle-check" as const,
  text: "Saved to your notebook" as const,
  tone: "text-green" as const
}, {
  icon: "info" as const,
  text: "Drafts are kept for thirty days" as const,
  tone: "text-ink-you" as const
}, {
  icon: "triangle-alert" as const,
  text: "This page has unsaved changes" as const,
  tone: "text-orange-text" as const
}, {
  icon: "octagon-x" as const,
  text: "Could not reach the server" as const,
  tone: "text-red" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-md flex-col gap-4 text-ink">
      <ul class="flex flex-col gap-2">
        {STATUS.map(s => <li key={s.icon} class={`flex items-center gap-2 ${s.tone}`}>
            <Icon name={s.icon} class="size-5" />
            <span class="text-ink">{s.text}</span>
          </li>)}
      </ul>
      <div class="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Icon name="copy" />
          Copy
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="More">
          <Icon name="ellipsis" />
        </Button>
        <Button variant="ghost" size="sm">
          Options
          <Icon name="chevron-down" />
        </Button>
      </div>
    </div>;
  };
});
export default Example;
