// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Lettering } from "@/components/ui/lettering";
import { Paper } from "@/components/ui/paper";
import { Error500Scene } from "@/blocks/error-500/components/error-500-scene";
import { Error500Slip } from "@/blocks/error-500/components/error-500-slip";
type Error500Props = {
  reference?: string;
  request?: string;
  time?: string;
  onRetry?: () => void;
};
const Error500 = defineUi<Error500Props>("Error500", ["reference", "request", "time", "onRetry"], (_props, {
  slots: _slots
}) => {
  const reference = computed(() => _props["reference"] === undefined ? "7F3A-91C2" as const : _props["reference"]);
  const request = computed(() => _props["request"] === undefined ? "/notebooks/48" as const : _props["request"]);
  const time = computed(() => _props["time"] === undefined ? "09:41 UTC" as const : _props["time"]);
  const onRetry = computed(() => _props["onRetry"] === undefined ? () => window.location.reload() : _props["onRetry"]);
  const titleId = useId();
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-8 py-10 @xl:py-14">
        <Paper stock="paper" tilt={false} tape="both" tapeKind="washi-stripes" seed="error-500" class="mx-auto max-w-3xl px-6 py-12 text-center @xl:px-12">
          <Error500Scene />

          <p class="mt-10 font-type text-sm text-pencil-text">Error 500 &middot; Server error</p>
          <Lettering as="h1" id={titleId} size="md" tone="tomato" wobble={0.4} seed="error-500-title" class="mt-3">
            Something broke on our side
          </Lettering>
          <p class="mx-auto mt-4 max-w-md text-lg/7 text-ink-soft">It is not you, and nothing you wrote is lost. We have been told, and somebody is already sharpening a pencil.</p>

          <div class="mt-8">
            <Error500Slip reference={reference.value} request={request.value} time={time.value} />
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <Button type="button" size="lg" onClick={onRetry.value}>
              <Icon name="rotate-cw" />
              Try again
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#home">Go home</a>
            </Button>
            <Button asChild size="lg" variant="link">
              <a href="#status">
                Check the status page
                <Icon name="arrow-up-right" class="rtl:-scale-x-100" />
              </a>
            </Button>
          </div>
        </Paper>
      </div>
    </section>;
  };
});
export default Error500;
export type { Error500Props };
