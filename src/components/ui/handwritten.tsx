// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import { makeRng } from "@/lib/ink/rng";
import { useDensity, useInkSeed } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
const SKIP = new Set(["code", "pre", "kbd", "samp", "var", "a", "svg", "math", "textarea", "input", "select", "button", "script", "style", "img", "video", "audio", "canvas", "iframe"]);
const CSS = `[data-written] .ll-w{display:inline;position:relative;translate:none;rotate:none;opacity:1;padding-inline-end:0;margin-inline-end:0;top:calc(var(--jy,0px)*var(--ll-jitter-k,1));color:color-mix(in srgb,currentColor calc((1 - (1 - var(--jo,1))*var(--ll-jitter-k,1))*100%),transparent)}`;
interface Walk {
  n: number;
  seed: string;
  k: number;
}
function word(text: string, w: Walk): UI.ReactNode {
  const r = makeRng(w.seed).fork(w.n);
  const i = w.n++;
  const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const style = {
    "--jy": `${clamp(r.gauss(0, 0.55) * 1.5 * w.k, 1.6).toFixed(2)}px`,
    "--jr": `${clamp(r.gauss(0, 0.6) * 1.4 * w.k, 1.7).toFixed(2)}deg`,
    "--jo": (1 - r.range(0, 0.12) * w.k).toFixed(2)
  } as UI.CSSProperties;
  return <span key={i} class="ll-w [text-decoration:inherit]" style={cssStyle(style)}>
      {text}
    </span>;
}
function walk(children: UI.ReactNode, w: Walk): UI.ReactNode[] {
  return Children.toArray(children).map((node, at) => {
    if (typeof node === "string" || typeof node === "number") {
      const words = String(node).split(/(\s+)/).map(part => part === "" ? null : /^\s+$/.test(part) ? part : word(part, w));
      return <Fragment key={`t${at}`}>{words}</Fragment>;
    }
    if (!isValidElement<{
      children?: UI.ReactNode;
      "data-handwritten"?: string;
    }>(node) || node.props["data-handwritten"] === "off") return node;
    const walked = node.type === Fragment || typeof node.type === "string" && !SKIP.has(node.type);
    if (!walked || node.props.children == null) return node;
    return cloneElement(node, undefined, ...walk(node.props.children, w));
  });
}
const Handwritten = defineUi<Omit<UI.ComponentProps<"span">, "ref"> & {
  as?: UI.ElementType;
  strength?: number;
  seed?: string | number;
  ref?: UI.Ref<HTMLElement>;
}>("Handwritten", ["as", "strength", "seed", "class"], (_props, {
  slots: _slots
}) => {
  const Comp = computed(() => jsxTag(_props["as"] === undefined ? "span" as const : _props["as"]));
  const strength = computed(() => _props["strength"] === undefined ? 1 : _props["strength"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["as", "strength", "seed", "class", "children"]));
  const id = useInkSeed(() => seed.value);
  const density = useDensity();
  const k = computed(() => Math.max(0, strength.value) * (density.value === "compact" ? 0.7 : 1));
  return () => {
    return <Comp.value data-slot="handwritten" data-written={k.value > 0 ? "" as const : undefined} class={cn(k.value > 0 && "ll-hand-jitter", className.value)} {...domProps(props.value)}>
      {k.value > 0 ? <style>
          {CSS}
        </style> : null}
      {k.value > 0 ? walk(readSlot(_slots.default), {
        n: 0,
        seed: `hw|${id.value}`,
        k: k.value
      }) : readSlot(_slots.default)}
    </Comp.value>;
  };
});
export { Handwritten };
