// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
export const meta = {
  title: "The whole card is the checkbox" as const,
  description: "The shadcn demo's bordered label. Wrap a Field in a FieldLabel and the pair becomes a hand-drawn card; when the box inside is ticked the card gets a highlighter wash and a felt outline. Click anywhere on it, or Tab to the box and press Space." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <FieldGroup class="w-full max-w-sm gap-4">
      <FieldLabel for="cb-card-notify">
        <Field orientation="horizontal">
          <Checkbox id="cb-card-notify" defaultChecked />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel for="cb-card-digest">
        <Field orientation="horizontal">
          <Checkbox id="cb-card-digest" />
          <FieldContent>
            <FieldTitle>Weekly digest</FieldTitle>
            <FieldDescription>One email on Friday with everything you missed.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>;
  };
});
export default Example;
