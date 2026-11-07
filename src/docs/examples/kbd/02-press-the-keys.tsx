// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Kbd } from "@/components/ui/kbd";
export const meta = {
  title: "Press the keys" as const,
  description: "data-pressed shows a key as held. Type on your keyboard: the caps you press sink onto their base (or press and hold one with the pointer)." as const,
  layout: "stack" as const
};
const keys = [{
  label: "Esc" as const,
  code: "Escape" as const
}, {
  label: "Tab" as const,
  code: "Tab" as const
}, {
  label: "Space" as const,
  code: "Space" as const
}, {
  label: "Enter" as const,
  code: "Enter" as const
}, {
  label: "←" as const,
  code: "ArrowLeft" as const
}, {
  label: "↑" as const,
  code: "ArrowUp" as const
}, {
  label: "↓" as const,
  code: "ArrowDown" as const
}, {
  label: "→" as const,
  code: "ArrowRight" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const down = shallowRef<string[]>(initialState([]));
  const setDown = stateSetter(down);
  watchDependencies(() => {
    const press = (e: KeyboardEvent) => {
      if (keys.some(k => k.code === e.code)) setDown(d => d.includes(e.code) ? d : [...d, e.code]);
    };
    const release = (e: KeyboardEvent) => setDown(d => d.filter(c => c !== e.code));
    const clear = () => setDown([]);
    window.addEventListener("keydown", press);
    window.addEventListener("keyup", release);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", press);
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", clear);
    };
  }, () => [], false);
  return () => {
    return <div class="flex flex-col items-start gap-3">
      <div class="flex flex-wrap items-center gap-2" aria-label="Keys you are holding" role="group">
        {keys.map(k => <Kbd key={k.code} data-pressed={down.value.includes(k.code) ? "" as const : undefined} class="min-w-9">
            {k.label}
          </Kbd>)}
      </div>
      <p class="text-sm text-muted-foreground">Try Space, Enter, Esc and the arrow keys.</p>
    </div>;
  };
});
export default Example;
