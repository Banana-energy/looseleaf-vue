// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
import { Command as CommandPrimitive, defaultFilter, useCommandState } from "@/lib/command-primitive";
import { Button } from "@/components/ui/button";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandLoading, CommandSeparator, useFreshActiveDescendant } from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFormReset } from "@/hooks/use-form-reset";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { chipToneList, comboboxChipRecipe, comboboxChipsRecipe, comboboxTriggerRecipe, type ChipTone } from "@/lib/ink/recipes/combobox-ink";
import { cn } from "@/lib/utils";
type ComboboxItemData = string | {
  value: string;
  label?: string;
  disabled?: boolean;
  keywords?: string[];
};
interface NormalItem {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: string[];
}
const normalize = (items: readonly ComboboxItemData[] | undefined): NormalItem[] => (items ?? []).map(i => typeof i === "string" ? {
  value: i,
  label: i
} : {
  value: i.value,
  label: i.label ?? i.value,
  disabled: i.disabled,
  keywords: i.keywords
});
type FieldMode = null | "single" | "chips";
interface ComboboxContextValue {
  multiple: boolean;
  value: string[];
  select: (value: string) => void;
  remove: (value: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  dirty: boolean;
  setDirty: (d: boolean) => void;
  items: NormalItem[];
  labelFor: (value: string) => string;
  register: (value: string, label: string) => void;
  hasItem: (text: string) => boolean;
  loading: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  required: boolean;
  label?: string;
  fieldMode: FieldMode;
  setFieldMode: (m: FieldMode) => void;
  anchorRef: UI.RefObject<HTMLElement | null>;
  inputRef: UI.RefObject<HTMLInputElement | null>;
  triggerRef: UI.RefObject<HTMLElement | null>;
}
const ComboboxContext = createContext<ComboboxContextValue | null>(null);
const InContentContext = createContext(false);
function useCombobox(): ComputedRef<ComboboxContextValue> {
  const ctx = useContext(ComboboxContext);
  return computed(() => {
    if (!ctx.value) console.error("Combobox parts must be used inside <Combobox>");
    return ctx.value;
  });
}
function useControllable<T>(_source0: MaybeRefOrGetter<object>, _source1: MaybeRefOrGetter<string>, _source2: MaybeRefOrGetter<T>, _source3?: MaybeRefOrGetter<(v: T) => void>): ComputedRef<[T, (v: T) => void, () => void]> {
  const props = computed(() => toValue(_source0));
  const key = computed(() => toValue(_source1));
  const defaultValue = computed(() => toValue(_source2));
  const onChange = computed(() => toValue(_source3));
  const controlled = computed(() => key.value in props.value);
  const inner = shallowRef<T>(initialState(defaultValue.value));
  const setInner = stateSetter(inner);
  const value = computed(() => controlled.value ? (props.value as Record<string, T>)[key.value] : inner.value);
  const set = (v: T) => {
    if (!controlled.value) setInner(v);
    onChange.value?.(v);
  };
  const reset = computed(() => () => {
    if (!controlled.value) setInner(defaultValue.value);
  });
  return computed(() => {
    return [value.value, set, reset.value];
  });
}
interface ComboboxBaseProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  items?: readonly ComboboxItemData[];
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  filter?: UI.ComponentProps<typeof CommandPrimitive>["filter"];
  shouldFilter?: boolean;
  loop?: boolean;
  loading?: boolean;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  label?: string;
  announce?: false | ((change: {
    added: string[];
    removed: string[];
  }) => string);
  children?: UI.ReactNode;
}
type ComboboxSingleProps = {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};
type ComboboxMultiProps = {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};
type ComboboxProps = ComboboxBaseProps & (ComboboxSingleProps | ComboboxMultiProps);
const Combobox = defineUi<ComboboxProps>("Combobox", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  // 依赖注册项刷新视图的计数器必须先初始化，后续 computed 才能安全读取它。
  const _state37 = shallowRef(initialState(0));
  const multiple = computed(() => {
    void _state37.value;
    return props.multiple === undefined ? false : props.multiple;
  });
  const itemsProp = computed(() => {
    void _state37.value;
    return props.items;
  });
  const name = computed(() => {
    void _state37.value;
    return props.name;
  });
  const disabled = computed(() => {
    void _state37.value;
    return props.disabled === undefined ? false : props.disabled;
  });
  const readOnly = computed(() => {
    void _state37.value;
    return props.readOnly === undefined ? false : props.readOnly;
  });
  const required = computed(() => {
    void _state37.value;
    return props.required === undefined ? false : props.required;
  });
  const invalid = computed(() => {
    void _state37.value;
    return props.invalid === undefined ? false : props.invalid;
  });
  const loading = computed(() => {
    void _state37.value;
    return props.loading === undefined ? false : props.loading;
  });
  const label = computed(() => {
    void _state37.value;
    return props.label;
  });
  const announce = computed(() => {
    void _state37.value;
    return props.announce;
  });
  const filter = computed(() => {
    void _state37.value;
    return props.filter;
  });
  const shouldFilter = computed(() => {
    void _state37.value;
    return props.shouldFilter;
  });
  const loop = computed(() => {
    void _state37.value;
    return props.loop;
  });
  const children = renderValue(() => readSlot(_slots.default));
  const openProp = computed(() => {
    void _state37.value;
    return props.open;
  });
  const defaultOpen = computed(() => {
    void _state37.value;
    return props.defaultOpen;
  });
  const onOpenChange = computed(() => {
    void _state37.value;
    return props.onOpenChange;
  });
  const _hook18 = useControllable<string | string[] | null | undefined>(() => props, () => "value", () => props.defaultValue as string | string[] | null | undefined ?? (multiple.value ? [] : null), () => props.onValueChange as ((v: string | string[] | null | undefined) => void) | undefined);
  const raw = computed(() => {
    void _state37.value;
    return _hook18.value[0];
  });
  const setRaw = computed(() => {
    void _state37.value;
    return _hook18.value[1];
  });
  const resetRaw = computed(() => {
    void _state37.value;
    return _hook18.value[2];
  });
  const value = computed<string[]>(() => {
    void _state37.value;
    return multiple.value ? raw.value as string[] | undefined ?? [] : raw.value ? [raw.value as string] : [];
  });
  const controlledOpen = computed(() => {
    void _state37.value;
    return openProp.value !== undefined;
  });
  const innerOpen = shallowRef(initialState(defaultOpen.value ?? false));
  const setInnerOpen = stateSetter(innerOpen);
  const open = computed(() => {
    void _state37.value;
    return openProp.value !== undefined ? openProp.value : innerOpen.value;
  });
  const _hook27 = useControllable<string>(() => props, () => "inputValue", () => props.defaultInputValue ?? "", () => props.onInputValueChange);
  const query = computed(() => {
    void _state37.value;
    return _hook27.value[0];
  });
  const setQuery = computed(() => {
    void _state37.value;
    return _hook27.value[1];
  });
  const resetQuery = computed(() => {
    void _state37.value;
    return _hook27.value[2];
  });
  const dirty = shallowRef(initialState(false));
  const setDirty = stateSetter(dirty);
  const setOpen = (next: boolean) => {
    if (next && readOnly.value) return;
    if (!controlledOpen.value) setInnerOpen(next);
    onOpenChange.value?.(next);
    if (!next) {
      setQuery.value("");
      setDirty(false);
    }
  };
  const items = computed(() => {
    void _state37.value;
    return normalize(itemsProp.value);
  });
  const itemMap = computed(() => {
    void _state37.value;
    return new Map(items.value.map(i => [i.value, i]));
  });
  const seen = shallowRef(new Map<string, string>());
  const bump = stateSetter(_state37);
  const register = (v: string, l: string) => {
    if (seen.value.get(v) === l) return;
    seen.value.set(v, l);
    bump(n => n + 1);
  };
  const labelFor = (v: string) => itemMap.value.get(v)?.label ?? seen.value.get(v) ?? v;
  const hasItem = (text: string) => {
    const t = text.trim().toLowerCase();
    if (!t) return false;
    for (const i of items.value) if (i.value.toLowerCase() === t || i.label.toLowerCase() === t) return true;
    for (const [v, l] of seen.value) if (v.toLowerCase() === t || l.toLowerCase() === t) return true;
    return false;
  };
  const select = (v: string) => {
    if (readOnly.value) return;
    if (multiple.value) {
      setRaw.value(value.value.includes(v) ? value.value.filter(x => x !== v) : [...value.value, v]);
      setQuery.value("");
      setDirty(false);
    } else {
      setRaw.value(v);
      setOpen(false);
    }
  };
  const remove = (v: string) => readOnly.value ? undefined : setRaw.value(multiple.value ? value.value.filter(x => x !== v) : null);
  const clear = () => {
    if (readOnly.value) return;
    setRaw.value(multiple.value ? [] : null);
    setQuery.value("");
    setDirty(false);
  };
  const fieldMode = shallowRef<FieldMode>(initialState(null));
  const setFieldMode = stateSetter(fieldMode);
  const anchorRef = shallowRef<HTMLElement | null | null>(null);
  const inputRef = shallowRef<HTMLInputElement | null | null>(null);
  const triggerRef = shallowRef<HTMLElement | null | null>(null);
  const dirtyRef = shallowRef(dirty.value);
  useFormReset(() => () => inputRef.value ?? triggerRef.value ?? anchorRef.value, () => () => {
    resetRaw.value();
    resetQuery.value();
    setDirty(false);
  });
  const previous = shallowRef(value.value);
  const said = shallowRef(initialState(""));
  const setSaid = stateSetter(said);
  watchDependencies(() => {
    const before = previous.value;
    previous.value = value.value;
    if (!multiple.value || announce.value === false) return;
    const added = value.value.filter(v => !before.includes(v)).map(labelFor);
    const removed = before.filter(v => !value.value.includes(v)).map(labelFor);
    if (added.length === 0 && removed.length === 0) return;
    setSaid(announce.value ? announce.value({
      added,
      removed
    }) : [added.length ? `${added.join(", ")} selected` : "" as const, removed.length ? `${removed.join(", ")} removed` : "" as const].filter(Boolean).join(". "));
  }, () => [value.value, multiple.value, announce.value, labelFor], false);
  const ctx = computed<ComboboxContextValue>(() => {
    void _state37.value;
    return {
      multiple: multiple.value,
      value: value.value,
      select,
      remove,
      clear,
      open: open.value,
      setOpen,
      query: query.value,
      setQuery: setQuery.value,
      dirty: dirty.value,
      setDirty,
      items: items.value,
      labelFor,
      register,
      hasItem,
      loading: loading.value,
      disabled: disabled.value,
      readOnly: readOnly.value,
      invalid: invalid.value,
      required: required.value,
      label: label.value,
      fieldMode: fieldMode.value,
      setFieldMode,
      anchorRef,
      inputRef,
      triggerRef
    };
  });
  const cmdkFilter = (v, search, keywords) => fieldMode.value === "single" && !dirtyRef.value ? 1 : (filter.value ?? defaultFilter)(v, search, keywords);
  return () => {
    dirtyRef.value = dirty.value;
    return <ComboboxContext.Provider value={ctx.value}>
      <Popover open={open.value} onOpenChange={setOpen}>
        <CommandPrimitive data-slot="combobox" class="contents" label={label.value} filter={cmdkFilter} shouldFilter={shouldFilter.value} loop={loop.value}>
          {readSlot(_slots.default)}
        </CommandPrimitive>
      </Popover>
      {name.value && value.value.length === 0 ? <input type="hidden" name={name.value} value="" /> : null}
      {name.value ? value.value.map(v => <input key={v} type="hidden" name={name.value} value={v} />) : null}
      {required.value && !disabled.value && value.value.length === 0 ? <input data-slot="combobox-required" tabindex={-1} aria-hidden="true" required value="" onChange={() => {}} onFocus={() => (inputRef.value ?? triggerRef.value)?.focus()} class="pointer-events-none absolute size-px overflow-hidden opacity-0" /> : null}
      {multiple.value && announce.value !== false ? <span data-slot="combobox-status" role="status" aria-live="polite" class="sr-only">
          {said.value}
        </span> : null}
    </ComboboxContext.Provider>;
  };
});
const TRIGGER = "group/combobox-trigger relative isolate flex h-9 w-full items-center justify-between gap-2 ps-3 pe-2 text-start font-hand text-base whitespace-nowrap text-(--ll-input-ink) compact:h-8 calm:h-7 calm:text-[15px] disabled:cursor-not-allowed disabled:text-pencil-text forced-colors:aria-invalid:underline forced-colors:aria-invalid:decoration-wavy [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(.absolute):not([class*='size-'])]:size-4";
const ComboboxTrigger = defineUi<UI.ComponentProps<"button"> & {
  seed?: string | number;
}>("ComboboxTrigger", ["class", "seed", "onKeydown", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const disabledProp = computed(() => _props["disabled"]);
  const props = computed(() => omitProps(_props, ["class", "children", "seed", "ref", "onKeydown", "disabled"]));
  const ctx = useCombobox();
  const disabled = computed(() => ctx.value.disabled || !!disabledProp.value);
  const invalid = computed(() => ctx.value.invalid || props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true");
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: comboboxTriggerRecipe,
    params: {
      disabled: disabled.value,
      invalid: invalid.value && !disabled.value
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <PopoverTrigger asChild>
      <button type="button" role="combobox" aria-expanded={ctx.value.open} aria-required={ctx.value.required || undefined} aria-readonly={ctx.value.readOnly || undefined} aria-invalid={invalid.value || undefined} data-slot="combobox-trigger" disabled={disabled.value} ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value, ctx.value.triggerRef as UI.Ref<HTMLButtonElement>)} {...domProps(hostProps.value)} onKeydown={(e: KeyboardEvent) => {
        onKeydown.value?.(e);
        if (!e.defaultPrevented && !disabled.value && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault();
          ctx.value.setOpen(true);
        }
        e.stopPropagation();
      }} class={cn(TRIGGER, className.value)} {...domProps(props.value)}>
        {node.value}
        {readSlot(_slots.default) ?? <ComboboxValue />}
        <Icon name="chevrons-up-down" size={16} data-slot="combobox-trigger-icon" class="text-ink-soft group-disabled/combobox-trigger:text-pencil-text" />
      </button>
    </PopoverTrigger>;
  };
});
const ComboboxValue = defineUi<Omit<UI.ComponentProps<"span">, "children"> & {
  placeholder?: UI.ReactNode;
  children?: (value: string | string[] | null, labelFor: (value: string) => string) => UI.ReactNode;
}>("ComboboxValue", ["placeholder", "class"], (_props, {
  slots: _slots
}) => {
  const placeholder = computed(() => _props["placeholder"]);
  const children = computed(() => _slots.default);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["placeholder", "children", "class"]));
  const ctx = useCombobox();
  return () => {
    if (_slots.default) return <>{_slots.default(ctx.value.multiple ? ctx.value.value : ctx.value.value[0] ?? null, ctx.value.labelFor)}</>;
    const text = ctx.value.value.map(ctx.value.labelFor).join(", ");
    return <span data-slot="combobox-value" data-placeholder={text ? undefined : "" as const} class={cn("min-w-0 flex-1 truncate", !text && "text-(--ll-placeholder)", className.value)} {...domProps(props.value)}>
      {text || placeholder.value}
    </span>;
  };
});
const ComboboxContent = defineUi<UI.ComponentProps<typeof PopoverContent> & {
  anchor?: UI.RefObject<Element | null>;
}>("ComboboxContent", ["class", "align", "sideOffset", "anchor", "onOpenAutoFocus", "onInteractOutside", "onFocusOutside", "onMousedown"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const align = computed(() => _props["align"] === undefined ? "start" as const : _props["align"]);
  const sideOffset = computed(() => _props["sideOffset"] === undefined ? 6 : _props["sideOffset"]);
  const anchor = computed(() => _props["anchor"]);
  const children = renderValue(() => readSlot(_slots.default));
  const onOpenAutoFocus = computed(() => _props["onOpenAutoFocus"]);
  const onInteractOutside = computed(() => _props["onInteractOutside"]);
  const onFocusOutside = computed(() => _props["onFocusOutside"]);
  const onMousedown = computed(() => _props["onMousedown"]);
  const props = computed(() => omitProps(_props, ["class", "align", "sideOffset", "anchor", "children", "onOpenAutoFocus", "onInteractOutside", "onFocusOutside", "onMousedown"]));
  const ctx = useCombobox();
  const inField = computed(() => ctx.value.fieldMode !== null);
  const inAnchor = computed(() => (target: EventTarget | null): boolean => !!ctx.value.anchorRef.value && target instanceof Node && ctx.value.anchorRef.value.contains(target));
  return () => {
    return <>
      {anchor.value ? <PopoverAnchor virtualRef={anchor.value as UI.RefObject<{
        getBoundingClientRect(): DOMRect;
      }>} /> : null}
      <PopoverContent aria-label={ctx.value.label ?? "Options"} align={align.value} sideOffset={sideOffset.value} tilt={false} onOpenAutoFocus={e => {
        if (inField.value) e.preventDefault();
        onOpenAutoFocus.value?.(e);
      }} onInteractOutside={e => {
        onInteractOutside.value?.(e);
        if (inField.value && inAnchor.value(e.target)) e.preventDefault();
      }} onFocusOutside={e => {
        onFocusOutside.value?.(e);
        if (inField.value && inAnchor.value(e.target)) e.preventDefault();
      }} onMousedown={e => {
        onMousedown.value?.(e);
        if (!e.defaultPrevented && !(e.target instanceof HTMLInputElement)) e.preventDefault();
      }} class={cn("w-(--reka-popover-trigger-width) max-w-[calc(100vw-1rem)] min-w-52 p-0", className.value)} {...domProps(props.value)}>
        <div data-slot="combobox-content" class="flex flex-col">
          <InContentContext.Provider value>{readSlot(_slots.default)}</InContentContext.Provider>
        </div>
      </PopoverContent>
    </>;
  };
});
function useComboboxAnchor() {
  const _nestedHook0 = shallowRef<HTMLDivElement | null | null>(null);
  return computed(() => {
    return _nestedHook0;
  });
}
const ComboboxList = defineUi<Omit<UI.ComponentProps<typeof CommandList>, "children"> & {
  children?: UI.ReactNode | ((item: NormalItem) => UI.ReactNode);
}>("ComboboxList", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = computed(() => _slots.default);
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const ctx = useCombobox();
  return () => {
    return <CommandList data-slot="combobox-list" label={ctx.value.label} class={cn("max-h-[min(20rem,var(--reka-popover-content-available-height))]", className.value)} {...domProps(props.value)}>
      {typeof _slots.default === "function" ? ctx.value.items.map(_slots.default) : _slots.default}
    </CommandList>;
  };
});
const ComboboxCollection = defineUi<{
  items?: readonly ComboboxItemData[];
  children?: UI.ReactNode | ((item: NormalItem, index: number) => UI.ReactNode);
}>("ComboboxCollection", ["items"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  const children = computed(() => _slots.default);
  const ctx = useCombobox();
  const list = computed(() => items.value ? normalize(items.value) : ctx.value.items);
  return () => {
    return <>{typeof _slots.default === "function" ? list.value.map(_slots.default) : _slots.default}</>;
  };
});
const ComboboxItem = defineUi<Omit<UI.ComponentProps<typeof CommandItem>, "value" | "keywords"> & {
  value: string;
  label?: string;
  keywords?: string[];
}>("ComboboxItem", ["class", "value", "label", "keywords", "onSelect"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const value = computed(() => _props["value"]);
  const label = computed(() => _props["label"]);
  const children = renderValue(() => readSlot(_slots.default));
  const keywords = computed(() => _props["keywords"]);
  const onSelect = computed(() => _props["onSelect"]);
  const props = computed(() => omitProps(_props, ["class", "value", "label", "children", "keywords", "onSelect"]));
  const ctx = useCombobox();
  const text = computed(() => label.value ?? (typeof children.value === "string" ? children.value : ctx.value.items.find(i => i.value === value.value)?.label ?? value.value));
  const register = computed(() => ctx.value.register);
  watchDependencies(() => register.value(value.value, text.value), () => [register.value, value.value, text.value], false);
  const chosen = computed(() => ctx.value.value.includes(value.value));
  return () => {
    return <CommandItem data-slot="combobox-item" data-checked={chosen.value ? "true" as const : undefined} value={value.value} keywords={[text.value, ...(keywords.value ?? [])]} onSelect={v => {
      onSelect.value?.(v);
      ctx.value.select(value.value);
    }} class={cn("pe-8", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? text.value}
      {chosen.value && <>
          <span class="sr-only">, selected</span>
          <span data-slot="combobox-item-indicator" aria-hidden="true" class="pointer-events-none absolute end-2 grid size-4 place-items-center">
            <Icon name="check" size={16} class="text-ink-you forced-colors:text-[CanvasText]" />
          </span>
        </>}
    </CommandItem>;
  };
});
const ComboboxGroup = defineUi<UI.ComponentProps<typeof CommandGroup>>("ComboboxGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <CommandGroup data-slot="combobox-group" class={className.value} {...domProps(props.value)}>{_slots.default?.()}</CommandGroup>;
  };
});
const ComboboxLabel = defineUi<UI.ComponentProps<"div">>("ComboboxLabel", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="combobox-label" role="presentation" class={cn("px-2 py-1.5 font-type text-xs text-ink-muted", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const ComboboxSeparator = defineUi<UI.ComponentProps<typeof CommandSeparator>>("ComboboxSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <CommandSeparator data-slot="combobox-separator" class={className.value} {...domProps(props.value)}>{_slots.default?.()}</CommandSeparator>;
  };
});
const ComboboxEmpty = defineUi<UI.ComponentProps<typeof CommandEmpty>>("ComboboxEmpty", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const ctx = useCombobox();
  return () => {
    if (ctx.value.loading) return null;
    return <CommandEmpty data-slot="combobox-empty" class={className.value} {...domProps(props.value)}>{_slots.default?.()}</CommandEmpty>;
  };
});
const ComboboxLoading = defineUi<UI.ComponentProps<typeof CommandLoading>>("ComboboxLoading", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <CommandLoading data-slot="combobox-loading" class={className.value} {...domProps(props.value)}>{_slots.default?.()}</CommandLoading>;
  };
});
const ComboboxCreate = defineUi<Omit<UI.ComponentProps<typeof CommandItem>, "children" | "value" | "onSelect"> & {
  onCreate?: (text: string) => void;
  children?: UI.ReactNode | ((text: string) => UI.ReactNode);
}>("ComboboxCreate", ["class", "onCreate"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = computed(() => _slots.default);
  const onCreate = computed(() => _props["onCreate"]);
  const props = computed(() => omitProps(_props, ["class", "children", "onCreate"]));
  const ctx = useCombobox();
  const _nestedHook0 = useCommandState(() => s => s.search);
  const search = computed(() => _nestedHook0.value as string);
  const text = computed(() => search.value.trim());
  return () => {
    if (!text.value || ctx.value.hasItem(text.value) || ctx.value.fieldMode === "single" && !ctx.value.dirty) return null;
    return <CommandItem forceMount data-slot="combobox-create" value={`__create__${text.value}`} onSelect={() => {
      onCreate.value?.(text.value);
      ctx.value.select(text.value);
    }} class={cn("text-ink-you", className.value)} {...domProps(props.value)}>
      <Icon name="plus" />
      {typeof _slots.default === "function" ? _slots.default(text.value) : _slots.default ?? `Create "${text.value}"`}
    </CommandItem>;
  };
});
const FIELD_INPUT = "h-full min-w-0 flex-1 bg-transparent px-3 py-1 font-hand text-base text-(--ll-input-ink) caret-(--ll-caret) outline-hidden placeholder:text-(--ll-placeholder) disabled:cursor-not-allowed disabled:text-pencil-text calm:text-[15px]";
function useExpandedAttr(_source0: MaybeRefOrGetter<UI.RefObject<HTMLInputElement | null>>, _source1: MaybeRefOrGetter<boolean>) {
  const input = computed(() => toValue(_source0));
  const open = computed(() => toValue(_source1));
  watchDependencies(() => {
    input.value.value?.setAttribute("aria-expanded", String(open.value));
  }, () => [input.value, open.value], false);
  return computed(() => {});
}
function useCallerId(_source0: MaybeRefOrGetter<UI.RefObject<HTMLInputElement | null>>, _source1: MaybeRefOrGetter<string | undefined>) {
  const input = computed(() => toValue(_source0));
  const id = computed(() => toValue(_source1));
  watchDependencies(() => {
    const el = input.value.value;
    if (!id.value || !el || el.id === id.value) return;
    const own = Array.from(el.ownerDocument.querySelectorAll("label[cmdk-label]")).find(l => l.getAttribute("for") === el.id);
    own?.setAttribute("for", id.value);
    el.id = id.value;
  }, () => [input.value, id.value], false);
  return computed(() => {});
}
const ComboboxInput = defineUi<UI.ComponentProps<typeof CommandInput> & {
  showTrigger?: boolean;
  showClear?: boolean;
}>("ComboboxInput", ["class", "showTrigger", "showClear"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const showTrigger = computed(() => _props["showTrigger"] === undefined ? true : _props["showTrigger"]);
  const showClear = computed(() => _props["showClear"] === undefined ? false : _props["showClear"]);
  const props = computed(() => omitProps(_props, ["class", "showTrigger", "showClear"]));
  const inContent = useContext(InContentContext);
  return () => {
    return inContent.value ? <ComboboxSearch class={className.value} {...domProps(props.value)}>{_slots.default?.()}</ComboboxSearch> : <ComboboxField class={className.value} showTrigger={showTrigger.value} showClear={showClear.value} {...domProps(props.value)}>{_slots.default?.()}</ComboboxField>;
  };
});
const ComboboxSearch = defineUi<UI.ComponentProps<typeof CommandInput>>("ComboboxSearch", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const ctx = useCombobox();
  return () => {
    return <CommandInput data-slot="combobox-input" value={ctx.value.query} onValueChange={ctx.value.setQuery} class={className.value} {...domProps(props.value)}>{_slots.default?.()}</CommandInput>;
  };
});
const ComboboxField = defineUi<UI.ComponentProps<typeof CommandInput> & {
  showTrigger: boolean;
  showClear: boolean;
}>("ComboboxField", ["class", "showTrigger", "showClear", "seed", "wrapperClassName", "onKeydown"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const showTrigger = computed(() => _props["showTrigger"]);
  const showClear = computed(() => _props["showClear"]);
  const seed = computed(() => _props["seed"]);
  const wrapperClassName = computed(() => _props["wrapperClassName"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const props = computed(() => omitProps(_props, ["class", "showTrigger", "showClear", "seed", "wrapperClassName", "onKeydown"]));
  const ctx = useCombobox();
  const setFieldMode = computed(() => ctx.value.setFieldMode);
  const anchorRef = computed(() => ctx.value.anchorRef);
  const inputRef = computed(() => ctx.value.inputRef);
  watchDependencies(() => {
    setFieldMode.value("single");
    return () => setFieldMode.value(null);
  }, () => [setFieldMode.value], false);
  useExpandedAttr(() => inputRef.value, () => ctx.value.open);
  useFreshActiveDescendant(() => inputRef.value);
  useCallerId(() => inputRef.value, () => props.value.id);
  const invalid = computed(() => ctx.value.invalid);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: comboboxTriggerRecipe,
    params: {
      disabled: ctx.value.disabled,
      invalid: invalid.value && !ctx.value.disabled
    },
    kind: "field" as const,
    seed: seed.value as string | number | undefined,
    still: true
  }));
  const shown = computed(() => ctx.value.dirty ? ctx.value.query : ctx.value.value[0] ? ctx.value.labelFor(ctx.value.value[0]) : "" as const);
  return () => {
    return <PopoverAnchor asChild>
      <div data-slot="combobox-input-frame" data-state={ctx.value.open ? "open" as const : "closed" as const} data-ink-focus="within" ref={useMergedRef<HTMLElement>(hostRef, anchorRef.value)} {...domProps(hostProps.value)} onClick={() => {
        if (!ctx.value.disabled) inputRef.value.value?.focus();
      }} class={cn("relative isolate flex h-9 w-full items-center compact:h-8 calm:h-7", wrapperClassName.value)}>
        {node.value}
        <CommandPrimitive.Input data-slot="combobox-input" ref={inputRef.value} value={shown.value} onValueChange={v => {
          ctx.value.setQuery(v);
          ctx.value.setDirty(true);
          ctx.value.setOpen(true);
        }} disabled={ctx.value.disabled} readOnly={ctx.value.readOnly} aria-invalid={invalid.value || undefined} aria-required={ctx.value.required || undefined} onKeydown={e => {
          onKeydown.value?.(e);
          if (!ctx.value.open && !ctx.value.disabled && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            ctx.value.setOpen(true);
          }
        }} class={cn(FIELD_INPUT, showClear.value && "pe-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</CommandPrimitive.Input>
        {showClear.value && <ComboboxClear />}
        {showTrigger.value && <button type="button" tabindex={-1} aria-label="Toggle options" data-slot="combobox-trigger" disabled={ctx.value.disabled || ctx.value.readOnly} onClick={(e: PointerEvent) => {
          e.stopPropagation();
          ctx.value.setOpen(!ctx.value.open);
          inputRef.value.value?.focus();
        }} onKeydown={(e: KeyboardEvent) => e.stopPropagation()} class="me-0.5 grid size-7 shrink-0 place-items-center text-ink-soft disabled:text-pencil-text">
            <Icon name="chevrons-up-down" size={16} />
          </button>}
      </div>
    </PopoverAnchor>;
  };
});
const ComboboxClear = defineUi<UI.ComponentProps<typeof Button>>("ComboboxClear", ["class", "onClick", "onKeydown"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onClick = computed(() => _props["onClick"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const props = computed(() => omitProps(_props, ["class", "onClick", "onKeydown"]));
  const ctx = useCombobox();
  return () => {
    if (ctx.value.value.length === 0 || ctx.value.disabled || ctx.value.readOnly) return null;
    return <Button type="button" variant="ghost" size="icon-xs" aria-label="Clear" data-slot="combobox-clear" tabindex={-1} onClick={e => {
      onClick.value?.(e);
      e.stopPropagation();
      ctx.value.clear();
      ctx.value.inputRef.value?.focus();
    }} onKeydown={e => {
      onKeydown.value?.(e);
      e.stopPropagation();
    }} class={cn("me-0.5 shrink-0", className.value)} {...domProps(props.value)}>
      <Icon name="x" />
    </Button>;
  };
});
const toneOf = (value: string): ChipTone => {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = h * 31 + value.charCodeAt(i) >>> 0;
  return chipToneList[h % chipToneList.length];
};
const ComboboxChips = defineUi<UI.ComponentProps<"div"> & {
  renderChip?: (value: string, label: string) => UI.ReactNode;
  tone?: ChipTone | "auto";
  seed?: string | number;
}>("ComboboxChips", ["class", "renderChip", "tone", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const renderChip = computed(() => _props["renderChip"]);
  const tone = computed(() => _props["tone"] === undefined ? "hi" as const : _props["tone"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "renderChip", "tone", "seed", "ref"]));
  const ctx = useCombobox();
  const setFieldMode = computed(() => ctx.value.setFieldMode);
  const anchorRef = computed(() => ctx.value.anchorRef);
  const inputRef = computed(() => ctx.value.inputRef);
  watchDependencies(() => {
    setFieldMode.value("chips");
    return () => setFieldMode.value(null);
  }, () => [setFieldMode.value], false);
  useExpandedAttr(() => inputRef.value, () => ctx.value.open);
  useFreshActiveDescendant(() => inputRef.value);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: comboboxChipsRecipe,
    params: {
      disabled: ctx.value.disabled,
      invalid: ctx.value.invalid && !ctx.value.disabled
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <PopoverAnchor asChild>
      <div data-slot="combobox-chips" data-state={ctx.value.open ? "open" as const : "closed" as const} data-ink-focus="within" data-disabled={ctx.value.disabled ? "" as const : undefined} ref={useMergedRef<HTMLDivElement>(hostRef, anchorRef.value as UI.Ref<HTMLDivElement>, ref.value)} {...domProps(hostProps.value)} onClick={(e: PointerEvent) => {
        props.value.onClick?.(e);
        if (!ctx.value.disabled && !(e.target as Element).closest("button")) inputRef.value.value?.focus();
      }} class={cn("relative isolate flex min-h-9 w-full flex-wrap items-center gap-1.5 px-2 py-1 font-hand text-base compact:min-h-8 calm:gap-1 calm:py-0.5", className.value)} {...domProps(props.value)}>
        {node.value}
        {ctx.value.value.map(v => renderChip.value ? <Fragment key={v}>{renderChip.value(v, ctx.value.labelFor(v))}</Fragment> : <ComboboxChip key={v} value={v} tone={tone.value === "auto" ? toneOf(v) : tone.value}>
              {ctx.value.labelFor(v)}
            </ComboboxChip>)}
        {readSlot(_slots.default) ?? <ComboboxChipsInput />}
      </div>
    </PopoverAnchor>;
  };
});
const ComboboxChip = defineUi<UI.ComponentProps<"span"> & {
  value?: string;
  tone?: ChipTone;
  showRemove?: boolean;
  seed?: string | number;
  removeLabel?: string;
}>("ComboboxChip", ["class", "value", "tone", "showRemove", "seed", "removeLabel"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const value = computed(() => _props["value"]);
  const tone = computed(() => _props["tone"] === undefined ? "hi" as const : _props["tone"]);
  const showRemove = computed(() => _props["showRemove"] === undefined ? true : _props["showRemove"]);
  const seed = computed(() => _props["seed"]);
  const removeLabel = computed(() => _props["removeLabel"]);
  const props = computed(() => omitProps(_props, ["class", "children", "value", "tone", "showRemove", "seed", "removeLabel"]));
  const ctx = useCombobox();
  const key = computed(() => value.value ?? (typeof children.value === "string" ? children.value : "" as const));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: comboboxChipRecipe,
    params: {
      tone: tone.value,
      disabled: ctx.value.disabled
    },
    kind: "chip" as const,
    seed: seed.value ?? `chip|${key.value}`,
    still: true
  }));
  const label = computed(() => typeof children.value === "string" ? children.value : ctx.value.labelFor(key.value));
  return () => {
    return <span data-slot="combobox-chip" data-value={key.value} ref={hostRef} {...domProps(hostProps.value)} class={cn("relative isolate inline-flex h-7 w-fit max-w-full items-center gap-0.5 ps-5 pe-0.5 text-sm font-bold whitespace-nowrap text-ink calm:h-6 calm:ps-4", ctx.value.disabled && "text-pencil-text", className.value)} {...domProps(props.value)}>
      {node.value}
      <span class="min-w-0 truncate">{readSlot(_slots.default)}</span>
      {showRemove.value && <button type="button" aria-label={removeLabel.value ?? `Remove ${label.value}`} data-slot="combobox-chip-remove" disabled={ctx.value.disabled || ctx.value.readOnly} onClick={(e: PointerEvent) => {
        e.stopPropagation();
        ctx.value.remove(key.value);
        ctx.value.inputRef.value?.focus();
      }} onKeydown={(e: KeyboardEvent) => e.stopPropagation()} class="grid size-6 shrink-0 cursor-default place-items-center text-ink-soft outline-hidden hover:ll-swipe hover:text-ink focus-visible:ll-swipe focus-visible:text-ink focus-visible:[outline:2px_solid_var(--ll-focus)] focus-visible:outline-offset-[-2px] disabled:pointer-events-none disabled:text-pencil-text">
          <Icon name="x" size={12} />
        </button>}
    </span>;
  };
});
const ComboboxChipsInput = defineUi<UI.ComponentProps<typeof CommandPrimitive.Input>>("ComboboxChipsInput", ["class", "onKeydown"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const props = computed(() => omitProps(_props, ["class", "onKeydown"]));
  const ctx = useCombobox();
  useCallerId(() => ctx.value.inputRef, () => props.value.id);
  return () => {
    return <CommandPrimitive.Input data-slot="combobox-chip-input" ref={ctx.value.inputRef} value={ctx.value.query} onValueChange={v => {
      ctx.value.setQuery(v);
      ctx.value.setOpen(true);
    }} disabled={ctx.value.disabled} readOnly={ctx.value.readOnly} aria-required={ctx.value.required || undefined} onKeydown={e => {
      onKeydown.value?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "Backspace" && ctx.value.query === "" && ctx.value.value.length > 0) ctx.value.remove(ctx.value.value[ctx.value.value.length - 1]);else if (!ctx.value.open && !ctx.value.disabled && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        ctx.value.setOpen(true);
      }
    }} class={cn("h-7 min-w-16 flex-1 bg-transparent px-1 font-hand text-base text-(--ll-input-ink) caret-(--ll-caret) outline-hidden placeholder:text-(--ll-placeholder) disabled:cursor-not-allowed calm:h-6 calm:text-[15px]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</CommandPrimitive.Input>;
  };
});
export { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent, ComboboxInput, ComboboxList, ComboboxCollection, ComboboxItem, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxEmpty, ComboboxLoading, ComboboxCreate, ComboboxClear, ComboboxChips, ComboboxChip, ComboboxChipsInput, useComboboxAnchor, useCombobox };
export type { ComboboxItemData, ComboboxProps };
