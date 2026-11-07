// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { SignupForm } from "@/blocks/signup-02/components/signup-02-form";
import { SignupTicket } from "@/blocks/signup-02/components/signup-02-ticket";
import { Desk } from "@/components/ui/desk";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
import { cn } from "@/lib/utils";
const Signup02Page = defineUi<UI.ComponentProps<"div"> & {
  as?: "main" | "div";
}>("Signup02Page", ["class", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const Root = computed(() => jsxTag(_props["as"] === undefined ? "main" as const : _props["as"]));
  const props = computed(() => omitProps(_props, ["class", "as"]));
  return () => {
    return <Root.value class={cn("@container/page min-h-svh w-full", className.value)} {...domProps(props.value)}>
      <div class="grid min-h-[inherit] @3xl/page:grid-cols-2">
        <Paper stock="paper" tilt={false} shadow="none" seed="signup-02" class="flex flex-col gap-4 p-6 @xl/page:p-10">
          <div class="flex justify-center gap-2 @3xl/page:justify-start">
            <a href="#home" class="flex items-center gap-2 font-script text-2xl leading-none font-bold">
              <Icon name="book-open" tone="doodle" size={24} />
              Looseleaf
            </a>
          </div>
          <div class="flex flex-1 items-center justify-center">
            <div class="w-full max-w-xs">
              <SignupForm />
            </div>
          </div>
        </Paper>
        <Desk aria-hidden="true" seed="signup-02-desk" class="hidden items-center justify-center overflow-hidden @3xl/page:flex">
          <SignupTicket />
        </Desk>
      </div>
    </Root.value>;
  };
});
export default Signup02Page;
