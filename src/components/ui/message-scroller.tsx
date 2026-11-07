// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { MessageScroller as MessageScrollerPrimitive, useMessageScroller, useMessageScrollerScrollable, useMessageScrollerVisibility } from "@/lib/message-scroller-primitive";
import { cn } from "@/lib/utils";
const MessageScrollerProvider = defineUi<UI.ComponentProps<typeof MessageScrollerPrimitive.Provider>>("MessageScrollerProvider", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  return () => {
    return <MessageScrollerPrimitive.Provider {...domProps(props)}>{_slots.default?.()}</MessageScrollerPrimitive.Provider>;
  };
});
const MessageScroller = defineUi<UI.ComponentProps<typeof MessageScrollerPrimitive.Root>>("MessageScroller", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <MessageScrollerPrimitive.Root data-slot="message-scroller" class={cn("group/message-scroller relative flex size-full min-h-0 flex-col", className.value)} {...domProps(props.value)}>{_slots.default?.()}</MessageScrollerPrimitive.Root>;
  };
});
const MessageScrollerViewport = defineUi<UI.ComponentProps<typeof MessageScrollerPrimitive.Viewport>>("MessageScrollerViewport", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <MessageScrollerPrimitive.Viewport data-slot="message-scroller-viewport" class={cn("size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain [--fade-b:0px] [--fade-t:0px] [mask-image:linear-gradient(to_bottom,transparent,black_var(--fade-t),black_calc(100%-var(--fade-b)),transparent)] [scrollbar-gutter:stable] [scrollbar-width:thin] group-data-[scrollable~=end]/message-scroller:[--fade-b:28px] group-data-[scrollable~=start]/message-scroller:[--fade-t:20px] data-autoscrolling:[scrollbar-width:none] focus-visible:-outline-offset-3", className.value)} {...domProps(props.value)}>{_slots.default?.()}</MessageScrollerPrimitive.Viewport>;
  };
});
const MessageScrollerContent = defineUi<UI.ComponentProps<typeof MessageScrollerPrimitive.Content>>("MessageScrollerContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <MessageScrollerPrimitive.Content data-slot="message-scroller-content" class={cn("flex h-max min-h-full flex-col gap-5 px-4 py-4", className.value)} {...domProps(props.value)}>{_slots.default?.()}</MessageScrollerPrimitive.Content>;
  };
});
const MessageScrollerItem = defineUi<UI.ComponentProps<typeof MessageScrollerPrimitive.Item>>("MessageScrollerItem", ["class", "scrollAnchor"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const scrollAnchor = computed(() => _props["scrollAnchor"] === undefined ? false : _props["scrollAnchor"]);
  const props = computed(() => omitProps(_props, ["class", "scrollAnchor"]));
  return () => {
    return <MessageScrollerPrimitive.Item data-slot="message-scroller-item" scrollAnchor={scrollAnchor.value} class={cn("min-w-0 shrink-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</MessageScrollerPrimitive.Item>;
  };
});
const MessageScrollerButton = defineUi<UI.ComponentProps<typeof MessageScrollerPrimitive.Button> & Pick<UI.ComponentProps<typeof Button>, "variant" | "size">>("MessageScrollerButton", ["direction", "class", "render", "variant", "size"], (_props, {
  slots: _slots
}) => {
  const direction = computed(() => _props["direction"] === undefined ? "end" as const : _props["direction"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const render = computed(() => _props["render"]);
  const variant = computed(() => _props["variant"] === undefined ? "secondary" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "icon-sm" as const : _props["size"]);
  const props = computed(() => omitProps(_props, ["direction", "class", "children", "render", "variant", "size"]));
  return () => {
    return <MessageScrollerPrimitive.Button data-slot="message-scroller-button" data-direction={direction.value} data-variant={variant.value} data-size={size.value} direction={direction.value} class={cn("absolute inset-s-1/2 z-(--ll-z-raised) -translate-x-1/2 transition-[translate,scale,opacity] duration-(--ll-dur-sheet) ease-settle data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180", className.value)} render={render.value ?? <Button variant={variant.value} size={size.value} />} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? <>
          <Icon name="arrow-down" />
          <span class="sr-only">{direction.value === "end" ? "Scroll to end" as const : "Scroll to start" as const}</span>
        </>}
    </MessageScrollerPrimitive.Button>;
  };
});
export { MessageScrollerProvider, MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, MessageScrollerButton, useMessageScroller, useMessageScrollerScrollable, useMessageScrollerVisibility };
