// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tally } from "@/components/ui/tally";
import { InkProvider } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
import { providerProps, type Appearance, type PaperChoice } from "@/blocks/settings-appearance/components/settings-appearance-options";
const STOCK: Record<PaperChoice, {
  stock: "paper" | "graph" | "dot-grid" | "kraft";
  rules?: "ruled" | "none";
}> = {
  plain: {
    stock: "paper" as const,
    rules: "none" as const
  },
  ruled: {
    stock: "paper" as const,
    rules: "ruled" as const
  },
  graph: {
    stock: "graph" as const
  },
  dots: {
    stock: "dot-grid" as const
  },
  kraft: {
    stock: "kraft" as const,
    rules: "none" as const
  }
};
export const SettingsAppearancePreview = defineUi<{
  appearance: Appearance;
}>("SettingsAppearancePreview", ["appearance"], (_props, {
  slots: _slots
}) => {
  const appearance = computed(() => _props["appearance"]);
  const id = useId();
  const paper = computed(() => STOCK[appearance.value.paper]);
  const ruled = computed(() => paper.value.rules === "ruled");
  return () => {
    return <InkProvider {...domProps(providerProps(appearance.value))}>
      <div dir={appearance.value.dir} role="region" aria-label="Preview">
        <Paper stock={paper.value.stock} rules={paper.value.rules} seed="appearance-preview" class={cn("grid gap-4 p-5 pt-6", ruled.value && "pt-4 ps-14 rtl:[&>[data-slot=paper-rules]]:-scale-x-100")} tape="top">
          <div class={cn("grid", !ruled.value && "gap-4")}>
            <h3 class={cn("font-script text-2xl font-semibold", ruled.value ? "relative top-[calc(3px-var(--ll-rule-offset,8px))] leading-7 calm:top-[calc(1px-var(--ll-rule-offset,6px))] calm:leading-6" as const : "leading-none" as const)}>Field notes</h3>
            <p class={cn("text-[15px]", ruled.value && "leading-7 calm:leading-6")}>Tuesday. Rain on the window, three cups of tea, and one very small plan for a very big week.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
            <Badge>3 new</Badge>
            <Tally count={7} size="sm" label="7 pages" />
          </div>
          <Input aria-label="Add a tag" placeholder="Add a tag" />
          <div class="flex items-center gap-2">
            <Checkbox id={`${id}-c`} defaultChecked />
            <Label for={`${id}-c`}>Ink the outline</Label>
          </div>
          <div class="flex items-center gap-2">
            <Switch id={`${id}-s`} defaultChecked />
            <Label for={`${id}-s`}>Share with the club</Label>
          </div>
          <Progress value={64} aria-label="Pages done" />
        </Paper>
      </div>
    </InkProvider>;
  };
});
