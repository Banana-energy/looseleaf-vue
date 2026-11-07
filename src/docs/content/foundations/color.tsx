// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { useAnnounce } from "@/docs/core/announcer";
import { useCopy } from "@/docs/core/hooks";
import { Callout, CodeBlock, InlineCode, Prose, Section } from "@/docs/kit";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/highlight";
import { Paper } from "@/components/ui/paper";
import { Tape } from "@/components/ui/tape";
import { Underline } from "@/components/ui/underline";
import { contrast, formatRatio, grade, type Grade } from "./_shared/colour-math";
import { CONTRAST, PALETTE, ROLES } from "./_shared/data.generated";
import type { ContrastRow, PaletteEntry } from "./_shared/data-types";
import { Demo, Panel, Related, SelectRow, TableScroll, Verdict, component, foundation, td, th } from "./_shared/kit";
import { InkPicture } from "./_shared/ink-picture";
import { drawSample } from "./_shared/pen-lab";
import { ALL_TOKENS } from "./_shared/theme-model";
import type { PenName } from "@/lib/ink/types";
import { cn } from "@/lib/utils";
const LABEL = new Map(ALL_TOKENS.map(t => [t.token, t]));
const labelOf = (token: string) => LABEL.get(token)?.label ?? token.replace(/^--(ll-)?/, "").replace(/-/g, " ");
const noteOf = (token: string) => LABEL.get(token)?.note ?? "";
const tailwindName = (token: string) => token === "--ll-card" ? "index-card" as const : token.replace(/^--(ll-)?/, "");
const GRADE_WORD: Record<Grade, string> = {
  AAA: "AAA" as const,
  AA: "AA" as const,
  "AA large": "large text only" as const,
  fail: "below 3 : 1" as const
};
const Ratio = defineUi<{
  value: number | null;
}>("Ratio", ["value"], (_props, {
  slots: _slots
}) => {
  const value = computed(() => _props["value"]);
  return () => {
    if (value.value === null) return <span>n/a</span>;
    const g = grade(value.value);
    return <span class="ll-num">
      <span class="whitespace-nowrap">{formatRatio(value.value)}</span>{" "}
      <span class={cn("font-type text-[12.5px]", g === "fail" ? "text-red" as const : g === "AA large" ? "text-orange-text" as const : "text-green" as const)}>{GRADE_WORD[g]}</span>
    </span>;
  };
});
const Patch = defineUi<{
  colour: string;
}>("Patch", ["colour"], (_props, {
  slots: _slots
}) => {
  const colour = computed(() => _props["colour"]);
  return () => {
    return <span aria-hidden="true" class="relative block h-16">
      <span class="absolute inset-0 border-[1.5px] border-ink/55 [border-radius:3px_6px_2px_5px/5px_2px_6px_3px]" />
      <span class="absolute inset-[3px] translate-x-[2px] translate-y-[2px] -rotate-[0.6deg] [border-radius:5px_2px_6px_3px/3px_6px_2px_5px]" style={cssStyle({
        background: colour.value
      })} />
    </span>;
  };
});
const SwatchChip = defineUi<{
  entry: PaletteEntry;
}>("SwatchChip", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const _hook1 = useCopy(() => 1400);
  const copied = computed(() => _hook1.value.copied);
  const copy = computed(() => _hook1.value.copy);
  const announce = useAnnounce();
  const name = computed(() => labelOf(entry.value.token));
  const text = computed(() => `var(${entry.value.token})`);
  const inkGroup = computed(() => entry.value.group === "ink");
  return () => {
    return <Paper as="li" stock="slip" seed={entry.value.token} class="p-2.5 pb-3">
      <button type="button" class="block w-full text-start" aria-label={`${name.value}: copy ${text.value}`} onClick={async () => {
        if (await copy.value(text.value)) announce.value(`Copied ${text.value}`);
      }}>
        <Patch colour={`var(${entry.value.token})`} />
        <span class="mt-2 block text-[15px] leading-tight font-bold">{name.value}</span>
        <span class="block font-mono text-[12.5px] text-pencil-text">{copied.value ? "copied" as const : entry.value.token}</span>
      </button>
      <span class="ll-num mt-0.5 block font-mono text-[13px] text-ink-soft">{entry.value.value}</span>
      <span class="mt-0.5 block text-[14px] leading-snug text-muted-foreground">{noteOf(entry.value.token)}</span>
      <dl class="mt-1.5 grid gap-0.5 text-[14px] leading-snug">
        {inkGroup.value ? <>
            <div class="flex flex-wrap justify-between gap-x-2">
              <dt class="text-pencil-text">on paper</dt>
              <dd>
                <Ratio value={entry.value.onPaper} />
              </dd>
            </div>
            <div class="flex flex-wrap justify-between gap-x-2">
              <dt class="text-pencil-text">on desk</dt>
              <dd>
                <Ratio value={entry.value.onDesk} />
              </dd>
            </div>
          </> : <div class="flex flex-wrap justify-between gap-x-2">
            <dt class="text-pencil-text">{entry.value.group === "accent" ? "ink label" as const : "ink on it" as const}</dt>
            <dd>
              <Ratio value={entry.value.inkOn} />
            </dd>
          </div>}
      </dl>
      <span class="mt-1 block font-mono text-[12px] text-pencil-text">bg-{tailwindName(entry.value.token)}</span>
    </Paper>;
  };
});
const SwatchGrid = defineUi<{
  label: string;
  entries: readonly PaletteEntry[];
}>("SwatchGrid", ["label", "entries"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const entries = computed(() => _props["entries"]);
  return () => {
    return <ul role="list" aria-label={label.value} class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(11.5rem,1fr))] gap-x-5 gap-y-7 p-1">
      {entries.value.map(e => <SwatchChip key={e.token} entry={e} />)}
    </ul>;
  };
});
const PENS_IN_USE: {
  pen: PenName;
  text: UI.VueNode;
}[] = [{
  pen: "ink.brush" as const,
  text: <><span class="font-bold">Ink</span> is the voice of the page: body text, headings, everything the system says.</>
}, {
  pen: "blue.brush" as const,
  text: <><Underline tone="blue" kind="single">Blue felt</Underline> is <em>you</em>: links, what you typed, the focus ring.</>
}, {
  pen: "pencil" as const,
  text: <><span class="font-bold text-pencil-text">Graphite</span> is a note in the margin: hints, meta, hairlines.</>
}, {
  pen: "red" as const,
  text: <><Underline tone="red" kind="wavy">Red pencil</Underline> corrects: errors and danger.</>
}, {
  pen: "green" as const,
  text: <><span class="font-bold text-green">Green pencil</span> says fine: ok, added, done.</>
}, {
  pen: "terracotta" as const,
  text: <><Highlight tone="orange">Terracotta marker</Highlight> means do this: the primary action.</>
}, {
  pen: "hi" as const,
  text: <><Highlight>Yellow highlighter</Highlight> means look here: emphasis, selection, hover.</>
}];
const PensInUse = defineUi<{}>("PensInUse", [], (_props, {
  slots: _slots
}) => {
  const strokes = computed(() => PENS_IN_USE.map(p => drawSample(p.pen, {
    w: 84,
    h: 24,
    tier: "hi" as const,
    seed: `in-use:${p.pen}`
  })));
  return () => {
    return <Paper stock="index-card" tilt={false} class="mx-auto max-w-xl px-6 pt-4 pb-6">
      <ul role="list" class="m-0 grid list-none gap-y-1 p-0 text-[17px] leading-[1.9] text-ink">
        {PENS_IN_USE.map((p, i) => <li key={p.pen} class="grid grid-cols-[6.5rem_1fr] items-center gap-x-3">
            <InkPicture drawn={strokes.value[i]!} />
            <p class="m-0">{p.text}</p>
          </li>)}
      </ul>
    </Paper>;
  };
});
const PAIRED = ["--background", "--card", "--popover", "--primary", "--secondary", "--muted", "--accent", "--destructive", "--sidebar", "--sidebar-primary", "--sidebar-accent"];
const MARKS = ["--border", "--input", "--ring", "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5", "--sidebar-border"];
const RolesTable = defineUi<{}>("RolesTable", [], (_props, {
  slots: _slots
}) => {
  const byToken = computed(() => new Map(ROLES.map(r => [r.token, r])));
  return () => {
    return <TableScroll label="shadcn roles and the palette tokens they follow">
      <table class="w-full min-w-[34rem] border-collapse text-[15px]">
        <caption class="sr-only">Each shadcn role, the Looseleaf token it follows, its color and the contrast that matters for it</caption>
        <thead>
          <tr>
            <th scope="col" class={th}>
              Role
            </th>
            <th scope="col" class={th}>
              Follows
            </th>
            <th scope="col" class={th}>
              Color
            </th>
            <th scope="col" class={th}>
              What it has to clear
            </th>
          </tr>
        </thead>
        <tbody>
          {[...PAIRED, ...MARKS].map(token => {
            const role = byToken.value.get(token);
            if (!role) return null;
            const fg = byToken.value.get(`${token}-foreground`) ?? (token === "--muted" ? byToken.value.get("--muted-foreground") : undefined);
            const paired = PAIRED.includes(token) && fg;
            return <tr key={token}>
                <th scope="row" class={cn(td, "text-start font-mono text-[13.5px] font-medium")}>
                  {token}
                </th>
                <td class={cn(td, "font-mono text-[13px] text-pencil-text")}>{role.alias || role.value}</td>
                <td class={td}>
                  <span class="inline-flex items-center gap-2">
                    <span aria-hidden="true" class="inline-block size-5 border border-ink/50" style={cssStyle({
                    background: role.value
                  })} />
                    <span class="ll-num font-mono text-[13px]">{role.value}</span>
                  </span>
                </td>
                <td class={td}>
                  {paired ? <span class="inline-flex flex-wrap items-center gap-2">
                      <span class="px-2 py-0.5 font-bold" style={cssStyle({
                    background: role.value,
                    color: fg.value
                  })}>
                        Aa label
                      </span>
                      <Ratio value={contrast(fg.value, role.value)} />
                    </span> : <span class="inline-flex flex-wrap items-center gap-2">
                      <span class="text-pencil-text">on paper</span>
                      <Ratio value={role.onPaper} />
                    </span>}
                </td>
              </tr>;
          })}
        </tbody>
      </table>
    </TableScroll>;
  };
});
const HEX_TOKENS = [...PALETTE, ...ROLES.filter(r => r.group === "shadcn" && r.value.startsWith("#"))];
const OPTIONS = HEX_TOKENS.map(e => ({
  value: e.token,
  label: `${labelOf(e.token)} (${e.token})`
}));
const HEX_OF = new Map(HEX_TOKENS.map(e => [e.token, e.value]));
const Checker = defineUi<{}>("Checker", [], (_props, {
  slots: _slots
}) => {
  const fg = shallowRef(initialState("--ll-ink-you"));
  const setFg = stateSetter(fg);
  const bg = shallowRef(initialState("--ll-desk"));
  const setBg = stateSetter(bg);
  const fgHex = computed(() => HEX_OF.get(fg.value) ?? "#000000");
  const bgHex = computed(() => HEX_OF.get(bg.value) ?? "#ffffff");
  const ratio = computed(() => contrast(fgHex.value, bgHex.value));
  const g = computed(() => grade(ratio.value));
  const rows = computed<{
    need: number;
    what: string;
  }[]>(() => [{
    need: 7,
    what: "Body text, AAA" as const
  }, {
    need: 4.5,
    what: "Body text, AA" as const
  }, {
    need: 3,
    what: "Large text and drawn marks" as const
  }]);
  return () => {
    return <div role="group" aria-label="Contrast checker" class="grid gap-5 @container">
      <div class="grid gap-4 @lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] @lg:items-end">
        <SelectRow label="Foreground" value={fg.value} options={OPTIONS} onChange={setFg} />
        <Button variant="outline" size="sm" class="justify-self-start" onClick={() => {
          setFg(bg.value);
          setBg(fg.value);
        }}>
          Swap
        </Button>
        <SelectRow label="Background" value={bg.value} options={OPTIONS} onChange={setBg} />
      </div>
      <div class="grid gap-4 @lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div class="min-w-0 border-[1.5px] border-ink/50 p-4 [border-radius:4px_7px_3px_6px/6px_3px_7px_4px]" style={cssStyle({
          background: bgHex.value,
          color: fgHex.value
        })} data-testid="checker-sample">
          <p class="leading-snug" style={cssStyle({
            fontSize: 13
          })}>Small print, 13 px. The quick brown fox jumps over the lazy dog.</p>
          <p class="mt-1 text-[17px] leading-snug">Body text, 17 px. Pencil, ink and a little tea.</p>
          <p class="mt-1 font-script text-3xl leading-tight font-bold">Large, 30 px script</p>
        </div>
        <div>
          <p class="font-script text-5xl leading-none font-bold" aria-live="polite" aria-atomic="true">
            <span class="sr-only">Contrast ratio </span>
            <span class="ll-num">{formatRatio(ratio.value)}</span>
          </p>
          <p class="mt-1 text-[15px]">
            {g.value === "fail" ? "Below every line." as const : g.value === "AA large" ? "Large text and marks only." as const : g.value === "AA" ? "Fine for body text." as const : "Clears the strictest line." as const}
          </p>
          <ul role="list" class="m-0 mt-2 grid list-none gap-1 p-0 text-[15px]">
            {rows.value.map(r => <li key={r.need} class="flex items-baseline justify-between gap-3">
                <span>{r.what}</span>
                <Verdict kind={ratio.value >= r.need ? "ok" as const : "fail" as const}>{ratio.value >= r.need ? `pass (${r.need})` : `no (${r.need})`}</Verdict>
              </li>)}
          </ul>
        </div>
      </div>
    </div>;
  };
});
function groupBySection(rows: readonly ContrastRow[]): [string, ContrastRow[]][] {
  const map = new Map<string, ContrastRow[]>();
  for (const r of rows) map.set(r.section, [...(map.get(r.section) ?? []), r]);
  return [...map];
}
const ContrastRecord = defineUi<{}>("ContrastRecord", [], (_props, {
  slots: _slots
}) => {
  const sections = computed(() => groupBySection(CONTRAST));
  return () => {
    return <div class="grid gap-3">
      {sections.value.map(([title, rows], i) => <details key={title} open={i === 0} class="border-[1.5px] border-line-soft px-3 py-2 [border-radius:4px_7px_3px_6px/6px_3px_7px_4px]">
          <summary class="cursor-pointer text-[16px] font-bold">
            {title} <span class="font-normal text-muted-foreground">({rows.length} pairs)</span>
          </summary>
          <div class="mt-2">
            <TableScroll label={`${title}: contrast pairs`}>
              <table class="w-full min-w-[36rem] border-collapse text-[15px]">
                <caption class="sr-only">{title}</caption>
                <thead>
                  <tr>
                    <th scope="col" class={th}>
                      Sample
                    </th>
                    <th scope="col" class={th}>
                      Pair
                    </th>
                    <th scope="col" class={th}>
                      Ratio
                    </th>
                    <th scope="col" class={th}>
                      Needs
                    </th>
                    <th scope="col" class={th}>
                      Result
                    </th>
                    <th scope="col" class={th}>
                      What it protects
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, j) => <tr key={`${r.fg}|${r.bg}|${j}`}>
                      <td class={td}>
                        <span class="inline-block min-w-12 border border-ink/40 px-2 py-0.5 text-center font-bold" style={cssStyle({
                      background: r.bgHex,
                      color: r.fgHex
                    })}>
                          Aa
                        </span>
                      </td>
                      <td class={cn(td, "font-mono text-[12.5px] leading-snug")}>
                        {r.fg}
                        <br />
                        <span class="text-pencil-text">on</span> {r.bg}
                      </td>
                      <td class={cn(td, "ll-num font-mono text-[13.5px] whitespace-nowrap")}>{formatRatio(r.ratio)}</td>
                      <td class={cn(td, "ll-num font-mono text-[13.5px]")}>{r.min}</td>
                      <td class={td}>{r.status === "ok" ? <Verdict kind="ok">ok</Verdict> : r.status === "warn" ? <Verdict kind="info">info</Verdict> : <Verdict kind="fail">fail</Verdict>}</td>
                      <td class={cn(td, "min-w-56 text-[14.5px]")}>{r.purpose}</td>
                    </tr>)}
                </tbody>
              </table>
            </TableScroll>
          </div>
        </details>)}
    </div>;
  };
});
const ACCENT_TAPES = ["tomato", "tangerine", "lemon", "grass", "teal", "sky", "grape", "bubblegum"] as const;
const TAPE_KINDS = ["washi-dots", "washi-stripes", "washi-zigzag", "washi-gingham"] as const;
const DeskText = defineUi<{}>("DeskText", [], (_props, {
  slots: _slots
}) => {
  const rows = computed(() => [{
    token: "--ll-ink" as const,
    cls: "text-ink" as const,
    note: "ink" as const
  }, {
    token: "--ll-ink-soft" as const,
    cls: "text-ink-soft" as const,
    note: "ink-soft" as const
  }, {
    token: "--ll-ink-muted" as const,
    cls: "text-muted-foreground" as const,
    note: "muted" as const
  }, {
    token: "--ll-ink-you" as const,
    cls: "text-ink-you" as const,
    note: "blue felt: large marks only" as const
  }]);
  const desk = computed(() => HEX_OF.get("--ll-desk") ?? "#9db8ae");
  return () => {
    return <div class="bg-desk p-4 [border-radius:4px_7px_3px_6px/6px_3px_7px_4px]">
      <ul role="list" class="m-0 grid list-none gap-1 p-0 text-[16px]">
        {rows.value.map(r => <li key={r.token} class={cn("flex flex-wrap items-baseline justify-between gap-x-4", r.cls)}>
            <span class="font-bold">Straight on the desk: {r.note}</span>
            <span class="ll-num font-mono text-[13px]">{formatRatio(contrast(HEX_OF.get(r.token) ?? "#000000", desk.value))}</span>
          </li>)}
      </ul>
    </div>;
  };
});
const Accents = defineUi<{}>("Accents", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-3">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2" role="img" aria-label="Eight strips of washi tape in the eight stationery accent colors">
        {ACCENT_TAPES.map((c, i) => <Tape key={c} kind={TAPE_KINDS[i % TAPE_KINDS.length]} color={c} length={78} height={24} seed={`accent:${c}`} />)}
      </div>
    </div>;
  };
});
const surfaces = PALETTE.filter(e => e.group === "surface");
const inks = PALETTE.filter(e => e.group === "ink");
const accents = PALETTE.filter(e => e.group === "accent");
const okCount = CONTRAST.filter(r => r.status === "ok").length;
const infoCount = CONTRAST.filter(r => r.status === "warn").length;
const ColourPage = defineUi<{}>("ColourPage", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <>
      <Section id="who-wrote-it" title="Color means who wrote it">
        <Prose>
          <p>
            In a real notebook nobody picks color for decoration. The brown-black felt tip is the voice of the page. Blue is you. A pencil in the margin is a note, a red one is a correction,
            a green one says fine. The terracotta marker means <em>do this</em> and the yellow highlighter means <em>look here</em>.
          </p>
          <p>
            Looseleaf keeps to that. The loud stationery colors (tomato, teal, bubblegum) exist too, but only where a bright color cannot be mistaken for meaning: stickers, washi tape, badges,
            avatars and chart fills.
          </p>
        </Prose>
        <Demo label="The seven pens, each doing its job">
          <PensInUse />
        </Demo>
      </Section>

      <Section id="palette" title="The palette" description="Every color is a custom property, and every value below was read from the stylesheet when this page was built. Click a chip to copy its var().">
        <Section id="surfaces" level={3} title="Surfaces" description="Cream paper on a sage desk. The paper is lighter than the desk on purpose (1.95 : 1), so a sheet always reads as a sheet.">
          <SwatchGrid label="Surface colors" entries={surfaces} />
        </Section>
        <Section id="inks" level={3} title="Inks" description="Each pen has one job. Blue and the pencils are the ones you will meet most often as text.">
          <SwatchGrid label="Ink colors" entries={inks} />
        </Section>
        <Section id="accents" level={3} title="Stationery accents" description="Decoration only. Ink on tomato and grape is 3.95 : 1, so sticker lettering there stays large or dark.">
          <SwatchGrid label="Stationery accent colors" entries={accents} />
        </Section>
      </Section>

      <Section id="roles" title="Roles: shadcn's names, our colors" description="A shadcn project already speaks in --background, --primary and --border. Those names stay; each one is an alias of a palette token, so a theme only ever changes the palette.">
        <RolesTable />
        <Callout tone="note" title="Why the marker is the primary">
          <p>
            <InlineCode>--primary</InlineCode> is the terracotta marker with an ink label on it: 4.60 : 1 as a flat fill, and that flat color is what the token check measures. The button lays
            the fill down as two overlapping marker sweeps, and where they overlap the pigment is darker, which gives the label a little less than 4.60 : 1 there. Nobody has measured the rendered
            pixels yet; if you need headroom on a theme, lighten the marker before you touch the label.
          </p>
        </Callout>
      </Section>

      <Section id="contrast" title="Contrast, measured" description={`${CONTRAST.length} pairs are checked by the QA gate: ${okCount} clear their line and ${infoCount} carry a note. Nothing below was rounded in our favour.`}>
        <Panel title="Check any two colors">
          <Checker />
        </Panel>
        <Prose>
          <p>
            The record is what <InlineCode>node tools/check-tokens.mjs</InlineCode> runs. Every pair is re-run inside each theme scope, so a theme cannot ship a label nobody can read. The two
            kinds of note to look for:
          </p>
          <ul>
            <li>
              <strong>info</strong> rows are true but not failures: red pencil sits at 4.13 : 1 on paper-shade, so errors belong on paper, not on muted fills.
            </li>
            <li>The tomato and grape stickers are 3.95 : 1 with an ink label. That is why sticker lettering stays large or dark.</li>
          </ul>
        </Prose>
        <CodeBlock lang="bash" title="Print every row, for every theme scope" code="node tools/check-tokens.mjs --all" />
        <ContrastRecord />
      </Section>

      <Section id="rules" title="Where each color is allowed">
        <Section id="rule-desk" level={3} title="On the desk: ink, soft ink, muted" description="Text straight on the sage desk may only be one of the three inks. Blue felt drops to 3.64 : 1 there, which is enough for a focus ring and not for a sentence.">
          <Demo label="Text colors on the desk">
            <DeskText />
          </Demo>
        </Section>
        <Section id="rule-accents" level={3} title="The loud colors live on tape" description="Stationery accents are decoration, so they are washi, stickers and stamps. They never carry the only copy of a meaning.">
          <Demo label="The eight stationery accents as washi tape">
            <Accents />
          </Demo>
        </Section>
        <Section id="rule-pattern" level={3} title="Meaning never rides on color alone">
          <Prose>
            <ul>
              <li>Destructive buttons are red pencil <em>hatching</em> with a word on top, so they differ by pattern as well as hue.</li>
              <li>Chart series get a hatch channel next to their color, for people who cannot tell the pencils apart.</li>
              <li>Hover is a highlighter swipe or a drop-line, never just a change of hue.</li>
              <li>Red text goes on paper, never on paper-shade or a sticker.</li>
            </ul>
          </Prose>
        </Section>
      </Section>

      <Section id="using" title="Using the colors">
        <Prose>
          <p>
            In Tailwind the names are the token without its prefix. In your own CSS use the custom property. Drawing code never writes a hex: the engine asks the one color choke point, which hands
            back a <InlineCode>var()</InlineCode>, so a theme reaches every stroke.
          </p>
        </Prose>
        <CodeBlock lang="tsx" title="Three ways to use one color" code={`// Tailwind: the token name without --ll-
<p className="bg-paper text-ink">Ink on paper</p>
<a className="text-ink-you hover:text-link-hover">A link</a>

.note { background: var(--ll-sticky-yellow); color: var(--ll-ink); }

import { paint } from "@/lib/ink/paint"
const fill = paint("marker")   // "var(--ll-marker)"`} />
        <Callout tone="tip" title="Pick a role before you pick a color">
          <p>
            Reach for <InlineCode>bg-primary</InlineCode>, <InlineCode>text-muted-foreground</InlineCode> and <InlineCode>border-border</InlineCode> in app code; they follow the theme and keep
            shadcn class strings working. Use palette names (<InlineCode>text-ink-you</InlineCode>) when you mean the pen, not the role.
          </p>
        </Callout>
      </Section>

      <Related items={[foundation("theming", "Theming", "Change the palette and watch the contrast table answer."), foundation("paper", "Paper", "The stocks these colors are printed on."), foundation("accessibility", "Accessibility", "The rest of the contrast and focus story."), component("button", "Button", "The marker as a primary action, in every state."), component("badge", "Badge", "Stationery accents in small doses.")]} />
    </>;
  };
});
export default ColourPage;
