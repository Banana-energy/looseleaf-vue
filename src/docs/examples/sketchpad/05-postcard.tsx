// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Sketchpad, SketchpadCanvas, SketchpadColors, SketchpadToolbar, SketchpadTools, SketchpadUndo, type SketchStroke, type SketchpadHandle } from "@/components/ui/sketchpad";
export const meta = {
  title: "Postcard" as const,
  description: "A real use: draw a card, watch a live thumbnail (the same strokes, read-only), save the picture as svg or copy the JSON to keep it in your database." as const,
  layout: "stack" as const,
  height: 420
};
const TAU = Math.PI * 2;
const round = (n: number) => Math.round(n * 10) / 10;
const along = (n: number, f: (t: number) => [number, number]): [number, number][] => Array.from({
  length: n + 1
}, (_, i) => f(i / n)).map(([x, y]) => [round(x), round(y)]);
const line = (a: [number, number], b: [number, number], n = 6) => along(n, t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
const heart = (cx: number, cy: number, k: number) => along(36, t => {
  const a = t * TAU - Math.PI / 2;
  return [cx + 16 * Math.pow(Math.sin(a), 3) * k, cy - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * k];
});
const START: SketchStroke[] = [{
  id: "sun" as const,
  tool: "felt" as const,
  color: "tangerine" as const,
  size: 1.1,
  pts: along(28, t => [388 + 24 * Math.cos(t * TAU * 1.03 - 1.6), 70 + 24 * Math.sin(t * TAU * 1.03 - 1.6)])
}, ...Array.from({
  length: 6
}, (_, i): SketchStroke => {
  const a = i / 6 * TAU - 0.4;
  return {
    id: `ray${i}`,
    tool: "felt" as const,
    color: "tangerine" as const,
    size: 1.1,
    pts: along(3, t => [388 + (36 + 12 * t) * Math.cos(a), 70 + (36 + 12 * t) * Math.sin(a)])
  };
}), {
  id: "sail" as const,
  tool: "marker" as const,
  color: "red" as const,
  size: 1,
  pts: [...line([233, 208], [281, 208], 5), ...line([274, 196], [235, 196], 5), ...line([263, 184], [236, 184], 4), ...line([255, 172], [237, 172], 3), ...line([249, 160], [238, 160], 3), ...line([243, 148], [239, 148], 2)]
}, {
  id: "sail-edge" as const,
  tool: "felt" as const,
  color: "ink" as const,
  size: 0.8,
  pts: [...line([226, 118], [226, 214], 8), ...line([226, 214], [288, 214], 6), ...line([288, 214], [226, 118], 8)]
}, {
  id: "mast" as const,
  tool: "felt" as const,
  color: "ink" as const,
  size: 1,
  pts: [...line([220, 226], [220, 100], 10), ...line([221, 102], [246, 111], 4), ...line([246, 111], [221, 120], 4)]
}, {
  id: "hull" as const,
  tool: "felt" as const,
  color: "ink" as const,
  size: 1,
  pts: [...line([150, 226], [292, 226], 10), ...line([292, 226], [270, 254], 5), ...line([270, 254], [172, 254], 8), ...line([172, 254], [150, 226], 5)]
}, {
  id: "sea" as const,
  tool: "felt" as const,
  color: "ink-you" as const,
  size: 1,
  pts: along(70, t => [34 + t * 412, 274 + 7 * Math.sin(t * TAU * 8)])
}, {
  id: "heart" as const,
  tool: "marker" as const,
  color: "red" as const,
  size: 1,
  pts: heart(84, 86, 1.7)
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const api = shallowRef<SketchpadHandle | null>(null);
  const strokes = shallowRef<SketchStroke[]>(initialState(START));
  const setStrokes = stateSetter(strokes);
  const copied = shallowRef(initialState(false));
  const setCopied = stateSetter(copied);
  const download = computed(() => () => {
    const svg = api.value?.toSVG({
      title: "Postcard" as const
    });
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], {
      type: "image/svg+xml" as const
    }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "postcard.svg";
    a.click();
    URL.revokeObjectURL(url);
  });
  return () => {
    return <div class="grid w-full max-w-3xl gap-4 sm:grid-cols-[1fr_11rem]">
      <Sketchpad apiRef={api} value={strokes.value} onValueChange={setStrokes} tools={["felt", "marker", "eraser"]} width={480} height={320}>
        <SketchpadToolbar>
          <SketchpadTools />
          <SketchpadColors colors={["ink", "ink-you", "red", "tangerine", "teal", "grape"]} />
          <SketchpadUndo class="ms-auto" />
        </SketchpadToolbar>
        <SketchpadCanvas paper="ruled" label="Postcard" />
      </Sketchpad>
      <div class="flex flex-col gap-2">
        <p class="font-script text-2xl leading-none">Preview</p>
        <Sketchpad readOnly value={strokes.value} width={480} height={320} />
        <p class="text-sm text-muted-foreground">{strokes.value.length} strokes</p>
        <Button size="sm" onClick={download.value} disabled={!strokes.value.length}>
          Save as SVG
        </Button>
        <Button size="sm" variant="outline" disabled={!strokes.value.length} onClick={async () => {
          await navigator.clipboard?.writeText(JSON.stringify(strokes.value));
          setCopied(true);
        }}>
          {copied.value ? "Copied" as const : "Copy JSON" as const}
        </Button>
      </div>
    </div>;
  };
});
export default Example;
