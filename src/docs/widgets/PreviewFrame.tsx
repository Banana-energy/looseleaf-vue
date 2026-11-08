// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cx } from "../kit";
import { useLocaleText } from "../core/settings";
export const MIN_WIDTH = 240;
const PRESETS = [{
  label: "Phone" as const,
  width: 375
}, {
  label: "Tablet" as const,
  width: 768
}, {
  label: "Full" as const,
  width: null
}] as const;
export const PreviewFrame = defineUi<{
  children: UI.VueNode;
  className?: string;
}>("PreviewFrame", ["class"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  const locale = useLocaleText();
  const presets = computed(() => locale.value.locale === "zh-CN" ? [{ label: "手机", width: 375 }, { label: "平板", width: 768 }, { label: "全宽", width: null }] as const : PRESETS);
  const width = shallowRef<number | null>(initialState(null));
  const setWidth = stateSetter(width);
  const room = shallowRef(initialState(1200));
  const setRoom = stateSetter(room);
  const track = shallowRef<HTMLDivElement | null>(null);
  const frame = shallowRef<HTMLDivElement | null>(null);
  const drag = shallowRef<{
    x: number;
    start: number;
    dir: 1 | -1;
  } | null | null>(null);
  watchDependencies(() => {
    const el = track.value;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry?.contentRect.width ?? 0);
      if (w > 0) setRoom(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, () => [], false);
  const set = computed(() => (next: number | null) => setWidth(next === null || next >= room.value - 2 ? null : Math.max(MIN_WIDTH, Math.round(next))));
  const current = computed(() => () => width.value ?? Math.round(frame.value?.getBoundingClientRect().width || room.value));
  const onKeydown = computed(() => (event: KeyboardEvent) => {
    const step = event.shiftKey ? 64 : 16;
    const rtl = getComputedStyle(event.currentTarget as HTMLDivElement).direction === "rtl";
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      set.value(current.value() + (event.key === "ArrowRight" !== rtl ? step : -step));
    } else if (event.key === "Home") {
      event.preventDefault();
      set.value(MIN_WIDTH);
    } else if (event.key === "End") {
      event.preventDefault();
      set.value(null);
    }
  });
  const onPointerdown = computed(() => (event: PointerEvent) => {
    event.preventDefault();
    (event.currentTarget as HTMLDivElement).focus();
    (event.currentTarget as HTMLDivElement).setPointerCapture?.(event.pointerId);
    drag.value = {
      x: event.clientX,
      start: current.value(),
      dir: getComputedStyle(event.currentTarget as HTMLDivElement).direction === "rtl" ? -1 : 1
    };
  });
  const onPointermove = computed(() => (event: PointerEvent) => {
    const d = drag.value;
    if (d) set.value(d.start + d.dir * (event.clientX - d.x));
  });
  const onPointerup = computed(() => (event: PointerEvent) => {
    drag.value = null;
    (event.currentTarget as HTMLDivElement).releasePointerCapture?.(event.pointerId);
  });
  return () => {
    return <div class={cx("flex flex-col gap-2", className.value)}>
      <div role="group" aria-label={locale.value.locale === "zh-CN" ? "预览宽度" : "Preview width"} class="hidden items-center gap-1 sm:flex print:hidden">
        {presets.value.map(p => <Button key={p.label} type="button" variant="ghost" size="xs" aria-pressed={p.width === width.value} onClick={() => set.value(p.width)} class="aria-pressed:font-bold">
            {p.label}
            {p.width ? <span class="font-normal text-ink-muted"> {p.width}</span> : null}
          </Button>)}
        <span class="ms-auto ll-num font-type text-xs tracking-wide text-ink-muted">
          {width.value ? locale.value.locale === "zh-CN" ? `${width.value} 像素宽` : `${width.value} px wide` : locale.value.locale === "zh-CN" ? "全宽" : "full width" as const}
        </span>
      </div>
      <div ref={track} class="relative min-w-0">
        <div ref={frame} data-slot="preview-frame" style={cssStyle(width.value ? {
          width: width.value
        } : undefined)} class="relative max-w-full min-w-0">
          {readSlot(_slots.default)}
          <div role="separator" aria-orientation="vertical" aria-label="Resize preview" aria-valuemin={MIN_WIDTH} aria-valuemax={room.value} aria-valuenow={width.value ?? room.value} aria-valuetext={width.value ? `${width.value} pixels wide` : "Full width" as const} tabindex={0} onKeydown={onKeydown.value} onPointerdown={onPointerdown.value} onPointermove={onPointermove.value} onPointerup={onPointerup.value} onPointercancel={onPointerup.value} class="absolute inset-y-0 -end-6 z-(--ll-z-raised) hidden w-6 cursor-ew-resize touch-none items-center justify-center text-ink-muted outline-offset-[-2px] hover:ll-swipe hover:text-ink sm:flex">
            <Icon name="grip-vertical" size={14} />
          </div>
        </div>
      </div>
    </div>;
  };
});
