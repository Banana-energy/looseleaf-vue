// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef, useId } from "vue";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Mascot } from "@/components/ui/mascot";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEnsureInkDefs } from "@/lib/ink/vue";
import { categoryLabel, hasSticker, stickerCatalog, stickerFace, stickerLabel, type StickerCatalogEntry } from "@/lib/ink/recipes/sticker-ink";
import { cn } from "@/lib/utils";
type StickerPickerItem = StickerCatalogEntry;
type StickerPickerInput = string | {
  name: string;
  label?: string;
  category?: string;
  tags?: readonly string[];
};
function catalogFrom(list?: readonly StickerPickerInput[]): StickerPickerItem[] {
  const all = stickerCatalog();
  if (!list) return all;
  const known = new Map(all.map(e => [e.name, e]));
  return list.flatMap(entry => {
    const name = typeof entry === "string" ? entry : entry.name;
    const base = known.get(name) ?? (hasSticker(name) ? {
      name,
      label: stickerLabel(name),
      category: "stickers" as const,
      categoryLabel: "Stickers" as const,
      tags: []
    } : null);
    if (!base) return [];
    if (typeof entry === "string") return [base];
    const category = entry.category ?? base.category;
    return [{
      ...base,
      label: entry.label ?? base.label,
      category,
      categoryLabel: entry.category ? categoryLabel(entry.category) : base.categoryLabel,
      tags: [...base.tags, ...(entry.tags ?? [])]
    }];
  });
}
interface StickerPickerContextValue {
  catalog: readonly StickerPickerItem[];
  recent: readonly string[];
  value: string | null | undefined;
  choose(item: StickerPickerItem): void;
  uid: string;
}
const StickerPickerContext = createContext<StickerPickerContextValue | null>(null);
function useStickerPicker(): ComputedRef<StickerPickerContextValue> {
  const ctx = useContext(StickerPickerContext);
  return computed(() => {
    if (!ctx.value) console.error("Sticker picker parts must be used inside <StickerPicker>");
    return ctx.value;
  });
}
type StickerPickerProps = UI.ComponentProps<typeof Popover> & {
  onSelect?: (sticker: StickerPickerItem) => void;
  value?: string | null;
  stickers?: readonly StickerPickerInput[];
  recent?: readonly string[];
  closeOnSelect?: boolean;
};
const NO_RECENT: readonly string[] = [];
const StickerPicker = defineUi<StickerPickerProps>("StickerPicker", ["open", "defaultOpen", "onOpenChange", "onSelect", "value", "stickers", "recent", "closeOnSelect"], (_props, {
  slots: _slots
}) => {
  const openProp = computed(() => _props["open"]);
  const defaultOpen = computed(() => _props["defaultOpen"] === undefined ? false : _props["defaultOpen"]);
  const onOpenChange = computed(() => _props["onOpenChange"]);
  const onSelect = computed(() => _props["onSelect"]);
  const value = computed(() => _props["value"]);
  const stickers = computed(() => _props["stickers"]);
  const recent = computed(() => _props["recent"] === undefined ? NO_RECENT : _props["recent"]);
  const closeOnSelect = computed(() => _props["closeOnSelect"] === undefined ? true : _props["closeOnSelect"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["open", "defaultOpen", "onOpenChange", "onSelect", "value", "stickers", "recent", "closeOnSelect", "children"]));
  const inner = shallowRef(initialState(defaultOpen.value));
  const setInner = stateSetter(inner);
  const open = computed(() => openProp.value ?? inner.value);
  const setOpen = (next: boolean) => {
    if (openProp.value === undefined) setInner(next);
    onOpenChange.value?.(next);
  };
  const catalog = computed(() => catalogFrom(stickers.value));
  const _nestedHook0 = useId();
  const uid = computed(() => _nestedHook0.replace(/[^a-zA-Z0-9]/g, ""));
  const ctx = computed<StickerPickerContextValue>(() => ({
    catalog: catalog.value,
    recent: recent.value,
    value: value.value,
    uid: uid.value,
    choose(item) {
      onSelect.value?.(item);
      if (closeOnSelect.value) setOpen(false);
    }
  }));
  return () => {
    return <StickerPickerContext.Provider value={ctx.value}>
      <Popover data-slot="sticker-picker" open={open.value} onOpenChange={setOpen} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </Popover>
    </StickerPickerContext.Provider>;
  };
});
const StickerPickerTrigger = defineUi<UI.ComponentProps<typeof PopoverTrigger>>("StickerPickerTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <PopoverTrigger data-slot="sticker-picker-trigger" {...domProps(props.value)}>{_slots.default?.()}</PopoverTrigger>;
  };
});
interface Section {
  key: string;
  label: string;
  items: readonly StickerPickerItem[];
}
const matches = (e: StickerPickerItem, words: readonly string[]): boolean => {
  const hay = `${e.label} ${e.name} ${e.categoryLabel} ${e.tags.join(" ")}`.toLowerCase();
  return words.every(w => hay.includes(w));
};
function neighbour(sections: readonly Section[], at: {
  s: number;
  i: number;
}, key: string, cols: number): {
  s: number;
  i: number;
} | null {
  const last = sections.length - 1;
  if (key === "ArrowRight") return at.i < sections[at.s].items.length - 1 ? {
    s: at.s,
    i: at.i + 1
  } : at.s < last ? {
    s: at.s + 1,
    i: 0
  } : null;
  if (key === "ArrowLeft") return at.i > 0 ? {
    s: at.s,
    i: at.i - 1
  } : at.s > 0 ? {
    s: at.s - 1,
    i: sections[at.s - 1].items.length - 1
  } : null;
  const col = at.i % cols;
  if (key === "ArrowDown") {
    if (at.i + cols < sections[at.s].items.length) return {
      s: at.s,
      i: at.i + cols
    };
    return at.s < last ? {
      s: at.s + 1,
      i: Math.min(col, sections[at.s + 1].items.length - 1)
    } : null;
  }
  if (key === "ArrowUp") {
    if (at.i - cols >= 0) return {
      s: at.s,
      i: at.i - cols
    };
    if (at.s === 0) return null;
    const prev = sections[at.s - 1].items.length;
    const lastRow = Math.floor((prev - 1) / cols) * cols;
    return {
      s: at.s - 1,
      i: Math.min(lastRow + col, prev - 1)
    };
  }
  return null;
}
type StickerPickerContentProps = Omit<UI.ComponentProps<typeof PopoverContent>, "children"> & {
  columns?: number;
  size?: number;
  placeholder?: string;
};
const StickerPickerContent = defineUi<StickerPickerContentProps>("StickerPickerContent", ["class", "columns", "size", "placeholder"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const columns = computed(() => _props["columns"] === undefined ? 5 : _props["columns"]);
  const size = computed(() => _props["size"] === undefined ? 44 : _props["size"]);
  const placeholder = computed(() => _props["placeholder"] === undefined ? "Search stickers" as const : _props["placeholder"]);
  const props = computed(() => omitProps(_props, ["class", "columns", "size", "placeholder"]));
  useStickerPicker();
  const perRow = computed(() => Math.max(1, Math.floor(columns.value) || 1));
  return () => {
    return <PopoverContent data-slot="sticker-picker-content" aria-label="Stickers" align="start" class={cn("w-[min(23rem,calc(100vw-2rem))] p-3", className.value)} {...domProps(props.value)}>
      <PickerBody columns={perRow.value} size={size.value} placeholder={placeholder.value} />
    </PopoverContent>;
  };
});
const PickerBody = defineUi<{
  columns: number;
  size: number;
  placeholder: string;
}>("PickerBody", ["columns", "size", "placeholder"], (_props, {
  slots: _slots
}) => {
  const columns = computed(() => _props["columns"]);
  const size = computed(() => _props["size"]);
  const placeholder = computed(() => _props["placeholder"]);
  const picker = useStickerPicker();
  useEnsureInkDefs();
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const category = shallowRef(initialState("all"));
  const setCategory = stateSetter(category);
  const activeKey = shallowRef<string | null>(initialState(null));
  const setActiveKey = stateSetter(activeKey);
  const input = shallowRef<HTMLInputElement | null | null>(null);
  const list = shallowRef<HTMLDivElement | null | null>(null);
  const listId = computed(() => `sp-list-${picker.value.uid}`);
  const words = computed(() => query.value.trim().toLowerCase().split(/\s+/).filter(Boolean));
  const categories = computed(() => {
    const seen = new Map<string, string>();
    for (const e of picker.value.catalog) if (!seen.has(e.category)) seen.set(e.category, e.categoryLabel);
    return [...seen];
  });
  const everything = computed<Section[]>(() => {
    const byName = new Map(picker.value.catalog.map(e => [e.name, e]));
    const found = picker.value.catalog.filter(e => (category.value === "all" || e.category === category.value) && matches(e, words.value));
    if (words.value.length || category.value !== "all") return found.length ? [{
      key: "found" as const,
      label: words.value.length ? `${found.length} found` : categories.value.find(([k]) => k === category.value)?.[1] ?? "",
      items: found
    }] : [];
    const out: Section[] = [];
    const recent = picker.value.recent.map(n => byName.get(n)).filter((e): e is StickerPickerItem => !!e);
    if (recent.length) out.push({
      key: "recent" as const,
      label: "Recent" as const,
      items: recent
    });
    for (const [key, label] of categories.value) out.push({
      key,
      label,
      items: picker.value.catalog.filter(e => e.category === key)
    });
    return out;
  });
  const progressive = computed(() => words.value.length === 0 && category.value === "all");
  const shown = shallowRef(initialState(2));
  const setShown = stateSetter(shown);
  watchDependencies(() => {
    if (!progressive.value || shown.value >= everything.value.length) return;
    const t = setTimeout(() => setShown(n => n + 1), 24);
    return () => clearTimeout(t);
  }, () => [progressive.value, shown.value, everything.value.length], false);
  const sections = computed(() => progressive.value ? everything.value.slice(0, shown.value) : everything.value);
  const total = computed(() => everything.value.reduce((n, s) => n + s.items.length, 0));
  const keyOf = computed(() => (s: Section, e: StickerPickerItem) => `${s.key}:${e.name}`);
  const flat = computed(() => sections.value.flatMap((s, si) => s.items.map((e, i) => ({
    s: si,
    i,
    e,
    key: keyOf.value(s, e)
  }))));
  const current = computed(() => flat.value.find(f => f.key === activeKey.value) ?? flat.value[0] ?? null);
  const optionId = computed(() => (key: string) => `${listId.value}-${key.replace(/[^a-zA-Z0-9-]/g, "_")}`);
  watchDependencies(() => {
    if (!current.value) return;
    document.getElementById(optionId.value(current.value.key))?.scrollIntoView?.({
      block: "nearest" as const
    });
  }, () => [current.value?.key], false);
  const goTo = computed(() => (target: {
    s: number;
    i: number;
  } | null) => {
    if (!target) return;
    const f = flat.value.find(x => x.s === target.s && x.i === target.i);
    if (f) setActiveKey(f.key);
  });
  const keys = computed(() => (e: KeyboardEvent) => {
    const el = e.currentTarget as HTMLInputElement;
    const k = e.key;
    if (k === "Enter") {
      if (current.value && !e.isComposing) {
        e.preventDefault();
        picker.value.choose(current.value.e);
      }
      return;
    }
    if (!current.value) return;
    const at = {
      s: current.value.s,
      i: current.value.i
    };
    if (k === "ArrowUp" || k === "ArrowDown") {
      e.preventDefault();
      goTo.value(neighbour(sections.value, at, k, columns.value));
    } else if (k === "ArrowLeft" || k === "ArrowRight") {
      const rtl = getComputedStyle(el).direction === "rtl";
      const forward = k === "ArrowRight" !== rtl;
      const caretFree = el.value === "" || (forward ? el.selectionStart === el.value.length : el.selectionEnd === 0);
      if (!caretFree) return;
      e.preventDefault();
      goTo.value(neighbour(sections.value, at, forward ? "ArrowRight" as const : "ArrowLeft" as const, columns.value));
    } else if ((k === "Home" || k === "End") && el.value === "") {
      e.preventDefault();
      const f = k === "Home" ? flat.value[0] : flat.value[flat.value.length - 1];
      if (f) setActiveKey(f.key);
    }
  });
  const count = computed(() => flat.value.length);
  return () => {
    return <>
      <Input ref={input} type="text" role="combobox" aria-label="Search stickers" aria-expanded={count.value > 0} aria-controls={listId.value} aria-autocomplete="list" aria-activedescendant={current.value ? optionId.value(current.value.key) : undefined} autocomplete="off" spellcheck={false} placeholder={placeholder.value} value={query.value} onChange={(e: Event) => {
        setQuery((e.target as HTMLInputElement).value);
        setActiveKey(null);
      }} onKeydown={keys.value} class="w-full" />
      {categories.value.length > 1 ? <div data-slot="sticker-picker-categories" role="group" aria-label="Categories" class="-mx-1 mt-2 flex gap-1 overflow-x-auto px-1 pb-1 [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent)] rtl:[mask-image:linear-gradient(to_left,black_calc(100%-28px),transparent)]">
          {[["all", "All"] as const, ...categories.value].map(([key, label]) => <button key={key} type="button" aria-pressed={category.value === key} onClick={() => {
          setCategory(key);
          setActiveKey(null);
          input.value?.focus();
        }} class={cn("inline-flex min-h-6 shrink-0 items-center px-2 font-hand text-sm font-bold whitespace-nowrap text-muted-foreground transition-colors duration-(--ll-dur-hover)", "hover:text-foreground aria-pressed:ll-swipe aria-pressed:text-foreground focus-visible:ll-swipe forced-colors:aria-pressed:underline")}>
              {label}
            </button>)}
        </div> : null}
      <div ref={list} id={listId.value} role="listbox" aria-label="Stickers" data-slot="sticker-picker-list" hidden={count.value === 0} class="mt-2 max-h-64 min-h-24 overflow-y-auto overscroll-contain pe-1">
        {sections.value.map(s => <div key={s.key} role="group" aria-labelledby={`${listId.value}-h-${s.key}`} class="mb-1.5 last:mb-0">
            <div id={`${listId.value}-h-${s.key}`} aria-hidden="true" class="px-1 pt-1 pb-0.5 font-script text-lg leading-none text-muted-foreground">
              {s.label}
            </div>
            <div class="grid gap-0.5" style={cssStyle({
            gridTemplateColumns: `repeat(${columns.value}, minmax(0, 1fr))`
          })}>
              {s.items.map(e => {
              const key = keyOf.value(s, e);
              return <Option key={key} entry={e} id={optionId.value(key)} active={current.value?.key === key} selected={picker.value.value === e.name} size={size.value} scope={`${picker.value.uid}${s.key}`} onActivate={() => setActiveKey(key)} onChoose={() => picker.value.choose(e)} />;
            })}
            </div>
          </div>)}
      </div>
      {count.value === 0 ? <div data-slot="sticker-picker-empty" class="mt-2 grid min-h-24 place-items-center gap-1 px-2 py-5 text-center">
          <Mascot pose="search" size={64} />
          <p class="font-script text-xl leading-tight text-muted-foreground">{query.value.trim() ? <>Nothing looks like &ldquo;{query.value.trim()}&rdquo;.</> : "No stickers to choose from." as const}</p>
        </div> : null}
      <div class="mt-2 flex min-h-6 items-baseline justify-between gap-2 border-t border-dashed border-pencil-mark/60 pt-1.5" aria-hidden="true">
        <span class="truncate font-script text-xl leading-none text-foreground">{current.value?.e.label ?? ""}</span>
        <span class="shrink-0 text-xs text-muted-foreground">{current.value ? current.value.e.categoryLabel : "" as const}</span>
      </div>
      <span role="status" class="sr-only">
        {total.value === 0 ? "No stickers found." as const : `${total.value} ${total.value === 1 ? "sticker" as const : "stickers" as const}.`}
      </span>
    </>;
  };
});
interface OptionProps {
  entry: StickerPickerItem;
  id: string;
  active: boolean;
  selected: boolean;
  size: number;
  scope: string;
  onActivate(): void;
  onChoose(): void;
}
const Option = defineUi<OptionProps>("Option", ["entry", "id", "active", "selected", "size", "scope", "onActivate", "onChoose"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const id = computed(() => _props["id"]);
  const active = computed(() => _props["active"]);
  const selected = computed(() => _props["selected"]);
  const size = computed(() => _props["size"]);
  const scope = computed(() => _props["scope"]);
  const onActivate = computed(() => _props["onActivate"]);
  const onChoose = computed(() => _props["onChoose"]);
  const face = computed(() => stickerFace(entry.value.name, size.value, entry.value.name, {
    peel: active.value ? true : undefined,
    idPrefix: `ll-sp${scope.value}${entry.value.name}`.replace(/[^a-zA-Z0-9-]/g, "")
  }));
  return () => {
    if (!face.value) return null;
    const cell = size.value + 12;
    return <div id={id.value} role="option" aria-selected={selected.value} aria-label={entry.value.label} data-slot="sticker-picker-option" data-active={active.value ? "" as const : undefined} data-selected={selected.value ? "" as const : undefined} onPointermove={() => !active.value && onActivate.value()} onMousedown={(e: MouseEvent) => e.preventDefault()} onClick={onChoose.value} class="group/option relative flex cursor-pointer items-center justify-center data-active:ll-swipe" style={cssStyle({
      height: cell
    })}>
      <svg data-ink="sticker" aria-hidden="true" focusable="false" viewBox={`0 0 ${face.value.w} ${face.value.h}`} width={face.value.w} height={face.value.h} class="pointer-events-none block overflow-visible transition-[scale,rotate] duration-(--ll-dur-hover) ease-(--ll-ease-settle) group-data-active/option:-rotate-3 group-data-active/option:scale-110 group-data-active/option:ll-drop-sticker" innerHTML={face.value.svg} />
      {selected.value ? <Icon name="check" size={14} class="pointer-events-none absolute end-0.5 top-0.5 text-foreground" /> : null}
    </div>;
  };
});
export { StickerPicker, StickerPickerTrigger, StickerPickerContent, useStickerPicker };
export type { StickerPickerProps, StickerPickerContentProps, StickerPickerItem, StickerPickerInput };
