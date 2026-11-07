// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
import { Ribbon } from "@/components/ui/ribbon";
import { Tape } from "@/components/ui/tape";
import { cn } from "@/lib/utils";
type AnnouncementBarStripProps = Omit<UI.ComponentProps<"section">, "children"> & {
  label?: string;
  message: UI.ReactNode;
  linkLabel?: string;
  href?: string;
  onDismiss?: () => void;
};
const AnnouncementBarStrip = defineUi<AnnouncementBarStripProps>("AnnouncementBarStrip", ["class", "label", "message", "linkLabel", "href", "onDismiss"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const label = computed(() => _props["label"] === undefined ? "New" as const : _props["label"]);
  const message = computed(() => _props["message"]);
  const linkLabel = computed(() => _props["linkLabel"] === undefined ? "Read the notes" as const : _props["linkLabel"]);
  const href = computed(() => _props["href"] === undefined ? "#announcement" as const : _props["href"]);
  const onDismiss = computed(() => _props["onDismiss"]);
  const props = computed(() => omitProps(_props, ["class", "label", "message", "linkLabel", "href", "onDismiss"]));
  return () => {
    return <div class="px-4 pt-6">
      <Paper as="section" stock="kraft" tilt={false} shadow="slip" aria-label="Announcement" data-slot="announcement-bar" class={cn("px-12 py-2.5", className.value)} {...domProps(props.value)}>
        <Tape kind="washi-stripes" color="tangerine" length={52} height={18} angle={-32} class="absolute -top-2.5 -start-3 rtl:rotate-[32deg]!" />
        <Tape kind="washi-stripes" color="tangerine" length={52} height={18} angle={32} class="absolute -top-2.5 -end-3 rtl:rotate-[-32deg]!" />
        <div class="relative z-(--ll-z-raised) flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[15px] leading-6 text-ink">
          <Ribbon variant="flag" tone="hi" size="sm">
            {label.value}
          </Ribbon>
          <p class="text-balance">{message.value}</p>
          <Button asChild variant="link" size="sm" class="text-link-hover hover:text-ink">
            <a href={href.value}>
              {linkLabel.value}
              <Icon name="arrow-right" class="rtl:-scale-x-100" />
            </a>
          </Button>
        </div>
        {onDismiss.value ? <Button type="button" variant="ghost" size="icon-sm" aria-label="Dismiss announcement" onClick={onDismiss.value} class="absolute inset-y-0 end-2 z-(--ll-z-raised) my-auto">
            <Icon name="x" />
          </Button> : null}
      </Paper>
    </div>;
  };
});
export { AnnouncementBarStrip };
export type { AnnouncementBarStripProps };
