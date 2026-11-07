// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { CodeBlock, InlineCode, Prose, Section } from "@/docs/kit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fastener, Paper, type FastenerKind, type PaperProps, type TapePlacement } from "@/components/ui/paper";
import { Tape } from "@/components/ui/tape";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EDGE_KINDS, edgeSides, type EdgeKind, type EdgeSpec } from "@/lib/ink/paper/edges";
import { SHADOW_LAYERS, sheetShadow, tiltFor, type SheetShadowKind } from "@/lib/ink/paper/shadows";
import { STOCKS, STOCK_NAMES, TOOTH_TILES, type RuleName, type StockName } from "@/lib/ink/paper/stocks";
import { InkProvider, InkTiles } from "@/lib/ink/vue";
import { PAPER_TILES, type PaperTileName } from "@/lib/ink/textures";
import type { Accent, TapeKind } from "@/lib/ink/paper/props";
import { cn } from "@/lib/utils";
import { Demo, Panel, Related, SelectRow, SliderRow, SwitchRow, TableScroll, component, foundation, td, th } from "./_shared/kit";
type EdgeChoice = "sold" | EdgeKind | "mixed";
const EDGE_INFO: Record<EdgeChoice, string> = {
  sold: "Every stock is cut the way it is sold: the order pad is torn along its top, receipts are pinked, parchment is deckled, a guest check is perforated. Everything else is a guillotine cut." as const,
  cut: "Guillotine: half a pixel of wander and no fibers. It is pure CSS (stock color, baked tooth, lit gradient, umber shadow), so an ordinary card costs no SVG at all." as const,
  torn: "Hand-torn: three scales of wander and a pale rim where the fibers stand out. The sheet draws its outline once and fills it with the same tiles." as const,
  deckle: "Rag paper: like torn, but softer, with a wider fringe of loose fiber." as const,
  crimp: "Napkin and tissue: a fine crinkle along the edge and a faint fringe." as const,
  zig: "Pinking shears: a regular sawtooth. Receipts and tickets." as const,
  perf: "A perforation: round bites at a fixed pitch. Guest checks and tear-off strips." as const,
  scallop: "Round tabs with sharp notches between them, like a doily." as const,
  mixed: "One kind per side, as in edge={{ top: \"torn\", bottom: \"deckle\" }}. A side you leave out is cut." as const
};
const MIXED: EdgeSpec = {
  top: "torn" as const,
  right: "cut" as const,
  bottom: "deckle" as const,
  left: "cut" as const
};
const CHOICES: EdgeChoice[] = ["sold", ...EDGE_KINDS, "mixed"];
const edgeProp = (c: EdgeChoice): EdgeSpec | undefined => c === "sold" ? undefined : c === "mixed" ? MIXED : c;
const StockCard = defineUi<{
  name: StockName;
  edge: EdgeChoice;
}>("StockCard", ["name", "edge"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const edge = computed(() => _props["edge"]);
  const s = computed(() => STOCKS[name.value]);
  return () => {
    return <Paper as="li" stock={name.value} edge={edgeProp(edge.value)} size={[200, 128]} seed={`stock:${name.value}`} class="h-32 w-[200px] p-4">
      <span class="block font-script text-2xl leading-none font-bold text-ink">{s.value.label}</span>
      <span class="mt-1.5 block font-mono text-[12px] leading-snug text-ink-soft">stock=&quot;{name.value}&quot;</span>
      <span class="block text-[14px] leading-snug text-ink-soft">
        {s.value.tooth === "none" ? "no tooth" as const : `${s.value.tooth} tooth`}, {s.value.shadow} shadow
      </span>
    </Paper>;
  };
});
const StockExplorer = defineUi<{}>("StockExplorer", [], (_props, {
  slots: _slots
}) => {
  const edge = shallowRef<EdgeChoice>(initialState("sold"));
  const setEdge = stateSetter(edge);
  return () => {
    return <div class="grid gap-5">
      <div class="grid gap-2">
        <p id="edge-choice" class="text-[15px] font-bold">
          Cut every sheet
        </p>
        <ToggleGroup type="single" variant="outline" size="sm" spacing={1} value={edge.value} onValueChange={v => v && setEdge(v as EdgeChoice)} aria-labelledby="edge-choice" class="flex-wrap">
          {CHOICES.map(c => <ToggleGroupItem key={c} value={c}>
              {c === "sold" ? "as sold" as const : c === "mixed" ? "per side" as const : c}
            </ToggleGroupItem>)}
        </ToggleGroup>
        <p class="min-h-[4.5rem] max-w-2xl text-[15px] leading-snug text-muted-foreground" aria-live="polite" data-testid="edge-info">
          {EDGE_INFO[edge.value]}
        </p>
      </div>
      <Demo label="All nineteen stocks, cut the same way" surface="desk">
        <ul role="list" aria-label="All nineteen paper stocks" class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(12.5rem,1fr))] justify-items-center gap-x-6 gap-y-8 p-0">
          {STOCK_NAMES.map(n => <StockCard key={n} name={n} edge={edge.value} />)}
        </ul>
      </Demo>
    </div>;
  };
});
const StockTable = defineUi<{}>("StockTable", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TableScroll label="Every stock, with its color, tooth, shadow, default edge, printed rules and tilt">
      <table class="w-full min-w-[40rem] border-collapse text-[15px]">
        <caption class="sr-only">The nineteen stocks</caption>
        <thead>
          <tr>
            <th scope="col" class={th}>Stock</th>
            <th scope="col" class={th}>Printed on</th>
            <th scope="col" class={th}>Tooth</th>
            <th scope="col" class={th}>Shadow</th>
            <th scope="col" class={th}>Cut</th>
            <th scope="col" class={th}>Rules</th>
            <th scope="col" class={th}>Tilt</th>
          </tr>
        </thead>
        <tbody>
          {STOCK_NAMES.map(n => {
            const s = STOCKS[n];
            const kinds = [...new Set(edgeSides(s.edge))].filter(k => k !== "cut");
            return <tr key={n}>
                <th scope="row" class={cn(td, "text-start font-mono text-[13.5px] font-medium")}>{n}</th>
                <td class={cn(td, "font-mono text-[13px]")}>
                  <span aria-hidden="true" class="me-2 inline-block size-3.5 border border-ink/50 align-middle" style={cssStyle({
                  background: s.color
                })} />
                  {s.tint ? `paper + ${Math.round(s.tint[1] * 100)}% ${s.tint[0]}` : `--ll-${s.base}`}
                </td>
                <td class={td}>{s.tooth}</td>
                <td class={cn(td, "font-mono text-[13px]")}>{s.shadow}</td>
                <td class={td}>{kinds.length ? kinds.join(", ") : "cut" as const}</td>
                <td class={td}>{s.rules}</td>
                <td class={cn(td, "ll-num font-mono text-[13px]")}>≤ {s.tilt}°</td>
              </tr>;
          })}
        </tbody>
      </table>
    </TableScroll>;
  };
});
interface Build {
  stock: StockName;
  edge: EdgeChoice;
  rules: RuleName | "sold";
  tilt: boolean;
  tape: TapePlacement | "none";
  tapeKind: TapeKind;
  fastener: FastenerKind | "none";
  shadow: SheetShadowKind | "stock" | "none";
}
const INITIAL: Build = {
  stock: "index-card" as const,
  edge: "torn" as const,
  rules: "sold" as const,
  tilt: true,
  tape: "corner" as const,
  tapeKind: "washi-dots" as const,
  fastener: "none" as const,
  shadow: "stock" as const
};
const RULES: RuleName[] = ["none", "ruled", "ruled-hand", "index", "graph", "dots", "ledger", "pad", "window"];
const TAPE_KINDS: TapeKind[] = ["masking", "washi-dots", "washi-stripes", "washi-zigzag", "washi-gingham", "kraft", "clear"];
const FASTENERS: FastenerKind[] = ["clip", "pin", "staple", "binder-clip"];
const SHADOWS = Object.keys(SHADOW_LAYERS) as SheetShadowKind[];
function edgeCode(c: EdgeChoice): string {
  return c === "mixed" ? `{{ top: "torn", right: "cut", bottom: "deckle", left: "cut" }}` : `"${c}"`;
}
function buildCode(b: Build): string {
  const props: string[] = [`stock="${b.stock}"`];
  if (b.edge !== "sold") props.push(`edge=${edgeCode(b.edge)}`);
  if (b.rules !== "sold") props.push(`rules="${b.rules}"`);
  if (!b.tilt) props.push("tilt={false}");
  if (b.tape !== "none") props.push(`tape="${b.tape}"`, ...(b.tapeKind !== "masking" ? [`tapeKind="${b.tapeKind}"`] : []));
  if (b.fastener !== "none") props.push(`fastener="${b.fastener}"`);
  if (b.shadow !== "stock") props.push(`shadow="${b.shadow}"`);
  return `<Paper ${props.join(" ")} className="p-5">\n  …\n</Paper>`;
}
const Builder = defineUi<{}>("Builder", [], (_props, {
  slots: _slots
}) => {
  const b = shallowRef<Build>(initialState(INITIAL));
  const setB = stateSetter(b);
  const set = computed(() => <K extends keyof Build,>(k: K, v: Build[K]) => setB(p => ({
    ...p,
    [k]: v
  })));
  const props = computed<Partial<PaperProps>>(() => ({
    stock: b.value.stock,
    edge: edgeProp(b.value.edge),
    rules: b.value.rules === "sold" ? undefined : b.value.rules,
    tilt: b.value.tilt,
    tape: b.value.tape === "none" ? false : b.value.tape,
    tapeKind: b.value.tapeKind,
    fastener: b.value.fastener === "none" ? false : b.value.fastener,
    shadow: b.value.shadow
  }));
  return () => {
    return <div class="grid gap-5">
      <Demo label="A sheet built from the props below" surface="desk">
        <div class="grid min-h-[17rem] place-items-center px-2 py-6">
          <Paper {...domProps(props.value)} size={[280, 190]} seed="builder" class="h-[190px] w-[280px] p-5" data-testid="built-sheet">
            <p class="font-script text-3xl leading-none font-bold text-ink">Dear notebook,</p>
            <p class="mt-2 text-[15px] leading-snug text-ink">This is the sheet you asked for. Only the paper turns; these words stay level.</p>
          </Paper>
        </div>
      </Demo>
      <Panel title="Props">
        <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectRow label="stock" value={b.value.stock} options={STOCK_NAMES.map(n => ({
            value: n,
            label: n
          }))} onChange={v => set.value("stock", v)} />
          <SelectRow label="edge" value={b.value.edge} options={CHOICES.map(c => ({
            value: c,
            label: c === "sold" ? "as sold" as const : c === "mixed" ? "per side" as const : c
          }))} onChange={v => set.value("edge", v)} />
          <SelectRow label="rules" value={b.value.rules} options={[{
            value: "sold" as const,
            label: "as sold" as const
          }, ...RULES.map(r => ({
            value: r,
            label: r
          }))]} onChange={v => set.value("rules", v)} />
          <SelectRow label="shadow" value={b.value.shadow} options={[{
            value: "stock" as const,
            label: "the stock's own" as const
          }, {
            value: "none" as const,
            label: "none" as const
          }, ...SHADOWS.map(s => ({
            value: s,
            label: s
          }))]} onChange={v => set.value("shadow", v)} />
          <SelectRow label="tape" value={b.value.tape} options={[{
            value: "none" as const,
            label: "none" as const
          }, {
            value: "corner" as const,
            label: "corner" as const
          }, {
            value: "top" as const,
            label: "top" as const
          }, {
            value: "both" as const,
            label: "both corners" as const
          }]} onChange={v => set.value("tape", v)} />
          <SelectRow label="tapeKind" value={b.value.tapeKind} options={TAPE_KINDS.map(k => ({
            value: k,
            label: k
          }))} onChange={v => set.value("tapeKind", v)} />
          <SelectRow label="fastener" value={b.value.fastener} options={[{
            value: "none" as const,
            label: "none" as const
          }, ...FASTENERS.map(f => ({
            value: f,
            label: f
          }))]} onChange={v => set.value("fastener", v)} />
          <SwitchRow label="tilt (seeded)" checked={b.value.tilt} onChange={v => set.value("tilt", v)} class="content-end" />
        </div>
      </Panel>
      <CodeBlock lang="tsx" title="The same sheet in your code" code={buildCode(b.value)} />
    </div>;
  };
});
const SHADOW_USE: Record<SheetShadowKind, string> = {
  hair: "kbd caps, chips" as const,
  loose: "loose objects: stickers, tape" as const,
  lift: "popovers, menus, dialogs" as const,
  slip: "slips and scraps" as const,
  card: "index cards and cards" as const,
  pad: "the order pad" as const,
  check: "guest checks" as const,
  paper: "the big sheet" as const,
  sticky: "sticky notes (the foot is lifted)" as const
};
const Shadows = defineUi<{}>("Shadows", [], (_props, {
  slots: _slots
}) => {
  const lift = shallowRef(initialState(1));
  const setLift = stateSetter(lift);
  const k = shallowRef(initialState(1));
  const setK = stateSetter(k);
  return () => {
    return <div class="grid gap-5">
      <Panel>
        <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <SliderRow label="Lift" value={lift.value} min={0} max={2.5} step={0.1} onChange={setLift} format={v => v === 1 ? "1 (the token)" as const : v.toFixed(1)} hint="How high the sheet is held. Higher casts a longer, softer shadow; 0 leaves only the contact line." />
          <SliderRow label="--ll-shadow-k" value={k.value} min={0} max={3} step={0.1} onChange={setK} format={v => v.toFixed(1)} hint="Multiplies every alpha at once. A dark theme sets about 2.5." />
        </div>
      </Panel>
      <Demo label="The nine shadow stacks on the desk" surface="desk">
        <div data-ll-scope="" style={cssStyle({
          "--ll-shadow-k": k.value
        } as UI.CSSProperties)}>
          <ul role="list" aria-label="The nine shadow stacks" class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-x-6 gap-y-9 p-1">
            {SHADOWS.map(kind => <li key={kind} class="min-w-0">
                <div class="h-20 bg-paper" style={cssStyle({
                boxShadow: sheetShadow(kind, lift.value),
                borderRadius: "var(--ll-sheet-radius)" as const
              })} data-testid={`shadow-${kind}`} />
                <p class="mt-2 font-mono text-[13px] font-medium text-ink">{kind}</p>
                <p class="text-[14px] leading-snug text-ink-soft">{SHADOW_USE[kind]}</p>
              </li>)}
          </ul>
        </div>
      </Demo>
      <TableScroll label="The layers of each shadow stack">
        <table class="w-full min-w-[30rem] border-collapse text-[15px]">
          <caption class="sr-only">Offset, blur, spread and alpha of every layer in every shadow stack</caption>
          <thead>
            <tr>
              <th scope="col" class={th}>Stack</th>
              <th scope="col" class={th}>Token</th>
              <th scope="col" class={th}>Layers: y, blur, spread, alpha</th>
            </tr>
          </thead>
          <tbody>
            {SHADOWS.map(kind => <tr key={kind}>
                <th scope="row" class={cn(td, "text-start font-mono text-[13.5px] font-medium")}>{kind}</th>
                <td class={cn(td, "font-mono text-[13px]")}>--ll-shadow-{kind}</td>
                <td class={cn(td, "ll-num font-mono text-[13px]")}>{SHADOW_LAYERS[kind].map(([dy, blur, spread, a]) => `${dy} ${blur} ${spread} ${a}`).join("  ·  ")}</td>
              </tr>)}
          </tbody>
        </table>
      </TableScroll>
    </div>;
  };
});
const Tilt = defineUi<{}>("Tilt", [], (_props, {
  slots: _slots
}) => {
  const deg = shallowRef(initialState(1.2));
  const setDeg = stateSetter(deg);
  const calm = shallowRef(initialState(false));
  const setCalm = stateSetter(calm);
  const seed = shallowRef(initialState("my-card"));
  const setSeed = stateSetter(seed);
  const id = computed(() => "tilt-seed");
  const seeded = computed(() => tiltFor(seed.value, STOCKS.card.tilt));
  return () => {
    return <div class="grid gap-5">
      <Panel>
        <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <SliderRow label="Tilt the sheet" value={deg.value} min={-3} max={3} step={0.1} onChange={setDeg} format={v => `${v.toFixed(1)}°`} hint="CSS clamps it to ±2° (--ll-tilt-max), so 3 is the same as 2." />
          <SwitchRow label="Calm density" checked={calm.value} onChange={setCalm} hint="Calm sets --ll-tilt-max to 0: every sheet lies flat." class="content-start" />
        </div>
      </Panel>
      <Demo label="A sheet turned by the slider, with a level line through its text" surface="desk">
        <InkProvider density={calm.value ? "calm" as const : "comfortable" as const} defs={false}>
          <div class="grid min-h-48 place-items-center px-2 py-4">
            <Paper stock="card" tilt={deg.value} seed="tilt" size={[300, 130]} class="h-[130px] w-[300px] px-6 py-5" data-testid="tilt-sheet">
              <p class="border-b border-dashed border-ink/60 pb-1 font-script text-3xl leading-none font-bold text-ink">The text never tilts</p>
              <p class="mt-2 text-[15px] leading-snug text-ink">The dashed line is level. The paper behind it is not.</p>
            </Paper>
          </div>
        </InkProvider>
      </Demo>
      <div class="grid gap-2 sm:max-w-md">
        <Label for={id.value} class="text-[15px] font-bold">
          Any seed gets its own angle
        </Label>
        <Input id={id.value} value={seed.value} onChange={(e: Event) => setSeed((e.target as HTMLInputElement).value)} />
        <p class="text-[15px]" aria-live="polite">
          A <InlineCode>card</InlineCode> seeded <strong>{seed.value || "(nothing)"}</strong> lies at <strong class="ll-num font-mono" data-testid="seeded-tilt">{seeded.value > 0 ? "+" as const : "" as const}{seeded.value.toFixed(2)}°</strong>. The same seed gives the same angle on every machine.
        </p>
      </div>
    </div>;
  };
});
const ACCENTS: Accent[] = ["tomato", "tangerine", "lemon", "grass", "teal", "sky", "grape", "bubblegum"];
const TapeShelf = defineUi<{}>("TapeShelf", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="p-2">
      <div class="grid gap-8">
        <ul role="list" aria-label="The seven kinds of tape" class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-x-6 gap-y-5 p-0">
          {TAPE_KINDS.map(k => <li key={k} class="min-w-0">
              <Tape kind={k} length={104} height={28} seed={`shelf:${k}`} />
              <p class="mt-1 font-mono text-[13px] text-ink">{k}</p>
            </li>)}
        </ul>
        <ul role="list" aria-label="Four ways to end a strip of masking tape" class="m-0 flex list-none flex-wrap gap-x-7 gap-y-4 p-0">
          {(["saw", "torn", "straight", "scissor"] as const).map(e => <li key={e}>
              <Tape kind="masking" ends={e} length={86} height={26} seed={`ends:${e}`} />
              <p class="mt-1 font-mono text-[13px] text-ink">ends=&quot;{e}&quot;</p>
            </li>)}
        </ul>
        <ul role="list" aria-label="Washi tape in the eight accent colors" class="m-0 flex list-none flex-wrap gap-x-4 gap-y-3 p-0">
          {ACCENTS.map((c, i) => <li key={c}>
              <Tape kind={(["washi-dots", "washi-stripes", "washi-zigzag", "washi-gingham"] as const)[i % 4]} color={c} length={70} height={22} seed={`washi:${c}`} />
              <p class="mt-1 text-center font-mono text-[12px] text-ink">{c}</p>
            </li>)}
        </ul>
      </div>
    </div>;
  };
});
const FastenerShelf = defineUi<{}>("FastenerShelf", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="p-2">
      <ul role="list" aria-label="Paper clips, push-pins, a staple and a binder clip" class="m-0 flex list-none flex-wrap items-end gap-x-9 gap-y-5 p-0">
        {(["steel", "tomato", "sky", "grass"] as const).map(tone => <li key={`clip-${tone}`}>
            <Fastener kind="clip" tone={tone} seed={`clip:${tone}`} />
            <p class="mt-1 font-mono text-[12px] text-ink">clip · {tone}</p>
          </li>)}
        {(["tomato", "sky", "lemon", "grass"] as const).map((tone, i) => <li key={`pin-${tone}`}>
            <Fastener kind="pin" tone={tone} size={22 + i * 2} seed={`pin:${tone}`} />
            <p class="mt-1 font-mono text-[12px] text-ink">pin · {tone}</p>
          </li>)}
        <li>
          <Fastener kind="staple" seed="staple" />
          <p class="mt-1 font-mono text-[12px] text-ink">staple</p>
        </li>
        <li>
          <Fastener kind="binder-clip" seed="binder" />
          <p class="mt-1 font-mono text-[12px] text-ink">binder-clip</p>
        </li>
      </ul>
    </div>;
  };
});
const TILE_NOTE: Record<PaperTileName, string> = {
  relief: "Cold-press tooth, lit from the upper left. Big sheets: paper, card, napkin, parchment." as const,
  slip: "Fine tooth. Slips, index cards, sticky notes, graph and check stocks." as const,
  fibre: "Light and dark fibers with faint plant flecks. Sparse, so the file is tiny." as const,
  cloud: "A slow tonal mottling drawn very large, so a page never looks evenly gray." as const,
  kraft: "Fibrous, with a machine direction. Kraft only." as const,
  mottle: "Dyed-cloth mottling for the desk." as const,
  linen: "Plain-weave bookcloth over the desk color." as const
};
const Tiles = defineUi<{}>("Tiles", [], (_props, {
  slots: _slots
}) => {
  const names = computed(() => Object.keys(PAPER_TILES) as PaperTileName[]);
  const stretch = shallowRef(initialState(true));
  const setStretch = stateSetter(stretch);
  return () => {
    return <div class="grid gap-4">
      <InkTiles tiles={names.value} />
      <SwitchRow label="Stretch the contrast" checked={stretch.value} onChange={setStretch} hint="On cream the real tiles move about 3 of 255 levels. Stretched, you can see what they are made of." />
      <ul role="list" aria-label="The seven baked tiles, enlarged" class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5 p-0">
        {names.value.map(n => {
          const t = PAPER_TILES[n];
          return <li key={n} class="min-w-0">
              <div aria-hidden="true" class="h-28 border border-ink/40" style={cssStyle({
              backgroundColor: n === "linen" || n === "mottle" ? "var(--ll-desk)" as const : n === "kraft" ? "var(--ll-kraft)" as const : "var(--ll-paper)" as const,
              backgroundImage: `var(--ll-tex-${n})`,
              backgroundSize: `${t.cssWidth * 2}px ${t.cssHeight * 2}px`,
              filter: stretch.value ? "contrast(5)" as const : undefined
            })} />
              <p class="mt-1 font-mono text-[13px] font-medium text-ink">{n}</p>
              <p class="ll-num text-[14px] text-pencil-text">
                {t.cssWidth} × {t.cssHeight} css px · {(t.bytes / 1024).toFixed(1)} KB
              </p>
              <p class="text-[14px] leading-snug text-muted-foreground">{TILE_NOTE[n]}</p>
            </li>;
        })}
      </ul>
    </div>;
  };
});
const PaperPage = defineUi<{}>("PaperPage", [], (_props, {
  slots: _slots
}) => {
  const tooth = computed(() => Object.entries(TOOTH_TILES) as [keyof typeof TOOTH_TILES, typeof TOOTH_TILES[keyof typeof TOOTH_TILES]][]);
  return () => {
    return <>
      <Section id="sheet" title="A sheet is a recipe">
        <Prose>
          <p>
            Nothing on the desk is a flat rectangle. A sheet is a <strong>stock color</strong>, a baked <strong>tooth</strong> tile lit from the upper left, an <strong>edge</strong>, and a short warm
            <strong> shadow</strong> in umber. Only the sheet turns, by less than two degrees; the words on it never do. Paper looks right only against something darker than itself, so the
            pages below sit on the desk.
          </p>
          <p>
            The cheap case is the common one: <InlineCode>edge=&quot;cut&quot;</InlineCode> is plain CSS, so an ordinary <InlineCode>Card</InlineCode> draws no SVG at all. Torn, deckled and
            pinked sheets draw their outline once.
          </p>
        </Prose>
      </Section>

      <Section id="stocks" title="Nineteen stocks, seven edges" description="Pick an edge and every stock is cut that way. The stocks differ in color, tooth, shadow and the rules printed on them, not just in paint.">
        <StockExplorer />
        <StockTable />
      </Section>

      <Section id="builder" title="Build a sheet" description="Every prop of Paper on one page. The code below the sheet is what you would write.">
        <Builder />
      </Section>

      <Section id="shadows" title="Shadows" description="Warm umber, short, with a negative spread so only the soft part peeks out under the sheet. Never gray. Nine stacks, one multiplier.">
        <Shadows />
      </Section>

      <Section id="tilt" title="Tilt rules" description="Big sheets turn less than slips, and slips less than sticky notes.">
        <Prose>
          <ul>
            <li>A tilt is seeded: <InlineCode>tiltFor(seed, max)</InlineCode> is never under a quarter of the stock&apos;s maximum, so nothing lies exactly square.</li>
            <li>Ruled stocks turn less than half as much, because their lines would otherwise fight the text on them.</li>
            <li>CSS clamps every tilt to ±<InlineCode>--ll-tilt-max</InlineCode> (2°), and calm density sets that to 0.</li>
            <li>Only the sheet layer rotates. The text is upright, and so is anything you put on top.</li>
          </ul>
        </Prose>
        <Tilt />
      </Section>

      <Section id="props" title="Tape and fasteners" description="Small objects that hold a sheet to the desk. They are intrinsic drawings: complete in the server HTML, with no measuring, and hidden in calm density.">
        <Section id="tape" level={3} title="Tape">
          <Demo label="Seven kinds of tape, four ends, eight colors" surface="desk">
            <TapeShelf />
          </Demo>
        </Section>
        <Section id="fasteners" level={3} title="Clips, pins and staples">
          <Demo label="The four fasteners" surface="desk">
            <FastenerShelf />
          </Demo>
        </Section>
      </Section>

      <Section id="texture" title="Texture notes" description="There are no filters and no noise at runtime. The tooth is seven baked, seamless tiles, embedded as base64 in a generated module and laid over any stock color.">
        <Demo label="The baked paper and desk tiles, enlarged">
          <Tiles />
        </Demo>
        <Prose>
          <p>Which tiles a stock wears depends on its tooth:</p>
        </Prose>
        <TableScroll label="Which tiles each tooth is made of">
          <table class="w-full min-w-[26rem] border-collapse text-[15px]">
            <caption class="sr-only">The tiles layered by each tooth, top to bottom</caption>
            <thead>
              <tr>
                <th scope="col" class={th}>Tooth</th>
                <th scope="col" class={th}>Tiles, top to bottom</th>
                <th scope="col" class={th}>Stocks</th>
              </tr>
            </thead>
            <tbody>
              {tooth.value.map(([name, tiles]) => <tr key={name}>
                  <th scope="row" class={cn(td, "text-start font-mono text-[13.5px] font-medium")}>{name}</th>
                  <td class={cn(td, "font-mono text-[13px]")}>{tiles.map(([t, w, h]) => `${t} (${w}×${h})`).join(", ")}</td>
                  <td class={cn(td, "text-[14.5px]")}>
                    {STOCK_NAMES.filter(s => STOCKS[s].tooth === name).join(", ")}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </TableScroll>
        <Prose>
          <p>
            The periods are unrelated (192, 240 and 720 px for paper), so the layers never line up into a visible lattice. Each sheet gets seeded offsets, so no two sheets share a grid. Saturated
            sticky notes lay a veil of their own color over the tooth, or orange and pink would read as plaster.
          </p>
        </Prose>
      </Section>

      <Related items={[foundation("pens", "Pens", "The ink that goes on the paper."), foundation("color", "Color", "The stock colors and their contrast."), foundation("density", "Density", "Calm: flat, cut, hairline shadow."), component("paper", "Paper", "Every prop, with a11y notes."), component("card", "Card", "Paper with shadcn's layout."), component("tape", "Tape", "Strips for corners and labels.")]} />
    </>;
  };
});
export default PaperPage;
