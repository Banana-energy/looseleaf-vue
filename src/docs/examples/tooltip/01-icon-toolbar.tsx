// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const meta = {
  title: "Icon toolbar" as const,
  description: "The everyday use: names for icon buttons. One provider holds the delay (a calm 300 ms), and once one note is open the next opens at once as you sweep along the row. Each button still has its own aria-label." as const,
  layout: "center" as const,
  height: 220
};
const TOOLS = [{
  icon: "plus" as const,
  label: "Add to library" as const
}, {
  icon: "pencil" as const,
  label: "Edit notebook" as const
}, {
  icon: "copy" as const,
  label: "Duplicate" as const
}, {
  icon: "trash" as const,
  label: "Move to bin" as const
}, {
  icon: "settings" as const,
  label: "Settings" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TooltipProvider delayDuration={300}>
      <div class="flex gap-2 pt-10" role="toolbar" aria-label="Notebook actions">
        {TOOLS.map((t, i) => <Tooltip key={t.label}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label={t.label}>
                <Icon name={t.icon} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" seed={`tool-${i}`}>
              {t.label}
            </TooltipContent>
          </Tooltip>)}
      </div>
    </TooltipProvider>;
  };
});
export default Example;
