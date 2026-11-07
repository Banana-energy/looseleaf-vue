// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter } from "vue";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCatalog } from "../core/catalog-context";
import { navigate, useLocation } from "../core/router";
import { hrefFor, parseHash } from "../core/router-core";
import { buildSearchIndex, search, suggestions, type SearchResult } from "../core/search";
import { Kbd } from "../kit";
import { useLocaleText } from "../core/settings";
export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}
export function highlight(text: string, positions: readonly number[]): UI.VueNode {
  if (positions.length === 0) return text;
  const marked = new Set(positions);
  const out: UI.VueNode[] = [];
  let run = "";
  let inMark = false;
  const flush = () => {
    if (!run) return;
    out.push(inMark ? <mark key={out.length} class="bg-transparent px-0 font-bold underline decoration-marker decoration-2 underline-offset-2">
          {run}
        </mark> : run);
    run = "";
  };
  for (let i = 0; i < text.length; i++) {
    const isMarked = marked.has(i);
    if (isMarked !== inMark) {
      flush();
      inMark = isMarked;
    }
    run += text[i];
  }
  flush();
  return out;
}
export const CommandPalette = defineUi<CommandPaletteProps>("CommandPalette", ["open", "onClose"], (_props, {
  slots: _slots
}) => {
  const open = computed(() => _props["open"]);
  const onClose = computed(() => _props["onClose"]);
  const opener = shallowRef<Element | null | null>(null);
  const chosen = shallowRef(false);
  const text = useLocaleText();
  return () => {
    return <Dialog open={open.value} onOpenChange={next => !next && onClose.value()}>
      <DialogContent stock="napkin" showCloseButton={false} onOpenAutoFocus={() => {
        opener.value = document.activeElement;
        chosen.value = false;
      }} onCloseAutoFocus={event => {
        event.preventDefault();
        const el = opener.value;
        opener.value = null;
        if (chosen.value) return;
        if (el instanceof HTMLElement && el !== document.body && el.isConnected) el.focus({
          preventScroll: true
        });
      }} class="dk-palette-dialog mt-[12dvh] mb-auto max-w-xl gap-0 p-3 compact:p-2.5 calm:p-2 max-sm:mt-2 max-sm:mb-auto">
        <DialogHeader class="sr-only">
          <DialogTitle>{text.value.t("search.dialogTitle")}</DialogTitle>
          <DialogDescription>{text.value.t("search.dialogDescription")}</DialogDescription>
        </DialogHeader>
        <Command sheet={false} shouldFilter={false} loop label="Search components, parts and topics">
          <PaletteBody onChoose={movesFocus => {
            chosen.value = movesFocus;
            onClose.value();
          }} />
        </Command>
      </DialogContent>
    </Dialog>;
  };
});
function useFreshActiveDescendant(_source0: MaybeRefOrGetter<string>) {
  const key = computed(() => toValue(_source0));
  watchDependencies(() => {
    const frame = requestAnimationFrame(() => {
      const input = document.querySelector("[cmdk-input]");
      const selected = document.querySelector('[cmdk-item][aria-selected="true"]');
      if (!input) return;
      if (selected?.id) input.setAttribute("aria-activedescendant", selected.id);else input.removeAttribute("aria-activedescendant");
    });
    return () => cancelAnimationFrame(frame);
  }, () => [key.value], false);
  return computed(() => {});
}
const PaletteBody = defineUi<{
  onChoose: (movesFocus: boolean) => void;
}>("PaletteBody", ["onChoose"], (_props, {
  slots: _slots
}) => {
  const onChoose = computed(() => _props["onChoose"]);
  const text = useLocaleText();
  const catalog = useCatalog();
  const location = useLocation();
  const index = computed(() => buildSearchIndex(catalog.value));
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const trimmed = computed(() => query.value.trim());
  const results = computed(() => trimmed.value ? search(index.value, trimmed.value) : suggestions(index.value));
  useFreshActiveDescendant(() => trimmed.value);
  const go = computed(() => (result: SearchResult) => {
    const target = parseHash(hrefFor(result.entry.to));
    onChoose.value(target.path !== location.value.path || target.anchor !== "");
    navigate(result.entry.to);
  });
  return () => {
    return <>
      <CommandInput placeholder={text.value.t("search.placeholder")} value={query.value} onValueChange={setQuery} />
      <CommandList label={trimmed.value ? text.value.t("search.results") : text.value.t("search.suggestions")} class="max-h-[min(24rem,55dvh)]">
        <CommandEmpty>{`${text.value.t("search.empty")} "${trimmed.value}". ${text.value.t("search.tryAgain")}`}</CommandEmpty>
        <CommandGroup heading={trimmed.value ? text.value.t("search.results") : text.value.t("search.suggestions")}>
          {results.value.map(result => <CommandItem key={result.entry.id} value={result.entry.id} onSelect={() => go.value(result)} class="items-baseline gap-3">
              <span class="flex min-w-0 flex-1 flex-col">
                <span class="dk-palette-title truncate font-bold">{highlight(result.entry.title, result.titlePositions)}</span>
                <span class="dk-palette-sub truncate text-sm font-normal text-ink-muted">{result.entry.subtitle}</span>
              </span>
              <span class="dk-palette-group shrink-0 font-type text-xs text-ink-muted">{result.entry.group}</span>
            </CommandItem>)}
        </CommandGroup>
      </CommandList>
      <p class="dk-palette-foot flex flex-wrap max-sm:hidden items-center gap-x-4 gap-y-1 px-3 pt-2 pb-1 text-sm text-ink-muted" aria-hidden="true">
        <span class="inline-flex items-center gap-1">
          <Kbd>↑</Kbd> <Kbd>↓</Kbd> {text.value.t("search.move")}
        </span>
        <span class="inline-flex items-center gap-1">
          <Kbd>↵</Kbd> {text.value.t("search.open")}
        </span>
        <span class="inline-flex items-center gap-1">
          <Kbd>esc</Kbd> {text.value.t("search.close")}
        </span>
      </p>
    </>;
  };
});
