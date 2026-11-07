// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { Mascot } from "@/components/ui/mascot";
import { Paper } from "@/components/ui/paper";
import { Switch } from "@/components/ui/switch";
import { resolveIconName } from "@/lib/ink/art/icons";
import { useAnchorHref } from "@/docs/core/router";
import { Chip, EmptyState, InlineCode, Section } from "@/docs/kit";
import { ICON_BY_ID, ICON_ENTRIES, ICON_FAMILIES, undrawnIcons, type IconEntry } from "./catalog";
import { Choice, ControlLabel, SearchField, SizeSlider, Toolbar, ToolbarRow } from "./controls";
import { CopyStatus, ResultCount, RovingGroup, Tile, TileGrid, useCopyStatus } from "./gallery";
import { search } from "./search";
import { iconSnippet, iconTierLabel, iconTierWord, importLine } from "./snippets";
const PRESET_SIZES = [12, 16, 20, 24, 32, 48, 64, 96] as const;
type Tone = "ui" | "doodle";
const MICRO_COUNT = ICON_ENTRIES.filter(e => e.micro).length;
const EXTRA_COUNT = ICON_ENTRIES.filter(e => e.hi).length;
export function tierSentence(px: number): string {
  switch (iconTierWord(px)) {
    case "micro":
      return `Micro redraws: ${MICRO_COUNT} icons have one, the rest use the 16 px redraw.`;
    case "small":
      return "The 16 px redraw: a heavier pen and fewer details.";
    case "master":
      return "The 24 px master.";
    default:
      return `The master, plus extra detail on the ${EXTRA_COUNT} icons that have it.`;
  }
}
export function aliasHint(e: IconEntry, needle: string): string | undefined {
  if (!needle || e.id.includes(needle)) return undefined;
  const alias = e.aliases.find(a => a.includes(needle));
  return alias ? `also ${alias}` : undefined;
}
export interface IconFilter {
  query: string;
  family: string;
  washOnly: boolean;
}
export function filterIcons(entries: readonly IconEntry[], {
  query,
  family,
  washOnly
}: IconFilter): IconEntry[] {
  let pool = family === "all" ? entries : entries.filter(e => e.family === family);
  if (washOnly) pool = pool.filter(e => e.accent);
  return search(pool, query.trim(), resolveIconName);
}
const IconDock = defineUi<{
  id: string | null;
  size: number;
  tone: Tone;
  snippet: string;
  copied: boolean;
  onCopy: () => void;
}>("IconDock", ["id", "size", "tone", "snippet", "copied", "onCopy"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const size = computed(() => _props["size"]);
  const tone = computed(() => _props["tone"]);
  const snippet = computed(() => _props["snippet"]);
  const copied = computed(() => _props["copied"]);
  const onCopy = computed(() => _props["onCopy"]);
  const entry = computed(() => id.value ? ICON_BY_ID.get(id.value) : undefined);
  return () => {
    return <Paper stock="slip" tilt={false} class="z-(--ll-z-sticky) mt-6 p-3 md:sticky md:bottom-3" data-dock="">
      {entry.value ? <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div class="grid size-28 shrink-0 place-items-center bg-graph text-ink shadow-hair" aria-hidden="true">
            <Icon name={entry.value.id} size={size.value} tone={tone.value} />
          </div>
          <div class="min-w-48 flex-1">
            <p class="m-0 font-script text-3xl leading-none text-ink">{entry.value.id}</p>
            <p class="text-[15px] text-muted-foreground mt-1 mb-2">
              {size.value} px: {iconTierLabel(entry.value.id, size.value)}
              {entry.value.aliases.length ? <> · also written {entry.value.aliases.map((a, i) => <span key={a}>{i ? ", " as const : "" as const}<InlineCode>{a}</InlineCode></span>)}</> : null}
            </p>
            <p class="m-0 flex flex-wrap items-center gap-1.5">
              {entry.value.micro ? <Chip tone="outline">micro redraw</Chip> : null}
              {entry.value.hi ? <Chip tone="outline">extra detail at 41 px</Chip> : null}
              {entry.value.accent ? <Chip tone="outline">wash: {entry.value.accent}</Chip> : null}
              {entry.value.rtl ? <Chip tone="outline">flips in RTL</Chip> : null}
            </p>
          </div>
          <div class="flex min-w-56 flex-col items-start gap-2">
            <code class="font-mono text-sm break-all text-ink">{snippet.value}</code>
            <code class="font-mono text-xs break-all text-pencil-text">{importLine("Icon")}</code>
            <Button size="sm" onClick={onCopy.value}>
              <Icon name={copied.value ? "check" as const : "copy" as const} />
              {copied.value ? "Copied" as const : "Copy JSX" as const}
            </Button>
          </div>
        </div> : <div class="flex items-center gap-4">
          <Mascot pose="point" size={48} />
          <p class="m-0 text-ink">
            Press an icon to copy its JSX. <span class="text-pencil-text">Arrow keys move between icons; Tab moves on.</span>
          </p>
        </div>}
    </Paper>;
  };
});
export const IconBrowser = defineUi<{}>("IconBrowser", [], (_props, {
  slots: _slots
}) => {
  const hintId = useId();
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const family = shallowRef(initialState("all"));
  const setFamily = stateSetter(family);
  const tone = shallowRef<Tone>(initialState("ui"));
  const setTone = stateSetter(tone);
  const size = shallowRef(initialState(32));
  const setSize = stateSetter(size);
  const washOnly = shallowRef(initialState(false));
  const setWashOnly = stateSetter(washOnly);
  const selected = shallowRef<string | null>(initialState(null));
  const setSelected = stateSetter(selected);
  const _hook13 = useCopyStatus();
  const copied = computed(() => _hook13.value.copied);
  const message = computed(() => _hook13.value.message);
  const copy = computed(() => _hook13.value.copy);
  const deferredQuery = computed(() => query.value);
  const deferredSize = computed(() => size.value);
  const wash = computed(() => tone.value === "doodle" && washOnly.value);
  const filter = computed(() => ({
    query: deferredQuery.value,
    family: family.value,
    washOnly: wash.value
  }));
  const results = computed(() => filterIcons(ICON_ENTRIES, filter.value));
  const grouped = computed(() => !filter.value.query.trim() && family.value === "all");
  const groups = computed(() => grouped.value ? ICON_FAMILIES.map(f => ({
    family: f,
    items: results.value.filter(e => e.family === f.key)
  })).filter(g => g.items.length) : []);
  const box = computed(() => Math.max(deferredSize.value, 24));
  const tileHeight = computed(() => box.value + 64);
  const minTile = computed(() => Math.max(112, box.value + 32));
  const snippetFor = computed(() => (id: string) => iconSnippet(id, {
    size: size.value,
    tone: tone.value
  }));
  const press = computed(() => (id: string) => {
    setSelected(id);
    void copy.value(id, snippetFor.value(id));
  });
  const needle = computed(() => filter.value.query.trim().toLowerCase());
  const renderTile = renderValue(() => (e: IconEntry) => <Tile key={e.id} id={e.id} name={e.id} hint={aliasHint(e, needle.value)} selected={selected.value === e.id} copied={copied.value === e.id} onPress={() => press.value(e.id)} style={cssStyle({
    minHeight: tileHeight.value
  })}>
      <span class="flex items-center justify-center" style={cssStyle({
      width: box.value,
      height: box.value
    })} aria-hidden="true">
        <Icon name={e.id} size={deferredSize.value} tone={tone.value} />
      </span>
    </Tile>);
  const familyOptions = computed(() => [{
    value: "all" as const,
    label: `All ${ICON_ENTRIES.length}`
  }, ...ICON_FAMILIES.map(f => ({
    value: f.key,
    label: `${f.label} ${f.ids.length}`
  }))]);
  const undrawnHit = computed(() => results.value.length === 0 && filter.value.query.trim() ? undrawnIcons().find(u => resolveIconName(u.name) === resolveIconName(filter.value.query.trim())) : undefined);
  return () => {
    return <div data-slot="icon-browser">
      <Toolbar>
        <ToolbarRow>
          <SearchField label="Search icons" value={query.value} onChange={setQuery} placeholder="Search by name, alias or idea: arrow, Trash2, warning" class="min-w-64 flex-1" />
          <ResultCount shown={results.value.length} total={ICON_ENTRIES.length} noun="icons" />
        </ToolbarRow>
        <div class="flex flex-col gap-1.5">
          <ControlLabel>Family</ControlLabel>
          <Choice label="Family" value={family.value} onChange={setFamily} options={familyOptions.value} />
        </div>
        <ToolbarRow>
          <div class="flex flex-col gap-1.5">
            <ControlLabel>Tone</ControlLabel>
            <Choice label="Tone" value={tone.value} onChange={setTone} options={[{
              value: "ui" as const,
              label: "ui: ink only" as const
            }, {
              value: "doodle" as const,
              label: "doodle: with color" as const
            }]} />
          </div>
          <SizeSlider label="Size" value={size.value} onChange={setSize} min={12} max={96} readout={tierSentence(size.value)} />
        </ToolbarRow>
        <div class="flex flex-col gap-1.5">
          <ControlLabel>Jump to a size</ControlLabel>
          <Choice label="Jump to a size" value={String(PRESET_SIZES.find(s => s === size.value) ?? "")} onChange={v => setSize(Number(v))} options={PRESET_SIZES.map(s => ({
            value: String(s),
            label: String(s),
            name: `${s} pixels`
          }))} />
        </div>
        {tone.value === "doodle" ? <div class="flex items-center gap-3">
            <Switch id={`${hintId}-wash`} checked={washOnly.value} onCheckedChange={setWashOnly} />
            <Label for={`${hintId}-wash`}>Only icons that carry a color wash ({ICON_ENTRIES.filter(e => e.accent).length})</Label>
          </div> : null}
      </Toolbar>

      <p id={hintId} class="sr-only">
        Each icon is a button: press it to copy its JSX. Arrow keys move between icons.
      </p>
      <CopyStatus message={message.value} />

      {results.value.length === 0 ? <EmptyState title={undrawnHit.value ? `${undrawnHit.value.name} is not drawn yet` : "Nothing matches" as const}>
          {undrawnHit.value ? <p>
              It is a lucide name, so it resolves, but until someone draws it <InlineCode>&lt;Icon name=&quot;{undrawnHit.value.name}&quot; /&gt;</InlineCode> shows a question-mark box.{" "}
              <UndrawnLink>See what is missing.</UndrawnLink>
            </p> : <p>
              Try a shorter word, an idea (<InlineCode>warning</InlineCode>, <InlineCode>delete</InlineCode>) or a lucide name. <UndrawnLink>Not-drawn-yet list.</UndrawnLink>
            </p>}
        </EmptyState> : <RovingGroup label="Icons" describedBy={hintId} ids={results.value.map(e => e.id)}>
          {grouped.value ? groups.value.map((g, gi) => <Section key={g.family.key} id={`family-${g.family.key}`} title={g.family.label} level={3} actions={<Chip tone="count">{g.items.length}</Chip>}>
                <TileGrid items={g.items} getId={e => e.id} renderTile={renderTile.value} minTile={minTile.value} tileHeight={tileHeight.value} eager={gi === 0} />
              </Section>) : <TileGrid items={results.value} getId={e => e.id} renderTile={renderTile.value} minTile={minTile.value} tileHeight={tileHeight.value} chunk={32} eager />}
        </RovingGroup>}

      <IconDock id={selected.value} size={size.value} tone={tone.value} snippet={selected.value ? snippetFor.value(selected.value) : "" as const} copied={!!selected.value && copied.value === selected.value} onCopy={() => selected.value && press.value(selected.value)} />
    </div>;
  };
});
const UndrawnLink = defineUi<{
  children: string;
}>("UndrawnLink", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const _nestedHook0 = useAnchorHref(() => "undrawn");
  return () => {
    return <a href={_nestedHook0.value}>{readSlot(_slots.default)}</a>;
  };
});
