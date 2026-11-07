// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
export interface SearchInputProps extends Omit<UI.ComponentProps<"input">, "type"> {
  label: string;
}
export const SearchInput = defineUi<SearchInputProps>("SearchInput", ["label", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["label", "class"]));
  return () => {
    return <InputGroup class={className.value}>
      <InputGroupAddon>
        <Icon name="search" size={18} />
      </InputGroupAddon>
      <InputGroupInput type="search" aria-label={label.value} autocomplete="off" spellcheck={false} {...domProps(props.value)}>{_slots.default?.()}</InputGroupInput>
    </InputGroup>;
  };
});
