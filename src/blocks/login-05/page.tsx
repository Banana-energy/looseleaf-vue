// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { LoginForm } from "@/blocks/login-05/components/login-05-form";
import { Paper } from "@/components/ui/paper";
import { cn } from "@/lib/utils";
const Login05Page = defineUi<Omit<UI.ComponentProps<typeof Paper>, "as"> & {
  as?: "main" | "div";
}>("Login05Page", ["class", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const as = computed(() => _props["as"] === undefined ? "main" as const : _props["as"]);
  const props = computed(() => omitProps(_props, ["class", "as"]));
  return () => {
    return <Paper as={as.value} stock="paper" tilt={false} shadow="none" seed="login-05" class={cn("@container/page min-h-svh w-full", className.value)} {...domProps(props.value)}>
      <div class="flex min-h-[inherit] flex-col items-center justify-center gap-6 p-6 @xl/page:p-10">
        <div class="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </Paper>;
  };
});
export default Login05Page;
