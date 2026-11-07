// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { paths } from "@/docs/core/router-core";
import { Section, Stage, Tile, TileGrid, cx } from "@/docs/kit";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Paper } from "@/components/ui/paper";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
export interface RelatedLink {
  to: string;
  title: string;
  note: string;
}
export const foundation = (slug: string, title: string, note: string): RelatedLink => ({
  to: paths.foundations(slug),
  title,
  note
});
export const component = (slug: string, title: string, note: string): RelatedLink => ({
  to: paths.components(slug),
  title,
  note
});
export const Related = defineUi<{
  items: readonly RelatedLink[];
}>("Related", ["items"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  return () => {
    return <Section id="related" title="Related" description="Where to go from here.">
      <TileGrid>
        {items.value.map(item => <Tile key={item.to} to={item.to} title={item.title} description={item.note} />)}
      </TileGrid>
    </Section>;
  };
});
export const Demo = defineUi<{
  label: string;
  height?: number;
  surface?: "paper" | "desk";
  className?: string;
  children: UI.VueNode;
}>("Demo", ["label", "height", "surface", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const height = computed(() => _props["height"]);
  const surface = computed(() => _props["surface"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <Stage layout="center" label={label.value} height={height.value} surface={surface.value}>
      <div class={cx("w-full min-w-0", className.value)}>{readSlot(_slots.default)}</div>
    </Stage>;
  };
});
export const Panel = defineUi<{
  title?: string;
  className?: string;
  children: UI.VueNode;
}>("Panel", ["title", "class"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <Paper stock="slip" tilt={false} class={cn("p-4", className.value)}>
      {title.value ? <p class="mb-3 font-type text-[13px] text-pencil-text">{title.value}</p> : null}
      {readSlot(_slots.default)}
    </Paper>;
  };
});
export const Readout = defineUi<UI.ComponentProps<"output">>("Readout", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <output class={cn("ll-num font-mono text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</output>;
  };
});
export interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  tone?: "marker" | "hi" | "blue";
  ticks?: boolean | number;
  hint?: string;
  className?: string;
  seed?: string;
}
export const SliderRow = defineUi<SliderRowProps>("SliderRow", ["label", "value", "min", "max", "step", "onChange", "format", "tone", "ticks", "hint", "class", "seed"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const value = computed(() => _props["value"]);
  const min = computed(() => _props["min"]);
  const max = computed(() => _props["max"]);
  const step = computed(() => _props["step"] === undefined ? 1 : _props["step"]);
  const onChange = computed(() => _props["onChange"]);
  const format = computed(() => _props["format"]);
  const tone = computed(() => _props["tone"]);
  const ticks = computed(() => _props["ticks"]);
  const hint = computed(() => _props["hint"]);
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const id = useId();
  return () => {
    return <div class={cn("grid gap-1.5", className.value)}>
      <div class="flex items-baseline justify-between gap-3">
        <Label id={`${id}-label`} class="text-[15px] font-bold">
          {label.value}
        </Label>
        <Readout>{format.value ? format.value(value.value) : String(value.value)}</Readout>
      </div>
      <Slider aria-labelledby={`${id}-label`} aria-describedby={hint.value ? `${id}-hint` : undefined} value={[value.value]} min={min.value} max={max.value} step={step.value} tone={tone.value} ticks={ticks.value} seed={seed.value} onValueChange={v => {
        const next = v[0];
        if (typeof next === "number" && Number.isFinite(next)) onChange.value(next);
      }} />
      {hint.value ? <p id={`${id}-hint`} class="text-sm text-muted-foreground">
          {hint.value}
        </p> : null}
    </div>;
  };
});
export const SwitchRow = defineUi<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
  className?: string;
}>("SwitchRow", ["label", "checked", "onChange", "hint", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const checked = computed(() => _props["checked"]);
  const onChange = computed(() => _props["onChange"]);
  const hint = computed(() => _props["hint"]);
  const className = computed(() => _props["class"]);
  const id = useId();
  return () => {
    return <div class={cn("grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1", className.value)}>
      <Switch id={id} checked={checked.value} onCheckedChange={onChange.value} aria-describedby={hint.value ? `${id}-hint` : undefined} />
      <Label for={id} class="text-[15px] font-bold">
        {label.value}
      </Label>
      {hint.value ? <p id={`${id}-hint`} class="col-start-2 text-sm text-muted-foreground">
          {hint.value}
        </p> : null}
    </div>;
  };
});
export interface Option<T extends string> {
  value: T;
  label: string;
}
export const SelectRow = (<T extends string,>() => {
  return defineUi<{
    label: string;
    value: T;
    options: readonly Option<T>[];
    onChange: (v: T) => void;
    className?: string;
  }>("SelectRow", ["label", "value", "options", "onChange", "class"], (_props, {
    slots: _slots
  }) => {
    const label = computed(() => _props["label"]);
    const value = computed(() => _props["value"]);
    const options = computed(() => _props["options"]);
    const onChange = computed(() => _props["onChange"]);
    const className = computed(() => _props["class"]);
    const id = useId();
    return () => {
      return <div class={cn("grid gap-1.5", className.value)}>
      <Label for={id} class="text-[15px] font-bold">
        {label.value}
      </Label>
      <NativeSelect id={id} value={value.value} onChange={e => onChange.value(e.target.value as T)} class="w-full">
        {options.value.map(o => <NativeSelectOption key={o.value} value={o.value}>
            {o.label}
          </NativeSelectOption>)}
      </NativeSelect>
    </div>;
    };
  });
})();
export const TableScroll = defineUi<{
  label: string;
  children: UI.VueNode;
}>("TableScroll", ["label"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <div role="group" tabindex={0} aria-label={label.value} class="overflow-x-auto">
      {readSlot(_slots.default)}
    </div>;
  };
});
export const th = "border-b-2 border-pencil-mark px-2 py-1.5 text-start align-bottom font-script text-lg font-bold whitespace-nowrap text-ink";
export const td = "border-b border-line-soft px-2 py-2 align-top";
const VERDICT_STYLE = {
  ok: "text-green" as const,
  info: "text-orange-text" as const,
  fail: "text-red" as const
} as const;
export const Verdict = defineUi<{
  kind: keyof typeof VERDICT_STYLE;
  children?: UI.VueNode;
}>("Verdict", ["kind"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <span class={cn("font-type text-[13px]", VERDICT_STYLE[kind.value])}>{readSlot(_slots.default) ?? kind.value}</span>;
  };
});
