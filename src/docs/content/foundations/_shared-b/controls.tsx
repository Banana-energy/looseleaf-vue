// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cx } from "@/docs/kit";
export const ControlLabel = defineUi<{
  id?: string;
  children: UI.VueNode;
  className?: string;
}>("ControlLabel", ["id", "class"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  return () => {
    return <span id={id.value} class={cx("font-script text-xl leading-none text-ink-you", className.value)}>
      {readSlot(_slots.default)}
    </span>;
  };
});
export interface ChoiceOption<T extends string> {
  value: T;
  label: UI.VueNode;
  name?: string;
}
export const Choice = (<T extends string,>() => {
  return defineUi<{
    label: string;
    value: T;
    onChange: (value: T) => void;
    options: readonly ChoiceOption<T>[];
    className?: string;
  }>("Choice", ["label", "value", "onChange", "options", "class"], (_props, {
    slots: _slots
  }) => {
    const label = computed(() => _props["label"]);
    const value = computed(() => _props["value"]);
    const onChange = computed(() => _props["onChange"]);
    const options = computed(() => _props["options"]);
    const className = computed(() => _props["class"]);
    return () => {
      return <ToggleGroup type="single" variant="outline" size="sm" spacing={2} value={value.value} onValueChange={next => {
        if (next) onChange.value(next as T);
      }} aria-label={label.value} class={cx("max-w-full flex-wrap", className.value)}>
      {options.value.map(o => <ToggleGroupItem key={o.value} value={o.value} aria-label={o.name}>
          {o.label}
        </ToggleGroupItem>)}
    </ToggleGroup>;
    };
  });
})();
export const SearchField = defineUi<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}>("SearchField", ["label", "value", "onChange", "placeholder", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const value = computed(() => _props["value"]);
  const onChange = computed(() => _props["onChange"]);
  const placeholder = computed(() => _props["placeholder"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <Input type="search" aria-label={label.value} placeholder={placeholder.value} value={value.value} onChange={(e: Event) => onChange.value((e.target as HTMLInputElement).value)} autocomplete="off" spellcheck={false} class={className.value} />;
  };
});
export const SizeSlider = defineUi<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  readout?: UI.VueNode;
  unit?: string;
  className?: string;
}>("SizeSlider", ["label", "value", "onChange", "min", "max", "readout", "unit", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const value = computed(() => _props["value"]);
  const onChange = computed(() => _props["onChange"]);
  const min = computed(() => _props["min"]);
  const max = computed(() => _props["max"]);
  const readout = computed(() => _props["readout"]);
  const unit = computed(() => _props["unit"] === undefined ? "px" as const : _props["unit"]);
  const className = computed(() => _props["class"]);
  const id = useId();
  return () => {
    return <div class={cx("flex min-w-56 flex-1 flex-col gap-1.5", className.value)}>
      <div class="flex items-baseline justify-between gap-3">
        <ControlLabel id={id}>{label.value}</ControlLabel>
        <span class="font-type text-sm text-ink tabular-nums">
          {value.value} {unit.value}
        </span>
      </div>
      <Slider min={min.value} max={max.value} step={1} value={[value.value]} onValueChange={([next]) => {
        if (next !== undefined) onChange.value(next);
      }} aria-labelledby={id} getValueText={v => `${v} ${unit.value === "px" ? "pixels" as const : unit.value}`} />
      {readout.value ? <p class="text-[15px] text-muted-foreground m-0">{readout.value}</p> : null}
    </div>;
  };
});
export const Toolbar = defineUi<{
  children: UI.VueNode;
  className?: string;
}>("Toolbar", ["class"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  return () => {
    return <div class={cx("mb-4 flex flex-col gap-4", className.value)}>{readSlot(_slots.default)}</div>;
  };
});
export const ToolbarRow = defineUi<{
  children: UI.VueNode;
  className?: string;
}>("ToolbarRow", ["class"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  return () => {
    return <div class={cx("flex flex-wrap items-end gap-x-6 gap-y-3", className.value)}>{readSlot(_slots.default)}</div>;
  };
});
