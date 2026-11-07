// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc, PropDoc } from "@/docs/types";
const standalone: PropDoc = {
  name: "config / tooltip / legend / className" as const,
  type: "ChartConfig / boolean / boolean | 'top' | 'bottom' / string" as const,
  description: "Only when used on its own, without a ChartContainer: it wraps itself in one. Inside a container, className sizes the drawing." as const
};
const xyProps: PropDoc[] = [{
  name: "data" as const,
  type: "Record<string, unknown>[]" as const,
  required: true,
  description: "One row per category (per point for a scatter). Very long data is thinned (bars are averaged into at most 240 bins, fewer with several series so a chart never draws more than 480 bars; lines keep 1,500 points chosen to keep their shape) and the summary says so." as const
}, {
  name: "xKey" as const,
  type: "string" as const,
  description: "The category key (a scatter's x number). Default: the first key whose value is text." as const
}, {
  name: "series" as const,
  type: "string[]" as const,
  description: "Keys to draw, in stacking order. Default: the numeric keys named in the container's config, else the numeric keys of the data." as const
}, {
  name: "kinds" as const,
  type: 'Record<string, "bar" | "line" | "area" | "scatter">' as const,
  description: 'Mix marks: `{ revenue: "bar", target: "line" }`.' as const
}, {
  name: "stacked" as const,
  type: "boolean" as const,
  default: "false" as const,
  description: "Stack bars (or areas). Positive values stack up from zero, negative ones down." as const
}, {
  name: "curve" as const,
  type: '"smooth" | "linear" | "step"' as const,
  default: '"smooth"' as const,
  description: "How lines and areas join their points. Smooth is monotone: it never overshoots a peak." as const
}, {
  name: "yDomain" as const,
  type: '[number | "auto", number | "auto"]' as const,
  description: "Pin the value axis. `auto` picks a tidy end (0, 50, 100...). Bars and areas always include zero unless `zero` is false." as const
}, {
  name: "zero" as const,
  type: "boolean" as const,
  description: "Whether the value axis includes zero. Default: yes for bars and areas, no for lines." as const
}, {
  name: "xFormatter" as const,
  type: "(value: unknown, index: number) => string" as const,
  description: "Text of a category on the axis (\"January\" to \"Jan\"). The tooltip and the table keep the full value." as const
}, {
  name: "yFormatter" as const,
  type: "(value: number) => string" as const,
  description: "Text of an axis tick. Default: compact numbers (1.2k, 3.4M)." as const
}, {
  name: "valueFormatter" as const,
  type: "(value: number) => string" as const,
  description: "Text of the numbers on bars, in the tooltip, the summary and the table. Default: 1,234." as const
}, {
  name: "dots" as const,
  type: 'boolean | "auto"' as const,
  default: '"auto"' as const,
  description: "Point markers on lines: drawn when there are few points and room for them. Each series has its own marker shape." as const
}, {
  name: "showValues" as const,
  type: 'boolean | "auto"' as const,
  default: '"auto"' as const,
  description: "Numbers on top of bars: drawn when they fit (wide enough, not stacked)." as const
}, {
  name: "showGrid" as const,
  type: "boolean" as const,
  default: "true" as const,
  description: "Broken pencil rules across the plot." as const
}, {
  name: "showXAxis / showYAxis" as const,
  type: "boolean" as const,
  default: "true" as const,
  description: "Axis labels (the baseline is always drawn)." as const
}, {
  name: "annotations" as const,
  type: "ChartAnnotation[]" as const,
  description: "Hand-circled call-outs: `{ at, series?, text, pen?, shape?, dx?, dy? }`. `at` is max, min, first, last, a category label or an index. `pen`: red, blue, ink, green. `shape`: loop, underline, none." as const
}, {
  name: "references" as const,
  type: "ChartReference[]" as const,
  description: "Dashed goal lines: `{ y, label?, pen? }` (a scatter also takes `{ x }`)." as const
}, {
  name: "highlights" as const,
  type: "ChartHighlight[]" as const,
  description: "A stretch of categories marked with a highlighter: `{ from, to, text? }` (labels or indices). It is part of the spoken summary." as const
}, {
  name: "label" as const,
  type: "string" as const,
  description: "The chart's accessible name and the start of its summary." as const
}, {
  name: "description" as const,
  type: "string" as const,
  description: "One more sentence for the spoken summary." as const
}, {
  name: "xLabel" as const,
  type: "string" as const,
  description: "Name of the category column in the data table." as const
}, {
  name: "loading" as const,
  type: "boolean" as const,
  description: "Ghost bars pulse, the chart is aria-busy and not interactive." as const
}, {
  name: "emptyText" as const,
  type: "string" as const,
  description: "Text shown when there is nothing to draw." as const
}, {
  name: "animate" as const,
  type: "boolean" as const,
  default: "true" as const,
  description: "Wipe the chart on once when it first appears. Reduced motion skips it; a redraw with new data never replays it." as const
}, {
  name: "seed" as const,
  type: "string | number" as const,
  description: "Pins the hand." as const
}, {
  name: "accessibilityLayer" as const,
  type: "boolean" as const,
  description: "Accepted so shadcn's markup keeps working; the keyboard cursor, live region and data table are always on." as const
}, {
  name: "onActiveChange" as const,
  type: "(info: { index: number; series: number | null } | null) => void" as const,
  description: "The data point under the pointer or the keys changed." as const
}, {
  name: "onSelect" as const,
  type: "(info: { index: number; series: number | null }) => void" as const,
  description: "A click, Enter or Space on a data point (drill down, filter)." as const
}, standalone];
const common: PropDoc[] = [{
  name: "label" as const,
  type: "string" as const,
  description: "The accessible name and the start of the spoken summary." as const
}, {
  name: "description" as const,
  type: "string" as const,
  description: "One more sentence for the summary." as const
}, {
  name: "loading" as const,
  type: "boolean" as const,
  description: "Ghost drawing, aria-busy, not interactive." as const
}, {
  name: "emptyText" as const,
  type: "string" as const,
  description: "Text shown when there is nothing to draw." as const
}, {
  name: "animate" as const,
  type: "boolean" as const,
  default: "true" as const,
  description: "Wipe on once when it first appears." as const
}, {
  name: "seed" as const,
  type: "string | number" as const,
  description: "Pins the hand." as const
}, {
  name: "onActiveChange" as const,
  type: "(info: { index: number; series: number | null } | null) => void" as const,
  description: "The data point under the pointer or the keys changed." as const
}, {
  name: "onSelect" as const,
  type: "(info: { index: number; series: number | null }) => void" as const,
  description: "A click, Enter or Space on a data point." as const
}, standalone];
export default {
  slug: "chart" as const,
  title: "Chart" as const,
  category: "Charts" as const,
  description: "Charts drawn by hand: bars colored in with a marker, felt lines, pencil-shaded areas, pies, radars, dials, sparklines, tally marks and calendar heat maps. Real text on a real DOM, a keyboard cursor, a tooltip on a slip of paper, a legend that switches series off, a table for screen readers, and a pencil pattern on every series so color is never the only channel." as const,
  status: "new" as const,
  upstream: "chart" as const,
  parts: [{
    name: "ChartContainer" as const,
    description: "The frame around a chart and its legend and tooltip. Same job as shadcn's: it owns the config and puts the series colors on the frame as `--color-<key>` (a `theme` gives a light and a dark value). It also owns which series are switched off. The drawing is not recharts: every chart component in this file draws itself with the ink engine." as const,
    props: [{
      name: "config" as const,
      type: "ChartConfig" as const,
      required: true,
      description: "`{ desktop: { label: 'Desktop', color: 'var(--chart-1)' } }`. A key's position is its palette slot (`--chart-1` is the marker orange, then blue felt, green pencil, deep highlighter, grape). Add `pattern`, `marker` and `dash` to override the look a series gets." as const
    }, {
      name: "patterns" as const,
      type: 'boolean | "auto"' as const,
      default: "solid, patterns in forced colors" as const,
      description: "Solid color by default. `\"auto\"` adds pencil patterns on filled marks and dashes on lines when there is more than one series, `true` always does. With no value, patterns switch on by themselves when the system forces its own colors." as const
    }, {
      name: "hiddenSeries" as const,
      type: "string[]" as const,
      description: "Series (or slices) switched off, controlled. The legend buttons toggle them." as const
    }, {
      name: "defaultHiddenSeries" as const,
      type: "string[]" as const,
      description: "Uncontrolled start value." as const
    }, {
      name: "onHiddenSeriesChange" as const,
      type: "(hidden: string[]) => void" as const,
      description: "A legend button was pressed." as const
    }, {
      name: "initialDimension" as const,
      type: "{ width: number; height: number }" as const,
      description: "Draw at this size on the server and before the first measure, so the chart is part of the server HTML." as const
    }, {
      name: "className" as const,
      type: "string" as const,
      description: "Sizes the frame: `aspect-auto h-64 w-full`. It is `aspect-video` by default, like shadcn's. A chart takes its size from the frame, so give it a height or a ratio: `aspect-auto` with no height is 0 px tall." as const
    }]
  }, {
    name: "ChartStyle" as const,
    description: "The `<style>` that carries `--color-<key>` for each config entry (light and `.dark`). ChartContainer renders it for you." as const,
    props: [{
      name: "id" as const,
      type: "string" as const,
      required: true,
      description: "The container's `data-chart` value." as const
    }, {
      name: "config" as const,
      type: "ChartConfig" as const,
      required: true,
      description: "The config to write out." as const
    }]
  }, {
    name: "ChartTooltip" as const,
    description: "Switches the tooltip on. It renders nothing itself: the chart draws the tooltip inside its own box, where the point is, and keeps it in view. Hover, touch and the arrow keys all move it." as const,
    props: [{
      name: "content" as const,
      type: "VueElement" as const,
      default: "<ChartTooltipContent />" as const,
      description: "Cloned with `active`, `payload` and `label`. Any component that takes those works." as const
    }, {
      name: "defaultIndex" as const,
      type: "number" as const,
      description: "Show this data point when nothing is hovered or focused." as const
    }, {
      name: "cursor" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Kept for shadcn parity. The highlighter behind a column and the ring on a point are part of the drawing." as const
    }]
  }, {
    name: "ChartTooltipContent" as const,
    description: "The slip of paper: a label in the script font and one row per series with a swatch that matches the drawing (color, pattern, marker). Same props as shadcn's; the payload is recharts-shaped so an existing `formatter` keeps working." as const,
    props: [{
      name: "indicator" as const,
      type: '"dot" | "line" | "dashed"' as const,
      default: '"dot"' as const,
      description: "The swatch: a chip (a line swatch for line series), a narrow bar, or a dashed rule." as const
    }, {
      name: "hideLabel" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Leave out the label." as const
    }, {
      name: "hideIndicator" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Leave out the swatches." as const
    }, {
      name: "labelFormatter" as const,
      type: "(label: VueNode, payload: ChartTooltipItem[]) => VueNode" as const,
      description: "Change the label." as const
    }, {
      name: "formatter" as const,
      type: "(value, name, item, index, payload) => VueNode" as const,
      description: "Replace a whole row." as const
    }, {
      name: "nameKey / labelKey" as const,
      type: "string" as const,
      description: "Which payload key names a row / the label in the config." as const
    }, {
      name: "color" as const,
      type: "string" as const,
      description: "Force the indicator color." as const
    }, {
      name: "className / labelClassName" as const,
      type: "string" as const,
      description: "Merged onto the slip / the label." as const
    }]
  }, {
    name: "ChartLegend" as const,
    description: "The key of the chart in this container. Place it before (`verticalAlign=\"top\"`) or after the chart. It shows the series the chart registered, with the very swatches the drawing uses." as const,
    props: [{
      name: "content" as const,
      type: "VueElement" as const,
      default: "<ChartLegendContent />" as const,
      description: "Custom legend markup." as const
    }, {
      name: "verticalAlign" as const,
      type: '"top" | "bottom"' as const,
      default: '"bottom"' as const,
      description: "Which side gets the padding." as const
    }, {
      name: "keys" as const,
      type: "string[]" as const,
      description: "Only these entries, in this order." as const
    }, {
      name: "toggle" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Entries are buttons (aria-pressed) that switch a series off and on. `false` makes a plain key." as const
    }]
  }, {
    name: "ChartLegendContent" as const,
    description: "The default legend body; same props as ChartLegend without `content`. `hideIcon` drops the config icon or swatch." as const,
    props: [{
      name: "hideIcon" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Leave out the swatch / icon." as const
    }]
  }, {
    name: "ChartSwatch" as const,
    description: "The little chip of a legend or tooltip row: the series' marker fill, its pencil pattern, in a tiny felt box (`line` draws a line sample with its marker and dash)." as const,
    props: [{
      name: "palette" as const,
      type: "number" as const,
      required: true,
      description: "The series' slot (its position in the config)." as const
    }, {
      name: "pattern" as const,
      type: '"solid" | "hatch" | "dots" | "cross" | "lines" | "scribble"' as const,
      default: '"solid"' as const,
      description: "The pencil pattern." as const
    }, {
      name: "marker" as const,
      type: "MarkerShape" as const,
      description: "Line swatches: the marker on the sample." as const
    }, {
      name: "line" as const,
      type: "boolean" as const,
      description: "A line sample instead of a filled chip." as const
    }]
  }, {
    name: "ChartCenterLabel" as const,
    description: "The words in the hole of a donut or radial chart: a big number in the script font and a small caption. `centerLabel` takes one, a node, or a function of the total and the slice under the cursor." as const,
    props: [{
      name: "value" as const,
      type: "VueNode" as const,
      required: true,
      description: "The big text." as const
    }, {
      name: "label" as const,
      type: "VueNode" as const,
      description: "The caption." as const
    }]
  }, {
    name: "BarChart" as const,
    description: "Bars: single, grouped, stacked or sideways, with negative values hanging below the line. Bars are filled edge to edge in solid color, with a steady felt outline rounded at the far end. The highest bar can be circled by hand." as const,
    props: [{
      name: "horizontal" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Bars run sideways, categories down the left (ignored when a series is not a bar)." as const
    }, {
      name: "layout" as const,
      type: '"horizontal" | "vertical"' as const,
      description: 'recharts\' name for the same thing: "vertical" runs the bars sideways.' as const
    }, ...xyProps]
  }, {
    name: "LineChart" as const,
    description: "A felt line per series, with a marker shape and a dash pattern each so lines survive grayscale. Gaps in the data break the line. Long series keep their peaks and dips." as const,
    props: xyProps
  }, {
    name: "AreaChart" as const,
    description: "Lines with the space under them washed in the series color and shaded in pencil. Stack them with `stacked`." as const,
    props: xyProps
  }, {
    name: "ScatterChart" as const,
    description: "Points on two number lines, one marker shape per series; a `sizeKey` turns them into bubbles. Up to 600 points are drawn; the tooltip finds the nearest point." as const,
    props: [{
      name: "sizeKey" as const,
      type: "string" as const,
      description: "The data key that sizes each point." as const
    }, ...xyProps]
  }, {
    name: "PieChart" as const,
    description: "Slices colored in with a marker, outlined in felt, each with its own pencil pattern and a percentage round the outside. Arrow keys walk the slices; the legend switches them off." as const,
    props: [{
      name: "data" as const,
      type: "Record<string, unknown>[]" as const,
      required: true,
      description: "One row per slice." as const
    }, {
      name: "nameKey" as const,
      type: "string" as const,
      description: "The key that names a slice and finds its config entry. Default: the first key with text." as const
    }, {
      name: "valueKey" as const,
      type: "string" as const,
      description: "The key with the amount. Default: the first numeric key." as const
    }, {
      name: "innerRadius" as const,
      type: "number" as const,
      default: "0" as const,
      description: "Fraction of the radius that is hole (0 to 0.9)." as const
    }, {
      name: "startAngle" as const,
      type: "number" as const,
      default: "0" as const,
      description: "Degrees clockwise from twelve o'clock." as const
    }, {
      name: "showLabels" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Percentages round the outside." as const
    }, {
      name: "centerLabel" as const,
      type: "VueNode | { value, label } | (info: { total, active }) => VueNode" as const,
      description: "Text in the hole." as const
    }, {
      name: "valueFormatter" as const,
      type: "(value: number) => string" as const,
      description: "Number text." as const
    }, ...common]
  }, {
    name: "DonutChart" as const,
    description: "A PieChart with a hole (`innerRadius` 0.58) for a number in the middle." as const,
    props: [{
      name: "innerRadius" as const,
      type: "number" as const,
      default: "0.58" as const,
      description: "Fraction of the radius that is hole." as const
    }, {
      name: "centerLabel" as const,
      type: "VueNode | { value, label } | function" as const,
      description: "Text in the hole." as const
    }, ...common]
  }, {
    name: "RadarChart" as const,
    description: "A pencil web with a washed and shaded shape per series. The spokes are the keyboard stops." as const,
    props: [{
      name: "data" as const,
      type: "Record<string, unknown>[]" as const,
      required: true,
      description: "One row per axis." as const
    }, {
      name: "xKey" as const,
      type: "string" as const,
      description: "The key that names an axis." as const
    }, {
      name: "series" as const,
      type: "string[]" as const,
      description: "Keys to draw." as const
    }, {
      name: "max" as const,
      type: "number" as const,
      description: "The value at the rim. Default: a tidy number above the largest value." as const
    }, {
      name: "levels" as const,
      type: "number" as const,
      default: "4" as const,
      description: "Rings of the web." as const
    }, {
      name: "fill" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Shade the shapes." as const
    }, {
      name: "dots" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "A marker on each vertex." as const
    }, ...common]
  }, {
    name: "RadialChart" as const,
    description: "Concentric arcs in pale tracks: one ring per row, filled to its value. Ring names sit in the open quadrant." as const,
    props: [{
      name: "data" as const,
      type: "Record<string, unknown>[]" as const,
      required: true,
      description: "One row per ring; a row's own `max` overrides `max`." as const
    }, {
      name: "nameKey / valueKey" as const,
      type: "string" as const,
      description: "Which keys name and size a ring." as const
    }, {
      name: "max" as const,
      type: "number" as const,
      default: "100" as const,
      description: "The value that fills a ring." as const
    }, {
      name: "startAngle / endAngle" as const,
      type: "number" as const,
      default: "0 / 270" as const,
      description: "Degrees clockwise from twelve o'clock." as const
    }, {
      name: "centerLabel" as const,
      type: "VueNode | { value, label }" as const,
      description: "Text in the hole." as const
    }, ...common]
  }, {
    name: "Gauge" as const,
    description: "A dial: marker zones (each with a pencil pattern) and a red felt needle, or a single colored arc. `role=\"meter\"` with a value, a minimum, a maximum and a text, so assistive tech reads it. The children are the text under the pivot." as const,
    props: [{
      name: "value" as const,
      type: "number" as const,
      required: true,
      description: "The reading; clamped to min and max." as const
    }, {
      name: "min / max" as const,
      type: "number" as const,
      default: "0 / 100" as const,
      description: "The ends of the dial." as const
    }, {
      name: "zones" as const,
      type: "{ to: number; tone?: 'good' | 'warn' | 'bad' | 'info' | 'brand' | number }[]" as const,
      description: "Colored stretches from the minimum up." as const
    }, {
      name: "sweep" as const,
      type: "number" as const,
      default: "180" as const,
      description: "Degrees the dial covers (180 is a half circle)." as const
    }, {
      name: "ticks" as const,
      type: "number" as const,
      default: "10" as const,
      description: "Pencil ticks round the outside." as const
    }, {
      name: "valueFormatter" as const,
      type: "(value: number) => string" as const,
      description: "Number text." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "The accessible name." as const
    }, {
      name: "children" as const,
      type: "VueNode" as const,
      description: "Text under the pivot. Default: the value." as const
    }, standalone]
  }, {
    name: "Sparkline" as const,
    description: "One felt pull and a red dot at the end, a shaded area, or a row of marker bars, at 112 x 40 px unless you size it. A picture with a spoken summary; `interactive` makes it a chart with a cursor and a tooltip." as const,
    props: [{
      name: "data" as const,
      type: "(number | null)[] | Record<string, unknown>[]" as const,
      required: true,
      description: "Numbers, or rows with `dataKey`." as const
    }, {
      name: "dataKey / xKey" as const,
      type: "string" as const,
      description: "For rows: the value and the category key." as const
    }, {
      name: "variant" as const,
      type: '"line" | "area" | "bar"' as const,
      default: '"line"' as const,
      description: "How it is drawn." as const
    }, {
      name: "slot / series" as const,
      type: "number / string" as const,
      description: "Palette slot, or the config key whose color to use." as const
    }, {
      name: "ends" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "A red dot on the last point." as const
    }, {
      name: "extremes" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Small marks on the lowest and highest points." as const
    }, {
      name: "interactive" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Hover and arrow keys show a tooltip." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "The accessible name." as const
    }, standalone]
  }, {
    name: "TallyChart" as const,
    description: "Counts as hand-tallied marks: four uprights and a slash across for every five, in the color of the row. When a row is too long for the width each mark stands for more, and the chart says so." as const,
    props: [{
      name: "data" as const,
      type: "Record<string, unknown>[]" as const,
      required: true,
      description: "One row per line of the board." as const
    }, {
      name: "nameKey / valueKey" as const,
      type: "string" as const,
      description: "Which keys name and count a row." as const
    }, {
      name: "unit" as const,
      type: "number" as const,
      default: "auto" as const,
      description: "What one mark stands for." as const
    }, ...common]
  }, {
    name: "Heatmap" as const,
    description: "Squares colored in shades of one marker: a calendar (weeks across, weekdays down, month names on top) or a grid of your own rows and columns. Arrow keys move over the cells: left and right by week, up and down by day." as const,
    props: [{
      name: "data" as const,
      type: "Record<string, unknown>[]" as const,
      required: true,
      description: "Calendar: rows with a date and a value. Grid: rows with a row name, a column name and a value." as const
    }, {
      name: "variant" as const,
      type: '"calendar" | "grid"' as const,
      default: '"calendar"' as const,
      description: "The layout." as const
    }, {
      name: "dateKey / valueKey" as const,
      type: "string" as const,
      default: '"date" / "value"' as const,
      description: "Calendar keys. Dates are `YYYY-MM-DD` or Date, read in UTC." as const
    }, {
      name: "weeks / end / weekStart" as const,
      type: "number / string | Date / 0 | 1" as const,
      description: "Weeks shown, the last day, and whether weeks start on Sunday (0) or Monday (1)." as const
    }, {
      name: "rowKey / colKey / rows / cols" as const,
      type: "string / string[]" as const,
      description: "Grid keys and the order of rows and columns." as const
    }, {
      name: "levels / thresholds" as const,
      type: "number / number[]" as const,
      default: "5" as const,
      description: "Shades, and optionally the value at which each starts." as const
    }, {
      name: "slot / series" as const,
      type: "number / string" as const,
      description: "Palette slot, or the config key whose color to use. Default the green pencil." as const
    }, {
      name: "unit" as const,
      type: "string" as const,
      description: "What a value counts (\"pages\"), shown in the tooltip." as const
    }, {
      name: "showLegend" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The Less / More key." as const
    }, ...common]
  }],
  a11y: ["Every chart is one tab stop with arrow-key navigation. The drawing is a `role=\"application\"` with an accessible name, a role description (\"bar chart\") and a spoken summary; left and right move between data points (up and down between series, or between rows for sideways bars and grids), Home and End jump to the first and last, Escape closes the tooltip. The current point is announced through a polite live region.", "Each chart ships its data as a visually hidden table (a caption, column and row headers) next to the drawing. Charts that are pictures (empty, loading, static sparklines) are `role=\"img\"` with the same summary; a gauge is `role=\"meter\"` with a value, a minimum, a maximum and a text.", "Color is not the only channel: every series is named in the legend and the tooltip, values are announced, and lines have a marker shape and a dash pattern. Filled marks are solid color; set `patterns` to add hatching, dots, cross-hatching, rules and scribble, which also switch on by themselves in forced-colors mode. Legend entries are buttons with `aria-pressed`.", "All chart text is DOM text in the hand fonts at 12 px or more (15 px script in the default density). Ink on paper is 14:1; muted tick labels 8.9:1. The pointer never has to be used: everything the tooltip shows is in the live region and the table.", "Reduced motion removes the wipe-on, the pulse and the cursor slide. In Windows high contrast the drawing is replaced by the data table. Calm density draws hairlines, no fill offset and 12 px hand text for dense screens. The plot always runs left to right (a time axis does not mirror); the legend and the words on the tooltip follow the page direction."],
  usage: `import { BarChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const data = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
]

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

export function Example() {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data} xKey="month" label="Visitors by month" annotations={[{ at: "max", text: "best month!" }]} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend />
    </ChartContainer>
  )
}

export function OnItsOwn() {
  return <BarChart data={data} xKey="month" className="h-64" />
}

export function TheOthers({ days }: { days: { date: string; value: number }[] }) {
  return (
    <>
      <LineChart data={data} xKey="month" />
      <AreaChart data={data} xKey="month" stacked />
      <ScatterChart data={points} xKey="age" series={["height"]} sizeKey="weight" />
      <PieChart data={plans} nameKey="plan" valueKey="users" />
      <DonutChart data={plans} nameKey="plan" valueKey="users" centerLabel={{ value: 1070, label: "users" }} />
      <RadarChart data={skills} xKey="skill" />
      <RadialChart data={rings} nameKey="ring" valueKey="done" />
      <Gauge value={68} zones={[{ to: 40, tone: "good" }, { to: 100, tone: "bad" }]} />
      <Sparkline data={[3, 5, 4, 8]} />
      <TallyChart data={cups} nameKey="drink" valueKey="cups" />
      <Heatmap data={days} />
    </>
  )
}`,
  related: ["card", "tooltip", "table", "progress"]
} satisfies ComponentDoc;
