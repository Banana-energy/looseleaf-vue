// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { motionIsOff } from "@/hooks/use-live-motion";
import { useInk, useInkContext, useInkSeed, useMergedRef } from "@/lib/ink/vue";
import { typewriterCaretRecipe, typingPlan, type CaretShape } from "@/lib/ink/recipes/typewriter-ink";
import { makeRng } from "@/lib/ink/rng";
import { cn } from "@/lib/utils";
const CSS = `@keyframes ll-caret{0%,49%{opacity:1}50%,100%{opacity:0}}
[data-slot=typewriter][data-state=idle] [data-slot=typewriter-caret]{animation:ll-caret 1.1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){[data-slot=typewriter-caret]{animation:none!important}}
[data-motion=reduced] [data-slot=typewriter-caret]{animation:none!important}
[data-slot=typewriter] .ll-w{position:relative;top:calc(var(--jy,0px)*var(--ll-jitter-k,1));color:color-mix(in srgb,currentColor calc((1 - (1 - var(--jo,1))*var(--ll-jitter-k,1))*100%),transparent)}`;
const STEPS = Array.from({
  length: 21
}, (_, i) => i / 20);
type TypewriterProps = Omit<UI.ComponentProps<"span">, "children"> & {
  text: string | readonly string[];
  mode?: "lines" | "cycle";
  speed?: number;
  delay?: number;
  pause?: number;
  loop?: boolean;
  cursor?: CaretShape | false;
  startOnView?: boolean;
  onDone?: () => void;
  reserve?: boolean;
  seed?: string | number;
};
const Typewriter = defineUi<TypewriterProps>("Typewriter", ["class", "text", "mode", "speed", "delay", "pause", "loop", "cursor", "startOnView", "reserve", "onDone", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const text = computed(() => _props["text"]);
  const mode = computed(() => _props["mode"] === undefined ? "lines" as const : _props["mode"]);
  const speed = computed(() => _props["speed"] === undefined ? 22 : _props["speed"]);
  const delay = computed(() => _props["delay"] === undefined ? 300 : _props["delay"]);
  const pause = computed(() => _props["pause"] === undefined ? 1400 : _props["pause"]);
  const loop = computed(() => _props["loop"] === undefined ? false : _props["loop"]);
  const cursor = computed(() => _props["cursor"] === undefined ? "bar" as const : _props["cursor"]);
  const startOnView = computed(() => _props["startOnView"] === undefined ? true : _props["startOnView"]);
  const reserve = computed(() => _props["reserve"] === undefined ? false : _props["reserve"]);
  const onDone = computed(() => _props["onDone"]);
  const seedProp = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "text", "mode", "speed", "delay", "pause", "loop", "cursor", "startOnView", "reserve", "onDone", "seed", "ref"]));
  const phrases = computed(() => typeof text.value === "string" ? [text.value] : [...text.value]);
  const key = computed(() => phrases.value.join("\u0000"));
  const seed = useInkSeed(() => seedProp.value);
  const _nestedHook0 = useInkContext();
  const providerReduced = computed(() => _nestedHook0.value.motion === "reduced");
  const root = shallowRef<HTMLSpanElement | null | null>(null);
  const final = computed(() => mode.value === "cycle" ? phrases.value[phrases.value.length - 1] ?? "" : phrases.value.join("\n"));
  const shown = shallowRef(initialState(final.value));
  const setShown = stateSetter(shown);
  const typing = shallowRef(initialState(false));
  const setTyping = stateSetter(typing);
  const visible = shallowRef(initialState(!startOnView.value));
  const setVisible = stateSetter(visible);
  const done = shallowRef(onDone.value);
  watchDependencies(() => {
    if (!startOnView.value || visible.value) return;
    const el = root.value;
    if (!el || typeof IntersectionObserver === "undefined") return setVisible(true);
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting && ((e.intersectionRatio ?? 1) >= 0.4 || (e.intersectionRect?.height ?? 0) >= window.innerHeight * 0.4))) {
        setVisible(true);
        io.disconnect();
      }
    }, {
      threshold: STEPS
    });
    io.observe(el);
    return () => io.disconnect();
  }, () => [startOnView.value, visible.value], false);
  watchDependencies(() => {
    if (motionIsOff(root.value, providerReduced.value)) {
      setShown(final.value);
      setTyping(false);
      return;
    }
    setShown("");
    if (!visible.value) return;
    const {
      steps
    } = typingPlan(phrases.value, {
      speed: speed.value,
      pause: pause.value,
      mode: mode.value,
      loop: loop.value,
      seed: seed.value
    });
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let rest: ReturnType<typeof setTimeout> | undefined;
    const at = (i: number) => {
      if (stopped) return;
      setShown(steps[i].text);
      setTyping(true);
      clearTimeout(rest);
      rest = setTimeout(() => setTyping(false), 260);
      if (i + 1 < steps.length) timer = setTimeout(() => at(i + 1), steps[i + 1].at - steps[i].at);else if (loop.value) timer = setTimeout(() => at(0), 120);else done.value?.();
    };
    timer = setTimeout(() => at(0), delay.value);
    return () => {
      stopped = true;
      clearTimeout(timer);
      clearTimeout(rest);
    };
  }, () => [providerReduced.value, visible.value, key.value, mode.value, speed.value, pause.value, delay.value, loop.value, seed.value, final.value], true);
  const room = computed(() => mode.value === "cycle" ? phrases.value.reduce((a, b) => b.length > a.length ? b : a, "") : final.value);
  const words = computed(() => shown.value.split(/(\s+)/));
  const jitter = computed(() => makeRng(`type-words|${seed.value}`));
  return () => {
    done.value = onDone.value;
    return <span data-slot="typewriter" data-state={typing.value ? "typing" as const : "idle" as const} ref={useMergedRef<HTMLSpanElement>(root, ref.value)} data-reserve={reserve.value ? "" as const : undefined} class={cn("relative font-type whitespace-pre-wrap", reserve.value ? "inline-block" as const : "inline" as const, className.value)} {...domProps(props.value)}>
      <style>
        {CSS}
      </style>
      <span class="sr-only" aria-live={loop.value || mode.value === "cycle" ? "off" as const : "polite" as const} aria-atomic="true">
        {mode.value === "cycle" ? phrases.value.join(". ") : final.value}
      </span>
      {reserve.value ? <span data-slot="typewriter-reserve" aria-hidden="true" class="invisible">
          {room.value}
          {cursor.value ? <span class={cn("inline-block", RESERVE_CARET[cursor.value])} /> : null}
        </span> : null}
      <span aria-hidden="true" class={reserve.value ? "absolute inset-0" as const : undefined}>
        {words.value.map((w, i) => {
          if (!w) return null;
          if (/^\s+$/.test(w)) return w;
          const r = jitter.value.fork(i);
          return <span key={i} class="ll-w" style={cssStyle({
            "--jy": `${(r() * 1.6 - 0.8).toFixed(2)}px`,
            "--jo": (0.9 + r() * 0.1).toFixed(2)
          } as UI.CSSProperties)}>
              {w}
            </span>;
        })}
        {cursor.value ? <Caret shape={cursor.value} seed={seed.value} /> : null}
      </span>
    </span>;
  };
});
const CARET_CLASS: Record<CaretShape, string> = {
  block: "h-[1.1em] w-[0.6em] forced-colors:bg-[CanvasText]" as const,
  bar: "h-[1.15em] w-[0.16em] ms-[0.06em] forced-colors:bg-[CanvasText]" as const,
  underscore: "h-[1.15em] w-[0.6em] forced-colors:[background:linear-gradient(CanvasText,CanvasText)_bottom/100%_2px_no-repeat]" as const
};
const RESERVE_CARET: Record<CaretShape, string> = {
  block: "w-[0.6em]" as const,
  bar: "w-[0.22em]" as const,
  underscore: "w-[0.6em]" as const
};
const Caret = defineUi<{
  shape: CaretShape;
  seed: string;
}>("Caret", ["shape", "seed"], (_props, {
  slots: _slots
}) => {
  const shape = computed(() => _props["shape"]);
  const seed = computed(() => _props["seed"]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: typewriterCaretRecipe,
    params: {
      shape: shape.value
    },
    kind: "typewriter-caret" as const,
    seed: `${seed.value}|caret`
  }));
  return () => {
    return <span data-slot="typewriter-caret" ref={hostRef} {...domProps(hostProps.value)} style={cssStyle({
      outline: "none" as const
    })} class={cn("relative isolate inline-block align-text-bottom", CARET_CLASS[shape.value])}>
      {node.value}
    </span>;
  };
});
export { Typewriter };
export type { TypewriterProps };
