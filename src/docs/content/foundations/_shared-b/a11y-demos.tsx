// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef, toValue, type MaybeRefOrGetter } from "vue";
import { Direction } from "@/lib/primitives";
import { Boil } from "@/components/ui/boil";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Doodle } from "@/components/ui/doodle";
import { Handwritten } from "@/components/ui/handwritten";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mascot } from "@/components/ui/mascot";
import { Seal } from "@/components/ui/seal";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Stamp } from "@/components/ui/stamp";
import { Sticker } from "@/components/ui/sticker";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { InkProvider } from "@/lib/ink/vue";
import { Chip, InlineCode, Stage } from "@/docs/kit";
import { CONTRAST_ROWS, type ContrastRow } from "./contrast-data.generated";
import { DataTable, Specimen } from "./layout";
export const KeyboardStrip = defineUi<{}>("KeyboardStrip", [], (_props, {
  slots: _slots
}) => {
  const id = useId();
  return () => {
    return <Stage layout="stack" label="Controls to try with the keyboard">
      <div class="flex w-full flex-col gap-5 text-ink">
        <p class="m-0 text-pencil-text">Click into the page, then press Tab. Each control takes one stop; the toggle group takes one stop for all three and the arrow keys move inside it.</p>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button variant="outline">Save</Button>
          <span class="flex items-center gap-2">
            <Checkbox id={`${id}-remember`} />
            <Label for={`${id}-remember`}>Remember me</Label>
          </span>
          <span class="flex items-center gap-2">
            <Switch id={`${id}-notify`} />
            <Label for={`${id}-notify`}>Notify me</Label>
          </span>
        </div>
        <ToggleGroup type="single" variant="outline" size="sm" defaultValue="center" aria-label="Alignment">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
        <Slider aria-label="Pencil pressure" defaultValue={[40]} class="max-w-sm" />
      </div>
    </Stage>;
  };
});
const FORCED = {
  "data-focus-visible": true
} as const;
export const FocusSpecimens = defineUi<{}>("FocusSpecimens", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Stage layout="center" label="The focus ring on four controls">
      <Specimen caption="default">
        <Button {...domProps(FORCED)}>Save</Button>
      </Specimen>
      <Specimen caption="outline">
        <Button variant="outline" {...domProps(FORCED)}>
          Cancel
        </Button>
      </Specimen>
      <Specimen caption="ghost">
        <Button variant="ghost" {...domProps(FORCED)}>
          More
        </Button>
      </Specimen>
      <Specimen caption="destructive">
        <Button variant="destructive" {...domProps(FORCED)}>
          Delete
        </Button>
      </Specimen>
      <Specimen caption="icon button">
        <Button size="icon" variant="outline" aria-label="Settings" {...domProps(FORCED)}>
          <Icon name="settings" />
        </Button>
      </Specimen>
      <Specimen caption="toggle">
        <Toggle variant="outline" aria-label="Bold" {...domProps(FORCED)}>
          <Icon name="bold" />
        </Toggle>
      </Specimen>
    </Stage>;
  };
});
const HEADLINE: readonly string[] = ["card-foreground|card", "foreground|background", "--ll-ink-soft|--ll-paper", "muted-foreground|card", "muted-foreground|background", "--ll-ink-you|--ll-paper", "--ll-red|--ll-paper", "--ll-green|--ll-paper", "primary-foreground|primary", "destructive-foreground|destructive", "ring|card", "ring|background", "border|card", "--ll-ink|--ll-tomato"];
const key = (r: ContrastRow) => `${r.fg}|${r.bg}`;
export const HEADLINE_ROWS: readonly ContrastRow[] = HEADLINE.map(k => CONTRAST_ROWS.find(r => key(r) === k)).filter((r): r is ContrastRow => !!r);
export function gradeOf(ratio: number): string {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large text and marks";
  return "decorative only";
}
const ratioText = (r: number) => `${r.toFixed(2)} : 1`;
const ContrastTable = defineUi<{
  rows: readonly ContrastRow[];
  label: string;
}>("ContrastTable", ["rows", "label"], (_props, {
  slots: _slots
}) => {
  const rows = computed(() => _props["rows"]);
  const label = computed(() => _props["label"]);
  return () => {
    return <DataTable label={label.value} minWidth="40rem">
      <thead>
        <tr>
          <th scope="col">Sample</th>
          <th scope="col">Pair</th>
          <th scope="col">Ratio</th>
          <th scope="col">Needs</th>
          <th scope="col">Verdict</th>
        </tr>
      </thead>
      <tbody>
        {rows.value.map(r => {
          const known = r.level === "warn" && r.ratio < r.min;
          return <tr key={`${key(r)}|${r.purpose}`}>
              <td>
                <span class="inline-block min-w-14 px-3 py-1 text-center font-script text-2xl leading-none" style={cssStyle({
                color: r.fgHex,
                background: r.bgHex
              })} aria-hidden="true">
                  Aa
                </span>
              </td>
              <td>
                {r.purpose}
                <span class="block font-mono text-xs text-pencil-text">
                  {r.fg} on {r.bg}
                </span>
              </td>
              <td class="font-type whitespace-nowrap">{ratioText(r.ratio)}</td>
              <td class="font-type whitespace-nowrap">{ratioText(r.min)}</td>
              <td>{known ? <Chip tone="experimental">known limit</Chip> : gradeOf(r.ratio)}</td>
            </tr>;
        })}
      </tbody>
    </DataTable>;
  };
});
export const ContrastSection = defineUi<{}>("ContrastSection", [], (_props, {
  slots: _slots
}) => {
  const all = shallowRef(initialState(false));
  const setAll = stateSetter(all);
  const sections = computed(() => [...new Set(CONTRAST_ROWS.map(r => r.section))]);
  return () => {
    return <div data-slot="contrast">
      <ContrastTable rows={HEADLINE_ROWS} label="The contrast pairs people ask about" />
      <p class="mt-4">
        <Button variant="outline" size="sm" onClick={() => setAll(v => !v)} aria-expanded={all.value} aria-controls="all-contrast">
          {all.value ? "Hide the full table" as const : `Show all ${CONTRAST_ROWS.length} pairs`}
        </Button>
      </p>
      {all.value ? <div id="all-contrast" class="mt-4 flex flex-col gap-8">
          {sections.value.map(s => <div key={s}>
              <h3 class="m-0 mb-2 font-script text-2xl text-ink">{s}</h3>
              <ContrastTable rows={CONTRAST_ROWS.filter(r => r.section === s)} label={s} />
            </div>)}
        </div> : null}
    </div>;
  };
});
const MotionThings = defineUi<{
  seed: string;
}>("MotionThings", ["seed"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-ink">
      <Spinner class="size-10" />
      <TypingIndicator label="Someone is typing" />
      <Boil>
        <Doodle name="sun" size={64} seed={seed.value} />
      </Boil>
    </div>;
  };
});
export const MotionCompare = defineUi<{}>("MotionCompare", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Stage layout="center" label="The same animations, with and without calm ink">
      <Specimen caption="follows your system setting" class="min-w-64 flex-1">
        <MotionThings seed="system" />
      </Specimen>
      <Specimen caption={<>inside <code>motion=&quot;reduced&quot;</code>: nothing moves, and nothing is left half drawn</>} class="min-w-64 flex-1">
        <InkProvider motion="reduced" defs={false}>
          <MotionThings seed="reduced" />
        </InkProvider>
      </Specimen>
    </Stage>;
  };
});
const RtlPane = defineUi<{
  dir: "ltr" | "rtl";
  idPrefix: string;
}>("RtlPane", ["dir", "idPrefix"], (_props, {
  slots: _slots
}) => {
  const dir = computed(() => _props["dir"]);
  const idPrefix = computed(() => _props["idPrefix"]);
  return () => {
    return <Direction.DirectionProvider dir={dir.value}>
      <div dir={dir.value} class="flex w-full min-w-56 flex-1 flex-col gap-4 text-ink">
        <div class="flex flex-wrap items-center gap-3">
          <Button variant="outline">
            <Icon name="arrow-left" />
            Back
          </Button>
          <Button>
            Next
            <Icon name="arrow-right" />
          </Button>
        </div>
        <div class="flex items-center gap-3">
          <Icon name="chevron-right" size={24} />
          <Icon name="panel-left" size={24} />
          <Icon name="undo-2" size={24} />
          <span class="text-sm text-pencil-text">direction glyphs turn around</span>
        </div>
        <Input placeholder="Search the notebook" aria-label={`Search (${dir.value})`} />
        <span class="flex items-center gap-2">
          <Checkbox id={`${idPrefix.value}-c`} defaultChecked />
          <Label for={`${idPrefix.value}-c`}>Remember me</Label>
        </span>
        <Slider aria-label={`Pencil pressure (${dir.value})`} defaultValue={[35]} dir={dir.value} />
      </div>
    </Direction.DirectionProvider>;
  };
});
export const RtlCompare = defineUi<{}>("RtlCompare", [], (_props, {
  slots: _slots
}) => {
  const id = useId();
  return () => {
    return <Stage layout="center" label="Left to right and right to left, side by side">
      <RtlPane dir="ltr" idPrefix={`${id}-ltr`} />
      <RtlPane dir="rtl" idPrefix={`${id}-rtl`} />
    </Stage>;
  };
});
const DENSITIES = [{
  density: "comfortable" as const,
  hit: 36
}, {
  density: "compact" as const,
  hit: 32
}, {
  density: "calm" as const,
  hit: 28
}] as const;
export const TargetsDemo = defineUi<{}>("TargetsDemo", [], (_props, {
  slots: _slots
}) => {
  const hits = shallowRef(initialState(true));
  const setHits = stateSetter(hits);
  const id = useId();
  return () => {
    return <div data-slot="targets">
      <div class="mb-4 flex items-center gap-3">
        <Switch id={id} checked={hits.value} onCheckedChange={setHits} />
        <Label for={id}>Outline each button&apos;s real box</Label>
      </div>
      <Stage layout="center" label="Buttons at three densities">
        {DENSITIES.map(({
          density,
          hit
        }) => <Specimen key={density} caption={<>{density}: {hit} px tall</>} class="min-w-40 flex-1">
            <InkProvider density={density} defs={false}>
              <div class={hits.value ? "flex flex-wrap items-center justify-center gap-3 [&_button]:outline-1 [&_button]:outline-dashed [&_button]:outline-red" as const : "flex flex-wrap items-center justify-center gap-3" as const}>
                <Button variant="outline">Save</Button>
                <Button size="icon" variant="outline" aria-label={`Settings (${density})`}>
                  <Icon name="settings" />
                </Button>
              </div>
            </InkProvider>
          </Specimen>)}
      </Stage>
    </div>;
  };
});
const ATTRS = ["role", "aria-hidden", "aria-label", "focusable"] as const;
function useProbe() {
  const ref = shallowRef<HTMLSpanElement | null>(null);
  const text = shallowRef(initialState(""));
  const setText = stateSetter(text);
  watchDependencies(() => {
    const svg = ref.value?.querySelector("svg");
    if (!svg) return;
    setText(ATTRS.flatMap(a => svg.hasAttribute(a) ? [`${a}="${svg.getAttribute(a)}"`] : []).join(" "));
  }, () => [], false);
  return computed(() => {
    return {
      ref,
      text: text.value
    };
  });
}
const ProbeRow = defineUi<{
  code: string;
  children: UI.VueNode;
}>("ProbeRow", ["code"], (_props, {
  slots: _slots
}) => {
  const code = computed(() => _props["code"]);
  const children = renderValue(() => readSlot(_slots.default));
  const _hook2 = useProbe();
  const ref = computed(() => _hook2.value.ref);
  const text = computed(() => _hook2.value.text);
  return () => {
    return <tr data-probe="">
      <td>
        <span ref={ref.value} class="inline-flex min-h-8 items-center">
          {readSlot(_slots.default)}
        </span>
      </td>
      <td>
        <code class="font-mono text-sm break-all">{code.value}</code>
      </td>
      <td>
        <code class="font-mono text-sm break-all" data-attrs="">
          {text.value || "..."}
        </code>
      </td>
    </tr>;
  };
});
export const ScreenReaderProbe = defineUi<{}>("ScreenReaderProbe", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <DataTable label="What the DOM says about each kind of drawing" minWidth="38rem">
      <thead>
        <tr>
          <th scope="col">Drawn</th>
          <th scope="col">You write</th>
          <th scope="col">The svg carries</th>
        </tr>
      </thead>
      <tbody>
        <ProbeRow code='<Icon name="trash" />'>
          <Icon name="trash" size={24} />
        </ProbeRow>
        <ProbeRow code='<Icon name="trash" label="Delete" />'>
          <Icon name="trash" size={24} label="Delete" />
        </ProbeRow>
        <ProbeRow code='<Doodle name="star" />'>
          <Doodle name="star" size={48} />
        </ProbeRow>
        <ProbeRow code='<Sticker name="rocket" />'>
          <Sticker name="rocket" size={48} />
        </ProbeRow>
        <ProbeRow code='<Sticker name="rocket" label="Launched" />'>
          <Sticker name="rocket" size={48} label="Launched" />
        </ProbeRow>
        <ProbeRow code='<Stamp name="stamp-approved" />'>
          <Stamp name="stamp-approved" />
        </ProbeRow>
        <ProbeRow code='<Seal text="BEST" size={48} />'>
          <Seal text="BEST" size={48} />
        </ProbeRow>
        <ProbeRow code='<Mascot pose="wave" />'>
          <Mascot pose="wave" size={48} />
        </ProbeRow>
      </tbody>
    </DataTable>;
  };
});
const SENTENCE = "Ask Sam about the pond, and bring the big umbrella!";
export const JitterDemo = defineUi<{}>("JitterDemo", [], (_props, {
  slots: _slots
}) => {
  const ref = shallowRef<HTMLElement | null>(null);
  const plain = shallowRef(initialState(""));
  const setPlain = stateSetter(plain);
  watchDependencies(() => {
    setPlain(ref.value?.textContent ?? "");
  }, () => [], false);
  return () => {
    return <Stage layout="stack" label="Handwritten text">
      <div class="flex w-full flex-col gap-4 text-ink">
        <Handwritten as="p" class="m-0 font-script text-3xl" strength={2} ref={ref}>
          {SENTENCE}
        </Handwritten>
        <p class="m-0 text-pencil-text">
          <strong class="text-ink">textContent:</strong> <span data-plain="">{plain.value || "..."}</span>
        </p>
        <p class="m-0 text-pencil-text">
          <strong class="text-ink">strength=&#123;0&#125;:</strong> <InlineCode>&lt;Handwritten strength=&#123;0&#125;&gt;</InlineCode> renders the text with no spans at all.
        </p>
      </div>
    </Stage>;
  };
});
