// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "Orientations" as const,
  description: "`vertical` (label above), `horizontal` (label beside a switch or checkbox, with FieldContent holding the words) and `responsive` (vertical until its FieldGroup is md wide, using a container query, so it follows the box, not the screen)." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <FieldGroup class="w-full max-w-lg">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="o-sync">Sync to the cloud</FieldLabel>
          <FieldDescription>Keeps every page on all your devices.</FieldDescription>
        </FieldContent>
        <Switch id="o-sync" defaultChecked />
      </Field>
      <FieldSeparator />
      <Field orientation="horizontal">
        <Checkbox id="o-terms" defaultChecked />
        <FieldContent>
          <FieldLabel for="o-terms">Accept the terms</FieldLabel>
          <FieldDescription>You agree to the small print and the big print.</FieldDescription>
        </FieldContent>
      </Field>
      <FieldSeparator>responsive</FieldSeparator>
      <Field orientation="responsive">
        <FieldContent>
          <FieldTitle>Display name</FieldTitle>
          <FieldDescription>Stacks on narrow boxes, sits in a row on wide ones.</FieldDescription>
        </FieldContent>
        <Input placeholder="Ada" aria-label="Display name" class="max-w-56" />
      </Field>
    </FieldGroup>;
  };
});
export default Example;
