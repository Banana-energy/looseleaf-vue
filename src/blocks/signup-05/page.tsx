// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { SignupForm } from "@/blocks/signup-05/components/signup-05-form";
import { Desk } from "@/components/ui/desk";
import { Paper } from "@/components/ui/paper";
import { cn } from "@/lib/utils";
const Signup05Page = defineUi<Omit<UI.ComponentProps<typeof Desk>, "as"> & {
  as?: "main" | "div";
}>("Signup05Page", ["class", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const as = computed(() => _props["as"] === undefined ? "main" as const : _props["as"]);
  const props = computed(() => omitProps(_props, ["class", "as"]));
  return () => {
    return <Desk as={as.value} seed="signup-05" class={cn("@container/page min-h-svh w-full overflow-clip", className.value)} {...domProps(props.value)}>
      <div class="flex min-h-[inherit] justify-center px-4 pt-10 @xl/page:px-10">
        <Paper stock="pad" rules="none" edge={{
          top: "torn" as const
        }} tilt={false} seed="signup-05-sheet" class="mx-auto -mb-4 flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-12 @xl/page:px-12">
          <div class="w-full max-w-sm">
            <SignupForm />
          </div>
        </Paper>
      </div>
    </Desk>;
  };
});
export default Signup05Page;
