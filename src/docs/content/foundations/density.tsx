// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { CodeBlock, InlineCode, Prose, Section } from "@/docs/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InkProvider } from "@/lib/ink/vue";
import { DEFAULT_KNOBS, resolveKnobs } from "@/lib/ink/recipes";
import { cn } from "@/lib/utils";
import { DENSITY } from "./_shared/data.generated";
import { Demo, Related, TableScroll, component, foundation, td, th } from "./_shared/kit";
import { measureTarget, type Size } from "./_shared/measure-target";
type Density = "comfortable" | "compact" | "calm";
const DENSITIES: readonly Density[] = ["comfortable", "compact", "calm"];
const ONE_LINER: Record<Density, string> = {
  comfortable: "The default. Full hand: wobble, taped and tilted sheets, solid fills. For marketing pages, onboarding, anything a thumb will touch." as const,
  compact: "The same hand in a smaller box. Hit sizes and control heights shrink, and the fill offset and the pen get a touch lighter. For app screens." as const,
  calm: "Hairline pencil, no wobble tricks, no jitter, no fill offset, flat sheets. For dense tables and long forms, where charm is a cost." as const
};
const ROWS: {
  token: string;
  label: string;
  unit?: string;
  note: string;
}[] = [{
  token: "--ll-hit" as const,
  label: "Hit size" as const,
  unit: "px" as const,
  note: "a token for your own controls (h-hit, size-hit); the library's controls set their own heights, see the table below. The floor, --ll-hit-min, is 24" as const
}, {
  token: "--ll-wobble" as const,
  label: "Wobble" as const,
  note: "how unsteady the hand is" as const
}, {
  token: "--ll-stroke-fine" as const,
  label: "Pen weight" as const,
  note: "scales every pen" as const
}, {
  token: "--ll-misreg-k" as const,
  label: "Misregistration" as const,
  note: "how far a fill misses its outline" as const
}, {
  token: "--ll-jitter-k" as const,
  label: "Word jitter" as const,
  note: "per-word baseline wander" as const
}, {
  token: "--ll-tilt-max" as const,
  label: "Largest sheet tilt" as const,
  note: "no sheet turns further" as const
}];
const clean = (v: string | undefined) => (v ?? "").replace(/px$/, "");
const Numbers = defineUi<{}>("Numbers", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TableScroll label="What each density sets">
      <table class="w-full min-w-[32rem] border-collapse text-[15px]">
        <caption class="sr-only">The knobs each density sets, as read from the stylesheet</caption>
        <thead>
          <tr>
            <th scope="col" class={th}>Knob</th>
            {DENSITIES.map(d => <th key={d} scope="col" class={th}>{d}</th>)}
            <th scope="col" class={th}>Meaning</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(r => <tr key={r.token}>
              <th scope="row" class={cn(td, "text-start")}>
                {r.label}
                <code class="block font-mono text-[12.5px] font-normal text-pencil-text">{r.token}</code>
              </th>
              {DENSITIES.map(d => <td key={d} class={cn(td, "ll-num font-mono text-[13.5px]")}>
                  {clean(DENSITY[d][r.token])}
                  {r.unit ?? ""}
                </td>)}
              <td class={cn(td, "text-[14.5px]")}>{r.note}</td>
            </tr>)}
          <tr>
            <th scope="row" class={cn(td, "text-start")}>
              Engine multipliers
              <code class="block font-mono text-[12.5px] font-normal text-pencil-text">resolveKnobs()</code>
            </th>
            {DENSITIES.map(d => {
              const k = resolveKnobs(DEFAULT_KNOBS, d);
              return <td key={d} class={cn(td, "ll-num font-mono text-[12.5px] leading-snug")}>
                  {d === "calm" ? "own calm flag" as const : `misreg ×${k.misreg}, width ×${k.width}`}
                </td>;
            })}
            <td class={cn(td, "text-[14.5px]")}>calm hands the engine its own switch: hairline, wobble ×0.3, no fill offset, low tier</td>
          </tr>
        </tbody>
      </table>
    </TableScroll>;
  };
});
const SettingsCard = defineUi<{
  density: Density;
}>("SettingsCard", ["density"], (_props, {
  slots: _slots
}) => {
  const density = computed(() => _props["density"]);
  const id = useId();
  return () => {
    return <InkProvider density={density.value} defs={false}>
      <Card seed={`density:${density.value}`} tape="corner" class="w-full gap-4 py-5" data-testid={`card-${density.value}`}>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>How you show up on the page.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-3">
          <div class="grid gap-1.5">
            <Label for={`${id}-name`}>Name</Label>
            <Input id={`${id}-name`} defaultValue="Ada Lovelace" />
          </div>
          <div class="flex items-center gap-2.5">
            <Checkbox id={`${id}-weekly`} defaultChecked />
            <Label for={`${id}-weekly`}>The weekly page</Label>
          </div>
          <div class="flex items-center gap-2.5">
            <Switch id={`${id}-public`} defaultChecked />
            <Label for={`${id}-public`}>Public profile</Label>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <ToggleGroup type="single" variant="outline" size="sm" defaultValue="list" aria-label="Layout">
              <ToggleGroupItem value="list">List</ToggleGroupItem>
              <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            </ToggleGroup>
            <Badge variant="secondary">3 drafts</Badge>
          </div>
        </CardContent>
        <CardFooter class="flex-wrap justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </InkProvider>;
  };
});
const SideBySide = defineUi<{}>("SideBySide", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container">
      <ul role="list" class="m-0 grid list-none gap-x-6 gap-y-10 p-0 @md:grid-cols-2 @2xl:grid-cols-3">
        {DENSITIES.map(d => <li key={d} class="min-w-0">
            <p class="mb-3 font-script text-2xl leading-none font-bold">
              {d}{" "}
              <span class="ll-num font-mono text-[13px] font-normal text-pencil-text">hit {clean(DENSITY[d]["--ll-hit"])} px</span>
            </p>
            <SettingsCard density={d} />
          </li>)}
      </ul>
    </div>;
  };
});
const Box = defineUi<{
  name: string;
  onMeasure: (name: string, size: Size) => void;
  children: UI.VueNode;
}>("Box", ["name", "onMeasure"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const onMeasure = computed(() => _props["onMeasure"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = shallowRef<HTMLSpanElement | null>(null);
  const grow = shallowRef(initialState(0));
  const setGrow = stateSetter(grow);
  watchDependencies(() => {
    const el = ref.value;
    if (!el) return;
    const measure = () => {
      const size = measureTarget(el);
      setGrow(size.grow);
      onMeasure.value(name.value, size);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, () => [name.value, onMeasure.value], true);
  return () => {
    return <span ref={ref} class="inline-flex outline-1 outline-dashed outline-ink-you/70" style={cssStyle({
      outlineOffset: grow.value
    })} data-hit={name.value}>
      {readSlot(_slots.default)}
    </span>;
  };
});
const HitRow = defineUi<{
  density: Density;
}>("HitRow", ["density"], (_props, {
  slots: _slots
}) => {
  const density = computed(() => _props["density"]);
  const sizes = shallowRef<Record<string, Size>>(initialState({}));
  const setSizes = stateSetter(sizes);
  const measure = (name: string, size: Size) => setSizes(s => s[name]?.w === size.w && s[name]?.h === size.h ? s : {
    ...s,
    [name]: size
  });
  const label = computed(() => (name: string) => sizes.value[name] && sizes.value[name]!.h > 0 ? `${sizes.value[name]!.w} × ${sizes.value[name]!.h}` : "n/a" as const);
  return () => {
    return <InkProvider density={density.value} defs={false}>
      <div data-testid={`hits-${density.value}`}>
        <p class="mb-2 font-script text-xl leading-none font-bold">{density.value}</p>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Box name="Button" onMeasure={measure}>
            <Button>Save</Button>
          </Box>
          <Box name="Icon button" onMeasure={measure}>
            <Button size="icon" variant="outline" aria-label={`Add (${density.value})`}>
              <Icon name="plus" />
            </Button>
          </Box>
          <Box name="Input" onMeasure={measure}>
            <Input aria-label={`Name (${density.value})`} defaultValue="Ada" class="w-28" />
          </Box>
          <Box name="Checkbox" onMeasure={measure}>
            <Checkbox aria-label={`Weekly (${density.value})`} defaultChecked />
          </Box>
          <Box name="Switch" onMeasure={measure}>
            <Switch aria-label={`Public (${density.value})`} defaultChecked />
          </Box>
        </div>
        <dl class="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-ink-soft">
          {["Button", "Icon button", "Input", "Checkbox", "Switch"].map(n => <div key={n} class="flex gap-1.5">
              <dt>{n}</dt>
              <dd class="ll-num font-mono">{label.value(n)}</dd>
            </div>)}
        </dl>
      </div>
    </InkProvider>;
  };
});
const CHANGES: [string, string, string, string][] = [["Outline", "One felt-tip loop whose ends meet, edges ruled straight.", "The same, a touch finer (pen ×0.94).", "One hairline pencil loop."], ["Fill", "One solid pass, in register.", "The same.", "The same, a shade lighter."], ["Hover", "Drop-lines, a slight turn of the drawing, the fill nudging further off.", "The same.", "A second inset hairline. Still visible without hue."], ["Focus", "A blue ring with corner ticks, 2.2 px, 4 px off.", "The same.", "The same. The ring is never toned down."], ["Word jitter", "Every word a hair off the baseline.", "Written lighter (×0.7).", "Off."], ["Sheets", "A seeded tilt up to 2°, torn or deckled edges, a full umber shadow.", "The same.", "Flat, a plain cut edge, a hairline shadow."], ["Tape, clips, pins", "Shown.", "Shown.", "Hidden."], ["Boil", "Runs on the things that are alive.", "Runs.", "Stands still."], ["Button height", "36 px", "32 px", "28 px"]];
const Changes = defineUi<{}>("Changes", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TableScroll label="What each density does to the drawing">
      <table class="w-full min-w-[40rem] border-collapse text-[15px]">
        <caption class="sr-only">What changes in the drawing from comfortable to compact to calm</caption>
        <thead>
          <tr>
            <th scope="col" class={th}>Thing</th>
            {DENSITIES.map(d => <th key={d} scope="col" class={th}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {CHANGES.map(([thing, a, b, c]) => <tr key={thing}>
              <th scope="row" class={cn(td, "text-start font-bold")}>{thing}</th>
              <td class={cn(td, "text-[14.5px]")}>{a}</td>
              <td class={cn(td, "text-[14.5px]")}>{b}</td>
              <td class={cn(td, "text-[14.5px]")}>{c}</td>
            </tr>)}
        </tbody>
      </table>
    </TableScroll>;
  };
});
const DensityPage = defineUi<{}>("DensityPage", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <>
      <Section id="dial" title="Charm is a dial">
        <Prose>
          <p>
            A wobbling pen is delightful on a sign-up button and exhausting on the four-hundredth row of a table. So the hand has three settings, and they are one attribute
            away: <InlineCode>data-density</InlineCode> on any element, or the <InlineCode>density</InlineCode> prop of the provider.
          </p>
          <ul>
            {DENSITIES.map(d => <li key={d}>
                <strong>{d}.</strong> {ONE_LINER[d]}
              </li>)}
          </ul>
        </Prose>
      </Section>

      <Section id="side-by-side" title="The same card, three densities" description="One component, one seed for its hand, three providers. Look at the outlines, the fills, the tape at the corner, and how far the sheet leans.">
        <Demo label="An account card in comfortable, compact and calm density">
          <SideBySide />
        </Demo>
      </Section>

      <Section id="numbers" title="The numbers" description="Read from the stylesheet when this page was built. Compact is a smaller box, not a quieter hand; calm changes almost everything.">
        <Numbers />
      </Section>

      <Section id="hit-boxes" title="Hit boxes, measured" description="The dashed line is the real hit area, measured in your browser right now: the element's box, or the ::after that a checkbox or switch uses to grow its target. The drawing may be smaller than the target, never larger, and no target is under 24 px.">
        <Demo label="Five controls in each density, outlined at their real size">
          <div class="grid gap-6">
            {DENSITIES.map(d => <HitRow key={d} density={d} />)}
          </div>
        </Demo>
      </Section>

      <Section id="what-changes" title="What actually changes">
        <Changes />
        <Prose>
          <p>
            Some things never change with density: labels stay at 14 px or more, text input at 16 px on touch, chart axes at 12 px, and every hit box at 24 px or more. Calm is quieter, not smaller
            print.
          </p>
        </Prose>
      </Section>

      <Section id="using" title="Choosing and setting it">
        <Prose>
          <ul>
            <li><strong>Comfortable</strong> for marketing, onboarding, empty states and anything that wants to be remembered.</li>
            <li><strong>Compact</strong> for the working screens of an app: lists, settings, dashboards.</li>
            <li><strong>Calm</strong> for admin tables, long forms and anything a person will stare at for an hour.</li>
          </ul>
          <p>Density nests. A calm table inside a comfortable page is one wrapper.</p>
        </Prose>
        <CodeBlock lang="tsx" title="Three ways to set it" code={`// the whole app (the provider also tells the drawing engine)
<InkProvider density="compact">…</InkProvider>

<section data-density="calm">…</section>

<Button className="compact:h-8 calm:h-7">Save</Button>`} />
      </Section>

      <Related items={[foundation("pens", "Pens", "The hand that calm quiets."), foundation("paper", "Paper", "Flat sheets and plain cuts."), foundation("motion", "Motion", "Why calm stops the boil."), foundation("theming", "Theming", "Density is a token block like any other."), component("table", "Table", "The component calm is for.")]} />
    </>;
  };
});
export default DensityPage;
