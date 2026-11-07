// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
const PrefsCard = defineUi<{}>("PrefsCard", [], (_props, {
  slots: _slots
}) => {
  const pressure = shallowRef(initialState([60]));
  const setPressure = stateSetter(pressure);
  return () => {
    return <IndexCard data-home="prefs" seed="home-prefs" flag="sky" stack={1} class="w-full max-w-md">
      <IndexCardHeader>
        <IndexCardTitle>Settings</IndexCardTitle>
      </IndexCardHeader>
      <IndexCardContent>
        <div class="flex h-[30px] items-center justify-between gap-3">
          <Label for="home-airplane">Airplane mode</Label>
          <Switch id="home-airplane" />
        </div>
        <div class="flex h-[30px] items-center justify-between gap-3">
          <Label for="home-pencil">Write in pencil</Label>
          <Switch id="home-pencil" defaultChecked />
        </div>
        <div class="flex h-[30px] items-center gap-3">
          <Label id="home-pressure-label" class="shrink-0">
            Pen pressure
          </Label>
          <Slider value={pressure.value} onValueChange={setPressure} max={100} step={1} aria-labelledby="home-pressure-label" class="min-w-0 flex-1" />
          <output aria-label="Pen pressure value" class="ll-num w-8 shrink-0 text-end font-script text-xl leading-none text-ink-you">
            {pressure.value[0]}
          </output>
        </div>
        <div class="flex h-[30px] items-center gap-2">
          <Checkbox id="home-tally" defaultChecked />
          <Label for="home-tally">Keep score with tally marks</Label>
        </div>
      </IndexCardContent>
      <IndexCardFooter>
        <span class="ll-num">no. 0007</span>
        <span class="ll-num">p. 1</span>
      </IndexCardFooter>
    </IndexCard>;
  };
});
export default PrefsCard;
