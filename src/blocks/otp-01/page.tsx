// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { DEMO_CODE, OtpForm } from "@/blocks/otp-01/components/otp-01-form";
import { Desk } from "@/components/ui/desk";
import { StickyNote } from "@/components/ui/sticky-note";
import { cn } from "@/lib/utils";
const Otp01Page = defineUi<Omit<UI.ComponentProps<typeof Desk>, "as"> & {
  as?: "main" | "div";
}>("Otp01Page", ["class", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const as = computed(() => _props["as"] === undefined ? "main" as const : _props["as"]);
  const props = computed(() => omitProps(_props, ["class", "as"]));
  return () => {
    return <Desk as={as.value} seed="otp-01" class={cn("@container/page min-h-svh w-full overflow-x-clip", className.value)} {...domProps(props.value)}>
      <div class="flex min-h-[inherit] flex-col items-center justify-center gap-8 p-6 @xl/page:p-10">
        <div class="w-full max-w-sm">
          <OtpForm />
        </div>
        <StickyNote color="yellow" fastener="pin" tilt={2} seed="otp-01-note" class="min-h-0 w-52 px-4 pt-6 pb-4 text-xl">
          psst: the demo code is <span class="ll-num">{DEMO_CODE}</span>
        </StickyNote>
      </div>
    </Desk>;
  };
});
export default Otp01Page;
