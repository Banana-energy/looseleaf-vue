// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { SignupForm } from "@/blocks/signup-03/components/signup-03-form";
import { Desk } from "@/components/ui/desk";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
const Signup03Page = defineUi<Omit<UI.ComponentProps<typeof Desk>, "as"> & {
  as?: "main" | "div";
}>("Signup03Page", ["class", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const as = computed(() => _props["as"] === undefined ? "main" as const : _props["as"]);
  const props = computed(() => omitProps(_props, ["class", "as"]));
  return () => {
    return <Desk as={as.value} objects={["clips", "pins"]} seed="signup-03" class={cn("@container/page min-h-svh w-full overflow-x-clip", className.value)} {...domProps(props.value)}>
      <div class="flex min-h-[inherit] flex-col items-center justify-center gap-6 p-6 @xl/page:p-10">
        <div class="flex w-full max-w-sm flex-col gap-6">
          <a href="#home" class="flex items-center gap-2 self-center font-script text-2xl leading-none font-bold">
            <Icon name="book-open" tone="doodle" size={24} />
            Looseleaf
          </a>
          <SignupForm />
        </div>
      </div>
    </Desk>;
  };
});
export default Signup03Page;
