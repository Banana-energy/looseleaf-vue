// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Chip, EmptyState, Section } from "@/docs/kit";
import type { Family } from "./catalog";
import { Choice, ControlLabel, SearchField, Toolbar, ToolbarRow } from "./controls";
import { CopyStatus, ResultCount, RovingGroup, Tile, TileGrid, useCopyStatus } from "./gallery";
import { search, type Searchable } from "./search";
export interface ShelfEntry extends Searchable {
  family: string;
}
export interface ArtShelfProps<E extends ShelfEntry> {
  slug: string;
  noun: string;
  entries: readonly E[];
  families: readonly Family[];
  searchPlaceholder: string;
  controls?: UI.VueNode;
  tile: {
    min: number;
    height: number;
    art: number | readonly [width: number, height: number];
  };
  renderArt: (entry: E) => UI.VueNode;
  snippet: (entry: E) => string;
  template: string;
  onPress?: (entry: E) => void;
  selectedId?: string | null;
  grouped?: boolean;
  chunk?: number;
  noFamilyFilter?: boolean;
  eager?: boolean;
}
export const ArtShelf = (<E extends ShelfEntry,>() => {
  return defineUi<ArtShelfProps<E>>("ArtShelf", ["slug", "noun", "entries", "families", "searchPlaceholder", "controls", "tile", "renderArt", "snippet", "template", "onPress", "selectedId", "grouped", "chunk", "noFamilyFilter", "eager"], (_props, {
    slots: _slots
  }) => {
    const slug = computed(() => _props["slug"]);
    const noun = computed(() => _props["noun"]);
    const entries = computed(() => _props["entries"]);
    const families = computed(() => _props["families"]);
    const searchPlaceholder = computed(() => _props["searchPlaceholder"]);
    const controls = computed(() => _props["controls"]);
    const tile = computed(() => _props["tile"]);
    const renderArt = computed(() => _props["renderArt"]);
    const snippet = computed(() => _props["snippet"]);
    const template = computed(() => _props["template"]);
    const onPress = computed(() => _props["onPress"]);
    const selectedId = computed(() => _props["selectedId"]);
    const groupedProp = computed(() => _props["grouped"] === undefined ? true : _props["grouped"]);
    const chunk = computed(() => _props["chunk"] === undefined ? 24 : _props["chunk"]);
    const noFamilyFilter = computed(() => _props["noFamilyFilter"]);
    const eager = computed(() => _props["eager"] === undefined ? false : _props["eager"]);
    const hintId = useId();
    const query = shallowRef(initialState(""));
    const setQuery = stateSetter(query);
    const family = shallowRef(initialState("all"));
    const setFamily = stateSetter(family);
    const selected = shallowRef<string | null>(initialState(null));
    const setSelected = stateSetter(selected);
    const _hook23 = useCopyStatus();
    const copied = computed(() => _hook23.value.copied);
    const message = computed(() => _hook23.value.message);
    const copy = computed(() => _hook23.value.copy);
    const deferredQuery = computed(() => query.value);
    const results = computed(() => search(family.value === "all" ? entries.value : entries.value.filter(e => e.family === family.value), deferredQuery.value.trim()));
    const grouped = computed(() => groupedProp.value && !deferredQuery.value.trim() && family.value === "all");
    const engaged = computed(() => !!deferredQuery.value.trim() || family.value !== "all");
    const groups = computed(() => grouped.value ? families.value.map(f => ({
      family: f,
      items: results.value.filter(e => e.family === f.key)
    })).filter(g => g.items.length) : []);
    const press = computed(() => (e: E) => {
      setSelected(e.id);
      onPress.value?.(e);
      void copy.value(e.id, snippet.value(e));
    });
    const active = computed(() => selectedId.value ?? selected.value);
    const artW = computed(() => (typeof tile.value.art === "number" ? [tile.value.art, tile.value.art] : tile.value.art)[0]);
    const artH = computed(() => (typeof tile.value.art === "number" ? [tile.value.art, tile.value.art] : tile.value.art)[1]);
    const renderTile = renderValue(() => (e: E) => <Tile key={e.id} id={e.id} name={e.id} selected={active.value === e.id} copied={copied.value === e.id} onPress={() => press.value(e)} style={cssStyle({
      minHeight: tile.value.height
    })}>
      <span class="flex items-center justify-center" style={cssStyle({
        width: artW.value,
        height: artH.value
      })} aria-hidden="true">
        {renderArt.value(e)}
      </span>
    </Tile>);
    const options = computed(() => [{
      value: "all" as const,
      label: `All ${entries.value.length}`
    }, ...families.value.map(f => ({
      value: f.key,
      label: `${f.label} ${f.ids.length}`
    }))]);
    return () => {
      return <div data-slot={`${slug.value}-shelf`}>
      <Toolbar>
        <ToolbarRow>
          <SearchField label={`Search ${noun.value}`} value={query.value} onChange={setQuery} placeholder={searchPlaceholder.value} class="min-w-64 flex-1" />
          <ResultCount shown={results.value.length} total={entries.value.length} noun={noun.value} />
        </ToolbarRow>
        {noFamilyFilter.value ? null : <div class="flex flex-col gap-1.5">
            <ControlLabel>Family</ControlLabel>
            <Choice label={`${slug.value} family`} value={family.value} onChange={setFamily} options={options.value} />
          </div>}
        {controls.value}
        <p id={hintId} class="text-[15px] text-muted-foreground m-0">
          Press a tile to copy <code class="font-mono text-sm text-ink">{template.value}</code>. Arrow keys move between tiles.
        </p>
      </Toolbar>
      <CopyStatus message={message.value} />
      {results.value.length === 0 ? <EmptyState title="Nothing matches">
          <p>Try a shorter word or an idea: the tags are searched too.</p>
        </EmptyState> : <RovingGroup label={noun.value[0]!.toUpperCase() + noun.value.slice(1)} describedBy={hintId} ids={results.value.map(e => e.id)}>
          {grouped.value ? groups.value.map((g, gi) => <Section key={g.family.key} id={`${slug.value}-${g.family.key}`} title={g.family.label} level={3} actions={<Chip tone="count">{g.items.length}</Chip>}>
                <TileGrid items={g.items} getId={e => e.id} renderTile={renderTile.value} minTile={tile.value.min} tileHeight={tile.value.height} chunk={chunk.value} eager={eager.value && gi === 0} />
              </Section>) : <TileGrid items={results.value} getId={e => e.id} renderTile={renderTile.value} minTile={tile.value.min} tileHeight={tile.value.height} chunk={chunk.value} eager={eager.value || engaged.value} />}
        </RovingGroup>}
    </div>;
    };
  });
})();
