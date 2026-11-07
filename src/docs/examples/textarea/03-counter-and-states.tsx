// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "Counter and states" as const,
  description: "showCount with maxLength; the second field turns red when it is too short. Disabled and read-only fields are drawn as such." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const bio = shallowRef(initialState(""));
  const setBio = stateSetter(bio);
  const short = computed(() => bio.value.length > 0 && bio.value.length < 20);
  return () => {
    return <div class="grid w-full max-w-md gap-5">
      <Textarea aria-label="Bio" placeholder="A few words about you (20 or more)" maxlength={140} showCount value={bio.value} onChange={(e: Event) => setBio((e.target as HTMLTextAreaElement).value)} aria-invalid={short.value} />
      <Textarea aria-label="Locked" disabled defaultValue="Nothing to add." />
      <Textarea aria-label="Read only" readonly defaultValue="Printed in the margin: this one cannot be edited, only selected." />
    </div>;
  };
});
export default Example;
