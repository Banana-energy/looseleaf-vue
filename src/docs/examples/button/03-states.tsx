// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "States" as const,
  description: "Rest, hover, pressed, keyboard focus and disabled, forced with data attributes (data-hover, data-pressed, data-focus-visible) so they can be compared side by side. Hover any button yourself: the drawing tilts and lifts a shadow line." as const,
  layout: "center" as const
};
const variants = ["default", "destructive", "outline", "secondary", "ghost", "link"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid grid-cols-[repeat(5,auto)] items-center justify-start gap-x-5 gap-y-5">
      {["rest", "hover", "pressed", "focus", "disabled"].map(state => <span key={state} class="font-script text-lg text-ink-you">
          {state}
        </span>)}
      {variants.map(variant => <div key={variant} class="contents">
          <Button variant={variant}>{variant}</Button>
          <Button variant={variant} data-hover>
            {variant}
          </Button>
          <Button variant={variant} data-pressed>
            {variant}
          </Button>
          <Button variant={variant} data-focus-visible>
            {variant}
          </Button>
          <Button variant={variant} disabled>
            {variant}
          </Button>
        </div>)}
    </div>;
  };
});
export default Example;
