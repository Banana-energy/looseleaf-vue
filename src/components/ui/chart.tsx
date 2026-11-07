// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, useId, shallowRef } from "vue";
import { Paper } from "@/components/ui/paper";
import { buildXYRows, seriesLook, toNum, type BandInput, type NoteInput, type RefInput, type Row, type SeriesInput } from "@/lib/ink/charts/chart-build";
import { summarizeXY, tableXY, TABLE_ROW_CAP, type DomainEnd, type TableModel } from "@/lib/ink/charts/chart-data";
import { hitIndex, layoutChart, stepIndex, type ChartSpec } from "@/lib/ink/charts/chart-layout";
import { buildCalendar, buildGrid, formatDay } from "@/lib/ink/charts/chart-heat";
import { layoutGauge, layoutRadial, type PieLayout } from "@/lib/ink/charts/chart-polar";
import type { XYLayout } from "@/lib/ink/charts/chart-xy";
import { formatCompact, formatNumber, isNum, lttb, radarRim, round, shares } from "@/lib/ink/charts/chart-scale";
import { PATTERNS, SLOT_KEYS, type ChartLabel, type ChartLayoutBase, type CursorSpec, type Dash, type GaugeSpec, type HeatSpec, type MarkerShape, type MiniParams, type Pattern, type PieSpec, type RadarSpec, type RadialSpec, type SparkSpec, type TallySpec, type XYKind, type XYSpec } from "@/lib/ink/charts/chart-types";
import { useDensity, useInk, useMergedRef } from "@/lib/ink/vue";
import type { Recipe } from "@/lib/ink/recipes";
import { markRecipe } from "@/lib/ink/recipes/chart-ink/mark";
import { heatRecipe, sparkRecipe, tallyRecipe } from "@/lib/ink/recipes/chart-ink/mini";
import { gaugeRecipe, pieRecipe, radarRecipe, radialRecipe } from "@/lib/ink/recipes/chart-ink/polar";
import { xyRecipe } from "@/lib/ink/recipes/chart-ink/xy";
import { cn } from "@/lib/utils";
const THEMES = {
  light: "" as const,
  dark: ".dark" as const
} as const;
export type ChartConfig = Record<string, {
  label?: UI.ReactNode;
  icon?: UI.ComponentType;
  pattern?: Pattern | "auto";
  marker?: MarkerShape | "auto";
  dash?: Dash | "auto";
} & ({
  color?: string;
  theme?: never;
} | {
  color?: never;
  theme: Record<keyof typeof THEMES, string>;
})>;
export type ChartAnnotation = NoteInput;
export type ChartHighlight = BandInput;
export type ChartReference = RefInput;
export type { Row as ChartRow };
export type ChartTooltipItem = {
  dataKey?: string;
  name?: string;
  value?: number | string | null;
  color?: string;
  fill?: string;
  type?: string;
  payload?: Row;
  slot?: number;
  pattern?: Pattern;
  marker?: MarkerShape;
  kind?: XYKind;
  unit?: string;
};
type TooltipModel = {
  label: UI.ReactNode;
  payload: ChartTooltipItem[];
  anchor: {
    x: number;
    y: number;
  };
  box: {
    w: number;
    h: number;
  };
};
type ActiveState = {
  index: number;
  series: number | null;
  source: "pointer" | "keyboard" | "default";
};
type LegendEntry = {
  key: string;
  slot: number;
  pattern: Pattern;
  marker: MarkerShape;
  dash: Dash;
  kind: XYKind | "slice";
};
type StoreState = {
  active: ActiveState | null;
  model: TooltipModel | null;
  announce: string;
  tooltip: boolean;
  legend: readonly LegendEntry[];
};
interface TooltipCfg {
  content?: UI.ReactElement;
  defaultIndex?: number;
  cursor?: boolean;
}
function createStore() {
  let state: StoreState = {
    active: null,
    model: null,
    announce: "" as const,
    tooltip: false,
    legend: []
  };
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(next: Partial<StoreState>) {
      state = {
        ...state,
        ...next
      };
      listeners.forEach(l => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    cfg: {} as TooltipCfg
  };
}
type ChartStore = ReturnType<typeof createStore>;
interface ChartContextProps {
  id: string;
  config: ChartConfig;
  keys: string[];
  hidden: ReadonlySet<string>;
  toggle: (key: string) => void;
  patterns: boolean | "auto";
  store: ChartStore;
  size?: readonly [number, number];
}
const ChartContext = createContext<ChartContextProps | null>(null);
function useChart() {
  const context = useContext(ChartContext);
  return computed(() => {
    if (!context.value) console.error("useChart must be used within a <ChartContainer />");
    return context.value;
  });
}
function useStoreState(_source0: MaybeRefOrGetter<ChartStore>): ComputedRef<StoreState> {
  const store = computed(() => toValue(_source0));
  const _nestedHook0 = useExternalStore(store.value.subscribe, store.value.get);
  return computed(() => {
    return _nestedHook0.value;
  });
}
const labelText = (config: ChartConfig, key: string): string => {
  const l = config[key]?.label;
  return typeof l === "string" || typeof l === "number" ? String(l) : key;
};
const drawnKeys = (config: ChartConfig): string[] => Object.keys(config);
function inferSeries(rows: readonly Row[], xKey: string, config: ChartConfig | undefined): string[] {
  const first = rows.slice(0, 12);
  const numeric = (k: string) => first.some(r => isNum(toNum(r[k])));
  if (config) {
    const fromConfig = Object.keys(config).filter(k => k !== xKey && numeric(k));
    if (fromConfig.length) return fromConfig;
  }
  const keys: string[] = [];
  for (const r of first) for (const k of Object.keys(r)) if (k !== xKey && !keys.includes(k) && numeric(k)) keys.push(k);
  return keys;
}
const FORCED = "(forced-colors: active)";
function useForcedColors(): ComputedRef<boolean> {
  const _nestedHook0 = useExternalStore(notify => {
    const q = typeof window === "undefined" ? undefined : window.matchMedia?.(FORCED);
    q?.addEventListener?.("change", notify);
    return () => q?.removeEventListener?.("change", notify);
  }, () => typeof window !== "undefined" && !!window.matchMedia?.(FORCED)?.matches);
  return computed(() => {
    return _nestedHook0.value;
  });
}
type ChartContainerProps = UI.ComponentProps<"div"> & {
  config: ChartConfig;
  patterns?: boolean | "auto";
  hiddenSeries?: readonly string[];
  defaultHiddenSeries?: readonly string[];
  onHiddenSeriesChange?: (hidden: string[]) => void;
  initialDimension?: {
    width: number;
    height: number;
  };
};
const ChartContainer = defineUi<ChartContainerProps>("ChartContainer", ["id", "class", "config", "patterns", "hiddenSeries", "defaultHiddenSeries", "onHiddenSeriesChange", "initialDimension"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const config = computed(() => _props["config"]);
  const patterns = computed(() => _props["patterns"]);
  const hiddenSeries = computed(() => _props["hiddenSeries"]);
  const defaultHiddenSeries = computed(() => _props["defaultHiddenSeries"]);
  const onHiddenSeriesChange = computed(() => _props["onHiddenSeriesChange"]);
  const initialDimension = computed(() => _props["initialDimension"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["id", "class", "children", "config", "patterns", "hiddenSeries", "defaultHiddenSeries", "onHiddenSeriesChange", "initialDimension", "ref"]));
  const uniqueId = useId();
  const chartId = computed(() => `chart-${id.value ?? uniqueId.replace(/:/g, "")}`);
  const store = shallowRef(initialState(createStore));
  const inner = shallowRef<readonly string[]>(initialState(defaultHiddenSeries.value ?? []));
  const setInner = stateSetter(inner);
  const controlled = computed(() => hiddenSeries.value !== undefined);
  const hiddenList = computed(() => hiddenSeries.value !== undefined ? hiddenSeries.value : inner.value);
  const hiddenKey = computed(() => hiddenList.value.join("\u0000"));
  const hidden = computed(() => new Set(hiddenList.value));
  const toggle = (key: string) => {
    const next = hidden.value.has(key) ? hiddenList.value.filter(k => k !== key) : [...hiddenList.value, key];
    if (!controlled.value) setInner(next);
    onHiddenSeriesChange.value?.(next);
  };
  const keys = computed(() => drawnKeys(config.value));
  const forced = useForcedColors();
  const look = computed(() => patterns.value ?? (forced.value ? "auto" as const : false));
  const size = computed(() => initialDimension.value ? [initialDimension.value.width, initialDimension.value.height] as const : undefined);
  const value = computed<ChartContextProps>(() => ({
    id: chartId.value,
    config: config.value,
    keys: keys.value,
    hidden: hidden.value,
    toggle,
    patterns: look.value,
    store: store.value,
    size: size.value
  }));
  const slotVars = computed(() => {
    const v: Record<string, string> = {};
    keys.value.forEach((k, i) => {
      if (config.value[k]?.color || config.value[k]?.theme) v[`--ll-${SLOT_KEYS[i % SLOT_KEYS.length]}`] = `var(--color-${k})`;
    });
    return v;
  });
  return () => {
    return <ChartContext.Provider value={value.value}>
      <div data-slot="chart" data-chart={chartId.value} ref={ref.value} class={cn("group/chart relative flex aspect-video w-full flex-col justify-center text-xs", className.value)} {...domProps(props.value)}>
        <ChartStyle id={chartId.value} config={config.value} />
        <div data-slot="chart-body" class="contents" style={cssStyle(slotVars.value as UI.CSSProperties)}>
          {readSlot(_slots.default)}
        </div>
      </div>
    </ChartContext.Provider>;
  };
});
const defaultColor = (i: number) => `var(--ll-${SLOT_KEYS[i % SLOT_KEYS.length]})`;
const ChartStyle = defineUi<{
  id: string;
  config: ChartConfig;
}>("ChartStyle", ["id", "config"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const config = computed(() => _props["config"]);
  const keys = computed(() => Object.keys(config.value));
  return () => {
    if (!keys.value.length) return null;
    return <style innerHTML={Object.entries(THEMES).map(([theme, prefix]) => `
${prefix} [data-chart=${id.value}] {
${keys.value.map((key, i) => {
      const itemConfig = config.value[key];
      const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color ?? (theme === "light" ? defaultColor(i) : null);
      return color ? `  --color-${key}: ${color};` : null;
    }).filter(Boolean).join("\n")}
}
`).join("\n")} />;
  };
});
const TONE_CLASS = {
  ink: "text-foreground" as const,
  muted: "text-muted-foreground" as const,
  red: "text-red" as const,
  blue: "text-ink-you" as const,
  green: "text-green" as const
} as const;
const ANCHOR_X = {
  start: "0%" as const,
  middle: "-50%" as const,
  end: "-100%" as const
} as const;
const ANCHOR_Y = {
  top: "0%" as const,
  middle: "-50%" as const,
  bottom: "-100%" as const
} as const;
const ChartLabels = defineUi<{
  labels: readonly ChartLabel[];
  box: {
    w: number;
    h: number;
  };
}>("ChartLabels", ["labels", "box"], (_props, {
  slots: _slots
}) => {
  const labels = computed(() => _props["labels"]);
  const box = computed(() => _props["box"]);
  return () => {
    return <div aria-hidden="true" data-slot="chart-labels" class="pointer-events-none absolute inset-0 select-none forced-colors:hidden group-data-[reveal=on]/canvas:animate-in group-data-[reveal=on]/canvas:fade-in-0 group-data-[reveal=on]/canvas:duration-(--ll-dur-draw)">
      {labels.value.map(l => <span key={l.id} data-role={l.role} class={cn("absolute block font-script leading-none whitespace-nowrap calm:font-hand", TONE_CLASS[l.tone ?? "ink"], l.role === "note" && "font-semibold [text-shadow:0_0_2px_var(--ll-slip),0_0_6px_var(--ll-slip)]", l.role === "value" && "[text-shadow:0_0_2px_var(--ll-slip),0_0_4px_var(--ll-slip)]", l.role === "center" && "font-semibold", l.maxW ? "ll-ink-room overflow-x-clip text-ellipsis" as const : "" as const)} style={cssStyle({
        left: `${round(l.x / box.value.w * 100, 3)}%`,
        top: `${round(l.y / box.value.h * 100, 3)}%`,
        fontSize: l.size,
        maxWidth: l.maxW,
        transform: `translate(${ANCHOR_X[l.anchor]}, ${ANCHOR_Y[l.valign]})`
      })}>
          {l.text}
        </span>)}
    </div>;
  };
});
function cursorParams(c: CursorSpec): MiniParams {
  if (c.kind === "ring") return {
    kind: "ring" as const,
    slot: c.slot
  };
  if (c.kind === "slice") return {
    kind: "slice" as const,
    cx: round(c.cx, 1),
    cy: round(c.cy, 1),
    r0: round(c.r0, 1),
    r1: round(c.r1, 1),
    a0: round(c.a0, 3),
    a1: round(c.a1, 3)
  };
  if (c.kind === "spoke") return {
    kind: "spoke" as const,
    x1: round(c.x1, 1),
    y1: round(c.y1, 1),
    x2: round(c.x2, 1),
    y2: round(c.y2, 1)
  };
  return {
    kind: c.kind
  };
}
const CursorMark = defineUi<{
  c: CursorSpec;
  box: {
    w: number;
    h: number;
  };
  seed: string;
}>("CursorMark", ["c", "box", "seed"], (_props, {
  slots: _slots
}) => {
  const c = computed(() => _props["c"]);
  const box = computed(() => _props["box"]);
  const seed = computed(() => _props["seed"]);
  const params = computed(() => cursorParams(c.value));
  const w = computed(() => Math.max(4, Math.round(c.value.w)));
  const h = computed(() => Math.max(4, Math.round(c.value.h)));
  const {
    hostProps,
    node
  } = useInk(() => ({
    recipe: markRecipe,
    params: params.value,
    kind: "chart" as const,
    size: [w.value, h.value],
    seed: `${seed.value}:${c.value.kind}`
  }));
  return () => {
    return <span data-slot="chart-cursor" data-kind={c.value.kind} {...domProps(hostProps.value)} class="absolute block animate-in fade-in-0 transition-[left,top] duration-(--ll-dur-hover) ease-out motion-reduce:transition-none" style={cssStyle({
      left: `${round(c.value.x / box.value.w * 100, 3)}%`,
      top: `${round(c.value.y / box.value.h * 100, 3)}%`,
      width: `${round(c.value.w / box.value.w * 100, 3)}%`,
      height: `${round(c.value.h / box.value.h * 100, 3)}%`
    })}>
      {node.value}
    </span>;
  };
});
const ChartCursors = defineUi<{
  store: ChartStore;
  L: ChartLayoutBase;
  seed: string;
}>("ChartCursors", ["store", "L", "seed"], (_props, {
  slots: _slots
}) => {
  const store = computed(() => _props["store"]);
  const L = computed(() => _props["L"]);
  const seed = computed(() => _props["seed"]);
  const st = useStoreState(() => store.value);
  const specs = computed(() => st.value.active && store.value.cfg.cursor !== false ? L.value.cursorAt(st.value.active.index, st.value.active.series) : []);
  const box = computed(() => ({
    w: L.value.w,
    h: L.value.h
  }));
  const behind = computed(() => specs.value.filter(c => c.kind === "column" || c.kind === "guide"));
  const above = computed(() => specs.value.filter(c => c.kind !== "column" && c.kind !== "guide"));
  return () => {
    return <>
      <div aria-hidden="true" data-slot="chart-cursors" data-place="behind" class="pointer-events-none absolute inset-0 -z-10 forced-colors:hidden">
        {behind.value.map((c, k) => <CursorMark key={`${c.kind}-${k}`} c={c} box={box.value} seed={seed.value} />)}
      </div>
      <div aria-hidden="true" data-slot="chart-cursors" data-place="above" class="pointer-events-none absolute inset-0 z-10 forced-colors:hidden">
        {above.value.map((c, k) => <CursorMark key={`${c.kind}-${k}`} c={c} box={box.value} seed={seed.value} />)}
      </div>
    </>;
  };
});
type SwatchProps = Omit<UI.ComponentProps<"span">, "slot"> & {
  palette: number;
  pattern?: Pattern;
  marker?: MarkerShape;
  line?: boolean;
};
const ChartSwatch = defineUi<SwatchProps>("ChartSwatch", ["palette", "pattern", "marker", "line", "class"], (_props, {
  slots: _slots
}) => {
  const slot = computed(() => _props["palette"]);
  const pattern = computed(() => _props["pattern"] === undefined ? "solid" as const : _props["pattern"]);
  const marker = computed(() => _props["marker"]);
  const line = computed(() => _props["line"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["palette", "pattern", "marker", "line", "class"]));
  const size = computed(() => line.value ? [22, 14] as const : [14, 14] as const);
  const {
    hostProps,
    node
  } = useInk(() => ({
    recipe: markRecipe,
    params: {
      kind: "swatch" as const,
      slot: slot.value,
      pattern: pattern.value,
      marker: marker.value,
      line: !!line.value
    },
    kind: "chart" as const,
    size: size.value,
    seed: `swatch-${slot.value}-${pattern.value}-${marker.value ?? "x"}-${line.value ? "l" as const : "b" as const}`
  }));
  return () => {
    return <span data-slot="chart-swatch" aria-hidden="true" {...domProps(hostProps.value)} class={cn("relative isolate inline-block shrink-0 align-middle", line.value ? "h-3.5 w-[22px]" as const : "size-3.5" as const, className.value)} {...domProps(props.value)}>
      {node.value}
    </span>;
  };
});
const TooltipPositioner = defineUi<{
  anchor: {
    x: number;
    y: number;
  };
  box: {
    w: number;
    h: number;
  };
  children: UI.ReactNode;
}>("TooltipPositioner", ["anchor", "box"], (_props, {
  slots: _slots
}) => {
  const anchor = computed(() => _props["anchor"]);
  const box = computed(() => _props["box"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = shallowRef<HTMLDivElement | null>(null);
  watchDependencies(() => {
    const el = ref.value;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const pw = parent.offsetWidth || box.value.w;
    const ph = parent.offsetHeight || box.value.h;
    const ax = anchor.value.x / box.value.w * pw;
    const ay = anchor.value.y / box.value.h * ph;
    const tw = el.offsetWidth;
    const th = el.offsetHeight;
    const left = Math.max(4, Math.min(pw - tw - 4, ax - tw / 2));
    const above = ay - th - 14;
    el.style.left = `${left}px`;
    el.style.top = `${above < 2 ? ay + 18 : above}px`;
    el.style.visibility = "visible";
  }, undefined, true);
  return () => {
    return <div ref={ref} data-slot="chart-tooltip-slot" class="pointer-events-none absolute z-(--ll-z-raised) w-max max-w-[min(22rem,calc(100%-8px))] transition-[left,top] duration-(--ll-dur-hover) ease-out motion-reduce:transition-none" style={cssStyle({
      left: 0,
      top: 0,
      visibility: "hidden" as const
    })}>
      {readSlot(_slots.default)}
    </div>;
  };
});
const TooltipLayer = defineUi<{
  store: ChartStore;
}>("TooltipLayer", ["store"], (_props, {
  slots: _slots
}) => {
  const store = computed(() => _props["store"]);
  const st = useStoreState(() => store.value);
  const layer = (el: HTMLDivElement | null) => {
    const frame = el?.closest<HTMLElement>('[data-slot="chart"]');
    if (el && frame) el.dir = getComputedStyle(frame).direction;
  };
  return () => {
    if (!st.value.tooltip || !st.value.model) return null;
    const {
      model
    } = st.value;
    const content = store.value.cfg.content ?? <ChartTooltipContent />;
    return <div ref={layer} aria-hidden="true" data-slot="chart-tooltip-layer" class="pointer-events-none absolute inset-0 z-20">
      <TooltipPositioner anchor={model.anchor} box={model.box}>
        {cloneElement(content as UI.ReactElement<Record<string, unknown>>, {
          active: true,
          payload: model.payload,
          label: model.label
        })}
      </TooltipPositioner>
    </div>;
  };
});
const ChartLive = defineUi<{
  store: ChartStore;
}>("ChartLive", ["store"], (_props, {
  slots: _slots
}) => {
  const store = computed(() => _props["store"]);
  const st = useStoreState(() => store.value);
  return () => {
    return <div role="status" aria-live="polite" aria-atomic="true" data-slot="chart-live" class="sr-only">
      {st.value.announce}
    </div>;
  };
});
const ChartData = defineUi<{
  id: string;
  summary: string;
  table: TableModel | null;
  label: string;
}>("ChartData", ["id", "summary", "table", "label"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const summary = computed(() => _props["summary"]);
  const table = computed(() => _props["table"]);
  const label = computed(() => _props["label"]);
  return () => {
    return <div data-slot="chart-data" class="sr-only forced-colors:not-sr-only forced-colors:mt-2 forced-colors:overflow-auto forced-colors:text-sm">
      <p id={id.value}>{summary.value}</p>
      {table.value ? <ChartTable table={table.value} label={label.value} /> : null}
    </div>;
  };
});
const ChartTable = defineUi<{
  table: TableModel;
  label: string;
}>("ChartTable", ["table", "label"], (_props, {
  slots: _slots
}) => {
  const table = computed(() => _props["table"]);
  const label = computed(() => _props["label"]);
  return () => {
    return <>
      <table>
        <caption>{label.value}</caption>
        <thead>
          <tr>
            {table.value.head.map((h, i) => <th key={i} scope="col">
                {h}
              </th>)}
          </tr>
        </thead>
        <tbody>
          {table.value.rows.map((r, ri) => <tr key={ri}>
              {r.map((c, ci) => ci === 0 ? <th key={ci} scope="row">
                    {c}
                  </th> : <td key={ci}>{c}</td>)}
            </tr>)}
        </tbody>
      </table>
      {table.value.clipped ? <p>{`Showing the first ${table.value.clipped.shown} of ${table.value.clipped.total} rows.`}</p> : null}
    </>;
  };
});
type Described = {
  label: UI.ReactNode;
  payload: ChartTooltipItem[];
  announce: string;
};
interface CanvasProps<S extends ChartSpec> extends Omit<UI.ComponentProps<"div">, "children" | "onChange" | "onSelect"> {
  slot?: string;
  recipe: Recipe<S>;
  spec: S;
  kindLabel: string;
  label: string;
  summary: string;
  table: TableModel | null;
  describe: (index: number, series: number | null, L: ChartLayoutBase) => Described | null;
  seriesCount?: number;
  interactive?: boolean;
  animate?: boolean;
  seed?: string | number;
  onActiveChange?: (info: {
    index: number;
    series: number | null;
  } | null) => void;
  onSelect?: (info: {
    index: number;
    series: number | null;
  }) => void;
  overlay?: (L: ChartLayoutBase) => UI.ReactNode;
  meter?: {
    min: number;
    max: number;
    now: number;
    text: string;
  };
}
const REVEAL = "data-[reveal=on]:[&>svg_[data-part=wipe]]:animate-[ll-wipe_var(--ll-dur-draw)_var(--ll-ease-out)_both] data-[reveal=on]:[&>svg_[data-part=note]]:animate-[ll-pop_var(--ll-dur-pop)_var(--ll-ease-pop)_calc(var(--ll-dur-draw)*.9)_both] data-[reveal=on]:[&>svg_[data-part=note]]:[transform-box:fill-box] data-[reveal=on]:[&>svg_[data-part=note]]:origin-center [&>svg_[data-part=pulse]]:motion-safe:animate-pulse";
function useStableSpec<S>(_source0: MaybeRefOrGetter<S>): ComputedRef<S> {
  const spec = computed(() => toValue(_source0));
  const key = computed(() => JSON.stringify(spec.value));
  const ref = shallowRef<{
    key: string;
    spec: S;
  }>({
    key: key.value,
    spec: spec.value
  });
  return computed(() => {
    if (ref.value.key !== key.value) ref.value = {
      key: key.value,
      spec: spec.value
    };
    return ref.value.spec;
  });
}
const ChartCanvas = (<S extends ChartSpec,>() => {
  return defineUi<CanvasProps<S>>("ChartCanvas", ["slot", "recipe", "spec", "kindLabel", "label", "summary", "table", "describe", "seriesCount", "interactive", "animate", "seed", "onActiveChange", "onSelect", "overlay", "meter", "class"], (_props, {
    slots: _slots
  }) => {
    const slot = computed(() => _props["slot"]);
    const recipe = computed(() => _props["recipe"]);
    const specIn = computed(() => _props["spec"]);
    const kindLabel = computed(() => _props["kindLabel"]);
    const label = computed(() => _props["label"]);
    const summary = computed(() => _props["summary"]);
    const table = computed(() => _props["table"]);
    const describe = computed(() => _props["describe"]);
    const seriesCount = computed(() => _props["seriesCount"] === undefined ? 0 : _props["seriesCount"]);
    const interactive = computed(() => _props["interactive"] === undefined ? true : _props["interactive"]);
    const animate = computed(() => _props["animate"] === undefined ? true : _props["animate"]);
    const seed = computed(() => _props["seed"]);
    const onActiveChange = computed(() => _props["onActiveChange"]);
    const onSelect = computed(() => _props["onSelect"]);
    const overlay = computed(() => _props["overlay"]);
    const meter = computed(() => _props["meter"]);
    const className = computed(() => _props["class"]);
    const ref = computed(() => _props["ref"]);
    const props = computed(() => omitProps(_props, ["slot", "recipe", "spec", "kindLabel", "label", "summary", "table", "describe", "seriesCount", "interactive", "animate", "seed", "onActiveChange", "onSelect", "overlay", "meter", "class", "ref"]));
    const ctx = useChart();
    const store = computed(() => ctx.value.store);
    const spec = useStableSpec(() => specIn.value);
    const _nestedHook0 = useDensity();
    const calm = computed(() => _nestedHook0.value === "calm");
    const descId = useId();
    const {
      hostRef,
      hostProps,
      node,
      box,
      seed: inkSeed
    } = useInk(() => ({
      recipe: recipe.value,
      params: spec.value,
      kind: "chart" as const,
      seed: seed.value,
      size: ctx.value.size
    }));
    const L = computed(() => box.value ? layoutChart(spec.value, box.value, calm.value) : null);
    const reveal = shallowRef<"on" | "done">(initialState(animate.value ? "on" as const : "done" as const));
    const setReveal = stateSetter(reveal);
    const drawn = computed(() => node.value !== null);
    watchDependencies(() => {
      if (reveal.value !== "on" || !drawn.value) return;
      const t = setTimeout(() => setReveal("done"), 1500);
      return () => clearTimeout(t);
    }, () => [reveal.value, drawn.value], false);
    const live = shallowRef({
      L: L.value,
      describe: describe.value,
      onActiveChange: onActiveChange.value,
      onSelect: onSelect.value,
      seriesCount: seriesCount.value
    });
    watchDependencies(() => {
      live.value = {
        L: L.value,
        describe: describe.value,
        onActiveChange: onActiveChange.value,
        onSelect: onSelect.value,
        seriesCount: seriesCount.value
      };
    }, undefined, true);
    const pointerFocus = shallowRef(false);
    const hostEl = shallowRef<HTMLElement | null | null>(null);
    const activate = (index: number, series: number | null, source: ActiveState["source"], quiet = false) => {
      const {
        L: cur,
        describe: desc,
        onActiveChange: notify
      } = live.value;
      if (!cur || index < 0 || index >= cur.targets.n) return;
      const d = desc(index, series, cur);
      if (!d) return;
      store.value.set({
        active: {
          index,
          series,
          source
        },
        model: {
          label: d.label,
          payload: d.payload,
          anchor: {
            x: cur.targets.cx[index],
            y: cur.targets.cy[index]
          },
          box: {
            w: cur.w,
            h: cur.h
          }
        },
        announce: source === "keyboard" ? d.announce : store.value.get().announce
      });
      if (!quiet) notify?.({
        index,
        series
      });
    };
    const clear = (only?: ActiveState["source"]) => {
      const cur = store.value.get().active;
      if (!cur || only && cur.source !== only) return;
      const di = store.value.cfg.defaultIndex;
      if (di != null && cur.source !== "default") {
        activate(di, null, "default");
        return;
      }
      store.value.set({
        active: null,
        model: null
      });
      live.value.onActiveChange?.(null);
    };
    watchDependencies(() => {
      ;
      (store.value as unknown as {
        activate?: typeof activate;
      }).activate = activate;
    }, () => [store.value, activate], true);
    watchDependencies(() => {
      const di = store.value.cfg.defaultIndex;
      if (L.value && di != null && !store.value.get().active) activate(di, null, "default");
    }, () => [L.value, store.value, activate], false);
    watchDependencies(() => {
      const cur = store.value.get().active;
      if (L.value && cur) activate(Math.min(cur.index, L.value.targets.n - 1), cur.series, cur.source, true);else if (cur && !L.value) store.value.set({
        active: null,
        model: null
      });
    }, () => [spec.value], false);
    watchDependencies(() => {
      const el = hostEl.value;
      if (!el) return;
      const away = (e: PointerEvent) => {
        if (!(e.target instanceof Node) || el.contains(e.target)) return;
        const a = store.value.get().active;
        if (a && a.source === "pointer") clear("pointer");
      };
      document.addEventListener("pointerdown", away);
      return () => document.removeEventListener("pointerdown", away);
    }, () => [store.value, clear], false);
    const point = computed(() => (e: PointerEvent): [number, number] | null => {
      const cur = live.value.L;
      const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      if (!cur || !r.width || !r.height) return null;
      return [(e.clientX - r.left) * (cur.w / r.width), (e.clientY - r.top) * (cur.h / r.height)];
    });
    const track = computed(() => (e: PointerEvent) => {
      const cur = live.value.L;
      const p = point.value(e);
      if (!cur || !p) return;
      const idx = hitIndex(cur.targets, p[0], p[1]);
      if (idx == null) return clear("pointer");
      const a = store.value.get().active;
      if (a && a.index === idx && a.source === "pointer") return;
      activate(idx, null, "pointer");
    });
    const onKeydown = computed(() => (e: KeyboardEvent) => {
      const {
        L: cur,
        seriesCount: sc
      } = live.value;
      if (!cur || e.altKey || e.ctrlKey || e.metaKey) return;
      const a = store.value.get().active;
      if (e.key === "Escape") {
        if (a) {
          store.value.set({
            announce: "" as const
          });
          clear();
        }
        return;
      }
      if (sc > 0 && cur.targets.mode !== "y" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        const base = a?.index ?? 0;
        const order: Array<number | null> = [null, ...Array.from({
          length: sc
        }, (_, i) => i)];
        const at = order.indexOf(a?.series ?? null);
        const next = order[(at + (e.key === "ArrowUp" ? 1 : -1) + order.length) % order.length];
        activate(base, next, "keyboard");
        return;
      }
      if ((e.key === "Enter" || e.key === " ") && a) {
        e.preventDefault();
        live.value.onSelect?.({
          index: a.index,
          series: a.series
        });
        return;
      }
      const next = stepIndex(cur.targets, a?.index ?? null, e.key);
      if (next == null) return;
      e.preventDefault();
      activate(next, a?.series ?? null, "keyboard");
    });
    const onClick = computed(() => (e: MouseEvent) => {
      const cur = live.value.L;
      const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      if (!cur || !live.value.onSelect || !r.width || !r.height) return;
      const idx = hitIndex(cur.targets, (e.clientX - r.left) * (cur.w / r.width), (e.clientY - r.top) * (cur.h / r.height));
      if (idx != null) live.value.onSelect({
        index: idx,
        series: store.value.get().active?.series ?? null
      });
    });
    const canMove = computed(() => interactive.value && spec.value.state === "ready");
    const merged = computed(() => useMergedRef<HTMLElement>(hostRef, hostEl, ref.value as UI.Ref<HTMLElement> | undefined));
    return () => {
      return <>
      <div data-slot={slot.value ?? "chart-canvas"} data-chart-type={spec.value.type} data-bucket={L.value?.bucket} data-state={spec.value.state} data-reveal={reveal.value} ref={merged.value as UI.Ref<HTMLDivElement>} {...domProps(hostProps.value)} role={meter.value ? "meter" as const : canMove.value ? "application" as const : "img" as const} aria-roledescription={meter.value ? undefined : kindLabel.value.toLowerCase()} aria-valuemin={meter.value?.min} aria-valuemax={meter.value?.max} aria-valuenow={meter.value?.now} aria-valuetext={meter.value?.text} aria-label={label.value} aria-describedby={descId} aria-busy={spec.value.state === "loading" || undefined} tabindex={canMove.value ? 0 : undefined} dir="ltr" onPointerdown={canMove.value ? e => {
          pointerFocus.value = true;
          track.value(e);
        } : undefined} onPointermove={canMove.value ? track.value : undefined} onPointerleave={canMove.value ? e => e.pointerType === "touch" ? undefined : clear("pointer") : undefined} onFocus={canMove.value ? () => {
          if (pointerFocus.value || store.value.get().active) return;
          activate(0, null, "keyboard");
        } : undefined} onBlur={canMove.value ? e => {
          pointerFocus.value = false;
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) clear("keyboard");
        } : undefined} onKeydown={canMove.value ? onKeydown.value : undefined} onClick={canMove.value && onSelect.value ? onClick.value : undefined} class={cn("group/canvas relative isolate min-h-0 w-full flex-1 touch-pan-y select-none forced-colors:hidden", REVEAL, className.value)} {...domProps(props.value)}>
        {node.value}
        {L.value ? <>
            <ChartLabels labels={L.value.labels} box={{
              w: L.value.w,
              h: L.value.h
            }} />
            {overlay.value ? <div class="pointer-events-none absolute inset-0 forced-colors:hidden">{overlay.value(L.value)}</div> : null}
            {canMove.value ? <ChartCursors store={store.value} L={L.value} seed={String(inkSeed.value)} /> : null}
            <TooltipLayer store={store.value} />
          </> : null}
      </div>
      <ChartData id={descId} summary={summary.value} table={table.value} label={label.value} />
      {canMove.value ? <ChartLive store={store.value} /> : null}
    </>;
    };
  });
})();
type ChartTooltipProps = {
  content?: UI.ReactElement;
  cursor?: boolean;
  defaultIndex?: number;
};
const ChartTooltip = defineUi<ChartTooltipProps>("ChartTooltip", ["content", "cursor", "defaultIndex"], (_props, {
  slots: _slots
}) => {
  const content = computed(() => _props["content"]);
  const cursor = computed(() => _props["cursor"] === undefined ? true : _props["cursor"]);
  const defaultIndex = computed(() => _props["defaultIndex"]);
  const _hook3 = useChart();
  const store = computed(() => _hook3.value.store);
  watchDependencies(() => {
    store.value.cfg = {
      content: content.value,
      cursor: cursor.value,
      defaultIndex: defaultIndex.value
    };
    if (!store.value.get().tooltip) store.value.set({
      tooltip: true
    });
    const activate = (store.value as unknown as {
      activate?: (index: number, series: number | null, source: "default") => void;
    }).activate;
    if (defaultIndex.value != null) activate?.(defaultIndex.value, null, "default");else if (store.value.get().active?.source === "default") store.value.set({
      active: null,
      model: null
    });
  }, () => [store.value, content.value, cursor.value, defaultIndex.value], true);
  watchDependencies(() => () => store.value.set({
    tooltip: false,
    active: null,
    model: null
  }), () => [store.value], true);
  return () => {
    return null;
  };
});
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : undefined;
  let configLabelKey: string = key;
  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key as keyof typeof payloadPayload] === "string") {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }
  return configLabelKey in config ? config[configLabelKey] : config[key];
}
type ChartTooltipContentProps = Omit<UI.ComponentProps<"div">, "color" | "label"> & {
  active?: boolean;
  payload?: ChartTooltipItem[];
  label?: UI.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  color?: string;
  labelClassName?: string;
  labelFormatter?: (label: UI.ReactNode, payload: ChartTooltipItem[]) => UI.ReactNode;
  formatter?: (value: number | string | null, name: string, item: ChartTooltipItem, index: number, payload: Row | undefined) => UI.ReactNode;
};
const ChartTooltipContent = defineUi<ChartTooltipContentProps>("ChartTooltipContent", ["active", "payload", "class", "indicator", "hideLabel", "hideIndicator", "label", "labelFormatter", "labelClassName", "formatter", "color", "nameKey", "labelKey"], (_props, {
  slots: _slots
}) => {
  const active = computed(() => _props["active"]);
  const payload = computed(() => _props["payload"]);
  const className = computed(() => _props["class"]);
  const indicator = computed(() => _props["indicator"] === undefined ? "dot" as const : _props["indicator"]);
  const hideLabel = computed(() => _props["hideLabel"] === undefined ? false : _props["hideLabel"]);
  const hideIndicator = computed(() => _props["hideIndicator"] === undefined ? false : _props["hideIndicator"]);
  const label = computed(() => _props["label"]);
  const labelFormatter = computed(() => _props["labelFormatter"]);
  const labelClassName = computed(() => _props["labelClassName"]);
  const formatter = computed(() => _props["formatter"]);
  const color = computed(() => _props["color"]);
  const nameKey = computed(() => _props["nameKey"]);
  const labelKey = computed(() => _props["labelKey"]);
  const props = computed(() => omitProps(_props, ["active", "payload", "class", "indicator", "hideLabel", "hideIndicator", "label", "labelFormatter", "labelClassName", "formatter", "color", "nameKey", "labelKey"]));
  const _hook14 = useChart();
  const config = computed(() => _hook14.value.config);
  const tooltipLabel = renderValue(() => {
    if (hideLabel.value || !payload.value?.length) return null;
    const [item] = payload.value;
    const key = `${labelKey.value ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config.value, item, key);
    const value: UI.ReactNode = !labelKey.value && typeof label.value === "string" ? config.value[label.value]?.label ?? label.value : itemConfig?.label ?? label.value;
    if (labelFormatter.value) return <div class={cn("font-script text-lg leading-none font-semibold", labelClassName.value)}>{labelFormatter.value(value, payload.value)}</div>;
    if (!value) return null;
    return <div class={cn("font-script text-lg leading-none font-semibold", labelClassName.value)}>{value}</div>;
  });
  return () => {
    if (!active.value || !payload.value?.length) return null;
    const nestLabel = payload.value.length === 1 && indicator.value !== "dot";
    return <Paper data-slot="chart-tooltip" stock="slip" edge="cut" tilt={0.7} seed="chart-tooltip" class={cn("grid min-w-[8rem] items-start gap-1.5 px-3 py-2 font-hand text-[13px] text-foreground", className.value)} {...domProps(props.value as UI.ComponentProps<"div">)}>
      {!nestLabel ? tooltipLabel.value : null}
      <div class="grid gap-1.5">
        {payload.value.filter(item => item.type !== "none").map((item, index) => {
          const key = `${nameKey.value ?? item.name ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config.value, item, key) ?? (item.dataKey ? config.value[item.dataKey] : undefined);
          const indicatorColor = color.value ?? item.payload?.fill as string | undefined ?? item.color;
          return <div key={index} class={cn("flex w-full flex-wrap items-stretch gap-2 [&>svg:not(.absolute)]:h-2.5 [&>svg:not(.absolute)]:w-2.5 [&>svg:not(.absolute)]:text-muted-foreground", indicator.value === "dot" && "items-center")}>
                {formatter.value && item?.value !== undefined && item.name ? formatter.value(item.value, item.name, item, index, item.payload) : <>
                    {itemConfig?.icon ? <itemConfig.icon /> : !hideIndicator.value && (item.slot !== undefined ? indicator.value === "dashed" ? null : <ChartSwatch palette={item.slot} pattern={item.pattern} marker={item.marker} line={item.kind === "line" && indicator.value === "dot"} class={cn(indicator.value === "line" && "h-auto w-1.5 self-stretch")} /> : <span aria-hidden="true" class="size-2.5 shrink-0 bg-(--color-bg)" style={cssStyle({
                "--color-bg": indicatorColor
              } as UI.CSSProperties)} />)}
                    {indicator.value === "dashed" && !hideIndicator.value ? <span aria-hidden="true" class="w-0 shrink-0 border-[1.5px] border-dashed border-(--color-border)" style={cssStyle({
                "--color-border": indicatorColor
              } as UI.CSSProperties)} /> : null}
                    <div class={cn("flex flex-1 justify-between gap-4 leading-none", nestLabel ? "items-end" as const : "items-center" as const)}>
                      <div class="grid gap-1.5">
                        {nestLabel ? tooltipLabel.value : null}
                        <span class="text-muted-foreground">{itemConfig?.label ?? item.name}</span>
                      </div>
                      {item.value != null && <span class="font-bold text-foreground tabular-nums">
                          {typeof item.value === "number" ? formatNumber(item.value) : String(item.value)}
                          {item.unit ? <span class="ms-0.5 font-normal text-muted-foreground">{item.unit}</span> : null}
                        </span>}
                    </div>
                  </>}
              </div>;
        })}
      </div>
    </Paper>;
  };
});
type ChartLegendContentProps = UI.ComponentProps<"div"> & {
  hideIcon?: boolean;
  verticalAlign?: "top" | "bottom";
  payload?: unknown;
  nameKey?: string;
  keys?: readonly string[];
  toggle?: boolean;
};
const ChartLegendContent = defineUi<ChartLegendContentProps>("ChartLegendContent", ["class", "hideIcon", "verticalAlign", "payload", "nameKey", "keys", "toggle"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const hideIcon = computed(() => _props["hideIcon"] === undefined ? false : _props["hideIcon"]);
  const verticalAlign = computed(() => _props["verticalAlign"] === undefined ? "bottom" as const : _props["verticalAlign"]);
  const _payload = computed(() => _props["payload"]);
  const _nameKey = computed(() => _props["nameKey"]);
  const keys = computed(() => _props["keys"]);
  const canToggle = computed(() => _props["toggle"] === undefined ? true : _props["toggle"]);
  const props = computed(() => omitProps(_props, ["class", "hideIcon", "verticalAlign", "payload", "nameKey", "keys", "toggle"]));
  const _hook8 = useChart();
  const config = computed(() => _hook8.value.config);
  const store = computed(() => _hook8.value.store);
  const hidden = computed(() => _hook8.value.hidden);
  const toggle = computed(() => _hook8.value.toggle);
  const configKeys = computed(() => _hook8.value.keys);
  const patterns = computed(() => _hook8.value.patterns);
  const st = useStoreState(() => store.value);
  const entries = computed<LegendEntry[]>(() => st.value.legend.length ? st.value.legend.filter(e => !keys.value || keys.value.includes(e.key)) : configKeys.value.filter(k => !keys.value || keys.value.includes(k)).map((k, i) => {
    const look = seriesLook("bar", i, configKeys.value.length, patterns.value, config.value[k] ?? {});
    return {
      key: k,
      slot: i,
      pattern: look.pattern,
      marker: look.marker,
      dash: look.dash,
      kind: "bar" as XYKind
    };
  }));
  const ordered = computed(() => keys.value ? keys.value.flatMap(k => entries.value.filter(e => e.key === k)) : entries.value);
  return () => {
    void _payload.value;
    void _nameKey.value;
    if (!ordered.value.length) return null;
    return <div data-slot="chart-legend" class={cn("flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5", verticalAlign.value === "top" ? "pb-3" as const : "pt-3" as const, className.value)} {...domProps(props.value)}>
      {ordered.value.map(e => {
        const item = config.value[e.key];
        const off = hidden.value.has(e.key);
        const body = <>
            {item?.icon && !hideIcon.value ? <item.icon /> : <ChartSwatch palette={e.slot} pattern={e.pattern} marker={e.kind === "line" ? e.marker : undefined} line={e.kind === "line"} />}
            <span class={cn("font-hand text-sm", off && "text-muted-foreground line-through decoration-wavy decoration-1")}>{item?.label ?? e.key}</span>
          </>;
        return canToggle.value ? <button key={e.key} type="button" data-slot="chart-legend-item" aria-pressed={!off} onClick={() => toggle.value(e.key)} class={cn("inline-flex min-h-6 min-w-6 items-center gap-1.5 px-1.5 hover:ll-swipe [&>svg:not(.absolute)]:h-3 [&>svg:not(.absolute)]:w-3 [&>svg:not(.absolute)]:text-muted-foreground", off && "opacity-70")}>
            {body}
          </button> : <div key={e.key} data-slot="chart-legend-item" class="inline-flex min-h-6 items-center gap-1.5 px-1.5 [&>svg:not(.absolute)]:h-3 [&>svg:not(.absolute)]:w-3 [&>svg:not(.absolute)]:text-muted-foreground">
            {body}
          </div>;
      })}
    </div>;
  };
});
type ChartLegendProps = Omit<ChartLegendContentProps, "content"> & {
  content?: UI.ReactElement;
};
const ChartLegend = defineUi<ChartLegendProps>("ChartLegend", ["content"], (_props, {
  slots: _slots
}) => {
  const content = computed(() => _props["content"]);
  const props = computed(() => omitProps(_props, ["content"]));
  return () => {
    return content.value ? cloneElement(content.value as UI.ReactElement<Record<string, unknown>>, props.value) : <ChartLegendContent {...domProps(props.value)}>{_slots.default?.()}</ChartLegendContent>;
  };
});
type Standalone = {
  onSelect?: (info: {
    index: number;
    series: number | null;
  }) => void;
  "data-slot"?: string;
  className?: string;
  config?: ChartConfig;
  tooltip?: boolean;
  legend?: boolean | "top" | "bottom";
};
function useSelfContained(_source0: MaybeRefOrGetter<Standalone & {
  className?: string;
}>, _source1: MaybeRefOrGetter<() => ChartConfig>, _source2: MaybeRefOrGetter<boolean>, _source3: MaybeRefOrGetter<() => UI.ReactNode>, _source4?: MaybeRefOrGetter<Partial<ChartContainerProps>>): ComputedRef<UI.ReactNode> {
  const props = computed(() => toValue(_source0));
  const autoConfig = computed(() => toValue(_source1));
  const hasLegend = computed(() => toValue(_source2));
  const render = computed(() => toValue(_source3));
  const containerProps = computed(() => toValue(_source4));
  const ctx = useContext(ChartContext);
  const auto = computed(() => props.value.config ? undefined : autoConfig.value());
  const autoKey = computed(() => auto.value ? Object.keys(auto.value).join("\u0000") : "" as const);
  const config = computed(() => props.value.config ?? auto.value ?? {});
  return renderValue(() => {
    if (ctx.value) return render.value();
    const legend = props.value.legend ?? hasLegend.value;
    return <ChartContainer config={config.value} class={props.value.className} {...domProps(containerProps.value)}>
      {legend === "top" ? <ChartLegend verticalAlign="top" /> : null}
      {render.value()}
      {props.value.tooltip === false ? null : <ChartTooltip />}
      {legend === true || legend === "bottom" ? <ChartLegend /> : null}
    </ChartContainer>;
  });
}
function useLegend(_source0: MaybeRefOrGetter<ChartStore>, _source1: MaybeRefOrGetter<LegendEntry[]>) {
  const store = computed(() => toValue(_source0));
  const entries = computed(() => toValue(_source1));
  const key = computed(() => JSON.stringify(entries.value));
  watchDependencies(() => {
    store.value.set({
      legend: entries.value
    });
    return () => store.value.set({
      legend: []
    });
  }, () => [store.value, key.value], true);
  return computed(() => {});
}
type XYChartProps = Standalone & {
  data: readonly Row[];
  xKey?: string;
  series?: readonly string[];
  kinds?: Readonly<Record<string, XYKind>>;
  stacked?: boolean;
  curve?: "smooth" | "linear" | "step";
  yDomain?: readonly [DomainEnd, DomainEnd];
  xDomain?: readonly [DomainEnd, DomainEnd];
  zero?: boolean;
  xFormatter?: (value: unknown, index: number) => string;
  yFormatter?: (value: number) => string;
  valueFormatter?: (value: number) => string;
  dots?: "auto" | boolean;
  showValues?: "auto" | boolean;
  sizeKey?: string;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  annotations?: readonly ChartAnnotation[];
  references?: readonly ChartReference[];
  highlights?: readonly ChartHighlight[];
  label?: string;
  description?: string;
  accessibilityLayer?: boolean;
  xLabel?: string;
  loading?: boolean;
  emptyText?: string;
  animate?: boolean;
  seed?: string | number;
  onActiveChange?: (info: {
    index: number;
    series: number | null;
  } | null) => void;
};
type BarChartProps = XYChartProps & {
  horizontal?: boolean;
  layout?: "horizontal" | "vertical";
};
const KIND_NOUN: Record<XYKind, string> = {
  bar: "Bar chart" as const,
  line: "Line chart" as const,
  area: "Area chart" as const,
  scatter: "Scatter chart" as const
};
function inferXKey(rows: readonly Row[]): string {
  const first = rows[0] ?? {};
  const text = Object.keys(first).find(k => typeof first[k] === "string" && toNum(first[k]) === null);
  return text ?? Object.keys(first)[0] ?? "x";
}
const XYChartBody = defineUi<XYChartProps & {
  kind: XYKind;
  horizontal?: boolean;
}>("XYChartBody", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const kind = computed(() => props.kind);
  const data = computed(() => props.data);
  const xKey = computed(() => props.xKey);
  const series = computed(() => props.series);
  const kinds = computed(() => props.kinds);
  const stacked = computed(() => props.stacked);
  const horizontal = computed(() => props.horizontal);
  const curve = computed(() => props.curve);
  const yDomain = computed(() => props.yDomain);
  const xDomain = computed(() => props.xDomain);
  const zero = computed(() => props.zero);
  const xFormatter = computed(() => props.xFormatter);
  const yFormatter = computed(() => props.yFormatter);
  const valueFormatter = computed(() => props.valueFormatter);
  const dots = computed(() => props.dots);
  const showValues = computed(() => props.showValues);
  const showGrid = computed(() => props.showGrid === undefined ? true : props.showGrid);
  const showXAxis = computed(() => props.showXAxis === undefined ? true : props.showXAxis);
  const showYAxis = computed(() => props.showYAxis === undefined ? true : props.showYAxis);
  const annotations = computed(() => props.annotations);
  const references = computed(() => props.references);
  const highlights = computed(() => props.highlights);
  const label = computed(() => props.label);
  const description = computed(() => props.description);
  const xLabel = computed(() => props.xLabel);
  const loading = computed(() => props.loading);
  const emptyText = computed(() => props.emptyText);
  const animate = computed(() => props.animate);
  const seed = computed(() => props.seed);
  const onActiveChange = computed(() => props.onActiveChange);
  const sizeKey = computed(() => props.sizeKey);
  const ctx = useChart();
  const xk = computed(() => xKey.value ?? inferXKey(data.value));
  const keys = computed(() => series.value ? [...series.value] : inferSeries(data.value, xk.value, ctx.value.config));
  const inputs = computed<SeriesInput[]>(() => keys.value.map((k, i) => {
    const at = ctx.value.keys.indexOf(k);
    const c = ctx.value.config[k];
    return {
      key: k,
      name: labelText(ctx.value.config, k),
      slot: at >= 0 ? at : i,
      kind: kinds.value?.[k],
      pattern: c?.pattern,
      marker: c?.marker,
      dash: c?.dash
    };
  }));
  const built = computed(() => buildXYRows({
    rows: data.value,
    xKey: xk.value,
    series: inputs.value,
    kind: kind.value,
    stacked: stacked.value,
    horizontal: horizontal.value,
    curve: curve.value,
    domain: yDomain.value,
    xDomain: xDomain.value,
    zero: zero.value,
    xFormat: xFormatter.value,
    yFormat: yFormatter.value,
    valueFormat: valueFormatter.value,
    dots: dots.value,
    values: showValues.value ?? "auto",
    grid: showGrid.value,
    showX: showXAxis.value,
    showY: showYAxis.value,
    notes: annotations.value,
    refs: references.value,
    bands: highlights.value,
    patterns: ctx.value.patterns,
    hidden: ctx.value.hidden,
    state: loading.value ? "loading" as const : undefined,
    stateText: loading.value ? "Loading" as const : emptyText.value,
    sizeKey: sizeKey.value
  }));
  const spec = computed<XYSpec>(() => built.value.spec);
  const rows = computed(() => built.value.rows);
  const vf = computed(() => valueFormatter.value ?? formatNumber);
  const noun = computed(() => spec.value.series.some(s => s.kind !== kind.value) ? "Chart" as const : KIND_NOUN[kind.value]);
  const name = computed(() => label.value ?? noun.value);
  const summary = computed(() => `${summarizeXY(spec.value, {
    kind: noun.value,
    title: label.value,
    format: vf.value
  })}${description.value ? ` ${description.value}` : "" as const}`);
  const table = computed(() => tableXY(spec.value, {
    format: vf.value,
    xHead: xLabel.value ?? xk.value,
    xFormat: xFormatter.value ? v => xFormatter.value(v, 0) : undefined
  }));
  useLegend(() => ctx.value.store, () => inputs.value.map(s => {
    const k = s.kind ?? kind.value;
    const look = seriesLook(k, s.slot ?? 0, inputs.value.length, ctx.value.patterns, s);
    return {
      key: s.key,
      slot: s.slot ?? 0,
      pattern: look.pattern,
      marker: look.marker,
      dash: look.dash,
      kind: k
    };
  }));
  const describe = (index: number, si: number | null, L: ChartLayoutBase): Described | null => {
    const xl = L as XYLayout;
    const scatter = kind.value === "scatter";
    if (scatter) {
      const p = xl.pointOf[index];
      if (!p) return null;
      const s = spec.value.series[p.s];
      const row = rows.value[p.j];
      const x = s.xs?.[p.j] ?? 0;
      const xs = xFormatter.value ? xFormatter.value(x, p.j) : formatNumber(x);
      const y = s.values[p.j];
      const items: ChartTooltipItem[] = [{
        dataKey: s.key,
        name: s.name,
        value: isNum(y) ? y : null,
        color: `var(--color-${s.key})`,
        fill: `var(--color-${s.key})`,
        payload: row,
        slot: s.slot,
        pattern: s.pattern,
        marker: s.marker,
        kind: "scatter" as const
      }];
      return {
        label: `${xLabel.value ?? xk.value} ${xs}`,
        payload: items,
        announce: `${s.name}: ${xs}, ${isNum(y) ? vf.value(y) : "no value" as const}`
      };
    }
    const row = rows.value[index];
    const items: ChartTooltipItem[] = spec.value.series.flatMap((s): ChartTooltipItem[] => {
      const v = s.values[index];
      if (!isNum(v)) return [];
      return [{
        dataKey: s.key,
        name: s.name,
        value: v,
        color: `var(--color-${s.key})`,
        fill: `var(--color-${s.key})`,
        payload: row,
        slot: s.slot,
        pattern: s.pattern,
        marker: s.marker,
        kind: s.kind
      }];
    });
    const spoken = si == null ? items : items.filter(it => it.dataKey === spec.value.series[si]?.key);
    const cat = spec.value.cats[index] ?? "";
    return {
      label: cat,
      payload: items,
      announce: `${cat}: ${(spoken.length ? spoken : items).map(it => `${it.name} ${vf.value(it.value as number)}`).join(", ")}`
    };
  };
  return () => {
    return <ChartCanvas slot={props["data-slot"]} recipe={xyRecipe} spec={spec.value} kindLabel={noun.value} label={name.value} summary={summary.value} table={table.value} describe={describe} seriesCount={kind.value === "scatter" ? 0 : spec.value.series.length > 1 ? spec.value.series.length : 0} animate={animate.value} seed={seed.value} onActiveChange={onActiveChange.value} onSelect={props.onSelect} interactive={spec.value.state === "ready"} />;
  };
});
const XYChart = defineUi<XYChartProps & {
  kind: XYKind;
  horizontal?: boolean;
}>("XYChart", ["kind", "horizontal"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"]);
  const horizontal = computed(() => _props["horizontal"]);
  const props = computed(() => omitProps(_props, ["kind", "horizontal"]));
  const body = renderValue(() => <XYChartBody kind={kind.value} horizontal={horizontal.value} {...domProps(props.value)} />);
  const xk = computed(() => props.value.xKey ?? inferXKey(props.value.data));
  const seriesKeys = computed(() => props.value.series ? [...props.value.series] : inferSeries(props.value.data, xk.value, props.value.config));
  const _nestedHook0 = useSelfContained(() => props.value, () => () => Object.fromEntries(seriesKeys.value.map(k => [k, {
    label: k
  }])) as ChartConfig, () => seriesKeys.value.length > 1, () => () => body.value);
  return () => {
    return _nestedHook0.value;
  };
});
const BarChart = defineUi<BarChartProps>("BarChart", ["layout", "horizontal"], (_props, {
  slots: _slots
}) => {
  const layout = computed(() => _props["layout"]);
  const horizontal = computed(() => _props["horizontal"]);
  const props = computed(() => omitProps(_props, ["layout", "horizontal"]));
  return () => {
    return <XYChart data-slot="bar-chart" kind="bar" horizontal={horizontal.value ?? layout.value === "vertical"} {...domProps(props.value)}>{_slots.default?.()}</XYChart>;
  };
});
const LineChart = defineUi<XYChartProps>("LineChart", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  return () => {
    return <XYChart data-slot="line-chart" kind="line" {...domProps(props)}>{_slots.default?.()}</XYChart>;
  };
});
const AreaChart = defineUi<XYChartProps>("AreaChart", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  return () => {
    return <XYChart data-slot="area-chart" kind="area" {...domProps(props)}>{_slots.default?.()}</XYChart>;
  };
});
const ScatterChart = defineUi<XYChartProps>("ScatterChart", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  return () => {
    return <XYChart data-slot="scatter-chart" kind="scatter" {...domProps(props)}>{_slots.default?.()}</XYChart>;
  };
});
type ChartCenter = {
  value: UI.ReactNode;
  label?: UI.ReactNode;
};
const ChartCenterLabel = defineUi<ChartCenter & {
  className?: string;
}>("ChartCenterLabel", ["value", "label", "class"], (_props, {
  slots: _slots
}) => {
  const value = computed(() => _props["value"]);
  const label = computed(() => _props["label"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <div data-slot="chart-center" class={cn("flex flex-col items-center text-center leading-none", className.value)}>
      <span class="font-script text-[2rem] leading-none font-bold text-foreground tabular-nums calm:font-hand calm:text-2xl">{value.value}</span>
      {label.value ? <span class="mt-1 font-hand text-[13px] text-muted-foreground">{label.value}</span> : null}
    </div>;
  };
});
const isCenterObject = (c: unknown): c is ChartCenter => typeof c === "object" && c !== null && !isValidElement(c) && "value" in c;
const AtPoint = defineUi<{
  x: number;
  y: number;
  box: {
    w: number;
    h: number;
  };
  children: UI.ReactNode;
}>("AtPoint", ["x", "y", "box"], (_props, {
  slots: _slots
}) => {
  const x = computed(() => _props["x"]);
  const y = computed(() => _props["y"]);
  const box = computed(() => _props["box"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <div class="absolute" style={cssStyle({
      left: `${round(x.value / box.value.w * 100, 3)}%`,
      top: `${round(y.value / box.value.h * 100, 3)}%`,
      transform: "translate(-50%, -50%)" as const
    })}>
      {readSlot(_slots.default)}
    </div>;
  };
});
type PieChartProps = Standalone & {
  data: readonly Row[];
  nameKey?: string;
  valueKey?: string;
  innerRadius?: number;
  startAngle?: number;
  showLabels?: boolean;
  valueFormatter?: (value: number) => string;
  centerLabel?: UI.ReactNode | ChartCenter | ((info: {
    total: number;
    active: {
      name: string;
      value: number;
      percent: number;
    } | null;
  }) => UI.ReactNode);
  label?: string;
  description?: string;
  loading?: boolean;
  emptyText?: string;
  animate?: boolean;
  seed?: string | number;
  onActiveChange?: (info: {
    index: number;
    series: number | null;
  } | null) => void;
};
const PieCenter = defineUi<{
  store: ChartStore;
  L: PieLayout;
  total: number;
  slices: PieSpec["slices"];
  centerLabel: NonNullable<PieChartProps["centerLabel"]>;
}>("PieCenter", ["store", "L", "total", "slices", "centerLabel"], (_props, {
  slots: _slots
}) => {
  const store = computed(() => _props["store"]);
  const L = computed(() => _props["L"]);
  const total = computed(() => _props["total"]);
  const slices = computed(() => _props["slices"]);
  const centerLabel = computed(() => _props["centerLabel"]);
  const st = useStoreState(() => store.value);
  return () => {
    let content: UI.ReactNode;
    if (typeof centerLabel.value === "function") {
      const a = st.value.active ? slices.value[L.value.sliceOf[st.value.active.index]] : undefined;
      content = centerLabel.value({
        total: total.value,
        active: a ? {
          name: a.name,
          value: a.value,
          percent: total.value ? a.value / total.value : 0
        } : null
      });
    } else content = isCenterObject(centerLabel.value) ? <ChartCenterLabel {...domProps(centerLabel.value)} /> : centerLabel.value;
    return <AtPoint x={L.value.cx} y={L.value.cy} box={{
      w: L.value.w,
      h: L.value.h
    }}>
      {content}
    </AtPoint>;
  };
});
const PieChartBody = defineUi<PieChartProps>("PieChartBody", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const data = computed(() => props.data);
  const nameKey = computed(() => props.nameKey);
  const valueKey = computed(() => props.valueKey);
  const innerRadius = computed(() => props.innerRadius === undefined ? 0 : props.innerRadius);
  const startAngle = computed(() => props.startAngle === undefined ? 0 : props.startAngle);
  const showLabels = computed(() => props.showLabels === undefined ? true : props.showLabels);
  const valueFormatter = computed(() => props.valueFormatter);
  const centerLabel = computed(() => props.centerLabel);
  const label = computed(() => props.label);
  const description = computed(() => props.description);
  const loading = computed(() => props.loading);
  const emptyText = computed(() => props.emptyText);
  const animate = computed(() => props.animate);
  const seed = computed(() => props.seed);
  const onActiveChange = computed(() => props.onActiveChange);
  const ctx = useChart();
  const nk = computed(() => nameKey.value ?? inferXKey(data.value));
  const vk = computed(() => valueKey.value ?? inferSeries(data.value, nk.value, undefined)[0] ?? "value");
  const vf = computed(() => valueFormatter.value ?? formatNumber);
  const all = computed(() => data.value.map((r, i) => {
    const key = String(r[nk.value] ?? i);
    const at = ctx.value.keys.indexOf(key);
    return {
      key,
      name: labelText(ctx.value.config, key),
      slot: at >= 0 ? at : i,
      value: toNum(r[vk.value]) ?? 0,
      row: r
    };
  }));
  const spec = computed<PieSpec>(() => {
    const drawn = all.value.filter(s => !ctx.value.hidden.has(s.key));
    return {
      type: "pie" as const,
      slices: drawn.map(s => ({
        key: s.key,
        name: s.name,
        slot: s.slot,
        value: s.value,
        pattern: ctx.value.patterns === false || all.value.length < 2 ? "solid" as Pattern : (ctx.value.config[s.key]?.pattern && ctx.value.config[s.key]?.pattern !== "auto" ? ctx.value.config[s.key]?.pattern : PATTERNS[s.slot % PATTERNS.length]) as Pattern
      })),
      inner: Math.max(0, Math.min(0.9, innerRadius.value)),
      start: startAngle.value,
      labels: showLabels.value,
      patterns: ctx.value.patterns !== false,
      state: loading.value ? "loading" as const : drawn.reduce((n, s) => n + s.value, 0) > 0 ? "ready" as const : "empty" as const,
      stateText: loading.value ? "Loading" as const : emptyText.value
    };
  });
  const total = computed(() => spec.value.slices.reduce((n, s) => n + s.value, 0));
  const pct = computed(() => shares(spec.value.slices.map(s => s.value)));
  const noun = computed(() => innerRadius.value > 0 ? "Donut chart" as const : "Pie chart" as const);
  const name = computed(() => label.value ?? noun.value);
  const summary = computed(() => {
    if (spec.value.state === "loading") return `${name.value}. Loading.`;
    if (spec.value.state === "empty") return `${name.value}. No data.`;
    const parts = spec.value.slices.map((s, i) => `${s.name} ${vf.value(s.value)} (${pct.value[i]})`);
    return `${label.value ? `${label.value}. ` : "" as const}${noun.value} of ${spec.value.slices.length} slice${spec.value.slices.length === 1 ? "" as const : "s" as const}, total ${vf.value(total.value)}: ${parts.join(", ")}.${description.value ? ` ${description.value}` : "" as const}`;
  });
  const table = computed<TableModel>(() => ({
    head: [nk.value, vk.value, "Share"],
    rows: spec.value.slices.map((s, i) => [s.name, vf.value(s.value), pct.value[i]])
  }));
  useLegend(() => ctx.value.store, () => all.value.map(s => ({
    key: s.key,
    slot: s.slot,
    pattern: (ctx.value.patterns === false || all.value.length < 2 ? "solid" as const : PATTERNS[s.slot % PATTERNS.length]) as Pattern,
    marker: "circle" as MarkerShape,
    dash: "solid" as Dash,
    kind: "slice" as const
  })));
  const describe = (index: number, _si: number | null, L: ChartLayoutBase): Described | null => {
    const pl = L as PieLayout;
    const sl = spec.value.slices[pl.sliceOf[index]];
    if (!sl) return null;
    const share = pct.value[pl.sliceOf[index]];
    const row = all.value.find(a => a.key === sl.key)?.row;
    return {
      label: sl.name,
      payload: [{
        dataKey: sl.key,
        name: sl.name,
        value: sl.value,
        color: `var(--color-${sl.key})`,
        fill: `var(--color-${sl.key})`,
        payload: row,
        slot: sl.slot,
        pattern: sl.pattern,
        kind: "bar" as XYKind,
        unit: ` (${share})`
      }],
      announce: `${sl.name}: ${vf.value(sl.value)}, ${share}`
    };
  };
  return () => {
    return <ChartCanvas slot={props["data-slot"] ?? "pie-chart"} recipe={pieRecipe} spec={spec.value} kindLabel={noun.value} label={name.value} summary={summary.value} table={table.value} describe={describe} animate={animate.value} seed={seed.value} onActiveChange={onActiveChange.value} onSelect={props.onSelect} interactive={spec.value.state === "ready"} overlay={centerLabel.value != null && spec.value.state === "ready" ? L => <PieCenter store={ctx.value.store} L={L as PieLayout} total={total.value} slices={spec.value.slices} centerLabel={centerLabel.value} /> : undefined} />;
  };
});
const PieChart = defineUi<PieChartProps>("PieChart", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const nk = computed(() => props.nameKey ?? inferXKey(props.data));
  const _nestedHook0 = useSelfContained(() => props, () => () => Object.fromEntries(props.data.map(r => [String(r[nk.value]), {
    label: String(r[nk.value])
  }])) as ChartConfig, () => true, () => () => <PieChartBody {...domProps(props)} />);
  return () => {
    return _nestedHook0.value;
  };
});
const DonutChart = defineUi<PieChartProps>("DonutChart", ["innerRadius"], (_props, {
  slots: _slots
}) => {
  const innerRadius = computed(() => _props["innerRadius"] === undefined ? 0.58 : _props["innerRadius"]);
  const props = computed(() => omitProps(_props, ["innerRadius"]));
  return () => {
    return <PieChart data-slot="donut-chart" innerRadius={innerRadius.value} {...domProps(props.value)}>{_slots.default?.()}</PieChart>;
  };
});
type RadarChartProps = Standalone & {
  data: readonly Row[];
  xKey?: string;
  series?: readonly string[];
  max?: number;
  levels?: number;
  fill?: boolean;
  dots?: boolean;
  valueFormatter?: (value: number) => string;
  label?: string;
  description?: string;
  loading?: boolean;
  emptyText?: string;
  animate?: boolean;
  seed?: string | number;
  onActiveChange?: (info: {
    index: number;
    series: number | null;
  } | null) => void;
};
const RadarChartBody = defineUi<RadarChartProps>("RadarChartBody", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const data = computed(() => props.data);
  const xKey = computed(() => props.xKey);
  const series = computed(() => props.series);
  const max = computed(() => props.max);
  const levels = computed(() => props.levels === undefined ? 4 : props.levels);
  const fill = computed(() => props.fill === undefined ? true : props.fill);
  const dots = computed(() => props.dots === undefined ? true : props.dots);
  const valueFormatter = computed(() => props.valueFormatter);
  const label = computed(() => props.label);
  const description = computed(() => props.description);
  const loading = computed(() => props.loading);
  const emptyText = computed(() => props.emptyText);
  const animate = computed(() => props.animate);
  const seed = computed(() => props.seed);
  const onActiveChange = computed(() => props.onActiveChange);
  const ctx = useChart();
  const xk = computed(() => xKey.value ?? inferXKey(data.value));
  const keys = computed(() => series.value ? [...series.value] : inferSeries(data.value, xk.value, ctx.value.config));
  const vf = computed(() => valueFormatter.value ?? formatNumber);
  const rimValue = computed(() => {
    if (max.value) return max.value;
    return radarRim(Math.max(0, ...keys.value.flatMap(k => data.value.map(r => toNum(r[k]) ?? 0))), levels.value);
  });
  const spec = computed<RadarSpec>(() => {
    const drawn = keys.value.filter(k => !ctx.value.hidden.has(k));
    const rs = drawn.map(k => {
      const at = ctx.value.keys.indexOf(k);
      const slot = at >= 0 ? at : keys.value.indexOf(k);
      const look = seriesLook("area", slot, keys.value.length, ctx.value.patterns, ctx.value.config[k] ?? {});
      return {
        key: k,
        name: labelText(ctx.value.config, k),
        slot,
        pattern: look.pattern,
        marker: look.marker,
        values: data.value.map(r => toNum(r[k]))
      };
    });
    const empty = !rs.length || data.value.length < 3;
    return {
      type: "radar" as const,
      axes: data.value.map(r => String(r[xk.value] ?? "")),
      series: rs,
      max: rimValue.value,
      levels: levels.value,
      ringLabels: Array.from({
        length: levels.value
      }, (_, l) => formatCompact(rimValue.value * (levels.value - l) / levels.value)),
      fill: fill.value,
      patterns: ctx.value.patterns !== false,
      dots: dots.value,
      state: loading.value ? "loading" as const : empty ? "empty" as const : "ready" as const,
      stateText: loading.value ? "Loading" as const : emptyText.value
    };
  });
  const name = computed(() => label.value ?? "Radar chart");
  const summary = computed(() => {
    if (spec.value.state === "loading") return `${name.value}. Loading.`;
    if (spec.value.state === "empty") return `${name.value}. No data.`;
    const each = spec.value.series.map(s => `${s.name}: ${spec.value.axes.map((a, i) => `${a} ${isNum(s.values[i]) ? vf.value(s.values[i] as number) : "none" as const}`).join(", ")}`);
    return `${label.value ? `${label.value}. ` : "" as const}Radar chart with ${spec.value.axes.length} axes and ${spec.value.series.length} series, scaled to ${vf.value(spec.value.max)}. ${each.join(". ")}.${description.value ? ` ${description.value}` : "" as const}`;
  });
  const table = computed<TableModel>(() => ({
    head: [xk.value, ...spec.value.series.map(s => s.name)],
    rows: spec.value.axes.map((a, i) => [a, ...spec.value.series.map(s => isNum(s.values[i]) ? vf.value(s.values[i] as number) : "" as const)])
  }));
  useLegend(() => ctx.value.store, () => keys.value.map(k => {
    const at = ctx.value.keys.indexOf(k);
    const slot = at >= 0 ? at : keys.value.indexOf(k);
    const look = seriesLook("area", slot, keys.value.length, ctx.value.patterns, ctx.value.config[k] ?? {});
    return {
      key: k,
      slot,
      pattern: look.pattern,
      marker: look.marker,
      dash: "solid" as Dash,
      kind: "area" as XYKind
    };
  }));
  const describe = (index: number): Described | null => {
    const axis = spec.value.axes[index];
    if (axis === undefined) return null;
    const items: ChartTooltipItem[] = spec.value.series.flatMap((s): ChartTooltipItem[] => isNum(s.values[index]) ? [{
      dataKey: s.key,
      name: s.name,
      value: s.values[index],
      color: `var(--color-${s.key})`,
      fill: `var(--color-${s.key})`,
      payload: data.value[index],
      slot: s.slot,
      pattern: s.pattern,
      marker: s.marker,
      kind: "area" as const
    }] : []);
    return {
      label: axis,
      payload: items,
      announce: `${axis}: ${items.map(i => `${i.name} ${vf.value(i.value as number)}`).join(", ")}`
    };
  };
  return () => {
    return <ChartCanvas slot={props["data-slot"] ?? "radar-chart"} recipe={radarRecipe} spec={spec.value} kindLabel="Radar chart" label={name.value} summary={summary.value} table={table.value} describe={describe} animate={animate.value} seed={seed.value} onActiveChange={onActiveChange.value} onSelect={props.onSelect} interactive={spec.value.state === "ready"} />;
  };
});
const RadarChart = defineUi<RadarChartProps>("RadarChart", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const xk = computed(() => props.xKey ?? inferXKey(props.data));
  const keys = computed(() => props.series ? [...props.series] : inferSeries(props.data, xk.value, props.config));
  const _nestedHook0 = useSelfContained(() => props, () => () => Object.fromEntries(keys.value.map(k => [k, {
    label: k
  }])) as ChartConfig, () => keys.value.length > 1, () => () => <RadarChartBody {...domProps(props)} />);
  return () => {
    return _nestedHook0.value;
  };
});
type RadialChartProps = Standalone & {
  data: readonly Row[];
  nameKey?: string;
  valueKey?: string;
  max?: number;
  startAngle?: number;
  endAngle?: number;
  valueFormatter?: (value: number) => string;
  centerLabel?: UI.ReactNode | ChartCenter;
  label?: string;
  description?: string;
  loading?: boolean;
  emptyText?: string;
  animate?: boolean;
  seed?: string | number;
  onActiveChange?: (info: {
    index: number;
    series: number | null;
  } | null) => void;
};
const RadialChartBody = defineUi<RadialChartProps>("RadialChartBody", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const data = computed(() => props.data);
  const nameKey = computed(() => props.nameKey);
  const valueKey = computed(() => props.valueKey);
  const max = computed(() => props.max === undefined ? 100 : props.max);
  const startAngle = computed(() => props.startAngle === undefined ? 0 : props.startAngle);
  const endAngle = computed(() => props.endAngle === undefined ? 270 : props.endAngle);
  const valueFormatter = computed(() => props.valueFormatter);
  const centerLabel = computed(() => props.centerLabel);
  const label = computed(() => props.label);
  const description = computed(() => props.description);
  const loading = computed(() => props.loading);
  const emptyText = computed(() => props.emptyText);
  const animate = computed(() => props.animate);
  const seed = computed(() => props.seed);
  const onActiveChange = computed(() => props.onActiveChange);
  const ctx = useChart();
  const nk = computed(() => nameKey.value ?? inferXKey(data.value));
  const vk = computed(() => valueKey.value ?? inferSeries(data.value, nk.value, undefined)[0] ?? "value");
  const vf = computed(() => valueFormatter.value ?? formatNumber);
  const all = computed(() => data.value.map((r, i) => {
    const key = String(r[nk.value] ?? i);
    const at = ctx.value.keys.indexOf(key);
    return {
      key,
      name: labelText(ctx.value.config, key),
      slot: at >= 0 ? at : i,
      value: toNum(r[vk.value]) ?? 0,
      max: toNum(r.max) ?? max.value,
      row: r
    };
  }));
  const spec = computed<RadialSpec>(() => {
    const drawn = all.value.filter(a => !ctx.value.hidden.has(a.key));
    return {
      type: "radial" as const,
      rings: drawn.map(a => ({
        key: a.key,
        name: a.name,
        slot: a.slot,
        pattern: ctx.value.patterns === false || all.value.length < 2 ? "solid" as const : PATTERNS[a.slot % PATTERNS.length],
        value: a.value,
        max: a.max
      })),
      start: startAngle.value,
      end: endAngle.value,
      patterns: ctx.value.patterns !== false,
      state: loading.value ? "loading" as const : drawn.length ? "ready" as const : "empty" as const,
      stateText: loading.value ? "Loading" as const : emptyText.value
    };
  });
  const name = computed(() => label.value ?? "Radial bar chart");
  const summary = computed(() => spec.value.state === "ready" ? `${label.value ? `${label.value}. ` : "" as const}Radial bar chart with ${spec.value.rings.length} ring${spec.value.rings.length === 1 ? "" as const : "s" as const}: ${spec.value.rings.map(r => `${r.name} ${vf.value(r.value)} of ${vf.value(r.max)}`).join(", ")}.${description.value ? ` ${description.value}` : "" as const}` : `${name.value}. ${spec.value.state === "loading" ? "Loading." as const : "No data." as const}`);
  const table = computed<TableModel>(() => ({
    head: [nk.value, vk.value, "Of"],
    rows: spec.value.rings.map(r => [r.name, vf.value(r.value), vf.value(r.max)])
  }));
  useLegend(() => ctx.value.store, () => all.value.map(a => ({
    key: a.key,
    slot: a.slot,
    pattern: (ctx.value.patterns === false || all.value.length < 2 ? "solid" as const : PATTERNS[a.slot % PATTERNS.length]) as Pattern,
    marker: "circle" as MarkerShape,
    dash: "solid" as Dash,
    kind: "slice" as const
  })));
  const describe = (index: number): Described | null => {
    const r = spec.value.rings[index];
    if (!r) return null;
    return {
      label: r.name,
      payload: [{
        dataKey: r.key,
        name: r.name,
        value: r.value,
        color: `var(--color-${r.key})`,
        fill: `var(--color-${r.key})`,
        slot: r.slot,
        pattern: r.pattern,
        kind: "bar" as const,
        unit: ` of ${vf.value(r.max)}`
      }],
      announce: `${r.name}: ${vf.value(r.value)} of ${vf.value(r.max)}`
    };
  };
  return () => {
    return <ChartCanvas slot={props["data-slot"] ?? "radial-chart"} recipe={radialRecipe} spec={spec.value} kindLabel="Radial bar chart" label={name.value} summary={summary.value} table={table.value} describe={describe} animate={animate.value} seed={seed.value} onActiveChange={onActiveChange.value} onSelect={props.onSelect} interactive={spec.value.state === "ready"} overlay={centerLabel.value != null && spec.value.state === "ready" ? L => <AtPoint x={(L as ReturnType<typeof layoutRadial>).cx} y={(L as ReturnType<typeof layoutRadial>).cy} box={{
      w: L.w,
      h: L.h
    }}>{isCenterObject(centerLabel.value) ? <ChartCenterLabel {...domProps(centerLabel.value)} /> : centerLabel.value}</AtPoint> : undefined} />;
  };
});
const RadialChart = defineUi<RadialChartProps>("RadialChart", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const nk = computed(() => props.nameKey ?? inferXKey(props.data));
  const _nestedHook0 = useSelfContained(() => props, () => () => Object.fromEntries(props.data.map(r => [String(r[nk.value]), {
    label: String(r[nk.value])
  }])) as ChartConfig, () => props.data.length > 1, () => () => <RadialChartBody {...domProps(props)} />);
  return () => {
    return _nestedHook0.value;
  };
});
const ZONE_TONE = {
  good: 2,
  warn: 3,
  bad: 5,
  info: 1,
  brand: 0
} as const;
type GaugeZoneInput = {
  to: number;
  tone?: keyof typeof ZONE_TONE | number;
};
type GaugeProps = Standalone & {
  value: number;
  min?: number;
  max?: number;
  zones?: readonly GaugeZoneInput[];
  sweep?: number;
  ticks?: number;
  valueFormatter?: (value: number) => string;
  children?: UI.ReactNode;
  label?: string;
  description?: string;
  loading?: boolean;
  animate?: boolean;
  seed?: string | number;
};
const GaugeBody = defineUi<GaugeProps>("GaugeBody", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const min = computed(() => props.min === undefined ? 0 : props.min);
  const max = computed(() => props.max === undefined ? 100 : props.max);
  const zones = computed(() => props.zones);
  const sweep = computed(() => props.sweep === undefined ? 180 : props.sweep);
  const ticks = computed(() => props.ticks === undefined ? 10 : props.ticks);
  const valueFormatter = computed(() => props.valueFormatter);
  const children = renderValue(() => readSlot(_slots.default));
  const label = computed(() => props.label);
  const description = computed(() => props.description);
  const loading = computed(() => props.loading);
  const animate = computed(() => props.animate);
  const seed = computed(() => props.seed);
  const value = computed(() => Number.isFinite(props.value) ? props.value : min.value);
  const vf = computed(() => valueFormatter.value ?? formatNumber);
  const ctx = useChart();
  const spec = computed<GaugeSpec>(() => ({
    type: "gauge" as const,
    value: value.value,
    min: min.value,
    max: max.value,
    zones: (zones.value ?? []).map((z, k) => ({
      to: z.to,
      slot: typeof z.tone === "number" ? z.tone : ZONE_TONE[z.tone ?? (["good", "warn", "bad"] as const)[k % 3]],
      pattern: PATTERNS[k % PATTERNS.length]
    })),
    sweep: sweep.value,
    ticks: ticks.value,
    minLabel: vf.value(min.value),
    maxLabel: vf.value(max.value),
    patterns: ctx.value.patterns !== false,
    state: loading.value ? "loading" as const : "ready" as const
  }));
  const name = computed(() => label.value ?? "Gauge");
  const zone = computed(() => spec.value.zones.length ? (zones.value ?? []).find(z => value.value <= z.to) : undefined);
  const text = computed(() => `${vf.value(value.value)} of ${vf.value(max.value)}${zone.value && typeof zone.value.tone === "string" ? `, ${zone.value.tone}` : "" as const}`);
  const summary = computed(() => `${label.value ? `${label.value}. ` : "" as const}Gauge reading ${vf.value(value.value)} on a scale from ${vf.value(min.value)} to ${vf.value(max.value)}.${description.value ? ` ${description.value}` : "" as const}`);
  const table = computed<TableModel>(() => ({
    head: ["Reading", "Minimum", "Maximum"],
    rows: [[vf.value(value.value), vf.value(min.value), vf.value(max.value)]]
  }));
  return () => {
    return <ChartCanvas slot={props["data-slot"] ?? "gauge"} recipe={gaugeRecipe} spec={spec.value} kindLabel="Gauge" label={name.value} summary={summary.value} table={table.value} describe={() => null} interactive={false} animate={animate.value} seed={seed.value} meter={{
      min: min.value,
      max: max.value,
      now: Math.max(min.value, Math.min(max.value, value.value)),
      text: text.value
    }} overlay={L => {
      const g = layoutGauge(spec.value, {
        w: L.w,
        h: L.h
      });
      return <AtPoint x={g.cx} y={g.cy + (spec.value.sweep <= 180 ? 26 : 14)} box={{
        w: L.w,
        h: L.h
      }}>
            {readSlot(_slots.default) ?? <ChartCenterLabel value={vf.value(value.value)} />}
          </AtPoint>;
    }} />;
  };
});
const Gauge = defineUi<GaugeProps>("Gauge", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const _nestedHook0 = useSelfContained(() => props, () => () => ({}), () => false, () => () => <GaugeBody {...domProps(props)} />, () => ({
    class: cn("aspect-[2/1] max-w-md", props.className)
  }));
  return () => {
    return _nestedHook0.value;
  };
});
type SparklineProps = Standalone & {
  data: readonly (number | null)[] | readonly Row[];
  dataKey?: string;
  xKey?: string;
  variant?: "line" | "area" | "bar";
  slot?: number;
  series?: string;
  ends?: boolean;
  extremes?: boolean;
  valueFormatter?: (value: number) => string;
  interactive?: boolean;
  label?: string;
  animate?: boolean;
  seed?: string | number;
};
const SparklineBody = defineUi<SparklineProps>("SparklineBody", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const data = computed(() => props.data);
  const dataKey = computed(() => props.dataKey);
  const xKey = computed(() => props.xKey);
  const variant = computed(() => props.variant === undefined ? "line" as const : props.variant);
  const slot = computed(() => props.slot);
  const series = computed(() => props.series);
  const ends = computed(() => props.ends === undefined ? true : props.ends);
  const extremes = computed(() => props.extremes === undefined ? false : props.extremes);
  const valueFormatter = computed(() => props.valueFormatter);
  const interactive = computed(() => props.interactive === undefined ? false : props.interactive);
  const label = computed(() => props.label);
  const animate = computed(() => props.animate === undefined ? false : props.animate);
  const seed = computed(() => props.seed);
  const ctx = useChart();
  const vf = computed(() => valueFormatter.value ?? formatNumber);
  const values = computed(() => {
    const all = (data.value as readonly unknown[]).map(d => typeof d === "object" && d !== null ? toNum((d as Row)[dataKey.value ?? "value"]) : toNum(d));
    return all.length > 600 ? lttb(all.map((v, i) => [i, v ?? 0] as [number, number]), 600).map(i => all[i]) : all;
  });
  const at = computed(() => series.value ? ctx.value.keys.indexOf(series.value) : -1);
  const sl = computed(() => slot.value ?? (at.value >= 0 ? at.value : 0));
  const spec = computed<SparkSpec>(() => {
    const real = values.value.filter(isNum);
    const lo = real.length ? Math.min(...real) : 0;
    const hi = real.length ? Math.max(...real) : 1;
    const pad = variant.value === "bar" ? 0 : (hi - lo || 1) * 0.04;
    return {
      type: "spark" as const,
      variant: variant.value,
      values: values.value,
      min: variant.value === "bar" ? Math.min(0, lo) : lo - pad,
      max: hi + pad,
      slot: sl.value,
      ends: ends.value,
      extremes: extremes.value,
      state: real.length ? "ready" as const : "empty" as const
    };
  });
  const real = computed(() => values.value.filter(isNum));
  const trend = computed(() => real.value.length > 1 ? real.value[real.value.length - 1] > real.value[0] ? "rising" as const : real.value[real.value.length - 1] < real.value[0] ? "falling" as const : "flat" as const : "flat" as const);
  const name = computed(() => label.value ?? "Trend");
  const summary = computed(() => real.value.length ? `${name.value}: ${real.value.length} points from ${vf.value(real.value[0])} to ${vf.value(real.value[real.value.length - 1])}, lowest ${vf.value(Math.min(...real.value))}, highest ${vf.value(Math.max(...real.value))}, ${trend.value}.` : `${name.value}: no data.`);
  const cat = computed(() => (i: number) => xKey.value && typeof data.value[i] === "object" && data.value[i] !== null ? String((data.value[i] as Row)[xKey.value] ?? i + 1) : `Point ${i + 1}`);
  const table = computed<TableModel | null>(() => interactive.value ? {
    head: [xKey.value ?? "Point", dataKey.value ?? "Value"],
    rows: values.value.slice(0, TABLE_ROW_CAP).map((v, i) => [cat.value(i), isNum(v) ? vf.value(v) : "" as const]),
    clipped: values.value.length > TABLE_ROW_CAP ? {
      shown: TABLE_ROW_CAP,
      total: values.value.length
    } : undefined
  } : null);
  const describe = (index: number): Described | null => {
    const v = values.value[index];
    if (!isNum(v)) return null;
    return {
      label: cat.value(index),
      payload: [{
        dataKey: dataKey.value ?? "value",
        name: name.value,
        value: v,
        color: `var(--ll-${SLOT_KEYS[sl.value % SLOT_KEYS.length]})`,
        payload: typeof data.value[index] === "object" ? data.value[index] as Row : undefined,
        slot: sl.value,
        kind: "line" as const
      }],
      announce: `${cat.value(index)}: ${vf.value(v)}`
    };
  };
  return () => {
    return <ChartCanvas slot={props["data-slot"] ?? "sparkline"} recipe={sparkRecipe} spec={spec.value} kindLabel="Sparkline" label={name.value} summary={summary.value} table={table.value} describe={describe} interactive={interactive.value && spec.value.state === "ready"} animate={animate.value} seed={seed.value} onSelect={props.onSelect} />;
  };
});
const Sparkline = defineUi<SparklineProps>("Sparkline", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const cfg = computed(() => props.config ?? {} as ChartConfig);
  const ctx = useContext(ChartContext);
  return () => {
    if (ctx.value) return <SparklineBody {...domProps(props)}>{_slots.default?.()}</SparklineBody>;
    return <ChartContainer config={cfg.value} class={cn("aspect-auto h-10 w-28", props.className)}>
      <SparklineBody {...domProps(props)}>{_slots.default?.()}</SparklineBody>
      {props.interactive && props.tooltip !== false ? <ChartTooltip /> : null}
    </ChartContainer>;
  };
});
type TallyChartProps = Standalone & {
  data: readonly Row[];
  nameKey?: string;
  valueKey?: string;
  unit?: number;
  valueFormatter?: (value: number) => string;
  label?: string;
  description?: string;
  loading?: boolean;
  emptyText?: string;
  animate?: boolean;
  seed?: string | number;
  onActiveChange?: (info: {
    index: number;
    series: number | null;
  } | null) => void;
};
const TallyChartBody = defineUi<TallyChartProps>("TallyChartBody", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const data = computed(() => props.data);
  const nameKey = computed(() => props.nameKey);
  const valueKey = computed(() => props.valueKey);
  const unit = computed(() => props.unit === undefined ? 0 : props.unit);
  const valueFormatter = computed(() => props.valueFormatter);
  const label = computed(() => props.label);
  const description = computed(() => props.description);
  const loading = computed(() => props.loading);
  const emptyText = computed(() => props.emptyText);
  const animate = computed(() => props.animate);
  const seed = computed(() => props.seed);
  const onActiveChange = computed(() => props.onActiveChange);
  const ctx = useChart();
  const nk = computed(() => nameKey.value ?? inferXKey(data.value));
  const vk = computed(() => valueKey.value ?? inferSeries(data.value, nk.value, undefined)[0] ?? "value");
  const vf = computed(() => valueFormatter.value ?? formatNumber);
  const all = computed(() => data.value.map((r, i) => {
    const key = String(r[nk.value] ?? i);
    const at = ctx.value.keys.indexOf(key);
    return {
      key,
      name: labelText(ctx.value.config, key),
      slot: at >= 0 ? at : i,
      count: Math.max(0, Math.round(toNum(r[vk.value]) ?? 0)),
      row: r
    };
  }));
  const spec = computed<TallySpec>(() => {
    const drawn = all.value.filter(a => !ctx.value.hidden.has(a.key));
    return {
      type: "tally" as const,
      rows: drawn.map(a => ({
        key: a.key,
        name: a.name,
        slot: a.slot,
        count: a.count
      })),
      unit: unit.value,
      totals: drawn.map(a => vf.value(a.count)),
      state: loading.value ? "loading" as const : drawn.length ? "ready" as const : "empty" as const,
      stateText: loading.value ? "Loading" as const : emptyText.value
    };
  });
  const name = computed(() => label.value ?? "Tally chart");
  const summary = computed(() => spec.value.state === "ready" ? `${label.value ? `${label.value}. ` : "" as const}Tally chart: ${spec.value.rows.map(r => `${r.name} ${vf.value(r.count)}`).join(", ")}.${description.value ? ` ${description.value}` : "" as const}` : `${name.value}. ${spec.value.state === "loading" ? "Loading." as const : "No data." as const}`);
  const table = computed<TableModel>(() => ({
    head: [nk.value, vk.value],
    rows: spec.value.rows.map(r => [r.name, vf.value(r.count)])
  }));
  useLegend(() => ctx.value.store, () => all.value.map(a => ({
    key: a.key,
    slot: a.slot,
    pattern: "solid" as Pattern,
    marker: "circle" as MarkerShape,
    dash: "solid" as Dash,
    kind: "bar" as XYKind
  })));
  const describe = (index: number): Described | null => {
    const r = spec.value.rows[index];
    if (!r) return null;
    return {
      label: r.name,
      payload: [{
        dataKey: r.key,
        name: r.name,
        value: r.count,
        color: `var(--color-${r.key})`,
        slot: r.slot,
        kind: "bar" as const
      }],
      announce: `${r.name}: ${vf.value(r.count)}`
    };
  };
  return () => {
    return <ChartCanvas slot={props["data-slot"] ?? "tally-chart"} recipe={tallyRecipe} spec={spec.value} kindLabel="Tally chart" label={name.value} summary={summary.value} table={table.value} describe={describe} animate={animate.value} seed={seed.value} onActiveChange={onActiveChange.value} onSelect={props.onSelect} interactive={spec.value.state === "ready"} />;
  };
});
const TallyChart = defineUi<TallyChartProps>("TallyChart", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const nk = computed(() => props.nameKey ?? inferXKey(props.data));
  const _nestedHook0 = useSelfContained(() => props, () => () => Object.fromEntries(props.data.map(r => [String(r[nk.value]), {
    label: String(r[nk.value])
  }])) as ChartConfig, () => false, () => () => <TallyChartBody {...domProps(props)} />, () => ({
    class: cn("aspect-[16/9]", props.className)
  }));
  return () => {
    return _nestedHook0.value;
  };
});
type HeatmapProps = Standalone & {
  data: readonly Row[];
  variant?: "calendar" | "grid";
  dateKey?: string;
  valueKey?: string;
  weeks?: number;
  end?: string | Date;
  weekStart?: 0 | 1;
  rowKey?: string;
  colKey?: string;
  rows?: readonly string[];
  cols?: readonly string[];
  levels?: number;
  thresholds?: readonly number[];
  slot?: number;
  series?: string;
  unit?: string;
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  label?: string;
  description?: string;
  loading?: boolean;
  emptyText?: string;
  animate?: boolean;
  seed?: string | number;
  onActiveChange?: (info: {
    index: number;
    series: number | null;
  } | null) => void;
};
const HeatmapBody = defineUi<HeatmapProps>("HeatmapBody", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const data = computed(() => props.data);
  const variant = computed(() => props.variant === undefined ? "calendar" as const : props.variant);
  const dateKey = computed(() => props.dateKey === undefined ? "date" as const : props.dateKey);
  const valueKey = computed(() => props.valueKey === undefined ? "value" as const : props.valueKey);
  const weeks = computed(() => props.weeks);
  const end = computed(() => props.end);
  const weekStart = computed(() => props.weekStart === undefined ? 0 : props.weekStart);
  const rowKey = computed(() => props.rowKey === undefined ? "row" as const : props.rowKey);
  const colKey = computed(() => props.colKey === undefined ? "col" as const : props.colKey);
  const rows = computed(() => props.rows);
  const cols = computed(() => props.cols);
  const levels = computed(() => props.levels === undefined ? 5 : props.levels);
  const thresholds = computed(() => props.thresholds);
  const slot = computed(() => props.slot);
  const series = computed(() => props.series);
  const unit = computed(() => props.unit);
  const valueFormatter = computed(() => props.valueFormatter);
  const showLegend = computed(() => props.showLegend === undefined ? true : props.showLegend);
  const label = computed(() => props.label);
  const description = computed(() => props.description);
  const loading = computed(() => props.loading);
  const emptyText = computed(() => props.emptyText);
  const animate = computed(() => props.animate);
  const seed = computed(() => props.seed);
  const onActiveChange = computed(() => props.onActiveChange);
  const ctx = useChart();
  const vf = computed(() => valueFormatter.value ?? formatNumber);
  const at = computed(() => series.value ? ctx.value.keys.indexOf(series.value) : -1);
  const sl = computed(() => slot.value ?? (at.value >= 0 ? at.value : 2));
  const cells = computed(() => variant.value === "grid" ? buildGrid(data.value.map(r => ({
    row: r[rowKey.value],
    col: r[colKey.value],
    value: r[valueKey.value]
  })), {
    rows: rows.value,
    cols: cols.value,
    levels: levels.value,
    thresholds: thresholds.value
  }) : buildCalendar(data.value.map(r => ({
    date: r[dateKey.value],
    value: r[valueKey.value]
  })), {
    weeks: weeks.value,
    end: end.value,
    weekStart: weekStart.value,
    levels: levels.value,
    thresholds: thresholds.value
  }));
  const spec = computed<HeatSpec>(() => ({
    type: "heat" as const,
    cols: cells.value.cols,
    rows: cells.value.rows,
    levels: cells.value.levels,
    levelCount: levels.value,
    colLabels: cells.value.colLabels,
    rowLabels: cells.value.rowLabels,
    slot: sl.value,
    variant: variant.value,
    legend: showLegend.value ? {
      less: "Less" as const,
      more: "More" as const
    } : null,
    patterns: ctx.value.patterns !== false,
    state: loading.value ? "loading" as const : cells.value.levels.some(l => l >= 0) ? "ready" as const : "empty" as const,
    stateText: loading.value ? "Loading" as const : emptyText.value
  }));
  const cellName = computed(() => (k: number): string => {
    if (variant.value === "grid") return `${cells.value.rowLabels[Math.floor(k / cells.value.cols)]?.text ?? ""}, ${cells.value.colLabels[k % cells.value.cols]?.text ?? ""}`;
    return formatDay(cells.value.days[k], true);
  });
  const total = computed(() => cells.value.values.reduce<number>((n, v) => n + (isNum(v) ? v : 0), 0));
  const name = computed(() => label.value ?? (variant.value === "grid" ? "Heat map" as const : "Calendar heat map" as const));
  const summary = computed(() => spec.value.state === "ready" ? `${label.value ? `${label.value}. ` : "" as const}${variant.value === "grid" ? "Heat map" as const : "Calendar heat map" as const} of ${cells.value.levels.filter(l => l >= 0).length} ${variant.value === "grid" ? "cells" as const : "days" as const}, total ${vf.value(total.value)}${unit.value ? ` ${unit.value}` : "" as const}, busiest ${vf.value(cells.value.max)}.${description.value ? ` ${description.value}` : "" as const}` : `${name.value}. ${spec.value.state === "loading" ? "Loading." as const : "No data." as const}`);
  const table = computed<TableModel>(() => {
    const rowsOut: string[][] = [];
    cells.value.levels.forEach((lv, k) => {
      if (lv >= 0 && isNum(cells.value.values[k]) && (variant.value === "grid" || cells.value.values[k] as number > 0)) rowsOut.push([cellName.value(k), vf.value(cells.value.values[k] as number)]);
    });
    return {
      head: [variant.value === "grid" ? "Cell" as const : "Day" as const, unit.value ?? "Value"],
      rows: rowsOut.slice(0, 240),
      clipped: rowsOut.length > 240 ? {
        shown: 240,
        total: rowsOut.length
      } : undefined
    };
  });
  const describe = (index: number): Described | null => {
    const v = cells.value.values[index];
    if (cells.value.levels[index] < 0 || !isNum(v)) return null;
    const cn = cellName.value(index);
    return {
      label: cn,
      payload: [{
        dataKey: valueKey.value,
        name: unit.value ?? "Value",
        value: v,
        color: `var(--ll-${SLOT_KEYS[sl.value % SLOT_KEYS.length]})`,
        slot: sl.value,
        kind: "bar" as const
      }],
      announce: `${cn}: ${vf.value(v)}${unit.value ? ` ${unit.value}` : "" as const}`
    };
  };
  return () => {
    return <ChartCanvas slot={props["data-slot"] ?? "heatmap"} recipe={heatRecipe} spec={spec.value} kindLabel="Heat map" label={name.value} summary={summary.value} table={table.value} describe={describe} animate={animate.value} seed={seed.value} onActiveChange={onActiveChange.value} onSelect={props.onSelect} interactive={spec.value.state === "ready"} />;
  };
});
const Heatmap = defineUi<HeatmapProps>("Heatmap", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const ratio = computed(() => props.variant === "grid" ? "aspect-[16/10]" as const : "aspect-[53/14]" as const);
  const _nestedHook0 = useSelfContained(() => props, () => () => ({}), () => false, () => () => <HeatmapBody {...domProps(props)} />, () => ({
    class: cn(ratio.value, props.className)
  }));
  return () => {
    return _nestedHook0.value;
  };
});
export { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartSwatch, ChartCenterLabel, useChart, BarChart, LineChart, AreaChart, ScatterChart, PieChart, DonutChart, RadarChart, RadialChart, Gauge, Sparkline, TallyChart, Heatmap };
export type { ChartContainerProps, ChartTooltipProps, ChartTooltipContentProps, ChartLegendProps, ChartLegendContentProps, XYChartProps, BarChartProps, PieChartProps, RadarChartProps, RadialChartProps, GaugeProps, SparklineProps, TallyChartProps, HeatmapProps };
