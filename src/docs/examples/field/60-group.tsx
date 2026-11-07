// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
export const meta = {
  title: "Field group" as const,
  description: "shadcn's `field-group`: FieldGroups stack fields and FieldSets, and `data-slot=\"checkbox-group\"` tightens the gap between boxes. The first box is checked and disabled, the second set has a link in its help line." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Responses</FieldLegend>
          <FieldDescription>Get notified when ChatGPT responds to requests that take time, like research or image generation.</FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            <Field orientation="horizontal">
              <Checkbox id="field-group-push" defaultChecked disabled />
              <FieldLabel for="field-group-push" class="font-normal">
                Push notifications
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend variant="label">Tasks</FieldLegend>
          <FieldDescription>
            Get notified when tasks you&apos;ve created have updates. <a href="#manage-tasks">Manage tasks</a>
          </FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            <Field orientation="horizontal">
              <Checkbox id="field-group-push-tasks" />
              <FieldLabel for="field-group-push-tasks" class="font-normal">
                Push notifications
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="field-group-email-tasks" />
              <FieldLabel for="field-group-email-tasks" class="font-normal">
                Email notifications
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>;
  };
});
export default Example;
