// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef, useId } from "vue";
import { RadioGroup as RadioGroupPrimitive } from "@/lib/primitives";
import { Button } from "@/components/ui/button";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useInk, useInkTier, useMergedRef } from "@/lib/ink/vue";
import { DARK_INKS, DRAW_TOOLS, SKETCH_COLORS, SKETCH_SIZES, canvasFrameRecipe, cursorMarkup, sketchSizeRecipe, sketchSwatchRecipe, sketchToolRecipe, strokeHit, strokeMarkup, strokesToSvg, svgDataUrl, type DrawTool, type SketchColor, type SketchPoint, type SketchSizeName, type SketchStroke, type SketchTool } from "@/lib/ink/recipes/sketchpad-ink";
import { svgToPngDataUrl } from "@/lib/sketch-export";
import { cn } from "@/lib/utils";
type StrokeInput = Omit<SketchStroke, "id"> & {
  id?: string;
};
interface SketchpadHandle {
  undo(): void;
  redo(): void;
  clear(): void;
  replay(): void;
  strokes(): SketchStroke[];
  toSVG(options?: ExportOptions): string;
  toDataURL(options?: ExportOptions): string;
  toPNG(options?: ExportOptions & {
    scale?: number;
  }): Promise<string | null>;
}
interface ExportOptions {
  background?: boolean;
  margin?: number;
  title?: string;
}
const TOOL_LABEL: Record<SketchTool, string> = {
  felt: "Felt" as const,
  brush: "Brush" as const,
  pencil: "Pencil" as const,
  marker: "Marker" as const,
  highlighter: "Highlighter" as const,
  eraser: "Eraser" as const
};
const COLOR_LABEL: Record<SketchColor, string> = {
  ink: "Ink" as const,
  "ink-you": "Blue" as const,
  red: "Red" as const,
  green: "Green" as const,
  marker: "Terracotta" as const,
  tangerine: "Orange" as const,
  hi: "Yellow" as const,
  teal: "Teal" as const,
  grape: "Purple" as const,
  bubblegum: "Pink" as const
};
const SIZE_LABEL: Record<SketchSizeName, string> = {
  fine: "Fine" as const,
  medium: "Medium" as const,
  bold: "Bold" as const
};
const KEY_TOOL: Record<string, SketchTool> = {
  f: "felt" as const,
  b: "brush" as const,
  p: "pencil" as const,
  m: "marker" as const,
  h: "highlighter" as const,
  e: "eraser" as const
};
const SIZE_STEPS = [SKETCH_SIZES.fine, SKETCH_SIZES.medium, SKETCH_SIZES.bold];
const DEFAULT_TOOLS: readonly SketchTool[] = ["felt", "pencil", "marker", "highlighter", "eraser"];
const HISTORY = 100;
const NO_IDS: ReadonlySet<string> = new Set();
const round1 = (v: number) => Math.round(v * 10) / 10;
const isDrawTool = (t: SketchTool): t is DrawTool => (DRAW_TOOLS as readonly string[]).includes(t);
const sizeName = (size: number): SketchSizeName | undefined => (Object.keys(SKETCH_SIZES) as SketchSizeName[]).find(k => Math.abs(SKETCH_SIZES[k] - size) < 0.05);
function useControllable<T>(_source0: MaybeRefOrGetter<T | undefined>, _source1: MaybeRefOrGetter<T>, _source2?: MaybeRefOrGetter<(v: T) => void>): ComputedRef<[T, (v: T) => void, boolean]> {
  const value = computed(() => toValue(_source0));
  const defaultValue = computed(() => toValue(_source1));
  const onChange = computed(() => toValue(_source2));
  const inner = shallowRef(initialState(defaultValue.value));
  const setInner = stateSetter(inner);
  const controlled = computed(() => value.value !== undefined);
  const set = (v: T) => {
    if (!controlled.value) setInner(v);
    onChange.value?.(v);
  };
  return computed(() => {
    return [value.value !== undefined ? value.value : inner.value, set, controlled.value];
  });
}
function withIds(strokes: readonly StrokeInput[]): SketchStroke[] {
  return strokes.every(s => s.id) ? strokes as SketchStroke[] : strokes.map((s, i) => s.id ? s as SketchStroke : {
    ...s,
    id: `i${i}`
  });
}
interface SketchpadContextValue {
  strokes: SketchStroke[];
  width: number;
  height: number;
  tool: SketchTool;
  tools: readonly SketchTool[];
  color: SketchColor;
  size: number;
  readOnly: boolean;
  disabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  replaying: boolean;
  replayKey: number;
  replaySpeed: number;
  seed: string;
  announce: string;
  rootRef: UI.RefObject<HTMLDivElement | null>;
  canvasRef: UI.RefObject<HTMLDivElement | null>;
  selectTool(t: SketchTool): void;
  setColor(c: SketchColor): void;
  setSize(s: number): void;
  commit(next: SketchStroke[], message: string): void;
  nextId(): string;
  say(message: string): void;
  undo(): void;
  redo(): void;
  clear(): void;
}
const SketchpadContext = createContext<SketchpadContextValue | null>(null);
function useSketchpad(): ComputedRef<SketchpadContextValue> {
  const ctx = useContext(SketchpadContext);
  return computed(() => {
    if (!ctx.value) console.error("Sketchpad parts must be used inside <Sketchpad>");
    return ctx.value;
  });
}
const count = (n: number) => `${n} ${n === 1 ? "stroke" as const : "strokes" as const}`;
type SketchpadProps = Omit<UI.ComponentProps<"div">, "onChange" | "defaultValue" | "color"> & {
  value?: readonly StrokeInput[];
  defaultValue?: readonly StrokeInput[];
  onValueChange?: (strokes: SketchStroke[]) => void;
  tool?: SketchTool;
  defaultTool?: SketchTool;
  onToolChange?: (tool: SketchTool) => void;
  tools?: readonly SketchTool[];
  color?: SketchColor;
  defaultColor?: SketchColor;
  onColorChange?: (color: SketchColor) => void;
  size?: number;
  defaultSize?: number;
  onSizeChange?: (size: number) => void;
  width?: number;
  height?: number;
  readOnly?: boolean;
  disabled?: boolean;
  replay?: boolean;
  replaySpeed?: number;
  apiRef?: UI.Ref<SketchpadHandle>;
  seed?: string | number;
};
const Sketchpad = defineUi<SketchpadProps>("Sketchpad", ["class", "value", "defaultValue", "onValueChange", "tool", "defaultTool", "onToolChange", "tools", "color", "defaultColor", "onColorChange", "size", "defaultSize", "onSizeChange", "width", "height", "readOnly", "disabled", "replay", "replaySpeed", "apiRef", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => {
    void _state49.value;
    return _props["class"];
  });
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => {
    void _state49.value;
    return _props["ref"];
  });
  const value = computed(() => {
    void _state49.value;
    return _props["value"];
  });
  const defaultValue = computed(() => {
    void _state49.value;
    return _props["defaultValue"];
  });
  const onValueChange = computed(() => {
    void _state49.value;
    return _props["onValueChange"];
  });
  const toolProp = computed(() => {
    void _state49.value;
    return _props["tool"];
  });
  const defaultTool = computed(() => {
    void _state49.value;
    return _props["defaultTool"] === undefined ? "felt" as const : _props["defaultTool"];
  });
  const onToolChange = computed(() => {
    void _state49.value;
    return _props["onToolChange"];
  });
  const tools = computed(() => {
    void _state49.value;
    return _props["tools"] === undefined ? DEFAULT_TOOLS : _props["tools"];
  });
  const colorProp = computed(() => {
    void _state49.value;
    return _props["color"];
  });
  const defaultColor = computed(() => {
    void _state49.value;
    return _props["defaultColor"] === undefined ? "ink" as const : _props["defaultColor"];
  });
  const onColorChange = computed(() => {
    void _state49.value;
    return _props["onColorChange"];
  });
  const sizeProp = computed(() => {
    void _state49.value;
    return _props["size"];
  });
  const defaultSize = computed(() => {
    void _state49.value;
    return _props["defaultSize"] === undefined ? SKETCH_SIZES.medium : _props["defaultSize"];
  });
  const onSizeChange = computed(() => {
    void _state49.value;
    return _props["onSizeChange"];
  });
  const width = computed(() => {
    void _state49.value;
    return _props["width"] === undefined ? 640 : _props["width"];
  });
  const height = computed(() => {
    void _state49.value;
    return _props["height"] === undefined ? 400 : _props["height"];
  });
  const readOnly = computed(() => {
    void _state49.value;
    return _props["readOnly"] === undefined ? false : _props["readOnly"];
  });
  const disabled = computed(() => {
    void _state49.value;
    return _props["disabled"] === undefined ? false : _props["disabled"];
  });
  const replay = computed(() => {
    void _state49.value;
    return _props["replay"] === undefined ? false : _props["replay"];
  });
  const replaySpeed = computed(() => {
    void _state49.value;
    return _props["replaySpeed"] === undefined ? 1 : _props["replaySpeed"];
  });
  const apiRef = computed(() => {
    void _state49.value;
    return _props["apiRef"];
  });
  const seed = computed(() => {
    void _state49.value;
    return _props["seed"];
  });
  const props = computed(() => {
    void _state49.value;
    return omitProps(_props, ["class", "children", "ref", "value", "defaultValue", "onValueChange", "tool", "defaultTool", "onToolChange", "tools", "color", "defaultColor", "onColorChange", "size", "defaultSize", "onSizeChange", "width", "height", "readOnly", "disabled", "replay", "replaySpeed", "apiRef", "seed"]);
  });
  const rootRef = shallowRef<HTMLDivElement | null | null>(null);
  const canvasRef = shallowRef<HTMLDivElement | null | null>(null);
  const lastButton = shallowRef<HTMLButtonElement | null | null>(null);
  const idBase = useId();
  const _hook29 = useControllable<readonly StrokeInput[]>(() => value.value, () => defaultValue.value ?? [], () => onValueChange.value as ((v: readonly StrokeInput[]) => void) | undefined);
  const strokesRaw = computed(() => {
    void _state49.value;
    return _hook29.value[0];
  });
  const setStrokes = computed(() => {
    void _state49.value;
    return _hook29.value[1];
  });
  const strokesControlled = computed(() => {
    void _state49.value;
    return _hook29.value[2];
  });
  const strokes = computed(() => {
    void _state49.value;
    return withIds(strokesRaw.value);
  });
  const _hook34 = useControllable<SketchTool>(() => toolProp.value, () => defaultTool.value, () => onToolChange.value);
  const tool = computed(() => {
    void _state49.value;
    return _hook34.value[0];
  });
  const setToolRaw = computed(() => {
    void _state49.value;
    return _hook34.value[1];
  });
  const _hook37 = useControllable<SketchColor>(() => colorProp.value, () => defaultColor.value, () => onColorChange.value);
  const color = computed(() => {
    void _state49.value;
    return _hook37.value[0];
  });
  const setColor = computed(() => {
    void _state49.value;
    return _hook37.value[1];
  });
  const _hook40 = useControllable<number>(() => sizeProp.value, () => defaultSize.value, () => onSizeChange.value);
  const size = computed(() => {
    void _state49.value;
    return _hook40.value[0];
  });
  const setSize = computed(() => {
    void _state49.value;
    return _hook40.value[1];
  });
  const announce = shallowRef(initialState(""));
  const setAnnounce = stateSetter(announce);
  const replayN = shallowRef(initialState(0));
  const setReplayN = stateSetter(replayN);
  const latest = shallowRef({
    strokes: strokes.value,
    color: color.value,
    tool: tool.value
  });
  const hist = shallowRef<{
    past: SketchStroke[][];
    future: SketchStroke[][];
    last: readonly StrokeInput[] | null;
  }>({
    past: [],
    future: [],
    last: null
  });
  const _state49 = shallowRef(0);
  const force = (...args) => {
    _state49.value = ((x: number) => x + 1)(_state49.value, ...args);
  };
  const counter = shallowRef(0);
  watchDependencies(() => {
    if (strokesControlled.value && value.value !== hist.value.last && (hist.value.past.length || hist.value.future.length)) {
      hist.value.past = [];
      hist.value.future = [];
      force();
    }
  }, () => [value.value, strokesControlled.value], false);
  const emit = (next: SketchStroke[]) => {
    hist.value.last = next;
    setStrokes.value(next);
  };
  const commit = (next: SketchStroke[], message: string) => {
    const h = hist.value;
    h.past.push(latest.value.strokes);
    if (h.past.length > HISTORY) h.past.shift();
    h.future = [];
    emit(next);
    setAnnounce(`${message} ${count(next.length)}.`);
  };
  const undo = () => {
    const h = hist.value;
    const prev = h.past.pop();
    if (!prev) return;
    h.future.push(latest.value.strokes);
    emit(prev);
    setAnnounce(`Undone. ${count(prev.length)}.`);
    force();
  };
  const redo = () => {
    const h = hist.value;
    const next = h.future.pop();
    if (!next) return;
    h.past.push(latest.value.strokes);
    emit(next);
    setAnnounce(`Redone. ${count(next.length)}.`);
    force();
  };
  const clear = () => {
    if (!latest.value.strokes.length) return;
    commit([], "Cleared.");
  };
  const selectTool = (t: SketchTool) => {
    const prev = latest.value.tool;
    setToolRaw.value(t);
    const c = latest.value.color;
    if (t === "highlighter" && DARK_INKS.has(c)) setColor.value("hi");else if (prev === "highlighter" && t !== "highlighter" && c === "hi") setColor.value("ink");
  };
  const nextId = () => {
    const used = new Set(latest.value.strokes.map(s => s.id));
    let id: string;
    do id = `s${(counter.value++).toString(36)}`; while (used.has(id));
    return id;
  };
  const resolve = (name: string) => {
    const el = rootRef.value;
    if (!el || typeof getComputedStyle === "undefined") return undefined;
    return getComputedStyle(el).getPropertyValue(name).trim() || undefined;
  };
  const toSVG = (o: ExportOptions = {}) => strokesToSvg(latest.value.strokes, {
    width: width.value,
    height: height.value,
    resolve,
    margin: o.margin,
    title: o.title,
    background: o.background === false ? undefined : resolve("--ll-paper") ?? "var(--ll-paper)"
  });
  useImperativeHandle(apiRef.value, (): SketchpadHandle => ({
    undo,
    redo,
    clear,
    replay: () => setReplayN(n => n + 1),
    strokes: () => latest.value.strokes,
    toSVG,
    toDataURL: o => svgDataUrl(toSVG(o)),
    toPNG: (o = {}) => {
      const m = o.margin ?? 0;
      return svgToPngDataUrl(svgDataUrl(toSVG(o)), width.value + 2 * m, height.value + 2 * m, o.scale);
    }
  }));
  watchDependencies(() => {
    const root = rootRef.value;
    if (!root) return;
    const onIn = (e: FocusEvent) => {
      lastButton.value = e.target instanceof HTMLButtonElement ? e.target : null;
    };
    const onOut = (e: FocusEvent) => {
      if (e.target instanceof HTMLButtonElement && !e.target.disabled) lastButton.value = null;
    };
    root.addEventListener("focusin", onIn);
    root.addEventListener("focusout", onOut);
    return () => {
      root.removeEventListener("focusin", onIn);
      root.removeEventListener("focusout", onOut);
    };
  }, () => [], false);
  watchDependencies(() => {
    const root = rootRef.value;
    const now = document.activeElement;
    const was = lastButton.value;
    const stranded = now instanceof HTMLButtonElement ? now : now === document.body || !now ? was : null;
    if (stranded?.disabled && root?.contains(stranded)) {
      lastButton.value = null;
      canvasRef.value?.focus({
        preventScroll: true
      });
    }
  }, undefined, false);
  const interactive = computed(() => {
    void _state49.value;
    return !readOnly.value && !disabled.value;
  });
  const replaying = computed(() => {
    void _state49.value;
    return replay.value || replayN.value > 0;
  });
  const ctx = computed<SketchpadContextValue>(() => {
    void _state49.value;
    return {
      strokes: strokes.value,
      width: width.value,
      height: height.value,
      tool: tool.value,
      tools: tools.value,
      color: color.value,
      size: size.value,
      readOnly: readOnly.value,
      disabled: disabled.value,
      canUndo: interactive.value && hist.value.past.length > 0,
      canRedo: interactive.value && hist.value.future.length > 0,
      replaying: replaying.value,
      replayKey: replayN.value,
      replaySpeed: replaySpeed.value,
      seed: `${idBase}${seed.value ?? ""}`,
      announce: announce.value,
      rootRef,
      canvasRef,
      selectTool,
      setColor: setColor.value,
      setSize: setSize.value,
      commit,
      nextId,
      say: setAnnounce,
      undo,
      redo,
      clear
    };
  });
  return () => {
    latest.value = {
      strokes: strokes.value,
      color: color.value,
      tool: tool.value
    };
    return <SketchpadContext.Provider value={ctx.value}>
      <div data-slot="sketchpad" data-disabled={disabled.value ? "" as const : undefined} data-readonly={readOnly.value ? "" as const : undefined} ref={useMergedRef(rootRef, ref.value)} class={cn("flex w-full flex-col gap-3", className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default) ?? <>
            {readOnly.value ? null : <SketchpadToolbar>
                <SketchpadTools />
                <span class="ms-auto flex items-center gap-2">
                  <SketchpadUndo />
                  <SketchpadRedo />
                  <SketchpadClear />
                </span>
                <div class="flex w-full flex-wrap items-center gap-x-4">
                  <SketchpadColors />
                  <SketchpadSizes />
                </div>
              </SketchpadToolbar>}
            <SketchpadCanvas />
          </>}
      </div>
    </SketchpadContext.Provider>;
  };
});
const SketchpadToolbar = defineUi<Omit<PaperProps, "stock" | "edge" | "tilt">>("SketchpadToolbar", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <Paper data-slot="sketchpad-toolbar" role="group" aria-label="Drawing tools" stock="slip" edge="cut" tilt={false} shadow="hair" class={cn("flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-1.5", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
    </Paper>;
  };
});
type GroupProps = Omit<UI.ComponentProps<typeof RadioGroupPrimitive.Root>, "value" | "defaultValue" | "onValueChange" | "orientation">;
const SketchpadTools = defineUi<GroupProps & {
  tools?: readonly SketchTool[];
}>("SketchpadTools", ["class", "tools"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const toolsProp = computed(() => _props["tools"]);
  const props = computed(() => omitProps(_props, ["class", "children", "tools"]));
  const ctx = useSketchpad();
  const tools = computed(() => toolsProp.value ?? ctx.value.tools);
  return () => {
    return <RadioGroupPrimitive.Root data-slot="sketchpad-tools" aria-label="Tool" orientation="horizontal" value={ctx.value.tool} onValueChange={v => ctx.value.selectTool(v as SketchTool)} disabled={ctx.value.disabled || ctx.value.readOnly} class={cn("flex flex-wrap items-center gap-0.5", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? tools.value.map(t => <SketchpadTool key={t} value={t} />)}
    </RadioGroupPrimitive.Root>;
  };
});
type ItemProps = Omit<UI.ComponentProps<typeof RadioGroupPrimitive.Item>, "value"> & {
  seed?: string | number;
};
const SketchpadTool = defineUi<ItemProps & {
  value: SketchTool;
}>("SketchpadTool", ["value", "class", "seed"], (_props, {
  slots: _slots
}) => {
  const value = computed(() => _props["value"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["value", "class", "children", "seed", "ref"]));
  const ctx = useSketchpad();
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: sketchToolRecipe,
    params: {
      tool: value.value,
      color: ctx.value.color
    },
    kind: "sketchpad-tool" as const,
    seed: seed.value
  }));
  return () => {
    return <RadioGroupPrimitive.Item data-slot="sketchpad-tool" data-tool={value.value} value={value.value} ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate inline-flex h-[52px] min-w-16 cursor-pointer flex-col items-center justify-end px-2 pb-[5px] font-hand text-[14px] leading-none font-bold whitespace-nowrap text-ink transition-[translate] duration-(--ll-dur-press) ease-out active:translate-y-(--ll-press-sink) disabled:pointer-events-none disabled:text-pencil-text", "forced-colors:data-[state=checked]:[outline:3px_solid_Highlight]!", className.value)} {...domProps(props.value)}>
      {node.value}
      <span class="ll-ink-room">{readSlot(_slots.default) ?? TOOL_LABEL[value.value]}</span>
    </RadioGroupPrimitive.Item>;
  };
});
const SketchpadColors = defineUi<GroupProps & {
  colors?: readonly SketchColor[];
}>("SketchpadColors", ["class", "colors"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const colors = computed(() => _props["colors"] === undefined ? SKETCH_COLORS : _props["colors"]);
  const props = computed(() => omitProps(_props, ["class", "children", "colors"]));
  const ctx = useSketchpad();
  return () => {
    return <RadioGroupPrimitive.Root data-slot="sketchpad-colors" aria-label="Color" orientation="horizontal" value={ctx.value.color} onValueChange={v => ctx.value.setColor(v as SketchColor)} disabled={ctx.value.disabled || ctx.value.readOnly} class={cn("flex flex-wrap items-center", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? colors.value.map(c => <SketchpadColor key={c} value={c} />)}
    </RadioGroupPrimitive.Root>;
  };
});
const SketchpadColor = defineUi<ItemProps & {
  value: SketchColor;
}>("SketchpadColor", ["value", "class", "seed", "style", "aria-label"], (_props, {
  slots: _slots
}) => {
  const value = computed(() => _props["value"]);
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const style = computed(() => _props["style"]);
  const label = computed(() => _props["aria-label"]);
  const props = computed(() => omitProps(_props, ["value", "class", "seed", "ref", "style", "aria-label"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: sketchSwatchRecipe,
    params: {
      color: value.value
    },
    kind: "sketchpad-swatch" as const,
    seed: seed.value
  }));
  return () => {
    return <RadioGroupPrimitive.Item data-slot="sketchpad-color" data-color={value.value} value={value.value} aria-label={label.value ?? COLOR_LABEL[value.value]} ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} style={cssStyle({
      "--sw": `var(--ll-${value.value})`,
      ...style.value
    } as UI.CSSProperties)} class={cn("relative isolate inline-flex size-7 cursor-pointer items-center justify-center after:absolute after:-inset-px disabled:pointer-events-none disabled:opacity-60 forced-colors:[forced-color-adjust:none] forced-colors:bg-(--sw) forced-colors:data-[state=checked]:[outline:3px_solid_Highlight]!", className.value)} {...domProps(props.value)}>
      {node.value}
    </RadioGroupPrimitive.Item>;
  };
});
const SketchpadSizes = defineUi<GroupProps>("SketchpadSizes", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const ctx = useSketchpad();
  return () => {
    return <RadioGroupPrimitive.Root data-slot="sketchpad-sizes" aria-label="Width" orientation="horizontal" value={sizeName(ctx.value.size) ?? ""} onValueChange={v => ctx.value.setSize(SKETCH_SIZES[v as SketchSizeName])} disabled={ctx.value.disabled || ctx.value.readOnly} class={cn("flex items-center", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? (Object.keys(SKETCH_SIZES) as SketchSizeName[]).map(s => <SketchpadSize key={s} value={s} />)}
    </RadioGroupPrimitive.Root>;
  };
});
const SketchpadSize = defineUi<ItemProps & {
  value: SketchSizeName;
}>("SketchpadSize", ["value", "class", "seed", "aria-label"], (_props, {
  slots: _slots
}) => {
  const value = computed(() => _props["value"]);
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const label = computed(() => _props["aria-label"]);
  const props = computed(() => omitProps(_props, ["value", "class", "seed", "ref", "aria-label"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: sketchSizeRecipe,
    params: {
      size: value.value
    },
    kind: "sketchpad-size" as const,
    seed: seed.value
  }));
  return () => {
    return <RadioGroupPrimitive.Item data-slot="sketchpad-size" data-size={value.value} value={value.value} aria-label={label.value ?? `${SIZE_LABEL[value.value]} line`} ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate inline-flex size-7 cursor-pointer items-center justify-center disabled:pointer-events-none disabled:opacity-60 forced-colors:after:absolute forced-colors:after:top-1/2 forced-colors:after:left-1/2 forced-colors:after:size-2 forced-colors:after:-translate-1/2 forced-colors:after:rounded-full forced-colors:after:bg-[CanvasText] forced-colors:data-[state=checked]:[outline:3px_solid_Highlight]!", className.value)} {...domProps(props.value)}>
      {node.value}
    </RadioGroupPrimitive.Item>;
  };
});
type ButtonProps = UI.ComponentProps<typeof Button>;
const SketchpadUndo = defineUi<ButtonProps>("SketchpadUndo", ["onClick"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["children", "onClick"]));
  const ctx = useSketchpad();
  return () => {
    return <Button data-slot="sketchpad-undo" variant="ghost" size="sm" type="button" disabled={!ctx.value.canUndo} onClick={e => {
      onClick.value?.(e);
      if (!e.defaultPrevented) ctx.value.undo();
    }} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? "Undo"}
    </Button>;
  };
});
const SketchpadRedo = defineUi<ButtonProps>("SketchpadRedo", ["onClick"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["children", "onClick"]));
  const ctx = useSketchpad();
  return () => {
    return <Button data-slot="sketchpad-redo" variant="ghost" size="sm" type="button" disabled={!ctx.value.canRedo} onClick={e => {
      onClick.value?.(e);
      if (!e.defaultPrevented) ctx.value.redo();
    }} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? "Redo"}
    </Button>;
  };
});
const SketchpadClear = defineUi<ButtonProps>("SketchpadClear", ["onClick"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["children", "onClick"]));
  const ctx = useSketchpad();
  return () => {
    return <Button data-slot="sketchpad-clear" variant="ghost" size="sm" type="button" disabled={ctx.value.disabled || ctx.value.readOnly || !ctx.value.strokes.length} onClick={e => {
      onClick.value?.(e);
      if (!e.defaultPrevented) ctx.value.clear();
    }} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? "Clear"}
    </Button>;
  };
});
interface ReplayTiming {
  delay: number;
  dur: number;
}
const StrokeShape = defineUi<{
  stroke: SketchStroke;
  dim: boolean;
  replay: ReplayTiming | null;
  maskId: string;
  width: number;
  height: number;
}>("StrokeShape", ["stroke", "dim", "replay", "maskId", "width", "height"], (_props, {
  slots: _slots
}) => {
  const stroke = computed(() => _props["stroke"]);
  const dim = computed(() => _props["dim"]);
  const replay = computed(() => _props["replay"]);
  const maskId = computed(() => _props["maskId"]);
  const width = computed(() => _props["width"]);
  const height = computed(() => _props["height"]);
  const tier = useInkTier();
  const m = computed(() => strokeMarkup(stroke.value, {
    tier: tier.value
  }));
  const style = computed(() => dim.value ? {
    opacity: 0.22
  } : undefined);
  return () => {
    if (!replay.value) return <g data-stroke={stroke.value.id} style={cssStyle(style.value)} innerHTML={m.value.svg} />;
    const w = Math.max(8, strokeWidthOf(stroke.value) * 1.6 + 6);
    return <g data-stroke={stroke.value.id} mask={`url(#${maskId.value})`} style={cssStyle(style.value)}>
      <mask id={maskId.value} maskUnits="userSpaceOnUse" x={-20} y={-20} width={width.value + 40} height={height.value + 40}>
        <path d={m.value.centre} pathLength={1} fill="none" stroke="var(--ll-photo)" stroke-width={w} stroke-linecap="round" stroke-linejoin="round" class="ll-draw" style={cssStyle({
          "--ll-draw-delay": `${replay.value.delay.toFixed(2)}s`,
          animationDuration: `${replay.value.dur.toFixed(2)}s`,
          animationTimingFunction: "linear" as const
        } as UI.CSSProperties)} />
      </mask>
      <g innerHTML={m.value.svg} />
    </g>;
  };
});
const strokeWidthOf = (s: SketchStroke): number => (s.tool === "highlighter" ? 14 : s.tool === "marker" ? 8 : 3.4) * s.size;
interface Gesture {
  pointer: number | "key";
  kind: string;
  tool: SketchTool;
  color: SketchColor;
  size: number;
  pts: SketchPoint[];
  tail: SketchPoint | null;
  erase: Set<string> | null;
}
const SAMPLE_GAP = 0.8;
const LIVE_POINTS = 480;
const PALM_MS = 1500;
function preview(pts: SketchPoint[]): SketchPoint[] {
  if (pts.length <= LIVE_POINTS) return pts.slice();
  let k = 2;
  while (pts.length / k > LIVE_POINTS) k *= 2;
  const out: SketchPoint[] = [];
  for (let i = 0; i < pts.length; i += k) out.push(pts[i]);
  const tail = pts[pts.length - 1];
  if (out[out.length - 1] !== tail) out.push(tail);
  return out;
}
function thin(pts: SketchPoint[]): SketchPoint[] {
  const out: SketchPoint[] = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) >= 1.5) out.push(p);
  }
  const tail = pts[pts.length - 1];
  if (out.length > 1 && out[out.length - 1] !== tail) out.push(tail);
  return out;
}
const PAPERS: Record<NonNullable<SketchpadCanvasProps["paper"]>, Pick<PaperProps, "stock" | "rules">> = {
  plain: {
    stock: "paper" as const,
    rules: "none" as const
  },
  ruled: {
    stock: "paper" as const,
    rules: "ruled" as const
  },
  graph: {
    stock: "graph" as const
  },
  dots: {
    stock: "dot-grid" as const
  },
  kraft: {
    stock: "kraft" as const,
    rules: "none" as const
  }
};
type SketchpadCanvasProps = Omit<UI.ComponentProps<"div">, "children"> & {
  paper?: "plain" | "ruled" | "graph" | "dots" | "kraft";
  paperProps?: Omit<PaperProps, "children" | "ref">;
  label?: string;
  children?: UI.ReactNode;
  seed?: string | number;
};
const SketchpadCanvas = defineUi<SketchpadCanvasProps>("SketchpadCanvas", ["class", "paper", "paperProps", "label", "seed", "onKeydown", "onPointerdown", "onPointermove", "onPointerup", "onPointercancel", "onLostpointercapture", "onBlur"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const paper = computed(() => _props["paper"] === undefined ? "plain" as const : _props["paper"]);
  const paperProps = computed(() => _props["paperProps"]);
  const label = computed(() => _props["label"] === undefined ? "Drawing" as const : _props["label"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const onPointerdown = computed(() => _props["onPointerdown"]);
  const onPointermove = computed(() => _props["onPointermove"]);
  const onPointerup = computed(() => _props["onPointerup"]);
  const onPointercancel = computed(() => _props["onPointercancel"]);
  const onLostpointercapture = computed(() => _props["onLostpointercapture"]);
  const onBlur = computed(() => _props["onBlur"]);
  const props = computed(() => omitProps(_props, ["class", "children", "paper", "paperProps", "label", "seed", "ref", "onKeydown", "onPointerdown", "onPointermove", "onPointerup", "onPointercancel", "onLostpointercapture", "onBlur"]));
  const ctx = useSketchpad();
  const tier = useInkTier();
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: canvasFrameRecipe,
    params: {},
    kind: "sketchpad-canvas" as const,
    size: [ctx.value.width, ctx.value.height],
    seed: seed.value
  }));
  const help = useId();
  const uid = computed(() => ctx.value.seed.replace(/[^a-zA-Z0-9]/g, ""));
  const surface = shallowRef<SVGSVGElement | null | null>(null);
  const gesture = shallowRef<Gesture | null | null>(null);
  const penSeen = shallowRef(Number.NEGATIVE_INFINITY);
  const frame = shallowRef(0);
  const live = shallowRef<SketchStroke | null>(initialState(null));
  const setLive = stateSetter(live);
  const erasing = shallowRef<ReadonlySet<string>>(initialState(NO_IDS));
  const setErasing = stateSetter(erasing);
  const cursor = shallowRef<[number, number] | null>(initialState(null));
  const setCursor = stateSetter(cursor);
  const interactive = computed(() => !ctx.value.readOnly && !ctx.value.disabled);
  const W = computed(() => ctx.value.width);
  const H = computed(() => ctx.value.height);
  watchDependencies(() => () => {
    if (frame.value && typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(frame.value);
  }, () => [], false);
  const project = computed(() => (clientX: number, clientY: number): SketchPoint => {
    const r = surface.value?.getBoundingClientRect();
    const sx = r && r.width ? W.value / r.width : 1;
    const sy = r && r.height ? H.value / r.height : 1;
    return [round1(Math.min(W.value, Math.max(0, ((clientX ?? 0) - (r?.left ?? 0)) * sx))), round1(Math.min(H.value, Math.max(0, ((clientY ?? 0) - (r?.top ?? 0)) * sy)))];
  });
  const liveOf = computed(() => (g: Gesture): SketchStroke => ({
    id: "live" as const,
    tool: g.tool as DrawTool,
    color: g.color,
    size: g.size,
    pts: preview(g.pts)
  }));
  const flush = computed(() => () => {
    const g = gesture.value;
    if (g && g.tool !== "eraser") setLive(liveOf.value(g));
  });
  const schedule = computed(() => () => {
    if (frame.value) return;
    if (typeof requestAnimationFrame === "undefined") return flush.value();
    frame.value = requestAnimationFrame(() => {
      frame.value = 0;
      flush.value();
    });
  });
  const eraseAt = computed(() => (g: Gesture, x: number, y: number) => {
    const set = g.erase as Set<string>;
    let changed = false;
    for (const s of ctx.value.strokes) {
      if (!set.has(s.id) && strokeHit(s, x, y, 9)) {
        set.add(s.id);
        changed = true;
      }
    }
    if (changed) setErasing(new Set(set));
  });
  const begin = computed(() => (pointer: Gesture["pointer"], kind: string, pt: SketchPoint, eraser: boolean) => {
    const tool: SketchTool = eraser ? "eraser" as const : ctx.value.tool;
    const g: Gesture = {
      pointer,
      kind,
      tool,
      color: ctx.value.color,
      size: ctx.value.size,
      pts: [pt],
      tail: null,
      erase: tool === "eraser" ? new Set() : null
    };
    gesture.value = g;
    if (g.erase) eraseAt.value(g, pt[0], pt[1]);else setLive(liveOf.value(g));
  });
  const extend = computed(() => (pt: SketchPoint) => {
    const g = gesture.value;
    if (!g) return;
    const last = g.pts[g.pts.length - 1];
    if (last && Math.hypot(pt[0] - last[0], pt[1] - last[1]) < SAMPLE_GAP) {
      g.tail = pt;
      return;
    }
    g.tail = null;
    g.pts.push(pt);
    if (g.erase) eraseAt.value(g, pt[0], pt[1]);else schedule.value();
  });
  const end = computed(() => (cancel: boolean) => {
    const g = gesture.value;
    if (!g) return;
    gesture.value = null;
    if (frame.value && typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(frame.value);
    frame.value = 0;
    setLive(null);
    if (g.erase) {
      setErasing(NO_IDS);
      if (!cancel && g.erase.size) {
        const gone = g.erase;
        ctx.value.commit(ctx.value.strokes.filter(s => !gone.has(s.id)), `Erased ${count(gone.size)}.`);
      }
      return;
    }
    if (cancel || !isDrawTool(g.tool)) return;
    if (g.tail) {
      const held = g.pts[g.pts.length - 1][2];
      g.pts.push(held !== undefined && g.tail[2] === undefined ? [g.tail[0], g.tail[1], held] : g.tail);
    }
    ctx.value.commit([...ctx.value.strokes, {
      id: ctx.value.nextId(),
      tool: g.tool,
      color: g.color,
      size: g.size,
      pts: thin(g.pts)
    }], "Stroke added.");
  });
  watchDependencies(() => {
    if (!interactive.value && gesture.value) end.value(true);
  }, undefined, false);
  const onDown = computed(() => (e: PointerEvent) => {
    onPointerdown.value?.(e);
    if (!interactive.value || e.defaultPrevented) return;
    const type = e.pointerType || "mouse";
    if (type === "mouse" && (e.button ?? 0) !== 0) return;
    if (type === "pen") {
      penSeen.value = e.timeStamp;
      if (gesture.value?.kind === "touch") end.value(true);
    } else if (type === "touch" && e.timeStamp - penSeen.value < PALM_MS) return;
    if (gesture.value) return;
    (e.currentTarget as HTMLDivElement).focus({
      preventScroll: true
    });
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}
    setCursor(null);
    const p = project.value(e.clientX, e.clientY);
    if (type === "pen" && e.pressure > 0) p[2] = Math.round(e.pressure * 100) / 100;
    begin.value(e.pointerId, type, p, type === "pen" && (e.buttons & 32) !== 0 || ctx.value.tool === "eraser");
    e.preventDefault();
  });
  const onMove = computed(() => (e: PointerEvent) => {
    onPointermove.value?.(e);
    if (e.pointerType === "pen") penSeen.value = e.timeStamp;
    const g = gesture.value;
    if (!g || g.pointer !== e.pointerId) return;
    const list = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
    for (const c of list.length ? list : [e]) {
      const p = project.value(c.clientX, c.clientY);
      if (e.pointerType === "pen" && c.pressure > 0) p[2] = Math.round(c.pressure * 100) / 100;
      extend.value(p);
    }
  });
  const onUp = computed(() => (cancel: boolean) => (e: PointerEvent) => {
    if (cancel) onPointercancel.value?.(e);else onPointerup.value?.(e);
    if (e.pointerType === "pen") penSeen.value = e.timeStamp;
    const g = gesture.value;
    if (!g || g.pointer !== e.pointerId) return;
    if (!cancel) {
      const p = project.value(e.clientX, e.clientY);
      const held = g.pts[g.pts.length - 1][2];
      if (g.kind === "pen" && held !== undefined) p[2] = held;
      if (g.pts.length > 1 || Math.hypot(p[0] - g.pts[0][0], p[1] - g.pts[0][1]) > 1) extend.value(p);
    }
    end.value(cancel);
  });
  const onLost = computed(() => (e: PointerEvent) => {
    onLostpointercapture.value?.(e);
    if (gesture.value && gesture.value.pointer === e.pointerId) end.value(false);
  });
  const onKey = computed(() => (e: KeyboardEvent) => {
    onKeydown.value?.(e);
    if (e.defaultPrevented) return;
    const k = e.key;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && k.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) ctx.value.redo();else ctx.value.undo();
      return;
    }
    if (mod && k.toLowerCase() === "y") {
      e.preventDefault();
      ctx.value.redo();
      return;
    }
    if (!interactive.value || mod || e.altKey && !k.startsWith("Arrow") || e.target as HTMLDivElement !== e.currentTarget as HTMLDivElement) return;
    const tool = KEY_TOOL[k.toLowerCase()];
    if (tool && k.length === 1) {
      if (ctx.value.tools.includes(tool)) {
        e.preventDefault();
        ctx.value.selectTool(tool);
        ctx.value.say(`${TOOL_LABEL[tool]}.`);
      }
      return;
    }
    if (k === "[" || k === "]") {
      e.preventDefault();
      const i = SIZE_STEPS.reduce((best, v, j) => Math.abs(v - ctx.value.size) < Math.abs(SIZE_STEPS[best] - ctx.value.size) ? j : best, 0);
      const next = SIZE_STEPS[Math.min(SIZE_STEPS.length - 1, Math.max(0, i + (k === "]" ? 1 : -1)))];
      ctx.value.setSize(next);
      ctx.value.say(`${SIZE_LABEL[sizeName(next) ?? "medium"]} line.`);
      return;
    }
    if (k.startsWith("Arrow")) {
      e.preventDefault();
      const d = e.shiftKey ? 32 : e.altKey ? 2 : 8;
      const [x, y] = cursor.value ?? [W.value / 2, H.value / 2];
      const nx = round1(Math.min(W.value, Math.max(0, x + (k === "ArrowRight" ? d : k === "ArrowLeft" ? -d : 0))));
      const ny = round1(Math.min(H.value, Math.max(0, y + (k === "ArrowDown" ? d : k === "ArrowUp" ? -d : 0))));
      setCursor([nx, ny]);
      if (gesture.value?.pointer === "key") extend.value([nx, ny]);
      return;
    }
    if (k === " " || k === "Enter") {
      e.preventDefault();
      const at = cursor.value ?? [W.value / 2, H.value / 2];
      setCursor([at[0], at[1]]);
      if (gesture.value?.pointer === "key") end.value(false);else if (!gesture.value) {
        begin.value("key", "key", [at[0], at[1]], ctx.value.tool === "eraser");
        ctx.value.say(ctx.value.tool === "eraser" ? "Eraser down." as const : "Pen down." as const);
      }
      return;
    }
    if (k === "Escape") {
      if (gesture.value?.pointer === "key") {
        end.value(true);
        ctx.value.say("Stroke canceled.");
      } else setCursor(null);
    }
  });
  const dropKeyboard = computed(() => (e: FocusEvent) => {
    onBlur.value?.(e);
    if (gesture.value?.pointer === "key") end.value(false);
    if (!(e.currentTarget as HTMLDivElement).contains(e.relatedTarget)) setCursor(null);
  });
  const p = computed(() => PAPERS[paper.value]);
  const timing = computed<ReplayTiming[] | null>(() => {
    if (!ctx.value.replaying) return null;
    let t = 0.2;
    return ctx.value.strokes.map(s => {
      const dur = Math.min(2.4, Math.max(0.14, strokeMarkup(s, {
        tier: tier.value
      }).length / (420 * ctx.value.replaySpeed)));
      const r = {
        delay: t,
        dur
      };
      t += dur + 0.08;
      return r;
    });
  });
  const liveMarkup = computed(() => live.value ? strokeMarkup(live.value, {
    tier: tier.value,
    live: true
  }).svg : "" as const);
  const cursorSvg = computed(() => cursorMarkup(uid.value));
  const a11y = computed(() => interactive.value ? {
    role: "application" as const,
    "aria-roledescription": "drawing canvas" as const,
    "aria-label": label.value,
    "aria-describedby": help,
    tabIndex: 0
  } as const : {
    role: "img" as const,
    "aria-label": `${label.value}, ${count(ctx.value.strokes.length)}`,
    "aria-disabled": ctx.value.disabled || undefined
  } as const);
  return () => {
    return <div data-slot="sketchpad-canvas" data-tool={interactive.value ? ctx.value.tool : undefined} data-drawing={live.value ? "" as const : undefined} ref={useMergedRef<HTMLDivElement>(hostRef, ref.value, ctx.value.canvasRef)} {...domProps(hostProps.value)} {...domProps(a11y.value)} onPointerdown={onDown.value} onPointermove={onMove.value} onPointerup={onUp.value(false)} onPointercancel={onUp.value(true)} onLostpointercapture={onLost.value} onKeydown={onKey.value} onBlur={dropKeyboard.value} class={cn("relative isolate touch-none select-none", interactive.value ? ctx.value.tool === "eraser" ? "cursor-cell" as const : "cursor-crosshair" as const : "cursor-default" as const, className.value)} {...domProps(props.value)}>
      {node.value}
      <Paper data-slot="sketchpad-paper" edge="cut" tilt={false} {...domProps(p.value)} {...domProps(paperProps.value)} class={cn("w-full", paperProps.value?.className)} style={cssStyle({
        aspectRatio: `${W.value} / ${H.value}`,
        ...paperProps.value?.style
      })}>
        {readSlot(_slots.default)}
        <svg ref={surface} data-slot="sketchpad-surface" aria-hidden="true" focusable="false" viewBox={`0 0 ${W.value} ${H.value}`} preserveAspectRatio="none" class="pointer-events-none absolute inset-0 size-full forced-color-adjust-none">
          <g data-slot="sketchpad-strokes" key={ctx.value.replayKey}>
            {ctx.value.strokes.map((s, i) => <StrokeShape key={s.id} stroke={s} dim={erasing.value.has(s.id)} replay={timing.value?.[i] ?? null} maskId={`ll-replay-${uid.value}-${i}`} width={W.value} height={H.value} />)}
          </g>
          {live.value ? <g data-slot="sketchpad-live" innerHTML={liveMarkup.value} /> : null}
          {cursor.value ? <g data-slot="sketchpad-cursor" transform={`translate(${cursor.value[0]} ${cursor.value[1]})`} innerHTML={cursorSvg.value} /> : null}
        </svg>
      </Paper>
      <span id={help} class="sr-only">
        Draw with a pointer, or use the arrow keys to move a cursor and Space to put the pen down and lift it. F, B, P, M, H and E pick a tool, the bracket keys change the width, Control Z undoes.
      </span>
      <span role="status" class="sr-only">
        {ctx.value.announce}
      </span>
    </div>;
  };
});
export { Sketchpad, SketchpadToolbar, SketchpadTools, SketchpadTool, SketchpadColors, SketchpadColor, SketchpadSizes, SketchpadSize, SketchpadUndo, SketchpadRedo, SketchpadClear, SketchpadCanvas, useSketchpad };
export type { SketchpadProps, SketchpadCanvasProps, SketchpadHandle, SketchStroke, SketchTool, SketchColor, SketchPoint, ExportOptions as SketchpadExportOptions };
