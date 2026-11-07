// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "Sizes and states" as const,
  description: "Default and sm, off and on, invalid (red pencil outline that stays red when it is on) and disabled (dashed pencil, graphite fill). The thumb's side and the fill carry the state, so it never rests on color alone." as const,
  layout: "stack" as const
};
const rows = [["default", {}], ["sm", {
  size: "sm" as const
}]] as const;
const columns = ["off", "on", "invalid", "invalid on", "disabled", "disabled on"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-4">
      <div class="grid gap-x-3 gap-y-3.5 [grid-template-columns:3.5rem_repeat(6,5rem)]">
        <span aria-hidden="true" />
        {columns.map(c => <span key={c} aria-hidden="true" class="text-[13px] leading-tight whitespace-nowrap text-ink-muted">
            {c}
          </span>)}
        {rows.map(([name, props]) => <Fragment key={name}>
            <span class="self-center text-sm text-ink-muted">{name}</span>
            <Switch {...domProps(props)} aria-label={`${name} off`}>{_slots.default?.()}</Switch>
            <Switch {...domProps(props)} defaultChecked aria-label={`${name} on`}>{_slots.default?.()}</Switch>
            <Switch {...domProps(props)} aria-invalid aria-label={`${name} invalid`}>{_slots.default?.()}</Switch>
            <Switch {...domProps(props)} aria-invalid defaultChecked aria-label={`${name} invalid on`}>{_slots.default?.()}</Switch>
            <Switch {...domProps(props)} disabled aria-label={`${name} disabled`}>{_slots.default?.()}</Switch>
            <Switch {...domProps(props)} disabled defaultChecked aria-label={`${name} disabled on`}>{_slots.default?.()}</Switch>
          </Fragment>)}
      </div>
      <div class="flex items-center gap-3">
        <Switch id="locked" disabled defaultChecked />
        <Label for="locked">Locked by your administrator</Label>
      </div>
    </div>;
  };
});
export default Example;
