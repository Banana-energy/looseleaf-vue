// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { createPortal } from "@/lib/vnode";
import { Toaster as Sonner, toast, useSonner, type ToasterProps } from "@/lib/sonner-primitive";
import { Icon } from "@/components/ui/icon";
import { useInkScope } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
type ToastClassNames = NonNullable<NonNullable<ToasterProps["toastOptions"]>["classNames"]>;
type LooseleafToasterProps = ToasterProps & {
  decoration?: "none" | "tape" | "pin";
  portal?: boolean;
};
const SLIP = cn("ll-paper ll-tooth-fine ll-stock-slip ll-sheet-slip pointer-events-auto flex w-(--width) items-center gap-3 p-4 font-hand text-[15px] text-foreground compact:p-3.5 calm:p-3", "data-[type=success]:ll-stock-check data-[type=success]:ll-sheet-check data-[type=success]:[--ll-tilt:-0.5deg]", "data-[type=error]:ll-stock-sticky-pink data-[type=error]:ll-sheet-sticky data-[type=error]:[--ll-tilt:0.9deg]", "data-[type=warning]:ll-stock-sticky-yellow data-[type=warning]:ll-sheet-sticky data-[type=warning]:[--ll-tilt:-0.8deg]", "data-[type=info]:ll-stock-sticky-blue data-[type=info]:ll-sheet-sticky data-[type=info]:[--ll-tilt:0.6deg]", "data-[type=loading]:[--ll-tilt:0.35deg] data-[type=default]:[--ll-tilt:-0.3deg]", "[&[data-expanded=false][data-front=false]>*]:opacity-0", "data-[x-position=right]:animate-[ll-toss_var(--ll-dur-toss)_var(--ll-ease-settle)_backwards] data-[x-position=left]:animate-[ll-drop_var(--ll-dur-drop)_var(--ll-ease-settle)_backwards] data-[x-position=center]:animate-[ll-drop_var(--ll-dur-drop)_var(--ll-ease-settle)_backwards]");
const TAPE = "after:pointer-events-none after:absolute after:-top-3 after:left-1/2 after:h-4.5 after:w-14 after:-translate-x-1/2 after:-rotate-3 after:border-y after:border-tape-edge after:bg-[color-mix(in_srgb,var(--ll-kraft)_70%,transparent)] after:[background-image:linear-gradient(90deg,transparent_29%,var(--ll-tape-edge)_29%_30%,transparent_30%_69%,var(--ll-tape-edge)_69%_70%,transparent_70%)] after:content-[''] after:[clip-path:polygon(0_0,100%_0,96%_20%,100%_40%,96%_60%,100%_80%,96%_100%,0_100%,4%_80%,0_60%,4%_40%,0_20%)] calm:after:hidden";
const PIN = "after:pointer-events-none after:absolute after:-top-2 after:left-1/2 after:size-3.5 after:-translate-x-1/2 after:rounded-full after:bg-tomato after:content-[''] after:[background-image:radial-gradient(circle_at_34%_30%,var(--ll-photo)_0_13%,transparent_15%),radial-gradient(circle_at_66%_70%,rgb(var(--ll-shade)/0.32),transparent_60%)] after:shadow-[0_2px_2px_rgb(var(--ll-shade)/0.35)] calm:after:hidden";
const BASE: ToastClassNames = {
  toast: SLIP,
  content: "flex min-w-0 flex-1 flex-col gap-0.5" as const,
  title: "text-[15px] leading-snug font-bold" as const,
  description: "text-sm leading-snug text-muted-foreground" as const,
  icon: "relative flex size-5 shrink-0 items-center justify-center text-ink" as const,
  loader: "text-ink" as const,
  actionButton: "ll-swipe ms-auto min-h-6 shrink-0 cursor-pointer px-2.5 py-0.5 text-sm font-bold whitespace-nowrap transition-[translate] duration-(--ll-dur-press) active:translate-y-(--ll-press-sink)" as const,
  cancelButton: "ms-auto min-h-6 shrink-0 cursor-pointer px-2 py-0.5 text-sm whitespace-nowrap text-ink-muted underline decoration-wavy underline-offset-4 hover:text-foreground" as const,
  closeButton: "absolute end-1.5 top-1.5 z-(--ll-z-raised) grid size-6 cursor-pointer place-items-center text-ink hover:ll-swipe" as const
};
const Toaster = defineUi<LooseleafToasterProps>("Toaster", ["class", "toastOptions", "decoration", "theme", "icons", "style", "portal"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const toastOptions = computed(() => _props["toastOptions"]);
  const decoration = computed(() => _props["decoration"] === undefined ? "none" as const : _props["decoration"]);
  const theme = computed(() => _props["theme"] === undefined ? "light" as const : _props["theme"]);
  const icons = computed(() => _props["icons"]);
  const style = computed(() => _props["style"]);
  const portal = computed(() => _props["portal"] === undefined ? false : _props["portal"]);
  const props = computed(() => omitProps(_props, ["class", "toastOptions", "decoration", "theme", "icons", "style", "portal"]));
  const scope = useInkScope();
  const mounted = shallowRef(initialState(false));
  const setMounted = stateSetter(mounted);
  watchDependencies(() => {
    if (portal.value) setMounted(true);
  }, () => [portal.value], false);
  const user = computed(() => toastOptions.value?.classNames ?? {});
  const merged = computed(() => Object.fromEntries((Object.keys({
    ...BASE,
    ...user.value
  }) as Array<keyof ToastClassNames>).map(k => [k, cn(BASE[k], k === "content" && decoration.value !== "none" && (decoration.value === "tape" ? TAPE : PIN), user.value[k])])) as ToastClassNames);
  const stack = renderValue(() =>
  // lint-house-disable-next-line data-slot
  <Sonner theme={theme.value} class={cn("toaster group pointer-events-auto", className.value)} icons={{
    success: <Icon name="circle-check" size={20} />,
    info: <Icon name="info" size={20} />,
    warning: <Icon name="triangle-alert" size={20} />,
    error: <Icon name="octagon-x" size={20} />,
    loading: <Icon name="loader-circle" size={20} class="animate-spin" />,
    close: <Icon name="x" size={14} />,
    ...icons.value
  }} style={cssStyle({
    zIndex: "var(--ll-z-toast)" as const,
    "--width": "min(360px, calc(100vw - 32px))" as const,
    ...style.value
  } as UI.CSSProperties)} toastOptions={{
    unstyled: true,
    ...toastOptions.value,
    classNames: merged.value
  }} {...domProps(props.value)} />);
  return () => {
    if (!portal.value) return stack.value;
    return mounted.value ? createPortal(<div data-slot="toaster-portal" {...domProps(scope.value)} class="contents">{stack.value}</div>, document.body) : null;
  };
});
export { Toaster, toast, useSonner };
export type { LooseleafToasterProps as ToasterProps };
