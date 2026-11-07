// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "Pick several" as const,
  description: "type=multiple: any of the items can be on at once, and each one knows its own state. Icon items need names; hand-lettered items are just text in the script font. The sample line follows the group." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const styles = shallowRef<string[]>(initialState(["bold"]));
  const setStyles = stateSetter(styles);
  const sample = computed(() => `text-xl ${styles.value.includes("bold") ? "font-bold" as const : "font-normal" as const} ${styles.value.includes("italic") ? "italic" as const : "" as const} ${styles.value.includes("underline") ? "underline decoration-wavy underline-offset-4" as const : "" as const}`);
  return () => {
    return <div class="flex flex-col items-start gap-4">
      <div class="flex flex-wrap items-center gap-6">
        <ToggleGroup type="multiple" variant="outline" value={styles.value} onValueChange={setStyles} aria-label="Text style">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Icon name="bold" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Icon name="italic" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Icon name="underline" />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" variant="outline" tone="marker" value={styles.value} onValueChange={setStyles} aria-label="Text style, hand-lettered">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <span class="font-script text-2xl leading-none font-bold">B</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <span class="font-script text-2xl leading-none font-bold italic">I</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <span class="font-script text-2xl leading-none font-bold underline underline-offset-4">U</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <p class={sample.value}>The quick brown fox, written down.</p>
    </div>;
  };
});
export default Example;
