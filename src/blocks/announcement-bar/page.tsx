// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { AnnouncementBarHeader } from "@/blocks/announcement-bar/components/announcement-bar-header";
import { AnnouncementBarStrip } from "@/blocks/announcement-bar/components/announcement-bar-strip";
const AnnouncementBarBlock = defineUi<{}>("AnnouncementBarBlock", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(true));
  const setOpen = stateSetter(open);
  const strip = shallowRef<HTMLElement | null>(null);
  const bringBack = shallowRef<HTMLButtonElement | null>(null);
  const handOver = shallowRef(false);
  watchDependencies(() => {
    if (!handOver.value) return;
    handOver.value = false;
    if (open.value) strip.value?.focus();else bringBack.value?.focus();
  }, () => [open.value], false);
  const toggle = computed(() => (next: boolean) => {
    handOver.value = true;
    setOpen(next);
  });
  return () => {
    return <div class="@container w-full">
      {open.value ? <AnnouncementBarStrip ref={strip} tabindex={-1} message="Penmark 2.0 is here: tape you can peel, and pages that turn." linkLabel="Read the notes" href="#notes" onDismiss={() => toggle.value(false)} class="outline-none" /> : <div class="flex justify-center px-3 pt-3">
          <Button ref={bringBack} type="button" variant="link" size="sm" onClick={() => toggle.value(true)}>
            Bring the announcement back
          </Button>
        </div>}
      <AnnouncementBarHeader />
    </div>;
  };
});
export default AnnouncementBarBlock;
