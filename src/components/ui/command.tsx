// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter } from "vue";
import { createPortal } from "@/lib/vnode";
import { Command as CommandPrimitive, useCommandState } from "@/lib/command-primitive";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import { Mascot } from "@/components/ui/mascot";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { commandInputRecipe } from "@/lib/ink/recipes/command-ink";
import { cn } from "@/lib/utils";
type CommandSheet = Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "tapeKind" | "shadow" | "seed">;
const NESTED = "[[data-slot=popover-content]_&]:before:hidden [[data-slot=dialog-content]_&]:before:hidden [[data-slot=sheet-content]_&]:before:hidden [[data-slot=drawer-content]_&]:before:hidden [[data-slot=hover-card-content]_&]:before:hidden [[data-slot=select-content]_&]:before:hidden [[data-slot=card]_&]:before:hidden [[data-slot=dropdown-menu-content]_&]:before:hidden [[data-slot=dropdown-menu-sub-content]_&]:before:hidden [[data-slot=context-menu-content]_&]:before:hidden [[data-slot=context-menu-sub-content]_&]:before:hidden [[data-slot=menubar-content]_&]:before:hidden [[data-slot=menubar-sub-content]_&]:before:hidden";
const Command = defineUi<UI.ComponentProps<typeof CommandPrimitive> & {
  sheet?: boolean | CommandSheet;
}>("Command", ["class", "sheet"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const sheet = computed(() => _props["sheet"] === undefined ? true : _props["sheet"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "sheet", "children"]));
  const paper = computed<CommandSheet>(() => typeof sheet.value === "object" ? sheet.value : {});
  return () => {
    return <CommandPrimitive data-slot="command" class={cn("flex h-full w-full flex-col text-popover-foreground", className.value)} {...domProps(props.value)}>
      {sheet.value ? <Paper data-slot="command-sheet" stock="slip" edge="cut" tilt={false} rules="none" shadow="lift" {...domProps(paper.value)} class={cn("flex h-full w-full flex-col", NESTED)}>
          {readSlot(_slots.default)}
        </Paper> : readSlot(_slots.default)}
    </CommandPrimitive>;
  };
});
const CommandDialog = defineUi<UI.ComponentProps<typeof Dialog> & Pick<PaperProps, "stock" | "edge" | "tape" | "tilt" | "seed"> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  commandProps?: Omit<UI.ComponentProps<typeof Command>, "children">;
}>("CommandDialog", ["title", "description", "class", "showCloseButton", "stock", "edge", "tape", "tilt", "seed", "commandProps"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"] === undefined ? "Command Palette" as const : _props["title"]);
  const description = computed(() => _props["description"] === undefined ? "Search for a command to run..." as const : _props["description"]);
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  const showCloseButton = computed(() => _props["showCloseButton"] === undefined ? false : _props["showCloseButton"]);
  const stock = computed(() => _props["stock"] === undefined ? "napkin" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tape = computed(() => _props["tape"]);
  const tilt = computed(() => _props["tilt"]);
  const seed = computed(() => _props["seed"]);
  const commandProps = computed(() => _props["commandProps"]);
  const props = computed(() => omitProps(_props, ["title", "description", "children", "class", "showCloseButton", "stock", "edge", "tape", "tilt", "seed", "commandProps"]));
  const opener = shallowRef<Element | null | null>(null);
  return () => {
    return <Dialog {...domProps(props.value)}>
      <DialogContent stock={stock.value} edge={edge.value} tape={tape.value} tilt={tilt.value} seed={seed.value} showCloseButton={showCloseButton.value} onOpenAutoFocus={() => {
        opener.value = document.activeElement;
      }} onCloseAutoFocus={() => {
        const el = opener.value;
        opener.value = null;
        const active = document.activeElement;
        const moved = active !== null && active !== document.body && active !== el;
        if (!moved && el instanceof HTMLElement && el !== document.body && el.isConnected) el.focus({
          preventScroll: true
        });
      }} class={cn("mt-[12dvh] mb-auto max-w-lg gap-0 p-3 max-sm:mt-2 compact:p-2.5 calm:p-2", className.value)}>
        <DialogHeader class="sr-only">
          <DialogTitle>{title.value}</DialogTitle>
          <DialogDescription>{description.value}</DialogDescription>
        </DialogHeader>
        <Command sheet={false} {...domProps(commandProps.value)}>
          {readSlot(_slots.default)}
        </Command>
      </DialogContent>
    </Dialog>;
  };
});
const defaultResultsLabel = (count: number): string => count === 0 ? "No results" as const : count === 1 ? "1 result" as const : `${count} results`;
const ResultsAnnouncer = defineUi<{
  label: (count: number) => string;
}>("ResultsAnnouncer", ["label"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const _nestedHook0 = useCommandState(() => s => s.search);
  const search = computed(() => _nestedHook0.value as string);
  const _nestedHook1 = useCommandState(() => s => s.filtered.count);
  const count = computed(() => _nestedHook1.value as number);
  return () => {
    return <span role="status" aria-live="polite" class="sr-only">
      {search.value ? label.value(count.value) : "" as const}
    </span>;
  };
});
function useFreshActiveDescendant(_source0: MaybeRefOrGetter<UI.RefObject<HTMLInputElement | null>>) {
  const input = computed(() => toValue(_source0));
  const _nestedHook0 = useCommandState(() => s => s.search);
  const search = computed(() => _nestedHook0.value as string);
  const _nestedHook1 = useCommandState(() => s => s.value);
  const value = computed(() => _nestedHook1.value as string);
  const _nestedHook2 = useCommandState(() => s => s.filtered.count);
  const count = computed(() => _nestedHook2.value as number);
  const _nestedHook3 = useCommandState(() => s => s.selectedItemId);
  const recorded = computed(() => _nestedHook3.value as string | undefined);
  watchDependencies(() => {
    const el = input.value.value;
    if (!el) return;
    const list = el.ownerDocument.getElementById(el.getAttribute("aria-controls") ?? "");
    const row = list?.querySelector<HTMLElement>('[cmdk-item][aria-selected="true"]');
    if (row?.id) {
      if (el.getAttribute("aria-activedescendant") !== row.id) el.setAttribute("aria-activedescendant", row.id);
    } else el.removeAttribute("aria-activedescendant");
  }, () => [input.value, search.value, value.value, count.value, recorded.value], true);
  return computed(() => {});
}
const ActiveDescendant = defineUi<{
  input: UI.RefObject<HTMLInputElement | null>;
}>("ActiveDescendant", ["input"], (_props, {
  slots: _slots
}) => {
  const input = computed(() => _props["input"]);
  useFreshActiveDescendant(() => input.value);
  return () => {
    return null;
  };
});
const CommandInput = defineUi<UI.ComponentProps<typeof CommandPrimitive.Input> & {
  wrapperClassName?: string;
  seed?: string | number;
  resultsLabel?: (count: number) => string;
}>("CommandInput", ["class", "wrapperClassName", "seed", "resultsLabel"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const wrapperClassName = computed(() => _props["wrapperClassName"]);
  const seed = computed(() => _props["seed"]);
  const resultsLabel = computed(() => _props["resultsLabel"] === undefined ? defaultResultsLabel : _props["resultsLabel"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "wrapperClassName", "seed", "resultsLabel", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: commandInputRecipe,
    params: {},
    kind: "rule" as const,
    seed: seed.value,
    still: true
  }));
  const inputRef = shallowRef<HTMLInputElement | null | null>(null);
  return () => {
    return <div data-slot="command-input-wrapper" data-ink-focus="within" ref={hostRef} {...domProps(hostProps.value)} class={cn("relative isolate flex h-12 items-center gap-2 px-3 text-(--ll-input-ink) compact:h-10 calm:h-9", wrapperClassName.value)}>
      {node.value}
      <Icon name="search" size={18} class="shrink-0 text-ink-soft" />
      <CommandPrimitive.Input data-slot="command-input" ref={useMergedRef<HTMLInputElement>(inputRef, ref.value)} class={cn("flex h-10 w-full bg-transparent py-3 font-hand text-base caret-(--ll-caret) outline-hidden placeholder:text-(--ll-placeholder) disabled:cursor-not-allowed disabled:text-pencil-text calm:text-[15px]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</CommandPrimitive.Input>
      <ActiveDescendant input={inputRef} />
      <ResultsAnnouncer label={resultsLabel.value} />
    </div>;
  };
});
const StatusSlotContext = createContext<HTMLElement | null>(null);
const CommandList = defineUi<UI.ComponentProps<typeof CommandPrimitive.List>>("CommandList", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const slot = shallowRef<HTMLElement | null>(initialState(null));
  const setSlot = stateSetter(slot);
  return () => {
    return <StatusSlotContext.Provider value={slot.value}>
      <CommandPrimitive.List data-slot="command-list" class={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</CommandPrimitive.List>
      <div data-slot="command-status" ref={setSlot} />
    </StatusSlotContext.Provider>;
  };
});
const CommandEmpty = defineUi<UI.ComponentProps<typeof CommandPrimitive.Empty> & {
  mascot?: boolean;
}>("CommandEmpty", ["class", "mascot"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const mascot = computed(() => _props["mascot"] === undefined ? true : _props["mascot"]);
  const props = computed(() => omitProps(_props, ["class", "children", "mascot"]));
  const slot = useContext(StatusSlotContext);
  const node = renderValue(() => <CommandPrimitive.Empty data-slot="command-empty" class={cn("grid justify-items-center gap-1 px-4 py-5 text-center font-script text-xl leading-tight text-ink-muted", className.value)} {...domProps(props.value)}>
      {mascot.value && <Mascot pose="search" size={64} />}
      <span>{children.value}</span>
    </CommandPrimitive.Empty>);
  return () => {
    return slot.value ? createPortal(node.value, slot.value) : node.value;
  };
});
const CommandLoading = defineUi<UI.ComponentProps<typeof CommandPrimitive.Loading>>("CommandLoading", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const slot = useContext(StatusSlotContext);
  const node = renderValue(() => <CommandPrimitive.Loading data-slot="command-loading" class={cn("flex items-center justify-center gap-2 px-4 py-4 font-hand text-sm text-ink-muted", className.value)} {...domProps(props.value)}>
      <Spinner variant="loops" size={14} />
      <span>{children.value}</span>
    </CommandPrimitive.Loading>);
  return () => {
    return slot.value ? createPortal(node.value, slot.value) : node.value;
  };
});
const CommandGroup = defineUi<UI.ComponentProps<typeof CommandPrimitive.Group>>("CommandGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <CommandPrimitive.Group data-slot="command-group" class={cn("p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-type [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-ink-muted", className.value)} {...domProps(props.value)}>{_slots.default?.()}</CommandPrimitive.Group>;
  };
});
const CommandSeparator = defineUi<UI.ComponentProps<typeof CommandPrimitive.Separator>>("CommandSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <CommandPrimitive.Separator asChild {...domProps(props.value)}>
      <Separator role="none" data-slot="command-separator" class={cn("pointer-events-none -mx-1 my-1 w-auto", className.value)} />
    </CommandPrimitive.Separator>;
  };
});
const CommandItem = defineUi<UI.ComponentProps<typeof CommandPrimitive.Item>>("CommandItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <CommandPrimitive.Item data-slot="command-item" class={cn("relative flex min-h-9 cursor-default items-center gap-2 px-2 py-1.5 font-hand text-base outline-hidden select-none compact:min-h-8 calm:min-h-7 calm:py-1 calm:text-[15px]", "data-[selected=true]:ll-swipe data-[disabled=true]:pointer-events-none data-[disabled=true]:text-pencil-text", "forced-colors:data-[selected=true]:bg-[color:Highlight]! forced-colors:data-[selected=true]:text-[color:HighlightText]! forced-colors:data-[selected=true]:[&_svg]:text-[color:HighlightText]!", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(.absolute):not([class*='size-'])]:size-4 [&_svg:not(.absolute):not([class*='text-'])]:text-ink-soft", className.value)} {...domProps(props.value)}>{_slots.default?.()}</CommandPrimitive.Item>;
  };
});
const CommandShortcut = defineUi<UI.ComponentProps<"span">>("CommandShortcut", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <span data-slot="command-shortcut" class={cn("ms-auto inline-flex items-center gap-1 text-xs text-muted-foreground", className.value)} {...domProps(props.value)}>
      {typeof readSlot(_slots.default) === "string" ? <Kbd>{readSlot(_slots.default)}</Kbd> : readSlot(_slots.default)}
    </span>;
  };
});
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandLoading, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, useCommandState, useFreshActiveDescendant };
