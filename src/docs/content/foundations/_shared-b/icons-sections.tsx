// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ICON_ALIASES, resolveIconName } from "@/lib/ink/art/icons";
import { Chip, InlineCode, Stage } from "@/docs/kit";
import { drawnShareOfUses, ICON_BY_ID, ICON_ENTRIES, undrawnIcons } from "./catalog";
import { Choice, ControlLabel, SearchField } from "./controls";
import { DEMAND_SAMPLE_FILES, ICON_DEMAND } from "./icon-demand";
import { iconTierLabel } from "./snippets";
const HERO = ["bell", "calendar", "settings", "search", "eye", "pencil", "heart", "star", "sun", "house", "mail", "camera", "gift", "sparkles"] as const;
export const IconStrip = defineUi<{}>("IconStrip", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Stage layout="center" label="A few of the icons, with their color washes">
      <ul role="list" class="m-0 flex list-none flex-wrap items-center justify-center gap-x-7 gap-y-5 p-0 text-ink">
        {HERO.filter(id => ICON_BY_ID.has(id)).map(id => <li key={id}>
            <Icon name={id} size={48} tone="doodle" />
          </li>)}
      </ul>
    </Stage>;
  };
});
const LADDER = [12, 16, 20, 24, 32, 48, 64, 96] as const;
const SHOWCASE = ["trash", "bell", "settings", "search", "calendar", "eye"] as const;
const ZOOM = 4;
const Loupe = defineUi<{
  children: UI.VueNode;
}>("Loupe", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <span class="relative block shrink-0" style={cssStyle({
      width: 16 * ZOOM,
      height: 16 * ZOOM
    })}>
      <span class="absolute start-0 top-0 block origin-top-left" style={cssStyle({
        width: 16,
        height: 16,
        transform: `scale(${ZOOM})`
      })}>
        {readSlot(_slots.default)}
      </span>
    </span>;
  };
});
const Caption = defineUi<{
  children: UI.VueNode;
}>("Caption", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <figcaption class="text-center text-sm leading-tight text-pencil-text">{readSlot(_slots.default)}</figcaption>;
  };
});
export const ScaledVsRedrawn = defineUi<{
  id: string;
}>("ScaledVsRedrawn", ["id"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  return () => {
    return <div class="flex flex-wrap items-start gap-x-10 gap-y-6 text-ink" data-slot="scaled-vs-redrawn">
      <figure class="m-0 flex flex-col items-center gap-2">
        <Loupe>
          <span class="block origin-top-left" style={cssStyle({
            width: 24,
            height: 24,
            transform: `scale(${16 / 24})`
          })}>
            <Icon name={id.value} size={24} />
          </span>
        </Loupe>
        <Caption>
          the 24 px master, scaled to 16
          <br />
          (what most icon sets do)
        </Caption>
      </figure>
      <figure class="m-0 flex flex-col items-center gap-2">
        <Loupe>
          <Icon name={id.value} size={16} />
        </Loupe>
        <Caption>
          redrawn for 16 px
          <br />
          (heavier pen, less detail)
        </Caption>
      </figure>
      <figure class="m-0 flex flex-col items-center gap-2">
        <span class="flex items-center gap-4" style={cssStyle({
          height: 16 * ZOOM
        })}>
          <Icon name={id.value} size={24} style={cssStyle({
            transform: `scale(${16 / 24})`,
            transformOrigin: "center" as const
          })} />
          <Icon name={id.value} size={16} />
        </span>
        <Caption>
          both at their true size
          <br />
          (16 px on screen)
        </Caption>
      </figure>
    </div>;
  };
});
export const SizeLadder = defineUi<{
  id: string;
  tone: "ui" | "doodle";
}>("SizeLadder", ["id", "tone"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const tone = computed(() => _props["tone"]);
  return () => {
    return <ul role="list" class="m-0 flex list-none flex-wrap items-end gap-x-6 gap-y-5 p-0 text-ink" data-slot="size-ladder">
      {LADDER.map(px => <li key={px} class="flex flex-col items-center gap-2">
          <span class="flex items-end justify-center" style={cssStyle({
          height: 96
        })}>
            <Icon name={id.value} size={px} tone={tone.value} />
          </span>
          <span class="font-type text-sm leading-none">{px}</span>
          <span class="max-w-24 text-center text-sm leading-tight text-pencil-text">{iconTierLabel(id.value, px)}</span>
        </li>)}
    </ul>;
  };
});
export const SizesLab = defineUi<{}>("SizesLab", [], (_props, {
  slots: _slots
}) => {
  const id = shallowRef<string>(initialState(SHOWCASE[0]));
  const setId = stateSetter(id);
  const tone = shallowRef<"ui" | "doodle">(initialState("ui"));
  const setTone = stateSetter(tone);
  return () => {
    return <div class="flex flex-col gap-6">
      <div class="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div class="flex flex-col gap-1.5">
          <ControlLabel>Icon</ControlLabel>
          <Choice label="Icon to show" value={id.value} onChange={setId} options={SHOWCASE.filter(s => ICON_BY_ID.has(s)).map(s => ({
            value: s,
            label: <Icon name={s} size={20} />,
            name: s
          }))} />
        </div>
        <div class="flex flex-col gap-1.5">
          <ControlLabel>Tone</ControlLabel>
          <Choice label="Tone of the sizes" value={tone.value} onChange={setTone} options={[{
            value: "ui" as const,
            label: "ui" as const
          }, {
            value: "doodle" as const,
            label: "doodle" as const
          }]} />
        </div>
      </div>
      <SizeLadder id={id.value} tone={tone.value} />
      <ScaledVsRedrawn id={id.value} />
    </div>;
  };
});
export const NameResolver = defineUi<{}>("NameResolver", [], (_props, {
  slots: _slots
}) => {
  const name = shallowRef(initialState("Trash2"));
  const setName = stateSetter(name);
  const trimmed = computed(() => name.value.trim());
  const id = computed(() => trimmed.value ? resolveIconName(trimmed.value) : "" as const);
  const drawn = computed(() => !!id.value && ICON_BY_ID.has(id.value));
  return () => {
    return <div class="flex flex-wrap items-center gap-x-8 gap-y-4" data-slot="name-resolver">
      <div class="flex min-w-64 flex-1 flex-col gap-1.5">
        <ControlLabel>A lucide name</ControlLabel>
        <SearchField label="Icon name to resolve" value={name.value} onChange={setName} placeholder="Trash2, alert-triangle, MoreHorizontal, HomeIcon" />
      </div>
      <div class="flex min-h-16 min-w-64 flex-1 items-center gap-4 text-ink" role="status">
        {trimmed.value ? <>
            <span class="grid size-16 shrink-0 place-items-center bg-graph shadow-hair" aria-hidden="true">
              <Icon name={trimmed.value} size={32} />
            </span>
            <p class="m-0">
              <InlineCode>{trimmed.value}</InlineCode> means <InlineCode>{id.value}</InlineCode>
              <br />
              <span class="text-pencil-text">{drawn.value ? "and it is drawn." as const : "which is not drawn yet, so it shows a question-mark box." as const}</span>
            </p>
          </> : <p class="text-[15px] text-muted-foreground m-0">Type a name.</p>}
      </div>
    </div>;
  };
});
export const AliasTable = defineUi<{}>("AliasTable", [], (_props, {
  slots: _slots
}) => {
  const rows = computed(() => Object.entries(ICON_ALIASES).filter(([id]) => ICON_BY_ID.has(id)));
  return () => {
    return <ul role="list" class="m-0 grid list-none gap-x-6 gap-y-2 p-0 text-ink [grid-template-columns:repeat(auto-fill,minmax(15rem,1fr))]" data-slot="alias-table">
      {rows.value.map(([id, aliases]) => <li key={id} class="flex items-center gap-3 py-1">
          <Icon name={id} size={24} />
          <span class="min-w-0 leading-tight">
            <InlineCode>{id}</InlineCode>
            <span class="block text-sm text-pencil-text [overflow-wrap:anywhere]">{aliases.join(", ")}</span>
          </span>
        </li>)}
    </ul>;
  };
});
const UNDRAWN_FIRST = 24;
export const UndrawnList = defineUi<{}>("UndrawnList", [], (_props, {
  slots: _slots
}) => {
  const all = shallowRef(initialState(false));
  const setAll = stateSetter(all);
  const list = computed(() => undrawnIcons());
  const share = computed(() => Math.round(drawnShareOfUses() * 100));
  const shown = computed(() => all.value ? list.value : list.value.slice(0, UNDRAWN_FIRST));
  const sampleNames = computed(() => ICON_DEMAND.length);
  const sampleDrawn = computed(() => ICON_DEMAND.filter(([n]) => ICON_BY_ID.has(resolveIconName(n))).length);
  return () => {
    return <div data-slot="undrawn-list">
      <p class="mt-0">
        The {ICON_ENTRIES.length} drawn icons cover <strong>{share.value} percent</strong> of the icon uses in shadcn/ui&apos;s own examples ({sampleDrawn.value} of the {sampleNames.value} different names in{" "}
        {DEMAND_SAMPLE_FILES} files). The names below are the rest, most used first. Until one is drawn, <InlineCode>&lt;Icon name=&quot;telescope&quot; /&gt;</InlineCode> draws a hand box with a question mark
        and sets <InlineCode>data-missing</InlineCode> on the svg, so a missing icon is easy to spot in a test.
      </p>
      <div class="my-4 flex flex-wrap items-center gap-6 text-ink">
        <figure class="m-0 flex flex-col items-center gap-1">
          <Icon name="telescope" size={48} />
          <figcaption class="text-sm text-pencil-text">what an undrawn name draws</figcaption>
        </figure>
      </div>
      <ul role="list" class="m-0 flex list-none flex-wrap gap-2 p-0">
        {shown.value.map(u => <li key={u.name}>
            <Chip tone="outline">
              {u.name}
              {u.uses ? <>
                  <span aria-hidden="true" class="text-pencil-text">
                    {" "}
                    x{u.uses}
                  </span>
                  <span class="sr-only"> (used {u.uses} times)</span>
                </> : null}
            </Chip>
          </li>)}
      </ul>
      {list.value.length > UNDRAWN_FIRST ? <p class="mt-3">
          <Button variant="outline" size="sm" onClick={() => setAll(v => !v)} aria-expanded={all.value}>
            {all.value ? "Show fewer" as const : `Show all ${list.value.length}`}
          </Button>
        </p> : null}
    </div>;
  };
});
