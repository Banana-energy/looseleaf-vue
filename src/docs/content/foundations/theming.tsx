// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { useAnnounce } from "@/docs/core/announcer";
import { copyText } from "@/docs/core/hooks";
import { Callout, CodeBlock, InlineCode, Prose, Section } from "@/docs/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatRatio } from "./_shared/colour-math";
import { CONTRAST, FOREST, KNOBS as KNOB_ROWS, PALETTE } from "./_shared/data.generated";
import { Demo, Panel, Related, SliderRow, TableScroll, Verdict, component, foundation, td, th } from "./_shared/kit";
import { ThemePreview } from "./_shared/theme-preview";
import { EMPTY_THEME, KNOBS, TOKEN_GROUPS, clearColour, colourOf, evaluatePairs, forestAfter, normaliseHex, problemsByToken, setColour, setKnob, setShade, shadeHex, themeCss, type LivePair, type ThemeState, type TokenSpec } from "./_shared/theme-model";
interface RowProps {
  spec: TokenSpec;
  value: string;
  changed: boolean;
  failing: LivePair[];
  onChange: (hex: string) => void;
  onReset?: () => void;
  resetLabel?: string;
}
const ColourRow = defineUi<RowProps>("ColourRow", ["spec", "value", "changed", "failing", "onChange", "onReset", "resetLabel"], (_props, {
  slots: _slots
}) => {
  const spec = computed(() => _props["spec"]);
  const value = computed(() => _props["value"]);
  const changed = computed(() => _props["changed"]);
  const failing = computed(() => _props["failing"]);
  const onChange = computed(() => _props["onChange"]);
  const onReset = computed(() => _props["onReset"]);
  const resetLabel = computed(() => _props["resetLabel"]);
  const id = useId();
  const draft = shallowRef<string | null>(initialState(null));
  const setDraft = stateSetter(draft);
  const shown = computed(() => draft.value ?? value.value);
  const invalid = computed(() => draft.value !== null && normaliseHex(draft.value) === null);
  return () => {
    return <li class="flex items-center gap-2.5 border-b border-line-soft py-1.5 last:border-b-0">
      <input type="color" aria-label={`${spec.value.label}: pick a color`} value={value.value} onChange={(e: Event) => {
        setDraft(null);
        onChange.value((e.target as HTMLInputElement).value);
      }} class="size-8 shrink-0 cursor-pointer border-[1.5px] border-ink/60 bg-transparent p-0.5" />
      <div class="min-w-0 flex-1">
        <Label for={id} class="block text-[14.5px] leading-tight font-bold">
          {spec.value.label}
          {changed.value ? <span class="ms-1.5 font-type text-[12.5px] font-normal text-orange-text">edited</span> : null}
        </Label>
        <span class="block text-[14px] leading-snug text-pencil-text">{spec.value.note}</span>
      </div>
      {failing.value.length ? <span class="font-type text-[13px] text-red" title={`Breaks: ${failing.value.map(p => p.row.purpose).join("; ")}`} data-testid={`problems-${spec.value.token}`}>
          <span aria-hidden="true">!</span>
          <span class="sr-only">breaks {failing.value.length} contrast {failing.value.length === 1 ? "pair" as const : "pairs" as const}</span> {failing.value.length}
        </span> : null}
      <input id={id} type="text" inputmode="text" spellcheck={false} autocomplete="off" value={shown.value} aria-invalid={invalid.value || undefined} onChange={(e: Event) => {
        setDraft((e.target as HTMLInputElement).value);
        const hex = normaliseHex((e.target as HTMLInputElement).value);
        if (hex) onChange.value(hex);
      }} onBlur={() => setDraft(null)} class={cn("w-[5.75rem] shrink-0 border-0 border-b-[1.5px] border-dashed border-pencil-mark bg-transparent px-1 py-0.5 font-mono text-[13.5px] text-ink-you aria-invalid:border-red aria-invalid:text-red")} />
      {onReset.value ? <button type="button" onClick={onReset.value} aria-label={`${resetLabel.value ?? "reset"} ${spec.value.label}`} class="inline-flex min-h-6 shrink-0 items-center px-1 text-[14px] text-ink-you underline underline-offset-2">
          {resetLabel.value ?? "reset"}
        </button> : null}
    </li>;
  };
});
const PairTable = defineUi<{
  pairs: readonly LivePair[];
  label: string;
}>("PairTable", ["pairs", "label"], (_props, {
  slots: _slots
}) => {
  const pairs = computed(() => _props["pairs"]);
  const label = computed(() => _props["label"]);
  return () => {
    return <TableScroll label={label.value}>
      <table class="w-full min-w-[34rem] border-collapse text-[15px]">
        <caption class="sr-only">{label.value}</caption>
        <thead>
          <tr>
            <th scope="col" class={th}>Sample</th>
            <th scope="col" class={th}>Ratio</th>
            <th scope="col" class={th}>Needs</th>
            <th scope="col" class={th}>Result</th>
            <th scope="col" class={th}>What it protects</th>
          </tr>
        </thead>
        <tbody>
          {pairs.value.map((p, i) => <tr key={`${p.row.fg}|${p.row.bg}|${i}`}>
              <td class={td}>
                <span class="inline-block min-w-12 border border-ink/40 px-2 py-0.5 text-center font-bold" style={cssStyle({
                background: p.bgHex,
                color: p.fgHex
              })}>
                  Aa
                </span>
              </td>
              <td class={cn(td, "ll-num font-mono text-[13.5px] whitespace-nowrap")}>{formatRatio(p.ratio)}</td>
              <td class={cn(td, "ll-num font-mono text-[13.5px]")}>{p.row.min}</td>
              <td class={td}>{p.status === "ok" ? <Verdict kind="ok">ok</Verdict> : p.status === "warn" ? <Verdict kind="info">info</Verdict> : <Verdict kind="fail">fail</Verdict>}</td>
              <td class={cn(td, "min-w-52 text-[14.5px]")}>
                {p.row.purpose}
                <span class="mt-0.5 block font-mono text-[12px] text-pencil-text">{p.tokens.join(", ")}</span>
              </td>
            </tr>)}
        </tbody>
      </table>
    </TableScroll>;
  };
});
const ContrastPanel = defineUi<{
  pairs: readonly LivePair[];
}>("ContrastPanel", ["pairs"], (_props, {
  slots: _slots
}) => {
  const pairs = computed(() => _props["pairs"]);
  const failing = computed(() => pairs.value.filter(p => p.status === "fail"));
  const info = computed(() => pairs.value.filter(p => p.status === "warn").length);
  return () => {
    return <div class="grid gap-3">
      <p role="status" class="font-script text-2xl leading-tight font-bold" data-testid="contrast-summary">
        {failing.value.length === 0 ? `All ${pairs.value.length} pairs hold.` : `${failing.value.length} of ${pairs.value.length} pairs fail.`}
        <span class="ms-3 font-hand text-[15px] font-normal text-muted-foreground">{info.value} carry a note.</span>
      </p>
      {pairs.value.length < CONTRAST.length ? <p class="text-[14.5px] text-muted-foreground">
          {CONTRAST.length - pairs.value.length} of the build&apos;s {CONTRAST.length} pairs are not recomputed here: selected text on the highlighter swipe needs the browser to flatten a translucent color.
        </p> : null}
      {failing.value.length ? <PairTable pairs={failing.value} label="Contrast pairs that fail in the edited theme" /> : <p class="text-[15px] text-muted-foreground">Nothing to fix. Try pushing the marker toward the paper.</p>}
      <details class="border-[1.5px] border-line-soft px-3 py-2">
        <summary class="cursor-pointer text-[15px] font-bold">Every pair ({pairs.value.length})</summary>
        <div class="mt-2">
          <PairTable pairs={pairs.value} label="Every contrast pair for the edited theme" />
        </div>
      </details>
    </div>;
  };
});
function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "my-theme";
}
const Editor = defineUi<{
  state: ThemeState;
  setState: (fn: (s: ThemeState) => ThemeState) => void;
}>("Editor", ["state", "setState"], (_props, {
  slots: _slots
}) => {
  const state = computed(() => _props["state"]);
  const setState = computed(() => _props["setState"]);
  const announce = useAnnounce();
  const nameId = useId();
  const name = shallowRef(initialState("my-theme"));
  const setName = stateSetter(name);
  const pairs = computed(() => evaluatePairs(state.value));
  const problems = computed(() => problemsByToken(pairs.value));
  const css = computed(() => themeCss(slug(name.value), state.value));
  const changed = computed(() => Object.keys(state.value.colours).length + KNOBS.filter(k => state.value.knobs[k.token] !== EMPTY_THEME.knobs[k.token]).length);
  return () => {
    return <div class="grid gap-6" id="editor-body">
      <div class="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setState.value(() => EMPTY_THEME)}>
          Back to Notebook
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setState.value(() => forestAfter(FOREST.steps.length))}>
          Load the finished forest
        </Button>
        <span class="text-[14.5px] text-muted-foreground" role="status" data-testid="changed-count">
          {changed.value === 0 ? "Notebook, untouched." as const : `${changed.value} ${changed.value === 1 ? "value" as const : "values" as const} changed.`}
        </span>
      </div>

      <div class="@container">
        <div class="grid items-start gap-6 @2xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div class="min-w-0 @2xl:top-20 @2xl:[@media(min-height:52rem)]:sticky">
            <ThemePreview state={state.value} seed="edit" label="Live preview of the edited theme" />
          </div>
          <div class="grid min-w-0 gap-4">
            {TOKEN_GROUPS.map(g => <details key={g.id} open={g.essential} class="border-[1.5px] border-line-soft px-3 py-2">
                <summary class="cursor-pointer text-[16px] font-bold">
                  {g.title} <span class="font-normal text-muted-foreground">({g.tokens.length})</span>
                </summary>
                <ul role="list" aria-label={g.title} class="m-0 mt-1 list-none p-0">
                  {g.tokens.map(spec => {
                  const isChart = spec.token === "--chart-1";
                  return <ColourRow key={spec.token} spec={spec} value={colourOf(state.value, spec.token)} changed={spec.token in state.value.colours} failing={problems.value.get(spec.token) ?? []} onChange={hex => setState.value(s => setColour(s, spec.token, hex))} onReset={spec.token in state.value.colours ? () => setState.value(s => clearColour(s, spec.token)) : undefined} resetLabel={isChart ? "follow marker" as const : "reset" as const} />;
                })}
                  {g.id === "table" ? <ColourRow spec={{
                  token: "--ll-shade" as const,
                  label: "Shadow color" as const,
                  note: "umber in Notebook; the triplet behind every shadow" as const
                }} value={shadeHex(state.value)} changed={"--ll-shade" in state.value.colours} failing={[]} onChange={hex => setState.value(s => setShade(s, hex))} onReset={"--ll-shade" in state.value.colours ? () => setState.value(s => clearColour(s, "--ll-shade")) : undefined} /> : null}
                </ul>
              </details>)}
            <Panel title="Recipe knobs">
              <div class="grid gap-4">
                {KNOBS.map(k => <SliderRow key={k.token} label={k.label} value={state.value.knobs[k.token] ?? EMPTY_THEME.knobs[k.token]!} min={k.min} max={k.max} step={k.step} onChange={v => setState.value(s => setKnob(s, k.token, v))} format={v => `${Number(v.toFixed(2))}${k.unit}`} hint={k.note} />)}
              </div>
            </Panel>
          </div>
        </div>
      </div>

      <Section id="contrast-live" level={3} title="Does it still read?" description="The same math as the build's checker, run on your edits. Every pair the stylesheet's record can recompute from the palette is here.">
        <ContrastPanel pairs={pairs.value} />
      </Section>

      <Section id="theme-css" level={3} title="Your block">
        <div class="grid gap-3">
          <div class="grid max-w-sm gap-1.5">
            <Label for={nameId} class="text-[15px] font-bold">
              Theme name
            </Label>
            <Input id={nameId} value={name.value} onChange={(e: Event) => setName((e.target as HTMLInputElement).value)} />
          </div>
          <CodeBlock lang="css" title="Only what you changed" code={css.value} />
          <div>
            <Button variant="secondary" size="sm" onClick={async () => {
              announce.value((await copyText(css.value)) ? "Copied the theme block" as const : "Copying was blocked. Select the block above and copy it by hand" as const);
            }}>
              Copy the block
            </Button>
          </div>
        </div>
      </Section>
    </div>;
  };
});
const TOKEN_LABEL = new Map(TOKEN_GROUPS.flatMap(g => g.tokens).map(t => [t.token, t.label]));
const DeclChips = defineUi<{
  decls: Record<string, string>;
}>("DeclChips", ["decls"], (_props, {
  slots: _slots
}) => {
  const decls = computed(() => _props["decls"]);
  return () => {
    return <ul role="list" aria-label="What this step sets" class="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
      {Object.entries(decls.value).map(([token, value]) => <li key={token} class="inline-flex items-center gap-1.5 text-[14px]">
          {/^#/.test(value) ? <span aria-hidden="true" class="inline-block size-4 border border-ink/50" style={cssStyle({
          background: value
        })} /> : null}
          <span>{TOKEN_LABEL.get(token) ?? token}</span>
          <code class="font-mono text-[12.5px] text-pencil-text">{value}</code>
        </li>)}
    </ul>;
  };
});
const Walkthrough = defineUi<{
  onShow: (count: number) => void;
}>("Walkthrough", ["onShow"], (_props, {
  slots: _slots
}) => {
  const onShow = computed(() => _props["onShow"]);
  return () => {
    return <ol class="m-0 grid list-none gap-7 p-0" aria-label="The steps from an empty slot to a finished theme">
      <li class="grid gap-2">
        <h3 class="m-0 font-script text-2xl leading-tight font-bold">1. Start from the slot</h3>
        <p class="max-w-2xl text-[16px] leading-snug">
          The stylesheet already has an empty <InlineCode>[data-theme=&quot;forest&quot;]</InlineCode> block waiting. Nothing is inside it yet, so the theme and Notebook are the same thing. Roles, shadows, gradients,
          syntax colors, selection and focus all recompute from whatever you put in there; you never touch a component.
        </p>
        <CodeBlock lang="css" title="looseleaf.css" code={`[data-theme="forest"] {\n}`} copy={false} />
      </li>
      {FOREST.steps.map((step, i) => <li key={step.id} class="grid gap-2" data-testid={`step-${step.id}`}>
          <h3 class="m-0 font-script text-2xl leading-tight font-bold">
            {i + 2}. {step.title}
          </h3>
          <p class="max-w-2xl text-[16px] leading-snug">{step.note}</p>
          <DeclChips decls={step.decls} />
          <p class="text-[15px]" data-testid={`check-${step.id}`}>
            The checker now says:{" "}
            {step.check.fails.length === 0 ? <strong class="text-green">all {step.check.pairs} pairs hold.</strong> : <strong class="text-red">
                {step.check.fails.length} of {step.check.pairs} pairs fail.
              </strong>}
          </p>
          {step.check.fails.length ? <ul role="list" aria-label={`Pairs that fail after ${step.title}`} class="m-0 grid list-none gap-0.5 p-0 text-[14px]">
              {step.check.fails.slice(0, 4).map((f, j) => <li key={j} class="flex flex-wrap items-baseline gap-x-2">
                  <span class="ll-num font-mono text-[13px] text-red">{formatRatio(f.ratio)}</span>
                  <span class="text-muted-foreground">needs {f.min}:</span>
                  <span>{f.purpose}</span>
                </li>)}
              {step.check.fails.length > 4 ? <li class="text-muted-foreground">…and {step.check.fails.length - 4} more.</li> : null}
            </ul> : null}
          <div>
            <Button variant="outline" size="sm" onClick={() => onShow.value(i + 1)} aria-label={`Show steps 1–${i + 2} in the editor (${step.title})`}>
              Show steps 1–{i + 2} in the editor
            </Button>
          </div>
        </li>)}
      <li class="grid gap-2" data-testid="step-knobs">
        <h3 class="m-0 font-script text-2xl leading-tight font-bold">{FOREST.steps.length + 2}. The parts that are not CSS</h3>
        <p class="max-w-2xl text-[16px] leading-snug">
          Two of forest&apos;s choices are not colors. The hand is a little steadier (<InlineCode>--ll-wobble: {FOREST.knobs.wobble}</InlineCode>, which is a knob, so it lives in the block), and its sheets are
          deckled instead of cut. An edge profile is not a variable: it is a prop, so a theme sets it once in a wrapper (or in the recipe object it passes the provider) and nobody repeats it.
        </p>
        <CodeBlock lang="tsx" title="components/forest-paper.tsx" code={`import { Paper, type PaperProps } from "@/components/ui/paper"

export function ForestPaper({ edge = "${FOREST.knobs.edge}", ...props }: PaperProps) {
  return <Paper edge={edge} {...props} />
}`} />
      </li>
    </ol>;
  };
});
const TIERS = [["T0", "Palette", "surfaces, rules, stickies, inks, accents, tape, the shade triplet", ":root", "What a theme owns. Hex, one value per material."], ["T1", "Roles", "--background, --primary, --border ... plus paper roles (link, caret, placeholder, syntax)", ":root and [data-theme]", "Aliases of T0. Recomputed in every scope."], ["T2", "Recipe knobs", "wobble, pen weight, misregistration, tilt, shadow strength, blend", ":root, density blocks", "Numbers the drawing engine and the CSS read."], ["T3", "Geometry and motion", "spacing, hit size, easings, durations, z-scale", ":root, [data-motion]", "Durations collapse with --ll-motion."]];
const OVERRIDE = [["Always", "Every surface (desk, paper, shade, slip, card, graph, kraft, check, pad, photo), every ink (ink, soft, muted, blue, the pencils, red, green, orange-text, focus, link-hover), the shade triplet, and marker, highlighter and highlighter-deep."], ["Usually", "The rules (rule-blue, rule-red, pad-rule, check-rule and the two ledger inks), the sticky colors, the tape colors, and the eight stationery accents."], ["Sometimes", "The recipe knobs: wobble, pen weights, misregistration, shadow strength, blend, tilt. And the baked tiles, if the theme bakes others."], ["Never in CSS", "The shadcn roles, the shadow stacks, gradients, selection, syntax colors: they are derived. Fonts are compile-time; a theme with other typefaces ships its own font items."]];
const RULES = ["Roles are declared where a re-scope can land. A property that holds var() is computed on the element that declares it, so the color aliases are written on :root and on [data-theme], [data-ll-scope]. A check fails if the two drift.", "Translucent colors are color-mix(), never rgb triplets. The one triplet is --ll-shade, because shadows need an alpha.", "One multiplier for every shadow: --ll-shadow-k. A dark theme sets one number.", "One motion switch: --ll-motion multiplies every duration.", "Per-element inputs (--ll-tilt, --ll-stock, the jitter values) are never set on :root; a component writes them on its own element."];
const Anatomy = defineUi<{}>("Anatomy", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-6">
      <TableScroll label="The four token tiers">
        <table class="w-full min-w-[36rem] border-collapse text-[15px]">
          <caption class="sr-only">The four tiers of tokens, what is in each and where it is declared</caption>
          <thead>
            <tr>
              <th scope="col" class={th}>Tier</th>
              <th scope="col" class={th}>Holds</th>
              <th scope="col" class={th}>Declared on</th>
              <th scope="col" class={th}>Rule</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map(([tier, name, holds, on, rule]) => <tr key={tier}>
                <th scope="row" class={cn(td, "text-start")}>
                  <span class="font-mono text-[13.5px]">{tier}</span> <span class="font-script text-lg">{name}</span>
                </th>
                <td class={cn(td, "text-[14.5px]")}>{holds}</td>
                <td class={cn(td, "font-mono text-[12.5px]")}>{on}</td>
                <td class={cn(td, "text-[14.5px]")}>{rule}</td>
              </tr>)}
          </tbody>
        </table>
      </TableScroll>
      <TableScroll label="What a theme overrides">
        <table class="w-full min-w-[30rem] border-collapse text-[15px]">
          <caption class="sr-only">What a theme always, usually, sometimes and never overrides</caption>
          <tbody>
            {OVERRIDE.map(([when, what]) => <tr key={when}>
                <th scope="row" class={cn(td, "w-32 text-start font-script text-xl")}>{when}</th>
                <td class={cn(td, "text-[15px]")}>{what}</td>
              </tr>)}
          </tbody>
        </table>
      </TableScroll>
      <Prose>
        <p>Five rules keep a theme &quot;a CSS block and nothing else&quot;:</p>
        <ol>
          {RULES.map(r => <li key={r}>{r}</li>)}
        </ol>
      </Prose>
    </div>;
  };
});
const READ_BY = {
  css: "the stylesheet" as const,
  code: "TypeScript (the provider, components)" as const,
  "css+code": "the stylesheet and TypeScript" as const,
  reserved: "nobody yet" as const
} as const;
const KnobTable = defineUi<{}>("KnobTable", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TableScroll label="Every recipe knob and who reads it">
      <table class="w-full min-w-[34rem] border-collapse text-[15px]">
        <caption class="sr-only">The recipe knobs, their Notebook value and what reads them</caption>
        <thead>
          <tr>
            <th scope="col" class={th}>Knob</th>
            <th scope="col" class={th}>Notebook</th>
            <th scope="col" class={th}>Read by</th>
            <th scope="col" class={th}>Meaning</th>
          </tr>
        </thead>
        <tbody>
          {KNOB_ROWS.map(k => <tr key={k.token}>
              <th scope="row" class={cn(td, "text-start font-mono text-[13px] font-medium")}>{k.token}</th>
              <td class={cn(td, "ll-num font-mono text-[13px]")}>{k.value}</td>
              <td class={cn(td, "text-[14.5px]", k.readBy === "reserved" && "text-muted-foreground")}>{READ_BY[k.readBy]}</td>
              <td class={cn(td, "text-[14.5px]")}>{k.role}</td>
            </tr>)}
        </tbody>
      </table>
    </TableScroll>;
  };
});
const ThemingPage = defineUi<{}>("ThemingPage", [], (_props, {
  slots: _slots
}) => {
  const announce = useAnnounce();
  const state = shallowRef<ThemeState>(initialState(EMPTY_THEME));
  const setState = stateSetter(state);
  const forest = computed(() => forestAfter(FOREST.steps.length));
  const swatches = computed(() => PALETTE.length);
  const show = computed(() => (count: number) => {
    setState(() => forestAfter(count));
    announce.value(`The editor now shows forest after step ${count + 1} of ${FOREST.steps.length + 1}`);
    document.getElementById("editor")?.scrollIntoView({
      block: "start" as const
    });
  });
  return () => {
    return <>
      <Section id="anatomy" title="A theme is tokens and a few knobs">
        <Prose>
          <p>
            Notebook is not special-cased anywhere. It is a palette of {swatches.value} colors, some numbers for the hand, and a stylesheet that derives everything else from them. A second theme is a block
            of CSS custom properties that overrides some of those, on <InlineCode>&lt;html&gt;</InlineCode> or on any subtree, next to a small recipe object for the choices that are not colors.
            No component is edited.
          </p>
        </Prose>
      </Section>

      <Section id="editor" title="Edit a theme live" description="Change any color or knob and the page of real components below re-themes; the contrast table answers at once. Nothing you do here leaves the preview.">
        <Editor state={state.value} setState={setState} />
      </Section>

      <Section id="tiers" title="What a theme is made of" description="Four tiers of tokens. A theme edits the first, sometimes the third, and never has to touch the other two.">
        <Anatomy />
      </Section>

      <Section id="forest" title="A worked example: forest" description="We are not shipping a second theme. This is the process, run on the real checker, so you can do it for yours.">
        <Prose>
          <p>
            Forest is pale sage felt, warm cream paper, a kraft-colored slip and petrol-teal ink. Each step below adds its declarations to a scratch copy of the stylesheet and runs the same
            contrast check the build runs. The results are not staged; the first one surprised us too.
          </p>
        </Prose>
        <Walkthrough onShow={show.value} />
        <Callout tone="tip" title="The lesson in step 6">
          <p>
            The marker does two jobs: it is a fill under an ink label (which wants it light) and, as <InlineCode>--chart-1</InlineCode>, a line on paper (which wants it dark). On Notebook&apos;s paper the
            two just fit; on forest&apos;s there is no single orange that does both. So the theme lightens the marker and gives the chart its own darker orange. Darkening the marker alone, which is what
            you might try first, makes the label worse.
          </p>
        </Callout>
        <Section id="forest-compare" level={3} title="Notebook and forest, side by side">
          <Demo label="The same page in Notebook and in the finished forest theme">
            <div class="@container">
              <div class="grid gap-6 @2xl:grid-cols-2">
                <div>
                  <p class="mb-2 font-script text-xl font-bold">Notebook</p>
                  <ThemePreview state={EMPTY_THEME} seed="notebook" label="The preview in Notebook" />
                </div>
                <div>
                  <p class="mb-2 font-script text-xl font-bold">Forest</p>
                  <ThemePreview state={forest.value} seed="forest" label="The preview in the finished forest theme" />
                </div>
              </div>
            </div>
          </Demo>
        </Section>
        <CodeBlock lang="css" title="The finished block" code={themeCss("forest", forest.value)} />
      </Section>

      <Section id="knobs" title="Recipe knobs" description="The numbers the drawing engine and the stylesheet read. Some are read by the drawing engine, some by CSS, and a few are declared and waiting; the table says which, from a scan of the source.">
        <KnobTable />
        <Prose>
          <p>
            The engine reads its knobs once per theme change: <InlineCode>wobble</InlineCode>, <InlineCode>misreg</InlineCode>, <InlineCode>bleed</InlineCode> and the pen width come from
            <InlineCode> getComputedStyle</InlineCode> on the provider&apos;s wrapper and again whenever <InlineCode>data-theme</InlineCode>, density, motion or direction changes. The first render
            (server and hydration) always uses Notebook&apos;s numbers, so hydration is exact and Notebook never redraws.
          </p>
          <p>
            A dark theme is a different material system, not a recolor: opaque pens (<InlineCode>--ll-blend: normal</InlineCode>), stronger shadows (<InlineCode>--ll-shadow-k</InlineCode> around 2.5)
            and a desk lighter than the paper. It is not started; the shadcn <InlineCode>.dark</InlineCode> class is not used by any Looseleaf token.
          </p>
        </Prose>
      </Section>

      <Section id="shipping" title="Shipping your own">
        <Prose>
          <ol>
            <li>Put the block after <InlineCode>looseleaf.css</InlineCode> (same specificity, later wins) or fill a slot in it. Every name must already exist in the base; a checker rejects a typo.</li>
            <li>
              Run the contrast record for your theme by name and fix what it lists. The scripts below live in the Looseleaf repository (<InlineCode>tools/</InlineCode>), not in what the registry installs; the editor above runs the same
              math in the browser, so it works from anywhere.
            </li>
            <li>Render the palette sheet and look at it.</li>
            <li>Put <InlineCode>data-theme=&quot;forest&quot;</InlineCode> on <InlineCode>&lt;html&gt;</InlineCode>, or on a subtree. Density and motion are independent attributes.</li>
          </ol>
        </Prose>
        <CodeBlock lang="bash" title="Check a theme (from a checkout of the repository)" code={`node tools/lookdev/tokens.mjs --check                # names exist, role blocks agree
node tools/check-tokens.mjs --all                    # every contrast pair, in every theme scope
node tools/lookdev/palette.mjs --theme forest        # the swatch sheet, with the numbers`} />
        <CodeBlock lang="tsx" title="Using it" code={`<html data-theme="forest">…</html>

<section data-theme="forest">
  <InkProvider theme="forest" knobs={{ wobble: 0.8 }}>…</InkProvider>
</section>`} />
      </Section>

      <Related items={[foundation("color", "Color", "The palette a theme replaces, and its contrast record."), foundation("pens", "Pens", "What the wobble and width knobs do."), foundation("paper", "Paper", "The stocks and edges a theme can recut."), foundation("density", "Density", "The other axis: a theme and a density are independent."), component("card", "Card", "The component the preview is built around.")]} />
    </>;
  };
});
export default ThemingPage;
