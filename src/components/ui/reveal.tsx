// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, proxyRefs, shallowRef } from "vue";
import { motionIsOff } from "@/hooks/use-live-motion";
import { useInk, useInkContext, useMergedRef } from "@/lib/ink/vue";
import { revealNibRecipe } from "@/lib/ink/recipes/reveal-nib-ink";
import type { PaintKey } from "@/lib/ink/paint";
import { cn } from "@/lib/utils";
const CSS = `[data-slot=reveal][data-armed][data-state=hidden]:not([data-stagger],[data-nib]){opacity:0}
[data-slot=reveal][data-armed][data-state=visible]:not([data-stagger],[data-nib]){animation:var(--ll-reveal-anim) var(--ll-reveal-dur) var(--ll-ease-out) var(--ll-reveal-delay,0s) both}
[data-slot=reveal][data-nib][data-armed][data-state=hidden]>[data-slot=reveal-content]{opacity:0}
[data-slot=reveal][data-nib][data-armed][data-state=visible]>[data-slot=reveal-content]{animation:ll-wipe var(--ll-reveal-dur) var(--ll-ease-out) var(--ll-reveal-delay,0s) both}
[data-slot=reveal]{--ll-nib-a:-2%;--ll-nib-b:102%}
[data-slot=reveal][data-from=end],[dir=rtl] [data-slot=reveal]{--ll-nib-a:102%;--ll-nib-b:-2%}
[dir=rtl] [data-slot=reveal][data-from=end]{--ll-nib-a:-2%;--ll-nib-b:102%}
@keyframes ll-reveal-nib{0%{left:var(--ll-nib-a);opacity:1}90%{opacity:1}100%{left:var(--ll-nib-b);opacity:0}}
[data-slot=reveal-nib]{opacity:0;left:var(--ll-nib-a)}
[data-slot=reveal][data-nib][data-armed][data-state=visible]>[data-slot=reveal-nib]{animation:ll-reveal-nib var(--ll-reveal-dur) var(--ll-ease-out) var(--ll-reveal-delay,0s) both}
[data-slot=reveal][data-armed][data-stagger][data-state=hidden]>*{opacity:0}
[data-slot=reveal][data-armed][data-stagger][data-state=visible]>*{animation:var(--ll-reveal-anim) var(--ll-reveal-dur) var(--ll-ease-out) calc(var(--ll-reveal-delay,0s) + var(--ll-reveal-i,0)*var(--ll-reveal-stagger,.12s)) both}
${Array.from({
  length: 16
}, (_, i) => `[data-slot=reveal][data-stagger]>:nth-child(${i + 1}){--ll-reveal-i:${i}}`).join("\n")}`;
const STEPS = Array.from({
  length: 21
}, (_, i) => i / 20);
type Effect = "wipe" | "soak" | "drop" | "pop" | "toss";
const EFFECTS: Record<Effect, {
  anim: string;
  dur: string;
}> = {
  wipe: {
    anim: "ll-wipe" as const,
    dur: "var(--ll-dur-draw)" as const
  },
  soak: {
    anim: "ll-soak" as const,
    dur: "var(--ll-dur-soak)" as const
  },
  drop: {
    anim: "ll-drop" as const,
    dur: "var(--ll-dur-drop)" as const
  },
  pop: {
    anim: "ll-pop" as const,
    dur: "var(--ll-dur-pop)" as const
  },
  toss: {
    anim: "ll-toss" as const,
    dur: "var(--ll-dur-toss)" as const
  }
};
type RevealProps = Omit<UI.ComponentProps<"div">, "onChange"> & {
  effect?: Effect;
  from?: "start" | "end";
  delay?: number;
  stagger?: number;
  threshold?: number;
  once?: boolean;
  onReveal?: () => void;
  nib?: boolean;
  nibColor?: PaintKey;
  as?: "div" | "section" | "article" | "aside" | "figure" | "ul" | "ol" | "li" | "span" | "p";
};
const Reveal = defineUi<RevealProps>("Reveal", ["class", "style", "effect", "from", "delay", "stagger", "threshold", "once", "onReveal", "nib", "nibColor", "as"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const style = computed(() => _props["style"]);
  const effect = computed(() => _props["effect"] === undefined ? "wipe" as const : _props["effect"]);
  const from = computed(() => _props["from"] === undefined ? "start" as const : _props["from"]);
  const delay = computed(() => _props["delay"] === undefined ? 0 : _props["delay"]);
  const stagger = computed(() => _props["stagger"]);
  const threshold = computed(() => _props["threshold"] === undefined ? 0.25 : _props["threshold"]);
  const once = computed(() => _props["once"] === undefined ? true : _props["once"]);
  const onReveal = computed(() => _props["onReveal"]);
  const nib = computed(() => _props["nib"] === undefined ? false : _props["nib"]);
  const nibColor = computed(() => _props["nibColor"] === undefined ? "tomato" as const : _props["nibColor"]);
  const as = computed(() => _props["as"] === undefined ? "div" as const : _props["as"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "style", "effect", "from", "delay", "stagger", "threshold", "once", "onReveal", "nib", "nibColor", "as"]));
  const Comp = computed(() => jsxTag(as.value as UI.ElementType));
  const nibbed = computed(() => nib.value && effect.value === "wipe" && !stagger.value && as.value !== "ul" && as.value !== "ol");
  const Wrap = computed(() => jsxTag(as.value === "p" || as.value === "span" ? "span" as const : "div" as const));
  const _penCore = useInk(() => ({
    recipe: revealNibRecipe,
    params: {
      color: nibColor.value
    },
    kind: "reveal-nib" as const,
    size: [24, 24],
    seed: "reveal-nib" as const
  }));
  const pen = computed(() => proxyRefs(_penCore));
  const _nestedHook0 = useInkContext();
  const providerReduced = computed(() => _nestedHook0.value.motion === "reduced");
  const root = shallowRef<HTMLElement | null | null>(null);
  const armed = shallowRef(initialState(false));
  const setArmed = stateSetter(armed);
  const visible = shallowRef(initialState(true));
  const setVisible = stateSetter(visible);
  const seen = shallowRef(onReveal.value);
  watchDependencies(() => {
    const el = root.value;
    if (!el || motionIsOff(el, providerReduced.value) || typeof IntersectionObserver === "undefined") return;
    setArmed(true);
    setVisible(false);
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        const enough = e.isIntersecting && ((e.intersectionRatio ?? 1) >= threshold.value || (e.intersectionRect?.height ?? 0) >= window.innerHeight * 0.4);
        if (enough) {
          setVisible(true);
          seen.value?.();
          if (once.value) io.disconnect();
        } else if (!once.value && !e.isIntersecting) setVisible(false);
      }
    }, {
      threshold: STEPS
    });
    io.observe(el);
    return () => {
      io.disconnect();
      setArmed(false);
      setVisible(true);
    };
  }, () => [once.value, threshold.value, providerReduced.value], true);
  const fx = computed(() => EFFECTS[effect.value]);
  const vars = computed(() => ({
    "--ll-reveal-anim": fx.value.anim,
    "--ll-reveal-dur": fx.value.dur,
    "--ll-reveal-delay": delay.value ? `${delay.value}s` : undefined,
    "--ll-reveal-stagger": stagger.value ? `${stagger.value}s` : undefined,
    ...(effect.value === "wipe" && from.value === "end" ? {
      "--ll-wipe-r": "-4%" as const,
      "--ll-wipe-l": "100%" as const
    } : {})
  }));
  return () => {
    seen.value = onReveal.value;
    return <>
      <style>
        {CSS}
      </style>
      <Comp.value data-slot="reveal" data-effect={effect.value} data-state={visible.value ? "visible" as const : "hidden" as const} data-armed={armed.value ? "" as const : undefined} data-stagger={stagger.value ? "" as const : undefined} data-nib={nibbed.value ? "" as const : undefined} data-from={from.value === "end" ? "end" as const : undefined} ref={useMergedRef<HTMLElement>(root, ref.value as UI.Ref<HTMLElement> | undefined)} class={cn("group/reveal", nibbed.value && "relative", className.value)} style={cssStyle({
        ...vars.value,
        ...style.value
      } as UI.CSSProperties)} {...domProps(props.value)}>
        {nibbed.value ? <>
            <Wrap.value data-slot="reveal-content" class={Wrap.value === "span" ? "block" as const : undefined}>
              {readSlot(_slots.default)}
            </Wrap.value>
            <span data-slot="reveal-nib" aria-hidden="true" ref={pen.value.hostRef} {...domProps(pen.value.hostProps)} style={cssStyle({
            outline: "none" as const
          })} class="pointer-events-none absolute bottom-0 z-(--ll-z-raised) isolate size-6 -translate-x-[12%] translate-y-[12%]">
              {pen.value.node}
            </span>
          </> : readSlot(_slots.default)}
      </Comp.value>
    </>;
  };
});
export { Reveal };
export type { RevealProps, Effect as RevealEffect };
