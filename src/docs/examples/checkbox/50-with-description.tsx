// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
export const meta = {
  title: "With a description" as const,
  description: "A label and a line of help beside the box. Field keeps the box level with the first line of text however long the help runs, and `data-disabled` on the Field dims the label and the help together with the disabled box." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <FieldGroup class="w-full max-w-sm gap-5">
      <Field orientation="horizontal">
        <Checkbox id="cb-terms" defaultChecked />
        <FieldContent>
          <FieldLabel for="cb-terms">Accept terms and conditions</FieldLabel>
          <FieldDescription>By clicking this checkbox, you agree to the terms and conditions.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="cb-policy" />
        <FieldContent>
          <FieldLabel for="cb-policy">Accept terms and conditions</FieldLabel>
          <FieldDescription>You agree to our Terms of Service and Privacy Policy.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled="true">
        <Checkbox id="cb-locked" disabled />
        <FieldContent>
          <FieldLabel for="cb-locked">Enable notifications</FieldLabel>
          <FieldDescription>Switched off by your administrator.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>;
  };
});
export default Example;
