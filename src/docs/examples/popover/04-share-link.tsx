// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "Share link (composed)" as const,
  description: "A real use: a share popover with a read-only link and a copy button that confirms. Focus goes to the field, the link is selected on focus, Escape returns you to the trigger." as const,
  layout: "center" as const,
  height: 300
};
const LINK = "https://kevintngo.github.io/looseleaf/n/field-notes";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const copied = shallowRef(initialState(false));
  const setCopied = stateSetter(copied);
  return () => {
    async function copy() {
      try {
        await navigator.clipboard.writeText(LINK);
      } catch {}
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
    return <Popover onOpenChange={() => setCopied(false)}>
      <PopoverTrigger asChild>
        <Button class="self-start">
          <Icon name="copy" /> Share
        </Button>
      </PopoverTrigger>
      <PopoverContent arrow tape="top" seed="share" align="start" class="w-80">
        <PopoverHeader>
          <PopoverTitle>Share this notebook</PopoverTitle>
          <PopoverDescription>Anyone with the link can read it.</PopoverDescription>
        </PopoverHeader>
        <div class="mt-3 grid gap-2">
          <Label for="share-link" class="sr-only">
            Link
          </Label>
          <div class="flex gap-2">
            <Input id="share-link" readonly defaultValue={LINK} onFocus={(e: FocusEvent) => (e.currentTarget as HTMLInputElement).select()} />
            <Button variant="secondary" onClick={copy} aria-live="polite">
              {copied.value ? "Copied" as const : "Copy" as const}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>;
  };
});
export default Example;
