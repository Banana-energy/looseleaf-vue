// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "Default" as const,
  description: "A set of labeled controls: a legend in the script font, fields that stack label, control and help, and the gaps between them. Nothing is drawn but the controls; Field is layout and words." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="w-full max-w-md">
      <FieldSet>
        <FieldLegend>Your notebook</FieldLegend>
        <FieldDescription>Everything is saved as you write, in pencil.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel for="nb-name">Name</FieldLabel>
            <Input id="nb-name" placeholder="Field notes" />
            <FieldDescription>Shows on the spine. You can change it later.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="nb-about">About</FieldLabel>
            <Textarea id="nb-about" placeholder="What is it for?" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>;
  };
});
export default Example;
