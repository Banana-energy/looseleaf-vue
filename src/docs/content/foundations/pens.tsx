// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { CodeBlock, InlineCode, Prose, Section } from "@/docs/kit";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GRAINS, MASK_VARIANTS } from "@/lib/ink/builder";
import type { PenName, Tier } from "@/lib/ink/types";
import { cn } from "@/lib/utils";
import { InkPicture } from "./_shared/ink-picture";
import { Demo, Panel, Related, SliderRow, SwitchRow, TableScroll, component, foundation, td, th } from "./_shared/kit";
import { LAB_DEFAULTS, LAYER_STORY, drawCrossing, drawEnds, drawHatch, drawHierarchy, drawLab, drawSample, explodeStroke, hasWeights, labCode, penRows, type Exploded, type ExplodedLayer, type LabParams, type PenRow } from "./_shared/pen-lab";
const ROWS = penRows();
const MAIN = ROWS.filter(r => r.group === "felt" || r.group === "pencil" || r.group === "marker");
const ACCENT_MARKERS = ROWS.filter(r => r.group === "accent-marker");
const ACCENT_FELTS = ROWS.filter(r => r.group === "accent-felt");
const kb = (chars: number) => `${(chars / 1024).toFixed(1)} KB`;
const HERO_PENS: PenName[] = ["ink.brush", "blue", "pencil", "terracotta", "hi"];
const SamePens = defineUi<{}>("SamePens", [], (_props, {
  slots: _slots
}) => {
  const drawn = computed(() => HERO_PENS.map(p => ({
    name: p,
    drawn: drawSample(p, {
      w: 190,
      h: 56,
      tier: "hi" as const,
      seed: "hero" as const
    })
  })));
  return () => {
    return <ul role="list" aria-label="One line, five pens" class="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0">
      {drawn.value.map(({
        name,
        drawn: d
      }) => <li key={name} class="min-w-0 text-center">
          <InkPicture drawn={d} label={`The same wave in ${name}`} />
          <code class="font-mono text-[13px]">{name}</code>
        </li>)}
    </ul>;
  };
});
const TierToggle = defineUi<{
  tier: Tier;
  onChange: (t: Tier) => void;
}>("TierToggle", ["tier", "onChange"], (_props, {
  slots: _slots
}) => {
  const tier = computed(() => _props["tier"]);
  const onChange = computed(() => _props["onChange"]);
  return () => {
    return <div class="flex flex-wrap items-center gap-3">
      <span id="tier-label" class="text-[15px] font-bold">
        Tier
      </span>
      <ToggleGroup type="single" variant="outline" size="sm" spacing={1} class="flex-wrap" value={tier.value} onValueChange={v => v && onChange.value(v as Tier)} aria-labelledby="tier-label">
        <ToggleGroupItem value="lo">lo: what components run</ToggleGroupItem>
        <ToggleGroupItem value="hi">hi: hero art</ToggleGroupItem>
      </ToggleGroup>
    </div>;
  };
});
const PenTable = defineUi<{
  tier: Tier;
}>("PenTable", ["tier"], (_props, {
  slots: _slots
}) => {
  const tier = computed(() => _props["tier"]);
  const drawn = computed(() => new Map(MAIN.map(r => [r.name, drawSample(r.name, {
    tier: tier.value
  })])));
  return () => {
    return <TableScroll label="The pen table">
      <table class="w-full min-w-[42rem] border-collapse text-[15px]">
        <caption class="sr-only">Every named pen: a sample stroke, its kind, width, opacity, grain, color token and the size of its drawing</caption>
        <thead>
          <tr>
            <th scope="col" class={th}>Stroke</th>
            <th scope="col" class={th}>Pen</th>
            <th scope="col" class={th}>Kind</th>
            <th scope="col" class={th}>Width</th>
            <th scope="col" class={th}>Opacity</th>
            <th scope="col" class={th}>Grain</th>
            <th scope="col" class={th}>Color</th>
            <th scope="col" class={th}>Markup</th>
          </tr>
        </thead>
        <tbody>
          {MAIN.map(r => {
            const d = drawn.value.get(r.name)!;
            return <tr key={r.name}>
                <td class={td}>
                  <InkPicture drawn={d} label={`${r.label}, a sample stroke`} />
                </td>
                <th scope="row" class={cn(td, "text-start")}>
                  <code class="font-mono text-[13.5px] font-medium">{r.name}</code>
                  <span class="block text-[14px] font-normal text-muted-foreground">{r.label}</span>
                </th>
                <td class={td}>{r.kind}</td>
                <td class={cn(td, "ll-num font-mono text-[13.5px] whitespace-nowrap")}>{r.width} px</td>
                <td class={cn(td, "ll-num font-mono text-[13.5px]")}>{r.alpha}</td>
                <td class={cn(td, "font-mono text-[13.5px]")}>{r.grain}</td>
                <td class={cn(td, "font-mono text-[13.5px]")}>{r.colour}</td>
                <td class={cn(td, "ll-num font-mono text-[13.5px] whitespace-nowrap")}>{kb(d.svg.length)}</td>
              </tr>;
          })}
        </tbody>
      </table>
    </TableScroll>;
  };
});
const PenGrid = defineUi<{
  label: string;
  rows: readonly PenRow[];
  tier: Tier;
}>("PenGrid", ["label", "rows", "tier"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const rows = computed(() => _props["rows"]);
  const tier = computed(() => _props["tier"]);
  const drawn = computed(() => rows.value.map(r => [r, drawSample(r.name, {
    tier: tier.value,
    w: 132,
    h: 36
  })] as const));
  return () => {
    return <ul role="list" aria-label={label.value} class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-x-4 gap-y-3 p-0">
      {drawn.value.map(([r, d]) => <li key={r.name} class="min-w-0">
          <InkPicture drawn={d} label={`${r.label}, a sample stroke`} />
          <code class="font-mono text-[13px]">{r.name}</code>
        </li>)}
    </ul>;
  };
});
const WEIGHT_PENS: PenName[] = ["ink", "blue", "pencil", "red"];
const Weights = defineUi<{
  tier: Tier;
}>("Weights", ["tier"], (_props, {
  slots: _slots
}) => {
  const tier = computed(() => _props["tier"]);
  const drawn = computed(() => WEIGHT_PENS.map(p => (["fine", "", "brush"] as const).map(w => {
    const name = (w ? `${p}.${w}` : p) as PenName;
    return {
      name,
      drawn: drawSample(name, {
        tier: tier.value,
        w: 150,
        h: 38
      })
    };
  })));
  return () => {
    return <div class="grid gap-x-6 gap-y-3 sm:grid-cols-3">
      {["fine: detail", "regular: the pen", "brush: the main shapes"].map(h => <p key={h} class="font-script text-xl font-bold">
          {h}
        </p>)}
      {drawn.value.flat().map(c => <div key={c.name} class="min-w-0">
          <InkPicture drawn={c.drawn} label={`${c.name} sample`} />
          <code class="font-mono text-[13px]">{c.name}</code>
        </div>)}
    </div>;
  };
});
const LayerSvg = defineUi<{
  ex: Exploded;
  layers: readonly ExplodedLayer[];
  label: string;
  centre?: boolean;
}>("LayerSvg", ["ex", "layers", "label", "centre"], (_props, {
  slots: _slots
}) => {
  const ex = computed(() => _props["ex"]);
  const layers = computed(() => _props["layers"]);
  const label = computed(() => _props["label"]);
  const centre = computed(() => _props["centre"]);
  const pad = computed(() => ex.value.pad);
  return () => {
    return <svg data-ink="illustration" role="img" aria-label={label.value} focusable="false" viewBox={`${-pad.value} ${-pad.value} ${ex.value.w + 2 * pad.value} ${ex.value.h + 2 * pad.value}`} width={ex.value.w + 2 * pad.value} height={ex.value.h + 2 * pad.value} class="pointer-events-none block h-auto max-w-full overflow-visible">
      {centre.value ? <g stroke="var(--ll-pencil-mark)" fill="var(--ll-paper)">
          <path d={ex.value.centre} fill="none" stroke-width="1" stroke-dasharray="3 4" stroke-linecap="round" />
          {ex.value.points.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.6" stroke-width="1.2" />)}
        </g> : null}
      {layers.value.map((l, i) => <path key={i} d={l.d} fill={l.fill} fill-opacity={l.opacity} fill-rule={l.evenodd ? "evenodd" as const : undefined} />)}
    </svg>;
  };
});
const ANATOMY_PENS: {
  value: PenName;
  label: string;
}[] = [{
  value: "ink.brush" as const,
  label: "Felt brush pen" as const
}, {
  value: "pencil" as const,
  label: "Pencil" as const
}, {
  value: "terracotta" as const,
  label: "Marker" as const
}];
const Anatomy = defineUi<{}>("Anatomy", [], (_props, {
  slots: _slots
}) => {
  const pen = shallowRef<PenName>(initialState("ink.brush"));
  const setPen = stateSetter(pen);
  const ex = computed(() => explodeStroke({
    pen: pen.value,
    seed: "anatomy" as const,
    tier: "hi" as const
  }));
  const kinds = computed(() => {
    const map = new Map<string, ExplodedLayer[]>();
    for (const l of ex.value.layers) map.set(l.kind, [...(map.get(l.kind) ?? []), l]);
    return [...map];
  });
  const whole = computed(() => drawSample(pen.value, {
    w: ex.value.w,
    h: ex.value.h,
    tier: "hi" as const,
    seed: "anatomy" as const
  }));
  return () => {
    return <div class="grid gap-5">
      <div class="grid gap-1.5">
        <p id="anatomy-pen" class="text-[15px] font-bold">
          Take a stroke apart
        </p>
        <ToggleGroup type="single" variant="outline" size="sm" spacing={1} class="flex-wrap" value={pen.value} onValueChange={v => v && setPen(v as PenName)} aria-labelledby="anatomy-pen">
          {ANATOMY_PENS.map(p => <ToggleGroupItem key={p.value} value={p.value}>
              {p.label}
            </ToggleGroupItem>)}
        </ToggleGroup>
      </div>
      <ol class="m-0 grid list-none gap-4 p-0 sm:grid-cols-2" aria-label="The layers of one stroke, in the order they are painted">
        <li class="min-w-0">
          <LayerSvg ex={ex.value} layers={[]} centre label="The center line the hand follows, dotted" />
          <p class="mt-1 text-[15px] leading-snug">
            <strong>The intention.</strong> A handful of points. Everything else is the hand deciding how to round them into a line.
          </p>
        </li>
        {kinds.value.map(([kind, layers]) => <li key={kind} class="min-w-0" data-layer-kind={kind}>
            <LayerSvg ex={ex.value} layers={layers} centre label={`The ${kind} layer of the stroke`} />
            <p class="mt-1 text-[15px] leading-snug">
              <strong class="font-mono text-[14px]">{kind}</strong>
              {layers.length > 1 ? <span class="text-muted-foreground"> ×{layers.length}</span> : null}. {LAYER_STORY[kind] ?? ""}
            </p>
          </li>)}
        <li class="min-w-0">
          <LayerSvg ex={ex.value} layers={ex.value.layers} label="All the layers of the stroke together" />
          <p class="mt-1 text-[15px] leading-snug">
            <strong>Together.</strong> The layers, painted in order. Flat color so far.
          </p>
        </li>
        <li class="min-w-0">
          <InkPicture drawn={whole.value} label="A stroke by the same pen with its grain laid over it, as it ships" />
          <p class="mt-1 text-[15px] leading-snug">
            <strong>As shipped.</strong> The layers are merged per material and one color-independent grain mask is laid over them (another take by the same pen).
          </p>
        </li>
      </ol>
    </div>;
  };
});
const ENDS: {
  start: "pool" | "soft";
  end: "pool" | "flick" | "soft";
  title: string;
  note: string;
}[] = [{
  start: "pool" as const,
  end: "flick" as const,
  title: "Pool, then flick" as const,
  note: "The felt tip lands and blots; the hand lifts off with a quick tapered flick. Most strokes end this way." as const
}, {
  start: "pool" as const,
  end: "pool" as const,
  title: "Pool, pool" as const,
  note: "It stops dead and the ink gathers: a dot at each end, like a period." as const
}, {
  start: "soft" as const,
  end: "soft" as const,
  title: "Soft, soft" as const,
  note: "A light touch both ways: a small blot, no flick. For small marks and tight rules." as const
}];
const Ends = defineUi<{}>("Ends", [], (_props, {
  slots: _slots
}) => {
  const drawn = computed(() => ENDS.map(e => ({
    ...e,
    drawn: drawEnds({
      pen: "ink.brush" as const,
      start: e.start,
      end: e.end,
      seed: "ends" as const
    })
  })));
  return () => {
    return <ul role="list" class="m-0 grid list-none gap-5 p-0 sm:grid-cols-3" aria-label="Three ways a stroke can start and end">
      {drawn.value.map(e => <li key={e.title} class="min-w-0">
          <InkPicture drawn={e.drawn} label={`${e.title}: a stroke that starts ${e.start} and ends ${e.end}`} />
          <p class="mt-1 text-[15px] leading-snug">
            <strong>{e.title}.</strong> {e.note}
          </p>
        </li>)}
    </ul>;
  };
});
const PenSelect = defineUi<{
  value: PenName;
  onChange: (p: PenName) => void;
}>("PenSelect", ["value", "onChange"], (_props, {
  slots: _slots
}) => {
  const value = computed(() => _props["value"]);
  const onChange = computed(() => _props["onChange"]);
  const withWeights = computed(() => (rows: readonly PenRow[]) => rows.flatMap(r => hasWeights(r.name) ? [r.name, `${r.name}.fine`, `${r.name}.brush`] : [r.name]) as PenName[]);
  const group = renderValue(() => (title: string, names: readonly PenName[]) => <NativeSelectOptGroup label={title}>
      {names.map(n => <NativeSelectOption key={n} value={n}>
          {n}
        </NativeSelectOption>)}
    </NativeSelectOptGroup>);
  return () => {
    return <div class="grid gap-1.5">
      <Label for="lab-pen" class="text-[15px] font-bold">
        Pen
      </Label>
      <NativeSelect id="lab-pen" value={value.value} onChange={e => onChange.value(e.target.value as PenName)} class="w-full">
        {group.value("Felt tips", withWeights.value(ROWS.filter(r => r.group === "felt")))}
        {group.value("Pencils", withWeights.value(ROWS.filter(r => r.group === "pencil")))}
        {group.value("Markers", ROWS.filter(r => r.group === "marker" || r.group === "accent-marker").map(r => r.name))}
        {group.value("Colored felt tips", ROWS.filter(r => r.group === "accent-felt").map(r => r.name))}
      </NativeSelect>
    </div>;
  };
});
const Lab = defineUi<{}>("Lab", [], (_props, {
  slots: _slots
}) => {
  const p = shallowRef<LabParams>(initialState(LAB_DEFAULTS));
  const setP = stateSetter(p);
  const set = computed(() => <K extends keyof LabParams,>(key: K, value: LabParams[K]) => setP(prev => ({
    ...prev,
    [key]: value
  })));
  const deferred = computed(() => p.value);
  const drawn = computed(() => drawLab(deferred.value));
  return () => {
    return <div class="grid gap-5">
      <Demo label="A line drawn live by the pen engine">
        <div class="flex justify-center py-2">
          <InkPicture drawn={drawn.value} label={`Two strokes in ${deferred.value.pen}, at speed ${deferred.value.speed} and wobble ${deferred.value.wobble}`} class="bg-paper/70" />
        </div>
      </Demo>
      <Panel title="Hold the pen differently">
        <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <PenSelect value={p.value.pen} onChange={v => set.value("pen", v)} />
          <div class="grid content-start gap-1.5">
            <p id="lab-tier" class="text-[15px] font-bold">
              Tier
            </p>
            <ToggleGroup type="single" variant="outline" size="sm" value={p.value.tier} onValueChange={v => v && set.value("tier", v as Tier)} aria-labelledby="lab-tier">
              <ToggleGroupItem value="lo">lo</ToggleGroupItem>
              <ToggleGroupItem value="hi">hi</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <SliderRow label="Speed" value={p.value.speed} min={0.4} max={2.5} step={0.05} onChange={v => set.value("speed", v)} format={v => `${v.toFixed(2)}×`} hint="Faster is thinner and drier. Slower is juicier." />
          <SliderRow label="Wobble" value={p.value.wobble} min={0} max={2.5} step={0.05} onChange={v => set.value("wobble", v)} format={v => v === 0 ? "ruler" as const : v.toFixed(2)} hint="How unsteady the hand is." />
          <SliderRow label="Width" value={p.value.width} min={0.4} max={2.5} step={0.05} onChange={v => set.value("width", v)} format={v => `${v.toFixed(2)}×`} />
          <SliderRow label="Pressure" value={p.value.pressure} min={-0.6} max={0.8} step={0.05} onChange={v => set.value("pressure", v)} format={v => v === 0 ? "even" as const : v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)} hint="Leaning in, in the middle of the stroke." />
          <SliderRow label="Dry tooth" value={p.value.dry} min={0} max={3} step={0.1} onChange={v => set.value("dry", v)} format={v => v === 0 ? "never" as const : `${v.toFixed(1)}×`} hint="How often the paper's tooth makes the line skip." />
          <div class="grid content-start gap-3">
            <div class="grid gap-1.5">
              <p id="lab-start" class="text-[15px] font-bold">
                Start
              </p>
              <ToggleGroup type="single" variant="outline" size="sm" value={p.value.start} onValueChange={v => v && set.value("start", v as LabParams["start"])} aria-labelledby="lab-start">
                <ToggleGroupItem value="pool">pool</ToggleGroupItem>
                <ToggleGroupItem value="soft">soft</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div class="grid gap-1.5">
              <p id="lab-end" class="text-[15px] font-bold">
                End
              </p>
              <ToggleGroup type="single" variant="outline" size="sm" value={p.value.end} onValueChange={v => v && set.value("end", v as LabParams["end"])} aria-labelledby="lab-end">
                <ToggleGroupItem value="pool">pool</ToggleGroupItem>
                <ToggleGroupItem value="flick">flick</ToggleGroupItem>
                <ToggleGroupItem value="soft">soft</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => set.value("seed", p.value.seed + 1)}>
            A new hand (seed {p.value.seed})
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setP(LAB_DEFAULTS)}>
            Reset
          </Button>
        </div>
      </Panel>
      <CodeBlock lang="ts" title="The line above, as code" code={labCode(deferred.value)} />
    </div>;
  };
});
const Hatches = defineUi<{}>("Hatches", [], (_props, {
  slots: _slots
}) => {
  const drawn = computed(() => ([1, 2, 3] as const).map(t => ({
    t,
    d: drawHatch(t)
  })));
  return () => {
    return <ul role="list" class="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0" aria-label="Pencil hatching in one, two and three tones">
      {drawn.value.map(({
        t,
        d
      }) => <li key={t}>
          <InkPicture drawn={d} label={`Hatching, ${t} ${t === 1 ? "tone" as const : "tones" as const}`} />
          <code class="font-mono text-[13px]">tones: {t}</code>
        </li>)}
    </ul>;
  };
});
const Crossing = defineUi<{}>("Crossing", [], (_props, {
  slots: _slots
}) => {
  const multiply = shallowRef(initialState(true));
  const setMultiply = stateSetter(multiply);
  const drawn = computed(() => drawCrossing());
  return () => {
    return <div class="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
      <div style={cssStyle({
        "--ll-blend": multiply.value ? "multiply" as const : "normal" as const
      } as UI.CSSProperties)} data-testid="crossing">
        <InkPicture drawn={drawn.value} label="A yellow highlighter swipe crossed by a blue marker stripe" class="bg-paper" />
      </div>
      <SwitchRow label="Multiply (Notebook)" checked={multiply.value} onChange={setMultiply} hint="Markers and highlighters blend with --ll-blend. Where two overlap the pigment doubles, as on paper. A dark theme sets it to normal." />
    </div>;
  };
});
const PensPage = defineUi<{}>("PensPage", [], (_props, {
  slots: _slots
}) => {
  const tier = shallowRef<Tier>(initialState("lo"));
  const setTier = stateSetter(tier);
  return () => {
    return <>
      <Section id="ribbons" title="A stroke is a ribbon, not a line">
        <Prose>
          <p>
            A normal SVG stroke is one width from end to end, which is exactly what a hand does not do. Here a pen turns a handful of points into a <strong>filled polygon</strong> whose width
            follows a speed profile: it swells where the hand slows and on the down-stroke, thins on the up-stroke, blots where it lands, skips where the paper&apos;s tooth catches it and flicks as it
            leaves. There are no filters and no blur; the texture is one color-independent grain mask laid over the ribbons.
          </p>
          <p>
            Everything is seeded. The same seed draws the same stroke on the server and in the browser; a different seed is a different hand.
          </p>
        </Prose>
        <Demo label="The same line, drawn by five pens">
          <SamePens />
        </Demo>
      </Section>

      <Section id="pen-table" title="The pen table" description="Every named pen, drawn live by the engine as this page loaded. The last column is the honest cost: the size of the markup that one stroke puts in the DOM.">
        <TierToggle tier={tier.value} onChange={setTier} />
        <Demo label="Every named pen, one sample stroke each">
          <PenTable tier={tier.value} />
        </Demo>
        <Section id="weights" level={3} title="Fine, regular, brush" description="Two weight classes give a drawing hierarchy. The fine-liner does detail; the brush does the things that matter.">
          <Demo label="Four pens in the three weight classes">
            <Weights tier={tier.value} />
          </Demo>
        </Section>
        <Section id="accents" level={3} title="Colored pens" description="Every stationery accent has a marker (m_) and a felt tip (f_). They are for decoration: stickers, washi, chart fills.">
          <Demo label="Accent markers and felt tips">
            <div class="grid gap-5">
              <PenGrid label="Accent markers" rows={ACCENT_MARKERS} tier={tier.value} />
              <PenGrid label="Accent felt tips" rows={ACCENT_FELTS} tier={tier.value} />
            </div>
          </Demo>
        </Section>
      </Section>

      <Section id="anatomy" title="How a stroke is made" description="Pick a pen and take its stroke apart into the polygons the engine paints, bottom to top.">
        <Demo label="The layers of one stroke">
          <Anatomy />
        </Demo>
        <Section id="ends" level={3} title="Pooling and flick" description="The two ends of a stroke are separate decisions, seeded per stroke unless you set them. Here the same line takes three endings.">
          <Demo label="Three starts and ends of the same stroke">
            <Ends />
          </Demo>
        </Section>
      </Section>

      <Section id="lab" title="Draw with it" description="The same engine, with its dials in reach. Speed, wobble, width, pressure and the paper's tooth are options of one call; this page never touches an SVG stroke.">
        <Lab />
      </Section>

      <Section id="hierarchy" title="Two weights make a drawing" description="With one pen for everything a drawing is flat. Put the brush on the two shapes that matter and the fine-liner on the rest and it reads at a glance.">
        <Demo label="One weight for everything, and two weights">
          <div class="grid gap-6 sm:grid-cols-2">
            <figure class="m-0">
              <InkPicture drawn={drawHierarchy("flat")} label="A small note drawn with one pen for every line" />
              <figcaption class="mt-1 text-[14.5px] text-muted-foreground">One pen for every line.</figcaption>
            </figure>
            <figure class="m-0">
              <InkPicture drawn={drawHierarchy("layered")} label="The same note with a brush pen for the title and tick and a fine pencil for the rules" />
              <figcaption class="mt-1 text-[14.5px] text-muted-foreground">Brush for the title and the tick, fine pencil for the rules.</figcaption>
            </figure>
          </div>
        </Demo>
      </Section>

      <Section id="fills" title="Fills sit in register" description="A fill is its own layer, printed in register with its line: one solid color that reaches just under the outline, so a shape reads at a glance and nothing is left unfilled.">
        <Section id="hatching" level={3} title="Hatching" description="Pencil hatching is the pattern channel: destructive buttons, disabled fills and chart series use it so meaning never rides on hue alone.">
          <Demo label="Pencil hatching in one, two and three tones">
            <Hatches />
          </Demo>
        </Section>
      </Section>

      <Section id="materials" title="Materials and grain" description={`Each material has one grain mask: ${GRAINS.join(", ")}. Each has ${MASK_VARIANTS} phase variants, so two neighbors never share the same speckle.`}>
        <Demo label="A highlighter and a marker crossing, multiplied or not">
          <Crossing />
        </Demo>
        <Prose>
          <p>
            Grain is baked once as a mask and reused for any color, so a theme never rebakes a texture. Components do not call the pen themselves: they hand a <InlineCode>defineRecipe</InlineCode>{" "}
            function a box and a seed, and it calls shapes (<InlineCode>box</InlineCode>, <InlineCode>underline</InlineCode>, <InlineCode>bandFill</InlineCode>) that call the pen. The page above
            is the only place the raw pen is on show.
          </p>
        </Prose>
        <CodeBlock lang="ts" title="A recipe, the way a component draws" code={`import { bandFill } from "@/lib/ink/fills"
import { box } from "@/lib/ink/shapes"
import { roundRectPoly } from "@/lib/ink/geom"
import { defineRecipe } from "@/lib/ink/recipes"

export const chipRecipe = defineRecipe({
  id: "chip",
  layers: ["rest"],
  pad: 12,
  draw(ink, { w, h }) {
    ink.layer("rest", () => {
      ink.part("fill", () => bandFill(ink, roundRectPoly(2, 2, w - 4, h - 4, 4), "hi"))
      box(ink, 0, 0, w, h, { pen: "ink.fine", corner: 4 })
    })
  },
})`} />
      </Section>

      <Related items={[foundation("paper", "Paper", "What all this ink dries on."), foundation("motion", "Motion", "Draw-on, boil and soak: the pen in time."), foundation("density", "Density", "Calm: hairlines, no wobble, no offset."), component("underline", "Underline", "A pen line under real words."), component("highlight", "Highlight", "The highlighter as a component."), component("sketchpad", "Sketchpad", "Draw with these pens yourself.")]} />
    </>;
  };
});
export default PensPage;
