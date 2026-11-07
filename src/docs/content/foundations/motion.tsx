// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { CodeBlock, InlineCode, Prose, Section } from "@/docs/kit";
import { Boil } from "@/components/ui/boil";
import { Button } from "@/components/ui/button";
import { Circled } from "@/components/ui/circled";
import { Doodle } from "@/components/ui/doodle";
import { Highlight } from "@/components/ui/highlight";
import { Mascot } from "@/components/ui/mascot";
import { Paper } from "@/components/ui/paper";
import { Underline } from "@/components/ui/underline";
import { InkProvider } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
import { curvePath, curvePoint, progressAt, overshoot, type CurveBox } from "./_shared/easing";
import { DURATIONS, EASINGS } from "./_shared/data.generated";
import { Demo, Panel, Readout, Related, SliderRow, SwitchRow, TableScroll, component, foundation, td, th } from "./_shared/kit";
const DURATION_USE: Record<string, string> = {
  press: "A pressed control snapping into register." as const,
  hover: "The hover layer arriving and the fill nudging." as const,
  fade: "State layers (focus, invalid, disabled) fading in." as const,
  pop: "A chip or a mark stamped on." as const,
  sheet: "A sheet turning; the small drop of a dialog." as const,
  drop: "A sheet dropped onto the desk." as const,
  toss: "A toast thrown in from the corner." as const,
  soak: "New text drying like wet ink." as const,
  boil: "One step of a boiling line." as const,
  draw: "A stroke drawn on." as const
};
const Durations = defineUi<{}>("Durations", [], (_props, {
  slots: _slots
}) => {
  const on = shallowRef(initialState(false));
  const setOn = stateSetter(on);
  return () => {
    return <div class="grid gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => setOn(v => !v)}>
          {on.value ? "Reset the bars" as const : "Run all ten at once" as const}
        </Button>
        <p class="text-[14.5px] text-muted-foreground">Every bar has the same length to cover; each takes its own token to do it.</p>
      </div>
      <TableScroll label="The ten duration tokens">
        <table class="w-full min-w-[34rem] border-collapse text-[15px]">
          <caption class="sr-only">Duration tokens, their length, a bar that takes that long to fill, and what each one is for</caption>
          <thead>
            <tr>
              <th scope="col" class={th}>Token</th>
              <th scope="col" class={th}>Time</th>
              <th scope="col" class={th}>Bar</th>
              <th scope="col" class={th}>For</th>
            </tr>
          </thead>
          <tbody>
            {DURATIONS.map(d => <tr key={d.token}>
                <th scope="row" class={cn(td, "text-start font-mono text-[13.5px] font-medium whitespace-nowrap")}>{d.token}</th>
                <td class={cn(td, "ll-num font-mono text-[13.5px] whitespace-nowrap")}>{d.ms} ms</td>
                <td class={cn(td, "w-40 min-w-32")}>
                  <div aria-hidden="true" class="h-3 border border-ink/50 bg-paper">
                    <div class="h-full bg-marker" style={cssStyle({
                    width: on.value ? "100%" as const : "0%" as const,
                    transition: `width var(${d.token}) linear`
                  })} />
                  </div>
                </td>
                <td class={td}>{DURATION_USE[d.name] ?? d.role}</td>
              </tr>)}
          </tbody>
        </table>
      </TableScroll>
    </div>;
  };
});
const BOX: CurveBox = {
  w: 116,
  h: 84,
  pad: 8,
  headroom: 0.25
};
const Curve = defineUi<{
  name: string;
  css: string;
  bezier: readonly [number, number, number, number];
  t: number;
}>("Curve", ["name", "css", "bezier", "t"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const css = computed(() => _props["css"]);
  const bezier = computed(() => _props["bezier"]);
  const t = computed(() => _props["t"]);
  const p = computed(() => curvePoint(bezier.value, t.value, BOX));
  const size = computed(() => BOX.w + 2 * BOX.pad);
  const height = computed(() => BOX.h + 2 * BOX.pad);
  const top = computed(() => curvePoint(bezier.value, 0, BOX).y);
  const one = computed(() => curvePoint(bezier.value, 1, BOX).y);
  return () => {
    return <figure class="m-0 min-w-0">
      <svg role="img" aria-label={`The ${name.value} easing as a curve: time across, progress up`} viewBox={`0 0 ${size.value} ${height.value}`} width={size.value} height={height.value} class="block h-auto max-w-full overflow-visible">
        <line x1={BOX.pad} y1={one.value} x2={BOX.pad + BOX.w} y2={one.value} stroke="var(--ll-pencil-mark)" stroke-width="1" stroke-dasharray="3 4" />
        <line x1={BOX.pad} y1={top.value} x2={BOX.pad + BOX.w} y2={one.value} stroke="var(--ll-pencil-mark)" stroke-width="1" opacity="0.5" />
        <path d={curvePath(bezier.value, BOX)} fill="none" stroke="var(--ll-ink)" stroke-width="2.4" stroke-linecap="round" />
        <circle cx={p.value.x} cy={p.value.y} r="5" fill="var(--ll-marker)" stroke="var(--ll-ink)" stroke-width="1.5" />
      </svg>
      <figcaption class="mt-1 leading-snug">
        <span class="block font-mono text-[14px] font-medium">{name.value}</span>
        <span class="block font-mono text-[12px] text-pencil-text">{css.value}</span>
        <span class="ll-num block font-mono text-[12.5px] text-ink-soft">{progressAt(bezier.value, t.value).toFixed(2)} at {t.value.toFixed(2)}</span>
      </figcaption>
    </figure>;
  };
});
const Easings = defineUi<{}>("Easings", [], (_props, {
  slots: _slots
}) => {
  const t = shallowRef(initialState(0.35));
  const setT = stateSetter(t);
  const go = shallowRef(initialState(false));
  const setGo = stateSetter(go);
  return () => {
    return <div class="grid gap-6">
      <Panel>
        <SliderRow label="Time" value={t.value} min={0} max={1} step={0.01} onChange={setT} format={v => v.toFixed(2)} ticks={4} hint="Scrub. The dot is where the easing has got to; on settle, pop and dialog it goes past 1 and comes back." />
      </Panel>
      <Demo label="Five easings as curves, with a dot at the scrubbed time">
        <ul role="list" class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-x-4 gap-y-6 p-0" aria-label="The five easings">
          {EASINGS.map(e => <li key={e.name} class="min-w-0">
              <Curve name={e.name} css={e.css} bezier={e.bezier} t={t.value} />
              <p class="ll-num mt-0.5 text-[14px] text-muted-foreground">{overshoot(e.bezier) > 1.001 ? `overshoots to ${overshoot(e.bezier).toFixed(2)}` : "no overshoot" as const}</p>
            </li>)}
        </ul>
      </Demo>
      <div class="grid gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setGo(v => !v)}>
            {go.value ? "Back to the start" as const : "Race them (0.6 s)" as const}
          </Button>
          <p class="text-[14.5px] text-muted-foreground">Same distance, same time (--ll-dur-draw), five easings.</p>
        </div>
        <Demo label="Five chips racing along five lanes, each with its own easing">
          <ul role="list" dir="ltr" class="m-0 grid list-none gap-1 p-0" aria-label="Easing lanes">
            {EASINGS.map(e => <li key={e.name} class="grid h-9 grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3 border-b border-dashed border-pencil-mark/70">
                <span class="font-mono text-[13px] text-pencil-text">{e.name}</span>
                <span class="relative me-[15%] block h-full">
                  <span aria-hidden="true" class="absolute top-1.5 size-6 border-[1.5px] border-ink bg-marker" style={cssStyle({
                  left: go.value ? "calc(100% - 1.5rem)" as const : "0%" as const,
                  transition: `left var(--ll-dur-draw) var(${e.token})`
                })} />
                </span>
              </li>)}
          </ul>
        </Demo>
      </div>
    </div>;
  };
});
const EFFECTS = [{
  id: "soak" as const,
  cls: "animate-soak" as const,
  label: "soak" as const
}, {
  id: "pop" as const,
  cls: "animate-pop" as const,
  label: "pop" as const
}, {
  id: "drop" as const,
  cls: "animate-drop" as const,
  label: "drop" as const
}, {
  id: "sheet-drop" as const,
  cls: "animate-sheet-drop" as const,
  label: "sheet-drop" as const
}, {
  id: "toss" as const,
  cls: "animate-toss" as const,
  label: "toss" as const
}, {
  id: "wipe" as const,
  cls: "animate-wipe" as const,
  label: "wipe" as const
}] as const;
const EffectSample = defineUi<{
  id: typeof EFFECTS[number]["id"];
}>("EffectSample", ["id"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  return () => {
    switch (id.value) {
      case "soak":
        return <span class="animate-soak font-script text-2xl font-bold">wet ink</span>;
      case "pop":
        return <span class="animate-pop inline-block border-[1.5px] border-ink bg-hi px-3 py-0.5 font-type text-sm">STAMPED</span>;
      case "drop":
        return <Paper stock="index-card" seed="fx-drop" size={[110, 64]} class="animate-drop h-16 w-[110px] p-2 text-[14px] leading-tight">dropped on the desk</Paper>;
      case "sheet-drop":
        return <Paper stock="slip" seed="fx-sheet" size={[110, 64]} class="animate-sheet-drop h-16 w-[110px] p-2 text-[14px] leading-tight">a dialog sheet</Paper>;
      case "toss":
        return <Paper stock="sticky-yellow" seed="fx-toss" size={[110, 64]} class="animate-toss h-16 w-[110px] p-2 text-[14px] leading-tight">toast, thrown</Paper>;
      case "wipe":
        return <span class="animate-wipe inline-block bg-hi px-3 py-1 font-hand text-[15px] font-bold">a swipe of yellow</span>;
    }
  };
});
function useComputedNumber(_source0: MaybeRefOrGetter<UI.RefObject<HTMLElement | null>>, _source1: MaybeRefOrGetter<string>, _source2: MaybeRefOrGetter<unknown>): ComputedRef<string> {
  const ref = computed(() => toValue(_source0));
  const prop = computed(() => toValue(_source1));
  const dep = computed(() => toValue(_source2));
  const value = shallowRef(initialState(""));
  const setValue = stateSetter(value);
  watchDependencies(() => {
    const el = ref.value.value;
    if (!el) return;
    setValue(getComputedStyle(el).getPropertyValue(prop.value).trim());
  }, () => [ref.value, prop.value, dep.value], true);
  return computed(() => {
    return value.value;
  });
}
const ReducedMotion = defineUi<{
  reduced: boolean;
  onReduced: (v: boolean) => void;
}>("ReducedMotion", ["reduced", "onReduced"], (_props, {
  slots: _slots
}) => {
  const reduced = computed(() => _props["reduced"]);
  const onReduced = computed(() => _props["onReduced"]);
  const round = shallowRef(initialState(0));
  const setRound = stateSetter(round);
  const scope = shallowRef<HTMLDivElement | null>(null);
  const motion = useComputedNumber(() => scope, () => "--ll-motion", () => reduced.value);
  const jitter = useComputedNumber(() => scope, () => "--ll-jitter-k", () => reduced.value);
  return () => {
    return <div class="grid gap-5">
      <Panel>
        <div class="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <SwitchRow label="Pretend the OS asked for less motion" checked={reduced.value} onChange={onReduced.value} hint="The same switch as at the top of the page. It puts data-motion=reduced on a wrapper, exactly as the site's settings button does for the whole page." />
          <Button variant="secondary" size="sm" onClick={() => setRound(r => r + 1)}>
            Replay all six
          </Button>
        </div>
      </Panel>
      <div ref={scope} data-testid="motion-scope">
        <Demo label="Six one-shot effects and the readout of the switch">
          <ul role="list" class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] items-start gap-x-4 gap-y-6 p-0" aria-label="Six effects">
            {EFFECTS.map(e => <li key={e.id} class="min-w-0">
                <div key={`${e.id}:${round.value}`} class="flex min-h-20 items-center">
                  <EffectSample id={e.id} />
                </div>
                <p class="font-mono text-[12.5px] text-pencil-text">{e.cls}</p>
              </li>)}
          </ul>
          <dl class="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-dashed border-pencil-mark/60 pt-3 text-[14.5px]">
            <dt class="font-mono text-[13px]">--ll-motion</dt>
            <dd>
              <Readout data-testid="motion-readout">{motion.value || "1"}</Readout>
            </dd>
            <dt class="font-mono text-[13px]">--ll-jitter-k</dt>
            <dd>
              <Readout data-testid="jitter-readout">{jitter.value || "1"}</Readout>
            </dd>
          </dl>
        </Demo>
      </div>
    </div>;
  };
});
const DrawOn = defineUi<{}>("DrawOn", [], (_props, {
  slots: _slots
}) => {
  const marked = shallowRef(initialState(true));
  const setMarked = stateSetter(marked);
  const round = shallowRef(initialState(0));
  const setRound = stateSetter(round);
  return () => {
    return <div class="grid gap-5">
      <Panel>
        <div class="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <SwitchRow label="Marked up" checked={marked.value} onChange={setMarked} hint="Switch it off and on again: turning it on plays the draw-on." />
          <Button variant="secondary" size="sm" onClick={() => setRound(r => r + 1)}>
            Redraw the stroke
          </Button>
        </div>
      </Panel>
      <Demo label="Marks that draw themselves on">
        <div class="grid gap-5">
          <p class="max-w-xl text-[19px] leading-[2]">
            The good bits get <Highlight animate show={marked.value} seed="d1">a swipe of yellow</Highlight>, the rules get{" "}
            <Underline animate show={marked.value} tone="blue" kind="wavy" seed="d2">
              a wavy blue line
            </Underline>
            , and the one thing you must not miss is <Circled animate show={marked.value} tone="red" seed="d3">circled</Circled>.
          </p>
          <div class="flex items-center gap-4">
            <svg key={round.value} role="img" aria-label="A hand-drawn stroke that draws itself on" viewBox="0 0 132 44" width={132} height={44} class="block overflow-visible">
              <path class="ll-draw" pathLength="1" d="M6 28 C 22 4, 38 44, 60 22 S 104 6, 126 24" fill="none" stroke="var(--ll-ink-you)" stroke-width="3.2" stroke-linecap="round" />
            </svg>
            <p class="text-[14.5px] text-muted-foreground">
              <InlineCode>ll-draw</InlineCode> on a path with <InlineCode>pathLength=&quot;1&quot;</InlineCode>: dash it, then pull the dash away.
            </p>
          </div>
        </div>
      </Demo>
    </div>;
  };
});
const BoilDemo = defineUi<{}>("BoilDemo", [], (_props, {
  slots: _slots
}) => {
  const fps = shallowRef(initialState(6));
  const setFps = stateSetter(fps);
  const frames = shallowRef(initialState(3));
  const setFrames = stateSetter(frames);
  const strength = shallowRef(initialState(1));
  const setStrength = stateSetter(strength);
  const active = shallowRef(initialState(true));
  const setActive = stateSetter(active);
  return () => {
    return <div class="grid gap-5">
      <Panel>
        <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <SliderRow label="Redraws per second" value={fps.value} min={1} max={12} onChange={setFps} format={v => `${v} fps`} hint="Hand animation boils at about six." />
          <SliderRow label="Different drawings" value={frames.value} min={2} max={4} onChange={setFrames} format={v => `${v} frames`} />
          <SliderRow label="How restless" value={strength.value} min={0} max={2} step={0.1} onChange={setStrength} format={v => v.toFixed(1)} />
          <SwitchRow label="Boiling" checked={active.value} onChange={setActive} hint="Anything that moves for more than five seconds needs a way to stop it." class="content-start" />
        </div>
      </Panel>
      <Demo label="A doodle, a mascot and a button that boil">
        <div class="flex flex-wrap items-center justify-center gap-10 py-3">
          <Boil fps={fps.value} frames={frames.value} strength={strength.value} active={active.value} data-testid="boil">
            <Doodle name="sun" size={104} label="A boiling sun" />
          </Boil>
          <Boil fps={fps.value} frames={frames.value} strength={strength.value} active={active.value}>
            <Mascot pose="wave" size={104} label="Stubby the pencil stub, waving" />
          </Boil>
          <Boil fps={fps.value} frames={frames.value} strength={strength.value} active={active.value}>
            <Button>Save changes</Button>
          </Boil>
        </div>
      </Demo>
    </div>;
  };
});
const STREAM = "The pen does not wait for the sentence to finish. Each new word lands dark and wet, and dries to ink in half a second. That is the whole trick behind streaming chat.";
const WORDS = STREAM.split(" ");
const Soak = defineUi<{}>("Soak", [], (_props, {
  slots: _slots
}) => {
  const count = shallowRef(initialState(0));
  const setCount = stateSetter(count);
  const running = shallowRef(initialState(false));
  const setRunning = stateSetter(running);
  watchDependencies(() => {
    if (!running.value) return;
    if (count.value >= WORDS.length) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setCount(c => c + 1), 130);
    return () => clearTimeout(id);
  }, () => [running.value, count.value], false);
  return () => {
    return <div class="grid gap-4">
      <div class="flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={() => {
          setCount(0);
          setRunning(true);
        }}>
          {count.value === 0 ? "Stream a sentence" as const : "Stream it again" as const}
        </Button>
      </div>
      <Paper stock="paper" tilt={false} class="min-h-32 px-6 py-5">
        <p class="max-w-xl font-script text-3xl leading-snug text-ink" aria-live="off" data-testid="soak-text">
          {WORDS.slice(0, count.value).map((w, i) => <span key={i} class="animate-soak">
              {w}{" "}
            </span>)}
        </p>
      </Paper>
    </div>;
  };
});
const Layers = defineUi<{}>("Layers", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-3">
      {([["at rest", {}], ["data-hover", {
        "data-hover": "" as const
      }], ["data-pressed", {
        "data-pressed": "" as const
      }], ["data-focus-visible", {
        "data-focus-visible": "" as const
      }]] as const).map(([label, attrs]) => <div key={label} class="grid justify-items-center gap-2">
          <Button seed="layers" {...domProps(attrs)}>
            Save changes
          </Button>
          <code class="font-mono text-[12.5px] text-pencil-text">{label}</code>
        </div>)}
    </div>;
  };
});
const MotionPage = defineUi<{}>("MotionPage", [], (_props, {
  slots: _slots
}) => {
  const reduced = shallowRef(initialState(false));
  const setReduced = stateSetter(reduced);
  return () => {
    return <>
      <Section id="principles" title="Short, physical, and off when asked">
        <Prose>
          <p>
            Motion here is what paper and ink do: a marker snaps into register, a sheet drops on the desk and settles, wet ink dries. Three rules cover nearly everything:
          </p>
          <ul>
            <li><strong>Boil only on live things.</strong> A line that shivers says &quot;this is alive&quot;. Use it on a mascot or a call to action, never on a list.</li>
            <li><strong>Streaming prose soaks in.</strong> New words arrive dark and dry to ink.</li>
            <li><strong>Everything else settles.</strong> One overshoot, then still.</li>
          </ul>
          <p>
            Everything below runs live. If you would rather watch it with less motion, this switch does what the site&apos;s settings button does, for this page only.
          </p>
        </Prose>
        <Panel class="max-w-xl">
          <SwitchRow label="Less motion for this page" checked={reduced.value} onChange={setReduced} hint="Durations collapse to zero and the boiling stops. The rest of the page carries on." />
        </Panel>
      </Section>

      <InkProvider motion={reduced.value ? "reduced" as const : "system" as const} defs={false}>
        <Section id="durations" title="Durations" description="Components read their durations from ten tokens; none writes a literal number of milliseconds. Every token is multiplied by --ll-motion, which is what makes reduced motion a single switch.">
          <Demo label="Ten duration tokens, each with a bar that takes that long to fill">
            <Durations />
          </Demo>
        </Section>

        <Section id="easings" title="Easings" description="Five curves. Out and in are the browser's own. Settle, pop and dialog overshoot a little and come back, which is what makes a sheet feel like it has weight.">
          <Easings />
        </Section>

        <Section id="reduced" title="Reduced motion is one switch" description="The OS setting and the in-app one both set --ll-motion to 0 and --ll-jitter-k to 0. Every duration collapses, in nested scopes too.">
          <Prose>
            <p>
              Animations use <InlineCode>fill-mode: both</InlineCode>, so with the duration at zero they land on their last frame: nothing is left half-drawn, and nothing hides the content.
              Tailwind, tw-animate and Reka UI animate with their own durations, so the stylesheet also zeroes those.
            </p>
          </Prose>
          <ReducedMotion reduced={reduced.value} onReduced={setReduced} />
        </Section>

        <Section id="draw-on" title="Draw-on" description="Marks written on the page draw themselves on the first time they scroll into view, along the reading direction. With reduced motion they are simply there.">
          <DrawOn />
        </Section>

        <Section id="boil" title="Boil" description="Three redrawn frames, stepped about six times a second, on the few things that are alive. It stops for reduced motion, in calm density, in a hidden tab, and off screen.">
          <BoilDemo />
        </Section>

        <Section id="soak" title="Soak" description="The one animation meant for text. Only new words soak; text that was already there never replays.">
          <Soak />
        </Section>

        <Section id="layers" title="Interaction never redraws" description="Hover, press and focus are pre-drawn layers inside the same SVG. CSS shows them with opacity and small transforms; Vue does not re-render, and nothing is measured or redrawn.">
          <Demo label="One button, forced into its four states">
            <Layers />
          </Demo>
          <CodeBlock lang="tsx" title="Forcing a state, for docs and screenshots" code={`<Button data-hover>Save changes</Button>
<Button data-pressed>Save changes</Button>
<Button data-focus-visible>Save changes</Button>`} />
        </Section>
      </InkProvider>

      <Related items={[foundation("pens", "Pens", "The stroke that draw-on reveals."), foundation("density", "Density", "Calm stands the boil down."), foundation("accessibility", "Accessibility", "Motion and the rest of the checklist."), component("boil", "Boil", "Every prop and hook."), component("reveal", "Reveal", "Wipe, soak, drop, pop and toss on scroll."), component("typewriter", "Typewriter", "Text typed out with a cursor.")]} />
    </>;
  };
});
export default MotionPage;
