// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export const meta = {
  title: "Choice cards" as const,
  description: "A FieldLabel around a whole Field becomes a hand-drawn card; when the radio or checkbox inside it is checked the card gets a highlighter wash and a felt box. Click anywhere on a card." as const,
  layout: "stack" as const
};
const plans = [["starter", "Starter", "One notebook, one pen, no rush."], ["studio", "Studio", "Ten notebooks and the good highlighters."], ["workshop", "Workshop", "A whole desk. Washi tape included."]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <FieldGroup class="w-full max-w-md">
      <FieldSet>
        <FieldLegend variant="label">Plan</FieldLegend>
        <RadioGroup defaultValue="studio" class="gap-3" aria-label="Plan">
          {plans.map(([value, title, help]) => <FieldLabel key={value} for={`cc-${value}`}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{title}</FieldTitle>
                  <FieldDescription>{help}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={value} id={`cc-${value}`} />
              </Field>
            </FieldLabel>)}
        </RadioGroup>
      </FieldSet>
      <FieldLabel for="cc-news">
        <Field orientation="horizontal">
          <Checkbox id="cc-news" defaultChecked />
          <FieldContent>
            <FieldTitle>Field notes newsletter</FieldTitle>
            <FieldDescription>Twice a month, always in pencil.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>;
  };
});
export default Example;
