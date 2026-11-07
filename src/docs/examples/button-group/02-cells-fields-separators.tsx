// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
export const meta = {
  title: "Cells, fields and separators" as const,
  description: "A printed cell, an input and a button in one row; two highlighter buttons split by a pencil line; a split button. Filled buttons want a separator, since two markers touching would just be one big blot." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-md flex-col items-start gap-6">
      <ButtonGroup class="w-full" aria-label="Website">
        <ButtonGroupText asChild>
          <label for="host">https://</label>
        </ButtonGroupText>
        <Input id="host" placeholder="example.com" />
        <Button>Go</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Clipboard">
        <Button variant="secondary">
          <Icon name="copy" />
          Copy
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">Paste</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Save options">
        <Button>Save</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="More save options">
          <Icon name="chevron-down" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Weight">
        <Button variant="outline" size="icon" aria-label="Less">
          <Icon name="minus" />
        </Button>
        <ButtonGroupText class="ll-num min-w-14 justify-center">250</ButtonGroupText>
        <Button variant="outline" size="icon" aria-label="More">
          <Icon name="plus" />
        </Button>
        <ButtonGroupText>grams</ButtonGroupText>
      </ButtonGroup>
    </div>;
  };
});
export default Example;
