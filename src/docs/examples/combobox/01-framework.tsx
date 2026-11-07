// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox";
export const meta = {
  title: "Framework picker" as const,
  description: "The shadcn recipe: press the field, type to narrow (\"svelte\" finds SvelteKit), arrow keys and Enter to choose. The chosen row ends in a blue tick. Try a word that matches nothing to meet Stubby." as const,
  layout: "center" as const,
  height: 380
};
const FRAMEWORKS = [{
  value: "next" as const,
  label: "Next.js" as const
}, {
  value: "sveltekit" as const,
  label: "SvelteKit" as const
}, {
  value: "nuxt" as const,
  label: "Nuxt.js" as const
}, {
  value: "remix" as const,
  label: "Remix" as const
}, {
  value: "astro" as const,
  label: "Astro" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef<string | null>(initialState("next"));
  const setValue = stateSetter(value);
  return () => {
    return <div class="self-start">
      <Combobox items={FRAMEWORKS} value={value.value} onValueChange={setValue} label="Framework">
        <ComboboxTrigger aria-label="Framework" class="w-64">
          <ComboboxValue placeholder="Select framework..." />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search framework..." />
          <ComboboxList>
            <ComboboxEmpty>No framework found.</ComboboxEmpty>
            <ComboboxGroup>
              {FRAMEWORKS.map(f => <ComboboxItem key={f.value} value={f.value}>
                  {f.label}
                </ComboboxItem>)}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>;
  };
});
export default Example;
