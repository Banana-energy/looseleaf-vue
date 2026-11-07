// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { LoginForm } from "@/blocks/login-01/components/login-01-form";
import { Desk } from "@/components/ui/desk";
import { cn } from "@/lib/utils";
const Login01Page = defineUi<Omit<UI.ComponentProps<typeof Desk>, "as"> & {
  as?: "main" | "div";
}>("Login01Page", ["class", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const as = computed(() => _props["as"] === undefined ? "main" as const : _props["as"]);
  const props = computed(() => omitProps(_props, ["class", "as"]));
  return () => {
    return <Desk as={as.value} seed="login-01" class={cn("@container/page min-h-svh w-full overflow-x-clip", className.value)} {...domProps(props.value)}>
      <div class="flex min-h-[inherit] items-center justify-center p-6 pt-24 @xl/page:p-10 @xl/page:pt-24">
        <div class="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </Desk>;
  };
});
export default Login01Page;
