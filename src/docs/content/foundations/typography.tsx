// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { CodeBlock, InlineCode, Prose, Section } from "@/docs/kit";
import { Blockquote, H1, H2, H3, H4, InlineCode as CodeChip, Large, Lead, Muted, P, Small } from "@/components/ui/typography";
import { Handwritten } from "@/components/ui/handwritten";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InkProvider } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
import { FONTS } from "./_shared/data.generated";
import { Demo, Panel, Related, SliderRow, SwitchRow, TableScroll, component, foundation, td, th } from "./_shared/kit";
type FaceId = "hand" | "script" | "type" | "mono";
interface Face {
  id: FaceId;
  name: string;
  cls: string;
  token: string;
  role: string;
  weights: readonly number[];
  licence: string;
  use: string;
  never: string;
  stock: "paper" | "index-card" | "receipt" | "graph";
}
const FACES: readonly Face[] = [{
  id: "hand" as const,
  name: "Kevin Sans Hand" as const,
  cls: "font-hand" as const,
  token: "--font-hand" as const,
  role: "UI text and prose" as const,
  weights: [400, 700],
  licence: "MIT" as const,
  use: "Labels, buttons, menus, body text. One even, monoline hand, set at 88 percent so a 17 px line sits in an interface like a text face." as const,
  never: "Anything below 14 px: the letters are wide and the strokes are thin." as const,
  stock: "paper" as const
}, {
  id: "script" as const,
  name: "Kevin Sans Script" as const,
  cls: "font-script" as const,
  token: "--font-script" as const,
  role: "Titles, notes and numbers" as const,
  weights: [400, 700],
  licence: "MIT" as const,
  use: "Page and card titles, margin notes, big figures. The same hand set at 75 percent, so a title keeps its line; size it up about a fifth where the hand would stand." as const,
  never: "Paragraphs. A title is lovely for a line and tiring for ten." as const,
  stock: "index-card" as const
}, {
  id: "type" as const,
  name: "Kevin Sans Type" as const,
  cls: "font-type" as const,
  token: "--font-type" as const,
  role: "Stamps, kickers and receipts" as const,
  weights: [400, 700],
  licence: "MIT" as const,
  use: "Kickers above a title, stamps, receipts, small labels in capitals. Upper case wants a little letter-spacing." as const,
  never: "Long runs of capitals: they are for a word or two." as const,
  stock: "receipt" as const
}, {
  id: "mono" as const,
  name: "IBM Plex Mono" as const,
  cls: "font-mono" as const,
  token: "--font-mono" as const,
  role: "Code, keys and values" as const,
  weights: FONTS["ibm-plex-mono"] ?? [],
  licence: "SIL OFL 1.1" as const,
  use: "Code, kbd, token names, anything that has to line up. The one face that is not handwriting, on purpose." as const,
  never: "Decoration. If it is not code or a value, it belongs to one of the other three." as const,
  stock: "graph" as const
}];
const FaceCard = defineUi<{
  face: Face;
}>("FaceCard", ["face"], (_props, {
  slots: _slots
}) => {
  const face = computed(() => _props["face"]);
  return () => {
    return <Paper as="li" stock={face.value.stock} seed={`face:${face.value.id}`} class="p-5">
      <p class="font-type text-[13px] text-pencil-text">{face.value.role}</p>
      <p class={cn(face.value.cls, "mt-1 text-5xl leading-none text-ink", face.value.id === "script" ? "font-bold" as const : "" as const)}>
        {face.value.name}
      </p>
      <p class={cn(face.value.cls, "mt-3 text-[19px] leading-snug text-ink")}>Sphinx of black quartz, judge my vow.</p>
      <p class={cn(face.value.cls, "mt-1 text-[17px] leading-snug text-ink-soft")}>Aa Bb Cc Dd Ee Ff Gg 0123456789 &amp; ? !</p>
      <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[14.5px] leading-snug">
        <dt class="text-pencil-text">Class</dt>
        <dd class="font-mono text-[13px]">{face.value.cls}</dd>
        <dt class="text-pencil-text">Token</dt>
        <dd class="font-mono text-[13px]">{face.value.token}</dd>
        <dt class="text-pencil-text">Weights</dt>
        <dd class="ll-num font-mono text-[13px]">{face.value.weights.join(", ")}</dd>
        <dt class="text-pencil-text">License</dt>
        <dd>{face.value.licence}</dd>
      </dl>
      <p class="mt-3 text-[15px] leading-snug">
        <strong>Reach for it:</strong> {face.value.use}
      </p>
      <p class="mt-1.5 text-[15px] leading-snug text-muted-foreground">
        <strong class="text-ink">Not for:</strong> {face.value.never}
      </p>
    </Paper>;
  };
});
interface ScaleRow {
  id: string;
  name: string;
  spec: string;
  sample: UI.VueNode;
}
const SCALE: readonly ScaleRow[] = [{
  id: "h1" as const,
  name: "H1" as const,
  spec: "Script 48 / 1.02, bold, hand rule" as const,
  sample: <H1 role="presentation" rule={false} seed="scale-h1">Notes on keeping a notebook</H1>
}, {
  id: "h2" as const,
  name: "H2" as const,
  spec: "Script 36 / 1.08, bold, hand rule" as const,
  sample: <H2 role="presentation" rule={false} seed="scale-h2">What goes in the margin</H2>
}, {
  id: "h3" as const,
  name: "H3" as const,
  spec: "Script 30 / 1.25, bold" as const,
  sample: <H3>A word from someone who knew</H3>
}, {
  id: "h4" as const,
  name: "H4" as const,
  spec: "Hand 20 / 1.375, bold" as const,
  sample: <H4>Small headings are in the hand</H4>
}, {
  id: "lead" as const,
  name: "Lead" as const,
  spec: "Hand 20 / 1.55, muted" as const,
  sample: <Lead>A notebook is a small argument you have with yourself.</Lead>
}, {
  id: "p" as const,
  name: "P" as const,
  spec: "Hand 17 / 1.7" as const,
  sample: <P>Most of what I remember from a book is in the margins: an arrow, a question mark, a small argument with a dead author.</P>
}, {
  id: "large" as const,
  name: "Large" as const,
  spec: "Hand 18, bold" as const,
  sample: <Large>Large is for the line that matters</Large>
}, {
  id: "small" as const,
  name: "Small" as const,
  spec: "Hand 14, bold" as const,
  sample: <Small>Small print, still 14</Small>
}, {
  id: "muted" as const,
  name: "Muted" as const,
  spec: "Hand 14, muted ink" as const,
  sample: <Muted>Dates, captions and the second line of a list.</Muted>
}, {
  id: "code" as const,
  name: "InlineCode" as const,
  spec: "Plex Mono .85em, paper-shade chip" as const,
  sample: <span>Run <CodeChip>npm run notes</CodeChip> to see it.</span>
}, {
  id: "quote" as const,
  name: "Blockquote" as const,
  spec: "Script 24 / 1.35, marker rule" as const,
  sample: <Blockquote class="mt-0">The best time to write it down was when it happened.</Blockquote>
}];
const Scale = defineUi<{}>("Scale", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" tilt={false} class="p-4 sm:p-6">
      <div>
        {SCALE.map(row => <div key={row.id} class="grid gap-x-6 gap-y-1 border-b border-line-soft py-4 last:border-b-0 sm:grid-cols-[11rem_1fr]">
            <div>
              <p class="font-mono text-sm font-medium">{row.name}</p>
              <p class="text-[14px] leading-snug text-pencil-text">{row.spec}</p>
            </div>
            <div class="min-w-0">{row.sample}</div>
          </div>)}
      </div>
    </Paper>;
  };
});
const InkRoom = defineUi<{}>("InkRoom", [], (_props, {
  slots: _slots
}) => {
  const size = shallowRef(initialState(56));
  const setSize = stateSetter(size);
  const face = shallowRef<"hand" | "script">(initialState("script"));
  const setFace = stateSetter(face);
  const box = computed(() => "inline-block overflow-hidden bg-hi/50 leading-tight whitespace-nowrap outline-1 outline-dashed outline-ink/60");
  const font = computed<UI.CSSProperties>(() => ({
    fontSize: size.value,
    fontFamily: face.value === "hand" ? "var(--font-hand)" as const : "var(--font-script)" as const,
    fontWeight: 700
  }));
  return () => {
    return <div class="grid gap-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <SliderRow label="Zoom the type" value={size.value} min={17} max={96} onChange={setSize} format={v => `${v} px`} />
        <div class="grid gap-1.5">
          <p id="ink-room-face" class="text-[15px] font-bold">
            Face
          </p>
          <ToggleGroup type="single" variant="outline" size="sm" value={face.value} onValueChange={v => v && setFace(v as "hand" | "script")} aria-labelledby="ink-room-face">
            <ToggleGroupItem value="script">Script</ToggleGroupItem>
            <ToggleGroupItem value="hand">Hand</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <figure class="m-0 grid gap-2">
          <div class="min-h-24 overflow-x-auto py-3 ps-2">
            <span class={box.value} style={cssStyle(font.value)} data-testid="ink-room-clipped">
              Lovely stuff
            </span>
          </div>
          <figcaption class="text-[14.5px] leading-snug text-muted-foreground">
            A clipped label, as it comes: the box is exactly as wide as the letters&apos; advance widths, so the last one loses its overhang.
          </figcaption>
        </figure>
        <figure class="m-0 grid gap-2">
          <div class="min-h-24 overflow-x-auto py-3 ps-2">
            <span class={cn(box.value, "ll-ink-room")} style={cssStyle(font.value)} data-testid="ink-room-roomy">
              Lovely stuff
            </span>
          </div>
          <figcaption class="text-[14.5px] leading-snug text-muted-foreground">
            With <InlineCode>ll-ink-room</InlineCode>: 0.2 em of room at the end, given back with a negative margin, so the layout does not move.
          </figcaption>
        </figure>
      </div>
    </div>;
  };
});
type Density = "comfortable" | "compact" | "calm";
const Jitter = defineUi<{}>("Jitter", [], (_props, {
  slots: _slots
}) => {
  const density = shallowRef<Density>(initialState("comfortable"));
  const setDensity = stateSetter(density);
  const strength = shallowRef(initialState(1));
  const setStrength = stateSetter(strength);
  const reduced = shallowRef(initialState(false));
  const setReduced = stateSetter(reduced);
  return () => {
    return <div class="grid gap-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <SliderRow label="Strength" value={strength.value} min={0} max={2} step={0.1} onChange={setStrength} format={v => v === 0 ? "off" as const : `${v.toFixed(1)}×`} hint="The strength prop: 1 is the default hand, 2 a hurried one." />
        <div class="grid content-start gap-1.5">
          <p id="jitter-density" class="text-[15px] font-bold">
            Density around it
          </p>
          <ToggleGroup type="single" variant="outline" size="sm" spacing={1} class="flex-wrap" value={density.value} onValueChange={v => v && setDensity(v as Density)} aria-labelledby="jitter-density">
            <ToggleGroupItem value="comfortable">comfortable</ToggleGroupItem>
            <ToggleGroupItem value="compact">compact</ToggleGroupItem>
            <ToggleGroupItem value="calm">calm</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <SwitchRow label="Reduced motion" checked={reduced.value} onChange={setReduced} hint="Jitter is decoration, so a person who asked for less motion gets straight words." />
      <InkProvider density={density.value} motion={reduced.value ? "reduced" as const : "system" as const} defs={false}>
        <Paper stock="index-card" tilt={false} class="px-5 py-4">
          <Handwritten as="p" strength={strength.value} seed="jitter-demo" class="font-script text-3xl leading-snug text-ink" data-testid="jitter-text">
            ask sam about the pond, and bring the big umbrella!
          </Handwritten>
        </Paper>
      </InkProvider>
    </div>;
  };
});
const Floors = defineUi<{}>("Floors", [], (_props, {
  slots: _slots
}) => {
  const sizes = computed(() => [12, 13, 14, 15, 16, 17, 18]);
  return () => {
    return <div class="grid gap-5 @container">
      <div class="grid gap-5 @2xl:grid-cols-2">
        <Paper stock="paper" tilt={false} class="p-4">
          <p class="font-type text-[13px] text-pencil-text">Kevin Sans Hand, one size per line</p>
          <ul role="list" class="m-0 mt-2 grid list-none gap-1 p-0">
            {sizes.value.map(s => <li key={s} class={cn("font-hand text-ink", s < 14 && "text-pencil-text")} style={cssStyle({
              fontSize: s
            })}>
                {s} px — {s < 14 ? "too small for a label" as const : s === 14 ? "the floor for labels" as const : s === 16 ? "the floor for input text on touch" as const : "the quick brown fox" as const}
              </li>)}
          </ul>
        </Paper>
        <Paper stock="paper" tilt={false} class="p-4">
          <p class="font-type text-[13px] text-pencil-text">Equal visual size</p>
          <div class="mt-2 grid gap-2 text-ink">
            <p class="font-hand text-[16px] leading-snug">Hand 16 px: the reference.</p>
            <p class="font-script text-[16px] leading-snug">Script 16 px: visibly smaller.</p>
            <p class="font-script text-[20px] leading-snug">Script 20 px: about the same as Hand 16.</p>
          </div>
          <p class="mt-3 text-[14.5px] leading-snug text-muted-foreground">The script role is set smaller (75 percent against 88). Size it up about a fifth (×1.2) when it stands where the hand would.</p>
        </Paper>
      </div>
      <TableScroll label="Type size floors">
        <table class="w-full min-w-[26rem] border-collapse text-[15px]">
          <caption class="sr-only">The smallest size each kind of text may use</caption>
          <thead>
            <tr>
              <th scope="col" class={th}>Text</th>
              <th scope="col" class={th}>Floor</th>
              <th scope="col" class={th}>Why</th>
            </tr>
          </thead>
          <tbody>
            {[["Labels and buttons", "14 px", "Kevin Sans runs wide for its size, and its thin strokes disappear below this."], ["Input text on touch", "16 px", "Anything smaller makes iOS zoom the page when the field is focused."], ["Chart axes and ticks", "12 px", "A smaller size is allowed here, and only for numbers."], ["Code, token names and captions", "12 px", "Plex Mono has a large x-height and even strokes, so it holds up smaller than the hands. Never for a label or a button."], ["Hit targets", "24 px", "The DOM box, not the drawing. The drawing may be smaller than the target, never larger."]].map(([text, floor, why]) => <tr key={text}>
                <th scope="row" class={cn(td, "text-start font-bold")}>{text}</th>
                <td class={cn(td, "ll-num font-mono whitespace-nowrap")}>{floor}</td>
                <td class={td}>{why}</td>
              </tr>)}
          </tbody>
        </table>
      </TableScroll>
    </div>;
  };
});
const AMOUNTS = ["1,284.50", "640.00", "17.25", "1,111.11", "8.00"];
const COLUMNS = [{
  cls: "font-hand" as const,
  label: "Hand" as const,
  note: "equal: every figure is 0.74 em, so the decimal points line up" as const
}, {
  cls: "font-script font-bold" as const,
  label: "Script bold" as const,
  note: "equal too: bold figures share one width" as const
}, {
  cls: "font-type" as const,
  label: "Type" as const,
  note: "equal: ready for receipts" as const
}, {
  cls: "font-mono" as const,
  label: "Plex Mono" as const,
  note: "monospaced" as const
}] as const;
const Numbers = defineUi<{}>("Numbers", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-4 sm:grid-cols-2">
      {COLUMNS.map(c => <Paper key={c.label} stock="receipt" tilt={false} class="px-5 py-5">
          <p class="font-type text-[13px] text-pencil-text">{c.label}</p>
          <ul role="list" class={cn("m-0 mt-2 grid list-none gap-0.5 p-0 text-3xl leading-tight text-ink ll-num", c.cls)}>
            {AMOUNTS.map(a => <li key={a} class="text-end">
                {a}
              </li>)}
          </ul>
          <p class="mt-2 text-[14.5px] leading-snug text-muted-foreground">{c.note}</p>
        </Paper>)}
    </div>;
  };
});
const RISO = [{
  label: "marker" as const,
  value: "var(--ll-marker)" as const
}, {
  label: "blue felt" as const,
  value: "var(--ll-ink-you)" as const
}, {
  label: "red pencil" as const,
  value: "var(--ll-red)" as const
}, {
  label: "teal" as const,
  value: "var(--ll-teal)" as const
}];
const Riso = defineUi<{}>("Riso", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-end gap-x-8 gap-y-4" role="group" aria-label="Four titles with a riso offset">
      {RISO.map(r => <div key={r.label}>
          <p class="ll-riso font-script text-6xl leading-none font-bold text-ink" style={cssStyle({
          "--ll-riso": r.value
        } as UI.CSSProperties)}>
            Looseleaf
          </p>
          <p class="mt-2 font-mono text-[13px] text-pencil-text">--ll-riso: {r.label}</p>
        </div>)}
    </div>;
  };
});
const WEIGHT_CLASS: Record<number, string> = {
  400: "font-normal" as const,
  500: "font-medium" as const,
  600: "font-semibold" as const,
  700: "font-bold" as const
};
function nearest(weights: readonly number[], want: number): number {
  return weights.reduce((best, w) => Math.abs(w - want) < Math.abs(best - want) ? w : best, weights[0] ?? 400);
}
const Tester = defineUi<{}>("Tester", [], (_props, {
  slots: _slots
}) => {
  const text = shallowRef(initialState("Pencil, ink and a little tea."));
  const setText = stateSetter(text);
  const faceId = shallowRef<FaceId>(initialState("script"));
  const setFaceId = stateSetter(faceId);
  const size = shallowRef(initialState(40));
  const setSize = stateSetter(size);
  const weight = shallowRef(initialState(700));
  const setWeight = stateSetter(weight);
  const leading = shallowRef(initialState(1.25));
  const setLeading = stateSetter(leading);
  const tracking = shallowRef(initialState(0));
  const setTracking = stateSetter(tracking);
  const riso = shallowRef(initialState(false));
  const setRiso = stateSetter(riso);
  const jitter = shallowRef(initialState(false));
  const setJitter = stateSetter(jitter);
  const face = computed(() => FACES.find(f => f.id === faceId.value)!);
  const w = computed(() => nearest(face.value.weights, weight.value));
  const style = computed<UI.CSSProperties>(() => ({
    fontFamily: `var(${face.value.token})`,
    fontSize: size.value,
    fontWeight: w.value,
    lineHeight: leading.value,
    letterSpacing: `${tracking.value}em`
  }));
  const classes = computed(() => [face.value.cls, `text-[${size.value}px]`, `leading-[${leading.value}]`, WEIGHT_CLASS[w.value] ?? `font-[${w.value}]`, tracking.value !== 0 ? `tracking-[${tracking.value}em]` : "" as const, riso.value ? "ll-riso" as const : "" as const, "text-ink"].filter(Boolean));
  const Tag = computed(() => jitter.value ? "Handwritten" as const : "p" as const);
  const words = computed(() => text.value.replace(/\n/g, " "));
  const child = computed(() => /[{}<>]/.test(words.value) ? `{${JSON.stringify(words.value)}}` : words.value);
  const code = computed(() => `<${Tag.value}${jitter.value ? ' as="p"' as const : "" as const} className="${classes.value.join(" ")}">\n  ${child.value}\n</${Tag.value}>`);
  return () => {
    return <div class="grid gap-5">
      <div class="grid gap-5 @container">
        <div class="grid gap-4">
          <div class="grid gap-1.5">
            <Label for="tester-text" class="text-[15px] font-bold">
              Your words
            </Label>
            <Textarea id="tester-text" value={text.value} onChange={(e: Event) => setText((e.target as HTMLTextAreaElement).value)} rows={2} maxlength={160} />
          </div>
          <div class="grid gap-1.5">
            <p id="tester-face" class="text-[15px] font-bold">
              Face
            </p>
            <ToggleGroup type="single" variant="outline" size="sm" spacing={1} class="flex-wrap" value={faceId.value} onValueChange={v => {
              if (!v) return;
              const next = FACES.find(f => f.id === v)!;
              setFaceId(v as FaceId);
              setWeight(nearest(next.weights, weight.value));
            }} aria-labelledby="tester-face">
              {FACES.map(f => <ToggleGroupItem key={f.id} value={f.id}>
                  {f.name}
                </ToggleGroupItem>)}
            </ToggleGroup>
          </div>
          <div class="grid gap-x-6 gap-y-4 @lg:grid-cols-2">
            <SliderRow label="Size" value={size.value} min={12} max={96} onChange={setSize} format={v => `${v} px`} />
            <SliderRow label="Line height" value={leading.value} min={1} max={2} step={0.05} onChange={setLeading} format={v => v.toFixed(2)} />
            <SliderRow label="Letter spacing" value={tracking.value} min={-0.05} max={0.2} step={0.01} onChange={setTracking} format={v => `${v.toFixed(2)} em`} />
            <div class="grid gap-1.5">
              <p id="tester-weight" class="text-[15px] font-bold">
                Weight
              </p>
              {face.value.weights.length > 1 ? <ToggleGroup type="single" variant="outline" size="sm" value={String(w.value)} onValueChange={v => v && setWeight(Number(v))} aria-labelledby="tester-weight">
                  {face.value.weights.map(x => <ToggleGroupItem key={x} value={String(x)}>
                      {x}
                    </ToggleGroupItem>)}
                </ToggleGroup> : <p class="text-[14.5px] text-muted-foreground">
                  {face.value.name} has one weight ({face.value.weights[0]}). A browser would smear a bold, so there is nothing to choose.
                </p>}
            </div>
          </div>
          <div class="flex flex-wrap gap-x-8 gap-y-3">
            <SwitchRow label="Riso offset" checked={riso.value} onChange={setRiso} />
            <SwitchRow label="Hand jitter" checked={jitter.value} onChange={setJitter} />
          </div>
        </div>
      </div>
      <Paper stock="paper" tilt={false} class="min-h-40 overflow-x-auto px-6 py-6">
        {jitter.value ? <Handwritten as="p" seed="tester" style={cssStyle(style.value)} class={cn("text-ink", riso.value && "ll-riso")} data-testid="tester-preview">
            {text.value || " "}
          </Handwritten> : <p style={cssStyle(style.value)} class={cn("text-ink", riso.value && "ll-riso")} data-testid="tester-preview">
            {text.value || " "}
          </p>}
      </Paper>
      <CodeBlock lang="tsx" title="The same line in your code" code={code.value} />
    </div>;
  };
});
const TypographyPage = defineUi<{}>("TypographyPage", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <>
      <Section id="faces" title="Four faces, one page" description="Three hands and one typewriter. Every word is real text on a real baseline: nothing on this page is an image of writing.">
        <ul role="list" aria-label="The four typefaces" class="m-0 grid list-none gap-6 p-1 md:grid-cols-2">
          {FACES.map(f => <FaceCard key={f.id} face={f} />)}
        </ul>
        <Prose>
          <p>
            The fonts come from Fontsource, so nothing loads from a third-party server. The registry ships the same four families as font items; a site that installs Looseleaf gets them without
            touching a stylesheet.
          </p>
        </Prose>
      </Section>

      <Section id="scale" title="The scale" description="Eleven steps, all of them components in typography.tsx. Body text is 17 px in the hand; titles are in the script role, sized up to match.">
        <Demo label="The type scale, set in the real components">
          <Scale />
        </Demo>
        <Prose>
          <p>
            Headings balance their lines and paragraphs use <InlineCode>text-wrap: pretty</InlineCode>, both set once in the base layer. The h1 and h2 rules under a title are three different
            hand-drawn masks, chosen by seed, so two headings on a page never carry the same line.
          </p>
        </Prose>
      </Section>

      <Section id="pitfalls" title="Handwriting has manners" description="A hand font is not a neutral font with a wobble. Three things go wrong if you treat it like one.">
        <Section id="ink-room" level={3} title="Ink room" description="Handwriting overhangs its advance width by a pixel or three. Anything that clips text (a pill, an ellipsis, a tab) needs a little room at the end.">
          <Demo label="A clipped label with and without ink room">
            <InkRoom />
          </Demo>
        </Section>
        <Section id="jitter" level={3} title="Jitter" description="Every word sits a hair off the baseline by a seeded amount, like a line written quickly. It is for notes, captions and titles, never for long reading.">
          <Demo label="Per-word jitter under different densities">
            <Jitter />
          </Demo>
          <Prose>
            <p>
              The words stay ordinary inline text, so the line wraps, selects, copies and reads aloud as usual. Calm density and reduced motion both set <InlineCode>--ll-jitter-k</InlineCode> to
              zero and the words straighten.
            </p>
          </Prose>
        </Section>
        <Section id="sizes" level={3} title="Sizes and floors">
          <Demo label="Type size floors and equal visual size">
            <Floors />
          </Demo>
        </Section>
      </Section>

      <Section id="numbers" title="Numbers" description="Prices, tallies and stats have to line up. Which face you set them in decides whether they do.">
        <Demo label="The same column of amounts in four faces, right-aligned, each with ll-num">
          <Numbers />
        </Demo>
        <Prose>
          <p>
            <InlineCode>ll-num</InlineCode> asks the font for tabular, lining figures (<InlineCode>font-variant-numeric: tabular-nums lining-nums</InlineCode>). Kevin Sans
            does not need the features: its figures are drawn to one width, so columns of money line up in any role. Plex Mono is monospaced. Right-align a column, and keep the class on so a
            theme with a different face is covered.
          </p>
        </Prose>
      </Section>

      <Section id="riso" title="Riso titles" description="A display title can be printed slightly off register, as if a second color went through the press. It is one text-shadow, so the words stay text.">
        <Demo label="ll-riso in four colors">
          <Riso />
        </Demo>
        <Prose>
          <p>
            Set <InlineCode>--ll-riso</InlineCode> on a title or a whole section to change the second color. The offset is multiplied by the misregistration knob, so calm density prints it
            dead on.
          </p>
        </Prose>
      </Section>

      <Section id="tester" title="Try your own words" description="Set a line, then copy the classes. The preview uses inline styles (Tailwind cannot invent a class at runtime); the code below is what you would write.">
        <Panel>
          <Tester />
        </Panel>
      </Section>

      <Related items={[foundation("color", "Color", "Which ink each piece of text is written in."), foundation("density", "Density", "Where jitter and the wobble switch off."), foundation("motion", "Motion", "Soak, the way new text arrives."), component("typography", "Typography", "The components in the scale, with props."), component("handwritten", "Handwritten", "Per-word jitter as a component.")]} />
    </>;
  };
});
export default TypographyPage;
