// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Direction, Slot } from "@/lib/primitives";
import { InkContext, useInkContext, useMergedRef, type InkContextValue, type InkScopeProps } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
type Dir = "ltr" | "rtl";
type DirectionScope = InkScopeProps & {
  dir: Dir;
};
function readDirection(from: Element | null): Dir | undefined {
  for (let el = from; el; el = el.parentElement) {
    const d = el.getAttribute("dir");
    if (d === "rtl" || d === "ltr") return d;
  }
  return undefined;
}
const DirectionProvider = defineUi<Omit<UI.ComponentProps<"div">, "dir"> & {
  dir?: Dir;
  direction?: Dir;
  asChild?: boolean;
}>("DirectionProvider", ["dir", "direction", "asChild", "class"], (_props, {
  slots: _slots
}) => {
  const dir = computed(() => _props["dir"]);
  const direction = computed(() => _props["direction"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["dir", "direction", "asChild", "class", "children", "ref"]));
  const explicit = computed(() => direction.value ?? dir.value);
  const hostRef = shallowRef<HTMLElement | null | null>(null);
  const inherited = shallowRef<Dir>(initialState("ltr"));
  const setInherited = stateSetter(inherited);
  watchDependencies(() => {
    const host = hostRef.value;
    if (explicit.value || !host) return;
    const read = () => setInherited(readDirection(host.parentElement) ?? "ltr");
    read();
    if (typeof MutationObserver === "undefined") return;
    const mo = new MutationObserver(read);
    mo.observe(host.ownerDocument.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
      subtree: true
    });
    return () => mo.disconnect();
  }, () => [explicit.value], true);
  const value = computed<Dir>(() => explicit.value ?? inherited.value);
  const ink = useInkContext();
  const inkValue = computed<InkContextValue>(() => {
    const scope: DirectionScope = {
      ...ink.value.scope,
      dir: value.value
    };
    return {
      ...ink.value,
      dir: value.value,
      scope
    };
  });
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "div" as const));
  return () => {
    return <Direction.DirectionProvider dir={value.value}>
      <InkContext.Provider value={inkValue.value}>
        <Comp.value data-slot="direction" ref={useMergedRef(hostRef, ref.value)} dir={explicit.value} class={asChild.value ? className.value : cn("contents", className.value)} {...domProps(props.value)}>
          {readSlot(_slots.default)}
        </Comp.value>
      </InkContext.Provider>
    </Direction.DirectionProvider>;
  };
});
const useDirection = useLooseleafDirection;
export { DirectionProvider, useDirection };
